import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';

// Mock components สำหรับการแสดงตัวอย่าง
const SurveyHeader = () => (
  <div className="text-center mb-6 p-4 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold text-primary mb-2">แบบสอบถามการประเมินผลลัพธ์</h2>
    <p className="text-muted-foreground">หลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)</p>
  </div>
);

const Section1 = ({ data, onSave, isLoading }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรม</h3>
    <p className="text-muted-foreground">เนื้อหาของ Section 1...</p>
    <Button onClick={() => onSave({ section1: 'completed' })} disabled={isLoading}>
      {isLoading ? 'กำลังบันทึก...' : 'บันทึกส่วนที่ 1'}
    </Button>
  </div>
);

const Section2 = ({ data, onSave, isLoading }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล</h3>
    <p className="text-muted-foreground">เนื้อหาของ Section 2...</p>
    <Button onClick={() => onSave({ section2: 'completed' })} disabled={isLoading}>
      {isLoading ? 'กำลังบันทึก...' : 'บันทึกส่วนที่ 2'}
    </Button>
  </div>
);

const Section3 = ({ data, onSave, isLoading }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">ส่วนที่ 3: การขับเคลื่อนระบบข้อมูลเมือง</h3>
    <p className="text-muted-foreground">เนื้อหาของ Section 3...</p>
    <Button onClick={() => onSave({ section3: 'completed' })} disabled={isLoading}>
      {isLoading ? 'กำลังบันทึก...' : 'บันทึกส่วนที่ 3'}
    </Button>
  </div>
);

