import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- Helpers (normalize & robust checkbox match) ----
const asArray = (v: any): string[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      if (Array.isArray(p)) return p;
    } catch { /* not JSON */ }
    return [v].filter(Boolean);
  }
  if (v == null) return [];
  return [v].filter(Boolean);
};

const norm = (s: any) =>
  String(s)
    .replace(/[“”"']/g, "")   // strip quotes
    .replace(/\s+/g, " ")     // collapse spaces
    .trim();

const checkedOf = (selected: any, label: string) =>
  asArray(selected).some(v => norm(v) === norm(label));

// ----------------- UI helpers อื่น ๆ ของคุณ (ถ้ามี) คงเดิม -----------------

// ✅ แก้ฟังก์ชันให้ทนทาน: ไม่รีเทิร์น null เมื่อไม่ใช่อาร์เรย์ และใช้ checkedOf
const renderCheckboxes = (value: any, options: any[]) => {
  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const label = option.text || option;
        const checked = checkedOf(value, label);
        return (
          <div
            key={index}
            className={`flex items-center space-x-2 p-2 rounded ${
              checked ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                checked ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              {checked && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ----------------- ส่วนคอมโพเนนต์หลัก (คงเดิมของคุณ) -----------------
const Section1Viewer: React.FC<{ data: any }> = ({ data }) => {
  const s1 = data?.section1 || {};

  // ตัวอย่าง: รายการตัวเลือกของข้อ 1.6 / 1.10 ให้ใช้ชุดเดิมของคุณ
  const collabImprovements = [
    "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น",
    "ช่วยให้การบูรณาการข้อมูล/เครื่องมือ ใช้งานร่วมกันได้จริง",
    "ช่วยเชื่อมโยงและประสานภาคีเครือข่ายการพัฒนาเมือง",
    "ช่วยเพิ่มประสิทธิภาพการติดตามประเมินผล/ความโปร่งใส",
    "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น บริษัทพัฒนาเมือง หรือ วิสาหกิจเพื่อสังคม",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ส่วนที่ 1: ก่อนและหลังเวิร์กช็อป</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ตัวอย่างเรียกใช้ข้อ 1.6 / 1.10 */}
          {renderCheckboxes(s1?.improve_collab, collabImprovements)}
        </CardContent>
      </Card>

      {/* … ส่วนอื่น ๆ ของไฟล์คุณคงเดิม เช่น แสดงหัวข้อย่อย ข้อคำถามอื่น ๆ ฯลฯ … */}
    </div>
  );
};

export default Section1Viewer;
