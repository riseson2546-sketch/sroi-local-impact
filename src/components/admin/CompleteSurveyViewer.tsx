import React from "react";

/**
 * ประเภทข้อมูลที่คอมโพเนนต์นี้คาดหวัง
 * - data.section1 / data.section2 / data.section3 เป็น Record<string, any>
 * - โครงสร้างนี้มักมาจาก transformResponseData(...) ใน AdminDashboard
 */
type AdminTransformedResponse = {
  user?: {
    full_name?: string;
    position?: string;
    organization?: string;
    phone?: string;
    email?: string;
  };
  created_at?: string;
  section1?: Record<string, any>;
  section2?: Record<string, any>;
  section3?: Record<string, any>;
};

type CompleteSurveyViewerProps = {
  data: AdminTransformedResponse;
};

const EXCLUDED_KEYS = new Set([
  "id",
  "created_at",
  "updated_at",
  "user_id",
  "response_id",
  "auth_user_id",
]);

/**
 * แม็ปชื่อคีย์ → ป้ายคำถามภาษาไทย
 * - เติม/แก้เพิ่มได้ตามต้องการ
 * - ถ้าไม่มีในแม็ป จะ fallback เป็นการแปลง snake_case → ชื่ออ่านง่าย
 */
const fieldLabels: Record<string, string> = {
  // ---------------- Section 1 ----------------
  // 1) ผลลัพธ์หลังอบรม (แบ่งเป็นองค์ความรู้/การประยุกต์ใช้)
  section1_knowledge_outcomes: "1.1 ผลลัพธ์ด้านองค์ความรู้ภายหลังจากการเข้าร่วมอบรม (พมส.)",
  section1_application_outcomes: "1.2 ผลลัพธ์ด้านการประยุกต์ใช้องค์ความรู้ภายหลังจากการเข้าร่วมอบรม (พมส.)",
  section1_application_other: "อื่น ๆ (ระบุ) — ผลลัพธ์ด้านการประยุกต์ใช้",
  // 2) อธิบายการเปลี่ยนแปลง
  section1_changes_description: "2. โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน",
  // 3) ปัญหาก่อนอบรม
  section1_problems_before: "3. ก่อนเข้าร่วมอบรม (พมส.) พื้นที่ของท่านมีปัญหาอะไรบ้าง",
  // 4) การใช้องค์ความรู้แก้ปัญหา + ระดับความรู้ก่อน/หลัง
  section1_knowledge_solutions: "4. ท่านได้นำองค์ความรู้จาก (พมส.) ไปใช้แก้ปัญหาที่ระบุในข้อ 3 อย่างไร",
  section1_knowledge_solutions_other: "อื่น ๆ (ระบุ) — แนวทางการใช้องค์ความรู้",
  section1_knowledge_before: "ระดับองค์ความรู้ก่อนเข้าร่วมอบรม (1–10)",
  section1_knowledge_after:  "ระดับองค์ความรู้ภายหลังการเข้าร่วมอบรม (1–10)",
  // 5) กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล
  section1_it_usage:  "5. องค์กรของท่านได้นำ ‘กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล’ มาใช้ในการยกระดับการพัฒนาเมืองอย่างไรบ้าง",
  section1_it_usage_other: "อื่น ๆ (ระบุ) — กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล",
  section1_it_level:  "ระดับการยกระดับด้วยกลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล (1–10)",
  // 6) กลไกประสานความร่วมมือ
  section1_cooperation_usage:  "6. องค์กรของท่านได้นำ ‘กลไกประสานความร่วมมือ’ มาใช้ในการยกระดับการพัฒนาเมืองอย่างไรบ้าง",
  section1_cooperation_usage_other: "อื่น ๆ (ระบุ) — กลไกประสานความร่วมมือ",
  section1_cooperation_level:  "ระดับการยกระดับด้วยกลไกประสานความร่วมมือ (1–10)",
  // 7) กลไกการระดมทุน
  section1_funding_usage:  "7. องค์กรของท่านได้นำ ‘กลไกการระดมทุน’ มาใช้ในการยกระดับการพัฒนาเมืองอย่างไรบ้าง",
  section1_funding_usage_other: "อื่น ๆ (ระบุ) — กลไกการระดมทุน",
  section1_funding_level:  "ระดับการยกระดับด้วยกลไกการระดมทุน (1–10)",
  // 8) กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น
  section1_culture_usage:  "8. องค์กรของท่านได้นำ ‘กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น’ มาใช้ในการยกระดับการพัฒนาเมืองอย่างไรบ้าง",
  section1_culture_usage_other: "อื่น ๆ (ระบุ) — กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น",
  section1_culture_level:  "ระดับการยกระดับด้วยกลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น (1–10)",
  // 9) กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน
  section1_green_usage:  "9. องค์กรของท่านได้นำ ‘กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน’ มาใช้ในการยกระดับการพัฒนาเมืองอย่างไรบ้าง",
  section1_green_usage_other: "อื่น ๆ (ระบุ) — กลไกเศรษฐกิจสีเขียว/หมุนเวียน",
  section1_green_level:  "ระดับการยกระดับด้วยกลไกเศรษฐกิจสีเขียว/หมุนเวียน (1–10)",
  // 10–11) กลไกการพัฒนาใหม่
  section1_new_dev_usage:  "10. องค์กรของท่านได้นำ ‘กลไกการพัฒนาใหม่ (บริษัทพัฒนาเมือง/วิสาหกิจเพื่อสังคม ฯลฯ)’ มาใช้อย่างไรบ้าง",
  section1_new_dev_usage_other: "อื่น ๆ (ระบุ) — กลไกการพัฒนาใหม่",
  section1_new_dev_level:  "11. ในภาพรวม กลไกการพัฒนาใหม่ช่วยยกระดับการพัฒนาเมืองของท่านในระดับใด (1–10)",
  // 12) ปัจจัยความสำเร็จ
  section1_success_factors: "12. ท่านคิดว่าองค์ความรู้และการประยุกต์ใช้องค์ความรู้จาก (พมส.) ส่งผลต่อพื้นที่ของท่านในประเด็นใดบ้าง (เลือกได้หลายข้อ)",
  section1_success_factors_other: "อื่น ๆ (ระบุ) — ปัจจัยความสำเร็จ",
  // 13) อธิบายปัจจัยความสำเร็จ
  section1_success_description: "13. โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน (ต่อจากข้อ 1.12)",
  // 14) ระดับการเปลี่ยนแปลงโดยรวม
  section1_overall_change_level: "14. บทบาทของหลักสูตร (พมส.) ก่อให้เกิดการเปลี่ยนแปลงโดยรวมในพื้นที่ของท่านในระดับใด (1–10)",

  // ---------------- Section 2 ----------------
  // หมวด 1: การใช้องค์ความรู้ในการพัฒนาข้อมูลเมือง
  section2_data_types: "1) ในการพัฒนาเมือง ได้ใช้ ‘ชุดข้อมูล’ ใดบ้างในการพัฒนา (เลือกได้หลายข้อ)",
  section2_data_types_other: "อื่น ๆ (ระบุ) — ชุดข้อมูลที่ใช้",
  section2_data_sources: "2) ตามที่ได้ดำเนินการ ข้อมูลมาจากที่ใด/แหล่งทุน/หน่วยงานที่สนับสนุน",
  section2_partner_organizations: "3) ในการพัฒนาข้อมูล/ฐานข้อมูล มีหน่วยงานใดเข้ามาร่วมบ้าง (เลือกได้หลายข้อ)",
  section2_partner_organizations_other: "อื่น ๆ (ระบุ) — หน่วยงานที่ร่วม",
  section2_partner_participation: "4) หน่วยงานที่ร่วมเข้าร่วมอย่างไร (ลักษณะการมีส่วนร่วม)",

  // หมวด 2: การตอบโจทย์/ประโยชน์ของชุดข้อมูล
  section2_data_benefits: "2. ชุดข้อมูลเมืองที่พัฒนาขึ้น สามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด (เลือกได้หลายข้อ)",
  section2_data_level: "3. ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด (1–10)",

  // หมวด 3: การพัฒนาต่อเนื่อง
  section2_continued_development: "4. ปัจจุบันการพัฒนาชุดข้อมูลยังได้มีการพัฒนาอย่างต่อเนื่องหรือไม่ (ได้อะไร ขาดอะไร ยังต้องการข้อมูลใด)",

  // หมวด 4–5: แอปพลิเคชันและเครือข่าย
  section2_applications: "5. องค์กรของท่านมีแอปพลิเคชันที่ใช้ในการพัฒนาเมืองหรือไม่ (รายละเอียดแอปพลิเคชัน)",
  section2_network_expansion: "6. ปัจจุบันองค์กรของท่านได้ขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือด้านใด",

  // ---------------- Section 3 ----------------
  // 1) ทรัพยากรภายในองค์กร
  budget_system_development:      "งบประมาณจัดสรรในการพัฒนาระบบ",
  budget_knowledge_development:   "งบประมาณจัดสรรในการพัฒนาองค์ความรู้",
  cooperation_between_agencies:   "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย",
  innovation_ecosystem:           "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม",
  government_digital_support:     "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐ (ภารกิจพื้นฐานของท้องถิ่น)",
  // 2) สถานะหน่วยงาน เทศบาล/อปท.
  digital_infrastructure:         "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)",
  digital_mindset:                "บุคลากรภายในหน่วยงานมีชุดความคิดแบบดิจิทัล (Digital Mindset)",
  learning_organization:          "เป็นองค์กรแห่งการเรียนรู้ที่พร้อมพัฒนานวัตกรรม",
  it_skills:                      "เจ้าหน้าที่ที่เกี่ยวข้องกับนวัตกรรมดิจิทัล มีความรู้ทักษะด้าน IT เพียงพอ",
  internal_communication:         "ประสิทธิภาพในการสื่อสารภายในองค์กร",
  // 3) พันธะผูกพันของหน่วยงาน
  policy_continuity:              "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น",
  policy_stability:               "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม",
  leadership_importance:          "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น",
  staff_importance:               "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น",
  // 4) การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย
  communication_to_users:         "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ",
  reaching_target_groups:         "การสื่อสารข้อมูลนวัตกรรมท้องถิ่นสามารถเข้าถึงกลุ่มเป้าหมาย",
};

