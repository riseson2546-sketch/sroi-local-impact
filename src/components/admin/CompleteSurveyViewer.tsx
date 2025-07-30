import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, User, Calendar, Building, MessageSquare, BarChart3, Target, Printer } from 'lucide-react';

// --- โครงสร้างคำถามและตัวเลือกทั้งหมด ---
const knowledgeOutcomes = ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก", "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง", "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น", "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง", "รู้จักเครือข่ายมากขึ้น"];
const applicationOutcomes = ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง", "สามารถพัฒนาฐานข้อมูลเมืองของตนได้", "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"];
const problemsBefore = [{ text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", hasDetail: true }, { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", hasDetail: true }, { text: "การบริหารจัดการองค์กร", hasDetail: true }, { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", hasDetail: true }, { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", hasDetail: true }, { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", hasDetail: true }, { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", hasDetail: true }, { text: "ขาดเครือข่ายในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดความรู้ทักษะในการพัฒนาเมือง", hasDetail: true }, { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง", hasDetail: true }];
const knowledgeSolutions = ["การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น", "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.", "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน", "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ", "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น", "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)", "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด", "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)"];
const itUsage = ["ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด", "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง", "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการเพิ่มความเสมอภาคในการบริการ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service"];
const cooperationUsage = ["ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน", "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน"];
const fundingUsage = ["ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding", "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน", "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน"];
const cultureUsage = ["ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน", "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ", "ใช้ในการจัดทำหลักสูตรท้องถิ่น", "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว"];
const greenUsage = ["ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม", "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ", "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด", "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม"];
const newDevUsage = ["ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ", "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น", "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น บริษัทพัฒนาเมือง หรือ วิสาหกิจเพื่อสังคม", "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน"];
const successFactors = ["ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น", "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย", "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร", "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม", "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี", "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง", "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา", "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์", "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง", "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น", "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ", "เพิ่มความโปร่งใสในการพัฒนาเมือง", "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น", 'ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า', 'การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม'];
const dataTypes = ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'];
const partnerOrgs = ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'];
const dataBenefits = ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น'];
const section3Factors = [{ category: "1. ทรัพยากรภายในองค์กร", items: [{ field: "budget_system_development", title: "งบประมาณจัดสรรในการพัฒนาระบบ" }, { field: "budget_knowledge_development", title: "งบประมาณจัดสรรในการพัฒนาองค์ความรู้" }, { field: "cooperation_between_agencies", title: "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย" }, { field: "innovation_ecosystem", title: "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม" }, { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐที่เกี่ยวกับภารกิจพื้นฐานของท้องถิ่น" }] }, { category: "2. สถานะหน่วยงาน เทศบาล/อปท.", items: [{ field: "digital_infrastructure", title: "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)" }, { field: "digital_mindset", title: "บุคลากรภายในหน่วยงาน มีชุดความคิดแบบดิจิทัล (Digital Mindset)" }, { field: "learning_organization", title: "เป็นองค์กรแห่งการเรียนรู้ ที่มีความพร้อมในการพัฒนานวัตกรรม" }, { field: "it_skills", title: "เจ้าหน้าที่ที่เกี่ยวข้องกับการใช้นวัตกรรมดิจิทัล มีความรู้ ทักษะด้าน IT ที่เพียงพอ" }, { field: "internal_communication", title: "ประสิทธิภาพในการสื่อสารภายในองค์กร" }] }, { category: "3. พันธะผูกพันของหน่วยงาน", items: [{ field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" }, { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" }, { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }, { field: "staff_importance", title: "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }] }, { category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย", items: [{ field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" }, { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }] }];

