import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BarChart3, Building2, Target, MessageSquare, ChevronLeft } from "lucide-react";

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

const Section3: React.FC<Section3Props> = ({
  data,
  onSave,
  isLoading = false,
  onNextSection,
  onPrevSection,
}) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

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

  const validateCurrentStep = () => {
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];
    currentStepData.required.forEach(field => {
      const value = (formData as any)[field];
      if (value === null || value === undefined) {
        errors.push('กรุณาให้คะแนนในทุกข้อ');
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePrimaryClick = async () => {
    const isLastStep = currentStep >= formSteps.length - 1;
    if (!validateCurrentStep()) return;

    try {
      setSaving(true);
      await onSave(formData); // บันทึกข้อมูลเบื้องหลัง

      if (isLastStep) {
        // เมื่อเป็นขั้นตอนสุดท้าย ให้เรียกฟังก์ชันเพื่อไปยัง Section ถัดไป
        await onNextSection?.();
      } else {
        // ไปยังขั้นตอนย่อยถัดไปใน Section นี้
        setCurrentStep(prev => prev + 1);
        setValidationErrors([]);
      }
    } catch (err) {
      console.error('[Section3] save/submit failed', err);
      // ในกรณีที่เกิดข้อผิดพลาด สามารถแสดง alert หรือ UI แจ้งเตือนอื่น ๆ ได้
      alert('บันทึกไม่สำเร็จ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ');
    } finally {
      setSaving(false);
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      onPrevSection?.(); // ย้อนกลับไปยัง Section ก่อนหน้า
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0)); // ย้อนกลับไปยังขั้นตอนย่อยก่อนหน้า
      setValidationErrors([]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            variant={(formData as any)[field] === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleInputChange(field, value)}
            className={`w-8 h-8 p-0 text-xs transition-all ${
              (formData as any)[field] === value
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            {(formData as any)[field] === value ? "✓" : ""}
          </Button>
        </td>
      ))}
    </tr>
  );

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

  const renderStepContent = () => {
    const currentCategory = categoryData[currentStep];
    const IconComponent = currentCategory.icon;
    const isLastStep = currentStep >= formSteps.length - 1;
    const primaryLabel = isLastStep ? 'บันทึกและส่งแบบสอบถาม' : 'ถัดไป';

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
          {validationErrors.length > 0 && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div>{validationErrors[0]}</div>
            </div>
          )}

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
                {currentCategory.items.map(item => (
                  renderRatingRow(item.title, item.field)
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={isLoading || saving}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              ย้อนกลับ
            </Button>

            <Button
              type="button"
              onClick={handlePrimaryClick}
              disabled={isLoading || saving}
            >
              {saving ? 'กำลังบันทึก...' : primaryLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {renderStepContent()}
    </div>
  );
};

export default Section3;
