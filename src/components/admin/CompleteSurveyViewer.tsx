import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

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

// --- โครงสร้างคำถามและตัวเลือกทั้งหมด (คงเดิม) ---
const knowledgeOutcomes = ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่/เศรษฐกิจสร้างสรรค์ และทิศทางการพัฒนาเมืองร่วมสมัยมากขึ้น", "รู้จักและสามารถนำเครื่องมือวางแผน/การจัดการเมืองไปประยุกต์ใช้ในพื้นที่ตนเอง", "ได้แนวปฏิบัติที่ทำได้จริง (Playbook/Checklist/Toolkit) เพื่อนำไปใช้ต่อในหน่วยงาน/องค์กร", "เข้าใจบทบาทหน่วยงาน/องค์กรตนเองในระบบนิเวศการพัฒนาเมือง (Ecosystem) ได้ชัดเจนขึ้น", "เข้าใจโครงสร้างการทำงานร่วมกันระหว่างภาครัฐ-เอกชน-ประชาสังคม และกลไกการเงินเมือง", "เห็นภาพการเชื่อมโยงนโยบายระดับชาติ/จังหวัด/ท้องถิ่นกับการขับเคลื่อนเชิงพื้นที่", "เห็นโอกาสพัฒนาคน/ทักษะดิจิทัล/ทักษะผู้ประกอบการเพื่อรองรับเศรษฐกิจใหม่", "รู้จักแหล่งทุน/เครื่องมือทางการเงินที่เกี่ยวข้องกับการพัฒนาเมือง", "สามารถออกแบบ Roadmap โครงการ/เวิร์กแพลนที่เป็นรูปธรรม", "ต่อยอดเป็นเครือข่ายทำงานร่วมกันต่อเนื่อง"];
const applicationOutcomes = ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติไปทดลองใช้ในพื้นที่จริง", "ปรับปรุงกระบวนการ/กฎระเบียบภายในหน่วยงานให้เอื้อต่อการทำงานข้ามฝ่าย", "ริเริ่มโครงการนำร่อง (Pilot) ที่ใช้ข้อมูล/หลักฐานเชิงประจักษ์", "ใช้ข้อมูลเชิงพื้นที่/ข้อมูลเปิดในการตัดสินใจและติดตามผล", "ประยุกต์ใช้เครื่องมือทางนโยบายสาธารณะ/การเงินการคลังท้องถิ่น", "ขยายผลโครงการที่สำเร็จ/ดึงภาคีเพิ่ม", "พัฒนาคน/ทีม/คลังความรู้ให้ยั่งยืน", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"];
const problemsBefore = [{ text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่ แต่ยังขาดเครื่องมือวิเคราะห์/วางแผน", hasDetail: false }, { text: "ข้อมูลเชิงพื้นที่/ข้อมูลเปิดกระจัดกระจาย ใช้ไม่สะดวก", hasDetail: false }, { text: "ข้อจำกัดด้านงบประมาณ/ระเบียบการเงินการคลัง", hasDetail: false }, { text: "การบูรณาการ/ทำงานข้ามหน่วยงานยังไม่ลื่นไหล", hasDetail: false }, { text: "ขาดความเชื่อมโยงนโยบายชาติ-จังหวัด-ท้องถิ่น", hasDetail: false }, { text: "ต้องการยกระดับเศรษฐกิจใหม่/ยกระดับคุณภาพชีวิต แต่ยังไม่ชัดว่าจะเริ่มตรงไหน", hasDetail: false }, { text: "อื่น ๆ (โปรดระบุ)", hasDetail: true }];
const capacityNeeds = ["ฝึกใช้ข้อมูลเชิงพื้นที่/แผนที่/แดชบอร์ด", "เครื่องมือวิเคราะห์โครงการและผลกระทบ", "การออกแบบ Roadmap/แผนปฏิบัติการ", "การสื่อสาร/การมีส่วนร่วม/การสร้างฉันทามติ", "เครื่องมือทางการเงิน/แหล่งทุน/กองทุนท้องถิ่น", "การทำงานข้ามหน่วยงาน/การบริหารพหุภาคี", "อื่น ๆ (โปรดระบุ)"];
const collabImprovements = ["ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยให้การบูรณาการข้อมูล/เครื่องมือ ใช้งานร่วมกันได้จริง", "ช่วยเชื่อมโยงและประสานภาคีเครือข่ายการพัฒนาเมือง", "ช่วยเพิ่มประสิทธิภาพการติดตามประเมินผล/ความโปร่งใส", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น บริษัทพัฒนาเมือง หรือ วิสาหกิจเพื่อสังคม"];
const postWorkshopNeeds = ["เวิร์กช็อปเชิงลึกเฉพาะประเด็น", "คลินิกปรึกษา (Coaching/Mentoring)", "แหล่งความรู้/คู่มือ/ตัวอย่างโครงการ (Knowledge Hub)", "เวทีแลกเปลี่ยน/จับคู่ความร่วมมือ", "สนับสนุนเครื่องมือ/ซอฟต์แวร์/ข้อมูล"];
const preferFormats = ["เวิร์กช็อปลงมือทำ (Hands-on)", "คลินิก/ให้คำปรึกษา", "บรรยาย+เสวนา (Lecture+Panel)", "เรียนออนไลน์/แบบผสมผสาน", "แลกเปลี่ยนเรียนรู้ (Peer Learning)"];

// ... (โค้ดคงเดิมของคุณก่อนหน้าต่าง ๆ: utility, หมวด render ต่าง ๆ ฯลฯ) ...

// ✅ เวอร์ชันใหม่ของฟังก์ชัน checkbox ให้ทนทานขึ้น
const renderCheckboxes = (
  title: string,
  options: string[],
  selectedValues: any,
  otherValue?: string,
  showOther = true
) => (
  <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
    <h4 className="font-semibold mb-3">{title}</h4>
    <div className="space-y-2">
      {options.map((opt, i) => {
        const checked = checkedOf(selectedValues, opt);
        return (
          <div key={i} className="flex items-start space-x-3">
            <div className={`mt-1 w-5 h-5 r-m border-2 flex items-center justify-center shrink-0 ${
              checked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'
            }`}>
              {checked && <span className="text-white font-bold text-xs">✓</span>}
            </div>
            <span className={`text-sm ${checked ? '' : 'text-gray-500'}`}>{opt}</span>
          </div>
        );
      })}
      {showOther && (
        <div className="flex items-start space-x-3">
          <div className="mt-1 w-5 h-5 r-m border-2 bg-white border-gray-300 shrink-0" />
          <span className="text-sm text-gray-500">อื่น ๆ</span>
        </div>
      )}
      {otherValue && (
        <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-800">{otherValue}</p>
        </div>
      )}
    </div>
  </div>
);

// ------- (ส่วนอื่น ๆ ของไฟล์คุณคงเดิมทั้งหมดด้านล่างนี้) -------

// ………………………………………..
// อ้างอิงส่วนแสดงผลหลัก/ส่วนย่อยต่าง ๆ ของคุณตามต้นฉบับ
// ………………………………………..

// ตัวอย่างสเตต/พรินต์และหน้าหลัก (คงเดิมของคุณ)
const CompleteSurveyViewer: React.FC<{ data: any }> = ({ data }) => {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-bold">สรุปคำตอบแบบครบทุกส่วน</h2>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์/บันทึก PDF
        </Button>
      </div>

      {/* … ใช้ renderCheckboxes และเรนเดอร์ส่วนต่าง ๆ ตามไฟล์เดิมของคุณ … */}

      <Card className="print-section">
        <CardHeader>
          <CardTitle>ตัวอย่าง</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ตัวอย่างเรียกใช้ */}
          <div className="p-2 bg-gray-100 rounded">
            ด้านความร่วมมือ:
            {renderCheckboxes(
              "ผลลัพธ์ด้านความร่วมมือหลังเวิร์กช็อป",
              collabImprovements,
              data?.section1?.improve_collab,
              data?.section1?.improve_collab_other
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CompleteSurveyViewer;
