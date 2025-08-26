// src/pages/Survey.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type SurveyUser = {
  id: string;                // UUID
  email: string | null;
  full_name?: string | null;
  position?: string | null;  // หมายเหตุ: คอลัมน์ DB คือ "position" (ใส่ "" ใน SQL RPC แล้ว)
  organization?: string | null;
  phone?: string | null;
  province?: string | null;
};

type SurveyResponse = {
  id: string;                // UUID
  user_id: string;           // UUID (อ้างถึง survey_users.id)
  status: "draft" | "submitted";
  answers: Record<string, any> | null;
  created_at?: string | null;
  updated_at?: string | null;
  submitted_at?: string | null;
};

const nowISO = () => new Date().toISOString();

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<SurveyUser | null>(null);
  const [resp, setResp] = useState<SurveyResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const uidLS = useMemo(() => (localStorage.getItem("survey_user_id") || "").trim(), []);
  const emailLS = useMemo(() => (localStorage.getItem("survey_email") || "").trim().toLowerCase(), []);

  const autosaveTimer = useRef<number | null>(null);
  const dirtyRef = useRef(false);

  // ---------- Guards ----------
  useEffect(() => {
    if (!uidLS && !emailLS) {
      navigate("/login");
    }
  }, [uidLS, emailLS, navigate]);

  // ---------- Core loaders ----------
  const loadProfileById = async (uid: string): Promise<SurveyUser | null> => {
    const { data, error } = await supabase.rpc("get_survey_user", { p_id: uid });
    if (error) throw error;
    return (data && data[0]) || null;
  };

  const loadProfileByEmail = async (email: string): Promise<SurveyUser | null> => {
    const { data, error } = await supabase.rpc("get_survey_user_by_email", { p_email: email });
    if (error) throw error;
    return (data && data[0]) || null;
  };

  const loadOrCreateDraft = async (uid: string) => {
    const { data: existing, error: exErr } = await supabase
      .from("survey_responses")
      .select("id,user_id,status,answers,created_at,updated_at,submitted_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (exErr) throw exErr;

    if (existing) {
      setResp(existing as SurveyResponse);
      setAnswers((existing as SurveyResponse).answers ?? {});
      return;
    }

    // create new draft
    const payload = {
      user_id: uid,
      status: "draft" as const,
      answers: {},
      created_at: nowISO(),
      updated_at: nowISO(),
    };
    const { data: created, error: insErr } = await supabase
      .from("survey_responses")
      .insert([payload])
      .select("id,user_id,status,answers,created_at,updated_at,submitted_at")
      .single();
    if (insErr) throw insErr;
    setResp(created as SurveyResponse);
    setAnswers({});
  };

  // ---------- Bootstrap with self-heal logic ----------
  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!uidLS && !emailLS) return;

        // 1) พยายามโหลดโปรไฟล์จาก id ใน localStorage ก่อน
        let effectiveUid = uidLS;
        let profile: SurveyUser | null = null;

        if (effectiveUid) {
          profile = await loadProfileById(effectiveUid);
        }

        // 2) ถ้าไม่เจอด้วย id → ลองจากอีเมลใน localStorage
        if (!profile && emailLS) {
          const byEmail = await loadProfileByEmail(emailLS);
          if (byEmail) {
            effectiveUid = byEmail.id;
            localStorage.setItem("survey_user_id", byEmail.id);
            if (!localStorage.getItem("survey_email")) {
              localStorage.setItem("survey_email", (byEmail.email || emailLS));
            }
            profile = byEmail;
          }
        }

        // 3) ถ้ายังไม่เจอ → sync (กรณี auth/users มีแต่ survey_users ไม่มี) แล้วดึงใหม่
        if (!profile && emailLS) {
          const { data: syncRows, error: syncErr } = await supabase.rpc("email_only_login_sync", { p_email: emailLS });
          if (syncErr) throw syncErr;

          const row = syncRows?.[0];
          if (row?.survey_user_id) {
            effectiveUid = String(row.survey_user_id);
            localStorage.setItem("survey_user_id", effectiveUid);
            localStorage.setItem("survey_email", row.email || emailLS);

            profile = await loadProfileById(effectiveUid);
          }
        }

        if (!profile || !effectiveUid) {
          toast({
            title: "ไม่พบโปรไฟล์ผู้ใช้",
            description: "โปรดเข้าสู่ระบบใหม่",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        setUser(profile);

        // 4) โหลด/สร้าง draft ตาม user id ล่าสุด (effectiveUid)
        await loadOrCreateDraft(effectiveUid);
      } catch (err: any) {
        toast({
          title: "เกิดข้อผิดพลาดในการโหลดแบบสอบถาม",
          description: err?.message || "กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uidLS, emailLS]);

  // ---------- Answer handlers ----------
  const requestSave = () => {
    dirtyRef.current = true;
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }
    autosaveTimer.current = window.setTimeout(() => {
      handleSave(true);
    }, 800) as unknown as number;
  };

  const handleChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    requestSave();
  };

  const handleSave = async (silent = false) => {
    if (!resp?.id) return;
    if (!dirtyRef.current && silent) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .update({
          answers,
          status: "draft",
          updated_at: nowISO(),
        })
        .eq("id", resp.id)
        .select("id,user_id,status,answers,updated_at")
        .single();

      if (error) throw error;
      setResp((prev) => (prev ? { ...prev, ...data } : (data as any)));
      dirtyRef.current = false;
      if (!silent) {
        toast({ title: "บันทึกสำเร็จ", description: "แบบร่างของคุณถูกบันทึกแล้ว" });
      }
    } catch (err: any) {
      toast({
        title: "บันทึกไม่สำเร็จ",
        description: err?.message || "กรุณาลองใหม่",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!resp?.id) return;
    setSubmitting(true);
    try {
      if (dirtyRef.current) {
        await handleSave(true);
      }
      const { data, error } = await supabase
        .from("survey_responses")
        .update({
          answers,
          status: "submitted",
          submitted_at: nowISO(),
          updated_at: nowISO(),
        })
        .eq("id", resp.id)
        .select("id,user_id,status,submitted_at")
        .single();

      if (error) throw error;
      setResp((prev) => (prev ? { ...prev, ...data } : (data as any)));
      toast({ title: "ส่งแบบสอบถามสำเร็จ", description: "ขอบคุณสำหรับการตอบแบบสอบถาม" });
    } catch (err: any) {
      toast({
        title: "ส่งแบบสอบถามไม่สำเร็จ",
        description: err?.message || "กรุณาลองใหม่",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
    } finally {
      localStorage.removeItem("survey_email");
      localStorage.removeItem("survey_user_id");
      navigate("/login");
    }
  };

  const disabled = resp?.status === "submitted";

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>กำลังโหลดแบบสอบถาม...</p>
      </div>
    );
  }

  if (!user || !resp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>ไม่พบข้อมูล</CardTitle>
            <CardDescription>กรุณาลองเข้าสู่ระบบใหม่</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")}>กลับไปหน้าเข้าสู่ระบบ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">แบบสอบถาม SROI</h1>
            <p className="text-sm text-muted-foreground">
              ผู้ตอบ: <span className="font-medium">{user.full_name || "-"}</span>{" "}
              <span className="text-muted-foreground">({user.email || emailLS || "-"})</span>
            </p>
            {resp.status === "submitted" ? (
              <Badge variant="secondary" className="mt-2">ส่งแล้ว</Badge>
            ) : (
              <Badge className="mt-2">แบบร่าง</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleSave} disabled={saving || disabled}>
              {saving ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
            </Button>
            <Button onClick={handleSubmit} disabled={disabled || submitting}>
              {submitting ? "กำลังส่ง..." : "ส่งแบบสอบถาม"}
            </Button>
            <Button variant="outline" onClick={handleLogout}>ออกจากระบบ</Button>
          </div>
        </div>

        <Separator />

        {/* ข้อมูลผู้ตอบ */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลผู้ตอบ</CardTitle>
            <CardDescription>ข้อมูลนี้ดึงจากโปรไฟล์ที่ลงทะเบียน</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>ชื่อ-นามสกุล</Label>
              <Input value={user.full_name || ""} readOnly />
            </div>
            <div>
              <Label>อีเมล</Label>
              <Input value={user.email || emailLS || ""} readOnly />
            </div>
            <div>
              <Label>ตำแหน่ง</Label>
              <Input value={user.position || ""} readOnly />
            </div>
            <div>
              <Label>หน่วยงาน/องค์กร</Label>
              <Input value={user.organization || ""} readOnly />
            </div>
            <div>
              <Label>เบอร์โทร</Label>
              <Input value={user.phone || ""} readOnly />
            </div>
            <div>
              <Label>จังหวัด</Label>
              <Input value={user.province || ""} readOnly />
            </div>
          </CardContent>
        </Card>

        {/* แบบสอบถาม: ตัวอย่างฟิลด์ */}
        <Card>
          <CardHeader>
            <CardTitle>ส่วนที่ 1: ข้อมูลโครงการ/กิจกรรม</CardTitle>
            <CardDescription>กรุณากรอกรายละเอียดให้ครบถ้วน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project_name">1. ชื่อโครงการ/กิจกรรม</Label>
              <Input
                id="project_name"
                placeholder="เช่น โครงการพัฒนาชุมชน..."
                value={answers.project_name || ""}
                onChange={(e) => handleChange("project_name", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_objective">2. วัตถุประสงค์</Label>
              <Textarea
                id="project_objective"
                placeholder="ระบุวัตถุประสงค์หลัก/รอง"
                value={answers.project_objective || ""}
                onChange={(e) => handleChange("project_objective", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_group">3. กลุ่มเป้าหมาย</Label>
              <Input
                id="target_group"
                placeholder="เช่น เยาวชนในชุมชน, ผู้สูงอายุ"
                value={answers.target_group || ""}
                onChange={(e) => handleChange("target_group", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activities">4. กิจกรรมหลัก</Label>
              <Textarea
                id="activities"
                placeholder="สรุปกิจกรรมหลัก ๆ ที่ดำเนินการ"
                value={answers.activities || ""}
                onChange={(e) => handleChange("activities", e.target.value)}
                disabled={disabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ส่วนที่ 2: ผลลัพธ์/ผลกระทบ</CardTitle>
            <CardDescription>อธิบายผลลัพธ์เชิงสังคม / ตัวชี้วัด</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outcomes">5. ผลลัพธ์ที่เกิดขึ้น</Label>
              <Textarea
                id="outcomes"
                placeholder="ผลลัพธ์ที่วัดได้/สังเกตได้"
                value={answers.outcomes || ""}
                onChange={(e) => handleChange("outcomes", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="indicators">6. ตัวชี้วัดความสำเร็จ</Label>
              <Textarea
                id="indicators"
                placeholder="เช่น จำนวนผู้เข้าร่วม, คะแนนความพึงพอใจ"
                value={answers.indicators || ""}
                onChange={(e) => handleChange("indicators", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessons">7. บทเรียนที่ได้</Label>
              <Textarea
                id="lessons"
                placeholder="มีอะไรที่ได้เรียนรู้/ควรปรับปรุง"
                value={answers.lessons || ""}
                onChange={(e) => handleChange("lessons", e.target.value)}
                disabled={disabled}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" onClick={() => handleSave()} disabled={saving || disabled}>
            {saving ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
          </Button>
          <Button onClick={handleSubmit} disabled={disabled || submitting}>
            {submitting ? "กำลังส่ง..." : "ส่งแบบสอบถาม"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
