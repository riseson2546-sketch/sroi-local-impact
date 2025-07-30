import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Users, FileText, BarChart3, X, Download } from 'lucide-react'; // เพิ่ม Download
import Papa from 'papaparse'; // Import papaparse
import CompleteSurveyViewer from '@/components/admin/CompleteSurveyViewer';

const AdminDashboard = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<any | null>(null);
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
      const { error } = await supabase.from('survey_responses').delete().eq('id', responseId);
      if (error) throw error;
      toast({ title: "ลบสำเร็จ", description: "ลบคำตอบแล้ว" });
      await loadResponses();
    } catch (error: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: error.message, variant: "destructive" });
    }
  };

  // ***** แก้ไขส่วนนี้ *****
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
        title: "ออกจากระบบสำเร็จ",
        description: "คุณได้ออกจากระบบผู้ดูแลแล้ว",
    });
    navigate('/'); // นำทางไปหน้าหลัก
  };

  const handleExportToCSV = () => {
    if (responses.length === 0) {
      toast({ title: "ไม่มีข้อมูล", description: "ไม่มีข้อมูลสำหรับส่งออก" });
      return;
    }
    toast({ title: "กำลังเตรียมข้อมูล...", description: "ระบบกำลังสร้างไฟล์ CSV กรุณารอสักครู่" });
    const flatData = responses.map(response => flattenResponseData(response));
    const csv = Papa.unparse(flatData, { header: true });
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' }); // เพิ่ม BOM สำหรับ Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `sroi-responses-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const flattenResponseData = (response: any) => {
    const s1 = response;
    const s2 = response.survey_responses_section2?.[0] || {};
    const s3 = response.survey_responses_section3?.[0] || {};
    const user = response.survey_users || {};
    const formatArray = (arr: any[]) => (Array.isArray(arr) ? arr.join('; ') : '');
    
    // คืนค่า object ที่มีข้อมูลแบบ flat
    return {
      'ID': s1.id,
      'วันที่ตอบ': new Date(s1.created_at).toLocaleString('th-TH'),
      'ชื่อ-สกุล': user.full_name, 'ตำแหน่ง': user.position, 'หน่วยงาน': user.organization, 'จังหวัด': user.province, 'เบอร์โทร': user.phone, 'อีเมล': user.email,
      '1.1 องค์ความรู้': formatArray(s1.section1_knowledge_outcomes), '1.1 การประยุกต์ใช้': formatArray(s1.section1_application_outcomes), '1.1 การประยุกต์ใช้ (อื่นๆ)': s1.section1_application_other,
      '1.2 การเปลี่ยนแปลงที่เกิดขึ้น': s1.section1_changes_description, '1.3 ปัญหาก่อนอบรม': formatArray(s1.section1_problems_before),
      '1.4 การใช้ความรู้แก้ปัญหา': formatArray(s1.section1_knowledge_solutions), '1.4 การใช้ความรู้แก้ปัญหา (อื่นๆ)': s1.section1_knowledge_solutions_other,
      '1.4 คะแนนความรู้ (ก่อน)': s1.section1_knowledge_before, '1.4 คะแนนความรู้ (หลัง)': s1.section1_knowledge_after, '1.5 การใช้ IT': formatArray(s1.section1_it_usage), '1.5 การใช้ IT (อื่นๆ)': s1.section1_it_usage_other,
      '1.5 ระดับการช่วยของ IT': s1.section1_it_level, '1.12 ปัจจัยความสำเร็จ': formatArray(s1.section1_success_factors), '1.12 ปัจจัยความสำเร็จ (อื่นๆ)': s1.section1_success_factors_other,
      '1.13 อธิบายปัจจัยความสำเร็จ': s1.section1_success_description, '1.14 ระดับการเปลี่ยนแปลงโดยรวม': s1.section1_overall_change_level,
      '2.1 ชุดข้อมูลที่ใช้': formatArray(s2.section2_data_types), '2.1 ชุดข้อมูลที่ใช้ (อื่นๆ)': s2.section2_data_types_other, '2.1 แหล่งที่มาข้อมูล': s2.section2_data_sources,
      '2.1 หน่วยงานที่ร่วม': formatArray(s2.section2_partner_organizations), '2.1 หน่วยงานที่ร่วม (อื่นๆ)': s2.section2_partner_organizations_other, '2.1 การเข้าร่วมของหน่วยงาน': s2.section2_partner_participation,
      '2.2 ประโยชน์ของชุดข้อมูล': formatArray(s2.section2_data_benefits), '2.3 ระดับการแก้ปัญหาของข้อมูล': s2.section2_data_level, '2.4 การพัฒนาข้อมูลต่อเนื่อง': s2.section2_continued_development,
      '2.5 แอปพลิเคชัน': JSON.stringify(s2.section2_applications), '2.6 เครือข่ายความร่วมมือ': JSON.stringify(s2.section2_network_expansion),
      '3.1 งบพัฒนาระบบ': s3.budget_system_development, '3.1 งบพัฒนาความรู้': s3.budget_knowledge_development, '3.1 ความร่วมมือระหว่างหน่วยงาน': s3.cooperation_between_agencies,
      '3.1 ระบบนิเวศนวัตกรรม': s3.innovation_ecosystem, '3.1 การสนับสนุนดิจิทัลภาครัฐ': s3.government_digital_support, '3.2 ความพร้อมโครงสร้างพื้นฐาน': s3.digital_infrastructure,
      '3.2 Digital Mindset': s3.digital_mindset, '3.2 องค์กรแห่งการเรียนรู้': s3.learning_organization, '3.2 ทักษะ IT': s3.it_skills, '3.2 การสื่อสารภายใน': s3.internal_communication,
      '3.3 ความต่อเนื่องนโยบาย': s3.policy_continuity, '3.3 เสถียรภาพนโยบาย': s3.policy_stability, '3.3 ผู้นำให้ความสำคัญ': s3.leadership_importance,
      '3.3 เจ้าหน้าที่ให้ความสำคัญ': s3.staff_importance, '3.4 การสื่อสารถึงผู้ใช้': s3.communication_to_users, '3.4 การเข้าถึงกลุ่มเป้าหมาย': s3.reaching_target_groups,
    };
  };

  const getCompletionStatus = (response: any) => {
    const hasSection1 = response.section1_knowledge_outcomes?.length > 0;
    const hasSection2 = response.survey_responses_section2?.length > 0;
    const hasSection3 = response.survey_responses_section3?.length > 0;
    if (hasSection1 && hasSection2 && hasSection3) return 'สมบูรณ์';
    if (hasSection1 && hasSection2) return 'ส่วนที่ 1-2';
    if (hasSection1) return 'ส่วนที่ 1';
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

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') handleCloseViewer(); };
    document.addEventListener('keydown', handleEsc);
    return () => { document.removeEventListener('keydown', handleEsc); };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><div>กำลังโหลด...</div></div></div>
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
          <Button variant="outline" onClick={handleLogout}>ออกจากระบบ</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">ผู้ตอบทั้งหมด</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{responses.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">ตอบสมบูรณ์</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{responses.filter(r => getCompletionStatus(r) === 'สมบูรณ์').length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">ตอบไม่สมบูรณ์</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{responses.filter(r => getCompletionStatus(r) !== 'สมบูรณ์').length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">วันนี้</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{responses.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>รายการคำตอบแบบสอบถาม</CardTitle>
            <Button variant="outline" onClick={handleExportToCSV}><Download className="mr-2 h-4 w-4" />Export to CSV</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>ชื่อ-สกุล</TableHead><TableHead>ตำแหน่ง</TableHead><TableHead>หน่วยงาน</TableHead><TableHead>เบอร์โทร</TableHead><TableHead>สถานะ</TableHead><TableHead>วันที่ตอบ</TableHead><TableHead>การดำเนินการ</TableHead></TableRow></TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">{response.survey_users?.full_name}</TableCell><TableCell>{response.survey_users?.position}</TableCell><TableCell>{response.survey_users?.organization}</TableCell>
                    <TableCell>{response.survey_users?.phone}</TableCell><TableCell><Badge className={getStatusColor(getCompletionStatus(response))}>{getCompletionStatus(response)}</Badge></TableCell>
                    <TableCell>{new Date(response.created_at).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell><div className="flex space-x-2"><Button size="sm" variant="outline" onClick={() => handleViewResponse(response)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDeleteResponse(response.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {isViewerOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) handleCloseViewer(); }}>
            <div className="bg-white rounded-lg w-[98vw] h-[98vh] flex flex-col max-w-none shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
                <div className="flex-1 min-w-0"><h2 className="text-xl font-semibold text-gray-900 truncate">📋 แบบสอบถาม - {selectedResponse?.survey_users?.full_name}</h2><p className="text-sm text-gray-600 mt-1 truncate">{selectedResponse?.survey_users?.organization} • วันที่ตอบ: {selectedResponse && new Date(selectedResponse.created_at).toLocaleDateString('th-TH')}</p></div>
                <div className="flex items-center space-x-2 ml-4"><span className="text-xs text-gray-500">กด ESC เพื่อปิด</span><button onClick={handleCloseViewer} className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0" title="ปิด (ESC)"><X className="h-5 w-5" /></button></div>
              </div>
              <div className="flex-1 overflow-y-auto">{selectedResponse && (<CompleteSurveyViewer data={selectedResponse} />)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
