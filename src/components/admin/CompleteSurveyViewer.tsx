import React, { useMemo, useState } from "react";

/** -----------------------------------------------------------
 *  MAPPING: ใส่ label ภาษาไทยให้คีย์ที่ใช้จริงในแต่ละ section
 *  - ถ้าในข้อมูลมีคีย์ที่ไม่มีใน mapping จะโชว์ชื่อคีย์จริง (กันตกหล่น)
 *  - ปรับแก้ชื่อคีย์และลำดับตามสคีมาของโปรเจกต์คุณได้เลย
 *  ----------------------------------------------------------*/
const sectionFieldLabels: Record<
  "section1" | "section2" | "section3",
  Record<string, string>
> = {
  section1: {
    // ===== ตัวอย่างคีย์ที่พบบ่อยใน Section 1 =====
    section1_goal_achieved: "ผลลัพธ์/บรรลุเป้าหมายจากการเข้าร่วม",
    section1_skill_applied: "ทักษะ/ความรู้ที่ได้นำไปใช้",
    section1_changes: "การเปลี่ยนแปลงหลังเข้าร่วม",
    section1_success_factors: "ปัจจัยแห่งความสำเร็จ",
    section1_problems: "ปัญหา/อุปสรรค",
    section1_problems_other: "ปัญหาอื่น ๆ (ระบุ)",
    section1_suggestions: "ข้อเสนอแนะ/สิ่งที่ควรปรับปรุง",
    // … เพิ่มคีย์จริงที่ใช้ในระบบของคุณให้ครบ
  },
  section2: {
    // ===== ตัวอย่างคีย์ Section 2 =====
    section2_topic: "หัวข้อ/กิจกรรมในโครงการ (ส่วนที่ 2)",
    section2_benefit: "ประโยชน์ที่ได้รับ",
    section2_barriers: "อุปสรรคในการนำไปใช้",
    section2_next_steps: "แนวทางถัดไป",
    // … เพิ่มคีย์จริงให้ครบ
  },
  section3: {
    // ===== ตัวอย่างคีย์ Section 3 =====
    section3_overall_score: "ความพึงพอใจโดยรวม",
    section3_recommendation: "จะแนะนำให้ผู้อื่นเข้าร่วมหรือไม่",
    section3_comment: "ความคิดเห็นเพิ่มเติม",
    // … เพิ่มคีย์จริงให้ครบ
  },
};

/** -----------------------------------------------------------
 *  ลำดับการแสดงผลในแต่ละ Section
 *  - ถ้าคีย์ไหนไม่มีใน order แต่มีข้อมูลจริง ก็จะถูกต่อท้ายให้อัตโนมัติ
 *  ----------------------------------------------------------*/
const sectionFieldOrder: Record<"section1" | "section2" | "section3", string[]> =
  {
    section1: [
      "section1_goal_achieved",
      "section1_skill_applied",
      "section1_changes",
      "section1_success_factors",
      "section1_problems",
      "section1_problems_other",
      "section1_suggestions",
    ],
    section2: ["section2_topic", "section2_benefit", "section2_barriers", "section2_next_steps"],
    section3: ["section3_overall_score", "section3_recommendation", "section3_comment"],
  };

/** ---------- Utils แปลงค่าให้พร้อมแสดง ---------- */
function isNil(v: unknown) {
  return v === null || v === undefined || v === "";
}
function valueToText(v: any): string {
  if (isNil(v)) return "";
  if (Array.isArray(v)) {
    // แปลงอาร์เรย์ของ object/string เป็นข้อความอ่านง่าย
    if (v.length === 0) return "";
    const arr = v.map((item) => {
      if (item === null || item === undefined) return "";
      if (typeof item === "object") {
        // พยายามหยิบฟิลด์พบบ่อย
        if ("label" in item && item.label) return String(item.label);
        if ("name" in item && item.name) return String(item.name);
        if ("value" in item && item.value) return String(item.value);
        return JSON.stringify(item);
      }
      return String(item);
    });
    return arr.filter(Boolean).join(", ");
  }
  if (typeof v === "object") {
    // object เดี่ยว — ลองดึงฟิลด์พบบ่อย
    const known = ["label", "name", "title", "value", "text"];
    for (const k of known) {
      if (k in (v as any) && (v as any)[k]) return String((v as any)[k]);
    }
    return JSON.stringify(v);
  }
  if (typeof v === "boolean") return v ? "ใช่" : "ไม่ใช่";
  return String(v);
}

