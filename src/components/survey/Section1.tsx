import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Section1Props {
  /**
   * ข้อมูลเริ่มต้น (กรณีแก้ไขคำตอบเดิม)
   */
  data: any;
  /**
   * ฟังก์ชันที่ parent ส่งมาให้บันทึกข้อมูล
   * *ต้อง* คืน Promise เพื่อให้ component รอการบันทึกเสร็จ
   */
  onSave: (data: any) => Promise<void> | void;
  /**
   * ใช้จากภายนอกกรณี parent มี loading ของตัวเอง
   */
  isLoading?: boolean;
}

/**
 * ค่าตั้งต้นของฟอร์ม (รวมทุกช่องที่ใช้ในฟอร์ม)
 */
const defaultFormState: Record<string, any> = {
  // 1.1 ผลลัพธ์ภายหลัง
  section1_knowledge_outcomes: [],
  section1_application_outcomes: [],
  section1_application_other: "",
  // 1.2 อธิบายการเปลี่ยนแปลง
  section1_changes_description: "",
  // 1.3 ปัญหาก่อนอบรม
  section1_problems_before: [],
  // 1.4 การใช้องค์ความรู้
  section1_knowledge_solutions: [],
  section1_knowledge_solutions_other: "",
  section1_knowledge_before: null,
  section1_knowledge_after: null,
  // 1.5 กลไกข้อมูลสารสนเทศ
  section1_it_usage: [],
  section1_it_usage_other: "",
  section1_it_level: null,
  // 1.6 กลไกประสานความร่วมมือ
  section1_cooperation_usage: [],
  section1_cooperation_usage_other: "",
  section1_cooperation_level: null,
  // 1.7 กลไกการระดมทุน
  section1_funding_usage: [],
  section1_funding_usage_other: "",
  section1_funding_level: null,
  // 1.8 กลไกวัฒนธรรม
  section1_culture_usage: [],
  section1_culture_usage_other: "",
  section1_culture_level: null,
  // 1.9 กลไกเศรษฐกิจสีเขียว
  section1_green_usage: [],
  section1_green_usage_other: "",
  section1_green_level: null,
  // 1.10 กลไกการพัฒนาใหม่
  section1_new_dev_usage: [],
  section1_new_dev_usage_other: "",
  // 1.11 ระดับกลไกการพัฒนาใหม่
  section1_new_dev_level: null,
  // 1.12 ปัจจัยความสำเร็จ
  section1_success_factors: [],
  section1_success_factors_other: "",
  // 1.13 อธิบายปัจจัยความสำเร็จ
  section1_success_description: "",
  // 1.14 ระดับการเปลี่ยนแปลง
  section1_overall_change_level: null,
};

