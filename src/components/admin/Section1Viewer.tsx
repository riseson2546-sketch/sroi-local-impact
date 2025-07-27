import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Star, TrendingUp, Users, Database, Lightbulb } from "lucide-react";

interface Section1ViewerProps {
  data: any;
}

const Section1Viewer: React.FC<Section1ViewerProps> = ({ data }) => {
  
  // ฟังก์ชันสำหรับแสดง checkbox แบบมี visual indicator
  const renderCheckboxes = (value: any, options: any[], showCount = true) => {
    if (!value || !Array.isArray(value)) return (
      <div className="text-gray-500 italic">ไม่มีข้อมูล</div>
    );
    
    const selectedCount = value.length;
    const totalCount = options.length;
    
    return (
      <div className="space-y-3">
        {showCount && (
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              เลือก {selectedCount} จาก {totalCount} ตัวเลือก
            </Badge>
            <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-32">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${(selectedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
        <div className="grid gap-2">
          {options.map((option, index) => {
            const isChecked = value.includes(option.text || option);
            return (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                isChecked 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {isChecked ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm leading-relaxed ${
                  isChecked ? 'text-green-800 font-medium' : 'text-gray-600'
                }`}>
                  {option.text || option}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ฟังก์ชันแสดงปัญหาพร้อมรายละเอียด
  const renderProblemsWithDetails = (problems: any[], problemsData: any[], formData: any) => {
    if (!problemsData || !Array.isArray(problemsData)) return (
      <div className="text-gray-500 italic">ไม่มีข้อมูล</div>
    );

    return (
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          เลือก {problemsData.length} ปัญหา
        </Badge>
        <div className="grid gap-3">
          {problems.map((problem, index) => {
            const isChecked = problemsData.includes(problem.text);
            const detailKey = `section1_problems_detail_${index}`;
            const hasDetail = isChecked && formData[detailKey];
            
            return (
              <div key={index} className={`rounded-lg border transition-all ${
                isChecked 
                  ? 'bg-orange-50 border-orange-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start space-x-3 p-3">
                  {isChecked ? (
                    <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm leading-relaxed ${
                    isChecked ? 'text-orange-800 font-medium' : 'text-gray-600'
                  }`}>
                    {problem.text}
                  </span>
                </div>
                {hasDetail && (
                  <div className="px-3 pb-3 ml-8">
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <div className="text-xs text-orange-600 font-medium mb-1">รายละเอียดเพิ่มเติม:</div>
                      <div className="text-sm text-gray-700">{formData[detailKey]}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ฟังก์ชันแสดง rating scale
  const renderRatingScale = (value: any, title?: string, max: number = 10) => {
    if (!value) return (
      <div className="text-gray-500 italic">ไม่มีข้อมูล</div>
    );

    const percentage = (value / max) * 100;
    const getColorClass = (val: number) => {
      if (val <= 3) return 'text-red-600 bg-red-100 border-red-300';
      if (val <= 6) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      return 'text-green-600 bg-green-100 border-green-300';
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getColorClass(value)}`}>
            {value}/{max}
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  percentage <= 30 ? 'bg-red-500' : 
                  percentage <= 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className={`h-6 text-xs rounded border flex items-center justify-center ${
                value === num
                  ? 'bg-blue-600 text-white border-blue-600 font-bold'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ฟังก์ชันแสดงข้อความยาว
  const renderTextArea = (text: string, placeholder: string = "ไม่มีข้อมูล") => {
    if (!text || text.trim() === '') {
      return <div className="text-gray-500 italic">{placeholder}</div>;
    }
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</div>
      </div>
    );
  };

  // ฟังก์ชันแสดงข้อมูล "อื่น ๆ"
  const renderOtherField = (otherText: string, title: string = "อื่น ๆ") => {
    if (!otherText || otherText.trim() === '') return null;
    
    return (
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="text-purple-700 font-medium text-sm mb-2">{title}</div>
        <div className="text-gray-700">{otherText}</div>
      </div>
    );
  };

  // ฟังก์ชันสร้าง summary card
  const renderSummaryCard = () => {
    const totalSections = 14;
    const completedSections = [
      data.section1_knowledge_outcomes,
      data.section1_application_outcomes,
      data.section1_changes_description,
      data.section1_problems_before,
      data.section1_knowledge_solutions,
      data.section1_knowledge_before,
      data.section1_knowledge_after,
      data.section1_it_usage,
      data.section1_it_level,
      data.section1_cooperation_usage,
      data.section1_cooperation_level,
      data.section1_funding_usage,
      data.section1_funding_level,
      data.section1_culture_usage,
      data.section1_culture_level,
      data.section1_green_usage,
      data.section1_green_level,
      data.section1_new_dev_usage,
      data.section1_new_dev_level,
      data.section1_success_factors,
      data.section1_success_description,
      data.section1_overall_change_level
    ].filter(item => item && (Array.isArray(item) ? item.length > 0 : true)).length;

    const completionRate = Math.round((completedSections / totalSections) * 100);

    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            <span>สรุปผลการตอบแบบสอบถาม</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">ความครบถ้วน</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {data.section1_overall_change_level || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">ระดับการเปลี่ยนแปลง</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {(data.section1_knowledge_after || 0) - (data.section1_knowledge_before || 0)}
              </div>
              <div className="text-sm text-gray-600">พัฒนาการความรู้</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                {data.section1_problems_before?.length || 0}
              </div>
              <div className="text-sm text-gray-600">ปัญหาที่ระบุ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ข้อมูลตัวเลือกทั้งหมด
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
    { text: "มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", hasDetail: true },
    { text: "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", hasDetail: true },
    { text: "การบริหารจัดการองค์กร", hasDetail: true },
    { text: "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", hasDetail: true },
    { text: "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", hasDetail: true },
    { text: "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", hasDetail: true },
    { text: "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", hasDetail: true },
    { text: "ขาดเครือข่ายในการพัฒนาเมือง", hasDetail: true },
    { text: "ขาดความรู้ทักษะในการพัฒนาเมือง", hasDetail: true },
    { text: "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง", hasDetail: true },
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
    "ทำให้มีข้อมูลในการพัฒนาเมือง ซึ่งนำไปสู่การแก้ไขปัญหาได้อย่างตรงจุด ตรงเป้า",
    "การมีระบบในการติดตามและรายงานผลการใช้ประโยชน์จากนวัตกรรม"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">ส่วนที่ 1</h1>
        <p className="text-xl opacity-90">
          ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)
        </p>
        <p className="text-sm opacity-75 mt-2">ข้อมูลที่ผู้เข้าร่วมอบรมตอบแบบสอบถาม</p>
      </div>

      {/* Summary */}
      {renderSummaryCard()}

      {/* 1. ผลลัพธ์ภายหลัง */}
      <Card className="shadow-lg">
        <CardHeader className="bg-green-50 border-b border-green-200">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Lightbulb className="h-5 w-5" />
            <span>1. ผลลัพธ์ภายหลังจากการเข้าร่วมอบรม</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-700 border-b border-green-200 pb-2">
                ด้านองค์ความรู้
              </h4>
              {renderCheckboxes(data.section1_knowledge_outcomes, knowledgeOutcomes)}
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-700 border-b border-green-200 pb-2">
                ด้านการประยุกต์ใช้องค์ความรู้
              </h4>
              {renderCheckboxes(data.section1_application_outcomes, applicationOutcomes)}
              {renderOtherField(data.section1_application_other, "การประยุกต์ใช้อื่น ๆ")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. อธิบายการเปลี่ยนแปลง */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <CardTitle className="text-blue-800">2. อธิบายการเปลี่ยนแปลงที่เกิดขึ้น</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderTextArea(data.section1_changes_description, "ไม่ได้ระบุการเปลี่ยนแปลง")}
        </CardContent>
      </Card>

      {/* 3. ปัญหาก่อนอบรม */}
      <Card className="shadow-lg">
        <CardHeader className="bg-orange-50 border-b border-orange-200">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            <span>3. ปัญหาก่อนเข้าร่วมอบรม</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderProblemsWithDetails(problemsBefore, data.section1_problems_before, data)}
        </CardContent>
      </Card>

      {/* 4. การใช้องค์ความรู้ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-purple-50 border-b border-purple-200">
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Database className="h-5 w-5" />
            <span>4. การใช้องค์ความรู้ในการแก้ไขปัญหา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-purple-700 border-b border-purple-200 pb-2">
                วิธีการนำความรู้ไปใช้
              </h4>
              {renderCheckboxes(data.section1_knowledge_solutions, knowledgeSolutions)}
              {renderOtherField(data.section1_knowledge_solutions_other, "วิธีการอื่น ๆ")}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold mb-4 text-red-700">ระดับความรู้ก่อนอบรม</h4>
                {renderRatingScale(data.section1_knowledge_before, "ก่อนอบรม")}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-4 text-green-700">ระดับความรู้หลังอบรม</h4>
                {renderRatingScale(data.section1_knowledge_after, "หลังอบรม")}
              </div>
            </div>

            {data.section1_knowledge_before && data.section1_knowledge_after && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">การพัฒนาความรู้</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">📈</span>
                  <span className="text-lg">
                    พัฒนาขึ้น <strong className="text-blue-600">
                      {data.section1_knowledge_after - data.section1_knowledge_before} ระดับ
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 5. กลไกข้อมูลสารสนเทศ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-indigo-50 border-b border-indigo-200">
          <CardTitle className="text-indigo-800">5. กลไกข้อมูลสารสนเทศและเทคโนโลยีดิจิทัล</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_it_usage, itUsage)}
            {renderOtherField(data.section1_it_usage_other, "การใช้เทคโนโลยีอื่น ๆ")}
            
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold mb-4 text-indigo-700">ระดับการช่วยเหลือของเทคโนโลยี</h4>
              {renderRatingScale(data.section1_it_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. กลไกประสานความร่วมมือ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-teal-50 border-b border-teal-200">
          <CardTitle className="flex items-center space-x-2 text-teal-800">
            <Users className="h-5 w-5" />
            <span>6. กลไกประสานความร่วมมือ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_cooperation_usage, cooperationUsage)}
            {renderOtherField(data.section1_cooperation_usage_other, "ความร่วมมืออื่น ๆ")}
            
            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-semibold mb-4 text-teal-700">ระดับการช่วยเหลือของความร่วมมือ</h4>
              {renderRatingScale(data.section1_cooperation_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. กลไกการระดมทุน */}
      <Card className="shadow-lg">
        <CardHeader className="bg-emerald-50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800">7. กลไกการระดมทุน</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_funding_usage, fundingUsage)}
            {renderOtherField(data.section1_funding_usage_other, "การระดมทุนอื่น ๆ")}
            
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold mb-4 text-emerald-700">ระดับการช่วยเหลือของการระดมทุน</h4>
              {renderRatingScale(data.section1_funding_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. กลไกวัฒนธรรม */}
      <Card className="shadow-lg">
        <CardHeader className="bg-rose-50 border-b border-rose-200">
          <CardTitle className="text-rose-800">8. กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_culture_usage, cultureUsage)}
            {renderOtherField(data.section1_culture_usage_other, "วัฒนธรรมอื่น ๆ")}
            
            <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h4 className="font-semibold mb-4 text-rose-700">ระดับการช่วยเหลือของวัฒนธรรม</h4>
              {renderRatingScale(data.section1_culture_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. กลไกเศรษฐกิจสีเขียว */}
      <Card className="shadow-lg">
        <CardHeader className="bg-lime-50 border-b border-lime-200">
          <CardTitle className="text-lime-800">9. กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_green_usage, greenUsage)}
            {renderOtherField(data.section1_green_usage_other, "เศรษฐกิจสีเขียวอื่น ๆ")}
            
            <div className="mt-6 p-4 bg-lime-50 rounded-lg border border-lime-200">
              <h4 className="font-semibold mb-4 text-lime-700">ระดับการช่วยเหลือของเศรษฐกิจสีเขียว</h4>
              {renderRatingScale(data.section1_green_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 10-11. กลไกการพัฒนาใหม่ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-violet-50 border-b border-violet-200">
          <CardTitle className="text-violet-800">10-11. กลไกการพัฒนาใหม่</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {renderCheckboxes(data.section1_new_dev_usage, newDevUsage)}
            {renderOtherField(data.section1_new_dev_usage_other, "การพัฒนาใหม่อื่น ๆ")}
            
            <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h4 className="font-semibold mb-4 text-violet-700">ระดับการช่วยเหลือของการพัฒนาใหม่</h4>
              {renderRatingScale(data.section1_new_dev_level)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12. ปัจจัยความสำเร็จ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-amber-50 border-b border-amber-200">
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Star className="h-5 w-5" />
            <span>12. ปัจจัยความสำเร็จ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {renderCheckboxes(data.section1_success_factors, successFactors)}
            {renderOtherField(data.section1_success_factors_other, "ปัจจัยความสำเร็จอื่น ๆ")}
          </div>
        </CardContent>
      </Card>

      {/* 13. อธิบายปัจจัยความสำเร็จ */}
      <Card className="shadow-lg">
        <CardHeader className="bg-cyan-50 border-b border-cyan-200">
          <CardTitle className="text-cyan-800">13. อธิบายปัจจัยความสำเร็จ</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderTextArea(data.section1_success_description, "ไม่ได้อธิบายปัจจัยความสำเร็จ")}
        </CardContent>
      </Card>

      {/* 14. ระดับการเปลี่ยนแปลง */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            <span>14. ระดับการเปลี่ยนแปลงโดยรวม</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-green-700">ระดับการเปลี่ยนแปลงของเมือง</h4>
            {renderRatingScale(data.section1_overall_change_level)}
            
            {data.section1_overall_change_level && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                <h4 className="font-semibold text-green-700 mb-3">ผลสรุป</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-3xl font-bold text-green-600">{data.section1_overall_change_level}/10</div>
                    <div className="text-sm text-gray-600">ระดับการเปลี่ยนแปลง</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-lg font-semibold text-blue-600">
                      {data.section1_overall_change_level <= 3 ? 'การเปลี่ยนแปลงน้อย' :
                       data.section1_overall_change_level <= 6 ? 'การเปลี่ยนแปลงปานกลาง' :
                       'การเปลี่ยนแปลงสูง'}
                    </div>
                    <div className="text-sm text-gray-600">ประเมินผล</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-600">
          💡 รายงานนี้สรุปผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          สร้างโดยระบบแสดงผลข้อมูลแบบอัตโนมัติ
        </p>
      </div>
    </div>
  );
};

export default Section1Viewer;
