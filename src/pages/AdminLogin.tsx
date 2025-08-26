import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    isLogin: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (adminUser) {
          navigate('/admin');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up admin with email only - no password required
      const { data, error: signUpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true
        }
      });

      if (signUpError) throw signUpError;

      // Get the user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error: profileError } = await supabase
          .from('admin_users')
          .upsert({
            auth_user_id: user.id,
            email: formData.email,
            full_name: formData.fullName
          });

        if (profileError) throw profileError;

        toast({
          title: "ลงทะเบียนสำเร็จ",
          description: "สามารถเข้าระบบจัดการได้เลย",
        });
        
        navigate('/admin');
      }
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if admin exists in our admin_users table
      const { data: existingAdmins } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', formData.email);

      if (existingAdmins && existingAdmins.length > 0) {
        // Admin exists, sign them in
        const { data, error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            shouldCreateUser: false
          }
        });

        if (error) throw error;

        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับสู่ระบบจัดการ",
        });
        
        navigate('/admin');
      } else {
        toast({
          title: "ไม่พบบัญชีผู้ดูแลระบบ",
          description: "กรุณาลงทะเบียนเป็นผู้ดูแลระบบก่อน",
          variant: "destructive",
        });
        
        setFormData(prev => ({ ...prev, isLogin: false }));
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ระบบจัดการผู้ดูแล</CardTitle>
          <CardDescription>
            เข้าสู่ระบบจัดการแบบสอบถาม SROI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={formData.isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, isLogin: true }))}
              >
                เข้าสู่ระบบ
              </Button>
              <Button
                variant={!formData.isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, isLogin: false }))}
              >
                ลงทะเบียน
              </Button>
            </div>
          </div>

          <form onSubmit={formData.isLogin ? handleSignIn : handleSignUp} className="space-y-4">
            {!formData.isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">ชื่อ-สกุล</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required={!formData.isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="กรอกอีเมลของท่าน"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (formData.isLogin ? "กำลังเข้าสู่ระบบ..." : "กำลังลงทะเบียน...")
                : (formData.isLogin ? "เข้าสู่ระบบ" : "ลงทะเบียน")
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;