import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Section1ViewerProps {
  data: any;
}

const Section1Viewer: React.FC<Section1ViewerProps> = ({ data }) => {
  const renderArrayField = (value: any, options: string[]) => {
    if (!value || !Array.isArray(value)) return [];
    return value.map((selected, index) => (
      <div key={index} className="flex items-center space-x-2 p-2 bg-secondary/20 rounded">
        <span className="text-sm">{selected}</span>
      </div>
    ));
  };

  const renderCheckboxes = (value: any, options: any[]) => {
    if (!value || !Array.isArray(value)) return null;
    return (
      <div className="space-y-2">
        {options.map((option, index) => {
          const isChecked = value.includes(option.text || option);
          return (
            <div key={index} className={`flex items-center space-x-2 p-2 rounded ${isChecked ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/10'}`}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                {isChecked && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm">{option.text || option}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRatingScale = (value: any, max: number = 10) => {
    return (
      <div className="flex space-x-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`w-8 h-8 rounded border flex items-center justify-center text-sm ${
              value === num
                ? 'bg-primary text-white border-primary'
                : 'bg-secondary border-secondary'
            }`}
          >
            {num}
          </div>
        ))}
        {value && (
          <Badge variant="outline" className="ml-4">
            เลือก: {value}/{max}
          </Badge>
        )}
      </div>
    );
  };

  const knowledgeOutcomes = [
    "มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก",
    "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง",
    "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น",
    "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง",
    "รู้จักเครือข่ายมากขึ้น",
  ];

  const applicationOutcomes = [
    "นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง",
    "สามารถพัฒนาฐานข้อมูลเมืองของตนได้",
    "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้",
    "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง",
  ];

  const problemsBefore = [
    { text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่" },
    { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น" },
    { text: "การบริหารจัดการองค์กร" },
    { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน" },
    { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น" },
    { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน" },
    { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด" },
    { text: "ขาดเครือข่ายในการพัฒนาเมือง" },
    { text: "ขาดความรู้ทักษะในการพัฒนาเมือง" },
    { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง" },
  ];

  const knowledgeSolutions = [
    "การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น",
    "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.",
    "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน",
    "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ",
    "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น",
    "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)",
    "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด",
    "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)",
  ];

  const itUsage = [
    "ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด",
    "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง",
    "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น",
    "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ",
    "ช่วยในการเพิ่มความเสมอภาคในการบริการ",
    "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
    "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service",
  ];

  const cooperationUsage = [
    "ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน",
    "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา",
    "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ",
    "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
    "ช่วยพัฒนาโครงการได้ดีขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น",
    "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน",
  ];

  const fundingUsage = [
    "ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding",
    "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา",
    "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน",
    "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน",
    "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน",
  ];

  const cultureUsage = [
    "ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน",
    "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ",
    "ใช้ในการจัดทำหลักสูตรท้องถิ่น",
    "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว",
  ];

  const greenUsage = [
    "ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม",
    "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ",
    "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด",
    "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม",
  ];

  const newDevUsage = [
    "ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ",
    "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น",
    "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่",
    "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น \"บริษัทพัฒนาเมืองหรือ \"วิสาหกิจเพื่อสังคม\"",
    "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน",
  ];

  const successFactors = [
    "ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น",
    "นวัตกรรมที่พัฒนาขึ้นสอดคล้องกับปัญหาและความต้องการของกลุ่มเป้าหมาย",
    "การกำหนดวัตถุประสงค์และเป้าหมายของการพัฒนาเมืองได้อย่างชัดเจน และสื่อสาร",
    "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม",
    "ภาวะผู้นำ ประสบการณ์ความรู้ ความเข้าใจในเทคโนโลยี และการใช้ประโยชน์จากเทคโนโลยี",
    "เสถียรภาพการเมืองที่ส่งผลให้การบริหารจัดการโครงการพัฒนา/นวัตกรรมท้องถิ่นเป็นไปอย่างต่อเนื่อง",
    "การให้ความรู้ และการสร้างเครือข่ายทางวิชาการ และ/หรือ เครือข่ายการพัฒนา",
    "การประชาสัมพันธ์ข้อมูลและการสร้างความเข้าใจในนวัตกรรมและเทคโนโลยีที่พัฒนาขึ้นให้กับประชาชนผู้รับบริการ/ผู้ใช้ประโยชน์",
    "การมีเจ้าหน้าที่และทีมงานที่ดี มีประสบการณ์ สามารถดูแลระบบได้อย่างต่อเนื่อง",
    "สร้างการมีส่วนร่วมของชุมชน/ภาคีต่างๆ มากขึ้น",
    "การประสานความร่วมมือของหน่วยงานต่างๆทั้งระดับท้องถิ่นและระดับประเทศ",
    "เพิ่มความโปร่งใสในการพัฒนาเมือง",
    "ทำให้กล้าคิด กล้าทำ หรือคิดนอกกรอบมากขึ้น",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">ส่วนที่ 1</h2>
        <p className="text-lg text-muted-foreground">
          ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)
        </p>
      </div>

      {/* 1.1 ผลลัพธ์ภายหลัง */}
      <Card>
        <CardHeader>
          <CardTitle>1.1 ผลลัพธ์ภายหลังจากเข้าร่วมอบรม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">ด้านองค์ความรู้</h4>
              {renderCheckboxes(data.section1_knowledge_outcomes, knowledgeOutcomes)}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">ด้านการประยุกต์ใช้องค์ความรู้</h4>
              {renderCheckboxes(data.section1_application_outcomes, applicationOutcomes)}
            </div>

            {data.section1_application_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_application_other}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 1.2 อธิบายการเปลี่ยนแปลง */}
      {data.section1_changes_description && (
        <Card>
          <CardHeader>
            <CardTitle>1.2 อธิบายการเปลี่ยนแปลงที่เกิดขึ้นกับท่านภายหลังจากเข้าร่วมอบรม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-secondary/20 rounded">
              {data.section1_changes_description}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1.3 ปัญหาก่อนอบรม */}
      <Card>
        <CardHeader>
          <CardTitle>1.3 ปัญหาในการพัฒนาเมืองก่อนเข้าร่วมอบรม</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCheckboxes(data.section1_problems_before, problemsBefore)}
          {data.section1_problems_other && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">ปัญหาอื่น ๆ</h4>
              <div className="p-3 bg-secondary/20 rounded">
                {data.section1_problems_other}
              </div>
            </div>
          )}
          
          {/* แสดงรายละเอียดของปัญหาที่เลือก */}
          {problemsBefore.map((problem, index) => {
            const isSelected = data.section1_problems_before?.includes(problem.text);
            const detailField = `section1_problems_detail_${index + 1}`;
            const detailValue = data[detailField];
            
            if (isSelected && detailValue) {
              return (
                <div key={index} className="mt-4">
                  <h4 className="font-medium mb-2">รายละเอียด: {problem.text}</h4>
                  <div className="p-3 bg-secondary/20 rounded">
                    {detailValue}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </CardContent>
      </Card>

      {/* 1.4 การใช้องค์ความรู้ */}
      <Card>
        <CardHeader>
          <CardTitle>1.4 การใช้องค์ความรู้ในการแก้ปัญหาตามที่ระบุในข้อ 3 อย่างไร</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_knowledge_solutions, knowledgeSolutions)}
            
            {data.section1_knowledge_solutions_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_knowledge_solutions_other}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">ระดับความรู้ก่อนอบรม (1-10)</h4>
                {renderRatingScale(data.section1_knowledge_before)}
              </div>
              
              <div>
                <h4 className="font-medium mb-3">ระดับความรู้หลังอบรม (1-10)</h4>
                {renderRatingScale(data.section1_knowledge_after)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.5 กลไกข้อมูลสารสนเทศ */}
      <Card>
        <CardHeader>
          <CardTitle>1.5 กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_it_usage, itUsage)}
            
            {data.section1_it_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_it_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของเทคโนโลยี (1-10)</h4>
              {renderRatingScale(data.section1_it_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.6 กลไกประสานความร่วมมือ */}
      <Card>
        <CardHeader>
          <CardTitle>1.6 กลไกประสานความร่วมมือ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_cooperation_usage, cooperationUsage)}
            
            {data.section1_cooperation_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_cooperation_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของความร่วมมือ (1-10)</h4>
              {renderRatingScale(data.section1_cooperation_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.7 กลไกการระดมทุน */}
      <Card>
        <CardHeader>
          <CardTitle>1.7 กลไกการระดมทุน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_funding_usage, fundingUsage)}
            
            {data.section1_funding_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_funding_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของการระดมทุน (1-10)</h4>
              {renderRatingScale(data.section1_funding_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.8 กลไกวัฒนธรรม */}
      <Card>
        <CardHeader>
          <CardTitle>1.8 กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_culture_usage, cultureUsage)}
            
            {data.section1_culture_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_culture_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของวัฒนธรรม (1-10)</h4>
              {renderRatingScale(data.section1_culture_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.9 กลไกเศรษฐกิจสีเขียว */}
      <Card>
        <CardHeader>
          <CardTitle>1.9 กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_green_usage, greenUsage)}
            
            {data.section1_green_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_green_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของเศรษฐกิจสีเขียว (1-10)</h4>
              {renderRatingScale(data.section1_green_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.10 กลไกการพัฒนาใหม่ */}
      <Card>
        <CardHeader>
          <CardTitle>1.10 กลไกการพัฒนาใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_new_dev_usage, newDevUsage)}
            
            {data.section1_new_dev_usage_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_new_dev_usage_other}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-3">ระดับการช่วยเหลือของการพัฒนาใหม่ (1-10)</h4>
              {renderRatingScale(data.section1_new_dev_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.12 ปัจจัยความสำเร็จ */}
      <Card>
        <CardHeader>
          <CardTitle>1.12 ปัจจัยความสำเร็จของการพัฒนาเมืองด้วยนวัตกรรม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderCheckboxes(data.section1_success_factors, successFactors)}
            
            {data.section1_success_factors_other && (
              <div>
                <h4 className="font-medium mb-2">อื่น ๆ</h4>
                <div className="p-3 bg-secondary/20 rounded">
                  {data.section1_success_factors_other}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 1.13 อธิบายปัจจัยความสำเร็จ */}
      {data.section1_success_description && (
        <Card>
          <CardHeader>
            <CardTitle>1.13 อธิบายปัจจัยความสำเร็จ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-secondary/20 rounded">
              {data.section1_success_description}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1.14 ระดับการเปลี่ยนแปลง */}
      <Card>
        <CardHeader>
          <CardTitle>1.14 ระดับการเปลี่ยนแปลงโดยรวม</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className="font-medium mb-3">ระดับการเปลี่ยนแปลงโดยรวม (1-10)</h4>
            {renderRatingScale(data.section1_overall_change_level)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Section1Viewer;