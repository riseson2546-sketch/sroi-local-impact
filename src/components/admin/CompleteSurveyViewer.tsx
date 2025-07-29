import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Eye, Search, User, Calendar, Building } from 'lucide-react';

// --- โครงสร้างคำถามทั้งหมดของแบบสอบถาม ---

const knowledgeOutcomes = ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก", "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง", "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น", "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง", "รู้จักเครือข่ายมากขึ้น"];
const applicationOutcomes = ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง", "สามารถพัฒนาฐานข้อมูลเมืองของตนได้", "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"];
const problemsBefore = ["มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", "การบริหารจัดการองค์กร", "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", "ขาดเครือข่ายในการพัฒนาเมือง", "ขาดความรู้ทักษะในการพัฒนาเมือง", "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง"];
const knowledgeSolutions = ["การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น", "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.", "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน", "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ", "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น", "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)", "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด", "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)"];
const itUsage = ["ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด", "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง", "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการเพิ่มความเสมอภาคในการบริการ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service"];
const cooperationUsage = ["ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน", "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน"];
const fundingUsage = ["ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding", "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน", "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน"];
const cultureUsage = ["ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน", "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ", "ใช้ในการจัดทำหลักสูตรท้องถิ่น", "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว"];
const greenUsage = ["ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม", "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ", "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด", "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม"];
const newDevUsage = ["ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ", "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น", "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น \"บริษัทพัฒนาเมืองหรือ \"วิสาหกิจเพื่อสังคม\"", "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน"];
const successFactors = ["ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น", "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย", "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร", "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม", "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี", "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง", "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา", "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์", "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง", "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น", "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ", "เพิ่มความโปร่งใสในการพัฒนาเมือง", "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น"];