/** ---------- จัดหมวดให้เป็น section 1/2/3 จากรูปแบบข้อมูลหลากหลาย ---------- */
type AnyDict = Record<string, any>;
type FullResponse = {
  section1?: AnyDict | AnyDict[];
  section2?: AnyDict | AnyDict[];
  section3?: AnyDict | AnyDict[];
  // เผื่อกรณีข้อมูลกระจายอยู่ที่ root เช่น section1_*, section2_*
  [key: string]: any;
};

function normalizeSections(raw: FullResponse) {
  const out: { section1: AnyDict; section2: AnyDict; section3: AnyDict } = {
    section1: {},
    section2: {},
    section3: {},
  };

  const absorb = (dest: AnyDict, src?: AnyDict | AnyDict[]) => {
    if (!src) return;
    if (Array.isArray(src)) {
      // ส่วนใหญ่ section จะเป็น array ที่มี 1 แถว — รวมทั้งหมดเข้าด้วยกันเพื่อกันตกหล่น
      for (const obj of src) Object.assign(dest, obj || {});
    } else {
      Object.assign(dest, src);
    }
  };

  // 1) ถ้ามีคีย์ section1/2/3 อยู่แล้วให้รวมก่อน
  absorb(out.section1, raw.section1);
  absorb(out.section2, raw.section2);
  absorb(out.section3, raw.section3);

  // 2) รวบรวมคีย์แบบ prefix section1_*, section2_*, section3_* ที่อยู่กระจาย
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith("section1_")) out.section1[k] = v;
    else if (k.startsWith("section2_")) out.section2[k] = v;
    else if (k.startsWith("section3_")) out.section3[k] = v;
  }

  return out;
}

