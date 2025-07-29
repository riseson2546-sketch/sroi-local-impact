import React, 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useState, useEffect } from 'react';


interface Section2Props {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  isLoading?: boolean;
  onNextSection?: () => void;
  onPrevSection?: () => void;
  isFirstSection?: boolean;
  isLastSection?: boolean;
}

const defaultFormState = {
  section2_data_types: [],
  section2_data_types_other: '',
  section2_data_sources: '',
  section2_partner_organizations: [],
  section2_partner_organizations_other: '',
  section2_partner_participation: '',
  section2_data_benefits: [],
  section2_data_level: null,
  section2_continued_development: '',
  section2_applications: {},
  section2_network_expansion: {},
};


const Section2: React.FC<Section2Props> = ({ data, onSave, isLoading = false, onNextSection, onPrevSection }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const initialData = { ...defaultFormState, ...data, section2_applications: { ...defaultFormState.section2_applications, ...(data.section2_applications || {}) }, section2_network_expansion: { ...defaultFormState.section2_network_expansion, ...(data.section2_network_expansion || {}) }, };
    setFormData(initialData);
  }, [data]);

  const formSteps = [
    { id: '2.1', title: '2.1 การพัฒนาข้อมูลเมือง', required: ['section2_data_types', 'section2_data_sources', 'section2_partner_organizations', 'section2_partner_participation'] },
    { id: '2.2', title: '2.2 ประโยชน์ของชุดข้อมูล', required: ['section2_data_benefits'] },
    { id: '2.3', title: '2.3 ระดับการตอบโจทย์ของข้อมูล', required: ['section2_data_level'] },
    { id: '2.4', title: '2.4 การพัฒนาต่อเนื่อง', required: ['section2_continued_development'] },
    { id: '2.5', title: '2.5 แอปพลิเคชันที่ใช้', required: [] },
    { id: '2.6', title: '2.6 การขยายเครือข่าย', required: [] },
  ];

  const validateCurrentStep = () => {
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];
    currentStepData.required.forEach(field => {
      const value = formData[field];
      if (Array.isArray(value) && value.length === 0) errors.push(`กรุณาเลือกอย่างน้อย 1 ตัวเลือก`);
      else if (typeof value === 'string' && !value.trim()) errors.push(`กรุณากรอกข้อมูล`);
      else if (value === null || value === undefined) errors.push(`กรุณาเลือกคำตอบ`);
    });
    if (formData.section2_data_types?.includes('อื่น ๆ') && !formData.section2_data_types_other?.trim()) errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของชุดข้อมูล');
    if (formData.section2_partner_organizations?.includes('อื่น ๆ') && !formData.section2_partner_organizations_other?.trim()) errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของหน่วยงาน');
    
    // Validation for application's "other" field
    if (currentStepData.id === '2.5') {
        if (formData.section2_applications?.app1_method_other && !formData.section2_applications?.app1_method_other_detail?.trim()) {
            errors.push('กรุณาระบุรายละเอียด "อื่น ๆ" ของแอปพลิเคชัน 1');
        }
        if (formData.section2_applications?.app2_method_other && !formData.section2_applications?.app2_method_other_detail?.trim()) {
            errors.push('กรุณาระบุรายละเอียด "อื่น ๆ" ของแอปพลิเคชัน 2');
        }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => { if (validateCurrentStep()) { setCurrentStep(p => p + 1); setValidationErrors([]); } };
  const handlePrev = () => { setCurrentStep(p => p - 1); setValidationErrors([]); };
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => { setFormData(p => ({ ...p, [field]: checked ? [...(p[field] || []), value] : (p[field] || []).filter(item => item !== value) })); };
  const handleInputChange = (field: string, value: any) => { setFormData(p => ({ ...p, [field]: value })); };
  const handleNestedInputChange = (outer: string, inner: string, value: any) => { setFormData(p => ({ ...p, [outer]: { ...p[outer], [inner]: value } })); };
  const handleSave = async () => { try { setSaving(true); await onSave(formData); } catch (err) { console.error("Save failed", err); } finally { setSaving(false); } };

  const dataTypes = ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'];
  const partnerOrgs = ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'];
  const dataBenefits = ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'];

  const renderCheckboxGroup = (options: string[], field: string, otherField?: string, showOther = true) => (
      <div className="space-y-3">{options.map((opt, i) => (<div key={i} className="flex items-center space-x-2"><Checkbox id={`${field}-${i}`} checked={(formData[field] || []).includes(opt)} onCheckedChange={c => handleCheckboxChange(field, opt, !!c)} /><Label htmlFor={`${field}-${i}`} className="font-normal cursor-pointer">{opt}</Label></div>))}{showOther && (<div className="flex items-start space-x-3 mt-2"><Checkbox id={`${field}-other`} checked={(formData[field] || []).includes('อื่น ๆ')} onCheckedChange={c => handleCheckboxChange(field, 'อื่น ๆ', !!c)} className="mt-1" /><div className="w-full"><Label htmlFor={`${field}-other`} className="font-normal cursor-pointer">อื่น ๆ</Label><Input placeholder="ระบุ" value={formData[otherField || ''] || ''} onChange={e => handleInputChange(otherField || '', e.target.value)} className="mt-1" /></div></div>)}</div>
  );
  const renderRatingScale = (field: string) => (<div className="space-y-2"><div className="flex justify-between text-xs"><span>น้อยที่สุด</span><span>มากที่สุด</span></div><div className="grid grid-cols-10 gap-1">{[...Array(10)].map((_, i) => <Button key={i} type="button" variant={formData[field] === i + 1 ? "default" : "outline"} size="sm" onClick={() => handleInputChange(field, i + 1)}>{i + 1}</Button>)}</div></div>);
  const RatingDescription = ({ items }: { items: string[] }) => (<div className="bg-purple-50 p-3 rounded-lg mt-4 text-xs text-purple-800 space-y-1 border"><h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>{items.map(item => <p key={item}>{item}</p>)}</div>);
  
  const renderApplicationSection = (appNumber: 1 | 2) => {
    const appData = formData.section2_applications || {};
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <Label className="font-medium">{appNumber}) ชื่อแอปพลิเคชัน (Application)</Label>
        <Input placeholder="ระบุชื่อ" value={appData?.[`app${appNumber}_name`] || ''} onChange={e => handleNestedInputChange('section2_applications', `app${appNumber}_name`, e.target.value)} />
        <div className="space-y-2">
          <Label className="font-medium">• วิธีการได้มา</Label>
          {[ {key:'buy',label:'ซื้อ'}, {key:'develop',label:'องค์กรพัฒนาขึ้นเอง'}, {key:'transfer',label:'องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้'} ].map(m => (<div key={m.key} className="flex items-center space-x-2"><Checkbox id={`app${appNumber}-${m.key}`} checked={!!appData?.[`app${appNumber}_method_${m.key}`]} onCheckedChange={c => handleNestedInputChange('section2_applications', `app${appNumber}_method_${m.key}`, !!c)} /><Label htmlFor={`app${appNumber}-${m.key}`} className="font-normal cursor-pointer">{m.label}</Label></div>))}
          <div className="flex items-start space-x-3 mt-2">
              <Checkbox id={`app${appNumber}-other`} checked={!!appData?.[`app${appNumber}_method_other`]} onCheckedChange={c => handleNestedInputChange('section2_applications', `app${appNumber}_method_other`, !!c)} className="mt-1" />
              <div className="w-full">
                  <Label htmlFor={`app${appNumber}-other`} className="font-normal cursor-pointer">อื่น ๆ</Label>
                  <Input placeholder="ระบุ" value={appData?.[`app${appNumber}_method_other_detail`] || ''} onChange={e => handleNestedInputChange('section2_applications', `app${appNumber}_method_other_detail`, e.target.value)} className="mt-1" disabled={!appData?.[`app${appNumber}_method_other`]} />
              </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderNetworkTable = () => (<div className="space-y-4"><div className="grid grid-cols-2 gap-4 font-medium text-center"><div className="p-2 bg-blue-50 rounded">หน่วยงาน</div><div className="p-2 bg-blue-50 rounded">ด้านความร่วมมือ</div></div>{[...Array(5)].map((_, i) => (<div key={i} className="grid grid-cols-2 gap-4 items-center"><div className="flex items-center space-x-2"><span className="font-medium">{i + 1}.</span><Input placeholder="ระบุหน่วยงาน" value={formData.section2_network_expansion?.[`org${i+1}`] || ''} onChange={e => handleNestedInputChange('section2_network_expansion', `org${i+1}`, e.target.value)} /></div><Input placeholder="ระบุด้านความร่วมมือ" value={formData.section2_network_expansion?.[`cooperation${i+1}`] || ''} onChange={e => handleNestedInputChange('section2_network_expansion', `cooperation${i+1}`, e.target.value)} /></div>))}</div>);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return (<Card><CardHeader><CardTitle>2.1 ท่านนำองค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) มาใช้ในการดำเนินการพัฒนาข้อมูลเมืองอย่างไร</CardTitle></CardHeader><CardContent className="space-y-6"><div className="space-y-2"><Label>1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้างในการพัฒนา <span className="text-red-600">*</span></Label>{renderCheckboxGroup(dataTypes, "section2_data_types", "section2_data_types_other")}</div><div className="space-y-2"><Label>2) ตามที่ท่านระบุในข้อ 1) ชุดข้อมูลที่ใช้นั้นได้ใช้งานจากแหล่งที่มาใด หรือชุดข้อมูลที่ได้จากการสนับสนุนทุนจากโครงการ <span className="text-red-600">*</span></Label><Textarea value={formData.section2_data_sources || ''} onChange={e => handleInputChange('section2_data_sources', e.target.value)} /></div><div className="space-y-2"><Label>3) ในการจัดทำชุดข้อมูลหรือฐานข้อมูลในการพัฒนานั้น มีหน่วยงานใดเข้ามาร่วมบ้าง <span className="text-red-600">*</span></Label>{renderCheckboxGroup(partnerOrgs, "section2_partner_organizations", "section2_partner_organizations_other")}</div><div className="space-y-2"><Label>4) ตามที่ท่านระบุในข้อ 3) หน่วยงานดังกล่าวเข้าร่วมอย่างไร <span className="text-red-600">*</span></Label><Textarea value={formData.section2_partner_participation || ''} onChange={e => handleInputChange('section2_partner_participation', e.target.value)} /></div></CardContent></Card>);
      case 1: return (<Card><CardHeader><CardTitle>2.2 ชุดข้อมูลเมืองที่พัฒนาขึ้นสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderCheckboxGroup(dataBenefits, "section2_data_benefits", undefined, false)}</CardContent></Card>);
      case 2: return (<Card><CardHeader><CardTitle>2.3 ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด <span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderRatingScale("section2_data_level")}<RatingDescription items={["ระดับ 1 : มีการจัดเก็บเอกสารในรูป Digital แต่ยังไม่ได้ดำเนินการทั้งหมด", "ระดับ 2 : มีระบบจัดเก็บข้อมูลบางส่วนในรูปแบบดิจิทัล แต่ยังไม่มีการเชื่อมโยงหรือใช้จริงในการแก้ปัญหา", "ระดับ 3 : เริ่มมีการใช้ข้อมูลดิจิทัลในการทำงานบางมิติ แต่ยังจำกัดเฉพาะภายในหน่วยงาน", "ระดับ 4 : ข้อมูลถูกจัดเก็บเป็นระบบ และบางส่วนมีการใช้ในการรายงานหรือวิเคราะห์เชิงปฏิบัติการ แต่ยังไม่รองรับการตัดสินใจเชิงนโยบาย", "ระดับ 5 : หน่วยงานสามารถใช้ชุดข้อมูลเพื่อวิเคราะห์ และติดตามปัญหาได้ในระดับปฏิบัติการ เช่น การจัดการขยะ การจัดการภัยพิบัติ", "ระดับ 6 : มีการเชื่อมโยงข้อมูลระหว่างหน่วยงาน เพื่อใช้สนับสนุนการตัดสินใจในระดับโครงการหรือพื้นที่", "ระดับ 7 : ระบบรองรับการทำงานแบบบูรณาการ เช่น มีแดชบอร์ดวิเคราะห์สถานการณ์ร่วม ใช้ร่วมกับภาคประชาชน หรือหน่วยงานเครือข่ายได้", "ระดับ 8 : ชุดข้อมูลสามารถคาดการณ์แนวโน้ม และช่วยออกแบบนโยบายเชิงรุก เช่น การคาดการณ์ภัยพิบัติ", "ระดับ 9 : ชุดข้อมูลมีความสามารถเชิงวิเคราะห์สูง ใช้ปัญญาประดิษฐ์ (Artificial Intelligence : AI) หรือฐานข้อมูลขนาดใหญ่ (Big Data) วิเคราะห์ปัญหาที่ซับซ้อนได้แบบเรียลทา", "ระดับ 10 : ชุดข้อมูลกลายเป็นเครื่องมือหลักในการบริหารเมืองแบบ Smart Governance และขยายผลได้ระดับประเทศ หรือสากล"]}/></CardContent></Card>);
      case 3: return (<Card><CardHeader><CardTitle>2.4 ปัจจุบันการพัฒนาชุดข้อมูลเพื่อการพัฒนาเมืองของท่าน ยังได้มีการพัฒนาอย่างต่อเนื่อง หรือ ไม่</CardTitle></CardHeader><CardContent><Label>หากได้ ข้อมูลใดที่ได้มีการจัดหาเพิ่มเติม หรือข้อมูลใดที่ยังต้องการ แต่ยังไม่มี</Label><Textarea placeholder="กรุณาอธิบาย..." value={formData.section2_continued_development || ''} onChange={e => handleInputChange('section2_continued_development', e.target.value)} rows={5} /></CardContent></Card>);
      case 4: return (<Card><CardHeader><CardTitle>2.5 องค์กรของท่านมีแอปพลิเคชัน (Application) ใด ในการพัฒนาเมืองหรือไม่</CardTitle><p className="text-sm text-muted-foreground pt-2">ถ้ามีได้มาจากไหน พัฒนาขึ้นมาเอง ซื้อ หรือมีการถ่ายทอดเทคโนโลยีจากองค์กรอื่น/ หน่วยงานอื่น</p></CardHeader><CardContent className="space-y-6">{renderApplicationSection(1)}{renderApplicationSection(2)}</CardContent></Card>);
      case 5: return (<Card><CardHeader><CardTitle>2.6 ในปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือในด้านใด</CardTitle></CardHeader><CardContent>{renderNetworkTable()}</CardContent></Card>);
      default: return null;
    }
  };
  
  const progress = ((currentStep + 1) / formSteps.length) * 100;
  return (<div className="max-w-4xl mx-auto p-4 space-y-6"><div className="text-center"><h2 className="text-xl font-bold">ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ</h2></div><div className="space-y-2"><div className="flex justify-between text-sm"><span>ความคืบหน้า: {currentStep + 1}/{formSteps.length}</span><span>{Math.round(progress)}%</span></div><Progress value={progress} /><p className="text-sm text-center text-muted-foreground">{formSteps[currentStep].title}</p></div>{validationErrors.length > 0 && (<div className="bg-red-50 border border-red-200 p-4 rounded-lg"><div className="flex items-start space-x-2"><AlertCircle className="h-5 w-5 text-red-500" /><div><h4 className="text-red-800 font-medium">กรุณาตรวจสอบข้อมูล</h4><ul className="list-disc pl-5 text-red-700 text-sm mt-1">{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul></div></div></div>)}<div className="min-h-[500px]">{renderStepContent()}</div><div className="flex justify-between items-center pt-6 border-t"><Button onClick={handlePrev} disabled={currentStep === 0} variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />ก่อนหน้า</Button><span>ขั้นตอน {currentStep + 1} / {formSteps.length}</span>{currentStep === formSteps.length - 1 ? (<Button onClick={async () => { if (validateCurrentStep()) { await handleSave(); onNextSection?.(); } }} disabled={saving || isLoading}>{saving ? "กำลังบันทึก..." : "บันทึกและไปส่วนที่ 3"}</Button>) : (<Button onClick={handleNext}>ถัดไป<ChevronRight className="h-4 w-4 ml-2" /></Button>)}</div></div>);
};

export default Section2;
