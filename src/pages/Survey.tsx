import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SurveyHeader from '@/components/survey/SurveyHeader';
import Section1 from '@/components/survey/Section1';
import Section2 from '@/components/survey/Section2';
import Section3 from '@/components/survey/Section3';

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Get user data
      const { data: surveyUser } = await supabase
        .from('survey_users')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (!surveyUser) {
        navigate('/login');
        return;
      }

      setUserData(surveyUser);

      // Check for existing responses
      const { data: response } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_responses_section2(*),
          survey_responses_section3(*)
        `)
        .eq('user_id', surveyUser.id)
        .single();

      if (response) {
        setExistingResponse(response);
        // Pre-populate form with existing data
        setFormData({
          ...response,
          section2: response.survey_responses_section2?.[0] || {},
          section3: response.survey_responses_section3?.[0] || {}
        });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSaveSection = async (sectionData: any, section: number) => {
    if (!userData) return;

    setIsLoading(true);
    try {
      if (section === 1) {
        if (existingResponse) {
          // Update existing response
          const { error } = await supabase
            .from('survey_responses')
            .update(sectionData)
            .eq('id', existingResponse.id);
          if (error) throw error;
        } else {
          // Create new response
          const { data, error } = await supabase
            .from('survey_responses')
            .insert({
              user_id: userData.id,
              ...sectionData
            })
            .select()
            .single();
          if (error) throw error;
          setExistingResponse(data);
        }
      } else if (section === 2) {
        if (!existingResponse) {
          toast({
            title: "กรุณาทำส่วนที่ 1 ก่อน",
            variant: "destructive",
          });
          return;
        }

        const { data: existing } = await supabase
          .from('survey_responses_section2')
          .select('*')
          .eq('response_id', existingResponse.id)
          .single();

        if (existing) {
          const { error } = await supabase
            .from('survey_responses_section2')
            .update(sectionData)
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('survey_responses_section2')
            .insert({
              response_id: existingResponse.id,
              ...sectionData
            });
          if (error) throw error;
        }
      } else if (section === 3) {
        if (!existingResponse) {
          toast({
            title: "กรุณาทำส่วนที่ 1 ก่อน",
            variant: "destructive",
          });
          return;
        }

        const { data: existing } = await supabase
          .from('survey_responses_section3')
          .select('*')
          .eq('response_id', existingResponse.id)
          .single();

        if (existing) {
          const { error } = await supabase
            .from('survey_responses_section3')
            .update(sectionData)
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('survey_responses_section3')
            .insert({
              response_id: existingResponse.id,
              ...sectionData
            });
          if (error) throw error;
        }
      }

      // อัปเดต formData ทันทีหลังบันทึกสำเร็จ
      setFormData(prev => ({
        ...prev,
        [`section${section}`]: sectionData
      }));

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `ส่วนที่ ${section} ได้รับการบันทึกแล้ว`,
      });

    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ตรวจสอบว่าส่วนไหนเสร็จสิ้นแล้ว
  const isSectionCompleted = (section: number) => {
    if (section === 1) {
      return existingResponse !== null;
    } else if (section === 2) {
      return existingResponse && formData.section2 && Object.keys(formData.section2).length > 0;
    } else if (section === 3) {
      return existingResponse && formData.section3 && Object.keys(formData.section3).length > 0;
    }
    return false;
  };

  // ตรวจสอบว่าสามารถเข้าถึงส่วนนั้นได้หรือไม่
  const canAccessSection = (section: number) => {
    if (section === 1) return true; // section 1 เข้าได้เสมอ
    if (section === 2) return isSectionCompleted(1); // section 2 ต้องทำ section 1 เสร็จก่อน
    if (section === 3) return isSectionCompleted(1) && isSectionCompleted(2); // section 3 ต้องทำ section 1,2 เสร็จก่อน
    return false;
  };

  const handleSectionChange = (section: number) => {
    if (!canAccessSection(section)) {
      toast({
        title: "ไม่สามารถเข้าถึงส่วนนี้ได้",
        description: `กรุณาทำส่วนที่ ${section - 1} ให้เสร็จสิ้นก่อน`,
        variant: "destructive",
      });
      return;
    }
    setCurrentSection(section);
  };

  const handleSubmitSurvey = async () => {
    if (!existingResponse || !isSectionCompleted(2) || !isSectionCompleted(3)) {
      toast({
        title: "กรุณาทำแบบสอบถามให้ครบทุกส่วน",
        description: "กรุณาตอบแบบสอบถามทุกส่วนให้เสร็จสิ้น",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ส่งแบบสอบถามสำเร็จ",
      description: "ขอบคุณสำหรับการตอบแบบสอบถาม",
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold">สวัสดี คุณ{userData.full_name}</h1>
            <p className="text-muted-foreground">{userData.position}, {userData.organization}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </div>

        <SurveyHeader />

        <div className="flex justify-center mb-6">
          <div className="flex space-x-4">
            {[1, 2, 3].map((section) => (
              <Button
                key={section}
                variant={currentSection === section ? "default" : "outline"}
                onClick={() => handleSectionChange(section)}
                disabled={!canAccessSection(section)}
                className={`min-w-[100px] ${
                  isSectionCompleted(section) 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : ''
                } ${
                  !canAccessSection(section) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                ส่วนที่ {section}
                {isSectionCompleted(section) && <span className="ml-1">✓</span>}
              </Button>
            ))}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {currentSection === 1 && (
              <Section1
                data={formData.section1 || formData}
                onSave={(data) => handleSaveSection(data, 1)}
                isLoading={isLoading}
                onNextSection={() => setCurrentSection(2)}
                onPrevSection={() => setCurrentSection(1)}
                isFirstSection={true}
                isLastSection={false}
              />
            )}
            {currentSection === 2 && (
              <Section2
                data={formData.section2 || {}}
                onSave={(data) => handleSaveSection(data, 2)}
                isLoading={isLoading}
                onNextSection={() => setCurrentSection(3)}
                onPrevSection={() => setCurrentSection(1)}
                isFirstSection={false}
                isLastSection={false}
              />
            )}
            {currentSection === 3 && (
              <Section3
                data={formData.section3 || {}}
                onSave={(data) => handleSaveSection(data, 3)}
                isLoading={isLoading}
                onNextSection={handleSubmitSurvey}
                onPrevSection={() => setCurrentSection(2)}
                isFirstSection={false}
                isLastSection={true}
              />
            )}
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