import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

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
  section2_applications: { app1_name: '', app1_method_buy: false, app1_method_develop: false, app1_method_transfer: false, app2_name: '', app2_method_buy: false, app2_method_develop: false, app2_method_transfer: false },
  section2_network_expansion: {},
};

const Section2: React.FC<Section2Props> = ({ data, onSave, isLoading = false, onNextSection, onPrevSection, isFirstSection = false, isLastSection = false }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Ensure nested objects are initialized
    const initialData = {
      ...defaultFormState,
      ...data,
      section2_applications: { ...defaultFormState.section2_applications, ...(data.section2_applications || {}) },
      section2_network_expansion: { ...defaultFormState.section2_network_expansion, ...(data.section2_network_expansion || {}) },
    };
    setFormData(initialData);
  }, [data]);

  const formSteps = [
    { id: 'data_usage', title: '2.1 การพัฒนาข้อมูลเมือง', required: ['section2_data_types', 'section2_data_sources', 'section2_partner_organizations', 'section2_partner_participation'] },
    { id: 'data_benefits', title: '2.2 ประโยชน์ของชุดข้อมูล', required: ['section2_data_benefits'] },
    { id: 'data_level', title: '2.3 ระดับการตอบโจทย์ของข้อมูล', required: ['section2_data_level'] },
    { id: 'continued_development', title: '2.4 การพัฒนาต่อเนื่อง', required: ['section2_continued_development'] },
    { id: 'applications', title: '2.5 แอปพลิเคชันที่ใช้', required: [] }, // Validation is custom
    { id: 'network_expansion', title: '2.6 การขยายเครือข่าย', required: [] }, // Validation is custom
  ];

  const validateCurrentStep = () => {
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];

    currentStepData.required.forEach(field => {
      const value = formData[field];
      if (Array.isArray(value) && value.length === 0) errors.push(`กรุณาเลือกอย่างน้อย 1 ตัวเลือก`);
      else if (typeof value === 'string' && (!value || value.trim() === '')) errors.push(`กรุณากรอกข้อมูลให้ครบถ้วน`);
      else if (value === null || value === undefined) errors.push(`กรุณาเลือกคำตอบ`);
    });
    
    if (formData.section2_data_types?.includes('อื่น ๆ') && !formData.section2_data_types_other?.trim()) {
      errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของชุดข้อมูล');
    }
    if (formData.section2_partner_organizations?.includes('อื่น ๆ') && !formData.section2_partner_organizations_other?.trim()) {
      errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของหน่วยงาน');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => { if (validateCurrentStep()) { setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1)); setValidationErrors([]); } };
  const handlePrev = () => { setCurrentStep(prev => Math.max(prev - 1, 0)); setValidationErrors([]); };
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => { setFormData(prev => ({ ...prev, [field]: checked ? [...(prev[field] || []), value] : (prev[field] || []).filter(item => item !== value) })); };
  const handleInputChange = (field: string, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); };
  const handleNestedInputChange = (outerField: string, innerField: string, value: any) => { setFormData(prev => ({ ...prev, [outerField]: { ...prev[outerField], [innerField]: value } })); };
  const handleSave = async () => { try { setSaving(true); await onSave(formData); } catch (err) { console.error("[Section2] save failed", err); } finally { setSaving(false); } };

  const dataTypes = ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'];
  const partnerOrgs = ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'];
  const dataBenefits = ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'];

  const renderCheckboxGroup = (options: string[], field: string, otherField?: string) => (
      <div className="space-y-2">
          {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2"><Checkbox id={`${field}-${index}`} checked={(formData[field] || []).includes(option)} onCheckedChange={(c) => handleCheckboxChange(field, option, c as boolean)} /><Label htmlFor={`${field}-${index}`} className="font-normal">{option}</Label></div>
          ))}
          {otherField && (
              <div className="flex items-start space-x-2">
                  <Checkbox id={`${field}-other`} checked={(formData[field] || []).includes('อื่น ๆ')} onCheckedChange={(c) => handleCheckboxChange(field, 'อื่น ๆ', c as boolean)} className="mt-1" />
                  <div className="w-full"><Label htmlFor={`${field}-other`} className="font-normal">อื่น ๆ</Label><Input placeholder="ระบุ" value={formData[otherField] || ''} onChange={(e) => handleInputChange(otherField, e.target.value)} className="mt-1" /></div>
              </div>
          )}
      </div>
  );

  const renderRatingScale = (field: string) => (
      <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>น้อยที่สุด</span><span>มากที่สุด</span></div>
          <div className="grid grid-cols-10 gap-1">{[...Array(10).keys()].map(i => <Button key={i} type="button" variant={formData[field] === i + 1 ? "default" : "outline"} size="sm" onClick={() => handleInputChange(field, i + 1)}>{i + 1}</Button>)}</div>
      </div>
  );

  const RatingDescription = ({ items }: { items: string[] }) => (
      <div className="bg-purple-50 p-3 rounded-lg mt-4 text-xs text-purple-800 space-y-1 border border-purple-200"><h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>{items.map(item => <p key={item}>{item}</p>)}</div>
  );

  const renderApplicationSection = (appNumber: 1 | 2) => (
    <div className="space-y-4 p-4 border rounded-lg">
      <Label className="font-medium">2.5.{appNumber}) ชื่อแอปพลิเคชัน (Application)</Label>
      <Input placeholder="ระบุชื่อแอปพลิเคชัน" value={formData.section2_applications?.[`app${appNumber}_name`] || ''} onChange={(e) => handleNestedInputChange('section2_applications', `app${appNumber}_name`, e.target.value)} />
      <div className="space-y-2">
        <Label className="font-medium">วิธีการได้มา</Label>
        {[
          { key: 'buy', label: 'ซื้อ' },
          { key: 'develop', label: 'องค์กรพัฒนาขึ้นเอง' },
          { key: 'transfer', label: 'องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้' }
        ].map(method => (
          <div key={method.key} className="flex items-center space-x-2">
            <Checkbox id={`app${appNumber}-${method.key}`} checked={!!formData.section2_applications?.[`app${appNumber}_method_${method.key}`]} onCheckedChange={(c) => handleNestedInputChange('section2_applications', `app${appNumber}_method_${method.key}`, c as boolean)} />
            <Label htmlFor={`app${appNumber}-${method.key}`} className="font-normal">{method.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNetworkTable = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 font-medium text-center"><div className="p-2 bg-blue-50 rounded">หน่วยงาน</div><div className="p-2 bg-blue-50 rounded">ด้านความร่วมมือ</div></div>
      {[1, 2, 3, 4, 5].map(num => (
        <div key={num} className="grid grid-cols-2 gap-4 items-center">
          <div className="flex items-center space-x-2"><span className="font-medium">{num}.</span><Input placeholder="ระบุหน่วยงาน" value={formData.section2_network_expansion?.[`org${num}`] || ''} onChange={e => handleNestedInputChange('section2_network_expansion', `org${num}`, e.target.value)} /></div>
          <Input placeholder="ระบุด้านความร่วมมือ" value={formData.section2_network_expansion?.[`cooperation${num}`] || ''} onChange={e => handleNestedInputChange('section2_network_expansion', `cooperation${num}`, e.target.value)} />
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return (<Card><CardHeader><CardTitle>2.1 ท่านนำองค์ความรู้ฯ มาใช้ในการพัฒนาข้อมูลเมืองอย่างไร</CardTitle></CardHeader><CardContent className="space-y-6"><div className="space-y-2"><Label>1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้าง<span className="text-red-600">*</span></Label>{renderCheckboxGroup(dataTypes, "section2_data_types", "section2_data_types_other")}</div><div className="space-y-2"><Label>2) ชุดข้อมูลที่ใช้มีแหล่งที่มาใด<span className="text-red-600">*</span></Label><Textarea value={formData.section2_data_sources || ''} onChange={e => handleInputChange('section2_data_sources', e.target.value)} /></div><div className="space-y-2"><Label>3) มีหน่วยงานใดเข้ามาร่วมบ้าง<span className="text-red-600">*</span></Label>{renderCheckboxGroup(partnerOrgs, "section2_partner_organizations", "section2_partner_organizations_other")}</div><div className="space-y-2"><Label>4) หน่วยงานดังกล่าวเข้าร่วมอย่างไร<span className="text-red-600">*</span></Label><Textarea value={formData.section2_partner_participation || ''} onChange={e => handleInputChange('section2_partner_participation', e.target.value)} /></div></CardContent></Card>);
      case 1: return (<Card><CardHeader><CardTitle>2.2 ชุดข้อมูลเมืองที่พัฒนาขึ้นตอบโจทย์และแก้ปัญหาของหน่วยงานในประเด็นใด<span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderCheckboxGroup(dataBenefits, "section2_data_benefits")}</CardContent></Card>);
      case 2: return (<Card><CardHeader><CardTitle>2.3 ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด<span className="text-red-600">*</span></CardTitle></CardHeader><CardContent>{renderRatingScale("section2_data_level")}<RatingDescription items={["ระดับ 1: จัดเก็บเอกสาร Digital ยังไม่ทั้งหมด", "ระดับ 2: มีระบบจัดเก็บข้อมูลดิจิทัลบางส่วน", "ระดับ 3: เริ่มใช้ข้อมูลดิจิทัลในงานบางมิติ", "ระดับ 4: ข้อมูลเป็นระบบ ใช้รายงานได้", "ระดับ 5: ใช้ข้อมูลวิเคราะห์ ติดตามปัญหาระดับปฏิบัติการ", "ระดับ 6: เชื่อมโยงข้อมูลระหว่างหน่วยงาน", "ระดับ 7: รองรับการทำงานแบบบูรณาการ", "ระดับ 8: คาดการณ์แนวโน้ม ออกแบบนโยบายเชิงรุก", "ระดับ 9: วิเคราะห์สูงด้วย AI/Big Data", "ระดับ 10: เป็นเครื่องมือหลักบริหารเมือง (Smart Governance)"]}/></CardContent></Card>);
      case 3: return (<Card><CardHeader><CardTitle>2.4 ปัจจุบันการพัฒนาชุดข้อมูลฯ ยังมีการพัฒนาอย่างต่อเนื่องหรือไม่<span className="text-red-600">*</span></CardTitle></CardHeader><CardContent><Label>หากได้ ข้อมูลใดที่จัดหาเพิ่มเติม หรือยังต้องการ แต่ยังไม่มี</Label><Textarea value={formData.section2_continued_development || ''} onChange={e => handleInputChange('section2_continued_development', e.target.value)} rows={5} /></CardContent></Card>);
      case 4: return (<Card><CardHeader><CardTitle>2.5 องค์กรของท่านมีแอปพลิเคชัน (Application) ใดในการพัฒนาเมืองหรือไม่</CardTitle></CardHeader><CardContent className="space-y-6">{renderApplicationSection(1)}{renderApplicationSection(2)}</CardContent></Card>);
      case 5: return (<Card><CardHeader><CardTitle>2.6 ปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง</CardTitle></CardHeader><CardContent>{renderNetworkTable()}</CardContent></Card>);
      default: return null;
    }
  };
  
  const progress = ((currentStep + 1) / formSteps.length) * 100;
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center"><h2 className="text-xl font-bold">ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล</h2></div>
      <div className="space-y-2"><div className="flex justify-between text-sm"><span>ความคืบหน้า: {currentStep + 1}/{formSteps.length}</span><span>{Math.round(progress)}%</span></div><Progress value={progress} /><p className="text-sm text-center text-muted-foreground">{formSteps[currentStep].title}</p></div>
      {validationErrors.length > 0 && (<div className="bg-red-50 border border-red-200 p-4 rounded-lg"><div className="flex items-start space-x-2"><AlertCircle className="h-5 w-5 text-red-500" /><div><h4 className="text-red-800 font-medium">กรุณาตรวจสอบข้อมูล</h4><ul className="list-disc pl-5 text-red-700 text-sm mt-1">{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul></div></div></div>)}
      <div className="min-h-[500px]">{renderStepContent()}</div>
      <div className="flex justify-between items-center pt-6 border-t">
        <Button onClick={handlePrev} disabled={currentStep === 0} variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />ก่อนหน้า</Button>
        <span>ขั้นตอน {currentStep + 1} / {formSteps.length}</span>
        {currentStep === formSteps.length - 1 ? (
          <Button onClick={async () => { if (validateCurrentStep()) { await handleSave(); onNextSection?.(); } }} disabled={saving || isLoading}>{saving ? "กำลังบันทึก..." : (isLastSection ? "บันทึกส่วนที่ 2" : "บันทึกและไปส่วนที่ 3")}</Button>
        ) : (
          <Button onClick={handleNext}>ถัดไป<ChevronRight className="h-4 w-4 ml-2" /></Button>
        )}
      </div>
    </div>
  );
};

export default Section2;