const Section1: React.FC<Section1Props> = ({ data, onSave, isLoading = false }) => {
  /** local state */
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  /** สถานะกำลังบันทึกภายใน component */
  const [saving, setSaving] = useState(false);
  /** ตัวจับเวลาสำหรับ auto-save */
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  /* เมื่อ prop `data` เปลี่ยน (กรณีโหลดคำตอบเดิม) รวมเข้ากับ state */
  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  /* Cleanup timer เมื่อ component unmount */
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  /** เพิ่มหรือเอา checkbox ออก (array field) */
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item: string) => item !== value),
    }));
    triggerAutoSave();
  };

  /** อัปเดตช่อง input ทั่วไป */
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    triggerAutoSave();
  };

  /** เพิ่มหรือเอา checkbox ออก (array field) พร้อม validation */
  const handleCheckboxChangeWithValidation = (field: string, value: string, checked: boolean) => {
    // ตรวจสอบ progressive validation
    const validationError = checkProgressiveValidation(field);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item: string) => item !== value),
    }));
    triggerAutoSave();
  };

  /** ตรวจสอบ progressive validation */
  const checkProgressiveValidation = (currentField: string) => {
    // กำหนดลำดับของคำถาม
    const questionOrder = [
      { fields: ['section1_knowledge_outcomes', 'section1_application_outcomes'], question: '1' },
      { fields: ['section1_changes_description'], question: '2' },
      { fields: ['section1_problems_before'], question: '3' },
      { fields: ['section1_knowledge_solutions', 'section1_knowledge_before', 'section1_knowledge_after'], question: '4' },
      { fields: ['section1_it_usage', 'section1_it_level'], question: '5' },
      { fields: ['section1_cooperation_usage', 'section1_cooperation_level'], question: '6' },
      { fields: ['section1_funding_usage', 'section1_funding_level'], question: '7' },
      { fields: ['section1_culture_usage', 'section1_culture_level'], question: '8' },
      { fields: ['section1_green_usage', 'section1_green_level'], question: '9' },
      { fields: ['section1_new_dev_usage', 'section1_new_dev_level'], question: '11' },
      { fields: ['section1_success_factors'], question: '12' },
      { fields: ['section1_success_description'], question: '13' },
      { fields: ['section1_overall_change_level'], question: '14' }
    ];

    // หาตำแหน่งของคำถามปัจจุบัน
    const currentQuestionIndex = questionOrder.findIndex(q => q.fields.includes(currentField));
    if (currentQuestionIndex === -1) return null;

    // ตรวจสอบคำถามก่อนหน้า
    for (let i = 0; i < currentQuestionIndex; i++) {
      const question = questionOrder[i];
      const isQuestionComplete = question.fields.some(field => {
        const value = formData[field];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value && value.toString().trim() !== '';
      });

      if (!isQuestionComplete) {
        return `กรุณาตอบข้อ ${question.question} ให้เสร็จสิ้นก่อน จึงจะสามารถตอบข้อถัดไปได้`;
      }
    }

    return null;
  };

  /** ฟังก์ชัน auto-save */
  const triggerAutoSave = () => {
    // ยกเลิก timer เดิม
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // ตั้ง timer ใหม่
    const timer = setTimeout(async () => {
      try {
        console.log("[Section1] Auto-saving...");
        await onSave(formData);
      } catch (err) {
        console.error("[Section1] Auto-save failed", err);
      }
    }, 2000); // บันทึกหลังจากหยุดพิมพ์ 2 วินาที

    setAutoSaveTimer(timer);
  };

  /**
   * ตรวจสอบความครบถ้วนของข้อมูล
   */
  const validateForm = () => {
    const errors = [];
    
    // ข้อ 1.1 - ต้องเลือกอย่างน้อย 1 ข้อในด้านองค์ความรู้
    if (!formData.section1_knowledge_outcomes || formData.section1_knowledge_outcomes.length === 0) {
      errors.push("กรุณาเลือกผลลัพธ์ด้านองค์ความรู้ในข้อ 1 อย่างน้อย 1 ข้อ");
    }
    
    // ข้อ 1.1 - ต้องเลือกอย่างน้อย 1 ข้อในด้านการประยุกต์ใช้องค์ความรู้
    if (!formData.section1_application_outcomes || formData.section1_application_outcomes.length === 0) {
      errors.push("กรุณาเลือกผลลัพธ์ด้านการประยุกต์ใช้องค์ความรู้ในข้อ 1 อย่างน้อย 1 ข้อ");
    }
    
    // ข้อ 2 - ต้องกรอกอธิบายการเปลี่ยนแปลง
    if (!formData.section1_changes_description || formData.section1_changes_description.trim() === '') {
      errors.push("กรุณากรอกคำอธิบายการเปลี่ยนแปลงในข้อ 2");
    }
    
    // ข้อ 3 - ต้องเลือกปัญหาอย่างน้อย 1 ข้อ
    if (!formData.section1_problems_before || formData.section1_problems_before.length === 0) {
      errors.push("กรุณาเลือกปัญหาก่อนเข้าร่วมอบรมในข้อ 3 อย่างน้อย 1 ข้อ");
    }
    
    // ข้อ 4 - ต้องเลือกวิธีการใช้องค์ความรู้อย่างน้อย 1 ข้อ
    if (!formData.section1_knowledge_solutions || formData.section1_knowledge_solutions.length === 0) {
      errors.push("กรุณาเลือกวิธีการใช้องค์ความรู้ในข้อ 4 อย่างน้อย 1 ข้อ");
    }
    
    // ข้อ 4 - ต้องระบุระดับความรู้ก่อนและหลังอบรม
    if (!formData.section1_knowledge_before) {
      errors.push("กรุณาระบุระดับองค์ความรู้ก่อนเข้าร่วมอบรมในข้อ 4");
    }
    
    if (!formData.section1_knowledge_after) {
      errors.push("กรุณาระบุระดับองค์ความรู้หลังเข้าร่วมอบรมในข้อ 4");
    }
    
    // ข้อ 5-11 - ต้องระบุระดับการใช้กลไกต่างๆ
    const mechanismFields = [
      { field: 'section1_it_level', name: 'กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล', question: '5' },
      { field: 'section1_cooperation_level', name: 'กลไกประสานความร่วมมือ', question: '6' },
      { field: 'section1_funding_level', name: 'กลไกการระดมทุน', question: '7' },
      { field: 'section1_culture_level', name: 'กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น', question: '8' },
      { field: 'section1_green_level', name: 'กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน', question: '9' },
      { field: 'section1_new_dev_level', name: 'กลไกการพัฒนาใหม่', question: '11' }
    ];
    
    mechanismFields.forEach(({ field, name, question }) => {
      if (!formData[field]) {
        errors.push(`กรุณาระบุระดับ${name}ในข้อ ${question}`);
      }
    });
    
    // ข้อ 12 - ต้องเลือกปัจจัยความสำเร็จอย่างน้อย 1 ข้อ
    if (!formData.section1_success_factors || formData.section1_success_factors.length === 0) {
      errors.push("กรุณาเลือกปัจจัยความสำเร็จในข้อ 12 อย่างน้อย 1 ข้อ");
    }
    
    // ข้อ 13 - ต้องกรอกอธิบายปัจจัยความสำเร็จ
    if (!formData.section1_success_description || formData.section1_success_description.trim() === '') {
      errors.push("กรุณากรอกคำอธิบายปัจจัยความสำเร็จในข้อ 13");
    }
    
    // ข้อ 14 - ต้องระบุระดับการเปลี่ยนแปลงโดยรวม
    if (!formData.section1_overall_change_level) {
      errors.push("กรุณาระบุระดับการเปลี่ยนแปลงโดยรวมในข้อ 14");
    }
    
    return errors;
  };

  /**
   * กดปุ่มบันทึก
   * - ตรวจสอบความครบถ้วนก่อน
   * - แสดงสถานะกำลังบันทึก
   * - รอ onSave() เสร็จ (ต้องรับ Promise)
   */
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // ตรวจสอบความครบถ้วนของข้อมูล
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน:\n\n" + validationErrors.join("\n"));
        return;
      }
      
      console.log("[Section1] saving", formData);
      await onSave(formData); // ต้องคืน Promise เพื่อให้ await ทำงาน
    } catch (err) {
      console.error("[Section1] save failed", err);
      alert("บันทึกไม่สำเร็จ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ");
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------- data lists ----------------------------- */
  const knowledgeOutcomes = [
    "มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก",
    "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง",
    "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น",
    "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง",
    "รู้จักเครือข่ายมากขึ้น",
  ];

  const applicationOutcomes = [
    "นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง",
    "สามารถพัฒนาฐานข้อมูลเมืองของตนได้",
    "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้",
    "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง",
  ];

  const problemsBefore = [
    { text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", hasDetail: true },
    { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", hasDetail: true },
    { text: "การบริหารจัดการองค์กร", hasDetail: true },
    { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", hasDetail: true },
    { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", hasDetail: true },
    { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", hasDetail: true },
    { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", hasDetail: true },
    { text: "ขาดเครือข่ายในการพัฒนาเมือง", hasDetail: true },
    { text: "ขาดความรู้ทักษะในการพัฒนาเมือง", hasDetail: true },
    { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง", hasDetail: true },
  ];

  const knowledgeSolutions = [
    "การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น",
    "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.",
    "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน",
    "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ",
    "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น",
    "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)",
    "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด",
    "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)",
  ];

  const itUsage = [
    "ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด",
    "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง",
    "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น",
    "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ",
    "ช่วยในการเพิ่มความเสมอภาคในการบริการ",
    "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
    "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service",
  ];

  const cooperationUsage = [
    "ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน",
    "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา",
    "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ",
    "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
    "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น",
    "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน",
  ];

  const fundingUsage = [
    "ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding",
    "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา",
    "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน",
    "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
  ];

  const cultureUsage = [
    "ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน",
    "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ",
    "ใช้ในการจัดทำหลักสูตรท้องถิ่น",
    "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว",
  ];

  const greenUsage = [
    "ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม",
    "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ",
    "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด",
    "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม",
  ];

  const newDevUsage = [
    "ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ",
    "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น",
    "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่",
    "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น \"บริษัทพัฒนาเมืองหรือ \"วิสาหกิจเพื่อสังคม\"",
    "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน",
  ];

  const successFactors = [
    "ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น",
    "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย",
    "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร",
    "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม",
    "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี",
    "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง",
    "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา",
    "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์",
    "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง",
    "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น",
    "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ",
    "เพิ่มความโปร่งใสในการพัฒนาเมือง",
    "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น",
    'ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า',
    'การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม'
  ];

  const renderCheckboxGroup = (title: string, options: string[], field: string, otherField?: string, showOther = true) => (
    <div className="space-y-3">
      {title && <Label className="text-base font-medium">{title}</Label>}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Checkbox
              id={`${field}-${index}`}
              checked={(formData[field] || []).includes(option)}
              onCheckedChange={(checked) => handleCheckboxChangeWithValidation(field, option, checked as boolean)}
              className="mt-1 flex-shrink-0"
            />
            <Label htmlFor={`${field}-${index}`} className="text-sm leading-5 cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
        {showOther && (
          <div className="flex items-start space-x-2">
            <Checkbox
              id={`${field}-other`}
              checked={(formData[field] || []).includes('อื่น ๆ')}
              onCheckedChange={(checked) => handleCheckboxChangeWithValidation(field, 'อื่น ๆ', checked as boolean)}
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor={`${field}-other`} className="text-sm cursor-pointer">
                อื่น ๆ
              </Label>
              {otherField && (
                <Input
                  placeholder="ระบุ"
                  value={formData[otherField] || ''}
                  onChange={(e) => handleInputChange(otherField, e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProblemsBeforeGroup = (problems: any[]) => (
    <div className="space-y-3">
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {problems.map((problem, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id={`problems-${index}`}
                checked={(formData.section1_problems_before || []).includes(problem.text)}
                onCheckedChange={(checked) => handleCheckboxChangeWithValidation('section1_problems_before', problem.text, checked as boolean)}
                className="mt-1 flex-shrink-0"
              />
              <Label htmlFor={`problems-${index}`} className="text-sm leading-5 cursor-pointer">
                {problem.text}
              </Label>
            </div>
            {problem.hasDetail && (formData.section1_problems_before || []).includes(problem.text) && (
              <div className="ml-6">
                <Input
                  placeholder="ระบุ"
                  value={formData[`section1_problems_detail_${index}`] || ''}
                  onChange={(e) => handleInputChange(`section1_problems_detail_${index}`, e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRatingScale = (title: string, field: string) => (
    <div className="space-y-3">
      {title && <Label className="text-base font-medium">{title}</Label>}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>น้อยที่สุด</span>
          <span>มากที่สุด</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <Button
              key={value}
              type="button"
              variant={formData[field] === value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const validationError = checkProgressiveValidation(field);
                if (validationError) {
                  alert(validationError);
                  return;
                }
                handleInputChange(field, value);
              }}
              className="h-8 text-xs"
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          ส่วนที่ 1 ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ที่เกิดขึ้นจนถึงปัจจุบัน
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. ผลลัพธ์ภายหลังจากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-base mb-3 underline">ด้านองค์ความรู้</h4>
            {renderCheckboxGroup("", knowledgeOutcomes, "section1_knowledge_outcomes", undefined, false)}
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-3 underline">ด้านการประยุกต์ใช้องค์ความรู้</h4>
            {renderCheckboxGroup("", applicationOutcomes, "section1_application_outcomes", "section1_application_other")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน จากองค์ความรู้และการประยุกต์ใช้องค์ความรู้ที่ได้จากการอบรมหลักสูตร พมส. ตามที่ท่านระบุไว้ในข้อ 1.1</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="กรุณาอธิบาย..."
            value={formData.section1_changes_description || ''}
            onChange={(e) => handleInputChange('section1_changes_description', e.target.value)}
            rows={5}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. ก่อนเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ภาพรวมในพื้นที่ของท่านมีปัญหาอะไร</CardTitle>
        </CardHeader>
        <CardContent>
          {renderProblemsBeforeGroup(problemsBefore)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">4. องค์ความรู้ของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ท่านนำไปใช้ประโยชน์ในการแก้ไขปัญหาตามที่ระบุในข้อ 3 อย่างไร (ตอบได้มากกว่า 1 ข้อ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", knowledgeSolutions, "section1_knowledge_solutions", "section1_knowledge_solutions_other")}
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">ก่อนเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด</Label>
                <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
                {renderRatingScale("", "section1_knowledge_before")}
              </div>
              
              <div>
                <Label className="text-base font-medium">หลังเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด</Label>
                <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
                {renderRatingScale("", "section1_knowledge_after")}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-800">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
            <div className="text-sm space-y-1">
              <p><strong>ระดับ 1 :</strong> ไม่ได้ใช้ในการแก้ปัญหา ไม่ตระหนักถึงการมีอยู่</p>
              <p><strong>ระดับ 2 :</strong> ตระหนัก แต่ไม่ได้นำไปใช้ในการแก้ปัญหา</p>
              <p><strong>ระดับ 3 :</strong> นำไปใช้ในการวิเคราะห์ปัญหา หรือคำนึงถึงในงานของตน</p>
              <p><strong>ระดับ 4 :</strong> นำไปใช้ในการออกแบบวิธีการแก้ปัญหา (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)</p>
              <p><strong>ระดับ 5 :</strong> นำไปใช้ในการบรรจุเป็นแผนระดับสำนัก ภายใต้หน่วยงานของตน</p>
              <p><strong>ระดับ 6 :</strong> นำไปใช้บรรจุลงในแผนขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง</p>
              <p><strong>ระดับ 7 :</strong> นำไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ที่อธิบายผลได้อย่างชัดเจน</p>
              <p><strong>ระดับ 8 :</strong> สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้</p>
              <p><strong>ระดับ 9 :</strong> สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้</p>
              <p><strong>ระดับ 10 :</strong> สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5. องค์กรของท่านได้นำ กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", itUsage, "section1_it_usage", "section1_it_usage_other")}
          
          <div>
            <Label className="text-base font-medium">ท่านคิดว่า ในภาพรวม กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>
            <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
            {renderRatingScale("", "section1_it_level")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">6. องค์กรของท่านได้นำ กลไกประสานความร่วมมือ มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", cooperationUsage, "section1_cooperation_usage", "section1_cooperation_usage_other")}
          
          <div>
            <Label className="text-base font-medium">ท่านคิดว่าในภาพรวม กลไกประสานความร่วมมือ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>
            <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
            {renderRatingScale("", "section1_cooperation_level")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">7. องค์กรของท่านได้นำ กลไกการระดมทุน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", fundingUsage, "section1_funding_usage", "section1_funding_usage_other")}
          
          <div>
            <Label className="text-base font-medium">ท่านคิดว่าในภาพรวม กลไกการระดมทุน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>
            <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
            {renderRatingScale("", "section1_funding_level")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">8. องค์กรของท่านได้นำ กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", cultureUsage, "section1_culture_usage", "section1_culture_usage_other")}
          
          <div>
            <Label className="text-base font-medium">ท่านคิดว่าในภาพรวม กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>
            <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
            {renderRatingScale("", "section1_culture_level")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">9. องค์กรของท่านได้นำ กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup("", greenUsage, "section1_green_usage", "section1_green_usage_other")}
          
          <div>
            <Label className="text-base font-medium">ท่านคิดว่าในภาพรวม กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>
            <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
            {renderRatingScale("", "section1_green_level")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">10. องค์กรของท่านได้นำ กลไกการพัฒนาใหม่ (บริษัทพัฒนาเมือง วิสาหกิจเพื่อสังคม สหการ) มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup("", newDevUsage, "section1_new_dev_usage", "section1_new_dev_usage_other")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">11. ท่านคิดว่าในภาพรวม กลไกการพัฒนาใหม่ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
          {renderRatingScale("", "section1_new_dev_level")}
        </CardContent>
      </Card>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3 text-yellow-800">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
        <div className="text-sm space-y-1">
          <p><strong>ระดับ 1 :</strong> ไม่ได้ใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น ไม่ตระหนักถึงการมีอยู่</p>
          <p><strong>ระดับ 2 :</strong> ตระหนัก แต่ไม่ได้นำไปใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น</p>
          <p><strong>ระดับ 3 :</strong> นำไปใช้ในการวิเคราะห์การยกระดับการพัฒนาท้องถิ่น หรือคำนึงถึงในงานของตน</p>
          <p><strong>ระดับ 4 :</strong> นำไปใช้ในการออกแบบการยกระดับการพัฒนาท้องถิ่น (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)</p>
          <p><strong>ระดับ 5 :</strong> นำไปใช้ในการบรรจุเป็นแผนการยกระดับการพัฒนาท้องถิ่นในระดับสำนัก ภายใต้หน่วยงานของตน</p>
          <p><strong>ระดับ 6 :</strong> นำไปใช้บรรจุลงในแผนการยกระดับการพัฒนาท้องถิ่น ขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง</p>
          <p><strong>ระดับ 7 :</strong> นำแผนการยกระดับการพัฒนาท้องถิ่นไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ ที่อธิบายผลได้อย่างชัดเจน</p>
          <p><strong>ระดับ 8 :</strong> สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้</p>
          <p><strong>ระดับ 9 :</strong> สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้</p>
          <p><strong>ระดับ 10 :</strong> สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">12. ท่านคิดว่า องค์ความรู้และการประยุกต์ใช้องค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ในประเด็นใดบ้าง</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup("", successFactors, "section1_success_factors", "section1_success_factors_other")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">13. โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ตามที่ท่านระบุไว้ในข้อ 1.12</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="กรุณาอธิบาย..."
            value={formData.section1_success_description || ''}
            onChange={(e) => handleInputChange('section1_success_description', e.target.value)}
            rows={5}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">14. บทบาทของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ก่อให้เกิดการเปลี่ยนแปลงในพื้นที่ของท่านในระดับใด</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
          {renderRatingScale("", "section1_overall_change_level")}
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-green-800">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
            <div className="text-sm space-y-1">
              <p><strong>ระดับ 1 :</strong> เมืองยังคงเป็นรูปแบบดั้งเดิม ไม่มีการเปลี่ยนแปลง</p>
              <p><strong>ระดับ 2 :</strong> เริ่มมีการวางแผนพัฒนาเมืองเบื้องต้น / เริ่มมีการวางแผนเรื่องระบบข้อมูล</p>
              <p><strong>ระดับ 3 :</strong> มีโครงการพัฒนาเล็ก ๆ แต่ยังไม่มีผลต่อโครงสร้างเมืองโดยรวม</p>
              <p><strong>ระดับ 4 :</strong> เริ่มมีการเปลี่ยนแปลงในโครงสร้างพื้นฐานหรือเศรษฐกิจบางส่วน</p>
              <p><strong>ระดับ 5 :</strong> เมืองเริ่มมีการขยายตัวในระดับปานกลาง เช่น พื้นที่อยู่อาศัย พื้นที่เศรษฐกิจ หรือสาธารณูปโภคใหม่ ๆ</p>
              <p><strong>ระดับ 6 :</strong> เมืองมีการเปลี่ยนแปลงหลายมิติ เช่น การคมนาคมสาธารณะ พื้นที่สีเขียว หรือการฟื้นฟูเมืองเก่า</p>
              <p><strong>ระดับ 7 :</strong> เมืองมีระบบบริหารจัดการที่มีประสิทธิภาพ เช่น การใช้ข้อมูลดิจิทัล (Smart City), การมีส่วนร่วมของประชาชนเพิ่มขึ้น</p>
              <p><strong>ระดับ 8 :</strong> เมืองกลายเป็นศูนย์กลางด้านเศรษฐกิจหรือวัฒนธรรมระดับภูมิภาค มีโครงการพัฒนาขนาดใหญ่ เช่น TOD หรือเขตเศรษฐกิจพิเศษ</p>
              <p><strong>ระดับ 9 :</strong> เมืองพัฒนาในระดับสูง มีความเชื่อมโยงระหว่าง, ใช้แนวคิดยั่งยืน/อัจฉริยะในหลายมิติ</p>
              <p><strong>ระดับ 10 :</strong> เมืองเป็นต้นแบบระดับประเทศหรือโลก เช่น เมืองอัจฉริยะที่ใช้เทคโนโลยีและนโยบายที่ยั่งยืนในทุกด้าน</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-6">
        <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 1"}
        </Button>
      </div>
    </div>
  );
};

export default Section1;
