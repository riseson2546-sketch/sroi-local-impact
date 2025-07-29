import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

// Props and Default State (no changes needed)
interface Section1Props {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  isLoading?: boolean;
  onNextSection?: () => void;
  onPrevSection?: () => void;
  isFirstSection?: boolean;
  isLastSection?: boolean;
}

const defaultFormState: Record<string, any> = {
  section1_knowledge_outcomes: [],
  section1_application_outcomes: [],
  section1_application_other: "",
  section1_changes_description: "",
  section1_problems_before: [],
  section1_knowledge_solutions: [],
  section1_knowledge_solutions_other: "",
  section1_knowledge_before: null,
  section1_knowledge_after: null,
  section1_it_usage: [],
  section1_it_usage_other: "",
  section1_it_level: null,
  section1_cooperation_usage: [],
  section1_cooperation_usage_other: "",
  section1_cooperation_level: null,
  section1_funding_usage: [],
  section1_funding_usage_other: "",
  section1_funding_level: null,
  section1_culture_usage: [],
  section1_culture_usage_other: "",
  section1_culture_level: null,
  section1_green_usage: [],
  section1_green_usage_other: "",
  section1_green_level: null,
  section1_new_dev_usage: [],
  section1_new_dev_usage_other: "",
  section1_new_dev_level: null,
  section1_success_factors: [],
  section1_success_factors_other: "",
  section1_success_description: "",
  section1_overall_change_level: null,
};


