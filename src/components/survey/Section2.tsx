import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Section2Props {
  data: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const Section2: React.FC<Section2Props> = ({ data, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
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
    ...data
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

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

  const handleSave = () => {
    onSave(formData);
  };

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

  const renderCheckboxGroup = (title: string, options: string[], field: string, otherField?: string) => (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Checkbox
              id={`${field}-${index}`}
              checked={(formData[field] || []).includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(field, option, checked as boolean)}
            />
            <Label htmlFor={`${field}-${index}`} className="text-sm leading-5">
              {option}
            </Label>
          </div>
        ))}
        <div className="flex items-start space-x-2">
          <Checkbox
            id={`${field}-other`}
            checked={(formData[field] || []).includes('อื่น ๆ')}
            onCheckedChange={(checked) => handleCheckboxChange(field, 'อื่น ๆ', checked as boolean)}
          />
          <Label htmlFor={`${field}-other`} className="text-sm">
            อื่น ๆ
          </Label>
          {otherField && (
            <Input
              placeholder="ระบุ"
              value={formData[otherField] || ''}
              onChange={(e) => handleInputChange(otherField, e.target.value)}
              className="ml-2 flex-1"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderRatingScale = (title: string, field: string) => (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <div className="flex items-center space-x-4">
        <span className="text-sm">น้อยที่สุด</span>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <Button
              key={value}
              type="button"
              variant={formData[field] === value ? "default" : "outline"}
              size="sm"
              onClick={() => handleInputChange(field, value)}
              className="w-8 h-8 p-0"
            >
              {value}
            </Button>
          ))}
        </div>
        <span className="text-sm">มากที่สุด</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          ส่วนที่ 2 การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>2.1 ท่านนำองค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) มาใช้ในการดำเนินการพัฒนาข้อมูลเมืองอย่างไร</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้างในการพัฒนา",
            dataTypes,
            "section2_data_types",
            "section2_data_types_other"
          )}
          
          <div className="space-y-2">
            <Label>2) ตามที่ท่านระบุในข้อ 1) ชุดข้อมูลที่ใช้นั้นได้ใช้งานจากแหล่งที่มาใด หรือชุดข้อมูลที่ได้จากการสนับสนุนทุนจากโครงการ</Label>
            <Textarea
              placeholder="กรุณาระบุ..."
              value={formData.section2_data_sources || ''}
              onChange={(e) => handleInputChange('section2_data_sources', e.target.value)}
              rows={3}
            />
          </div>

          {renderCheckboxGroup(
            "3) ในการจัดทำชุดข้อมูลหรือฐานข้อมูลในการพัฒนานั้น มีหน่วยงานใดเข้ามาร่วมบ้าง",
            partnerOrgs,
            "section2_partner_organizations",
            "section2_partner_organizations_other"
          )}

          <div className="space-y-2">
            <Label>4) ตามที่ท่านระบุในข้อ 3) หน่วยงานดังกล่าวเข้าร่วมอย่างไร</Label>
            <Textarea
              placeholder="กรุณาระบุ..."
              value={formData.section2_partner_participation || ''}
              onChange={(e) => handleInputChange('section2_partner_participation', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2.2 ชุดข้อมูลเมืองที่พัฒนาขึ้นสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup("", dataBenefits, "section2_data_benefits")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2.3 ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderRatingScale("", "section2_data_level")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2.4 ปัจจุบันการพัฒนาชุดข้อมูลเพื่อการพัฒนาเมืองของท่าน ยังได้มีการพัฒนาอย่างต่อเนื่อง หรือ ไม่</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="หากได้ ข้อมูลใดที่ได้มีการจัดหาเพิ่มเติม หรือข้อมูลใดที่ยังต้องการ แต่ยังไม่มี"
            value={formData.section2_continued_development || ''}
            onChange={(e) => handleInputChange('section2_continued_development', e.target.value)}
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2.5 องค์กรของท่านมีแอปพลิเคชัน (Application) ใด ในการพัฒนาเมืองหรือไม่</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>1) ชื่อแอปพลิเคชัน (Application)</Label>
            <Input
              placeholder="ระบุชื่อแอปพลิเคชัน"
              value={formData.section2_applications?.app1_name || ''}
              onChange={(e) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                app1_name: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>2) ชื่อแอปพลิเคชัน (Application)</Label>
            <Input
              placeholder="ระบุชื่อแอปพลิเคชัน"
              value={formData.section2_applications?.app2_name || ''}
              onChange={(e) => handleInputChange('section2_applications', {
                ...formData.section2_applications,
                app2_name: e.target.value
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2.6 ในปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือในด้านใด</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="กรุณาระบุหน่วยงานและด้านความร่วมมือ"
            value={formData.section2_network_expansion?.details || ''}
            onChange={(e) => handleInputChange('section2_network_expansion', {
              ...formData.section2_network_expansion,
              details: e.target.value
            })}
            rows={5}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 2"}
      </Button>
    </div>
  );
};

export default Section2;