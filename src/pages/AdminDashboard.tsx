import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Users, FileText, BarChart3, X, Download } from 'lucide-react';
import CompleteSurveyViewer from '@/components/admin/CompleteSurveyViewer';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [responses, setResponses] = useState<any[]>([]); // กำหนด type เป็น any[]
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null); // กำหนด type
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<any | null>(null); // กำหนด type
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();
      
      if (!adminUser) {
        navigate('/admin-login');
        return;
      }

      setAdminData(adminUser);
      await loadResponses();
    };
    
    checkAuth();
  }, [navigate]);

  const loadResponses = async () => {
    try {
      // Query ข้อมูลแบบ relational ตามที่ Viewer ต้องการ
      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_users(full_name, position, organization, phone, province, email),
          survey_responses_section2(*),
          survey_responses_section3(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // แก้ไข: ทำให้ง่ายขึ้น ส่งข้อมูลดิบไปเลย
  const handleViewResponse = (response: any) => {
    setSelectedResponse(response);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedResponse(null);
    document.body.style.overflow = 'unset';
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบคำตอบนี้?')) return;

    try {
      const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', responseId);

      if (error) throw error;

      toast({
        title: "ลบสำเร็จ",
        description: "ลบคำตอบแล้ว",
      });

      await loadResponses();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  // ตรวจสอบสถานะการตอบแบบละเอียด
  const getDetailedCompletionStatus = (response: any) => {
    const status = {
      section1: {
        completed: false,
        missingFields: [] as string[],
        completedFields: [] as string[]
      },
      section2: {
        completed: false,
        missingFields: [] as string[],
        completedFields: [] as string[]
      },
      section3: {
        completed: false,
        missingFields: [] as string[],
        completedFields: [] as string[]
      }
    };

    // ข้อคำถามทั้งหมดในแต่ละส่วน
    const allSection1Fields = [
      '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10',
      '1.11', '1.12', '1.13', '1.14', '1.15', '1.16', '1.17', '1.18', '1.19', '1.20'
    ];

    const allSection2Fields = [
      '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9'
    ];

    const allSection3Fields = [
      '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10',
      '3.11', '3.12', '3.13', '3.14', '3.15', '3.16'
    ];

    // แมปฟิลด์ฐานข้อมูลกับเลขข้อ
    const fieldToQuestionMap: { [key: string]: string } = {
      // Section 1
      'section1_knowledge_outcomes': '1.1',
      'section1_application_outcomes': '1.2', 
      'section1_knowledge_before': '1.3',
      'section1_knowledge_after': '1.4',
      'section1_overall_change_level': '1.5',
      'section1_success_factors': '1.6',
      'section1_problems_before': '1.7',
      'section1_knowledge_solutions': '1.8',
      'section1_changes_description': '1.9',
      'section1_success_description': '1.10',
      'section1_it_level': '1.11',
      'section1_cooperation_level': '1.12',
      'section1_funding_level': '1.13',
      'section1_culture_level': '1.14',
      'section1_green_level': '1.15',
      'section1_new_dev_level': '1.16',
      'section1_it_usage': '1.17',
      'section1_cooperation_usage': '1.18',
      'section1_funding_usage': '1.19',
      'section1_culture_usage': '1.20',
      
      // Section 2
      'section2_partner_organizations': '2.1',
      'section2_data_types': '2.2',
      'section2_data_level': '2.3',
      'section2_data_sources': '2.4',
      'section2_partner_participation': '2.5',
      'section2_network_expansion': '2.6',
      'section2_applications': '2.7',
      'section2_continued_development': '2.8',
      'section2_data_benefits': '2.9',
      
      // Section 3
      'leadership_importance': '3.1',
      'staff_importance': '3.2',
      'communication_to_users': '3.3',
      'reaching_target_groups': '3.4',
      'budget_system_development': '3.5',
      'budget_knowledge_development': '3.6',
      'cooperation_between_agencies': '3.7',
      'innovation_ecosystem': '3.8',
      'government_digital_support': '3.9',
      'digital_infrastructure': '3.10',
      'digital_mindset': '3.11',
      'learning_organization': '3.12',
      'it_skills': '3.13',
      'internal_communication': '3.14',
      'policy_continuity': '3.15',
      'policy_stability': '3.16'
    };

    // ตรวจสอบ Section 1
    const section1Fields = Object.keys(fieldToQuestionMap).filter(field => field.startsWith('section1_'));
    section1Fields.forEach(field => {
      const questionNum = fieldToQuestionMap[field];
      if (!response[field] || (Array.isArray(response[field]) && response[field].length === 0)) {
        status.section1.missingFields.push(questionNum);
      } else {
        status.section1.completedFields.push(questionNum);
      }
    });

    // ตรวจสอบ Section 2
    if (response.survey_responses_section2 && response.survey_responses_section2.length > 0) {
      const section2Data = response.survey_responses_section2[0];
      const section2Fields = Object.keys(fieldToQuestionMap).filter(field => field.startsWith('section2_'));
      
      section2Fields.forEach(field => {
        const questionNum = fieldToQuestionMap[field];
        if (!section2Data[field] || (Array.isArray(section2Data[field]) && section2Data[field].length === 0)) {
          status.section2.missingFields.push(questionNum);
        } else {
          status.section2.completedFields.push(questionNum);
        }
      });
    } else {
      status.section2.missingFields = [...allSection2Fields];
    }

    // ตรวจสอบ Section 3
    if (response.survey_responses_section3 && response.survey_responses_section3.length > 0) {
      const section3Data = response.survey_responses_section3[0];
      const section3Fields = Object.keys(fieldToQuestionMap).filter(field => !field.startsWith('section1_') && !field.startsWith('section2_'));
      
      section3Fields.forEach(field => {
        const questionNum = fieldToQuestionMap[field];
        if (!section3Data[field]) {
          status.section3.missingFields.push(questionNum);
        } else {
          status.section3.completedFields.push(questionNum);
        }
      });
    } else {
      status.section3.missingFields = [...allSection3Fields];
    }

    // กำหนดสถานะความสมบูรณ์
    status.section1.completed = status.section1.missingFields.length === 0;
    status.section2.completed = status.section2.missingFields.length === 0;
    status.section3.completed = status.section3.missingFields.length === 0;

    return status;
  };

  const getCompletionStatus = (response: any) => {
    const detailedStatus = getDetailedCompletionStatus(response);
    const completedSections = [
      detailedStatus.section1.completed,
      detailedStatus.section2.completed,
      detailedStatus.section3.completed
    ].filter(Boolean).length;

    if (completedSections === 3) return 'สมบูรณ์';
    if (completedSections === 2) return 'ส่วนที่ 1-2';
    if (completedSections === 1) return 'ส่วนที่ 1';
    return 'ไม่สมบูรณ์';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'สมบูรณ์': return 'bg-green-100 text-green-800';
      case 'ส่วนที่ 1-2': return 'bg-yellow-100 text-yellow-800';
      case 'ส่วนที่ 1': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getMissingFieldsDescription = (response: any) => {
    const detailedStatus = getDetailedCompletionStatus(response);
    const descriptions = [];

    // ฟังก์ชันสำหรับแสดงรายละเอียดแต่ละส่วน
    const getSectionDescription = (sectionNum: number, missingFields: string[], completedFields: string[], allFields: string[]) => {
      if (missingFields.length === 0) {
        return `ส่วนที่ ${sectionNum}: ครบถ้วนทุกข้อ`;
      } else if (missingFields.length === allFields.length) {
        return `ส่วนที่ ${sectionNum}: ไม่ได้ตอบเลย`;
      } else if (missingFields.length > allFields.length / 2) {
        // ถ้าขาดมากกว่าครึ่ง แสดงข้อที่ตอบแล้ว (ขาดเว้นข้อ...)
        return `ส่วนที่ ${sectionNum}: ขาดเกือบหมด (ตอบแล้วเพียงข้อ ${completedFields.sort().join(', ')})`;
      } else {
        // ถ้าขาดน้อยกว่าครึ่ง แสดงข้อที่ขาด
        return `ส่วนที่ ${sectionNum}: ขาดข้อ ${missingFields.sort().join(', ')}`;
      }
    };

    // แสดงรายละเอียดแต่ละส่วน
    const allSection1Fields = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '1.11', '1.12', '1.13', '1.14', '1.15', '1.16', '1.17', '1.18', '1.19', '1.20'];
    const allSection2Fields = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9'];
    const allSection3Fields = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16'];

    descriptions.push(getSectionDescription(1, detailedStatus.section1.missingFields, detailedStatus.section1.completedFields, allSection1Fields));
    descriptions.push(getSectionDescription(2, detailedStatus.section2.missingFields, detailedStatus.section2.completedFields, allSection2Fields));
    descriptions.push(getSectionDescription(3, detailedStatus.section3.missingFields, detailedStatus.section3.completedFields, allSection3Fields));

    return descriptions.join(' | ');
  };

  // Export to Excel function
  const exportToExcel = () => {
    // ข้อมูลตัวเลือกจากแบบสอบถาม
    const surveyOptions = {
      knowledgeOutcomes: ["มีความรู้ความเข้าใจในระบบเศรษฐกิจใหม่และการเปลี่ยนแปลงของโลก", "มีความเข้าใจและสามารถวิเคราะห์ศักยภาพและแสวงหาโอกาสในการพัฒนาเมือง", "มีความเข้าใจและกำหนดข้อมูลที่จำเป็นต้องใช้ในการพัฒนาเมือง/ท้องถิ่น", "วิเคราะห์และประสานภาคีเครือข่ายการพัฒนาเมือง", "รู้จักเครือข่ายมากขึ้น"],
      applicationOutcomes: ["นำแนวทางการพัฒนาเมืองตามตัวบทปฏิบัติการด้านต่าง ๆ มาใช้ในการพัฒนาเมือง", "สามารถพัฒนาฐานข้อมูลเมืองของตนได้", "สามารถพัฒนาข้อเสนอโครงงานพัฒนาเมืองและนำไปสู่การนำเสนอไอเดีย (Pitching) ขอทุนได้", "ประสานความร่วมมือกับภาคส่วนต่าง ๆ ในการพัฒนาเมือง"],
      problemsBefore: ["มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่", "วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น", "การบริหารจัดการองค์กร", "ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน", "ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น", "ไม่ใช้ข้อมูลเป็นฐานในการวางแผน", "บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด", "ขาดเครือข่ายในการพัฒนาเมือง", "ขาดความรู้ทักษะในการพัฒนาเมือง", "ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง"],
      knowledgeSolutions: ["การจัดทำข้อมูลเพื่อใช้ในการพัฒนาเมือง/ท้องถิ่น", "การประสานความร่วมมือกับภาคีเครือข่ายวิชาการและ อปท.", "การระบุปัญหาและความจำเป็นเร่งด่วนในพื้นที่ได้อย่างชัดเจน", "กำหนดหรือสร้างแนวคิดนวัตกรรมท้องถิ่นที่สอดคล้องกับปัญหา/ตรงกับความต้องการ", "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น", "การนำเทคโนโลยีดิจิทัลมาใช้ในการพัฒนาบริการสาธารณะ (E-Service)", "การกล้าลงมือทำโดยไม่กลัวความผิดพลาด", "การนำนวัตกรรมท้องถิ่นไปปฏิบัติจริง (การขับเคลื่อนนวัตกรรมท้องถิ่นไปยังกลุ่มเป้าหมาย การสร้างความรู้ความเข้าใจในพื้นที่ การติดตามและประเมินผล)"],
      successFactors: ["ปัจจัย 1", "ปัจจัย 2", "ปัจจัย 3", "ปัจจัยอื่นๆ"],
      itUsage: ["ใช้การวิเคราะห์ปัญหาได้ตรงเป้า ตรงจุด", "ใช้ในการวางแผนพัฒนาท้องถิ่นได้อย่างมีทิศทาง", "ใช้ในการตัดสินใจในการพัฒนาท้องถิ่น", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการเพิ่มความเสมอภาคในการบริการ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาบริการสาธารณะในลักษณะ E-Service"],
      cooperationUsage: ["ใช้ในการสร้างความร่วมมือระหว่างท้องถิ่นกับรัฐ เอกชน และองค์กรพัฒนาเอกชน", "ใช้ในการเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ใช้ในการกำกับ ติดตาม และวางแผนการดำเนินโครงการต่างๆ", "ช่วยในการให้บริการประชาชนได้อย่างไม่มีข้อจำกัดด้านเวลา และสถานที่", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน", "ช่วยพัฒนาโครงการได้ดีขึ้น ขึ้น เช่น การทำโครงการร่วมรัฐ-เอกชน (PPP) หรือคลัสเตอร์อุตสาหกรรมท้องถิ่น", "ช่วยลดความซ้ำซ้อนและเพิ่มประสิทธิภาพในการพัฒนาอย่างยั่งยืน"],
      fundingUsage: ["ใช้ในการหาแหล่งทุนมาจากทั้งรัฐ เอกชน หุ้นชุมชน พันธบัตร หรือช่องทางออนไลน์อย่าง Crowdfunding", "ช่วยเพิ่มทรัพยากรและความสามารถในการบริหารจัดการ แลกเปลี่ยนประสบการณ์ แก้ปัญหา", "ช่วยให้โครงการไม่สะดุดจากปัญหาเงินทุน และดึงดูดการลงทุนจากภาคเอกชน", "ช่วยผลักดันการพัฒนาได้ต่อเนื่องและยั่งยืน", "ช่วยในการสร้างความเชื่อมั่นให้กับประชาชน"],
      cultureUsage: ["ใช้ในการอนุรักษ์วัฒนธรรมและการใช้สินทรัพย์ท้องถิ่น เช่น สินค้าพื้นเมือง งานหัตถกรรม ประเพณี และทรัพยากรธรรมชาติอย่างยั่งยืน", "ใช้ในการสร้างเอกลักษณ์ ดึงดูดนักท่องเที่ยวและการลงทุน เพิ่มมูลค่าเศรษฐกิจ", "ใช้ในการจัดทำหลักสูตรท้องถิ่น", "ใช้ในการส่งเสริมความมั่นคงทางสังคมและเศรษฐกิจของชุมชนได้ในระยะยาว"],
      greenUsage: ["ใช้เป็นกลไกที่เน้นใช้ทรัพยากรอย่างคุ้มค่า ลดของเสีย และรักษาสิ่งแวดล้อม", "ช่วยสนับสนุนเกษตรอินทรีย์ จัดการขยะและน้ำเสียอย่างมีระบบ", "ใช้พลังงานทดแทน ลดการพึ่งพาทรัพยากรธรรมชาติที่ใช้แล้วหมด", "ช่วยสร้างงานและเศรษฐกิจที่ไม่ทำลายสิ่งแวดล้อม"],
      newDevUsage: ["ใช้เป็นกลไกที่เน้นนวัตกรรม การวิจัย และการพัฒนาทักษะ", "ช่วยรองรับการเปลี่ยนแปลงระยะยาว เช่น การตั้งศูนย์นวัตกรรมท้องถิ่น", "ช่วยสร้างความร่วมมือกับมหาวิทยาลัย หรือการสนับสนุนผู้ประกอบการใหม่", "ช่วยสร้างสินค้า-บริการใหม่ เสริมเศรษฐกิจท้องถิ่น และยกระดับคุณภาพชีวิต ตัวอย่างเช่น บริษัทพัฒนาเมืองหรือ วิสาหกิจเพื่อสังคม", "ช่วยรวมพลังภาคเอกชนและชุมชนพัฒนาเมืองอย่างยั่งยืน"],
      dataTypes: ['ชุดข้อมูลด้านประชากร', 'ชุดข้อมูลด้านโครงสร้างพื้นฐาน', 'ชุดข้อมูลด้านสิ่งแวดล้อม เช่น ขยะ น้ำเสีย PM 2.5 เป็นต้น', 'ชุดข้อมูลด้านการจัดการภัยพิบัติ', 'ชุดข้อมูลด้านสุขภาพ', 'ชุดข้อมูลด้านการจราจร', 'ชุดข้อมูลด้านการจัดการสินทรัพย์ท้องถิ่น'],
      partnerOrgs: ['มูลนิธิส่งเสริมการปกครองท้องถิ่น', 'นักวิชาการจากสถาบันการศึกษา', 'ผู้เชี่ยวชาญจากภายนอก', 'ภาคีเครือข่ายในพื้นที่', 'ภาคเอกชน'],
      dataBenefits: ['ลดต้นทุนการบริหารจัดการ/ต้นทุนเวลา', 'ลดระยะเวลาในการดำเนินงาน', 'การบริหารจัดการเมืองมีประสิทธิภาพเพิ่มขึ้น', 'ทำให้สามารถเชื่อมโยงข้อมูลของหน่วยงานภายในได้', 'ลดเอกสาร', 'ทำให้การวางแผนเมืองตรงเป้า ตรงจุดมากขึ้น']
    };

    // ฟังก์ชันแปลงข้อมูลเป็นข้อความที่อ่านได้
    const formatArrayToReadableText = (value: any, optionsArray: string[]) => {
      if (!Array.isArray(value)) return value || '';
      return value.map(item => {
        if (item === 'อื่น ๆ') return item;
        const foundOption = optionsArray.find(opt => opt === item);
        return foundOption || item;
      }).join(' | ');
    };

    const formatJsonValue = (value: any) => {
      if (typeof value === 'object' && value !== null) {
        const formatted = [];
        for (const [key, val] of Object.entries(value)) {
          if (val) formatted.push(`${key}: ${val}`);
        }
        return formatted.join(' | ');
      }
      return value || '';
    };

    const exportData = responses.map((response) => {
      const user = response.survey_users;
      const section2 = response.survey_responses_section2?.[0] || {};
      const section3 = response.survey_responses_section3?.[0] || {};

      return {
        // ข้อมูลผู้ตอบแบบสอบถาม
        'รหัสผู้ตอบ': response.id,
        'ชื่อ-สกุล': user?.full_name || '',
        'ตำแหน่ง': user?.position || '',
        'หน่วยงาน': user?.organization || '',
        'เบอร์โทรศัพท์': user?.phone || '',
        'จังหวัด': user?.province || '',
        'อีเมล': user?.email || '',
        'วันที่ตอบแบบสอบถาม': new Date(response.created_at).toLocaleDateString('th-TH'),
        'เวลาที่ตอบ': new Date(response.created_at).toLocaleTimeString('th-TH'),
        'สถานะความสมบูรณ์': getCompletionStatus(response),
        
        // ส่วนที่ 1 - ผลลัพธ์ภายหลังจากการเข้าร่วมอบรมฯ
        '1.1 คำถาม': 'ผลลัพธ์ที่ท่านได้รับภายหลังจากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) - ด้านการเพิ่มความรู้',
        '1.1 คำตอบ': formatArrayToReadableText(response.section1_knowledge_outcomes, surveyOptions.knowledgeOutcomes),
        
        '1.2 คำถาม': 'ผลลัพธ์ที่ท่านได้รับภายหลังจากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.) - ด้านการประยุกต์ใช้องค์ความรู้',
        '1.2 คำตอบ': formatArrayToReadableText(response.section1_application_outcomes, surveyOptions.applicationOutcomes),
        '1.2 อื่นๆ': response.section1_application_other || '',
        
        '1.3 คำถาม': 'ระดับความรู้ก่อนเข้าร่วมหลักสูตร (1-10)',
        '1.3 คำตอบ': response.section1_knowledge_before || '',
        
        '1.4 คำถาม': 'ระดับความรู้หลังเข้าร่วมหลักสูตร (1-10)',
        '1.4 คำตอบ': response.section1_knowledge_after || '',
        
        '1.5 คำถาม': 'ระดับการเปลี่ยนแปลงโดยรวมในหน่วยงานของท่าน (1-10)',
        '1.5 คำตอบ': response.section1_overall_change_level || '',
        
        '1.6 คำถาม': 'อธิบายรายละเอียดการเปลี่ยนแปลงที่เกิดขึ้นในหน่วยงานของท่าน',
        '1.6 คำตอบ': response.section1_changes_description || '',
        
        '1.7 คำถาม': 'ปัญหาของหน่วยงานก่อนเข้าร่วมการอบรม',
        '1.7 คำตอบ': formatArrayToReadableText(response.section1_problems_before, surveyOptions.problemsBefore),
        '1.7 อื่นๆ': response.section1_problems_other || '',
        
        '1.8 คำถาม': 'การใช้องค์ความรู้จากการอบรมมาแก้ไขปัญหาดังกล่าว',
        '1.8 คำตอบ': formatArrayToReadableText(response.section1_knowledge_solutions, surveyOptions.knowledgeSolutions),
        '1.8 อื่นๆ': response.section1_knowledge_solutions_other || '',
        
        '1.9 คำถาม': 'ปัจจัยความสำเร็จที่ทำให้เกิดการเปลี่ยนแปลงในหน่วยงาน',
        '1.9 คำตอบ': formatArrayToReadableText(response.section1_success_factors, surveyOptions.successFactors),
        '1.9 อื่นๆ': response.section1_success_factors_other || '',
        
        '1.10 คำถาม': 'อธิบายรายละเอียดปัจจัยความสำเร็จ',
        '1.10 คำตอบ': response.section1_success_description || '',
        
        // กลไกด้านต่างๆ - ระดับความสำคัญและการใช้งาน
        '1.11 คำถาม': 'กลไกข้อมูลสารสนเทศ - ระดับความสำคัญ (1-10)',
        '1.11 คำตอบ': response.section1_it_level || '',
        '1.12 คำถาม': 'การใช้กลไกข้อมูลสารสนเทศ',
        '1.12 คำตอบ': formatArrayToReadableText(response.section1_it_usage, surveyOptions.itUsage),
        '1.12 อื่นๆ': response.section1_it_usage_other || '',
        
        '1.13 คำถาม': 'กลไกประสานความร่วมมือ - ระดับความสำคัญ (1-10)',
        '1.13 คำตอบ': response.section1_cooperation_level || '',
        '1.14 คำถาม': 'การใช้กลไกประสานความร่วมมือ',
        '1.14 คำตอบ': formatArrayToReadableText(response.section1_cooperation_usage, surveyOptions.cooperationUsage),
        '1.14 อื่นๆ': response.section1_cooperation_usage_other || '',
        
        '1.15 คำถาม': 'กลไกการระดมทุน - ระดับความสำคัญ (1-10)',
        '1.15 คำตอบ': response.section1_funding_level || '',
        '1.16 คำถาม': 'การใช้กลไกการระดมทุน',
        '1.16 คำตอบ': formatArrayToReadableText(response.section1_funding_usage, surveyOptions.fundingUsage),
        '1.16 อื่นๆ': response.section1_funding_usage_other || '',
        
        '1.17 คำถาม': 'กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น - ระดับความสำคัญ (1-10)',
        '1.17 คำตอบ': response.section1_culture_level || '',
        '1.18 คำถาม': 'การใช้กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น',
        '1.18 คำตอบ': formatArrayToReadableText(response.section1_culture_usage, surveyOptions.cultureUsage),
        '1.18 อื่นๆ': response.section1_culture_usage_other || '',
        
        '1.19 คำถาม': 'กลไกเศรษฐกิจสีเขียว - ระดับความสำคัญ (1-10)',
        '1.19 คำตอบ': response.section1_green_level || '',
        '1.20 คำถาม': 'การใช้กลไกเศรษฐกิจสีเขียว',
        '1.20 คำตอบ': formatArrayToReadableText(response.section1_green_usage, surveyOptions.greenUsage),
        '1.20 อื่นๆ': response.section1_green_usage_other || '',
        
        '1.21 คำถาม': 'กลไกการพัฒนาใหม่ - ระดับความสำคัญ (1-10)',
        '1.21 คำตอบ': response.section1_new_dev_level || '',
        '1.22 คำถาม': 'การใช้กลไกการพัฒนาใหม่',
        '1.22 คำตอบ': formatArrayToReadableText(response.section1_new_dev_usage, surveyOptions.newDevUsage),
        '1.22 อื่นๆ': response.section1_new_dev_usage_other || '',
        
        // ส่วนที่ 2 - การพัฒนาข้อมูลเมือง
        '2.1 คำถาม': 'ชุดข้อมูลที่ใช้ในการพัฒนาเมือง',
        '2.1 คำตอบ': formatArrayToReadableText(section2.section2_data_types, surveyOptions.dataTypes),
        '2.1 อื่นๆ': section2.section2_data_types_other || '',
        
        '2.2 คำถาม': 'แหล่งที่มาของชุดข้อมูล',
        '2.2 คำตอบ': section2.section2_data_sources || '',
        
        '2.3 คำถาม': 'หน่วยงานที่เข้าร่วมจัดทำข้อมูล',
        '2.3 คำตอบ': formatArrayToReadableText(section2.section2_partner_organizations, surveyOptions.partnerOrgs),
        '2.3 อื่นๆ': section2.section2_partner_organizations_other || '',
        
        '2.4 คำถาม': 'รูปแบบการเข้าร่วมของหน่วยงาน',
        '2.4 คำตอบ': section2.section2_partner_participation || '',
        
        '2.5 คำถาม': 'ประโยชน์ของชุดข้อมูลเมือง',
        '2.5 คำตอบ': formatArrayToReadableText(section2.section2_data_benefits, surveyOptions.dataBenefits),
        
        '2.6 คำถาม': 'ระดับการตอบโจทย์ของข้อมูล (1-10)',
        '2.6 คำตอบ': section2.section2_data_level || '',
        
        '2.7 คำถาม': 'การพัฒนาข้อมูลอย่างต่อเนื่อง',
        '2.7 คำตอบ': section2.section2_continued_development || '',
        
        '2.8 คำถาม': 'แอปพลิเคชันที่ใช้',
        '2.8 คำตอบ': formatJsonValue(section2.section2_applications),
        
        '2.9 คำถาม': 'การขยายเครือข่าย',
        '2.9 คำตอบ': formatJsonValue(section2.section2_network_expansion),
        
        // ส่วนที่ 3 - ปัจจัยการขับเคลื่อน
        '3.1 คำถาม': 'งบประมาณจัดสรรในการพัฒนาระบบ (1-5)',
        '3.1 คำตอบ': section3.budget_system_development || '',
        
        '3.2 คำถาม': 'งบประมาณจัดสรรในการพัฒนาองค์ความรู้ (1-5)',
        '3.2 คำตอบ': section3.budget_knowledge_development || '',
        
        '3.3 คำถาม': 'การสร้างความร่วมมือระหว่างหน่วยงาน/ภาคีเครือข่าย (1-5)',
        '3.3 คำตอบ': section3.cooperation_between_agencies || '',
        
        '3.4 คำถาม': 'การสร้างระบบนิเวศที่เชื่อมต่อการพัฒนานวัตกรรม (1-5)',
        '3.4 คำตอบ': section3.innovation_ecosystem || '',
        
        '3.5 คำถาม': 'การสนับสนุนระบบดิจิทัลพื้นฐานจากภาครัฐ (1-5)',
        '3.5 คำตอบ': section3.government_digital_support || '',
        
        '3.6 คำถาม': 'ความพร้อมด้านโครงสร้างทางกายภาพทางเทคโนโลยี (1-5)',
        '3.6 คำตอบ': section3.digital_infrastructure || '',
        
        '3.7 คำถาม': 'บุคลากรภายในหน่วยงานมีชุดความคิดแบบดิจิทัล (1-5)',
        '3.7 คำตอบ': section3.digital_mindset || '',
        
        '3.8 คำถาม': 'เป็นองค์กรแห่งการเรียนรู้ที่มีความพร้อมในการพัฒนานวัตกรรม (1-5)',
        '3.8 คำตอบ': section3.learning_organization || '',
        
        '3.9 คำถาม': 'เจ้าหน้าที่มีความรู้ทักษะด้าน IT ที่เพียงพอ (1-5)',
        '3.9 คำตอบ': section3.it_skills || '',
        
        '3.10 คำถาม': 'ประสิทธิภาพในการสื่อสารภายในองค์กร (1-5)',
        '3.10 คำตอบ': section3.internal_communication || '',
        
        '3.11 คำถาม': 'ความต่อเนื่องของนโยบายในการพัฒนาโครงการนวัตกรรมท้องถิ่น (1-5)',
        '3.11 คำตอบ': section3.policy_continuity || '',
        
        '3.12 คำถาม': 'ความมีเสถียรภาพของนโยบายในการขับเคลื่อนองค์กรด้วยเทคโนโลยี (1-5)',
        '3.12 คำตอบ': section3.policy_stability || '',
        
        '3.13 คำถาม': 'ผู้นำให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น (1-5)',
        '3.13 คำตอบ': section3.leadership_importance || '',
        
        '3.14 คำถาม': 'เจ้าหน้าที่ปฏิบัติงานให้ความสำคัญกับการพัฒนานวัตกรรมท้องถิ่น (1-5)',
        '3.14 คำตอบ': section3.staff_importance || '',
        
        '3.15 คำถาม': 'มีการสื่อสารข้อมูลนวัตกรรมท้องถิ่นไปยังผู้ใช้บริการได้อย่างเพียงพอ (1-5)',
        '3.15 คำตอบ': section3.communication_to_users || '',
        
        '3.16 คำถาม': 'การสื่อสารข้อมูลนวัตกรรมท้องถิ่นสามารถเข้าถึงกลุ่มเป้าหมาย (1-5)',
        '3.16 คำตอบ': section3.reaching_target_groups || ''
      };
    });

    // สร้าง workbook และ worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // ปรับขนาดคอลัมน์
    ws['!cols'] = [
      { width: 20 }, // ชื่อ-สกุล
      { width: 25 }, // ตำแหน่ง
      { width: 30 }, // หน่วยงาน
      { width: 15 }, // เบอร์โทร
      { width: 15 }, // จังหวัด
      { width: 25 }, // อีเมล
      { width: 15 }, // วันที่ตอบ
      { width: 15 }, // สถานะ
      ...Array(70).fill({ width: 20 }) // คอลัมน์คำถามอื่นๆ
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'คำตอบแบบสอบถาม SROI');

    // ส่งออกไฟล์
    const fileName = `คำตอบแบบสอบถาม_SROI_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "ส่งออกสำเร็จ",
      description: `ส่งออกข้อมูล ${responses.length} รายการเป็น Excel แล้ว`,
    });
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseViewer();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ระบบจัดการแบบสอบถาม SROI</h1>
            <p className="text-muted-foreground">สวัสดี คุณ{adminData?.full_name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </div>

        {/* Export Button */}
        <div className="mb-6">
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            ส่งออก Excel
          </Button>
        </div>

        {/* --- Cards for Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ตอบทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{responses.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ตอบสมบูรณ์</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{responses.filter(r => getCompletionStatus(r) === 'สมบูรณ์').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ตอบไม่สมบูรณ์</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{responses.filter(r => getCompletionStatus(r) !== 'สมบูรณ์').length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">วันนี้</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{responses.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length}</div></CardContent>
          </Card>
        </div>

        {/* --- Responses Table --- */}
        <Card>
          <CardHeader><CardTitle>รายการคำตอบแบบสอบถาม</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ-สกุล</TableHead>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>หน่วยงาน</TableHead>
                  <TableHead>เบอร์โทร</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>รายละเอียดที่ขาด</TableHead>
                  <TableHead>วันที่ตอบ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">{response.survey_users?.full_name}</TableCell>
                    <TableCell>{response.survey_users?.position}</TableCell>
                    <TableCell>{response.survey_users?.organization}</TableCell>
                    <TableCell>{response.survey_users?.phone}</TableCell>
                    <TableCell><Badge className={getStatusColor(getCompletionStatus(response))}>{getCompletionStatus(response)}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[400px]">
                      <div className="whitespace-normal leading-relaxed text-wrap" title={getMissingFieldsDescription(response)}>
                        {getMissingFieldsDescription(response)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(response.created_at).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewResponse(response)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteResponse(response.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* --- Custom Survey Viewer Modal --- */}
        {isViewerOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseViewer(); }}
          >
            <div className="bg-white rounded-lg w-[98vw] h-[98vh] flex flex-col max-w-none shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    📋 แบบสอบถาม - {selectedResponse?.survey_users?.full_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {selectedResponse?.survey_users?.organization} • วันที่ตอบ: {selectedResponse && new Date(selectedResponse.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-xs text-gray-500">กด ESC เพื่อปิด</span>
                  <button onClick={handleCloseViewer} className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0" title="ปิด (ESC)">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {selectedResponse && (
                  <CompleteSurveyViewer data={selectedResponse} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
