import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  email: string;
  fullName: string;
  position: string;
  organization: string;
  phone: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    position: '',
    organization: '',
    phone: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // ====== เคสผู้ใช้ที่ "เคยล็อกอิน" ด้วย Supabase Auth มาก่อน ======
  // ยังให้เข้าระบบได้ด้วยเมลเดิมทันที (ไม่ต้องยืนยันอะไร)
  useEffect(() => {
    const checkAuthOrLocal = async () => {
      // 1) ถ้ามี session เก่าอยู่ ให้พาไปตามสิทธิ์เดิม (survey/admin)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const uid = session.user.id;
        const email = session.user.email ?? '';

        // ลองหาผ่าน auth_user_id เดิมก่อน
        const { data: suByAuth } = await supabase
          .from('survey_users')
          .select('*')
          .eq('auth_user_id', uid)
          .single();

        if (suByAuth) {
          // บันทึกอีเมลแบบ pseudo-session ไว้ใช้รอบต่อไป (กรณีเลิกใช้ Auth แล้ว)
          localStorage.setItem('survey_email', suByAuth.email || email || '');
          navigate('/survey');
          return;
        }

        // ถ้าไม่มีแถวที่ผูก uid เดิม ให้ลองแมตช์ด้วย email (รองรับผู้ใช้ย้ายไปใช้ email-only)
        if (email) {
          const { data: suByEmail } = await supabase
            .from('survey_users')
            .select('*')
            .eq('email', email)
            .single();

          if (suByEmail) {
            localStorage.setItem('survey_email', suByEmail.email);
            navigate('/survey');
            return;
          }
        }

        // สุดท้ายลองตรวจ admin เดิม
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('auth_user_id', uid)
          .single();

        if (adminUser) {
          // เก็บอีเมลไว้เป็นตัวตนแบบใหม่
          if (session.user.email) {
            localStorage.setItem('survey_email', session.user.email);
          }
          navigate('/admin');
          return;
        }
      }

      // 2) ถ้าไม่มี session เดิม ให้ดู pseudo-session จากอีเมลที่เคยใช้เข้า
      const savedEmail = localStorage.getItem('survey_email');
      if (savedEmail) {
        const { data: su } = await supabase
          .from('survey_users')
          .select('id,email')
          .eq('email', savedEmail)
          .single();

        if (su) {
          navigate('/survey');
        }
      }
    };

    checkAuthOrLocal();
  }, [navigate]);

  // ====== สมัครด้วย "อีเมลอย่างเดียว" (สร้างหรืออัปเดตโปรไฟล์ แล้วเข้าได้เลย) ======
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // อัปเสิร์ตผู้ใช้ด้วยอีเมลเป็น unique key
      const { data, error } = await supabase
        .from('survey_users')
        .upsert(
          {
            email: formData.email.trim().toLowerCase(),
            full_name: formData.fullName,
            position: formData.position,
            organization: formData.organization,
            phone: formData.phone,
          },
          { onConflict: 'email' } // ต้องมี unique constraint บนอีเมล
        )
        .select('id,email')
        .single();

      if (error) throw error;

      // เก็บ pseudo-session ด้วยอีเมล แล้วพาไปทำแบบสอบถามทันที
      localStorage.setItem('survey_email', data.email);
      toast({ title: 'สำเร็จ', description: 'เข้าสู่ระบบด้วยอีเมลแล้ว' });
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.message ?? 'ไม่สามารถสมัครได้',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ====== ล็อกอินด้วย "อีเมลอย่างเดียว" ======
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();

      // ถ้าพบอยู่แล้ว -> เข้าได้เลย
      const { data: existing } = await supabase
        .from('survey_users')
        .select('id,email')
        .eq('email', email)
        .single();

      if (existing) {
        localStorage.setItem('survey_email', email);
        navigate('/survey');
        return;
      }

      // ถ้าไม่พบ -> สร้างอัตโนมัติ แล้วเข้าได้เลย
      const { data: created, error: createErr } = await supabase
        .from('survey_users')
        .insert({ email })
        .select('id,email')
        .single();

      if (createErr) throw createErr;

      localStorage.setItem('survey_email', created.email);
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.message ?? 'ไม่สามารถเข้าสู่ระบบได้',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">แบบสอบถาม SROI</CardTitle>
          <CardDescription>
            การประเมินผลตอบแทนทางสังคมจากการลงทุนของโครงการยกระดับการพัฒนาท้องถิ่น
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="signup">ลงทะเบียน</TabsTrigger>
            </TabsList>

            {/* ===== เข้าสู่ระบบด้วยอีเมลอย่างเดียว ===== */}
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </form>
            </TabsContent>

            {/* ===== ลงทะเบียนด้วยอีเมลอย่างเดียว (เก็บโปรไฟล์) ===== */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-สกุลผู้ให้ข้อมูล</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, position: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">หน่วยงาน</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, organization: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">อีเมล</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
