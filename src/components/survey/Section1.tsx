import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Section1Props {
  data: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const Section1: React.FC<Section1Props> = ({ data, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    section1_knowledge_outcomes: [],
    section1_application_outcomes: [],
    section1_changes_description: '',
    section1_problems_before: [],
    section1_problems_other: '',
    section1_knowledge_solutions: [],
    section1_knowledge_solutions_other: '',
    section1_knowledge_before: null,
    section1_knowledge_after: null,
    section1_it_usage: [],
    section1_it_usage_other: '',
    section1_it_level: null,
    section1_cooperation_usage: [],
    section1_cooperation_usage_other: '',
    section1_cooperation_level: null,
    section1_funding_usage: [],
    section1_funding_usage_other: '',
    section1_funding_level: null,
    section1_culture_usage: [],
    section1_culture_usage_other: '',
    section1_culture_level: null,
    section1_green_usage: [],
    section1_green_usage_other: '',
    section1_green_level: null,
    section1_new_dev_usage: [],
    section1_new_dev_usage_other: '',
    section1_new_dev_level: null,
    section1_success_factors: [],
    section1_success_factors_other: '',
    section1_success_description: '',
    section1_overall_change_level: null,
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

  const knowledgeOutcomes = [
    'มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก',
    'มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง',
    'มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น',
    'วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง',
    'รู้จักเครือข่ายมากขึ้น'
  ];

  const applicationOutcomes = [
    'นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง',
    'สามารถพัฒนาฐานข้อมูลเมืองของตนได้',
    'สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้',
    'ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง'
  ];

  const problemsBefore = [
    'มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่',
    'วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น',
    'การบริหารจัดการองค์กร',
    'ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน',
    'ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น',
    'ไม่ใช้ข้อมูลเป็นฐานในการวางแผน',
    'บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด',
    'ขาดเครือข่ายในการพัฒนาเมือง',
    'ขาดความรู้ทักษะในการพัฒนาเมือง',
    'ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง'
  ];

  const knowledgeSolutions = [
    'การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น',
    'การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.',
    'การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน',
    'กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ',
    'ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น',
    'การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)',
    'การกล้าลงมือทำโดยไม่กลัวความผิดพลาด',
    'การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)'
  ];

  const itUsage = [
    'ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด',
    'ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง',
    'ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น',
    'ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ',
    'ช่วยในการเพิ่มความเสมอภาคในการบริการ',
    'ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่',
    'ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน',
    'ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service'
  ];

  const cooperationUsage = [
    'ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน',
    'ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา',
    'ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ',
    'ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่',
    'ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน',
    'ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น',
    'ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน'
  ];

  const fundingUsage = [
    'ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding',
    'ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา',
    'ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน',
    'ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน',
    'ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน'
  ];

  const cultureUsage = [
    'ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน',
    'ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ',
    'ใช้ในการจัดทำหลักสูตรท้องถิ่น',
    'ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว'
  ];

  const greenUsage = [
    'ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม',
    'ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ',
    'ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด',
    'ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม'
  ];

  const newDevUsage = [
    'ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ',
    'ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น',
    'ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่',
    'ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น "บริษัทพัฒนาเมืองหรือ "วิสาหกิจเพื่อสังคม"',
    'ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน'
  ];

  const successFactors = [
    'ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น',
    'นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย',
    'การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร',
    'การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม',
    'ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี',
    'เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง',
    'การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา',
    'การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์',
    'การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง',
    'สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น',
    'การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ',
    'เพิ่มความโปร่งใสในการพัฒนาเมือง',
    'ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น',
    'ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า',
    'การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม'
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

  const renderRatingScale = (title: string, field: string, description?: string) => (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
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
          ส่วนที่ 1 ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ที่เกิดขึ้นจนถึงปัจจุบัน
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1.1 ผลลัพธ์ภายหลังจากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "ด้านองค์ความรู้",
            knowledgeOutcomes,
            "section1_knowledge_outcomes"
          )}
          
          {renderCheckboxGroup(
            "ด้านการประยุกต์ใช้องค์ความรู้",
            applicationOutcomes,
            "section1_application_outcomes"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.2 โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน จากองค์ความรู้และการประยุกต์ใช้องค์ความรู้ที่ได้จากการอบรมหลักสูตร พมส. ตามที่ท่านระบุไว้ในข้อ 1.1</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="กรุณาอธิบาย..."
            value={formData.section1_changes_description || ''}
            onChange={(e) => handleInputChange('section1_changes_description', e.target.value)}
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.3 ก่อนเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ภาพรวมในพื้นที่ของท่านมีปัญหาอะไร</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup(
            "",
            problemsBefore,
            "section1_problems_before",
            "section1_problems_other"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.4 องค์ความรู้ของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ท่านนำไปใช้ประโยชน์ในการแก้ไขปัญหาตามที่ระบุในข้อ 1.3 อย่างไร (ตอบได้มากกว่า 1 ข้อ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            knowledgeSolutions,
            "section1_knowledge_solutions",
            "section1_knowledge_solutions_other"
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderRatingScale(
              "ก่อนเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด",
              "section1_knowledge_before"
            )}
            
            {renderRatingScale(
              "หลังเข้าร่วมอบรมหลักสูตร พมส. ท่านมีองค์ความรู้ที่ท่านนำมาใช้ในการแก้ปัญหา อยู่ในระดับใด",
              "section1_knowledge_after"
            )}
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
            <div className="text-sm space-y-1">
              <p><strong>ระดับ 1:</strong> ไม่ได้ใช้ในการแก้ปัญหา ไม่ตระหนักถึงการมีอยู่</p>
              <p><strong>ระดับ 2:</strong> ตระหนัก แต่ไม่ได้นำไปใช้ในการแก้ปัญหา</p>
              <p><strong>ระดับ 3:</strong> นำไปใช้ในการวิเคราะห์ปัญหา หรือคำนึงถึงในงานของตน</p>
              <p><strong>ระดับ 4:</strong> นำไปใช้ในการออกแบบวิธีการแก้ปัญหา (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)</p>
              <p><strong>ระดับ 5:</strong> นำไปใช้ในการบรรจุเป็นแผนระดับสำนัก ภายใต้หน่วยงานของตน</p>
              <p><strong>ระดับ 6:</strong> นำไปใช้บรรจุลงในแผนขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง</p>
              <p><strong>ระดับ 7:</strong> นำไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ที่อธิบายผลได้อย่างชัดเจน</p>
              <p><strong>ระดับ 8:</strong> สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้</p>
              <p><strong>ระดับ 9:</strong> สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้</p>
              <p><strong>ระดับ 10:</strong> สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.5 องค์กรของท่านได้นำ กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            itUsage,
            "section1_it_usage",
            "section1_it_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่า ในภาพรวม กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_it_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.6 องค์กรของท่านได้นำ กลไกประสานความร่วมมือ มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            cooperationUsage,
            "section1_cooperation_usage",
            "section1_cooperation_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่าในภาพรวม กลไกประสานความร่วมมือ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_cooperation_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.7 องค์กรของท่านได้นำ กลไกการระดมทุน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            fundingUsage,
            "section1_funding_usage",
            "section1_funding_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่าในภาพรวม กลไกการระดมทุน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_funding_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.8 องค์กรของท่านได้นำ กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            cultureUsage,
            "section1_culture_usage",
            "section1_culture_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่าในภาพรวม กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_culture_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.9 องค์กรของท่านได้นำ กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            greenUsage,
            "section1_green_usage",
            "section1_green_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่าในภาพรวม กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_green_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.10 องค์กรของท่านได้นำ กลไกการพัฒนาใหม่ (บริษัทพัฒนาเมือง วิสาหกิจเพื่อสังคม สหการ) มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCheckboxGroup(
            "",
            newDevUsage,
            "section1_new_dev_usage",
            "section1_new_dev_usage_other"
          )}
          
          {renderRatingScale(
            "ท่านคิดว่าในภาพรวม กลไกการพัฒนาใหม่ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด",
            "section1_new_dev_level"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.12 ท่านคิดว่า องค์ความรู้และการประยุกต์ใช้องค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ในประเด็นใดบ้าง</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxGroup(
            "",
            successFactors,
            "section1_success_factors",
            "section1_success_factors_other"
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.13 โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ตามที่ท่านระบุไว้ในข้อ 1.12</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="กรุณาอธิบาย..."
            value={formData.section1_success_description || ''}
            onChange={(e) => handleInputChange('section1_success_description', e.target.value)}
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1.14 บทบาทของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ก่อให้เกิดการเปลี่ยนแปลงในพื้นที่ของท่านในระดับใด</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderRatingScale(
            "",
            "section1_overall_change_level"
          )}
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
            <div className="text-sm space-y-1">
              <p><strong>ระดับ 1:</strong> เมืองยังคงเป็นรูปแบบดั้งเดิม ไม่มีการเปลี่ยนแปลง</p>
              <p><strong>ระดับ 2:</strong> เริ่มมีการวางแผนพัฒนาเมืองเบื้องต้น / เริ่มมีการวางแผนเรื่องระบบข้อมูล</p>
              <p><strong>ระดับ 3:</strong> มีโครงการพัฒนาเล็ก ๆ แต่ยังไม่มีผลต่อโครงสร้างเมืองโดยรวม</p>
              <p><strong>ระดับ 4:</strong> เริ่มมีการเปลี่ยนแปลงในโครงสร้างพื้นฐานหรือเศรษฐกิจบางส่วน</p>
              <p><strong>ระดับ 5:</strong> เมืองเริ่มมีการขยายตัวในระดับปานกลาง เช่น พื้นที่อยู่อาศัย พื้นที่เศรษฐกิจ หรือสาธารณูปโภคใหม่ ๆ</p>
              <p><strong>ระดับ 6:</strong> เมืองมีการเปลี่ยนแปลงหลายมิติ เช่น การคมนาคมสาธารณะ พื้นที่สีเขียว หรือการฟื้นฟูเมืองเก่า</p>
              <p><strong>ระดับ 7:</strong> เมืองมีระบบบริหารจัดการที่มีประสิทธิภาพ เช่น การใช้ข้อมูลดิจิทัล (Smart City), การมีส่วนร่วมของประชาชนเพิ่มขึ้น</p>
              <p><strong>ระดับ 8:</strong> เมืองกลายเป็นศูนย์กลางด้านเศรษฐกิจหรือวัฒนธรรมระดับภูมิภาค มีโครงการพัฒนาขนาดใหญ่ เช่น TOD หรือเขตเศรษฐกิจพิเศษ</p>
              <p><strong>ระดับ 9:</strong> เมืองพัฒนาในระดับสูง มีความเชื่อมโยงระหว่าง, ใช้แนวคิดยั่งยืน/อัจฉริยะในหลายมิติ</p>
              <p><strong>ระดับ 10:</strong> เมืองเป็นต้นแบบระดับประเทศหรือโลก เช่น เมืองอัจฉริยะที่ใช้เทคโนโลยีและนโยบายที่ยั่งยืนในทุกด้าน</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "กำลังบันทึก..." : "บันทึกส่วนที่ 1"}
      </Button>
    </div>
  );
};

export default Section1;