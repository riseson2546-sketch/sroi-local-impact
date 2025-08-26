import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// ถ้ามีคอมโพเนนต์เหล่านี้อยู่แล้วในโปรเจกต์
import SurveyHeader from '@/components/survey/SurveyHeader';
import Section1 from '@/components/survey/Section1';
import Section2 from '@/components/survey/Section2';
import Section3 from '@/components/survey/Section3';

type AnyObj = Record<string, any>;

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // หน้า/ตอนปัจจุบันของแบบสอบถาม
  const [currentSection, setCurrentSection] = useState<number>(1);

  // สถานะโหลด/บันทึก
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ข้อมูลผู้ตอบ (จากตาราง survey_users)
  const [userData, setUserData] = useState<AnyObj | null>(null);

  // คำตอบเดิม (ถ้ามี) จากตาราง survey_responses (+section2/+section3)
  const [existingResponse, setExistingResponse] = useState<AnyObj | null>(null);

  // ฟอร์มคำตอบในหน้านี้ (เก็บรวม ๆ ให้ส่งลงฐานข้อมูล)
  const [formData, setFormData] = useState<AnyObj>({
    section1: {},
    section2: {},
    section3: {},
  });

  // โหลดผู้ใช้ด้วย email ใน localStorage และ preload คำตอบเดิม (ถ้ามี)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedEmail = localStorage.getItem('survey_email');
        if (!savedEmail) {
          navigate('/login');
          return;
        }

        // ค้นผู้ใช้จากอีเมล (แนะนำเก็บเป็น lower-case เสมอ)
        const { data: surveyUser, error: findErr } = await supabase
          .from('survey_users')
          .select('*')
          .eq('email', savedEmail)
          .maybeSingle();

        if (findErr || !surveyUser) {
          navigate('/login');
          return;
        }

        setUserData(surveyUser);

        // ดึงคำตอบเดิม (ถ้ามี)
        // หมายเหตุ: ปรับชื่อ relation ให้ตรงกับสคีม่าจริงในโปรเจกต์ของคุณ
        const { data: response, error: respErr } = await supabase
          .from('survey_responses')
          .select(`
            *,
            survey_responses_section2(*),
            survey_responses_section3(*)
          `)
          .eq('user_id', surveyUser.id)
          .maybeSingle();

        if (respErr) {
          console.error(respErr);
        }

        if (response) {
          setExistingResponse(response);
          setFormData({
            section1: response.section1 ?? {},
            section2: response.survey_responses_section2?.[0] ?? {},
            section3: response.survey_responses_section3?.[0] ?? {},
          });
        } else {
          // ไม่มีคำตอบเดิม
          setExistingResponse(null);
          setFormData({
            section1: {},
            section2: {},
            section3: {},
          });
        }
      } catch (e: any) {
        console.error(e);
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: e?.message ?? 'ไม่สามารถโหลดข้อมูลแบบสอบถามได้',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // ออกจากระบบ: ล้าง email ใน localStorage แล้วกลับหน้าเริ่มต้น
  const handleLogout = async () => {
    try {
      localStorage.removeItem('survey_email');
    } finally {
      navigate('/login');
    }
  };

  // เปลี่ยนตอน (ถัดไป/ย้อนกลับ)
  const goNext = () => setCurrentSection((s) => Math.min(3, s + 1));
  const goPrev = () => setCurrentSection((s) => Math.max(1, s - 1));

  // บันทึกคำตอบของตอนปัจจุบันลง DB
  const handleSave = async () => {
    if (!userData?.id) return;
    setIsLoading(true);
    try {
      // 1) อัปเดต/สร้างแถวใน survey_responses (อย่างน้อยเก็บ section1 เป็น JSON)
      let responseId = existingResponse?.id as string | undefined;

      if (!responseId) {
        // ยังไม่มี response → สร้างใหม่
        const { data: insertResp, error: insRespErr } = await supabase
          .from('survey_responses')
          .insert({
            user_id: userData.id,
            section1: formData.section1 ?? {},
          })
          .select('*')
          .single();

        if (insRespErr) throw insRespErr;
        responseId = insertResp.id;
        setExistingResponse(insertResp);
      } else {
        // มี response แล้ว → อัปเดต (เฉพาะ section1; ส่วน section2/3 แยกตาราง)
        const { error: updRespErr } = await supabase
          .from('survey_responses')
          .update({
            section1: formData.section1 ?? {},
          })
          .eq('id', responseId);

        if (updRespErr) throw updRespErr;
      }

      // 2) อัปเดต/สร้างคำตอบของ section2 (ถ้าโปรเจกต์แยกไว้ที่ตาราง survey_responses_section2)
      if (formData.section2 && Object.keys(formData.section2).length > 0) {
        // ตรวจว่ามีแถว section2 อยู่แล้วไหม (ตาม user_id)
        const { data: s2Row, error: s2FindErr } = await supabase
          .from('survey_responses_section2')
          .select('*')
          .eq('user_id', userData.id)
          .maybeSingle();

        if (s2FindErr) throw s2FindErr;

        if (s2Row) {
          const { error: s2UpdErr } = await supabase
            .from('survey_responses_section2')
            .update(formData.section2)
            .eq('id', s2Row.id);
          if (s2UpdErr) throw s2UpdErr;
        } else {
          const { error: s2InsErr } = await supabase
            .from('survey_responses_section2')
            .insert({ user_id: userData.id, ...formData.section2 });
          if (s2InsErr) throw s2InsErr;
        }
      }

      // 3) อัปเดต/สร้างคำตอบของ section3
      if (formData.section3 && Object.keys(formData.section3).length > 0) {
        const { data: s3Row, error: s3FindErr } = await supabase
          .from('survey_responses_section3')
          .select('*')
          .eq('user_id', userData.id)
          .maybeSingle();

        if (s3FindErr) throw s3FindErr;

        if (s3Row) {
          const { error: s3UpdErr } = await supabase
            .from('survey_responses_section3')
            .update(formData.section3)
            .eq('id', s3Row.id);
          if (s3UpdErr) throw s3UpdErr;
        } else {
          const { error: s3InsErr } = await supabase
            .from('survey_responses_section3')
            .insert({ user_id: userData.id, ...formData.section3 });
          if (s3InsErr) throw s3InsErr;
        }
      }

      toast({ title: 'บันทึกสำเร็จ', description: 'บันทึกคำตอบเรียบร้อยแล้ว' });
    } catch (e: any) {
      console.error(e);
      toast({
        title: 'บันทึกไม่สำเร็จ',
        description: e?.message ?? 'กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // เรนเดอร์ส่วนของแต่ละตอน
  const renderSection = () => {
    if (currentSection === 1) {
      return (
        <Section1
          value={formData.section1}
          onChange={(next: AnyObj) => setFormData((prev: AnyObj) => ({ ...prev, section1: next }))}
          userData={userData}
        />
      );
    }
    if (currentSection === 2) {
      return (
        <Section2
          value={formData.section2}
          onChange={(next: AnyObj) => setFormData((prev: AnyObj) => ({ ...prev, section2: next }))}
          userData={userData}
        />
      );
    }
    return (
      <Section3
        value={formData.section3}
        onChange={(next: AnyObj) => setFormData((prev: AnyObj) => ({ ...prev, section3: next }))}
        userData={userData}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <SurveyHeader
          respondentName={userData?.full_name ?? ''}
          onLogout={handleLogout}
        />

        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            {/* หัวข้อ Section */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                {currentSection === 1 && 'ส่วนที่ 1: ข้อมูลโครงการ / บริบท'}
                {currentSection === 2 && 'ส่วนที่ 2: กระบวนการ / ผลลัพธ์ระยะสั้น'}
                {currentSection === 3 && 'ส่วนที่ 3: ผลลัพธ์ทางสังคม / SROI'}
              </div>
              <div className="text-sm text-muted-foreground">
                หน้า {currentSection} / 3
              </div>
            </div>

            {/* เนื้อหา Section */}
            <div>{renderSection()}</div>

            {/* ปุ่มควบคุม */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between pt-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={goPrev} disabled={currentSection === 1 || isLoading}>
                  ย้อนกลับ
                </Button>
                <Button variant="secondary" onClick={goNext} disabled={currentSection === 3 || isLoading}>
                  ถัดไป
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'กำลังบันทึก...' : 'บันทึกคำตอบ'}
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;
