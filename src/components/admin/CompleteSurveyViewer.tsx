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
  // -------- Section 1 (ตัวอย่างที่พบบ่อย) --------
  section1_problems_before: "1.1 ปัญหาก่อนดำเนินงาน",
  section1_knowledge_solutions: "1.2 ความรู้/แนวทางแก้ปัญหาที่ใช้",
  section1_knowledge_solutions_other: "อื่น ๆ (ระบุ)",
  section1_it_tools: "1.x เครื่องมือ/ระบบ IT ที่ใช้",
  section1_it_tools_other: "อื่น ๆ (ระบุ) - IT",
  section1_cooperation_mechanisms: "1.x กลไกความร่วมมือ",
  section1_cooperation_mechanisms_other: "อื่น ๆ (ระบุ) - ความร่วมมือ",
  section1_funding_mechanisms: "1.x กลไกด้านทุน/งบประมาณ",
  section1_funding_mechanisms_other: "อื่น ๆ (ระบุ) - ทุน",
  section1_culture_mechanisms: "1.x วัฒนธรรมการทำงาน/การมีส่วนร่วม",
  section1_culture_mechanisms_other: "อื่น ๆ (ระบุ) - วัฒนธรรม",
  section1_green_mechanisms: "1.x แนวทาง Green/ยั่งยืน",
  section1_green_mechanisms_other: "อื่น ๆ (ระบุ) - Green",
  section1_new_dev_mechanisms: "1.x การพัฒนา/นวัตกรรมใหม่",
  section1_new_dev_mechanisms_other: "อื่น ๆ (ระบุ) - นวัตกรรม",
  section1_success_factors: "1.x ปัจจัยแห่งความสำเร็จ (เลือกได้หลายข้อ)",
  section1_success_factors_description: "อธิบายเพิ่มเติม - ปัจจัยความสำเร็จ",
  section1_overall_change_level: "1.x ระดับการเปลี่ยนแปลงโดยรวม (1–10)",

  // -------- Section 2 --------
  section2_data_types: "2.1 ชุดข้อมูลที่ใช้ (เลือกได้หลายข้อ)",
  section2_data_types_other: "อื่น ๆ (ระบุ) - ชุดข้อมูล",
  section2_data_sources: "2.2 แหล่งที่มาของข้อมูล",
  section2_data_level: "2.3 ระดับการใช้ประโยชน์จากข้อมูล (1–10)",
  section2_applications: "2.4 แอป/การประยุกต์ใช้งาน",
  section2_applications_other: "อื่น ๆ (ระบุ) - แอป/การประยุกต์",
  section2_network_expansion: "2.5 การขยายเครือข่าย/ภาคี",
  section2_network_expansion_other: "อื่น ๆ (ระบุ) - เครือข่าย",

  // -------- Section 3 (ตัวอย่างสเกล 1–10) --------
  budget_system_development: "3.1 ระบบงบประมาณเพื่อพัฒนาระบบ/นวัตกรรม (1–10)",
  digital_infrastructure: "3.2 โครงสร้างพื้นฐานดิจิทัล (1–10)",
  policy_continuity: "3.3 ความต่อเนื่องนโยบาย (1–10)",
  communication_to_users: "3.4 การสื่อสารกับผู้ใช้บริการ (1–10)",
  human_resource_capacity: "3.5 ศักยภาพบุคลากร (1–10)",
  data_governance: "3.6 ธรรมาภิบาลข้อมูล (1–10)",
  service_quality: "3.7 คุณภาพการให้บริการ (1–10)",
  monitoring_evaluation: "3.8 การติดตามและประเมินผล (1–10)",
  scalability_readiness: "3.9 ความพร้อมในการขยายผล (1–10)",
  sustainability_outlook: "3.10 ความยั่งยืน (1–10)",
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
