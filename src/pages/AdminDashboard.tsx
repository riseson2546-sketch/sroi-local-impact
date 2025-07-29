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
          survey_users(full_name, position, organization, phone),
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

  // แปลงข้อมูลจาก database เป็นรูปแบบที่ CompleteSurveyViewer ต้องการ
  const transformResponseData = (response) => {
    if (!response) return null;

    return {
      respondent: {
        name: response.survey_users?.full_name || 'ไม่ระบุ',
        position: response.survey_users?.position || 'ไม่ระบุ',
        organization: response.survey_users?.organization || 'ไม่ระบุ',
        province: 'ไม่ระบุ', // อาจจะต้องเพิ่มในฐานข้อมูล
        email: 'ไม่ระบุ', // อาจจะต้องเพิ่มในฐานข้อมูล
        phone: response.survey_users?.phone || 'ไม่ระบุ',
        survey_date: new Date(response.created_at).toLocaleDateString('th-TH')
      },
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
      section2: response.survey_responses_section2?.[0] || {},
      section3: response.survey_responses_section3?.[0] || {}
    };
  };

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setIsViewerOpen(true);
    // ป้องกันการ scroll ของ body เมื่อ modal เปิด
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
              {/* Header */}
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
                    <CompleteSurveyViewer data={transformResponseData(selectedResponse)} />
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
