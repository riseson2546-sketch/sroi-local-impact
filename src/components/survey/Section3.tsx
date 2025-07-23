import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Section3Props {
  data: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const Section3: React.FC<Section3Props> = ({ data, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    budget_system_development: null,
    budget_knowledge_development: null,
    cooperation_between_agencies: null,
    innovation_ecosystem: null,
    government_digital_support: null,
    digital_infrastructure: null,
    digital_mindset: null,
    learning_organization: null,
    it_skills: null,
    internal_communication: null,
    policy_continuity: null,
    policy_stability: null,
    leadership_importance: null,
    staff_importance: null,
    communication_to_users: null,
    reaching_target_groups: null,
    ...data
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const renderRatingScale = (title: string, field: string) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <Label className="text-sm">{title}</Label>
      </div>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            type="button"
            variant={formData[field] === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleInputChange(field, value)}
            className="w-8 h-8 p-0"
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );

  const factors = [
    {
      category: "1. ทรัพยากรภายในองค์กร",
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
      items: [
        { field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" },
        { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" },
        { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" },
        { field: "staff_importance", title: "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }
      ]
    },
    {
      category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย",
      items: [
        { field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" },
        { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          ส่วนที่ 3 การขับเคลื่อนระบบข้อมูลเมืองหรือโครงการนวัตกรรมต่อยอดสู่การเป็นองค์กร ที่ขับเคลื่อนด้วยข้อมูล (Data Driven Organization)
        </h2>
        <p className="text-muted-foreground">
          ขอให้ท่านให้ความคิดเห็นเกี่ยวกับปัจจัยที่ส่งผลต่อการขับเคลื่อนนวัตกรรมต่อยอด ในพื้นที่ของท่าน
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ระดับความคิดเห็น (1 = น้อยที่สุด, 5 = มากที่สุด)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {factors.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h3 className="font-semibold text-lg">{category.category}</h3>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {renderRatingScale(item.title, item.field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          ขอขอบพระคุณในการตอบแบบสอบถาม
        </p>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 3"}
      </Button>
    </div>
  );
};

export default Section3;