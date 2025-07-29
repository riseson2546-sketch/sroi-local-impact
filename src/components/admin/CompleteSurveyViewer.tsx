import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Eye, Search, User, Calendar, Building } from 'lucide-react';

// ข้อมูลตัวอย่างแบบสอบถาม
const sampleData = {
  respondent: {
    name: "นายสมชาย ใจดี",
    position: "นายกเทศมนตรี",
    organization: "เทศบาลตำบลสวนผึ้ง",
    province: "จังหวัดราชบุรี",
    email: "somchai@example.com",
    phone: "081-234-5678",
    survey_date: "2024-03-15"
  },
  section1: {
    section1_knowledge_outcomes: [
      "มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก",
      "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง"
    ],
    section1_application_outcomes: [
      "นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง",
      "สามารถพัฒนาฐานข้อมูลเมืองของตนได้"
    ],
    section1_application_other: "การใช้เทคโนโลยี AI ในการวิเคราะห์ข้อมูล",
    section1_changes_description: "มีการปรับปรุงระบบการจัดเก็บขยะให้มีประสิทธิภาพมากขึ้น และสามารถติดตามข้อมูลได้แบบเรียลไทม์",
    section1_problems_before: [
      "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน",
      "ขาดเครือข่ายในการพัฒนาเมือง"
    ],
    section1_knowledge_solutions: [
      "การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น",
      "ใช้ข้อมุลเป็นฐานในการพัฒนาท้องถิ่น"
    ],
    section1_knowledge_before: 3,
    section1_knowledge_after: 8,
    section1_it_usage: [
      "ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด",
      "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง"
    ],
    section1_it_level: 7,
    section1_cooperation_usage: [
      "ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน"
    ],
    section1_cooperation_level: 6,
    section1_funding_usage: [
      "ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding"
    ],
    section1_funding_level: 5,
    section1_culture_usage: [
      "ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน"
    ],
    section1_culture_level: 6,
    section1_green_usage: [
      "ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม"
    ],
    section1_green_level: 5,
    section1_new_dev_usage: [
      "ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ"
    ],
    section1_new_dev_level: 4,
    section1_success_factors: [
      "ความสามารถในการวิเคราะห์ปัญหาและสาเหตุในการพัฒนาโครงการนวัตกรรมท้องถิ่น",
      "การมีส่วนร่วมจากทุกภาคส่วนในการคิด ออกแบบ และขับเคลื่อนการพัฒนาเมืองด้วยนวัตกรรม"
    ],
    section1_success_description: "ปัจจัยสำคัญคือการมีผู้นำที่มีวิสัยทัศน์และการสนับสนุนจากประชาชนในพื้นที่",
    section1_overall_change_level: 7
  },
  section2: {
    section2_data_types: [
      "ชุดข้อมูลด้านประชากร",
      "ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น"
    ],
    section2_data_sources: "ได้จากกรมส่งเสริมการปกครองท้องถิ่น และข้อมูลจากการสำรวจในพื้นที่",
    section2_partner_organizations: [
      "นักวิชาการจากสถาบันการศึกษา",
      "ภาคเอกชน"
    ],
    section2_partner_participation: "ช่วยในการพัฒนาระบบและให้คำปรึกษาด้านเทคนิค",
    section2_data_benefits: [
      "ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา",
      "การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น"
    ],
    section2_data_level: 6,
    section2_continued_development: "มีแผนจะพัฒนาระบบ AI เพื่อช่วยในการวิเคราะห์ข้อมูลและพยากรณ์แนวโน้ม",
    section2_applications: {
      app1_name: "ระบบจัดการขยะอัจฉริยะ",
      app1_method_develop: true,
      app1_method_other: true,
      app1_method_other_detail: "ได้รับการสนับสนุนจาก startup ท้องถิ่น",
      app2_name: "แอปพลิเคชันรายงานปัญหาชุมชน",
      app2_method_buy: true
    },
    section2_network_expansion: {
      org1: "มหาวิทยาลัยเกษตรศาสตร์",
      cooperation1: "วิจัยและพัฒนาเทคโนโลยีเกษตร",
      org2: "บริษัท Smart City Solutions",
      cooperation2: "พัฒนาระบบ IoT สำหรับเมือง"
    }
  },
  section3: {
    budget_system_development: 3,
    budget_knowledge_development: 4,
    cooperation_between_agencies: 4,
    innovation_ecosystem: 3,
    government_digital_support: 3,
    digital_infrastructure: 3,
    digital_mindset: 4,
    learning_organization: 4,
    it_skills: 3,
    internal_communication: 4,
    policy_continuity: 4,
    policy_stability: 3,
    leadership_importance: 5,
    staff_importance: 4,
    communication_to_users: 3,
    reaching_target_groups: 3
  }
};

