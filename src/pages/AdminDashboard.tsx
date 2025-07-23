import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2, Users, FileText, BarChart3 } from 'lucide-react';
import ResponseViewer from '@/components/admin/ResponseViewer';

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

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setIsViewerOpen(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>กำลังโหลด...</div>
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

        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                คำตอบแบบสอบถาม - {selectedResponse?.survey_users?.full_name}
              </DialogTitle>
            </DialogHeader>
            {selectedResponse && (
              <ResponseViewer response={selectedResponse} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;