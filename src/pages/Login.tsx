// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ถ้าเคยล็อกอินไว้แล้ว ให้พาเข้าหน้าแบบสอบถามทันที
  useEffect(() => {
    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // มี session (กรณีผู้ใช้เดิมที่เคยใช้แบบมีรหัสผ่าน/แอดมิน)
        const { data: surveyUser } = await supabase
          .from('survey_users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();

        if (surveyUser) {
          navigate('/survey');
          return;
        }
      }

      // โหมดอีเมลอย่างเดียว: ถ้ามีค่าเก่าค้างอยู่
      const stored = localStorage.getItem('survey_email');
      if (stored) {
        const { data } = await supabase
          .from('survey_users')
          .select('id,email')
          .eq('email', stored)
          .single();

        if (data) {
          navigate('/survey');
        } else {
          localStorage.removeItem('survey_email');
        }
      }
    };

    bootstrap();
  }, [navigate]);

  const handleEmailOnlyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) return;

      // ตรวจว่าอีเมลนี้ "มีอยู่แล้ว" ในระบบผู้ตอบ (ไม่สร้างใหม่)
      const { data, error } = await supabase
        .from('survey_users')
        .select('id,email')
        .eq('email', cleanEmail)
        .single();

      if (error || !data) {
        toast({
          title: 'ไม่พบอีเมลนี้ในระบบ',
          description: 'กรุณาตรวจสอบอีเมลอีกครั้ง หรือให้ผู้ดูแลเพิ่มข้อมูลก่อน',
          variant: 'destructive',
        });
        return;
      }

      // เจอแล้ว → เข้าได้เลย (ไม่ต้องใส่รหัสผ่าน)
      localStorage.setItem('survey_email', data.email);
      localStorage.setItem('survey_user_id', String(data.id));
      navigate('/survey');
    } catch (err: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.message,
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
          <CardDescription>เข้าสู่ระบบด้วยอีเมลเท่านั้น</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailOnlyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าทำแบบสอบถาม'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ต้องการเข้าหน้าแอดมิน?{' '}
            <a className="underline" onClick={() => navigate('/admin-login')}>ไปยังระบบผู้ดูแล</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