// Mock functions
const useToast = () => ({
  toast: ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description} (${variant || 'default'})`);
    // แสดง toast จริงในการใช้งานจริง
  }
});

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({ 
    full_name: 'สมชาย ใจดี', 
    position: 'นักวิชาการ', 
    organization: 'เทศบาลตำบลตัวอย่าง' 
  });
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState(new Set());
  const { toast } = useToast();

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  // 🔥 แก้ไข: เพิ่ม parameter autoNavigate เพื่อควบคุมการไปยัง section ถัดไป
  const handleSaveSection = async (sectionData, section, autoNavigate = true) => {
    setIsLoading(true);
    
    // จำลองการบันทึกข้อมูล
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // อัปเดต formData และ completedSections
      setFormData(prev => ({
        ...prev,
        [`section${section}`]: sectionData
      }));

      setCompletedSections(prev => new Set(prev).add(section));

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `ส่วนที่ ${section} ได้รับการบันทึกแล้ว`,
      });

      // 🚀 AUTO NAVIGATION: ไปยัง Section ถัดไปอัตโนมัติ (เฉพาะเมื่อ autoNavigate = true)
      if (autoNavigate && section < 3) {
        setTimeout(() => {
          setCurrentSection(section + 1);
          toast({
            title: `เปลี่ยนไปส่วนที่ ${section + 1}`,
            description: "ระบบพาท่านไปยังส่วนถัดไปอัตโนมัติ",
          });
        }, 1000);
      } else if (autoNavigate && section === 3) {
        // ถ้าเป็น Section 3 (สุดท้าย)
        setTimeout(() => {
          toast({
            title: "🎉 เสร็จสิ้นแบบสอบถาม",
            description: "ขอบคุณที่ตอบแบบสอบถามครบทุกส่วน พร้อมส่งแบบสอบถามได้แล้ว",
          });
        }, 1000);
      }

    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSurvey = () => {
    if (completedSections.size < 3) {
      toast({
        title: "กรุณาทำแบบสอบถามให้ครบทุกส่วน",
        description: `ยังเหลือส่วนที่ ${[1,2,3].filter(s => !completedSections.has(s)).join(', ')} ที่ยังไม่ได้ทำ`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ส่งแบบสอบถามสำเร็จ",
      description: "ขอบคุณสำหรับการตอบแบบสอบถาม",
    });
  };toast({
            title: "🎉 เสร็จสิ้นแบบสอบถาม",
            description: "ขอบคุณที่ตอบแบบสอบถามครบทุกส่วน",
          });
        }, 1000);
      }

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

  const handleSubmitSurvey = async () => {
    if (completedSections.size < 3) {
      toast({
        title: "กรุณาทำแบบสอบถามให้ครบทุกส่วน",
        description: `ยังเหลือส่วนที่ ${[1,2,3].filter(s => !completedSections.has(s)).join(', ')} ที่ยังไม่ได้ทำ`,
        variant: "destructive",
      });
      return;
    }

    // Mark as submitted
    if (existingResponse) {
      await supabase
        .from('survey_responses')
        .update({ submitted_at: new Date().toISOString() })
        .eq('id', existingResponse.id);
    }

    toast({
      title: "ส่งแบบสอบถามสำเร็จ",
      description: "ขอบคุณสำหรับการตอบแบบสอบถาม",
    });

    // Redirect to thank you page หรือ home
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
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

        {/* Section Navigation with Progress Indicators */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-4">
            {[1, 2, 3].map((section) => (
              <Button
                key={section}
                variant={currentSection === section ? "default" : "outline"}
                onClick={() => setCurrentSection(section)}
                className={`min-w-[120px] relative ${
                  completedSections.has(section) ? 'border-green-500' : ''
                }`}
                disabled={section > 1 && !completedSections.has(section - 1)} // ต้องทำ section ก่อนหน้าก่อน
              >
                <div className="flex items-center space-x-2">
                  {completedSections.has(section) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span>ส่วนที่ {section}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            ความคืบหน้า: {completedSections.size}/3 ส่วน
            {completedSections.size === 3 && <span className="text-green-600 font-medium"> (เสร็จสมบูรณ์)</span>}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {currentSection === 1 && (
              <Section1
                data={formData.section1 || {}}
                onSave={(data) => handleSaveSection(data, 1)}
                isLoading={isLoading}
              />
            )}
            {currentSection === 2 && (
              <Section2
                data={formData.section2 || {}}
                onSave={(data) => handleSaveSection(data, 2)}
                isLoading={isLoading}
              />
            )}
            {currentSection === 3 && (
              <Section3
                data={formData.section3 || {}}
                onSave={(data) => handleSaveSection(data, 3)}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation - ซ่อนปุ่ม "ถัดไป" ให้ใช้แค่ปุ่มใน Section components */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
          >
            ก่อนหน้า
          </Button>

          <div className="text-sm text-muted-foreground">
            ส่วนที่ {currentSection} จาก 3
          </div>
          
          <div className="flex space-x-2">
            {/* 🚫 เอาปุ่ม "ถัดไป" ออก - ให้ใช้ปุ่มในแต่ละ Section แทน */}
            
            {/* แสดงปุ่มส่งแบบสอบถามเฉพาะเมื่อทำครบทุกส่วนแล้ว */}
            {completedSections.size === 3 && (
              <Button 
                onClick={handleSubmitSurvey} 
                className="bg-green-600 hover:bg-green-700"
              >
                ส่งแบบสอบถาม
              </Button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 คำแนะนำการใช้งาน:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>กดปุ่มบันทึกเพียงครั้งเดียว</strong> ระบบจะพาไปส่วนถัดไปอัตโนมัติ</li>
            <li>• ไม่ต้องกดปุ่ม "ถัดไป" อีก เพราะระบบจะเปลี่ยนหน้าให้อัตโนมัติ</li>
            <li>• สามารถย้อนกลับแก้ไขข้อมูลได้ทุกเมื่อด้วยปุ่ม "ก่อนหน้า"</li>
            <li>• ต้องทำครบทุกส่วนก่อนส่งแบบสอบถาม</li>
            <li>• ข้อมูลจะถูกบันทึกอัตโนมัติ ไม่ต้องกังวลเรื่องข้อมูลหาย</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          ขอขอบพระคุณในการตอบแบบสอบถาม
        </div>
      </div>
    </div>
  );
};

export default Survey;
