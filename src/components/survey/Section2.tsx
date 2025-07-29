import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, AlertCircle, Database } from "lucide-react";

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

const Section2: React.FC<Section2Props> = ({ data, onSave, isLoading = false, onNextSection, onPrevSection, isFirstSection = false, isLastSection = false }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...data });
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  // กำหนดขั้นตอนของฟอร์ม
  const formSteps = [
    {
      id: 'data_usage',
      title: '1. การใช้องค์ความรู้ในการพัฒนาข้อมูลเมือง',
      required: ['section2_data_types', 'section2_data_sources', 'section2_partner_organizations', 'section2_partner_participation']
    },
    {
      id: 'data_benefits',
      title: '2. ประโยชน์ของชุดข้อมูลเมือง',
      required: ['section2_data_benefits']
    },
    {
      id: 'data_level',
      title: '3. ระดับการตอบโจทย์ของชุดข้อมูล',
      required: ['section2_data_level']
    },
    {
      id: 'continued_development',
      title: '4. การพัฒนาต่อเนื่อง',
      required: ['section2_continued_development']
    },
    {
      id: 'applications',
      title: '5. แอปพลิเคชันในการพัฒนาเมือง',
      required: ['section2_applications']
    },
    {
      id: 'network_expansion',
      title: '6. การขยายเครือข่ายความร่วมมือ',
      required: ['section2_network_expansion']
    }
  ];

  // ตรวจสอบความครบถ้วน
  const validateCurrentStep = () => {
    const currentStepData = formSteps[currentStep];
    const errors: string[] = [];

    currentStepData.required.forEach(field => {
      const value = formData[field];
      
      if (Array.isArray(value)) {
        if (value.length === 0) {
          errors.push(`กรุณาเลือกอย่างน้อย 1 ตัวเลือก`);
        }
      } else if (typeof value === 'string') {
        if (!value || value.trim() === '') {
          errors.push(`กรุณากรอกข้อมูลให้ครบถ้วน`);
        }
      } else if (value === null || value === undefined) {
        errors.push(`กรุณาเลือกคำตอบ`);
      } else if (typeof value === 'object') {
        // ตรวจสอบ object สำหรับ applications และ network_expansion
        if (field === 'section2_applications') {
          const hasApp = Object.keys(value).some(key => 
            key.includes('app1_name') && value[key] && value[key].trim() !== ''
          );
          if (!hasApp) {
            errors.push('กรุณาระบุแอปพลิเคชันอย่างน้อย 1 รายการ');
          }
        } else if (field === 'section2_network_expansion') {
          const hasNetwork = Object.keys(value).some(key => 
            key.includes('org1') && value[key] && value[key].trim() !== ''
          );
          if (!hasNetwork) {
            errors.push('กรุณาระบุหน่วยงานที่ร่วมมืออย่างน้อย 1 รายการ');
          }
        }
      }
    });

    // ตรวจสอบเพิ่มเติมสำหรับ "อื่น ๆ"
    if (currentStepData.id === 'data_usage') {
      if (formData.section2_data_types?.includes('อื่น ๆ') && 
          (!formData.section2_data_types_other || formData.section2_data_types_other.trim() === '')) {
        errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของชุดข้อมูล');
      }
      if (formData.section2_partner_organizations?.includes('อื่น ๆ') && 
          (!formData.section2_partner_organizations_other || formData.section2_partner_organizations_other.trim() === '')) {
        errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของหน่วยงานที่ร่วมมือ');
      }
    }

    // ตรวจสอบ "อื่น ๆ" สำหรับแอปพลิเคชัน
    if (currentStepData.id === 'applications') {
      // ตรวจสอบแอปพลิเคชัน 1
      if (formData.section2_applications?.app1_method_other && 
          (!formData.section2_applications?.app1_method_other_detail || formData.section2_applications?.app1_method_other_detail.trim() === '')) {
        errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของแอปพลิเคชัน 1');
      }
      // ตรวจสอบแอปพลิเคชัน 2
      if (formData.section2_applications?.app2_method_other && 
          (!formData.section2_applications?.app2_method_other_detail || formData.section2_applications?.app2_method_other_detail.trim() === '')) {
        errors.push('กรุณาระบุรายละเอียดใน "อื่น ๆ" ของแอปพลิเคชัน 2');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
      setValidationErrors([]);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setValidationErrors([]);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("[Section2] saving", formData);
      await onSave(formData);
    } catch (err) {
      console.error("[Section2] save failed", err);
      alert("บันทึกไม่สำเร็จ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ");
    } finally {
      setSaving(false);
    }
  };

  // ข้อมูลตัวเลือก
  const dataTypes = [
    'ชุดข้อมูลด้านประชากร',
    'ชุดข้อมูลด้านโครงสร้างพื้นฐาน',
    'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น',
    'ชุดข้อมูลด้านการจัดการภัยพิบัติ',
    'ชุดข้อมูลด้านสุขภาพ',
    'ชุดข้อมูลด้านการจราจร',
    'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'
  ];

  const partnerOrgs = [
    'มูลนิธิส่งเสริมการปกครองท้องถิ่น',
    'นักวิชาการจากสถาบันการศึกษา',
    'ผู้เชี่ยวชาญจากภายนอก',
    'ภาคีเครือข่ายในพื้นที่',
    'ภาคเอกชน'
  ];

  const dataBenefits = [
    'ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา',
    'ลดระยะเวลาในการดำเนินงาน',
    'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น',
    'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้',
    'ลดเอกสาร',
    'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'
  ];

  // ฟังก์ชั่นช่วยในการ render
  const renderCheckboxGroup = (title: string, options: string[], field: string, otherField?: string, showOther = true) => (
    <div className="space-y-3">
      {title && <Label className="text-base font-medium">{title}</Label>}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Checkbox
              id={`${field}-${index}`}
              checked={(formData[field] || []).includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(field, option, checked as boolean)}
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
              onCheckedChange={(checked) => handleCheckboxChange(field, 'อื่น ๆ', checked as boolean)}
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
              onClick={() => handleInputChange(field, value)}
              className="h-8 text-xs"
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplicationSection = (appNumber: number) => (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label className="text-base font-medium">{appNumber}) ชื่อแอปพลิเคชัน (Application) <span className="text-red-600">*</span></Label>
        <Input
          placeholder="ระบุชื่อแอปพลิเคชัน"
          value={formData.section2_applications?.[`app${appNumber}_name`] || ''}
          onChange={(e) => handleInputChange('section2_applications', {
            ...formData.section2_applications,
            [`app${appNumber}_name`]: e.target.value
          })}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-base font-medium">วิธีการได้มา</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-buy`}
              checked={formData.section2_applications?.[`app${appNumber}_method_buy`] || false}
              onCheckedChange={(checked) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                [`app${appNumber}_method_buy`]: checked as boolean
              })}
            />
            <Label htmlFor={`app${appNumber}-buy`} className="text-sm cursor-pointer">ซื้อ</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-develop`}
              checked={formData.section2_applications?.[`app${appNumber}_method_develop`] || false}
              onCheckedChange={(checked) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                [`app${appNumber}_method_develop`]: checked as boolean
              })}
            />
            <Label htmlFor={`app${appNumber}-develop`} className="text-sm cursor-pointer">องค์กรพัฒนาขึ้นเอง</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-transfer`}
              checked={formData.section2_applications?.[`app${appNumber}_method_transfer`] || false}
              onCheckedChange={(checked) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                [`app${appNumber}_method_transfer`]: checked as boolean
              })}
            />
            <Label htmlFor={`app${appNumber}-transfer`} className="text-sm cursor-pointer">องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้</Label>
          </div>

          {/* เพิ่มตัวเลือก "อื่น ๆ" */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id={`app${appNumber}-other`}
              checked={formData.section2_applications?.[`app${appNumber}_method_other`] || false}
              onCheckedChange={(checked) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                [`app${appNumber}_method_other`]: checked as boolean
              })}
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor={`app${appNumber}-other`} className="text-sm cursor-pointer">
                อื่น ๆ
              </Label>
              <Input
                placeholder="ระบุรายละเอียด"
                value={formData.section2_applications?.[`app${appNumber}_method_other_detail`] || ''}
                onChange={(e) => handleInputChange('section2_applications', {
                  ...formData.section2_applications,
                  [`app${appNumber}_method_other_detail`]: e.target.value
                })}
                className="w-full"
                disabled={!formData.section2_applications?.[`app${appNumber}_method_other`]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkTable = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 font-medium text-center">
        <div className="p-2 bg-blue-50 rounded">หน่วยงาน <span className="text-red-600">*</span></div>
        <div className="p-2 bg-blue-50 rounded">ด้านความร่วมมือ <span className="text-red-600">*</span></div>
      </div>
      
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{num}.</span>
            <Input
              placeholder="ระบุหน่วยงาน"
              value={formData.section2_network_expansion?.[`org${num}`] || ''}
              onChange={(e) => handleInputChange('section2_network_expansion', {
                ...formData.section2_network_expansion,
                [`org${num}`]: e.target.value
              })}
              className="flex-1"
            />
          </div>
          <Input
            placeholder="ระบุด้านความร่วมมือ"
            value={formData.section2_network_expansion?.[`cooperation${num}`] || ''}
            onChange={(e) => handleInputChange('section2_network_expansion', {
              ...formData.section2_network_expansion,
              [`cooperation${num}`]: e.target.value
            })}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );

  // เนื้อหาของแต่ละขั้นตอน
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // การใช้องค์ความรู้
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. ท่านนำองค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) มาใช้ในการดำเนินการพัฒนาข้อมูลเมืองอย่างไร</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-base mb-3 text-red-600">1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้างในการพัฒนา *</h4>
                {renderCheckboxGroup("", dataTypes, "section2_data_types", "section2_data_types_other")}
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-medium">2) ตามที่ท่านระบุในข้อ 1) ชุดข้อมูลที่ใช้นั้นได้ใช้งานจากแหล่งที่มาใด หรือชุดข้อมูลที่ได้จากการสนับสนุนทุนจากโครงการ <span className="text-red-600">*</span></Label>
                <Textarea
                  placeholder="กรุณาระบุ..."
                  value={formData.section2_data_sources || ''}
                  onChange={(e) => handleInputChange('section2_data_sources', e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <h4 className="font-medium text-base mb-3 text-red-600">3) ในการจัดทำชุดข้อมูลหรือฐานข้อมูลในการพัฒนานั้น มีหน่วยงานใดเข้ามาร่วมบ้าง *</h4>
                {renderCheckboxGroup("", partnerOrgs, "section2_partner_organizations", "section2_partner_organizations_other")}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">4) ตามที่ท่านระบุในข้อ 3) หน่วยงานดังกล่าวเข้าร่วมอย่างไร <span className="text-red-600">*</span></Label>
                <Textarea
                  placeholder="กรุณาระบุ..."
                  value={formData.section2_partner_participation || ''}
                  onChange={(e) => handleInputChange('section2_partner_participation', e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 1: // ประโยชน์ของชุดข้อมูล
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. ชุดข้อมูลเมืองที่พัฒนาขึ้นสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด <span className="text-red-600">*</span></CardTitle>
            </CardHeader>
            <CardContent>
              {renderCheckboxGroup("", dataBenefits, "section2_data_benefits", undefined, false)}
            </CardContent>
          </Card>
        );

      case 2: // ระดับการตอบโจทย์
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด <span className="text-red-600">*</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">(ให้ทำสัญลักษณ์ ✓ ในระดับที่ท่านเลือก)</p>
              {renderRatingScale("", "section2_data_level")}
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-purple-800">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
                <div className="text-sm space-y-1">
                  <p><strong>ระดับ 1 :</strong> มีการจัดเก็บเอกสารในรูป Digital แต่ยังไม่ได้ดำเนินการทั้งหมด</p>
                  <p><strong>ระดับ 2 :</strong> มีระบบจัดเก็บข้อมูลบางส่วนในรูปแบบดิจิทัล แต่ยังไม่มีการเชื่อมโยงหรือใช้จริงในการแก้ปัญหา</p>
                  <p><strong>ระดับ 3 :</strong> เริ่มมีการใช้ข้อมูลดิจิทัลในการทำงานบางมิติ แต่ยังจำกัดเฉพาะภายในหน่วยงาน</p>
                  <p><strong>ระดับ 4 :</strong> ข้อมูลถูกจัดเก็บเป็นระบบ และบางส่วนมีการใช้ในการรายงานหรือวิเคราะห์เชิงปฏิบัติการ แต่ยังไม่รองรับการตัดสินใจเชิงนโยบาย</p>
                  <p><strong>ระดับ 5 :</strong> หน่วยงานสามารถใช้ชุดข้อมูลเพื่อวิเคราะห์ และติดตามปัญหาได้ในระดับปฏิบัติการ เช่น การจัดการขยะ การจัดการภัยพิบัติ</p>
                  <p><strong>ระดับ 6 :</strong> มีการเชื่อมโยงข้อมูลระหว่างหน่วยงาน เพื่อใช้สนับสนุนการตัดสินใจในระดับโครงการหรือพื้นที่</p>
                  <p><strong>ระดับ 7 :</strong> ระบบรองรับการทำงานแบบบูรณาการ เช่น มีแดชบอร์ดวิเคราะห์สถานการณ์ร่วม ใช้ร่วมกับภาคประชาชน หรือหน่วยงานเครือข่ายได้</p>
                  <p><strong>ระดับ 8 :</strong> ชุดข้อมูลสามารถคาดการณ์แนวโน้ม และช่วยออกแบบนโยบายเชิงรุก เช่น การคาดการณ์ภัยพิบัติ</p>
                  <p><strong>ระดับ 9 :</strong> ชุดข้อมูลมีความสามารถเชิงวิเคราะห์สูง ใช้ปัญญาประดิษฐ์ (AI) หรือฐานข้อมูลขนาดใหญ่ (Big Data) วิเคราะห์ปัญหาที่ซับซ้อนได้แบบเรียลไทม์</p>
                  <p><strong>ระดับ 10 :</strong> ชุดข้อมูลกลายเป็นเครื่องมือหลักในการบริหารเมืองแบบ Smart Governance และขยายผลได้ระดับประเทศ หรือสากล</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3: // การพัฒนาต่อเนื่อง
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. ปัจจุบันการพัฒนาชุดข้อมูลเพื่อการพัฒนาเมืองของท่าน ยังได้มีการพัฒนาอย่างต่อเนื่อง หรือ ไม่ <span className="text-red-600">*</span></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-base">หากได้ ข้อมูลใดที่ได้มีการจัดหาเพิ่มเติม หรือข้อมูลใดที่ยังต้องการ แต่ยังไม่มี</Label>
                <Textarea
                  placeholder="กรุณาระบุ..."
                  value={formData.section2_continued_development || ''}
                  onChange={(e) => handleInputChange('section2_continued_development', e.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4: // แอปพลิเคชัน
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5. องค์กรของท่านมีแอปพลิเคชัน (Application) ใด ในการพัฒนาเมืองหรือไม่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">กรุณาระบุแอปพลิเคชันที่องค์กรของท่านใช้ในการพัฒนาเมือง</p>
                <p className="text-sm text-blue-600 mt-1">อย่างน้อย 1 รายการ (หากไม่มี ให้ระบุ "ไม่มี")</p>
              </div>
              {renderApplicationSection(1)}
              {renderApplicationSection(2)}
            </CardContent>
          </Card>
        );

      case 5: // การขยายเครือข่าย
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">6. ในปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือในด้านใด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-orange-800 font-medium">กรุณาระบุหน่วยงานที่ร่วมมือด้วย</p>
                <p className="text-sm text-orange-600 mt-1">อย่างน้อย 1 รายการ (หากไม่มี ให้ระบุ "ไม่มี")</p>
              </div>
              {renderNetworkTable()}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / formSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          ส่วนที่ 2 การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>ความคืบหน้า: {currentStep + 1} จาก {formSteps.length} ขั้นตอน</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground text-center">
          {formSteps[currentStep].title}
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium">กรุณาตรวจสอบข้อมูลต่อไปนี้:</h4>
              <ul className="text-red-700 text-sm mt-1 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>ก่อนหน้า</span>
        </Button>

        <div className="text-sm text-muted-foreground">
          ขั้นตอน {currentStep + 1} จาก {formSteps.length}
        </div>

        {currentStep === formSteps.length - 1 ? (
          <Button
            onClick={async () => {
              await handleSave();
              if (onNextSection && !isLastSection) {
                onNextSection();
              }
            }}
            disabled={saving || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving || isLoading ? "กำลังบันทึก..." : (isLastSection ? "บันทึกส่วนที่ 2" : "บันทึกและไปส่วนที่ 3")}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>ถัดไป</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3 text-yellow-800">💡 วิธีการใช้งาน:</h4>
        <ul className="text-sm space-y-1 text-yellow-700">
          <li>• กรอกข้อมูลในแต่ละขั้นตอนให้ครบถ้วน</li>
          <li>• ช่องที่มีเครื่องหมาย <span className="text-red-600 font-bold">*</span> จำเป็นต้องตอบ</li>
          <li>• คลิกปุ่ม "ถัดไป" เพื่อไปขั้นตอนถัดไป</li>
          <li>• ระบบจะตรวจสอบความครบถ้วนก่อนให้ไปขั้นตอนถัดไป</li>
          <li>• สามารถย้อนกลับไปแก้ไขข้อมูลได้ตลอดเวลา</li>
        </ul>
      </div>
    </div>
  );
};

export default Section2;