interface SurveyViewerProps {
  data?: any;
}

const CompleteSurveyViewer: React.FC<SurveyViewerProps> = ({ data = sampleData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({ 
    section1: true, 
    section2: true, 
    section3: true 
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderCheckboxes = (values: string[], options: string[], title: string, otherValue?: string) => {
    if (!values || values.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
              <div className="w-4 h-4 rounded border-2 bg-green-500 border-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm">{value}</span>
            </div>
          ))}
          {otherValue && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <strong>อื่น ๆ:</strong> {otherValue}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTextField = (value: string, title: string) => {
    if (!value) return null;
    
    return (
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm leading-relaxed">{value}</p>
        </div>
      </div>
    );
  };

  const renderRatingScale = (value: number, title: string, max: number = 10) => {
    if (!value) return null;
    
    const getScoreColor = (score: number, maxScore: number) => {
      const percentage = (score / maxScore) * 100;
      if (percentage >= 80) return 'text-green-600 bg-green-100 border-green-300';
      if (percentage >= 60) return 'text-blue-600 bg-blue-100 border-blue-300';
      if (percentage >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      return 'text-red-600 bg-red-100 border-red-300';
    };

    return (
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">{title}</h4>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-medium ${
                  value === num
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <Badge className={`px-3 py-1 ${getScoreColor(value, max)}`}>
            คะแนน: {value}/{max}
          </Badge>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>น้อยที่สุด (1)</span>
          <span>มากที่สุด ({max})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">แบบสอบถามผลการพัฒนาเมืองด้วยนวัตกรรม</h1>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            รหัสแบบสอบถาม: SV-2024-001
          </Badge>
        </div>

        {/* ข้อมูลผู้ตอบ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium">ชื่อ-นามสกุล:</span>
            <span>{data.respondent?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-blue-600" />
            <span className="font-medium">ตำแหน่ง:</span>
            <span>{data.respondent?.position}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-blue-600" />
            <span className="font-medium">หน่วยงาน:</span>
            <span>{data.respondent?.organization}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium">วันที่ตอบ:</span>
            <span>{data.respondent?.survey_date}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="ค้นหาในเนื้อหาแบบสอบถาม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* ส่วนที่ 1 */}
      <Card className="shadow-sm">
        <CardHeader 
          className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
          onClick={() => toggleSection('section1')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-blue-800">
              ส่วนที่ 1 ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)
            </CardTitle>
            {expandedSections.section1 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {expandedSections.section1 && (
          <CardContent className="p-6 space-y-8">
            {/* ตัวอย่างเนื้อหาส่วนที่ 1 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                1.1 ผลลัพธ์ภายหลังจากการเข้าร่วมอบรม
              </h3>
              
              {renderCheckboxes(
                data.section1?.section1_knowledge_outcomes,
                [],
                "ด้านองค์ความรู้"
              )}
              
              {renderCheckboxes(
                data.section1?.section1_application_outcomes,
                [],
                "ด้านการประยุกต์ใช้องค์ความรู้",
                data.section1?.section1_application_other
              )}
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                1.2 อธิบายการเปลี่ยนแปลง
              </h3>
              {renderTextField(
                data.section1?.section1_changes_description,
                "คำอธิบายการเปลี่ยนแปลง"
              )}
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold mb-4 text-purple-700">
                1.4 การใช้องค์ความรู้
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRatingScale(
                  data.section1?.section1_knowledge_before,
                  "ระดับความรู้ก่อนเข้าร่วมอบรม"
                )}
                {renderRatingScale(
                  data.section1?.section1_knowledge_after,
                  "ระดับความรู้หลังเข้าร่วมอบรม"
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* สรุปข้อมูล */}
      <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800">สรุปข้อมูลแบบสอบถาม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">ส่วนทั้งหมด</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">ความสมบูรณ์</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{data.respondent?.survey_date}</div>
              <div className="text-sm text-gray-600">วันที่ส่งข้อมูล</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteSurveyViewer;
