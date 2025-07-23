import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            แบบสอบถาม : การประเมินผลตอบแทนทางสังคมจากการลงทุนของโครงการยกระดับการพัฒนาท้องถิ่น
          </h1>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-6">
            ด้วยกลไกความรู้และความร่วมมือระดับประเทศ
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            ระบบแบบสอบถามออนไลน์สำหรับการประเมินผลตอบแทนทางเศรษฐกิจและสังคม
            จากการลงทุนในโครงการยกระดับการพัฒนาท้องถิ่นด้วยกลไกความรู้และความร่วมมือระดับประเทศ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>ตอบแบบสอบถาม</CardTitle>
              <CardDescription>
                สำหรับผู้เข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                เริ่มตอบแบบสอบถาม
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <CardTitle>สำหรับผู้จัดการระบบ</CardTitle>
              <CardDescription>
                ดูและจัดการข้อมูลการตอบแบบสอบถาม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/admin-login')}
              >
                เข้าสู่ระบบจัดการ
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>เกี่ยวกับระบบ</CardTitle>
              <CardDescription>
                ข้อมูลและคำแนะนำการใช้งาน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• แบบสอบถาม 3 ส่วน</p>
                <p>• สามารถบันทึกและแก้ไขได้</p>
                <p>• ระบบปลอดภัยและเชื่อถือได้</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">หน่วยงานที่ดำเนินการ</h3>
            <p className="text-muted-foreground">
              ศูนย์วิจัยและพัฒนาเครื่องมือด้านการประเมินผลตอบแทนทางสังคม (SROI TU)<br />
              วิทยาลัยพัฒนศาสตร์ ป๋วย อึ๊งภากรณ์<br />
              ผ่านสถาบันวิจัยและให้คำปรึกษาแห่งมหาวิทยาลัยธรรมศาสตร์<br />
              ร่วมกับ บพท. (สำนักงานส่งเสริมการปกครองท้องถิ่น)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
