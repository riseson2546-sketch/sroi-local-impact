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
    <tr className="border-b">
      <td className="p-3 text-sm align-top">
        <Label className="leading-relaxed">{title}</Label>
      </td>
      <td className="p-2 text-center">
        <Button
          type="button"
          variant={formData[field] === 5 ? "default" : "outline"}
          size="sm"
          onClick={() => handleInputChange(field, 5)}
          className="w-8 h-8 p-0 text-xs"
        >
          ✓
        </Button>
      </td>
      <td className="p-2 text-center">
        <Button
          type="button"
          variant={formData[field] === 4 ? "default" : "outline"}
          size="sm"
          onClick={() => handleInputChange(field, 4)}
          className="w-8 h-8 p-0 text-xs"
        >
          ✓
        </Button>
      </td>
      <td className="p-2 text-center">
        <Button
          type="button"
          variant={formData[field] === 3 ? "default" : "outline"}
          size="sm"
          onClick={() => handleInputChange(field, 3)}
          className="w-8 h-8 p-0 text-xs"
        >
          ✓
        </Button>
      </td>
      <td className="p-2 text-center">
        <Button
          type="button"
          variant={formData[field] === 2 ? "default" : "outline"}
          size="sm"
          onClick={() => handleInputChange(field, 2)}
          className="w-8 h-8 p-0 text-xs"
        >
          ✓
        </Button>
      </td>
      <td className="p-2 text-center">
        <Button
          type="button"
          variant={formData[field] === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handleInputChange(field, 1)}
          className="w-8 h-8 p-0 text-xs"
        >
          ✓
        </Button>
      </td>
    </tr>
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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center bg-blue-50 p-4 rounded-lg">
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border-b font-semibold">
                    ปัจจัยการขับเคลื่อน
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm">
                    <div className="space-y-1">
                      <div>5</div>
                      <div className="text-xs">มากที่สุด</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm">
                    <div className="space-y-1">
                      <div>4</div>
                      <div className="text-xs">มาก</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm">
                    <div className="space-y-1">
                      <div>3</div>
                      <div className="text-xs">ปานกลาง</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm">
                    <div className="space-y-1">
                      <div>2</div>
                      <div className="text-xs">น้อย</div>
                    </div>
                  </th>
                  <th className="p-3 text-center border-b font-semibold text-sm">
                    <div className="space-y-1">
                      <div>1</div>
                      <div className="text-xs">น้อยที่สุด</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {factors.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr>
                      <td colSpan={6} className="p-3 bg-blue-50 font-semibold text-blue-800 border-b">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <React.Fragment key={itemIndex}>
                        <tr>
                          <td className="p-3 text-sm align-top border-b">
                            <div className="flex items-start">
                              <span className="mr-2">-</span>
                              <Label className="leading-relaxed cursor-pointer">
                                {item.title}
                              </Label>
                            </div>
                          </td>
                          <td className="p-2 text-center border-b">
                            <Button
                              type="button"
                              variant={formData[item.field] === 5 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange(item.field, 5)}
                              className="w-8 h-8 p-0 text-xs"
                            >
                              {formData[item.field] === 5 ? "✓" : ""}
                            </Button>
                          </td>
                          <td className="p-2 text-center border-b">
                            <Button
                              type="button"
                              variant={formData[item.field] === 4 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange(item.field, 4)}
                              className="w-8 h-8 p-0 text-xs"
                            >
                              {formData[item.field] === 4 ? "✓" : ""}
                            </Button>
                          </td>
                          <td className="p-2 text-center border-b">
                            <Button
                              type="button"
                              variant={formData[item.field] === 3 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange(item.field, 3)}
                              className="w-8 h-8 p-0 text-xs"
                            >
                              {formData[item.field] === 3 ? "✓" : ""}
                            </Button>
                          </td>
                          <td className="p-2 text-center border-b">
                            <Button
                              type="button"
                              variant={formData[item.field] === 2 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange(item.field, 2)}
                              className="w-8 h-8 p-0 text-xs"
                            >
                              {formData[item.field] === 2 ? "✓" : ""}
                            </Button>
                          </td>
                          <td className="p-2 text-center border-b">
                            <Button
                              type="button"
                              variant={formData[item.field] === 1 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange(item.field, 1)}
                              className="w-8 h-8 p-0 text-xs"
                            >
                              {formData[item.field] === 1 ? "✓" : ""}
                            </Button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-center bg-gray-50 p-4 rounded-lg">
        <p className="text-lg font-medium text-gray-800">
          ขอขอบพระคุณในการตอบแบบสอบถาม
        </p>
      </div>

      <div className="pt-6">
        <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 3"}
        </Button>
      </div>
    </div>
  );
};

export default Section3;