// Helper Components & Functions
const RatingDescription = ({ items }: { items: string[] }) => (<div className="bg-blue-50 p-3 rounded-lg mt-4 text-xs text-blue-800 space-y-1 border border-blue-200"><h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>{items.map(item => <p key={item}>{item}</p>)}</div>);
const renderCheckboxes = (title: string, options: string[], selectedValues: string[] = [], otherValue?: string, showOther = true) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="space-y-2">{options.map((opt, i) => (<div key={i} className="flex items-start space-x-3"><div className={`mt-1 w-5 h-5 r-m border-2 flex items-center justify-center shrink-0 ${selectedValues.includes(opt) ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>{selectedValues.includes(opt) && <span className="text-white font-bold text-xs">✓</span>}</div><span className={`text-sm ${selectedValues.includes(opt) ? '' : 'text-gray-500'}`}>{opt}</span></div>))}{showOther && (<div className="flex items-start space-x-3"><div className="mt-1 w-5 h-5 r-m border-2 bg-white border-gray-300 shrink-0" /><span className="text-sm text-gray-500">อื่น ๆ</span></div>)}{otherValue && (<div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200"><p className="text-sm text-blue-800">{otherValue}</p></div>)}</div></div>);

// ฟังก์ชันสำหรับแสดงข้อ 1.3 ที่มีรายละเอียดเพิ่มเติม (ฉบับปรับปรุง)
const renderProblemsCheckboxes = (title: string, options: { text: string, hasDetail: boolean }[], allData: any) => {
    // ดึงข้อมูลที่เลือกจาก root object โดยตรง
    const selectedValues = allData.section1_problems_before || [];
    
    // ฟังก์ชันสำหรับหาข้อมูลรายละเอียด
    const findDetailValue = (index: number) => {
        const key = `section1_problems_detail_${index}`;
        let value = allData?.[key];

        if (typeof value === 'string') {
            // จัดการกับข้อมูลที่เป็น string ที่มี quote ซ้อน หรือเป็น "null"
            value = value.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
            if (value.trim().toLowerCase() === 'null' || value.trim() === '') {
                return null;
            }
        }
        return value || null; // คืนค่า null หากไม่มีข้อมูล
    };
    
    return (
        <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
            <h4 className="font-semibold mb-3">{title}</h4>
            <div className="space-y-3">
                {options.map((opt, i) => { 
                    const isChecked = Array.isArray(selectedValues) && selectedValues.includes(opt.text);
                    const detailValue = findDetailValue(i);
                    
                    return (
                        <div key={i} className="print-sub-item">
                            <div className="flex items-start space-x-3">
                                <div className={`mt-1 w-5 h-5 r-m border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                                    {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                                </div>
                                <span className={`text-sm ${isChecked ? '' : 'text-gray-500'}`}>{opt.text}</span>
                            </div>
                            {isChecked && opt.hasDetail && (
                                <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        <strong>ระบุ:</strong> {detailValue ? (
                                            <span className="text-green-700 font-medium">{detailValue}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">ไม่ได้ระบุ</span>
                                        )}
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

const renderTextField = (title: string, value?: string) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="p-4 bg-gray-50 rounded-md border min-h-[60px]"><p className="text-sm whitespace-pre-wrap">{value || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p></div></div>);
const renderRatingScale = (title: string, value?: number, max = 10, description?: React.ReactNode) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="flex items-center space-x-4 flex-wrap"><div className="flex flex-wrap gap-1">{Array.from({ length: max }, (_, i) => i + 1).map(num => (<div key={num} className={`w-9 h-9 r-m border flex items-center justify-center text-xs font-medium ${value === num ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{num}</div>))}</div>{value != null && (<Badge variant="secondary">คะแนน: {value}/{max}</Badge>)}</div>{description}</div>);

const CompleteSurveyViewer: React.FC<{ data?: any }> = ({ data = {} }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  // ข้อมูลผู้ตอบอาจถูก join มาในระดับบน
  const respondent = data.respondent || {}; 
  
  // Section 1: ข้อมูลอยู่ที่ระดับ root ของ object ที่ได้รับมา
  const section1 = data || {}; 

  // Section 2: ข้อมูลเป็น JSON string ต้องทำการ parse ก่อนใช้งาน
  const section2 = (() => {
    if (typeof data.section2 === 'string') {
      try {
        return JSON.parse(data.section2) || {};
      } catch (e) {
        console.error("Error parsing section2 JSON string:", data.section2, e);
        return {};
      }
    }
    return data.section2 || {}; // รองรับกรณีที่ข้อมูลเป็น object อยู่แล้ว
  })();

  // Section 3: ข้อมูลเป็น JSON string เช่นกัน
  const section3 = (() => {
    if (typeof data.section3 === 'string') {
      try {
        return JSON.parse(data.section3) || {};
      } catch (e) {
        console.error("Error parsing section3 JSON string:", data.section3, e);
        return {};
      }
    }
    return data.section3 || {}; // รองรับกรณีที่ข้อมูลเป็น object อยู่แล้ว
  })();

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
        printWindow.onload = () => { try { printWindow.focus(); printWindow.print(); } finally { printWindow.close(); setIsPrinting(false); } };
        setTimeout(() => { if (!printWindow.closed) { try { printWindow.print(); } finally { printWindow.close(); } } setIsPrinting(false); }, 1500);
    } else { setIsPrinting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border mb-6">
        <h1 className="text-2xl font-bold">แสดงผลแบบสอบถามฉบับสมบูรณ์</h1>
        <Button onClick={handlePrint} disabled={isPrinting}>
          <Printer className="mr-2 h-4 w-4" />
          {isPrinting ? 'กำลังเตรียมพิมพ์...' : 'พิมพ์เป็น PDF'}
        </Button>
      </div>
      
      <div id="printable-area" className="space-y-6">
        <Card className="print-section-card">
          <CardHeader className="print-card-header">
            <CardTitle>ข้อมูลผู้ตอบ</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">ชื่อ-สกุล:</span> {respondent.name || 'N/A'}</div>
              <div><span className="font-medium">ตำแหน่ง:</span> {respondent.position || 'N/A'}</div>
              <div><span className="font-medium">หน่วยงาน:</span> {respondent.organization || 'N/A'}</div>
              <div><span className="font-medium">วันที่ตอบ:</span> {respondent.survey_date || 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="print-section-card">
          <CardHeader className="print-card-header">
            <CardTitle>ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ที่เกิดขึ้นจนถึงปัจจุบัน</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-2">
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านองค์ความรู้", knowledgeOutcomes, section1.section1_knowledge_outcomes, undefined, false)}
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านการประยุกต์ใช้องค์ความรู้", applicationOutcomes, section1.section1_application_outcomes, section1.section1_application_other)}
            {renderTextField("1.2 โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน จากองค์ความรู้และการประยุกต์ใช้องค์ความรู้ที่ได้จากการอบรมหลักสูตร พมส. ตามที่ท่านระบุไว้ในข้อ 1.1", section1.section1_changes_description)}
            
            {/* เรียกใช้ฟังก์ชันที่ปรับปรุงแล้ว โดยส่ง data ทั้ง object เข้าไป */}
            {renderProblemsCheckboxes("1.3 ก่อนเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ภาพรวมในพื้นที่ของท่านมีปัญหาอะไร", problemsBefore, data)}

            {renderCheckboxes("1.4 องค์ความรู้ของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ท่านนำไปใช้ประโยชน์ในการแก้ไขปัญหาตามที่ระบุในข้อ 1.3 อย่างไร", knowledgeSolutions, section1.section1_knowledge_solutions, section1.section1_knowledge_solutions_other)}
            {renderRatingScale("ระดับความรู้ก่อนอบรม", section1.section1_knowledge_before, 10, <RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ในการแก้ปัญหา ไม่ตระหนักถึงการมีอยู่", "ระดับ 2 : ตระหนัก แต่ไม่ได้นำไปใช้ในการแก้ปัญหา", "ระดับ 3 : นำไปใช้ในการวิเคราะห์ปัญหา หรือคำนึงถึงในงานของตน", "ระดับ 4 : นำไปใช้ในการออกแบบวิธีการแก้ปัญหา (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)", "ระดับ 5 : นำไปใช้ในการบรรจุเป็นแผนระดับสำนัก ภายใต้หน่วยงานของตน", "ระดับ 6 : นำไปใช้บรรจุลงในแผนขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง", "ระดับ 7 : นำไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ที่อธิบายผลได้อย่างชัดเจน", "ระดับ 8 : สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 9 : สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ"]}/>)}
            {renderRatingScale("ระดับความรู้หลังอบรม", section1.section1_knowledge_after, 10)}
            {renderCheckboxes("1.5 องค์กรของท่านได้นำ กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", itUsage, section1.section1_it_usage, section1.section1_it_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล", section1.section1_it_level, 10)}
            {renderCheckboxes("1.6 องค์กรของท่านได้นำ กลไกประสานความร่วมมือ มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกประสานความร่วมมือ", section1.section1_cooperation_level, 10)}
            {renderCheckboxes("1.7 องค์กรของท่านได้นำ กลไกการระดมทุน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", fundingUsage, section1.section1_funding_usage, section1.section1_funding_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกการระดมทุน", section1.section1_funding_level, 10)}
            {renderCheckboxes("1.8 องค์กรของท่านได้นำ กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", cultureUsage, section1.section1_culture_usage, section1.section1_culture_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น", section1.section1_culture_level, 10)}
            {renderCheckboxes("1.9 องค์กรของท่านได้นำ กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", greenUsage, section1.section1_green_usage, section1.section1_green_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน", section1.section1_green_level, 10)}
            {renderCheckboxes("1.10 องค์กรของท่านได้นำ กลไกการพัฒนาใหม่ (บริษัทพัฒนาเมือง วิสาหกิจเพื่อสังคม สหการ) มาใช้ในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองอย่างไรบ้าง", newDevUsage, section1.section1_new_dev_usage, section1.section1_new_dev_usage_other)}
            {renderRatingScale("1.11 ท่านคิดว่าในภาพรวม กลไกการพัฒนาใหม่ ช่วยในการยกระดับการพัฒนาท้องถิ่น/พัฒนาเมืองระดับใด", section1.section1_new_dev_level, 10, <RatingDescription items={["ระดับ 1 : ไม่ได้ใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น ไม่ตระหนักถึงการมีอยู่", "ระดับ 2 : ตระหนัก แต่ไม่ได้นำไปใช้ประโยชน์ในการยกระดับการพัฒนาท้องถิ่น", "ระดับ 3 : นำไปใช้ในการวิเคราะห์การยกระดับการพัฒนาท้องถิ่น หรือคำนึงถึงในงานของตน", "ระดับ 4 : นำไปใช้ในการออกแบบการยกระดับการพัฒนาท้องถิ่น (วางแผน/สร้างแนวทาง/อยู่ในขั้นตอนการทำงาน)", "ระดับ 5 : นำไปใช้ในการบรรจุเป็นแผนการยกระดับการพัฒนาท้องถิ่นในระดับสำนัก ภายใต้หน่วยงานของตน", "ระดับ 6 : นำไปใช้บรรจุลงในแผนการยกระดับการพัฒนาท้องถิ่น ขับเคลื่อนระดับหน่วยงาน/องค์กรของตนเอง", "ระดับ 7 : นำแผนการยกระดับการพัฒนาท้องถิ่นไปใช้ในการขับเคลื่อนเชิงปฏิบัติการในพื้นที่ ที่อธิบายผลได้อย่างชัดเจน", "ระดับ 8 : สามารถเผยแพร่ และมีส่วนในการผลักดันแผน/นโยบายของหน่วยงานหรือพื้นที่อื่น ๆ ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 9 : สามารถขยายผล/ต่อยอด การแก้ปัญหาระดับพื้นที่ได้อย่างชัดเจน อธิบายผลได้", "ระดับ 10 : สามารถนำไปกำหนดระดับนโยบายระดับอำเภอ/จังหวัด/ประเทศ"]}/>)}
            {renderCheckboxes("1.12 ท่านคิดว่า องค์ความรู้และการประยุกต์ใช้องค์ความรู้จากการอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ในประเด็นใดบ้าง", successFactors, section1.section1_success_factors, section1.section1_success_factors_other)}
            {renderTextField("1.13 โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จในการพัฒนาเมืองในพื้นที่ของท่าน ตามที่ท่านระบุไว้ในข้อ 1.12", section1.section1_success_description)}
            {renderRatingScale("1.14 บทบาทของหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ก่อให้เกิดการเปลี่ยนแปลงในพื้นที่ของท่านในระดับใด", section1.section1_overall_change_level, 10, <RatingDescription items={["ระดับ 1 : เมืองยังคงเป็นรูปแบบดั้งเดิม ไม่มีการเปลี่ยนแปลง", "ระดับ 2 : เริ่มมีการวางแผนพัฒนาเมืองเบื้องต้น / เริ่มมีการวางแผนเรื่องระบบข้อมูล", "ระดับ 3 : มีโครงการพัฒนาเล็ก ๆ แต่ยังไม่มีผลต่อโครงสร้างเมืองโดยรวม", "ระดับ 4 : เริ่มมีการเปลี่ยนแปลงในโครงสร้างพื้นฐานหรือเศรษฐกิจบางส่วน", "ระดับ 5 : เมืองเริ่มมีการขยายตัวในระดับปานกลาง เช่น พื้นที่อยู่อาศัย พื้นที่เศรษฐกิจ หรือสาธารณูปโภคใหม่ ๆ", "ระดับ 6 : เมืองมีการเปลี่ยนแปลงหลายมิติ เช่น การคมนาคมสาธารณะ พื้นที่สีเขียว หรือการฟื้นฟูเมืองเก่า", "ระดับ 7 : เมืองมีระบบบริหารจัดการที่มีประสิทธิภาพ เช่น การใช้ข้อมูลดิจิทัล (Smart City), การมีส่วนร่วมของประชาชนเพิ่มขึ้น", "ระดับ 8 : เมืองกลายเป็นศูนย์กลางด้านเศรษฐกิจหรือวัฒนธรรมระดับภูมิภาค มีโครงการพัฒนาขนาดใหญ่ เช่น TOD หรือเขตเศรษฐกิจพิเศษ", "ระดับ 9 : เมืองพัฒนาในระดับสูง มีความเชื่อมโยงระหว่าง, ใช้แนวคิดยั่งยืน/อัจฉริยะในหลายมิติ", "ระดับ 10 : เมืองเป็นต้นแบบระดับประเทศหรือโลก เช่น เมืองอัจฉริยะที่ใช้เทคโนโลยีและนโยบายที่ยั่งยืนในทุกด้าน"]}/>)}
          </CardContent>
        </Card>

        <Card className="print-section-card">
          <CardHeader className="print-card-header">
            <CardTitle>ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-2">
            {renderCheckboxes("2.1 1) ในการพัฒนาเมือง ได้ใช้ชุดข้อมูลใดบ้างในการพัฒนา", dataTypes, section2.section2_data_types, section2.section2_data_types_other)}
            {renderTextField("2.1 2) ตามที่ท่านระบุในข้อ 1) ชุดข้อมูลที่ใช้นั้นได้ใช้งานจากแหล่งที่มาใด หรือชุดข้อมูลที่ได้จากการสนับสนุนทุนจากโครงการ", section2.section2_data_sources)}
            {renderCheckboxes("2.1 3) ในการจัดทำชุดข้อมูลหรือฐานข้อมูลในการพัฒนานั้น มีหน่วยงานใดเข้ามาร่วมบ้าง", partnerOrgs, section2.section2_partner_organizations, section2.section2_partner_organizations_other)}
            {renderTextField("2.1 4) ตามที่ท่านระบุในข้อ 3) หน่วยงานดังกล่าวเข้าร่วมอย่างไร", section2.section2_partner_participation)}
            {renderCheckboxes("2.2 ชุดข้อมูลเมืองที่พัฒนาขึ้นสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานของท่านได้ในประเด็นใด", dataBenefits, section2.section2_data_benefits, undefined, false)}
            {renderRatingScale("2.3 ชุดข้อมูลเมืองสามารถตอบโจทย์และแก้ปัญหาของหน่วยงานได้ในระดับใด", section2.section2_data_level, 10, <RatingDescription items={["ระดับ 1 : มีการจัดเก็บเอกสารในรูป Digital แต่ยังไม่ได้ดำเนินการทั้งหมด", "ระดับ 2 : มีระบบจัดเก็บข้อมูลบางส่วนในรูปแบบดิจิทัล แต่ยังไม่มีการเชื่อมโยงหรือใช้จริงในการแก้ปัญหา", "ระดับ 3 : เริ่มมีการใช้ข้อมูลดิจิทัลในการทำงานบางมิติ แต่ยังจำกัดเฉพาะภายในหน่วยงาน", "ระดับ 4 : ข้อมูลถูกจัดเก็บเป็นระบบ และบางส่วนมีการใช้ในการรายงานหรือวิเคราะห์เชิงปฏิบัติการ แต่ยังไม่รองรับการตัดสินใจเชิงนโยบาย", "ระดับ 5 : หน่วยงานสามารถใช้ชุดข้อมูลเพื่อวิเคราะห์ และติดตามปัญหาได้ในระดับปฏิบัติการ เช่น การจัดการขยะ การจัดการภัยพิบัติ", "ระดับ 6 : มีการเชื่อมโยงข้อมูลระหว่างหน่วยงาน เพื่อใช้สนับสนุนการตัดสินใจในระดับโครงการหรือพื้นที่", "ระดับ 7 : ระบบรองรับการทำงานแบบบูรณาการ เช่น มีแดชบอร์ดวิเคราะห์สถานการณ์ร่วม ใช้ร่วมกับภาคประชาชน หรือหน่วยงานเครือข่ายได้", "ระดับ 8 : ชุดข้อมูลสามารถคาดการณ์แนวโน้ม และช่วยออกแบบนโยบายเชิงรุก เช่น การคาดการณ์ภัยพิบัติ", "ระดับ 9 : ชุดข้อมูลมีความสามารถเชิงวิเคราะห์สูง ใช้ปัญญาประดิษฐ์ (Artificial Intelligence : AI) หรือฐานข้อมูลขนาดใหญ่ (Big Data) วิเคราะห์ปัญหาที่ซับซ้อนได้แบบเรียลทา", "ระดับ 10 : ชุดข้อมูลกลายเป็นเครื่องมือหลักในการบริหารเมืองแบบ Smart Governance และขยายผลได้ระดับประเทศ หรือสากล"]}/>)}
            {renderTextField("2.4 ปัจจุบันการพัฒนาชุดข้อมูลเพื่อการพัฒนาเมืองของท่าน ยังได้มีการพัฒนาอย่างต่อเนื่อง หรือ ไม่ หากได้ ข้อมูลใดที่ได้มีการจัดหาเพิ่มเติม หรือข้อมูลใดที่ยังต้องการ แต่ยังไม่มี", section2.section2_continued_development)}
            <div className="p-4 border rounded-lg bg-white print-item-block">
              <h4 className="font-semibold mb-3">2.5 องค์กรของท่านมีแอปพลิเคชัน (Application) ใด ในการพัฒนาเมืองหรือไม่</h4>
              {[1, 2].map(num => {
                const appName = section2.section2_applications?.[`app${num}_name`]; 
                if (!appName || !appName.trim()) return null; 
                const otherDetail = section2.section2_applications?.[`app${num}_method_other_detail`]; 
                const methods = [{key:'buy',label:'ซื้อ'},{key:'develop',label:'องค์กรพัฒนาขึ้นเอง'},{key:'transfer',label:'องค์กรอื่นได้มาถ่ายทอดเทคโนโลยีให้'},{key:'other',label:'อื่น ๆ'}]; 
                return(
                  <div key={num} className="mb-4 p-3 bg-gray-50 rounded-md border print-sub-item">
                    <strong>{num}) ชื่อแอปพลิเคชัน:</strong> {appName}
                    <div className="mt-2">
                      <p className="text-sm font-semibold">• วิธีการได้มา:</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 ml-4">
                        {methods.map(method => { 
                          const isChecked = section2.section2_applications?.[`app${num}_method_${method.key}`]; 
                          return (
                            <div key={method.key} className="flex items-center space-x-1.5">
                              <div className={`w-4 h-4 border-2 r-m flex items-center justify-center ${isChecked ? 'bg-black' : ''}`} />
                              <span>{method.label}</span>
                            </div>
                          );
                        })}
                        {section2.section2_applications?.[`app${num}_method_other`] && otherDetail && (
                          <div className="w-full mt-1 p-2 bg-blue-50 text-sm text-blue-700 rounded">
                            <strong>ระบุ:</strong> {otherDetail}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border rounded-lg bg-white print-item-block">
              <h4 className="font-semibold mb-3">2.6 ในปัจจุบันองค์กรของท่านได้มีการขยายเครือข่ายความร่วมมือไปยังหน่วยงานใดบ้าง และเป็นความร่วมมือในด้านใด</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 font-medium text-center">
                  <div className="p-2 bg-gray-100 rounded">หน่วยงาน</div>
                  <div className="p-2 bg-gray-100 rounded">ด้านความร่วมมือ</div>
                </div>
                {[...Array(5)].map((_, i) => {
                  const org = section2.section2_network_expansion?.[`org${i+1}`]; 
                  const coop = section2.section2_network_expansion?.[`cooperation${i+1}`]; 
                  if (!org) return null; 
                  return (
                    <div key={i} className="grid grid-cols-2 gap-4 text-sm border-b pb-2">
                      <div className="p-2">{org}</div>
                      <div className="p-2">{coop || 'N/A'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="print-section-card">
          <CardHeader className="print-card-header">
            <CardTitle>ส่วนที่ 3: การขับเคลื่อนระบบข้อมูลเมืองหรือโครงการนวัตกรรมต่อยอดสู่การเป็นองค์กร ที่ขับเคลื่อนด้วยข้อมูล (Data Driven Organization)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {section3Factors.map(cat => (
              <div key={cat.category} className="print-item-block mb-6">
                <h3 className="text-lg font-bold mb-2 text-purple-700 print-category-heading">{cat.category}</h3>
                <div className="space-y-3">
                  {cat.items.map(item => (
                    <div key={item.field} className="print-sub-item">
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
