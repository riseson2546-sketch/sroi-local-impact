// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

type SurveyUser = {
  id: number;
  email: string;
  full_name?: string | null;
  position?: string | null;
  organization?: string | null;
  phone?: string | null;
  auth_user_id?: string | null;
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  // ฟอร์มเข้าแบบอีเมลอย่างเดียว
  const [emailOnly, setEmailOnly] = useState('');

  // ฟอร์มลงทะเบียน (ไม่ใช้รหัสผ่าน)
  const [regFullName, setRegFullName] = useState('');
  const [regPosition, setRegPosition] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // -------- helper: upsert survey_users โดยไม่แตะ auth --------
  const upsertSurveyUser = async (payload: Omit<SurveyUser, 'id'> & { email: string }) => {
    const email = payload.email.trim().toLowerCase();

    // 1) ลองใช้ RPC ถ้ามี
    try {
      const { data: rpc, error: rpcErr } = await supabase.rpc('get_or_create_survey_user', {
        p_email: email,
        p_full_name: payload.full_name ?? null,
        p_position: payload.position ?? null,
        p_organization: payload.organization ?? null,
        p_phone: payload.phone ?? null,
      });
      if (!rpcErr && rpc?.[0]?.id) {
        return { id: rpc[0].id as number, email: rpc[0].email as string };
      }
    } catch {
      // เงียบไว้ (อาจไม่มี RPC)
    }

    // 2) ถ้าไม่มี RPC → manual upsert
    const { data: existing } = await supabase
      .from('survey_users')
      .select('id,email')
      .eq('email', email)
      .maybeSingle();

    if (existing?.id) {
      const { data: updated, error: upErr } = await supabase
        .from('survey_users')
        .update({
          full_name: payload.full_name ?? null,
          position: payload.position ?? null,
          organization: payload.organization ?? null,
          phone: payload.phone ?? null,
        })
        .eq('id', existing.id)
        .select('id,email')
        .maybeSingle();
      if (upErr) throw upErr;
      return updated!;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('survey_users')
        .insert([{
          email,
          full_name: payload.full_name ?? null,
          position: payload.position ?? null,
          organization: payload.organization ?? null,
          phone: payload.phone ?? null,
        }])
        .select('id,email')
        .maybeSingle();
      if (insErr) throw insErr;
      return inserted!;
    }
  };

  // ---------- 1) เข้าระบบ: อีเมลเท่านั้น ----------
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
          description: 'โปรดลงทะเบียนอีเมลก่อน แล้วจึงเข้าทำแบบสอบถาม',
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

  // ---------- 2) ลงทะเบียน: ไม่มีรหัสผ่าน ----------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = regEmail.trim().toLowerCase();
      if (!email) {
        toast({ title: 'กรอกอีเมล', description: 'กรุณากรอกอีเมลให้ถูกต้อง', variant: 'destructive' });
        return;
      }

      const created = await upsertSurveyUser({
        email,
        full_name: regFullName || null,
        position: regPosition || null,
        organization: regOrg || null,
        phone: regPhone || null,
        auth_user_id: null,
      });

      localStorage.setItem('survey_email', created.email);
      localStorage.setItem('survey_user_id', String(created.id));

      toast({ title: 'ลงทะเบียนสำเร็จ', description: 'เข้าสู่แบบสอบถามได้เลย' });
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'ลงทะเบียนไม่สำเร็จ',
        description: err?.message || 'กรุณาลองใหม่อีกครั้ง',
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
          <CardDescription>เข้าสู่ระบบด้วยอีเมลเท่านั้น หรือ ลงทะเบียนแบบไม่ใช้รหัสผ่าน</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="email">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register">ลงทะเบียน</TabsTrigger>
            </TabsList>

            {/* เข้าสู่ระบบ: อีเมลอย่างเดียว */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailOnly} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email_only">อีเมล</Label>
                  <Input
                    id="email_only"
                    type="email"
                    placeholder="name@example.com"
                    value={emailOnly}
                    onChange={(e) => setEmailOnly(e.target.value)}
                    autoFocus
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ระบบจะอนุญาตเฉพาะ <b>อีเมลที่มีอยู่ในระบบ (survey_users)</b> เท่านั้น
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าทำแบบสอบถาม'}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                ผู้ดูแลระบบ?{' '}
                <a className="underline cursor-pointer" onClick={() => navigate('/admin-login')}>
                  ไปยังระบบผู้ดูแล
                </a>
              </div>
            </TabsContent>

            {/* ลงทะเบียน: ไม่มีรหัสผ่าน */}
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

                <p className="text-xs text-muted-foreground -mt-1">
                  ไม่ต้องตั้งรหัสผ่าน ระบบจะบันทึกอีเมลนี้ในฐานข้อมูล และพาเข้าแบบสอบถามได้เลย
                </p>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนและเริ่มตอบแบบสอบถาม'}
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
