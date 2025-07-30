import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Users, FileText, BarChart3, X } from 'lucide-react';

const AdminDashboard = () => {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Mock data สำหรับ demo
  const mockResponses = [
    {
      id: '1',
      created_at: '2024-01-15T10:30:00Z',
      section1_knowledge_outcomes: ['outcome1', 'outcome2'],
      survey_users: {
        full_name: 'นายสมชาย ใจดี',
        position: 'นักวิเคราะห์นโยบาย',
        organization: 'องค์การบริหารส่วนตำบลบางปะอิน',
        phone: '081-234-5678',
        email: 'somchai@email.com'
      },
      survey_responses_section2: [{ id: 's2_1' }],
      survey_responses_section3: [{ id: 's3_1' }]
    },
    {
      id: '2',
      created_at: '2024-01-14T14:20:00Z',
      section1_knowledge_outcomes: ['outcome1'],
      survey_users: {
        full_name: 'นางสาวมาลี สวยงาม',
        position: 'เจ้าหน้าที่พัฒนาชุมชน',
        organization: 'เทศบาลตำบลลาดกระบัง',
        phone: '082-345-6789',
        email: 'malee@email.com'
      },
      survey_responses_section2: [{ id: 's2_2' }],
      survey_responses_section3: []
    },
    {
      id: '3',
      created_at: '2024-01-13T09:15:00Z',
      section1_knowledge_outcomes: ['outcome1'],
      survey_users: {
        full_name: 'นายวิชัย เก่งมาก',
        position: 'ผู้อำนวยการฝ่ายแผนงาน',
        organization: 'องค์การบริหารส่วนจังหวัดนครปathom',
        phone: '083-456-7890',
        email: 'wichai@email.com'
      },
      survey_responses_section2: [],
      survey_responses_section3: []
    }
  ];

  useEffect(() => {
    // Mock authentication check
    const checkAuth = async () => {
      // Simulate API call
      setTimeout(() => {
        setAdminData({ full_name: 'ผู้ดูแลระบบ' });
        setResponses(mockResponses);
        setIsLoading(false);
      }, 1000);
    };
    
    checkAuth();
  }, []);

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedResponse(null);
    document.body.style.overflow = 'unset';
  };

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบคำตอบนี้?')) return;

    try {
      // Mock delete
      setResponses(prev => prev.filter(r => r.id !== responseId));
      alert('ลบคำตอบเรียบร้อยแล้ว');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleLogout = async () => {
    // Mock logout
    alert('ออกจากระบบเรียบร้อยแล้ว');
    // In real app: navigate('/admin-login');
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

        {/* Stats Cards */}
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

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการคำตอบแบบสอบถาม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">ชื่อ-สกุล</th>
                    <th className="text-left p-2 font-medium">ตำแหน่ง</th>
                    <th className="text-left p-2 font-medium">หน่วยงาน</th>
                    <th className="text-left p-2 font-medium">เบอร์โทร</th>
                    <th className="text-left p-2 font-medium">สถานะ</th>
                    <th className="text-left p-2 font-medium">วันที่ตอบ</th>
                    <th className="text-left p-2 font-medium">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">
                        {response.survey_users?.full_name}
                      </td>
                      <td className="p-2">{response.survey_users?.position}</td>
                      <td className="p-2">{response.survey_users?.organization}</td>
                      <td className="p-2">{response.survey_users?.phone}</td>
                      <td className="p-2">
                        <Badge className={getStatusColor(getCompletionStatus(response))}>
                          {getCompletionStatus(response)}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {new Date(response.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="p-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Survey Viewer Modal */}
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
                  <button 
                    onClick={handleCloseViewer} 
                    className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors flex-shrink-0" 
                    title="ปิด (ESC)"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {selectedResponse && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">ข้อมูลผู้ตอบแบบสอบถาม</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">ชื่อ-สกุล:</span> {selectedResponse.survey_users?.full_name}</div>
                        <div><span className="font-medium">ตำแหน่ง:</span> {selectedResponse.survey_users?.position}</div>
                        <div><span className="font-medium">หน่วยงาน:</span> {selectedResponse.survey_users?.organization}</div>
                        <div><span className="font-medium">เบอร์โทร:</span> {selectedResponse.survey_users?.phone}</div>
                        <div><span className="font-medium">อีเมล:</span> {selectedResponse.survey_users?.email}</div>
                        <div><span className="font-medium">สถานะ:</span> 
                          <Badge className={`ml-2 ${getStatusColor(getCompletionStatus(selectedResponse))}`}>
                            {getCompletionStatus(selectedResponse)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">สรุปการตอบแบบสอบถาม</h3>
                      <div className="text-sm space-y-2">
                        <div>ส่วนที่ 1: {selectedResponse.section1_knowledge_outcomes?.length > 0 ? '✅ เสร็จสิ้น' : '❌ ยังไม่เสร็จ'}</div>
                        <div>ส่วนที่ 2: {selectedResponse.survey_responses_section2?.length > 0 ? '✅ เสร็จสิ้น' : '❌ ยังไม่เสร็จ'}</div>
                        <div>ส่วนที่ 3: {selectedResponse.survey_responses_section3?.length > 0 ? '✅ เสร็จสิ้น' : '❌ ยังไม่เสร็จ'}</div>
                      </div>
                    </div>
                  </div>
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
