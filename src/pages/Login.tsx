import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  // ฟอร์มล็อกอินแบบรหัสผ่าน
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ฟอร์มลงทะเบียน
  const [regFullName, setRegFullName] = useState('');
  const [regPosition, setRegPosition] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // ฟอร์มเข้าแบบ “อีเมลอย่างเดียว”
  const [emailOnly, setEmailOnly] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  // ---------- 1) เข้าสู่ระบบแบบรหัสผ่าน ----------
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = loginEmail.trim().toLowerCase();
      const password = loginPassword;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const userId = data.user?.id;

      // ให้แน่ใจว่ามีแถวใน survey_users (พยายาม map ด้วย auth_user_id)
      let surveyUserId: number | null = null;

      if (userId) {
        const { data: su1, error: e1 } = await supabase
          .from('survey_users')
          .select('id,email')
          .eq('auth_user_id', userId)
          .maybeSingle();

        if (e1) console.warn('lookup survey_users by auth_user_id error:', e1.message);

        if (su1) {
          surveyUserId = su1.id;
          localStorage.setItem('survey_email', su1.email);
        } else {
          // ถ้าไม่มี ลองสร้าง/ผูกด้วย RPC (ถ้าคุณมีฟังก์ชันนี้อยู่แล้ว)
          try {
            const { data: rpc } = await supabase.rpc('get_or_create_survey_user', {
              p_email: email,
              // จะส่งข้อมูลโปรไฟล์เพิ่มก็ได้ เช่น:
              // p_full_name: null, p_position: null, p_organization: null, p_phone: null
            });

            const got = rpc?.[0];
            if (got?.id) {
              surveyUserId = got.id;
              localStorage.setItem('survey_email', got.email || email);
            }
          } catch (rpcErr: any) {
            console.warn('rpc get_or_create_survey_user not available:', rpcErr?.message);
          }

          // ถ้ายังไม่ได้ ลอง insert แบบ fallback
          if (!surveyUserId) {
            const { data: inserted, error: insErr } = await supabase
              .from('survey_users')
              .insert([{ email, auth_user_id: userId }])
              .select('id,email')
              .maybeSingle();
            if (insErr) {
              console.warn('insert survey_users fallback error:', insErr.message);
            } else if (inserted) {
              surveyUserId = inserted.id;
              localStorage.setItem('survey_email', inserted.email);
            }
          }
        }
      }

      if (!surveyUserId) {
        // แม้ล็อกอินได้ แต่ยังหา/สร้าง survey_user ไม่สำเร็จ
        toast({
          title: 'เข้าสู่ระบบสำเร็จ แต่พบปัญหาการผูกโปรไฟล์',
          description: 'ติดต่อผู้ดูแลให้ผูกบัญชีของคุณกับตาราง survey_users',
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem('survey_user_id', String(surveyUserId));
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        description: err?.message || 'กรุณาตรวจสอบอีเมลและรหัสผ่าน',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- 2) ลงทะเบียน ----------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = regEmail.trim().toLowerCase();
      const password = regPassword;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const authUserId = data.user?.id || null;

      // สร้างแถวใน survey_users (ใช้ RPC ถ้ามี / Fallback เป็น insert)
      let surveyUserId: number | null = null;

      try {
        const { data: rpc } = await supabase.rpc('get_or_create_survey_user', {
          p_email: email,
          p_full_name: regFullName || null,
          p_position: regPosition || null,
          p_organization: regOrg || null,
          p_phone: regPhone || null,
        });
        const got = rpc?.[0];
        if (got?.id) {
          surveyUserId = got.id;
          // พยายามอัปเดต auth_user_id ให้แถวนี้ (กรณี RPC ยังไม่เซ็ต)
          if (authUserId) {
            await supabase.from('survey_users').update({ auth_user_id: authUserId }).eq('id', got.id);
          }
        }
      } catch (rpcErr: any) {
        console.warn('rpc get_or_create_survey_user not available:', rpcErr?.message);
      }

      if (!surveyUserId) {
        const { data: inserted, error: insErr } = await supabase
          .from('survey_users')
          .insert([{
            email,
            full_name: regFullName || null,
            position: regPosition || null,
            organization: regOrg || null,
            phone: regPhone || null,
            auth_user_id: authUserId,
          }])
          .select('id');
        if (insErr) throw insErr;
        surveyUserId = inserted?.[0]?.id || null;
      }

      toast({
        title: 'ลงทะเบียนสำเร็จ',
        description: 'เข้าสู่ระบบด้วยอีเมล/รหัสผ่านที่สมัครไว้ได้เลย',
      });
    } catch (err: any) {
      toast({
        title: 'ลงทะเบียนไม่สำเร็จ',
        description: err?.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- 3) โหมด “เข้าแบบอีเมลอย่างเดียว” ----------
  const handleEmailOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = emailOnly.trim().toLowerCase();
      if (!email) return;

      const { data, error } = await supabase
        .from('survey_users')
        .select('id,email')
        .eq('email', email)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: 'ไม่พบอีเมลนี้ในระบบ',
          description: 'กรุณาตรวจสอบอีเมล หรือให้ผู้ดูแลเพิ่มอีเมลของคุณก่อน',
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem('survey_email', data.email);
      localStorage.setItem('survey_user_id', String(data.id));
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err?.message || 'ไม่สามารถเข้าแบบสอบถามได้',
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
          <CardDescription>เข้าสู่ระบบ / ลงทะเบียน หรือเข้าแบบอีเมลอย่างเดียว</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register">ลงทะเบียน</TabsTrigger>
            </TabsList>

            {/* เข้าสู่ระบบด้วยรหัสผ่าน */}
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login_email">อีเมล</Label>
                  <Input
                    id="login_email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login_password">รหัสผ่าน</Label>
                  <Input
                    id="login_password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </form>

              <div className="relative">
                <div className="my-3 text-center text-xs text-muted-foreground">หรือ</div>
                {/* โหมดเข้าแบบอีเมลอย่างเดียว */}
                <form onSubmit={handleEmailOnly} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email_only">เข้าแบบอีเมลอย่างเดียว</Label>
                    <Input
                      id="email_only"
                      type="email"
                      placeholder="name@example.com"
                      value={emailOnly}
                      onChange={(e) => setEmailOnly(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      ระบบจะให้เข้าทำแบบสอบถามทันที <b>เฉพาะอีเมลที่มีอยู่ในระบบแล้ว</b> (ไม่ต้องใช้รหัสผ่าน)
                    </p>
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                    {isLoading ? 'กำลังตรวจสอบอีเมล...' : 'เข้าทำแบบสอบถามด้วยอีเมลเท่านั้น'}
                  </Button>
                </form>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                ผู้ดูแลระบบ?{' '}
                <a className="underline cursor-pointer" onClick={() => navigate('/admin-login')}>
                  ไปยังระบบผู้ดูแล
                </a>
              </div>
            </TabsContent>

            {/* ลงทะเบียน */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg_fullname">ชื่อ-นามสกุล</Label>
                  <Input id="reg_fullname" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_position">ตำแหน่ง</Label>
                  <Input id="reg_position" value={regPosition} onChange={(e) => setRegPosition(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_org">หน่วยงาน/องค์กร</Label>
                  <Input id="reg_org" value={regOrg} onChange={(e) => setRegOrg(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_phone">เบอร์โทร</Label>
                  <Input id="reg_phone" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_email">อีเมล</Label>
                  <Input id="reg_email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_password">รหัสผ่าน</Label>
                  <Input id="reg_password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
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
