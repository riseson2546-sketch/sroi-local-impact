// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // เข้าด้วยอีเมลอย่างเดียว
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ลงทะเบียน
  const [regFullName, setRegFullName]   = useState("");
  const [regPosition, setRegPosition]   = useState("");
  const [regOrg, setRegOrg]             = useState("");
  const [regPhone, setRegPhone]         = useState("");
  const [regProvince, setRegProvince]   = useState("");
  const [regEmail, setRegEmail]         = useState("");

  // เข้าสู่ระบบด้วยอีเมล (RPC)
  const handleEmailOnlyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const clean = email.trim().toLowerCase();
      if (!clean) return;

      const { data, error } = await supabase.rpc("email_only_login_sync", { p_email: clean });
      if (error) {
        if ((error as any)?.message?.includes("NO_AUTH")) {
          toast({ title: "ยังไม่มีบัญชีอีเมลนี้ในระบบผู้ใช้", description: "โปรดลงทะเบียนก่อน", variant: "destructive" });
          return;
        }
        throw error;
      }
      const row = data?.[0];
      if (!row?.survey_user_id) {
        toast({ title: "ซิงก์โปรไฟล์ไม่สำเร็จ", description: "ติดต่อผู้ดูแลระบบ", variant: "destructive" });
        return;
      }
      localStorage.setItem("survey_email", row.email);
      localStorage.setItem("survey_user_id", String(row.survey_user_id));
      navigate("/survey");
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err?.message || "ไม่สามารถเข้าสู่ระบบได้", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ลงทะเบียน (เรียก Edge Function)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        email: regEmail.trim().toLowerCase(),
        full_name: regFullName || null,
        position: regPosition || null,
        organization: regOrg || null,
        phone: regPhone || null,
        province: regProvince || null,
      };
      if (!payload.email) {
        toast({ title: "กรอกอีเมล", description: "โปรดกรอกอีเมลให้ถูกต้อง", variant: "destructive" });
        return;
      }

      const { data, error } = await supabase.functions.invoke("register_email_only", { body: payload });
      if (error) throw error;

      localStorage.setItem("survey_email", data.email);
      localStorage.setItem("survey_user_id", String(data.survey_user_id));
      toast({ title: "ลงทะเบียนสำเร็จ", description: "เข้าสู่แบบสอบถามได้เลย" });
      navigate("/survey");
    } catch (err: any) {
      toast({ title: "ลงทะเบียนไม่สำเร็จ", description: err?.message || "กรุณาลองใหม่อีกครั้ง", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">แบบสอบถาม SROI</CardTitle>
          <CardDescription>เข้าสู่ระบบด้วยอีเมล หรือ ลงทะเบียนแบบไม่ใช้รหัสผ่าน</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="email">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register">ลงทะเบียน</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailOnlyLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login_email">อีเมล</Label>
                  <Input id="login_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <p className="text-xs text-muted-foreground">
                    ระบบจะตรวจใน <b>auth.users</b> และซิงก์เข้า <b>survey_users</b> ให้โดยอัตโนมัติ
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "กำลังตรวจสอบ..." : "เข้าทำแบบสอบถาม"}
                </Button>
              </form>
              <div className="text-center text-sm text-muted-foreground">
                ผู้ดูแลระบบ? <a className="underline cursor-pointer" onClick={() => navigate("/admin-login")}>ไปยังระบบผู้ดูแล</a>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-2"><Label>ชื่อ-นามสกุล</Label>
                  <Input value={regFullName} onChange={(e) => setRegFullName(e.target.value)} required />
                </div>
                <div className="space-y-2"><Label>ตำแหน่ง</Label>
                  <Input value={regPosition} onChange={(e) => setRegPosition(e.target.value)} />
                </div>
                <div className="space-y-2"><Label>หน่วยงาน/องค์กร</Label>
                  <Input value={regOrg} onChange={(e) => setRegOrg(e.target.value)} />
                </div>
                <div className="space-y-2"><Label>เบอร์โทร</Label>
                  <Input value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                </div>
                <div className="space-y-2"><Label>จังหวัด</Label>
                  <Input value={regProvince} onChange={(e) => setRegProvince(e.target.value)} />
                </div>
                <div className="space-y-2"><Label>อีเมล</Label>
                  <Input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <p className="text-xs text-muted-foreground">ระบบจะสร้างบัญชีใน <b>auth.users</b> (ไม่ต้องตั้งรหัสผ่าน) และบันทึกโปรไฟล์ใน <b>survey_users</b></p>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียนและเริ่มตอบแบบสอบถาม"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
