import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, AlertCircle, BarChart3, Building2, Target, MessageSquare } from "lucide-react";

interface Section3Props {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  isLoading?: boolean;
  onNextSection?: () => void | Promise<void>;
  onPrevSection?: () => void;
  isFirstSection?: boolean;
  isLastSection?: boolean;
}

const defaultFormState = {
  // 1. ทรัพยากรภายในองค์กร
  budget_system_development: null,
  budget_knowledge_development: null,
  cooperation_between_agencies: null,
  innovation_ecosystem: null,
  government_digital_support: null,
  
  // 2. สถานะหน่วยงาน เทศบาล/อปท.
  digital_infrastructure: null,
  digital_mindset: null,
  learning_organization: null,
  it_skills: null,
  internal_communication: null,
  
  // 3. พันธะผูกพันของหน่วยงาน
  policy_continuity: null,
  policy_stability: null,
  leadership_importance: null,
  staff_importance: null,
  
  // 4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย
  communication_to_users: null,
  reaching_target_groups: null,
};

const Section3: React.FC<Section3Props> = ({ data, onSave, isLoading = false, onNextSection, onPrevSection, isFirstSection = false, isLastSection = false }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  // กำหนดขั้นตอนของฟอร์ม
  const formSteps = [
    {
      id: 'internal_resources',
      title: '1. ทรัพยากรภายในองค์กร',
      required: ['budget_system_development', 'budget_knowledge_development', 'cooperation_between_agencies', 'innovation_ecosystem', 'government_digital_support'],
      icon: Building2
    },
    {
      id: 'organization_status',
      title: '2. สถานะหน่วยงาน เทศบาล/อปท.',
      required: ['digital_infrastructure', 'digital_mindset', 'learning_organization', 'it_skills', 'internal_communication'],
      icon: BarChart3
    },
    {
      id: 'organizational_commitment',
      title: '3. พันธะผูกพันของหน่วยงาน',
      required: ['policy_continuity', 'policy_stability', 'leadership_importance', 'staff_importance'],
      icon: Target
    },
    {
      id: 'user_communication',
      title: '4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย',
      required: ['communication_to_users', 'reaching_target_groups'],
      icon: MessageSquare
    }
  ];

  // ตรวจสอบความครบถ้วน
  const validateCurrentStep = () => {
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];

    currentStepData.required.forEach(field => {
      const value = formData[field];
      
      if (value === null || value === undefined) {
        errors.push(`กรุณาให้คะแนนในทุกข้อ`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
      setValidationErrors([]);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setValidationErrors([]);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("[Section3] saving", formData);
      await onSave(formData);
    } catch (err) {
      console.error("[Section3] save failed", err);
      alert("บันทึกไม่สำเร็จ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ");
    } finally {
      setSaving(false);
    }
  };

  // ฟังก์ชั่นสำหรับ render ตาราง rating
  const renderRatingRow = (title: string, field: string, isRequired = true) => (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-3 text-sm align-top">
        <div className="flex items-start">
          <span className="mr-2">-</span>
          <Label className="leading-relaxed cursor-pointer">
            {title}
            {isRequired && <span className="text-red-600 ml-1">*</span>}
          </Label>
        </div>
      </td>
      {[5, 4, 3, 2, 1].map((value) => (
        <td key={value} className="p-2 text-center">
          <Button
            type="button"
            variant={formData[field] === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleInputChange(field, value)}
            className={`w-8 h-8 p-0 text-xs transition-all ${
              formData[field] === value 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            {formData[field] === value ? "✓" : ""}
          </Button>
        </td>
      ))}
    </tr>
  );

  // กำหนดข้อมูลสำหรับแต่ละหมวด
  const categoryData = [
    {
      category: "1. ทรัพยากรภายในองค์กร",
      icon: Building2,
      color: "blue",
      items: [
        { field: "budget_system_development", title: "งบประมาณจัดสรรในการพัฒนาระบบ" },
        { field: "budget_knowledge_development", title: "งบประมาณจัดสรรในการพัฒนาองค์ความรู้" },
        { field: "cooperation_between_agencies", title: "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย" },
        { field: "innovation_ecosystem", title: "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม" },
        { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐที่เกี่ยวกับภารกิจพื้นฐานของท้องถิ่น" }
      ]
    },
    {
      category: "2. สถานะหน่วยงาน เทศบาล/อปท.",
      icon: BarChart3,
      color: "green",
      items: [
        { field: "digital_infrastructure", title: "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)" },
        { field: "digital_mindset", title: "บุคลากรภายในหน่วยงานมีชุดความคิดแบบดิจิทัล (Digital Mindset)" },
        { field: "learning_organization", title: "เป็นองค์กรแห่งการเรียนรู้ ที่มีความพร้อมในการพัฒนานวัตกรรม" },
        { field: "it_skills", title: "เจ้าหน้าที่ที่เกี่ยวข้องกับการใช้นวัตกรรมดิจิทัล มีความรู้ทักษะด้าน IT ที่เพียงพอ" },
        { field: "internal_communication", title: "ประสิทธิภาพในการสื่อสารภายในองค์กร" }
      ]
    },
    {
      category: "3. พันธะผูกพันของหน่วยงาน",
      icon: Target,
      color: "purple",
      items: [
        { field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" },
        { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" },
        { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" },
        { field: "staff_importance", title: "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }
      ]
    },
    {
      category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย",
      icon: MessageSquare,
      color: "orange",
      items: [
        { field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" },
        { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }
      ]
    }
  ];

  // เนื้อหาของแต่ละขั้นตอน
  const renderStepContent = () => {
    const currentCategory = categoryData[currentStep];
    const IconComponent = currentCategory.icon;
    
    return (
      <Card className="shadow-lg">
        <CardHeader className={`bg-${currentCategory.color}-50 border-b border-${currentCategory.color}-200`}>
          <CardTitle className={`flex items-center space-x-2 text-${currentCategory.color}-800`}>
            <IconComponent className="h-5 w-5" />
            <span>{currentCategory.category}</span>
          </CardTitle>
          <p className={`text-sm text-${currentCategory.color}-600 mt-2`}>
            กรุณาให้คะแนนในแต่ละข้อตามความเป็นจริงของหน่วยงานท่าน
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border-b font-semibold min-w-[300px]">
                    ปัจจัยการขับเคลื่อน
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-green-600">5</div>
                      <div className="text-xs">มากที่สุด</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-blue-600">4</div>
                      <div className="text-xs">มาก</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-yellow-600">3</div>
                      <div className="text-xs">ปานกลาง</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-orange-600">2</div>
                      <div className="text-xs">น้อย</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-red-600">1</div>
                      <div className="text-xs">น้อยที่สุด</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategory.items.map((item, index) => (
                  renderRatingRow(item.title, item.field, true)
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  // คำนวณสถิติสำหรับแสดงผล
  const getCompletionStats = () => {
    const totalFields = Object.keys(defaultFormState).length;
    const completedFields = Object.values(formData).filter(value => value !== null && value !== undefined).length;
    const completionRate = Math.round((completedFields / totalFields) * 100);
    
    const categoryStats = categoryData.map(category => {
      const categoryCompleted = category.items.filter(item => formData[item.field] !== null).length;
      const categoryTotal = category.items.length;
      return {
        name: category.category,
        completed: categoryCompleted,
        total: categoryTotal,
        rate: Math.round((categoryCompleted / categoryTotal) * 100)
      };
    });

    return { completionRate, categoryStats };
  };

  const progress = ((currentStep + 1) / formSteps.length) * 100;
  const { completionRate, categoryStats } = getCompletionStats();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          ส่วนที่ 3 การขับเคลื่อนระบบข้อมูลเมืองหรือโครงการนวัตกรรมต่อยอดสู่การเป็นองค์กร ที่ขับเคลื่อนด้วยข้อมูล (Data Driven Organization)
        </h2>
        <p className="text-blue-600 font-medium">
          ขอให้ท่านให้ความคิดเห็นเกี่ยวกับปัจจัยที่ส่งผลต่อการขับเคลื่อนนวัตกรรมต่อยอด ในพื้นที่ของท่าน
        </p>
        <p className="text-sm text-blue-600 mt-2">
          (ให้ทำสัญลักษณ์ ✓ ในช่องที่ท่านเลือก)
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>ความคืบหน้า: {currentStep + 1} จาก {formSteps.length} หมวด</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground text-center">
          {formSteps[currentStep].title}
        </p>
      </div>

      {/* Completion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
            <div className="text-sm text-gray-600">ความครบถ้วนรวม</div>
          </div>
        </div>
        {categoryStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{stat.completed}/{stat.total}</div>
              <div className="text-xs text-gray-600">{stat.name.split('.')[0]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium">กรุณาตรวจสอบข้อมูลต่อไปนี้:</h4>
              <ul className="text-red-700 text-sm mt-1 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>ก่อนหน้า</span>
        </Button>

        <div className="text-sm text-muted-foreground">
          หมวด {currentStep + 1} จาก {formSteps.length}
        </div>

        {currentStep === formSteps.length - 1 ? (
          <Button
            onClick={async () => {
              await handleSave();
              if (onNextSection && isLastSection) {
                await onNextSection();
              }
            }}
            disabled={saving || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving || isLoading ? "กำลังบันทึก..." : "ส่งแบบสอบถาม"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>ถัดไป</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Final Section Message */}
      {currentStep === formSteps.length - 1 && (
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-2">
            🎉 เสร็จสิ้นการตอบแบบสอบถาม
          </h3>
          <p className="text-green-700">
            ขอขอบพระคุณในการให้ข้อมูลที่มีค่า ข้อมูลของท่านจะช่วยในการพัฒนาระบบการขับเคลื่อนเมืองด้วยข้อมูลต่อไป
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3 text-yellow-800">💡 วิธีการใช้งาน:</h4>
        <ul className="text-sm space-y-1 text-yellow-700">
          <li>• ให้คะแนนในทุกข้อของแต่ละหมวด</li>
          <li>• คลิกปุ่ม ✓ ในคอลัมน์คะแนนที่ต้องการ</li>
          <li>• ระบบจะตรวจสอบความครบถ้วนก่อนให้ไปหมวดถัดไป</li>
          <li>• สามารถย้อนกลับไปแก้ไขคะแนนได้ตลอดเวลา</li>
          <li>• เมื่อให้คะแนนครบทุกหมวดแล้ว ให้กดปุ่ม "บันทึก"</li>
        </ul>
      </div>
    </div>
  );
};

export default Section3;
