import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// ส่วนประกอบย่อย (ต้องมีในโปรเจกต์อยู่แล้ว)
import SurveyHeader from "@/components/survey/SurveyHeader";
import Section1 from "@/components/survey/Section1";
import Section2 from "@/components/survey/Section2";
import Section3 from "@/components/survey/Section3";

type AnyObj = Record<string, any>;

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSection, setCurrentSection] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userData, setUserData] = useState<AnyObj | null>(null);
  const [existingResponse, setExistingResponse] = useState<AnyObj | null>(null);

  const [formData, setFormData] = useState<AnyObj>({
    section1: {},
    section2: {},
    section3: {},
  });

  // โหลดข้อมูลผู้ตอบ + คำตอบเดิม
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedEmail = localStorage.getItem("survey_email");
        if (!savedEmail) {
          navigate("/login");
          return;
        }

        // หาผู้ตอบจาก survey_users
        const { data: surveyUser, error: findErr } = await supabase
          .from("survey_users")
          .select("*")
          .eq("email", savedEmail)
          .maybeSingle();

        if (findErr || !surveyUser) {
          navigate("/login");
          return;
        }

        setUserData(surveyUser);

        // preload คำตอบ (ถ้ามี)
        const { data: response, error: respErr } = await supabase
          .from("survey_responses")
          .select(
            `
            *,
            survey_responses_section2(*),
            survey_responses_section3(*)
          `
          )
          .eq("user_id", surveyUser.id)
          .maybeSingle();

        if (respErr) console.error("fetch responses error:", respErr);

        if (response) {
          setExistingResponse(response);
          setFormData({
            section1: response.section1 ?? {},
            section2: response.survey_responses_section2?.[0] ?? {},
            section3: response.survey_responses_section3?.[0] ?? {},
          });
        }
      } catch (e: any) {
        console.error("checkAuth exception:", e);
        toast({
          title: "โหลดข้อมูลไม่สำเร็จ",
          description: e?.message ?? "ไม่สามารถโหลดแบบสอบถามได้",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // ออกจากระบบ
  const handleLogout = async () => {
    try {
      localStorage.removeItem("survey_email");
    } finally {
      navigate("/login");
    }
  };

  // ถัดไป/ย้อนกลับ
  const goNext = () => setCurrentSection((s) => Math.min(3, s + 1));
  const goPrev = () => setCurrentSection((s) => Math.max(1, s - 1));

  // ======= ฟังก์ชันบันทึก =======
  const handleSave = async () => {
    if (!userData?.id) {
      toast({
        title: "ไม่พบผู้ตอบ",
        description: "กรุณาเริ่มจากหน้ากรอกอีเมลใหม่",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting save process...", formData);

      // -------- บันทึก Section1 --------
      const { data: resp, error: respErr } = await supabase
        .from("survey_responses")
        .upsert(
          {
            user_id: userData.id,
            section1: formData.section1 ?? {},
          },
          { onConflict: "user_id" }
        )
        .select("*")
        .maybeSingle();

      if (respErr) {
        console.error("survey_responses error:", respErr);
        throw new Error("ไม่สามารถบันทึกข้อมูล Section 1 ได้");
      }
      
      console.log("Section1 saved:", resp);
      if (resp) setExistingResponse(resp);

      // -------- บันทึก Section2 --------
      if (resp && formData.section2 && Object.keys(formData.section2).length > 0) {
        const { error: s2Err } = await supabase
          .from("survey_responses_section2")
          .upsert(
            { 
              response_id: resp.id,
              user_id: userData.id, 
              ...formData.section2 
            },
            { onConflict: "response_id" }
          );
        if (s2Err) {
          console.error("survey_responses_section2 error:", s2Err);
          throw new Error("ไม่สามารถบันทึกข้อมูล Section 2 ได้");
        }
        console.log("Section2 saved");
      }

      // -------- บันทึก Section3 --------
      if (resp && formData.section3 && Object.keys(formData.section3).length > 0) {
        const { error: s3Err } = await supabase
          .from("survey_responses_section3")
          .upsert(
            { 
              response_id: resp.id,
              user_id: userData.id, 
              ...formData.section3 
            },
            { onConflict: "response_id" }
          );
        if (s3Err) {
          console.error("survey_responses_section3 error:", s3Err);
          throw new Error("ไม่สามารถบันทึกข้อมูล Section 3 ได้");
        }
        console.log("Section3 saved");
      }

      toast({
        title: "บันทึกสำเร็จ",
        description: "คำตอบของคุณถูกบันทึกแล้ว",
      });
    } catch (e: any) {
      console.error("handleSave exception:", e);
      toast({
        title: "บันทึกไม่สำเร็จ",
        description: e?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ======= เรนเดอร์ Section =======
  const renderSection = () => {
    if (currentSection === 1) {
      return (
        <Section1
          data={formData.section1}
          onSave={(data: AnyObj) => {
            setFormData((prev: AnyObj) => ({ ...prev, section1: data }));
            return Promise.resolve();
          }}
        />
      );
    }
    if (currentSection === 2) {
      return (
        <Section2
          data={formData.section2}
          onSave={(data: AnyObj) => {
            setFormData((prev: AnyObj) => ({ ...prev, section2: data }));
            return Promise.resolve();
          }}
        />
      );
    }
    return (
      <Section3
        data={formData.section3}
        onSave={(data: AnyObj) => {
          setFormData((prev: AnyObj) => ({ ...prev, section3: data }));
          return Promise.resolve();
        }}
      />
    );
  };

  // ======= เรนเดอร์หลัก =======
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <SurveyHeader />

        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                {currentSection === 1 && "ส่วนที่ 1: ข้อมูลโครงการ / บริบท"}
                {currentSection === 2 && "ส่วนที่ 2: กระบวนการ / ผลลัพธ์ระยะสั้น"}
                {currentSection === 3 && "ส่วนที่ 3: ผลลัพธ์ทางสังคม / SROI"}
              </div>
              <div className="text-sm text-muted-foreground">
                หน้า {currentSection} / 3
              </div>
            </div>

            {/* User Info Display */}
            {userData && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>ผู้ตอบ:</strong> {userData.full_name} ({userData.email})
                </p>
                <p className="text-sm text-blue-600">
                  <strong>ตำแหน่ง:</strong> {userData.position} | <strong>หน่วยงาน:</strong> {userData.organization}
                </p>
              </div>
            )}

            {/* เนื้อหา Section */}
            <div>{renderSection()}</div>

            {/* ปุ่มควบคุม */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between pt-2">
              <div className="flex gap-2">
                {currentSection > 1 && (
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={isLoading}
                  >
                    ย้อนกลับ
                  </Button>
                )}
                {currentSection < 3 && (
                  <Button
                    variant="secondary"
                    onClick={goNext}
                    disabled={isLoading}
                  >
                    ถัดไป
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "กำลังบันทึก..." : "บันทึกคำตอบ"}
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
