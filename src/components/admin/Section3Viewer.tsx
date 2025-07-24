import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Section3ViewerProps {
  data: any;
}

const Section3Viewer: React.FC<Section3ViewerProps> = ({ data }) => {
  const renderRatingScale = (value: any, label: string, max: number = 5) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-3">{label}</h4>
        <div className="flex space-x-2 items-center">
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded border flex items-center justify-center text-sm ${
                value === num
                  ? 'bg-primary text-white border-primary'
                  : 'bg-secondary border-secondary'
              }`}
            >
              {num}
            </div>
          ))}
          <Badge variant="outline" className="ml-4">
            คะแนน: {value}/{max}
          </Badge>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>น้อยที่สุด</span>
          <span>มากที่สุด</span>
        </div>
      </div>
    );
  };

  const factors = [
    {
      category: "1. ทรัพยากรภายในองค์กร",
      items: [
        { field: "budget_system_development", title: "งบประมาณในการพัฒนาระบบ" },
        { field: "budget_knowledge_development", title: "งบประมาณในการพัฒนาความรู้บุคลากร" },
        { field: "cooperation_between_agencies", title: "ความร่วมมือระหว่างหน่วยงาน" },
        { field: "innovation_ecosystem", title: "ระบบนิเวศนวัตกรรม" },
        { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลจากภาครัฐ" },
      ]
    },
    {
      category: "2. สถานะหน่วยงาน เทศบาล/อปท.",
      items: [
        { field: "digital_infrastructure", title: "โครงสร้างดิจิทัล" },
        { field: "digital_mindset", title: "ความคิดแบบดิจิทัล" },
        { field: "learning_organization", title: "องค์กรแห่งการเรียนรู้" },
        { field: "it_skills", title: "ทักษะด้าน IT" },
        { field: "internal_communication", title: "การสื่อสารภายในองค์กร" },
      ]
    },
    {
      category: "3. พันธะผูกพันของหน่วยงาน",
      items: [
        { field: "policy_continuity", title: "ความต่อเนื่องของนโยบาย" },
        { field: "policy_stability", title: "เสถียรภาพของนโยบาย" },
        { field: "leadership_importance", title: "ความสำคัญที่ผู้นำให้กับการพัฒนานวัตกรรม" },
        { field: "staff_importance", title: "ความสำคัญที่เจ้าหน้าที่ให้กับการพัฒนานวัตกรรม" },
      ]
    },
    {
      category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย",
      items: [
        { field: "communication_to_users", title: "การสื่อสารไปยังผู้ใช้บริการ" },
        { field: "reaching_target_groups", title: "การเข้าถึงกลุ่มเป้าหมาย" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">ส่วนที่ 3</h2>
        <p className="text-lg text-muted-foreground">
          ปัจจัยขับเคลื่อนสู่การเป็นองค์กรที่ขับเคลื่อนด้วยข้อมูล (Data Driven Organization) และการพัฒนานวัตกรรมในองค์กรปกครองส่วนท้องถิ่น
        </p>
      </div>

      {Object.keys(data).length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">ยังไม่มีข้อมูลในส่วนนี้</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>การประเมินปัจจัยขับเคลื่อนนวัตกรรม</CardTitle>
              <p className="text-sm text-muted-foreground">
                กรุณาประเมินระดับความสำคัญของปัจจัยต่อไปนี้ในการขับเคลื่อนนวัตกรรมท้องถิ่นขององค์กรท่าน โดย 1 = น้อยที่สุด และ 5 = มากที่สุด
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {factors.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      {category.category}
                    </h3>
                    <div className="space-y-6 ml-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 border rounded-lg bg-card">
                          {renderRatingScale(data[item.field], item.title)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Section3Viewer;