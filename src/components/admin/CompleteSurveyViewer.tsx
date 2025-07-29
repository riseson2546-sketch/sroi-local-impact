import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, User, Calendar, Building, MessageSquare, BarChart3, Target, Printer } from 'lucide-react';

// --- โครงสร้างคำถามและตัวเลือกทั้งหมด (อัปเดตล่าสุดตามเอกสาร) ---

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
const dataTypes = ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'];
const partnerOrgs = ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'];
const dataBenefits = ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'];
const section3Factors = [
    { category: "1. ทรัพยากรภายในองค์กร", icon: Building, color: "blue", items: [{ field: "budget_system_development", title: "งบประมาณจัดสรรในการพัฒนาระบบ" }, { field: "budget_knowledge_development", title: "งบประมาณจัดสรรในการพัฒนาองค์ความรู้" }, { field: "cooperation_between_agencies", title: "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย" }, { field: "innovation_ecosystem", title: "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม" }, { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐที่เกี่ยวกับภารกิจพื้นฐานของท้องถิ่น" }] },
    { category: "2. สถานะหน่วยงาน เทศบาล/อปท.", icon: BarChart3, color: "green", items: [{ field: "digital_infrastructure", title: "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)" }, { field: "digital_mindset", title: "บุคลากรภายในหน่วยงานมีชุดความคิดแบบดิจิทัล (Digital Mindset)" }, { field: "learning_organization", title: "เป็นองค์กรแห่งการเรียนรู้ ที่มีความพร้อมในการพัฒนานวัตกรรม" }, { field: "it_skills", title: "เจ้าหน้าที่ที่เกี่ยวข้องกับการใช้นวัตกรรมดิจิทัล มีความรู้ ทักษะด้าน IT ที่เพียงพอ" }, { field: "internal_communication", title: "ประสิทธิภาพในการสื่อสารภายในองค์กร" }] },
    { category: "3. พันธะผูกพันของหน่วยงาน", icon: Target, color: "purple", items: [{ field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" }, { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" }, { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }, { field: "staff_importance", title: "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }] },
    { category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย", icon: MessageSquare, color: "orange", items: [{ field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" }, { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }] }
];


const RatingDescription = ({ items }: { items: string[] }) => (
    <div className="bg-blue-50 p-3 rounded-lg mt-4 text-xs text-blue-800 space-y-1 border border-blue-200">
        <h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>
        {items.map(item => <p key={item}>{item}</p>)}
    </div>
);

const renderCheckboxes = (title: string, options: string[], selectedValues: string[] = [], otherValue?: string, showOther = true) => (
    <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
        <h4 className="font-semibold mb-3">{title}</h4>
        <div className="space-y-2">
            {options.map((option, index) => {
                const isChecked = selectedValues.includes(option);
                return (
                    <div key={index} className="flex items-start space-x-3"><div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>{isChecked && <span className="text-white font-bold text-xs">✓</span>}</div><span className={`text-sm ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{option}</span></div>
                );
            })}
            {showOther && (
                <div className="flex items-start space-x-3">
                    <div className="mt-1 w-5 h-5 rounded-md border-2 bg-white border-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-500">อื่น ๆ</span>
                </div>
            )}
            {otherValue && (<div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200"><p className="text-sm text-blue-800">{otherValue}</p></div>)}
        </div>
    </div>
);

const renderProblemsCheckboxes = (title: string, options: { text: string, hasDetail: boolean }[], data: any) => {
    const selectedValues = data?.section1_problems_before || [];
    return (
        <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
            <h4 className="font-semibold mb-3">{title}</h4>
            <div className="space-y-3">
                {options.map((option, index) => {
                    const isChecked = selectedValues.includes(option.text);
                    const detailValue = data?.[`section1_problems_detail_${index}`];
                    return (
                        <div key={index} className="print-sub-item">
                            <div className="flex items-start space-x-3"><div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>{isChecked && <span className="text-white font-bold text-xs">✓</span>}</div><span className={`text-sm ${isChecked ? 'text-gray-800' : 'text-gray-500'}`}>{option.text}</span></div>
                            {isChecked && option.hasDetail && (<div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200"><p className="text-sm text-blue-800"><strong>ระบุ:</strong> {detailValue || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p></div>)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const renderTextField = (title: string, value?: string) => (
    <div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="p-4 bg-gray-50 rounded-md border min-h-[60px]"><p className="text-sm whitespace-pre-wrap">{value || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p></div></div>
);

const renderRatingScale = (title: string, value?: number, max: number = 10, description?: React.ReactNode) => (
    <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
        <h4 className="font-semibold mb-3">{title}</h4>
        <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex flex-wrap gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map(num => (<div key={num} className={`w-9 h-9 rounded-md border flex items-center justify-center text-xs font-medium ${value === num ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{num}</div>))}
            </div>
            {value != null && (<Badge variant="secondary">คะแนน: {value}/{max}</Badge>)}
        </div>
        {description}
    </div>
);

const CompleteSurveyViewer: React.FC<{ data?: any }> = ({ data = {} }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const respondent = data.respondent || {}; const section1 = data.section1 || {}; const section2 = data.section2 || {}; const section3 = data.section3 || {};

  const handlePrint = () => {
    setIsPrinting(true);
    const printableContent = document.getElementById('printable-area')?.outerHTML;
    if (!printableContent) { setIsPrinting(false); return; }
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.outerHTML).join('');
    const styles = Array.from(document.querySelectorAll('style')).map(style => style.outerHTML).join('');
    const printSpecificStyles = `<style>@page{size:A4;margin:1.2cm}body{font-family:'Sarabun','Helvetica Neue',Arial,sans-serif;font-size:10pt;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important}.print-section-card:not(:first-child){page-break-before:always !important}.print-item-block,.print-sub-item{page-break-inside:avoid !important}.print-category-heading{page-break-after:avoid !important}.print-card-header{background-color:#f8f9fa !important}.bg-green-100\\/20,.bg-yellow-100\\/20,.bg-purple-100\\/20{background-color:#ffffff !important}</style>`;
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html><html><head><title>พิมพ์แบบสอบถาม</title>${links}${styles}${printSpecificStyles}</head><body>${printableContent}</body></html>`);
        printWindow.document.close();
        printWindow.onload = () => {
            try { printWindow.focus(); printWindow.print(); } catch (e) { console.error("Print failed:", e); }
            finally { printWindow.close(); setIsPrinting(false); }
        };
        setTimeout(() => { if (!printWindow.closed) { try { printWindow.print(); } finally { printWindow.close(); } } setIsPrinting(false); }, 1500);
    } else { setIsPrinting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border mb-6">
        <h1 className="text-2xl font-bold">แสดงผลแบบสอบถามฉบับสมบูรณ์</h1>
        <Button onClick={handlePrint} disabled={isPrinting}><Printer className="mr-2 h-4 w-4" />{isPrinting ? 'กำลังเตรียมพิมพ์...' : 'พิมพ์เป็น PDF'}</Button>
      </div>
      <div id="printable-area" className="space-y-6">
        <Card className="print-section-card"><CardHeader className="print-card-header"><CardTitle>ข้อมูลผู้ตอบ</CardTitle></CardHeader><CardContent className="p-6"><div className="grid grid-cols-2 gap-4"><div><span className="font-medium">ชื่อ-สกุล:</span> {respondent.name || 'N/A'}</div><div><span className="font-medium">ตำแหน่ง:</span> {respondent.position || 'N/A'}</div><div><span className="font-medium">หน่วยงาน:</span> {respondent.organization || 'N/A'}</div><div><span className="font-medium">วันที่ตอบ:</span> {respondent.survey_date || 'N/A'}</div></div></CardContent></Card>
        
        <Card className="print-section-card"><CardHeader className="print-card-header"><CardTitle>ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมฯ</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-2">
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านองค์ความรู้", knowledgeOutcomes, section1.section1_knowledge_outcomes, undefined, false)}
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านการประยุกต์ใช้องค์ความรู้", applicationOutcomes, section1.section1_application_outcomes, section1.section1_application_other)}
            {renderTextField("1.2 โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นฯ", section1.section1_changes_description)}
            {renderProblemsCheckboxes("1.3 ปัญหาก่อนเข้าร่วมอบรมฯ", problemsBefore, section1)}
            {renderCheckboxes("1.4 องค์ความรู้ที่นำไปใช้ประโยชน์", knowledgeSolutions, section1.section1_knowledge_solutions, section1.section1_knowledge_solutions_other)}
            {renderRatingScale("ระดับความรู้ก่อนอบรม", section1.section1_knowledge_before, 10, <RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ในการแก้ปัญหา...", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบาย..."]}/>)}
            {renderRatingScale("ระดับความรู้หลังอบรม", section1.section1_knowledge_after, 10)}
            {renderCheckboxes("1.5 การใช้กลไกข้อมูลสารสนเทศฯ", itUsage, section1.section1_it_usage, section1.section1_it_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกข้อมูลสารสนเทศฯ", section1.section1_it_level, 10, <RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ประโยชน์...", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบาย..."]}/>)}
            {renderCheckboxes("1.6 การใช้กลไกประสานความร่วมมือ", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกประสานความร่วมมือ", section1.section1_cooperation_level, 10)}
            {renderCheckboxes("1.7 การใช้กลไกการระดมทุน", fundingUsage, section1.section1_funding_usage, section1.section1_funding_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกการระดมทุน", section1.section1_funding_level, 10)}
            {renderCheckboxes("1.8 การใช้กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น", cultureUsage, section1.section1_culture_usage, section1.section1_culture_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกวัฒนธรรมฯ", section1.section1_culture_level, 10)}
            {renderCheckboxes("1.9 การใช้กลไกเศรษฐกิจสีเขียวฯ", greenUsage, section1.section1_green_usage, section1.section1_green_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกเศรษฐกิจสีเขียวฯ", section1.section1_green_level, 10)}
            {renderCheckboxes("1.10 การใช้กลไกการพัฒนาใหม่", newDevUsage, section1.section1_new_dev_usage, section1.section1_new_dev_usage_other)}
            {renderRatingScale("1.11 ระดับการช่วยเหลือของกลไกการพัฒนาใหม่", section1.section1_new_dev_level, 10)}
            {renderCheckboxes("1.12 ปัจจัยที่ส่งผลต่อความสำเร็จ", successFactors, section1.section1_success_factors, section1.section1_success_factors_other)}
            {renderTextField("1.13 โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จ", section1.section1_success_description)}
            {renderRatingScale("1.14 บทบาทของหลักสูตรฯ ที่ก่อให้เกิดการเปลี่ยนแปลง", section1.section1_overall_change_level, 10, <RatingDescription items={["ระดับ 1 : เมืองยังคงเป็นรูปแบบดั้งเดิม...", "ระดับ 10 : เมืองเป็นต้นแบบระดับประเทศ..."]}/>)}
          </CardContent>
        </Card>

        <Card className="print-section-card"><CardHeader className="print-card-header"><CardTitle>ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-2">
            {renderCheckboxes("2.1 1) ชุดข้อมูลที่ใช้ในการพัฒนา", dataTypes, section2.section2_data_types, section2.section2_data_types_other)}
            {renderTextField("2.1 2) แหล่งที่มาของข้อมูล", section2.section2_data_sources)}
            {renderCheckboxes("2.1 3) หน่วยงานที่เข้าร่วม", partnerOrgs, section2.section2_partner_organizations, section2.section2_partner_organizations_other)}
            {renderTextField("2.1 4) วิธีการเข้าร่วมของหน่วยงาน", section2.section2_partner_participation)}
            {renderCheckboxes("2.2 ประโยชน์ของชุดข้อมูล", dataBenefits, section2.section2_data_benefits, undefined, false)}
            {renderRatingScale("2.3 ระดับการตอบโจทย์ของข้อมูล", section2.section2_data_level, 10, <RatingDescription items={["ระดับ 1 : มีการจัดเก็บเอกสารในรูป Digital...", "ระดับ 10 : ชุดข้อมูลกลายเป็นเครื่องมือหลัก..."]}/>)}
            {renderTextField("2.4 การพัฒนาอย่างต่อเนื่อง", section2.section2_continued_development)}
            <div className="p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">2.5 แอพพลิเคชั่น/ระบบที่พัฒนา</h4>{[1, 2].map(num => {const appName = section2.section2_applications?.[`app${num}_name`]; if (!appName || appName.trim() === '' || appName.toLowerCase() === 'ไม่มี') return null; return(<div key={num} className="mb-4 p-3 bg-gray-50 rounded-md border print-sub-item"><p><strong>แอพพลิเคชั่น {num}:</strong> {appName}</p><p className="text-xs"><strong>วิธีการได้มา:</strong></p><div className="flex flex-wrap gap-4 ml-2">{[{key:'buy',label:'ซื้อ'},{key:'develop',label:'องค์กรพัฒนาขึ้นเอง'},{key:'transfer',label:'องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้'}].map(m=><div key={m.key} className="flex items-center space-x-1"><div className={`w-3 h-3 border ${section2.section2_applications?.[`app${num}_method_${m.key}`]?'bg-black':''}`}/><span>{m.label}</span></div>)}</div></div>);})}</div>
            <div className="p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">2.6 การขยายเครือข่ายความร่วมมือ</h4><div className="space-y-2"><div className="grid grid-cols-2 gap-4 font-medium text-center"><div className="p-2 bg-gray-100 rounded">หน่วยงาน</div><div className="p-2 bg-gray-100 rounded">ด้านความร่วมมือ</div></div>{[1, 2, 3, 4, 5].map(num => {const org = section2.section2_network_expansion?.[`org${num}`]; const coop = section2.section2_network_expansion?.[`cooperation${num}`]; if (!org) return null; return (<div key={num} className="grid grid-cols-2 gap-4 text-sm border-b pb-2"><div className="p-2">{org}</div><div className="p-2">{coop || 'N/A'}</div></div>);})}</div></div>
          </CardContent>
        </Card>

        <Card className="print-section-card"><CardHeader className="print-card-header"><CardTitle>ส่วนที่ 3: ปัจจัยขับเคลื่อนองค์กร</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            {section3Factors.map(cat => (<div key={cat.category} className="print-item-block mb-6"><h3 className="text-lg font-bold mb-2 text-purple-700 print-category-heading">{cat.category}</h3><div className="space-y-3">{cat.items.map(item => (<div key={item.field} className="print-sub-item">{renderRatingScale(item.title, section3[item.field], 5)}</div>))}</div></div>))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteSurveyViewer;
