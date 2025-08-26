// src/pages/Survey.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// ฟอร์ม/ส่วนประกอบเดิมของคุณ
import SurveyHeader from '@/components/survey/SurveyHeader';
import Section1 from '@/components/survey/Section1';
import Section2 from '@/components/survey/Section2';
import Section3 from '@/components/survey/Section3';

type SurveyUser = {
  id: number;
  email: string;
  auth_user_id?: string | null;
  full_name?: string | null;
};

type SurveyResponse = {
  id?: number;
  user_id: number;
  status?: 'draft' | 'submitted';
  created_at?: string;
  updated_at?: string;
  submitted_at?: string | null;
  // หมายเหตุ: ไม่ระบุทุกฟิลด์ เพื่อให้ยืดหยุ่นกับฟอร์มของคุณ
  // ส่วนที่เหลือจะมาจาก formData (Section1/2/3 เซ็ตคีย์อะไร ก็จะ upsert คีย์นั้น)
  [k: string]: any;
};

const Survey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // การนำทางระหว่างส่วนของฟอร์ม
  const [currentSection, setCurrentSection] = useState<number>(1);

  // สถานะทั่วไป
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ผู้ใช้แบบสอบถาม (อิงตาราง survey_users)
  const [userData, setUserData] = useState<SurveyUser | null>(null);

  // คำตอบที่มีอยู่เดิม (ถ้ามี)
  const [existingResponse, setExistingResponse] = useState<SurveyResponse | null>(null);

  // สต็ทสำหรับข้อมูลฟอร์มทั้งหมด (Section1/2/3 จะเติมคีย์ลงใน object นี้)
  const [formData, setFormData] = useState<Record<string, any>>({});

  // --------------------------
  // 1) Bootstrap: ตรวจสิทธิ์แบบ "อีเมลอย่างเดียว" + รองรับกรณีมี session
  // --------------------------
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 1. กรณีมี session (ผู้ใช้เดิมที่เคยล็อกอินด้วยรหัสผ่าน/แอดมิน)
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session ?? null;

        let surveyUser: SurveyUser | null = null;

        if (session?.user?.id) {
          // ลองหาโปรไฟล์ผู้ตอบด้วย auth_user_id
          const { data, error } = await supabase
            .from('survey_users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();

          if (error) {
            // ไม่บล็อคโฟลว์ — ตกไปลองโหมดอีเมลอย่างเดียว
            console.warn('auth_user_id lookup error:', error.message);
          } else if (data) {
            surveyUser = data as SurveyUser;
          }
        }

        // 2. ถ้ายังไม่เจอ → โหมดอีเมลอย่างเดียว (อีเมลต้องถูกเก็บไว้ใน localStorage จากหน้าล็อกอิน)
        if (!surveyUser) {
          const storedEmail = (localStorage.getItem('survey_email') || '').trim().toLowerCase();
          if (!storedEmail) {
            navigate('/login');
            return;
          }

          const { data, error } = await supabase
            .from('survey_users')
            .select('*')
            .eq('email', storedEmail)
            .maybeSingle();

          if (error || !data) {
            // อีเมลไม่พบในระบบ → เคลียร์และย้อนกลับไปล็อกอิน
            localStorage.removeItem('survey_email');
            localStorage.removeItem('survey_user_id');
            navigate('/login');
            return;
          }

          surveyUser = data as SurveyUser;
        }

        // 3. เก็บผู้ใช้ลง state + เผื่อไว้ใน localStorage
        setUserData(surveyUser);
        localStorage.setItem('survey_email', surveyUser.email);
        localStorage.setItem('survey_user_id', String(surveyUser.id));

        // 4. โหลดคำตอบเดิม (ถ้ามี)
        await loadExistingResponse(surveyUser.id);
      } catch (err: any) {
        console.error(err);
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: err?.message || 'ไม่สามารถเริ่มต้นแบบสอบถามได้',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // โหลดคำตอบเดิมของผู้ใช้
  const loadExistingResponse = async (userId: number) => {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('loadExistingResponse error:', error.message);
      return;
    }

    if (data) {
      setExistingResponse(data as SurveyResponse);

      // สมมติว่าในตารางคุณเก็บเป็นหลาย ๆ คอลัมน์ — ให้เติมลง formData ตรง ๆ
      // (ถ้าคุณเก็บเป็น JSON field เช่น section1/2/3 ก็ยังคงใช้งานได้เพราะเราก็ copy ลง formData เหมือนกัน)
      const { id, user_id, created_at, updated_at, submitted_at, status, ...rest } = data as SurveyResponse;
      setFormData((prev) => ({ ...prev, ...rest }));
    }
  };

  // --------------------------
  // 2) การบันทึกคำตอบ
  // --------------------------

  // บันทึก/อัปเดตคำตอบ (draft/submitted)
  const upsertResponse = async (payload: Partial<SurveyResponse> & { user_id: number }) => {
    // หมายเหตุ: ไม่ระบุคอลัมน์ทีละตัว เพื่อให้รองรับสคีมาที่ฟอร์มคุณใช้อยู่
    // สิ่งสำคัญคือ "user_id" ต้องมีเสมอ
    return await supabase
      .from('survey_responses')
      .upsert(payload, { onConflict: 'user_id' }) // สมมติว่ามี unique(user_id) หรือใช้ policy ให้ upsert by user_id
      .select()
      .maybeSingle();
  };

  const handleSaveDraft = async () => {
    if (!userData) return;
    try {
      setIsSaving(true);
      const payload: Partial<SurveyResponse> & { user_id: number } = {
        user_id: userData.id,
        status: 'draft',
        updated_at: new Date().toISOString(),
        ...formData, // สำคัญ: เอาคีย์ทั้งหมดจากฟอร์มไปเขียนลงตาราง
      };
      const { data, error } = await upsertResponse(payload);
      if (error) throw error;

      setExistingResponse(data || null);
      toast({
        title: 'บันทึกชั่วคราวแล้ว',
        description: 'ข้อมูลของคุณถูกบันทึกแบบฉบับร่าง',
      });
    } catch (err: any) {
      toast({
        title: 'บันทึกล้มเหลว',
        description: err?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!userData) return;

    try {
      setIsSaving(true);
      const payload: Partial<SurveyResponse> & { user_id: number } = {
        user_id: userData.id,
        status: 'submitted',
        updated_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        ...formData,
      };
      const { data, error } = await upsertResponse(payload);
      if (error) throw error;

      setExistingResponse(data || null);
      toast({
        title: 'ส่งแบบสอบถามสำเร็จ',
        description: 'ขอขอบพระคุณสำหรับความร่วมมือ',
      });

      navigate('/survey-review');
    } catch (err: any) {
      toast({
        title: 'ส่งแบบสอบถามไม่สำเร็จ',
        description: err?.message || 'กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ออกจากระบบ (รองรับทั้งกรณีมี session และโหมดอีเมลอย่างเดียว)
  const handleLogout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
      }
    } finally {
      localStorage.removeItem('survey_email');
      localStorage.removeItem('survey_user_id');
      navigate('/login');
    }
  };

  // --------------------------
  // 3) UI
  // --------------------------
  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">กำลังเตรียมแบบสอบถาม...</div>
      </div>
    );
  }

  if (!userData) {
    // กันกรณี edge ที่ bootstrap ไม่เจอ user (navigate แล้ว แต่เผื่อ UI แสดงระหว่างทาง)
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-4xl">
        <SurveyHeader
          currentSection={currentSection}
          onChangeSection={setCurrentSection}
          onSaveDraft={handleSaveDraft}
          onSubmitFinal={handleSubmitFinal}
          onLogout={handleLogout}
          isSaving={isSaving}
          userEmail={userData.email}
          userName={userData.full_name || undefined}
          status={existingResponse?.status}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>แบบสอบถาม SROI</CardTitle>
            <CardDescription>
              กรุณากรอกข้อมูลให้ครบถ้วน สามารถบันทึกฉบับร่างระหว่างทำได้
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {currentSection === 1 && (
              <Section1
                formData={formData}
                setFormData={setFormData}
                onNext={() => setCurrentSection(2)}
                onSave={handleSaveDraft}
                isSaving={isSaving}
                existingResponse={existingResponse}
              />
            )}

            {currentSection === 2 && (
              <Section2
                formData={formData}
                setFormData={setFormData}
                onPrev={() => setCurrentSection(1)}
                onNext={() => setCurrentSection(3)}
                onSave={handleSaveDraft}
                isSaving={isSaving}
                existingResponse={existingResponse}
              />
            )}

            {currentSection === 3 && (
              <Section3
                formData={formData}
                setFormData={setFormData}
                onPrev={() => setCurrentSection(2)}
                onSave={handleSaveDraft}
                onSubmit={handleSubmitFinal}
                isSaving={isSaving}
                existingResponse={existingResponse}
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="space-x-2">
                {currentSection > 1 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentSection((s) => s - 1)}>
                    ย้อนกลับ
                  </Button>
                )}
                {currentSection < 3 && (
                  <Button type="button" onClick={() => setCurrentSection((s) => s + 1)}>
                    ถัดไป
                  </Button>
                )}
              </div>

              <div className="space-x-2">
                <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isSaving}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกชั่วคราว'}
                </Button>
                <Button type="button" onClick={handleSubmitFinal} disabled={isSaving}>
                  {isSaving ? 'กำลังส่ง...' : 'ส่งแบบสอบถาม'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          ขอขอบพระคุณในการตอบแบบสอบถาม
        </div>
      </div>
    </div>
  );
};

export default Survey;