const Section1: React.FC<Section1Props> = ({ data, onSave, isLoading = false, onNextSection, onPrevSection }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(prev => ({ ...defaultFormState, ...prev, ...data }));
  }, [data]);

  const formSteps = [
    { id: '1.1', title: '1.1 ผลลัพธ์ภายหลังจากการเข้าร่วมอบรมฯ', required: ['section1_knowledge_outcomes', 'section1_application_outcomes'] },
    { id: '1.2', title: '1.2 อธิบายการเปลี่ยนแปลงที่เกิดขึ้น', required: ['section1_changes_description'] },
    { id: '1.3', title: '1.3 ปัญหาก่อนเข้าร่วมอบรม', required: ['section1_problems_before'] },
    { id: '1.4', title: '1.4 การใช้องค์ความรู้', required: ['section1_knowledge_solutions', 'section1_knowledge_before', 'section1_knowledge_after'] },
    { id: '1.5', title: '1.5 กลไกข้อมูลสารสนเทศฯ', required: ['section1_it_usage', 'section1_it_level'] },
    { id: '1.6', title: '1.6 กลไกประสานความร่วมมือ', required: ['section1_cooperation_usage', 'section1_cooperation_level'] },
    { id: '1.7', title: '1.7 กลไกการระดมทุน', required: ['section1_funding_usage', 'section1_funding_level'] },
    { id: '1.8', title: '1.8 กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น', required: ['section1_culture_usage', 'section1_culture_level'] },
    { id: '1.9', title: '1.9 กลไกเศรษฐกิจสีเขียวฯ', required: ['section1_green_usage', 'section1_green_level'] },
    { id: '1.10-1.11', title: '1.10-1.11 กลไกการพัฒนาใหม่', required: ['section1_new_dev_usage', 'section1_new_dev_level'] },
    { id: '1.12', title: '1.12 ปัจจัยความสำเร็จ', required: ['section1_success_factors'] },
    { id: '1.13', title: '1.13 อธิบายปัจจัยความสำเร็จ', required: ['section1_success_description'] },
    { id: '1.14', title: '1.14 ระดับการเปลี่ยนแปลง', required: ['section1_overall_change_level'] }
  ];

  const validateCurrentStep = () => {
    // Validation logic (no changes)
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];
    currentStepData.required.forEach(field => {
      const value = formData[field];
      if (Array.isArray(value) && value.length === 0) errors.push(`กรุณาเลือกอย่างน้อย 1 ตัวเลือก`);
      else if (typeof value === 'string' && !value.trim()) errors.push(`กรุณากรอกข้อมูล`);
      else if (value === null || value === undefined) errors.push(`กรุณาเลือกคำตอบ`);
    });
    if (formData.section1_application_outcomes?.includes('อื่น ๆ') && !formData.section1_application_other?.trim()) {
      errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของด้านการประยุกต์ใช้องค์ความรู้');
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleNext = () => { if (validateCurrentStep()) { setCurrentStep(p => p + 1); setValidationErrors([]); } };
  const handlePrev = () => { setCurrentStep(p => p - 1); setValidationErrors([]); };
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => { setFormData(p => ({ ...p, [field]: checked ? [...(p[field] || []), value] : (p[field] || []).filter((i: string) => i !== value) })); };
  const handleInputChange = (field: string, value: any) => { setFormData(p => ({ ...p, [field]: value })); };
  const handleSave = async () => { try { setSaving(true); await onSave(formData); } catch (err) { console.error("Save failed", err); } finally { setSaving(false); } };
  
  // Data sources (updated to be 100% accurate)
  const knowledgeOutcomes = ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก", "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง", "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น", "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง", "รู้จักเครือข่ายมากขึ้น"];
  const applicationOutcomes = ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง", "สามารถพัฒนาฐานข้อมูลเมืองของตนได้", "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"];
  const problemsBefore = [{ text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", hasDetail: true }, { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", hasDetail: true }, { text: "การบริหารจัดการองค์กร", hasDetail: true }, { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", hasDetail: true }, { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", hasDetail: true }, { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", hasDetail: true }, { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", hasDetail: true }, { text: "ขาดเครือข่ายในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดความรู้ทักษะในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง", hasDetail: true }];
  const knowledgeSolutions = ["การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น", "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.", "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน", "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ", "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น", "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)", "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด", "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)"];
  const itUsage = ["ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด", "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง", "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการเพิ่มความเสมอภาคในการบริการ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service"];
  const cooperationUsage = ["ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน", "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาโครงการได้ดีขึ้น ขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน"];
  const fundingUsage = ["ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding", "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน", "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน"];
  const cultureUsage = ["ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน", "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ", "ใช้ในการจัดทำหลักสูตรท้องถิ่น", "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว"];
  const greenUsage = ["ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม", "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ", "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด", "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม"];
  const newDevUsage = ["ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ", "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น", "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น “บริษัทพัฒนาเมืองหรือ “วิสาหกิจเพื่อสังคม”", "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน"];
  const successFactors = ["ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น", "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย", "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร", "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม", "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี", "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง", "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา", "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์", "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง", "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น", "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ", "เพิ่มความโปร่งใสในการพัฒนาเมือง", "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น", 'ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า', 'การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม'];

  // Render Helpers
  const renderCheckboxGroup = (options: string[], field: string, otherField?: string) => (
      <div className="space-y-3">{options.map((opt, i) => (<div key={i} className="flex items-start space-x-3"><Checkbox id={`${field}-${i}`} checked={(formData[field] || []).includes(opt)} onCheckedChange={c => handleCheckboxChange(field, opt, !!c)} className="mt-1" /><Label htmlFor={`${field}-${i}`} className="font-normal cursor-pointer">{opt}</Label></div>))}{otherField && (<div className="flex items-start space-x-3"><Checkbox id={`${field}-other`} checked={(formData[field] || []).includes('อื่น ๆ')} onCheckedChange={c => handleCheckboxChange(field, 'อื่น ๆ', !!c)} className="mt-1" /><div className="w-full"><Label htmlFor={`${field}-other`} className="font-normal cursor-pointer">อื่น ๆ</Label><Input placeholder="ระบุ" value={formData[otherField] || ''} onChange={e => handleInputChange(otherField, e.target.value)} className="mt-1" /></div></div>)}</div>
  );
  const renderProblemsBeforeGroup = (problems: {text: string, hasDetail: boolean}[]) => (
      <div className="space-y-4">{problems.map((p, i) => (<div key={i}><div className="flex items-start space-x-3"><Checkbox id={`p-${i}`} checked={(formData.section1_problems_before || []).includes(p.text)} onCheckedChange={c => handleCheckboxChange('section1_problems_before', p.text, !!c)} className="mt-1" /><Label htmlFor={`p-${i}`} className="font-normal cursor-pointer">{p.text}</Label></div>{p.hasDetail && (formData.section1_problems_before || []).includes(p.text) && (<div className="ml-8 mt-2"><Input placeholder="ระบุ" value={formData[`section1_problems_detail_${i}`] || ''} onChange={e => handleInputChange(`section1_problems_detail_${i}`, e.target.value)} /></div>)}</div>))}</div>
  );
  const renderRatingScale = (field: string) => (
      <div className="space-y-2"><div className="flex justify-between text-xs text-muted-foreground"><span>น้อยที่สุด</span><span>มากที่สุด</span></div><div className="grid grid-cols-10 gap-1">{[...Array(10)].map((_, i) => <Button key={i} type="button" variant={formData[field] === i + 1 ? "default" : "outline"} size="sm" onClick={() => handleInputChange(field, i + 1)}>{i + 1}</Button>)}</div></div>
  );
  const RatingDescription = ({ items }: { items: string[] }) => (<div className="bg-blue-50 p-3 rounded-lg mt-4 text-xs text-blue-800 space-y-1 border border-blue-200"><h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>{items.map(item => <p key={item}>{item}</p>)}</div>);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return (<Card><CardHeader><CardTitle>1.1 ผลลัพธ์ภายหลังจากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)</CardTitle></CardHeader><CardContent className="space-y-6"><h4 className="font-medium">ด้านองค์ความรู้ <span className="text-red-600">*</span></h4>{renderCheckboxGroup(knowledgeOutcomes, "section1_knowledge_outcomes")}<h4 className="font-medium">ด้านการประยุกต์ใช้องค์ความรู้ <span className="text-red-600">*</span></h4>{renderCheckboxGroup(applicationOutcomes, "section1_application_outcomes", "section1_application_other")}</CardContent></Card>);
      case 1: return (<Card><CardHeader><CardTitle>1.2 โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน จากองค์ความรู้และการประยุกต์ใช้องค์ความรู้ที่ได้จากการอบรมหลักสูตร พมส. ตามที่ท่านระบุไว้ในข้อ 1.1 <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent><Textarea value={formData.section1_changes_description || ''} onChange={(e) => handleInputChange('section1_changes_description', e.target.value)} rows={5} /></CardContent></Card>);
      case 2: return (<Card><CardHeader><CardTitle>1.3 ก่อนเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ภาพรวมในพื้นที่ของท่านมีปัญหาอะไร <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderProblemsBeforeGroup(problemsBefore)}</CardContent></Card>);
      case 3: return (<Card><CardHeader><CardTitle>1.4 องค์ความรู้ของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ท่านนำไปใช้ประโยชน์ในการแก้ไขปัญหาตามที่ระบุในข้อ 1.3 อย่างไร (ตอบได้มากกว่า 1 ข้อ) <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(knowledgeSolutions, "section1_knowledge_solutions", "section1_knowledge_solutions_other")}<div className="grid md:grid-cols-2 gap-6 pt-4"><div className="space-y-2"><Label className="font-medium">ก่อนเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด</Label><p className="text-sm text-muted-foreground">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>{renderRatingScale("section1_knowledge_before")}</div><div className="space-y-2"><Label className="font-medium">หลังเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด</Label><p className="text-sm text-muted-foreground">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>{renderRatingScale("section1_knowledge_after")}</div></div><RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ในการแก้ปัญหา ไม่ตระหนักถึงการมีอยู่", "ระดับ 2 : ตระหนัก แต่ไม่ได้นำไปใช้ในการแก้ปัญหา", "ระดับ 3 : นำไปใช้ในการวิเคราะห์ปัญหา หรือคำนึงถึงในงานของตน", "ระดับ 4 : นำไปใช้ในการออกแบบวิธีการแก้ปัญหา (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)", "ระดับ 5 : นำไปใช้ในการบรรจุเป็นแผนระดับสำนัก ภายใต้หน่วยงานของตน", "ระดับ 6 : นำไปใช้บรรจุลงในแผนขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง", "ระดับ 7 : นำไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ที่อธิบายผลได้อย่างชัดเจน", "ระดับ 8 : สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 9 : สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ"]}/></CardContent></Card>);
      case 4: return (<Card><CardHeader><CardTitle>1.5 องค์กรของท่านได้นำ กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(itUsage, "section1_it_usage", "section1_it_usage_other")}<Label className="font-medium">ท่านคิดว่า ในภาพรวม กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>{renderRatingScale("section1_it_level")}</CardContent></Card>);
      case 5: return (<Card><CardHeader><CardTitle>1.6 องค์กรของท่านได้นำ กลไกประสานความร่วมมือ มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(cooperationUsage, "section1_cooperation_usage", "section1_cooperation_usage_other")}<Label className="font-medium">ท่านคิดว่าในภาพรวม กลไกประสานความร่วมมือ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>{renderRatingScale("section1_cooperation_level")}</CardContent></Card>);
      case 6: return (<Card><CardHeader><CardTitle>1.7 องค์กรของท่านได้นำ กลไกการระดมทุน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(fundingUsage, "section1_funding_usage", "section1_funding_usage_other")}<Label className="font-medium">ท่านคิดว่าในภาพรวม กลไกการระดมทุน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>{renderRatingScale("section1_funding_level")}</CardContent></Card>);
      case 7: return (<Card><CardHeader><CardTitle>1.8 องค์กรของท่านได้นำ กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(cultureUsage, "section1_culture_usage", "section1_culture_usage_other")}<Label className="font-medium">ท่านคิดว่าในภาพรวม กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>{renderRatingScale("section1_culture_level")}</CardContent></Card>);
      case 8: return (<Card><CardHeader><CardTitle>1.9 องค์กรของท่านได้นำ กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-6">{renderCheckboxGroup(greenUsage, "section1_green_usage", "section1_green_usage_other")}<Label className="font-medium">ท่านคิดว่าในภาพรวม กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด</Label>{renderRatingScale("section1_green_level")}</CardContent></Card>);
      case 9: return (<Card><CardHeader><CardTitle>1.10 & 1.11 กลไกการพัฒนาใหม่</CardTitle></CardHeader><CardContent className="space-y-6"><Label className="font-medium">1.10 องค์กรของท่านได้นำ กลไกการพัฒนาใหม่ (บริษัทพัฒนาเมือง วิสาหกิจเพื่อสังคม สหการ) มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง <span className="text-red-600">*</span></Label>{renderCheckboxGroup(newDevUsage, "section1_new_dev_usage", "section1_new_dev_usage_other")}<Label className="font-medium">1.11 ท่านคิดว่าในภาพรวม กลไกการพัฒนาใหม่ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด <span className="text-red-600">*</span></Label>{renderRatingScale("section1_new_dev_level")}<RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น ไม่ตระหนักถึงการมีอยู่", "ระดับ 2 : ตระหนัก แต่ไม่ได้นำไปใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น", "ระดับ 3 : นำไปใช้ในการวิเคราะห์การยกระดับการพัฒนาท้องถิ่น หรือคำนึงถึงในงานของตน", "ระดับ 4 : นำไปใช้ในการออกแบบการยกระดับการพัฒนาท้องถิ่น (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)", "ระดับ 5 : นำไปใช้ในการบรรจุเป็นแผนการยกระดับการพัฒนาท้องถิ่นในระดับสำนัก ภายใต้หน่วยงานของตน", "ระดับ 6 : นำไปใช้บรรจุลงในแผนการยกระดับการพัฒนาท้องถิ่น ขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง", "ระดับ 7 : นำแผนการยกระดับการพัฒนาท้องถิ่นไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ ที่อธิบายผลได้อย่างชัดเจน", "ระดับ 8 : สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 9 : สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ"]}/></CardContent></Card>);
      case 10: return (<Card><CardHeader><CardTitle>1.12 ท่านคิดว่า องค์ความรู้และการประยุกต์ใช้องค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ในประเด็นใดบ้าง <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderCheckboxGroup(successFactors, "section1_success_factors", "section1_success_factors_other")}</CardContent></Card>);
      case 11: return (<Card><CardHeader><CardTitle>1.13 โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ตามที่ท่านระบุไว้ในข้อ 1.12 <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent><Textarea value={formData.section1_success_description || ''} onChange={(e) => handleInputChange('section1_success_description', e.target.value)} rows={5} /></CardContent></Card>);
      case 12: return (<Card><CardHeader><CardTitle>1.14 บทบาทของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ก่อให้เกิดการเปลี่ยนแปลงในพื้นที่ของท่านในระดับใด <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent className="space-y-4">{renderRatingScale("section1_overall_change_level")}<RatingDescription items={["ระดับ 1 : เมืองยังคงเป็นรูปแบบดั้งเดิม ไม่มีการเปลี่ยนแปลง", "ระดับ 2 : เริ่มมีการวางแผนพัฒนาเมืองเบื้องต้น / เริ่มมีการวางแผนเรื่องระบบข้อมูล", "ระดับ 3 : มีโครงการพัฒนาเล็ก ๆ แต่ยังไม่มีผลต่อโครงสร้างเมืองโดยรวม", "ระดับ 4 : เริ่มมีการเปลี่ยนแปลงในโครงสร้างพื้นฐานหรือเศรษฐกิจบางส่วน", "ระดับ 5 : เมืองเริ่มมีการขยายตัวในระดับปานกลาง เช่น พื้นที่อยู่อาศัย พื้นที่เศรษฐกิจ หรือสาธารณูปโภคใหม่ ๆ", "ระดับ 6 : เมืองมีการเปลี่ยนแปลงหลายมิติ เช่น การคมนาคมสาธารณะ พื้นที่สีเขียว หรือการฟื้นฟูเมืองเก่า", "ระดับ 7 : เมืองมีระบบบริหารจัดการที่มีประสิทธิภาพ เช่น การใช้ข้อมูลดิจิทัล (Smart City), การมีส่วนร่วมของประชาชนเพิ่มขึ้น", "ระดับ 8 : เมืองกลายเป็นศูนย์กลางด้านเศรษฐกิจหรือวัฒนธรรมระดับภูมิภาค มีโครงการพัฒนาขนาดใหญ่ เช่น TOD หรือเขตเศรษฐกิจพิเศษ", "ระดับ 9 : เมืองพัฒนาในระดับสูง มีความเชื่อมโยงระหว่าง, ใช้แนวคิดยั่งยืน/อัจฉริยะในหลายมิติ", "ระดับ 10 : เมืองเป็นต้นแบบระดับประเทศหรือโลก เช่น เมืองอัจฉริยะที่ใช้เทคโนโลยีและนโยบายที่ยั่งยืนในทุกด้าน"]}/></CardContent></Card>);
      default: return null;
    }
  };

  const progress = ((currentStep + 1) / formSteps.length) * 100;
  return (<div className="max-w-4xl mx-auto p-4 space-y-6"><div className="text-center"><h2 className="text-xl font-bold">ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ที่เกิดขึ้นจนถึงปัจจุบัน</h2></div><div className="space-y-2"><div className="flex justify-between text-sm"><span>ความคืบหน้า: {currentStep + 1}/{formSteps.length}</span><span>{Math.round(progress)}%</span></div><Progress value={progress} /><p className="text-sm text-center text-muted-foreground">{formSteps[currentStep].title}</p></div>{validationErrors.length > 0 && (<div className="bg-red-50 border border-red-200 p-4 rounded-lg"><div className="flex items-start space-x-2"><AlertCircle className="h-5 w-5 text-red-500" /><div><h4 className="text-red-800 font-medium">กรุณาตรวจสอบข้อมูล</h4><ul className="list-disc pl-5 text-red-700 text-sm mt-1">{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul></div></div></div>)}<div className="min-h-[500px]">{renderStepContent()}</div><div className="flex justify-between items-center pt-6 border-t"><Button onClick={handlePrev} disabled={currentStep === 0} variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />ก่อนหน้า</Button><span>ขั้นตอน {currentStep + 1} / {formSteps.length}</span>{currentStep === formSteps.length - 1 ? (<Button onClick={async () => { if (validateCurrentStep()) { await handleSave(); onNextSection?.(); } }} disabled={saving || isLoading}>{saving ? "กำลังบันทึก..." : "บันทึกและไปส่วนที่ 2"}</Button>) : (<Button onClick={handleNext}>ถัดไป<ChevronRight className="h-4 w-4 ml-2" /></Button>)}</div></div>);
};

export default Section1;