/** ---------- คอมโพเนนต์ย่อย: บล็อกหัวข้อของแต่ละ Section ---------- */
function SectionBlock(props: {
  title: string;
  sectionKey: "section1" | "section2" | "section3";
  data: AnyDict;
}) {
  const { title, sectionKey, data } = props;
  const [open, setOpen] = useState(true);

  // จัดลำดับ: ใช้ order ที่กำหนด + คีย์อื่น ๆ ที่มีข้อมูลจริงต่อท้าย
  const orderedKeys = useMemo(() => {
    const labelMap = sectionFieldLabels[sectionKey] || {};
    const order = sectionFieldOrder[sectionKey] || [];
    const dataKeys = Object.keys(data || {});
    const extras = dataKeys.filter((k) => !order.includes(k));
    return [...order, ...extras];
  }, [sectionKey, data]);

  // สร้างรายการแถวที่มีคำตอบจริงเท่านั้น (กันแสดงแถวว่าง)
  const rows = orderedKeys
    .map((key) => {
      const raw = data[key];
      const text = valueToText(raw);
      if (!text) return null;
      const label =
        (sectionFieldLabels[sectionKey] && sectionFieldLabels[sectionKey][key]) ||
        key; // fallback ชื่อคีย์จริง
      return { key, label, text };
    })
    .filter(Boolean) as { key: string; label: string; text: string }[];

  if (rows.length === 0) {
    return (
      <div style={styles.block}>
        <div style={styles.blockHeader} onClick={() => setOpen((o) => !o)}>
          <span style={styles.blockTitle}>{title}</span>
          <button style={styles.toggleBtn}>{open ? "ซ่อน" : "แสดง"}</button>
        </div>
        {open && <div style={styles.emptyNotice}>ไม่มีคำตอบในส่วนนี้</div>}
      </div>
    );
  }

  return (
    <div style={styles.block}>
      <div style={styles.blockHeader} onClick={() => setOpen((o) => !o)}>
        <span style={styles.blockTitle}>{title}</span>
        <button style={styles.toggleBtn}>{open ? "ซ่อน" : "แสดง"}</button>
      </div>
      {open && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <th style={styles.th}>{r.label}</th>
                  <td style={styles.td}>{r.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** ---------- ตัวหลัก: CompleteSurveyViewer ---------- */
export default function CompleteSurveyViewer(props: {
  /** response: อ็อบเจ็กต์คำตอบของผู้ตอบ 1 ราย */
  response: FullResponse;
  /** optional: ชื่อผู้ตอบ/รหัสอ้างอิง */
  title?: string;
}) {
  const { response, title } = props;
  const normalized = useMemo(() => normalizeSections(response), [response]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.headerTitle}>
              {title || "แบบสอบถาม (แสดงครบทุกส่วนในหน้าเดียว)"}
            </h1>
            <div style={styles.headerSub}>
              Scroll ลงเพื่อดูคำตอบทุกข้อของ Section 1, 2, 3
            </div>
          </div>
          <nav style={styles.nav}>
            <a href="#s1" style={styles.navLink}>
              ไปส่วนที่ 1
            </a>
            <a href="#s2" style={styles.navLink}>
              ไปส่วนที่ 2
            </a>
            <a href="#s3" style={styles.navLink}>
              ไปส่วนที่ 3
            </a>
          </nav>
        </div>
      </header>

      {/* Single-page scroll content */}
      <main style={styles.content}>
        <section id="s1">
          <SectionBlock
            title="ส่วนที่ 1 : ผลลัพธ์/การนำไปใช้"
            sectionKey="section1"
            data={normalized.section1}
          />
        </section>

        <section id="s2">
          <SectionBlock
            title="ส่วนที่ 2 : รายละเอียดเชิงลึก/ประโยชน์–อุปสรรค"
            sectionKey="section2"
            data={normalized.section2}
          />
        </section>

        <section id="s3">
          <SectionBlock
            title="ส่วนที่ 3 : ความพึงพอใจ/ข้อเสนอแนะเพิ่มเติม"
            sectionKey="section3"
            data={normalized.section3}
          />
        </section>
      </main>
    </div>
  );
}

/** ---------- สไตล์พื้นฐาน (ไม่พึ่งพา CSS ภายนอก) ---------- */
const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "100%",
    minHeight: "100%",
    background: "#f6f7fb",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    background: "#ffffffcc",
    backdropFilter: "saturate(180%) blur(8px)",
    borderBottom: "1px solid #e5e7eb",
  },
  headerInner: {
    margin: "0 auto",
    maxWidth: 1080,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  headerTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  headerSub: { fontSize: 12, color: "#6b7280" },
  nav: { display: "flex", gap: 12 },
  navLink: {
    fontSize: 13,
    textDecoration: "none",
    border: "1px solid #e5e7eb",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  content: {
    margin: "0 auto",
    maxWidth: 1080,
    padding: 16,
    display: "grid",
    gap: 16,
  },
  block: {
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    overflow: "hidden",
  },
  blockHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    cursor: "pointer",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  blockTitle: { fontWeight: 700, fontSize: 15 },
  toggleBtn: {
    fontSize: 13,
    border: "1px solid #e5e7eb",
    padding: "4px 8px",
    borderRadius: 8,
    background: "#fff",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
  th: {
    width: "34%",
    verticalAlign: "top",
    textAlign: "left",
    background: "#f9fafb",
    padding: "10px 12px",
    borderBottom: "1px solid #f0f2f5",
    fontWeight: 600,
  },
  td: {
    verticalAlign: "top",
    padding: "10px 12px",
    borderBottom: "1px solid #f0f2f5",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  emptyNotice: { padding: 16, color: "#6b7280", fontSize: 13 },
};
