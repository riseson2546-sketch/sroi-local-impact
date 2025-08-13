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
