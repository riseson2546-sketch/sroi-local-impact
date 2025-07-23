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
    // 2.1 การใช้ชุดข้อมูล
    section2_data_types: [],
    section2_data_types_other: '',
    section2_data_sources: '',
    section2_partner_organizations: [],
    section2_partner_organizations_other: '',
    section2_partner_participation: '',
    
    // 2.2 ประโยชน์ของชุดข้อมูล
    section2_data_benefits: [],
    
    // 2.3 ระดับการตอบโจทย์
    section2_data_level: null,
    
    // 2.4 การพัฒนาต่อเนื่อง
    section2_continued_development: '',
    
    // 2.5 แอปพลิเคชัน
    section2_app1_name: '',
    section2_app1_method_buy: false,
    section2_app1_method_develop: false,
    section2_app1_method_transfer: false,
    section2_app2_name: '',
    section2_app2_method_buy: false,
    section2_app2_method_develop: false,
    section2_app2_method_transfer: false,
    
    // 2.6 การขยายเครือข่าย
    section2_network_org1: '',
    section2_network_cooperation1: '',
    section2_network_org2: '',
    section2_network_cooperation2: '',
    section2_network_org3: '',
    section2_network_cooperation3: '',
    section2_network_org4: '',
    section2_network_cooperation4: '',
    section2_network_org5: '',
    section2_network_cooperation5: '',
    
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

  const handleCheckboxSingleChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
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
        <Label className="text-base font-medium">{appNumber}) ชื่อแอปพลิเคชัน (Application)</Label>
        <Input
          placeholder="ระบุชื่อแอปพลิเคชัน"
          value={formData[`section2_app${appNumber}_name`] || ''}
          onChange={(e) => handleInputChange(`section2_app${appNumber}_name`, e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-base font-medium">วิธีการได้มา</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-buy`}
              checked={formData[`section2_app${appNumber}_method_buy`] || false}
              onCheckedChange={(checked) => handleCheckboxSingleChange(`section2_app${appNumber}_method_buy`, checked as boolean)}
            />
            <Label htmlFor={`app${appNumber}-buy`} className="text-sm cursor-pointer">ซื้อ</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-develop`}
              checked={formData[`section2_app${appNumber}_method_develop`] || false}
              onCheckedChange={(checked) => handleCheckboxSingleChange(`section2_app${appNumber}_method_develop`, checked as boolean)}
            />
            <Label htmlFor={`app${appNumber}-develop`} className="text-sm cursor-pointer">องค์กรพัฒนาขึ้นเอง</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`app${appNumber}-transfer`}
              checked={formData[`section2_app${appNumber}_method_transfer`] || false}
              onCheckedChange={(checked) => handleCheckboxSingleChange(`section2_app${appNumber}_method_transfer`, checked as boolean)}
            />
            <Label htmlFor={`app${appNumber}-transfer`} className="text-sm cursor-pointer">องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkTable = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 font-medium text-center">
        <div className="p-2 bg-blue-50 rounded">หน่วยงาน</div>
        <div className="p-2 bg-blue-50 rounded">ด้านความร่วมมือ</div>
      </div>
      
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{num}.</span>
            <Input
              placeholder="ระบุหน่วยงาน"
              value={formData[`section2_network_org${num}`] || ''}
              onChange={(e) => handleInputChange(`section2_network_org${num}`, e.target.value)}
              className="flex-1"
            />
          </div>
          <Input
            placeholder="ระบุด้านความร่วมมือ"
            value={formData[`section2_network_cooperation${num}`] || ''}
            onChange={(e) => handleInputChange(`section2_network_cooperation${num}`, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-blue-800">
          ส่วนที่ 2 การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. ท่านนำองค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) มาใช้ในการดำเนินการพัฒนาข้อมูลเมืองอย่างไร</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้างในการพัฒนา",
            dataTypes,
            "section2_data_types",
            "section2_data_types_other"
          )}
          
          <div className="space-y-2">
            <Label className="text-base font-medium">2) ตามที่ท่านระบุในข้อ 1) ชุดข้อมูลที่ใช้นั้นได้ใช้งานจากแหล่งที่มาใด หรือชุดข้อมูลที่ได้จากการสนับสนุนทุนจากโครงการ</Label>
            <Textarea
              placeholder="กรุณาระบุ..."
              value={formData.section2_data_sources || ''}
              onChange={(e) => handleInputChange('section2_data_sources', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>

          {renderCheckboxGroup(
            "3) ในการจัดทำชุดข้อมูลหรือฐานข้อมูลในการพัฒนานั้น มีหน่วยงานใดเข้ามาร่วมบ้าง",
            partnerOrgs,
            "section2_partner_organizations",
            "section2_partner_organizations_other"
          )}

          <div className="space-y-2">
            <Label className="text-base font-medium">4) ตามที่ท่านระบุในข้อ 3) หน่วยงานดังกล่าวเข้าร่วมอย่างไร</Label>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. ชุดข้อมูลเมืองที่พัฒนาขึ้นสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup("", dataBenefits, "section2_data_benefits", undefined, false)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด</CardTitle>
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
              <p><strong>ระดับ 9 :</strong> ชุดข้อมูลมีความสามารถเชิงวิเคราะห์สูง ใช้ปัญญาประดิษฐ์ (Artificial Intelligence : AI) หรือฐานข้อมูลขนาดใหญ่ (Big Data) วิเคราะห์ปัญหาที่ซับซ้อนได้แบบเรียลไทม์</p>
              <p><strong>ระดับ 10 :</strong> ชุดข้อมูลกลายเป็นเครื่องมือหลักในการบริหารเมืองแบบ Smart Governance และขยายผลได้ระดับประเทศ หรือสากล</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">4. ปัจจุบันการพัฒนาชุดข้อมูลเพื่อการพัฒนาเมืองของท่าน ยังได้มีการพัฒนาอย่างต่อเนื่อง หรือ ไม่</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5. องค์กรของท่านมีแอปพลิเคชัน (Application) ใด ในการพัฒนาเมืองหรือไม่ มี/ไม่มี ถ้ามีได้มาจากไหน พัฒนาขึ้นมาเอง ซื้อ หรือมีการถ่ายทอดเทคโนโลยีจากองค์กรอื่น/หน่วยงานอื่น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderApplicationSection(1)}
          {renderApplicationSection(2)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">6. ในปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือในด้านใด</CardTitle>
        </CardHeader>
        <CardContent>
          {renderNetworkTable()}
        </CardContent>
      </Card>

      <div className="pt-6">
        <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 2"}
        </Button>
      </div>
    </div>
  );
};

export default Section2;
