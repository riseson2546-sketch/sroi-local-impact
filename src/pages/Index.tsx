import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Settings, HelpCircle, ChevronDown, ChevronUp, Clock, Save, Shield, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

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

        {/* Usage Instructions Toggle */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="cursor-pointer" onClick={() => setShowInstructions(!showInstructions)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-800">คำแนะนำการใช้งาน</CardTitle>
                </div>
                {showInstructions ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </CardHeader>
            {showInstructions && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">การเข้าใช้งาน</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>ผู้ใช้ใหม่:</strong> ลงทะเบียนด้วยข้อมูลส่วนตัว</li>
                          <li>• <strong>ลงทะเบียนแล้ว:</strong> ไม่ต้องยืนยันตัวตนในอีเมล</li>
                          <li>• <strong>ผู้ใช้เดิม:</strong> เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน</li>
                          <li>• <strong>สะดวกรวดเร็ว:</strong> สามารถใช้งานได้ทันที</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">โครงสร้างแบบสอบถาม</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>ส่วนที่ 1:</strong> ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม</li>
                          <li>• <strong>ส่วนที่ 2:</strong> การประเมินผลกระทบทางเศรษฐกิจ</li>
                          <li>• <strong>ส่วนที่ 3:</strong> การประเมินผลกระทบทางสังคม</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">เวลาที่ใช้</h4>
                        <p className="text-sm text-gray-700">
                          ใช้เวลาประมาณ <strong>15-20 นาที</strong> ในการตอบแบบสอบถามครบทั้ง 3 ส่วน
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Save className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-orange-800 mb-2">การบันทึกข้อมูล</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• สามารถบันทึกและกลับมาแก้ไขได้ภายหลัง</li>
                          <li>• ระบบจะบันทึกอัตโนมัติทุกครั้งที่เปลี่ยนหน้า</li>
                          <li>• สามารถออกจากระบบและกลับมาทำต่อได้</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">ความปลอดภัยของข้อมูล</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• ข้อมูลทั้งหมดเข้ารหัสและปลอดภัย</li>
                          <li>• ใช้สำหรับการวิจัยเท่านั้น</li>
                          <li>• ไม่เปิดเผยข้อมูลส่วนบุคคล</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">ข้อมูลที่ต้องเตรียมสำหรับการลงทะเบียน</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• <strong>ชื่อ-สกุล:</strong> ชื่อจริงของผู้ตอบแบบสอบถาม</li>
                        <li>• <strong>ตำแหน่ง:</strong> ตำแหน่งงานปัจจุบัน</li>
                        <li>• <strong>หน่วยงาน:</strong> องค์กรหรือหน่วยงานที่สังกัด</li>
                        <li>• <strong>เบอร์โทรศัพท์:</strong> หมายเลขที่สามารถติดต่อได้</li>
                        <li>• <strong>อีเมล:</strong> ที่อยู่อีเมลสำหรับเข้าสู่ระบบ</li>
                        <li>• <strong>รหัสผ่าน:</strong> สร้างรหัสผ่านที่ปลอดภัย</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">วิธีเข้าใช้งานระบบ</h4>
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[60px]">ขั้นตอน 1:</span>
                          <span>คลิก "เริ่มตอบแบบสอบถาม" ด้านล่าง</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[60px]">ขั้นตอน 2:</span>
                          <span>เลือกแท็บ "ลงทะเบียน" หากยังไม่มีบัญชี</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[60px]">ขั้นตอน 3:</span>
                          <span>กรอกข้อมูลส่วนตัวให้ครบถ้วนและลงทะเบียน</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[60px]">ขั้นตอน 4:</span>
                          <span><strong>ไม่ต้องยืนยันตัวตนในอีเมล</strong> สามารถล็อกอินได้ทันที</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[60px]">ขั้นตอน 5:</span>
                          <span>เข้าสู่ระบบและเริ่มตอบแบบสอบถาม</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
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
                <p>• ใช้เวลาประมาณ 15-20 นาที</p>
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
