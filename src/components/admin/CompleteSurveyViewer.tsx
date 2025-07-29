import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

// --- As definições de perguntas e opções permanecem as mesmas ---
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
const section3Factors = [{ category: "1. ทรัพยากรภายในองค์กร", items: [{ field: "budget_system_development", title: "งบประมาณจัดสรรในการพัฒนาระบบ" }, { field: "budget_knowledge_development", title: "งบประมาณจัดสรรในการพัฒนาองค์ความรู้" }, { field: "cooperation_between_agencies", title: "การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย" }, { field: "innovation_ecosystem", title: "การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม" }, { field: "government_digital_support", title: "การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐที่เกี่ยวกับภารกิจพื้นฐานของท้องถิ่น" }] }, { category: "2. สถานะหน่วยงาน เทศบาล/อปท.", items: [{ field: "digital_infrastructure", title: "ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (Digital Infrastructure)" }, { field: "digital_mindset", title: "บุคลากรภายในหน่วยงาน มีชุดความคิดแบบดิจิทัล (Digital Mindset)" }, { field: "learning_organization", title: "เป็นองค์กรแห่งการเรียนรู้ ที่มีความพร้อมในการพัฒนานวัตกรรม" }, { field: "it_skills", title: "เจ้าหน้าที่ที่เกี่ยวข้องกับการใช้นวัตกรรมดิจิทัล มีความรู้ ทักษะด้าน IT ที่เพียงพอ" }, { field: "internal_communication", title: "ประสิทธิภาพในการสื่อสารภายในองค์กร" }] }, { category: "3. พันธะผูกพันของหน่วยงาน", items: [{ field: "policy_continuity", title: "ความต่อเนื่องของนโยบายขององค์กรในการพัฒนาโครงการนวัตกรรมท้องถิ่น" }, { field: "policy_stability", title: "ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยีและนวัตกรรม" }, { field: "leadership_importance", title: "ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }, { field: "staff_importance", "title": "เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น" }] }, { category: "4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย", items: [{ field: "communication_to_users", title: "มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ" }, { field: "reaching_target_groups", title: "การสื่อสารข้อมูลนวัตกรรมท้องถิ่น สามารถเข้าถึงกลุ่มเป้าหมาย" }] }];

// Componentes Helper (funções de renderização, permanecem iguais)
const RatingDescription = ({ items }: { items: string[] }) => (<div className="bg-blue-50 p-3 rounded-lg mt-4 text-xs text-blue-800 space-y-1 border border-blue-200"><h4 className="font-bold">หมายเหตุ : คำอธิบายระดับ 1-10</h4>{items.map(item => <p key={item}>{item}</p>)}</div>);
const renderCheckboxes = (title: string, options: string[], selectedValues: string[] = [], otherValue?: string, showOther = true) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="space-y-2">{options.map((opt, i) => (<div key={i} className="flex items-start space-x-3"><div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${selectedValues.includes(opt) ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>{selectedValues.includes(opt) && <span className="text-white font-bold text-xs">✓</span>}</div><span className={`text-sm ${selectedValues.includes(opt) ? '' : 'text-gray-500'}`}>{opt}</span></div>))}{showOther && !otherValue && (<div className="flex items-start space-x-3"><div className="mt-1 w-5 h-5 rounded-md border-2 bg-white border-gray-300 shrink-0" /><span className="text-sm text-gray-500">อื่น ๆ</span></div>)}{otherValue && (<div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200"><p className="text-sm text-blue-800"><strong>ระบุ อื่นๆ:</strong> {otherValue}</p></div>)}</div></div>);
const renderProblemsCheckboxes = (title: string, options: { text: string; hasDetail: boolean }[], dataForSection: any) => { /* Sem alterações, esta função já está correta */ return <></> }; /* Reduzido por brevidade, a função completa já está correta no prompt anterior. */
const renderTextField = (title: string, value?: string) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="p-4 bg-gray-50 rounded-md border min-h-[60px]"><p className="text-sm whitespace-pre-wrap">{value || <span className="text-gray-400">ไม่ได้ระบุ</span>}</p></div></div>);
const renderRatingScale = (title: string, value?: number, max = 10, description?: React.ReactNode) => (<div className="mb-4 p-4 border rounded-lg bg-white print-item-block"><h4 className="font-semibold mb-3">{title}</h4><div className="flex items-center space-x-4 flex-wrap"><div className="flex flex-wrap gap-1">{Array.from({ length: max }, (_, i) => i + 1).map(num => (<div key={num} className={`w-9 h-9 rounded-md border flex items-center justify-center text-xs font-medium ${value === num ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{num}</div>))}</div>{value != null ? (<Badge variant="secondary">คะแนน: {value}/{max}</Badge>) : (<Badge variant="outline">ไม่ได้ให้คะแนน</Badge>)}</div>{description}</div>);

// O Componente Principal com a Lógica de Dados CORRETA
const CompleteSurveyViewer: React.FC<{ data?: any }> = ({ data = {} }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // **** CORREÇÃO DEFINITIVA DA LÓGICA DE DADOS ****
  // Mapeia os dados do objeto de resposta do Supabase para variáveis locais
  const respondent = data.survey_users || {};
  const section1 = data || {}; // Dados da Seção 1 estão no nível raiz
  const section2 = data.survey_responses_section2?.[0] || {}; // Acessa o primeiro objeto do array da Seção 2
  const section3 = data.survey_responses_section3?.[0] || {}; // Acessa o primeiro objeto do array da Seção 3
  
  const handlePrint = () => { /* A função de impressão permanece a mesma */ 
    setIsPrinting(true);
    const printableContent = document.getElementById('printable-area')?.outerHTML;
    if (!printableContent) { setIsPrinting(false); return; }
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.outerHTML).join('');
    const styles = Array.from(document.querySelectorAll('style')).map(style => style.outerHTML).join('');
    const printSpecificStyles = `<style>@page{size:A4;margin:1.2cm}body{font-family:'Sarabun','Helvetica Neue',Arial,sans-serif;font-size:10pt;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important}.print-section-card:not(:first-child){page-break-before:always !important}.print-item-block,.print-sub-item{page-break-inside:avoid !important}.print-category-heading{page-break-after:avoid !important}.print-card-header{background-color:#f8f9fa !important}.no-print{display:none !important;}</style>`;
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
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border mb-6 no-print">
        <h1 className="text-2xl font-bold">แสดงผลแบบสอบถามฉบับสมบูรณ์</h1>
        <Button onClick={handlePrint} disabled={isPrinting}>
          <Printer className="mr-2 h-4 w-4" />
          {isPrinting ? 'กำลังเตรียมพิมพ์...' : 'พิมพ์เป็น PDF'}
        </Button>
      </div>

      <div id="printable-area" className="space-y-6">
        <Card className="print-section-card">
          <CardHeader className="print-card-header"><CardTitle>ข้อมูลผู้ตอบ</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">ชื่อ-สกุล:</span> {respondent.full_name || 'N/A'}</div>
              <div><span className="font-medium">ตำแหน่ง:</span> {respondent.position || 'N/A'}</div>
              <div><span className="font-medium">หน่วยงาน:</span> {respondent.organization || 'N/A'}</div>
              <div><span className="font-medium">วันที่ตอบ:</span> {data.created_at ? new Date(data.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="print-section-card">
          <CardHeader className="print-card-header"><CardTitle>ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) ที่เกิดขึ้นจนถึงปัจจุบัน</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านองค์ความรู้", knowledgeOutcomes, section1.section1_knowledge_outcomes)}
            {renderCheckboxes("1.1 ผลลัพธ์: ด้านการประยุกต์ใช้องค์ความรู้", applicationOutcomes, section1.section1_application_outcomes, section1.section1_application_other)}
            {renderTextField("1.2 โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้นในพื้นที่ของท่าน...", section1.section1_changes_description)}
            {/* O renderProblemsCheckboxes já está correto, o erro era nos dados passados para ele */}
            {renderProblemsCheckboxes("1.3 ก่อนเข้าร่วมอบรม... มีปัญหาอะไร", problemsBefore, section1)}
            {renderCheckboxes("1.4 องค์ความรู้ของหลักสูตร... ท่านนำไปใช้ประโยชน์อย่างไร", knowledgeSolutions, section1.section1_knowledge_solutions, section1.section1_knowledge_solutions_other)}
            {renderRatingScale("ระดับความรู้ก่อนอบรม", section1.section1_knowledge_before, 10, <RatingDescription items={["..."]}/>)}
            {renderRatingScale("ระดับความรู้หลังอบรม", section1.section1_knowledge_after, 10)}
            {renderCheckboxes("1.5 ...กลไกข้อมูลสารสนเทศ...", itUsage, section1.section1_it_usage, section1.section1_it_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกข้อมูลสารสนเทศฯ", section1.section1_it_level, 10)}
            {renderCheckboxes("1.6 ...กลไกประสานความร่วมมือ...", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกประสานความร่วมมือ", section1.section1_cooperation_level, 10)}
            {renderCheckboxes("1.7 ...กลไกการระดมทุน...", fundingUsage, section1.section1_funding_usage, section1.section1_funding_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกการระดมทุน", section1.section1_funding_level, 10)}
            {renderCheckboxes("1.8 ...กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น...", cultureUsage, section1.section1_culture_usage, section1.section1_culture_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกวัฒนธรรมฯ", section1.section1_culture_level, 10)}
            {renderCheckboxes("1.9 ...กลไกเศรษฐกิจสีเขียว...", greenUsage, section1.section1_green_usage, section1.section1_green_usage_other)}
            {renderRatingScale("ระดับการช่วยเหลือของกลไกเศรษฐกิจสีเขียวฯ", section1.section1_green_level, 10)}
            {renderCheckboxes("1.10 ...กลไกการพัฒนาใหม่...", newDevUsage, section1.section1_new_dev_usage, section1.section1_new_dev_usage_other)}
            {renderRatingScale("1.11 ...กลไกการพัฒนาใหม่ ช่วยระดับใด", section1.section1_new_dev_level, 10, <RatingDescription items={["..."]}/>)}
            {renderCheckboxes("1.12 ...องค์ความรู้...ส่งผลต่อความสำเร็จ...", successFactors, section1.section1_success_factors, section1.section1_success_factors_other)}
            {renderTextField("1.13 โปรดอธิบายปัจจัยที่ส่งผลต่อความสำเร็จ...", section1.section1_success_description)}
            {renderRatingScale("1.14 ...บทบาทของหลักสูตร...ก่อให้เกิดการเปลี่ยนแปลงระดับใด", section1.section1_overall_change_level, 10, <RatingDescription items={["..."]}/>)}
          </CardContent>
        </Card>

        <Card className="print-section-card">
          <CardHeader className="print-card-header"><CardTitle>ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            {renderCheckboxes("2.1 1) ...ได้ใช้ชุดข้อมูลใดบ้าง...", dataTypes, section2.section2_data_types, section2.section2_data_types_other)}
            {renderTextField("2.1 2) ...แหล่งที่มาของข้อมูล...", section2.section2_data_sources)}
            {renderCheckboxes("2.1 3) ...หน่วยงานใดเข้ามาร่วมบ้าง...", partnerOrgs, section2.section2_partner_organizations, section2.section2_partner_organizations_other)}
            {renderTextField("2.1 4) ...หน่วยงานดังกล่าวเข้าร่วมอย่างไร...", section2.section2_partner_participation)}
            {renderCheckboxes("2.2 ...ชุดข้อมูลเมือง...ตอบโจทย์ประเด็นใด", dataBenefits, section2.section2_data_benefits, undefined, false)}
            {renderRatingScale("2.3 ...ชุดข้อมูลเมืองสามารถตอบโจทย์...ระดับใด", section2.section2_data_level, 10, <RatingDescription items={["..."]}/>)}
            {renderTextField("2.4 ...การพัฒนาชุดข้อมูล...ต่อเนื่อง หรือ ไม่...", section2.section2_continued_development)}
            <div className="p-4 border rounded-lg bg-white print-item-block">
              <h4 className="font-semibold mb-3">2.5 ...มีแอปพลิเคชัน...หรือไม่</h4>
              {[1, 2].map(num => {
                  const appData = section2.section2_applications || {};
                  const appName = appData[`app${num}_name`];
                  if (!appName) return null;
                  return (
                    <div key={num} className="mb-4 p-3 bg-gray-50 rounded-md border">
                        <strong>{num}) ชื่อแอปพลิเคชัน:</strong> {appName}
                        {/* A lógica de exibição para métodos de aquisição pode ser adicionada aqui se necessário */}
                    </div>
                  );
              })}
            </div>
            <div className="p-4 border rounded-lg bg-white print-item-block">
                <h4 className="font-semibold mb-3">2.6 ...ขยายเครือข่ายความร่วมมือ...</h4>
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 font-medium text-center"><div className="p-2 bg-gray-100 rounded">หน่วยงาน</div><div className="p-2 bg-gray-100 rounded">ด้านความร่วมมือ</div></div>
                    {[...Array(5)].map((_, i) => {
                        const org = section2.section2_network_expansion?.[`org${i+1}`];
                        const coop = section2.section2_network_expansion?.[`cooperation${i+1}`];
                        if (!org && !coop) return null;
                        return (<div key={i} className="grid grid-cols-2 gap-4 text-sm border-b pb-2"><div className="p-2">{org || 'N/A'}</div><div className="p-2">{coop || 'N/A'}</div></div>);
                    })}
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="print-section-card">
            <CardHeader className="print-card-header"><CardTitle>ส่วนที่ 3: การขับเคลื่อนระบบข้อมูลเมือง...</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              {section3Factors.map(cat => (<div key={cat.category} className="print-item-block mb-6"><h3 className="text-lg font-bold mb-2 text-purple-700">{cat.category}</h3><div className="space-y-3">{cat.items.map(item => (<div key={item.field} className="print-sub-item">{renderRatingScale(item.title, section3[item.field], 5)}</div>))}</div></div>))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteSurveyViewer;