const section3Factors = [
    { category: "1. ทรัพยากรภายในองค์กร", items: [{ field: "budget_system_development", title: "งบประมาณในการพัฒนาระบบ" }, { field: "budget_knowledge_development", title: "งบประมาณในการพัฒนาความรู้บุคลากร" }, { field: "cooperation_between_agencies", title: "ความร่วมมือระหว่างหน่วยงาน" }, { field: "innovation_ecosystem", title: "ระบบนิเวศนวัตกรรม" }, { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลจากภาครัฐ" },] },
    { category: "2. สถานะหน่วยงาน เทศบาล/อปท.", items: [{ field: "digital_infrastructure", title: "โครงสร้างดิจิทัล" }, { field: "digital_mindset", title: "ความคิดแบบดิจิทัล" }, { field: "learning_organization", title: "องค์กรแห่งการเรียนรู้" }, { field: "it_skills", title: "ทักษะด้าน IT" }, { field: "internal_communication", title: "การสื่อสารภายในองค์กร" },] },
    { category: "3. พันธะผูกพันของหน่วยงาน", items: [{ field: "policy_continuity", title: "ความต่อเนื่องของนโยบาย" }, { field: "policy_stability", title: "เสถียรภาพของนโยบาย" }, { field: "leadership_importance", title: "ความสำคัญที่ผู้นำให้กับการพัฒนานวัตกรรม" }, { field: "staff_importance", title: "ความสำคัญที่เจ้าหน้าที่ให้กับการพัฒนานวัตกรรม" },] },
    { category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย", items: [{ field: "communication_to_users", title: "การสื่อสารไปยังผู้ใช้บริการ" }, { field: "reaching_target_groups", title: "การเข้าถึงกลุ่มเป้าหมาย" },] }
];

// --- Helper Functions ที่ปรับปรุงใหม่ ---

// แสดงตัวเลือกทั้งหมด และทำเครื่องหมายตัวที่ถูกเลือก
const renderCheckboxes = (title: string, options: string[], selectedValues: string[] = [], otherValue?: string, otherTitle: string = "อื่น ๆ โปรดระบุ:") => {
    return (
        <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
            <div className="space-y-2">
                {options.map((option, index) => {
                    const isChecked = selectedValues.includes(option);
                    return (
                        <div key={index} className={`flex items-start space-x-3 p-3 rounded-md border ${isChecked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                                {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                            </div>
                            <span className={`text-sm ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{option}</span>
                        </div>
                    );
                })}
                {/* ส่วนของ "อื่นๆ" */}
                <div>
                    <h5 className="font-medium mt-4 mb-2 text-sm text-gray-700">{otherTitle}</h5>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200 min-h-[40px]">
                        <p className="text-sm text-blue-800">{otherValue || "ไม่ได้ระบุ"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// แสดงช่องข้อความเสมอ ถ้าไม่มีข้อมูลจะแสดงว่า "ไม่ได้ระบุ"
const renderTextField = (title: string, value?: string) => {
    return (
        <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{value || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p>
            </div>
        </div>
    );
};

// แสดงสเกลคะแนนเสมอ และไฮไลท์คะแนนที่ถูกเลือก
const renderRatingScale = (title: string, value?: number, max: number = 10) => {
    return (
        <div className="mb-6 p-4 border rounded-lg">
            <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
            <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex space-x-1 flex-wrap gap-1">
                    {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
                        <div key={num} className={`w-9 h-9 rounded-md border flex items-center justify-center text-xs font-medium ${value === num ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                            {num}
                        </div>
                    ))}
                </div>
                {value && (
                    <Badge className="px-3 py-1 text-base bg-blue-100 text-blue-800 border-blue-300">
                        คะแนน: {value}/{max}
                    </Badge>
                )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>น้อยที่สุด</span>
                <span>มากที่สุด</span>
            </div>
        </div>
    );
};


interface SurveyViewerProps {
  data?: any;
}

const CompleteSurveyViewer: React.FC<SurveyViewerProps> = ({ data = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({ 
    respondent: true,
    section1: true, 
    section2: true, 
    section3: true 
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const respondent = data.respondent || {};
  const section1 = data.section1 || {};
  const section2 = data.section2 || {};
  const section3 = data.section3 || {};

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-gray-50">
      <div className="flex items-center space-x-3 p-4">
        <Eye className="h-7 w-7 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">แสดงผลแบบสอบถามฉบับสมบูรณ์</h1>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input placeholder="ค้นหาในเนื้อหาแบบสอบถาม..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md"/>
        </div>
      </div>

      {/* ข้อมูลผู้ตอบ */}
      <Card className="shadow-sm">
        <CardHeader className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors" onClick={() => toggleSection('respondent')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-blue-800">ข้อมูลผู้ตอบแบบสอบถาม</CardTitle>
            {expandedSections.respondent ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.respondent && (
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2"><User className="h-4 w-4 text-blue-600" /><span className="font-medium">ชื่อ-สกุล:</span><span>{respondent.name || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-blue-600" /><span className="font-medium">ตำแหน่ง:</span><span>{respondent.position || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-blue-600" /><span className="font-medium">หน่วยงาน:</span><span>{respondent.organization || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-blue-600" /><span className="font-medium">วันที่ตอบ:</span><span>{respondent.survey_date || 'N/A'}</span></div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ส่วนที่ 1 */}
      <Card className="shadow-sm">
        <CardHeader className="cursor-pointer bg-green-50 hover:bg-green-100 transition-colors" onClick={() => toggleSection('section1')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-green-800">ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมฯ</CardTitle>
            {expandedSections.section1 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.section1 && (
          <CardContent className="p-6 space-y-8">
            {renderCheckboxes("1.1 ด้านองค์ความรู้", knowledgeOutcomes, section1.section1_knowledge_outcomes)}
            {renderCheckboxes("1.1 ด้านการประยุกต์ใช้องค์ความรู้", applicationOutcomes, section1.section1_application_outcomes, section1.section1_application_other)}
            {renderTextField("1.2 อธิบายการเปลี่ยนแปลงที่เกิดขึ้น", section1.section1_changes_description)}
            {renderCheckboxes("1.3 ปัญหาในการพัฒนาเมืองก่อนอบรม", problemsBefore, section1.section1_problems_before, section1.section1_problems_other)}
            {renderCheckboxes("1.4 การใช้องค์ความรู้แก้ปัญหา", knowledgeSolutions, section1.section1_knowledge_solutions, section1.section1_knowledge_solutions_other)}
            {renderRatingScale("ระดับความรู้ก่อนอบรม", section1.section1_knowledge_before, 10)}
            {renderRatingScale("ระดับความรู้หลังอบรม", section1.section1_knowledge_after, 10)}
            {renderCheckboxes("1.5 กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล", itUsage, section1.section1_it_usage, section1.section1_it_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของเทคโนโลยี", section1.section1_it_level, 10)}
            {renderCheckboxes("1.6 กลไกประสานความร่วมมือ", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของความร่วมมือ", section1.section1_cooperation_level, 10)}
            {renderCheckboxes("1.7 กลไกการระดมทุน", fundingUsage, section1.section1_funding_usage, section1.section1_funding_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของการระดมทุน", section1.section1_funding_level, 10)}
            {renderCheckboxes("1.8 กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น", cultureUsage, section1.section1_culture_usage, section1.section1_culture_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของวัฒนธรรม", section1.section1_culture_level, 10)}
            {renderCheckboxes("1.9 กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน", greenUsage, section1.section1_green_usage, section1.section1_green_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของเศรษฐกิจสีเขียว", section1.section1_green_level, 10)}
            {renderCheckboxes("1.10 กลไกการพัฒนาใหม่", newDevUsage, section1.section1_new_dev_usage, section1.section1_new_dev_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของการพัฒนาใหม่", section1.section1_new_dev_level, 10)}
            {renderCheckboxes("1.12 ปัจจัยความสำเร็จ", successFactors, section1.section1_success_factors, section1.section1_success_factors_other)}
            {renderTextField("1.13 อธิบายปัจจัยความสำเร็จ", section1.section1_success_description)}
            {renderRatingScale("1.14 ระดับการเปลี่ยนแปลงโดยรวม", section1.section1_overall_change_level, 10)}
          </CardContent>
        )}
      </Card>
      
      {/* ส่วนที่ 2 */}
      <Card className="shadow-sm">
        <CardHeader className="cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition-colors" onClick={() => toggleSection('section2')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-yellow-800">ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล</CardTitle>
            {expandedSections.section2 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.section2 && (
          <CardContent className="p-6 space-y-8">
            {renderTextField("2.1 แหล่งที่มาของข้อมูล", section2.section2_data_sources)}
            {renderTextField("2.2 วิธีการเข้าร่วมของหน่วยงานภาคี", section2.section2_partner_participation)}
            {renderRatingScale("2.3 ระดับการตอบโจทย์ของข้อมูล", section2.section2_data_level, 10)}
            {renderTextField("2.3 การพัฒนาอย่างต่อเนื่อง", section2.section2_continued_development)}
             {/* ส่วนแอพพลิเคชั่น */}
             <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 text-gray-800">2.5 แอพพลิเคชั่น/ระบบที่พัฒนา</h4>
                {[1, 2, 3].map(num => (
                    <div key={num} className="mb-4 p-3 bg-gray-50 rounded-md border">
                        <p className="font-semibold text-sm mb-2">แอพพลิเคชั่น {num}: <span className="font-normal">{section2.section2_applications?.[`app${num}_name`] || 'ไม่ได้ระบุ'}</span></p>
                        <p className="font-semibold text-xs mb-2">วิธีการได้มา:</p>
                        <div className="flex gap-4 ml-2">
                          {['buy', 'develop', 'transfer'].map(method => {
                            const isChecked = section2.section2_applications?.[`app${num}_method_${method}`];
                            return (
                              <label key={method} className="flex items-center space-x-2 text-sm">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? 'bg-yellow-500 border-yellow-600' : 'border-gray-300'}`}>
                                  {isChecked && <span className="text-white text-xs">✓</span>}
                                </div>
                                <span className={isChecked ? 'text-gray-800' : 'text-gray-400'}>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                              </label>
                            );
                          })}
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ส่วนที่ 3 */}
      <Card className="shadow-sm">
        <CardHeader className="cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors" onClick={() => toggleSection('section3')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-purple-800">ส่วนที่ 3: ปัจจัยขับเคลื่อนสู่การเป็นองค์กรที่ขับเคลื่อนด้วยข้อมูล</CardTitle>
            {expandedSections.section3 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.section3 && (
            <CardContent className="p-6 space-y-8">
                {section3Factors.map((cat, catIdx) => (
                    <div key={catIdx}>
                        <h3 className="text-lg font-bold mb-4 text-purple-700">{cat.category}</h3>
                        <div className="space-y-4">
                            {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx}>
                                    {renderRatingScale(item.title, section3[item.field], 5)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CompleteSurveyViewer;
