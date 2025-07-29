import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, User, Calendar, Building, MessageSquare, BarChart3, Target, Printer } from 'lucide-react';

// ไม่ต้อง import print-styles.css แล้ว เพราะเราจะเขียน style เข้าไปตรงๆ

// --- โครงสร้างคำถามและตัวเลือกทั้งหมด (เหมือนเดิม) ---
const knowledgeOutcomes = ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก", "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง", "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น", "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง", "รู้จักเครือข่ายมากขึ้น"];
const applicationOutcomes = ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง", "สามารถพัฒนาฐานข้อมูลเมืองของตนได้", "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"];
const problemsBefore = [{ text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", hasDetail: true }, { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", hasDetail: true }, { text: "การบริหารจัดการองค์กร", hasDetail: true }, { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", hasDetail: true }, { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", hasDetail: true }, { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", hasDetail: true }, { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", hasDetail: true }, { text: "ขาดเครือข่ายในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดความรู้ทักษะในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง", hasDetail: true }];
const knowledgeSolutions = ["การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น", "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.", "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน", "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ", "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น", "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)", "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด", "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)"];
const itUsage = ["ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด", "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง", "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการเพิ่มความเสมอภาคในการบริการ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service"];
const cooperationUsage = ["ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน", "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน"];
const fundingUsage = ["ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding", "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน", "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน"];
const cultureUsage = ["ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน", "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ", "ใช้ในการจัดทำหลักสูตรท้องถิ่น", "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว"];
const greenUsage = ["ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม", "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ", "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด", "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม"];
const newDevUsage = ["ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ", "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น", "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น \"บริษัทพัฒนาเมืองหรือ \"วิสาหกิจเพื่อสังคม\"", "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน"];
const successFactors = ["ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น", "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย", "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร", "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม", "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี", "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง", "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา", "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์", "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง", "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น", "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ", "เพิ่มความโปร่งใสในการพัฒนาเมือง", "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น", 'ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า', 'การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม'];
const dataTypes = ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'];
const partnerOrgs = ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'];
const dataBenefits = ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'];
const section3Factors = [
    { category: "1. ทรัพยากรภายในองค์กร", icon: Building, color: "blue", items: [{ field: "budget_system_development", title: "งบประมาณจัดสรรในการพัฒนาระบบ" }, { field: "budget_knowledge_development", title: "งบประมาณจัดสรรในการพัฒนาองค์ความรู้" }, { field: "cooperation_between_agencies", title: "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย" }, { field: "innovation_ecosystem", title: "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม" }, { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐที่เกี่ยวกับภารกิจพื้นฐานของท้องถิ่น" }] },
    { category: "2. สถานะหน่วยงาน เทศบาล/อปท.", icon: BarChart3, color: "green", items: [{ field: "digital_infrastructure", title: "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)" }, { field: "digital_mindset", title: "บุคลากรภายในหน่วยงานมีชุดความคิดแบบดิจิทัล (Digital Mindset)" }, { field: "learning_organization", title: "เป็นองค์กรแห่งการเรียนรู้ ที่มีความพร้อมในการพัฒนานวัตกรรม" }, { field: "it_skills", title: "เจ้าหน้าที่ที่เกี่ยวข้องกับการใช้นวัตกรรมดิจิทัล มีความรู้ทักษะด้าน IT ที่เพียงพอ" }, { field: "internal_communication", title: "ประสิทธิภาพในการสื่อสารภายในองค์กร" }] },
    { category: "3. พันธะผูกพันของหน่วยงาน", icon: Target, color: "purple", items: [{ field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" }, { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" }, { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }, { field: "staff_importance", title: "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }] },
    { category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย", icon: MessageSquare, color: "orange", items: [{ field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" }, { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }] }
];

// --- Helper Functions (เหมือนเดิม) ---
const renderCheckboxes = (title: string, options: string[], selectedValues: string[] = [], otherValue?: string, otherTitle: string = "อื่น ๆ:") => (
    <div className="mb-6 p-4 border rounded-lg bg-white">
        <h4 className="font-semibold mb-3 text-gray-800">{title}</h4>
        <div className="space-y-2">
            {options.map((option, index) => {
                const isChecked = selectedValues.includes(option);
                return (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-md">
                        <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                            {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{option}</span>
                    </div>
                );
            })}
             {/* ส่วนของ "อื่นๆ" ที่มีเงื่อนไข */}
            <div className="flex items-start space-x-3 p-2 rounded-md">
                <div className="mt-1 w-5 h-5 rounded-md border-2 bg-white border-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-500">{otherTitle}</span>
            </div>
            {otherValue && (
                <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-800">{otherValue}</p>
                </div>
            )}
        </div>
    </div>
);

const renderProblemsCheckboxes = (title: string, options: { text: string, hasDetail: boolean }[], data: any) => {
    const selectedValues = data?.section1_problems_before || [];
    return (
        <div className="mb-6 p-4 border rounded-lg bg-white">
            <h4 className="font-semibold mb-3 text-gray-800">{title}</h4>
            <div className="space-y-3">
                {options.map((option, index) => {
                    const isChecked = selectedValues.includes(option.text);
                    const detailValue = data?.[`section1_problems_detail_${index}`];
                    return (
                        <div key={index}>
                            <div className="flex items-start space-x-3 p-2 rounded-md">
                                <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                                    {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                                </div>
                                <span className={`text-sm ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{option.text}</span>
                            </div>
                            {isChecked && option.hasDetail && (
                                <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        <strong>ระบุ:</strong> {detailValue || <span className="text-gray-400">ไม่ได้ระบุรายละเอียด</span>}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const renderTextField = (title: string, value?: string) => (
    <div className="mb-6 p-4 border rounded-lg bg-white">
        <h4 className="font-semibold mb-3 text-gray-800">{title}</h4>
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{value || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p>
        </div>
    </div>
);

const renderRatingScale = (title: string, value?: number, max: number = 10, description?: React.ReactNode) => (
    <div className="mb-6 p-4 border rounded-lg bg-white">
        <h4 className="font-semibold mb-3 text-gray-800">{title}</h4>
        <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex flex-wrap gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
                    <div key={num} className={`w-9 h-9 rounded-md border flex items-center justify-center text-xs font-medium ${value === num ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                        {num}
                    </div>
                ))}
            </div>
            {value != null && ( // Check for null or undefined
                <Badge className="px-3 py-1 text-base bg-blue-100 text-blue-800 border-blue-300">
                    คะแนน: {value}/{max}
                </Badge>
            )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span>น้อยที่สุด</span>
            <span>มากที่สุด</span>
        </div>
        {description && <div className="mt-4">{description}</div>}
    </div>
);

interface SurveyViewerProps {
  data?: any;
}

const CompleteSurveyViewer: React.FC<SurveyViewerProps> = ({ data = {} }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const respondent = data.respondent || {};
  const section1 = data.section1 || {};
  const section2 = data.section2 || {};
  const section3 = data.section3 || {};

  const handlePrint = () => {
    setIsPrinting(true);

    const contentToPrint = document.getElementById('printable-area')?.innerHTML;
    if (!contentToPrint) {
        alert("ไม่พบเนื้อหาสำหรับพิมพ์");
        setIsPrinting(false);
        return;
    }

    // ดึง Link ของ Stylesheets ทั้งหมดในหน้าปัจจุบัน
    const stylesheets = Array.from(document.styleSheets)
        .map(sheet => sheet.href ? `<link rel="stylesheet" href="${sheet.href}">` : '')
        .join('');

    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
        printWindow.document.write('<html><head><title>พิมพ์แบบสอบถาม</title>');
        printWindow.document.write(stylesheets);
        printWindow.document.write(`
            <style>
                @page { size: A4; margin: 1.5cm; }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  font-size: 10pt;
                }
                .print-card { 
                  border: 1px solid #e5e7eb; 
                  border-radius: 0.5rem;
                  margin-bottom: 1.5rem;
                  page-break-inside: avoid;
                }
                .print-card-header {
                  padding: 1.5rem;
                  border-bottom: 1px solid #e5e7eb;
                  background-color: #f9fafb !important;
                }
                .print-card-content { padding: 1.5rem; }
                .hidden { display: none !important; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(contentToPrint);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        
        // รอให้รูปภาพและสไตล์โหลดเสร็จ
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
            setIsPrinting(false);
        };
        // Fallback for browsers that don't fire onload
        setTimeout(() => {
            if(!printWindow.closed) {
              printWindow.focus();
              printWindow.print();
              printWindow.close();
            }
            setIsPrinting(false);
        }, 1000);

    } else {
        alert("ไม่สามารถเปิดหน้าต่างสำหรับพิมพ์ได้ กรุณาตรวจสอบการตั้งค่า Popup Blocker ของเบราว์เซอร์");
        setIsPrinting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex items-center space-x-3">
            <Eye className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">แสดงผลแบบสอบถามฉบับสมบูรณ์</h1>
        </div>
        <Button onClick={handlePrint} disabled={isPrinting}>
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? 'กำลังเตรียมพิมพ์...' : 'พิมพ์เป็น PDF'}
        </Button>
      </div>
      
      {/* --- ส่วนของเนื้อหาที่จะถูกพิมพ์ --- */}
      <div id="printable-area" className="space-y-6">
        {/* Respondent Info */}
        <Card className="shadow-sm print-card">
          <CardHeader className="print-card-header">
             <CardTitle className="text-xl text-blue-800">ข้อมูลผู้ตอบ</CardTitle>
          </CardHeader>
          <CardContent className="p-6 print-card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2"><User className="h-4 w-4 text-blue-600" /><span className="font-medium">ชื่อ-สกุล:</span><span>{respondent.name || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-blue-600" /><span className="font-medium">ตำแหน่ง:</span><span>{respondent.position || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-blue-600" /><span className="font-medium">หน่วยงาน:</span><span>{respondent.organization || 'N/A'}</span></div>
              <div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-blue-600" /><span className="font-medium">วันที่ตอบ:</span><span>{respondent.survey_date || 'N/A'}</span></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Section 1 */}
        <Card className="shadow-sm print-card">
           <CardHeader className="print-card-header">
             <CardTitle className="text-xl text-green-800">ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมฯ</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-green-100/20 print-card-content">
              {renderCheckboxes("1.1 ผลลัพธ์: ด้านองค์ความรู้", knowledgeOutcomes, section1.section1_knowledge_outcomes)}
              {renderCheckboxes("1.1 ผลลัพธ์: ด้านการประยุกต์ใช้องค์ความรู้", applicationOutcomes, section1.section1_application_outcomes, section1.section1_application_other)}
              {renderTextField("1.2 อธิบายการเปลี่ยนแปลงที่เกิดขึ้น", section1.section1_changes_description)}
              {renderProblemsCheckboxes("1.3 ปัญหาในการพัฒนาเมืองก่อนอบรม", problemsBefore, section1)}
              {renderCheckboxes("1.4 การใช้องค์ความรู้แก้ปัญหา", knowledgeSolutions, section1.section1_knowledge_solutions, section1.section1_knowledge_solutions_other)}
              {renderRatingScale("ระดับความรู้ก่อนอบรม", section1.section1_knowledge_before, 10)}
              {renderRatingScale("ระดับความรู้หลังอบรม", section1.section1_knowledge_after, 10)}
              {renderCheckboxes("1.5 การใช้กลไกข้อมูลสารสนเทศ", itUsage, section1.section1_it_usage, section1.section1_it_usage_other)}
              {renderRatingScale("ระดับการช่วยเหลือของเทคโนโลยี", section1.section1_it_level, 10)}
              {renderCheckboxes("1.6 การใช้กลไกประสานความร่วมมือ", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)}
              {renderRatingScale("ระดับการช่วยเหลือของความร่วมมือ", section1.section1_cooperation_level, 10)}
              {renderCheckboxes("1.7 การใช้กลไกการระดมทุน", fundingUsage, section1.section1_funding_usage, section1.section1_funding_usage_other)}
              {renderRatingScale("ระดับการช่วยเหลือของการระดมทุน", section1.section1_funding_level, 10)}
              {renderCheckboxes("1.8 การใช้กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น", cultureUsage, section1.section1_culture_usage, section1.section1_culture_usage_other)}
              {renderRatingScale("ระดับการช่วยเหลือของวัฒนธรรม", section1.section1_culture_level, 10)}
              {renderCheckboxes("1.9 การใช้กลไกเศรษฐกิจสีเขียว", greenUsage, section1.section1_green_usage, section1.section1_green_usage_other)}
              {renderRatingScale("ระดับการช่วยเหลือของเศรษฐกิจสีเขียว", section1.section1_green_level, 10)}
              {renderCheckboxes("1.10 การใช้กลไกการพัฒนาใหม่", newDevUsage, section1.section1_new_dev_usage, section1.section1_new_dev_usage_other)}
              {renderRatingScale("1.11 ระดับการช่วยเหลือของการพัฒนาใหม่", section1.section1_new_dev_level, 10)}
              {renderCheckboxes("1.12 ปัจจัยความสำเร็จ", successFactors, section1.section1_success_factors, section1.section1_success_factors_other)}
              {renderTextField("1.13 อธิบายปัจจัยความสำเร็จ", section1.section1_success_description)}
              {renderRatingScale("1.14 ระดับการเปลี่ยนแปลงโดยรวม", section1.section1_overall_change_level, 10)}
            </CardContent>
        </Card>
        
        {/* Section 2 */}
        <Card className="shadow-sm print-card">
            <CardHeader className="print-card-header">
                <CardTitle className="text-xl text-yellow-800">ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-yellow-100/20 print-card-content">
                {renderCheckboxes("2.1 ชุดข้อมูลที่ใช้ในการพัฒนา", dataTypes, section2.section2_data_types, section2.section2_data_types_other)}
                {renderTextField("2.1 แหล่งที่มาของข้อมูล", section2.section2_data_sources)}
                {renderCheckboxes("2.1 หน่วยงานที่เข้าร่วมจัดทำข้อมูล", partnerOrgs, section2.section2_partner_organizations, section2.section2_partner_organizations_other)}
                {renderTextField("2.1 วิธีการเข้าร่วมของหน่วยงานภาคี", section2.section2_partner_participation)}
                {renderCheckboxes("2.2 ประโยชน์ของชุดข้อมูล", dataBenefits, section2.section2_data_benefits, undefined, false)}
                {renderRatingScale("2.3 ระดับการตอบโจทย์ของข้อมูล", section2.section2_data_level, 10)}
                {renderTextField("2.4 การพัฒนาอย่างต่อเนื่อง", section2.section2_continued_development)}
                
                <div className="p-4 border rounded-lg bg-white">
                    <h4 className="font-semibold mb-3 text-gray-800">2.5 แอพพลิเคชั่น/ระบบที่พัฒนา</h4>
                    {[1, 2, 3].map(num => {
                        const appName = section2.section2_applications?.[`app${num}_name`];
                        if (!appName) return null;
                        const otherDetail = section2.section2_applications?.[`app${num}_method_other_detail`];
                        return (
                            <div key={num} className="mb-4 p-3 bg-gray-50 rounded-md border">
                                <p className="font-semibold text-sm mb-2">แอพพลิเคชั่น {num}: <span className="font-normal">{appName}</span></p>
                                <p className="font-semibold text-xs mb-2">วิธีการได้มา:</p>
                                <div className="flex flex-wrap gap-4 ml-2">
                                    {[{key: 'buy', label: 'ซื้อ'}, {key: 'develop', label: 'พัฒนาเอง'}, {key: 'transfer', label: 'ถ่ายทอดเทคโนโลยี'}, {key: 'other', label: 'อื่น ๆ'}].map(method => {
                                        const isChecked = section2.section2_applications?.[`app${num}_method_${method.key}`];
                                        return (
                                            <label key={method.key} className="flex items-center space-x-2 text-sm">
                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? 'bg-yellow-500 border-yellow-600' : 'border-gray-300'}`}>
                                                    {isChecked && <span className="text-white text-xs">✓</span>}
                                                </div>
                                                <span className={isChecked ? 'text-gray-800' : 'text-gray-400'}>{method.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {otherDetail && (
                                    <div className="mt-2 ml-2 p-2 bg-blue-50 rounded"><p className="text-sm"><strong>รายละเอียด (อื่น ๆ):</strong> {otherDetail}</p></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className="shadow-sm print-card">
            <CardHeader className="print-card-header">
                <CardTitle className="text-xl text-purple-800">ส่วนที่ 3: ปัจจัยขับเคลื่อนองค์กร</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8 bg-purple-100/20 print-card-content">
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
        </Card>

      </div>
    </div>
  );
};

export default CompleteSurveyViewer;