/** ฟิลด์ที่ควรตีความเป็นเรตติ้ง 1–10 หากค่าที่ได้เป็นตัวเลข */
const RATING_KEY_HINTS = [
  "level",
  "score",
  "rating",
  "readiness",
  "capacity",
  "quality",
  "sustainability",
  "development",
  "infrastructure",
  "continuity",
  "communication",
  "governance",
  "evaluation",
];

/** ตรวจว่าคีย์นี้ “น่าจะ” เป็นเรตติ้ง 1–10 */
function looksLikeRatingKey(key: string) {
  const k = key.toLowerCase();
  return RATING_KEY_HINTS.some((h) => k.includes(h));
}

/** แปลง snake_case → ป้ายอ่านง่าย (fallback) */
function prettifyKey(key: string) {
  // ตัด prefix section1_/2_/3_
  const cleaned = key.replace(/^section[123]_/, "");
  return cleaned
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** เรนเดอร์สเกล 1–10 แบบอ่านง่าย */
function RatingBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(10, value));
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-sm border ${i < clamped ? "bg-gray-800" : "bg-white"}`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">{clamped} / 10</span>
    </div>
  );
}

/** เรนเดอร์ค่า array (checkbox/multi-select) + อื่น ๆ ถ้ามี */
function ArrayChips({
  items,
  otherText,
}: {
  items: any[];
  otherText?: string | null;
}) {
  if (!Array.isArray(items) || items.length === 0) return <span className="text-gray-500">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <span
          key={`${String(it)}-${idx}`}
          className="inline-block rounded-full border px-2 py-1 text-xs"
        >
          {String(it)}
        </span>
      ))}
      {otherText && otherText.trim() !== "" && (
        <span className="inline-block rounded-full border px-2 py-1 text-xs">
          อื่น ๆ: {otherText}
        </span>
      )}
    </div>
  );
}

/** เรนเดอร์ค่าเดี่ยวตามชนิดข้อมูล */
function renderValueForKey(
  sectionObj: Record<string, any>,
  key: string
): React.ReactNode {
  const value = sectionObj?.[key];

  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-500">—</span>;
  }

  // ถ้าเป็นอาเรย์ → chips และพ่วง *_other ถ้ามี
  if (Array.isArray(value)) {
    const other = sectionObj?.[`${key}_other`];
    return <ArrayChips items={value} otherText={other} />;
  }

  // ถ้าเป็น boolean → ใช่/ไม่ใช่
  if (typeof value === "boolean") {
    return (
      <span className="inline-block rounded border px-2 py-0.5 text-xs">
        {value ? "ใช่" : "ไม่ใช่"}
      </span>
    );
  }

  // ถ้าเป็นตัวเลข → ถ้าดูเหมือนเรตติ้ง 1–10 ให้แสดง RatingBar, ไม่งั้นแสดงตัวเลขปกติ
  if (typeof value === "number") {
    if (looksLikeRatingKey(key)) {
      return <RatingBar value={value} />;
    }
    // ถ้าคีย์ endsWith _level ก็ถือว่าเป็นเรตติ้ง
    if (/_level$/.test(key)) {
      return <RatingBar value={value} />;
    }
    return <span>{value}</span>;
  }

  // อื่น ๆ → แสดงเป็นข้อความ (รองรับข้อความยาว)
  return <span className="whitespace-pre-wrap break-words">{String(value)}</span>;
}

/** จัดเรียงคีย์: เอาคีย์เนื้อหาก่อน เมตาคีย์หลังสุด */
function sortKeysForDisplay(keys: string[]) {
  return keys
    .filter((k) => !EXCLUDED_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b));
}

/** เรนเดอร์หนึ่งเซคชัน */
function SectionBlock({
  title,
  obj,
}: {
  title: string;
  obj?: Record<string, any>;
}) {
  if (!obj || Object.keys(obj).length === 0) {
    return null;
  }

  const keys = sortKeysForDisplay(Object.keys(obj));

  if (keys.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="rounded-md border">
        <div className="divide-y">
          {keys.map((key) => {
            const label = fieldLabels[key] ?? fieldLabels[key.toLowerCase()] ?? prettifyKey(key);
            return (
              <div key={key} className="grid grid-cols-12 gap-3 p-3">
                <div className="col-span-12 md:col-span-4 text-sm font-medium text-gray-700">
                  {label}
                </div>
                <div className="col-span-12 md:col-span-8 text-sm">
                  {renderValueForKey(obj, key)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CompleteSurveyViewer({ data }: CompleteSurveyViewerProps) {
  const user = data?.user;

  return (
    <div className="space-y-6">
      {/* Header: ข้อมูลผู้ตอบ + เวลา */}
      <div className="rounded-md border p-4">
        <h2 className="text-xl font-semibold">รายละเอียดคำตอบ</h2>
        <div className="mt-3 grid grid-cols-12 gap-3 text-sm">
          <div className="col-span-12 md:col-span-6">
            <div><span className="text-gray-600">ชื่อ-สกุล: </span>{user?.full_name ?? "—"}</div>
            <div><span className="text-gray-600">ตำแหน่ง/บทบาท: </span>{user?.position ?? "—"}</div>
            <div><span className="text-gray-600">องค์กร: </span>{user?.organization ?? "—"}</div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div><span className="text-gray-600">โทร: </span>{user?.phone ?? "—"}</div>
            <div><span className="text-gray-600">อีเมล: </span>{user?.email ?? "—"}</div>
            <div><span className="text-gray-600">ส่งเมื่อ: </span>{data?.created_at ? new Date(data.created_at).toLocaleString() : "—"}</div>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <SectionBlock title="ส่วนที่ 1: ข้อมูลเชิงกระบวนการ/การดำเนินงาน" obj={data.section1} />

      {/* Section 2 */}
      <SectionBlock title="ส่วนที่ 2: ข้อมูล/การใช้ประโยชน์/เครือข่าย" obj={data.section2} />

      {/* Section 3 */}
      <SectionBlock title="ส่วนที่ 3: ปัจจัยเชิงระบบ/ความพร้อม/ความยั่งยืน" obj={data.section3} />
    </div>
  );
}
