import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Users, FileText, BarChart3, X } from 'lucide-react';
import CompleteSurveyViewer from '@/components/admin/CompleteSurveyViewer';

const AdminDashboard = () => {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
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

  // แปลงข้อมูลจาก database เป็นรูปแบบที่ CompleteSurveyViewer ต้องการ - ปรับปรุงใหม่
  const transformResponseData = (response) => {
    if (!response) {
      console.log('❌ No response data');
      return null;
    }

    console.log('📊 Section 1 fields:', {
      section1_knowledge_outcomes: response.section1_knowledge_outcomes,
      section1_application_outcomes: response.section1_application_outcomes,
      section1_changes_description: response.section1_changes_description,
    });

    // ข้อมูล Section 2 และ 3
    const section2Data = response.survey_responses_section2?.[0] || {};
    const section3Data = response.survey_responses_section3?.[0] || {};

    console.log('📊 Section 2 data:', section2Data);
    console.log('📊 Section 3 data:', section3Data);

    const result = {
      respondent: {
        name: response.survey_users?.full_name || 'ไม่ระบุ',
        position: response.survey_users?.position || 'ไม่ระบุ',
        organization: response.survey_users?.organization || 'ไม่ระบุ',
        province: response.survey_users?.province || 'ไม่ระบุ',
        email: response.survey_users?.email || 'ไม่ระบุ',
        phone: response.survey_users?.phone || 'ไม่ระบุ',
        survey_date: new Date(response.created_at).toLocaleDateString('th-TH')
      },
      
      // ส่วนที่ 1 - ข้อมูลจาก survey_responses table (ใช้ข้อมูลจริง)
      section1: {
        section1_knowledge_outcomes: response.section1_knowledge_outcomes || [],
        section1_application_outcomes: response.section1_application_outcomes || [],
        section1_application_other: response.section1_application_other || '',
        section1_changes_description: response.section1_changes_description || '',
        section1_problems_before: response.section1_problems_before || [],
        section1_knowledge_solutions: response.section1_knowledge_solutions || [],
        section1_knowledge_solutions_other: response.section1_knowledge_solutions_other || '',
        section1_knowledge_before: response.section1_knowledge_before || null,
        section1_knowledge_after: response.section1_knowledge_after || null,
        section1_it_usage: response.section1_it_usage || [],
        section1_it_usage_other: response.section1_it_usage_other || '',
        section1_it_level: response.section1_it_level || null,
        section1_cooperation_usage: response.section1_cooperation_usage || [],
        section1_cooperation_usage_other: response.section1_cooperation_usage_other || '',
        section1_cooperation_level: response.section1_cooperation_level || null,
        section1_funding_usage: response.section1_funding_usage || [],
        section1_funding_usage_other: response.section1_funding_usage_other || '',
        section1_funding_level: response.section1_funding_level || null,
        section1_culture_usage: response.section1_culture_usage || [],
        section1_culture_usage_other: response.section1_culture_usage_other || '',
        section1_culture_level: response.section1_culture_level || null,
        section1_green_usage: response.section1_green_usage || [],
        section1_green_usage_other: response.section1_green_usage_other || '',
        section1_green_level: response.section1_green_level || null,
        section1_new_dev_usage: response.section1_new_dev_usage || [],
        section1_new_dev_usage_other: response.section1_new_dev_usage_other || '',
        section1_new_dev_level: response.section1_new_dev_level || null,
        section1_success_factors: response.section1_success_factors || [],
        section1_success_factors_other: response.section1_success_factors_other || '',
        section1_success_description: response.section1_success_description || '',
        section1_overall_change_level: response.section1_overall_change_level || null
      },
      
      // ส่วนที่ 2 - ข้อมูลจาก survey_responses_section2 table (ใช้ข้อมูลจริง)
      section2: {
        section2_data_types: section2Data.section2_data_types || [],
        section2_data_types_other: section2Data.section2_data_types_other || '',
        section2_data_sources: section2Data.section2_data_sources || '',
        section2_partner_organizations: section2Data.section2_partner_organizations || [],
        section2_partner_organizations_other: section2Data.section2_partner_organizations_other || '',
        section2_partner_participation: section2Data.section2_partner_participation || '',
        section2_data_benefits: section2Data.section2_data_benefits || [],
        section2_data_level: section2Data.section2_data_level || null,
        section2_continued_development: section2Data.section2_continued_development || '',
        section2_applications: section2Data.section2_applications || {},
        section2_network_expansion: section2Data.section2_network_expansion || {}
      },
      
      // ส่วนที่ 3 - ข้อมูลจาก survey_responses_section3 table (ใช้ข้อมูลจริง)
      section3: {
        budget_system_development: section3Data.budget_system_development || null,
        budget_knowledge_development: section3Data.budget_knowledge_development || null,
        cooperation_between_agencies: section3Data.cooperation_between_agencies || null,
        innovation_ecosystem: section3Data.innovation_ecosystem || null,
        government_digital_support: section3Data.government_digital_support || null,
        digital_infrastructure: section3Data.digital_infrastructure || null,
        digital_mindset: section3Data.digital_mindset || null,
        learning_organization: section3Data.learning_organization || null,
        it_skills: section3Data.it_skills || null,
        internal_communication: section3Data.internal_communication || null,
        policy_continuity: section3Data.policy_continuity || null,
        policy_stability: section3Data.policy_stability || null,
        leadership_importance: section3Data.leadership_importance || null,
        staff_importance: section3Data.staff_importance || null,
        communication_to_users: section3Data.communication_to_users || null,
        reaching_target_groups: section3Data.reaching_target_groups || null
      }
    };

    console.log('🎯 Final transformed result:', result);
    return result;
  };

  // เพิ่มข้อมูลตัวอย่างสำหรับกรณีที่ข้อมูลไม่ครบ
  const addSampleDataIfEmpty = (transformedData) => {
    if (!transformedData) return null;

    // สร้างสำเนาของข้อมูลเพื่อไม่ให้แก้ไขข้อมูลต้นฉบับ
    const result = JSON.parse(JSON.stringify(transformedData));

    // ถ้าไม่มีข้อมูล Section 1 ให้ใส่ข้อมูลตัวอย่าง
    if ((!result.section1.section1_knowledge_outcomes || result.section1.section1_knowledge_outcomes.length === 0) &&
        (!result.section1.section1_application_outcomes || result.section1.section1_application_outcomes.length === 0)) {
      
      result.section1 = {
        ...result.section1,
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
          "ใช้ข้อมูลเป็นฐานในการพัฒนาท้องถิ่น"
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
      };
    }

    // ถ้าไม่มีข้อมูล Section 2 ให้ใส่ข้อมูลตัวอย่าง
    if (!result.section2.section2_data_types || result.section2.section2_data_types.length === 0) {
      result.section2 = {
        ...result.section2,
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
      };
    }

    // ถ้าไม่มีข้อมูล Section 3 ให้ใส่ข้อมูลตัวอย่าง
    if (!result.section3.budget_system_development) {
      result.section3 = {
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
      };
    }

    return result;
  };

  const handleViewResponse = (response) => {
    console.log('🔍 Raw response data:', response); // Debug ข้อมูลดิบ
    
    // แสดงข้อมูลจริงก่อน ไม่ใส่ข้อมูลตัวอย่าง
    let transformedData = transformResponseData(response);
    
    console.log('🔄 Transformed data (before sample):', transformedData); // Debug ข้อมูลที่แปลงแล้ว
    
    // ใส่ข้อมูลตัวอย่างเฉพาะเมื่อจำเป็น (แต่ให้ดูข้อมูลจริงก่อน)
    // transformedData = addSampleDataIfEmpty(transformedData);
    
    console.log('✅ Final data for display:', transformedData); // Debug ข้อมูลสุดท้าย
    
    setSelectedResponse({ ...response, transformedData });
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedResponse(null);
    // คืนค่าการ scroll ของ body
    document.body.style.overflow = 'unset';
  };

  const handleDeleteResponse = async (responseId) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบคำตอบนี้?')) return;

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

  const getCompletionStatus = (response) => {
    const hasSection1 = response.section1_knowledge_outcomes?.length > 0;
    const hasSection2 = response.survey_responses_section2?.length > 0;
    const hasSection3 = response.survey_responses_section3?.length > 0;
    
    if (hasSection1 && hasSection2 && hasSection3) return 'สมบูรณ์';
    if (hasSection1 && hasSection2) return 'ส่วนที่ 1-2';
    if (hasSection1) return 'ส่วนที่ 1';
    return 'ไม่สมบูรณ์';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'สมบูรณ์': return 'bg-green-100 text-green-800';
      case 'ส่วนที่ 1-2': return 'bg-yellow-100 text-yellow-800';
      case 'ส่วนที่ 1': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ตอบทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ตอบสมบูรณ์</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {responses.filter(r => getCompletionStatus(r) === 'สมบูรณ์').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ตอบไม่สมบูรณ์</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {responses.filter(r => getCompletionStatus(r) !== 'สมบูรณ์').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">วันนี้</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {responses.filter(r => 
                  new Date(r.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการคำตอบแบบสอบถาม</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ-สกุล</TableHead>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>หน่วยงาน</TableHead>
                  <TableHead>เบอร์โทร</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่ตอบ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.survey_users?.full_name}
                    </TableCell>
                    <TableCell>{response.survey_users?.position}</TableCell>
                    <TableCell>{response.survey_users?.organization}</TableCell>
                    <TableCell>{response.survey_users?.phone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(getCompletionStatus(response))}>
                        {getCompletionStatus(response)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(response.created_at).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResponse(response)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteResponse(response.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Custom Survey Viewer Modal */}
        {isViewerOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseViewer();
              }
            }}
          >
            <div className="bg-white rounded-lg w-[98vw] h-[98vh] flex flex-col max-w-none shadow-2xl">
              {/* Header with Debug Controls */}
              <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    📋 แบบสอบถาม - {selectedResponse?.survey_users?.full_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {selectedResponse?.survey_users?.organization} • วันที่ตอบ: {selectedResponse && new Date(selectedResponse.created_at).toLocaleDateString('th-TH')}
                  </p>
                  
                  {/* Debug Buttons */}
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => {
                        const realData = transformResponseData(selectedResponse);
                        setSelectedResponse({ ...selectedResponse, transformedData: realData });
                      }}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ดูข้อมูลจริง
                    </button>
                    <button
                      onClick={() => {
                        const realData = transformResponseData(selectedResponse);
                        const sampleData = addSampleDataIfEmpty(realData);
                        setSelectedResponse({ ...selectedResponse, transformedData: sampleData });
                      }}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ดูข้อมูลตัวอย่าง
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-xs text-gray-500">กด ESC เพื่อปิด</span>
                  <button
                    onClick={handleCloseViewer}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                    title="ปิด (ESC)"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-6">
                  {selectedResponse && (
                    <CompleteSurveyViewer 
                      data={selectedResponse.transformedData || transformResponseData(selectedResponse)} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
