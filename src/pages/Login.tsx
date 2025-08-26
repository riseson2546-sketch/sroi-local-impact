import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    position: '',
    organization: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user exists in survey_users table
        const { data: surveyUser } = await supabase
          .from('survey_users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (surveyUser) {
          navigate('/survey');
        } else {
          // Check if admin
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();
          
          if (adminUser) {
            navigate('/admin');
          }
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up user with no password required - using email as identifier only
      const { data, error: signUpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true
        }
      });

      if (signUpError) throw signUpError;

      // Create a temporary session for immediate login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: false
        }
      });

      if (signInError) throw signInError;

      // Get or create the user ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create profile in survey_users table
        const { error: profileError } = await supabase
          .from('survey_users')
          .upsert({
            auth_user_id: user.id,
            email: formData.email,
            full_name: formData.fullName,
            position: formData.position,
            organization: formData.organization,
            phone: formData.phone
          });

        if (profileError) throw profileError;

        toast({
          title: "ลงทะเบียนสำเร็จ",
          description: "สามารถเข้าทำแบบสอบถามได้เลย",
        });
        
        navigate('/survey');
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
      // First check if user already exists in our survey_users table
      const { data: existingUsers } = await supabase
        .from('survey_users')
        .select('*')
        .eq('email', formData.email);

      if (existingUsers && existingUsers.length > 0) {
        // User exists, try to sign them in
        const { data, error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            shouldCreateUser: false
          }
        });

        if (error) throw error;

        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับ",
        });
        
        navigate('/survey');
      } else {
        // User doesn't exist, create new account automatically
        toast({
          title: "ไม่พบบัญชีผู้ใช้",
          description: "กรุณากรอกข้อมูลเพิ่มเติมเพื่อสร้างบัญชีใหม่",
        });
        
        // Switch to signup tab
        setActiveTab('signup');
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
          <CardTitle className="text-2xl">แบบสอบถาม SROI</CardTitle>
          <CardDescription>
            การประเมินผลตอบแทนทางสังคมจากการลงทุนของโครงการยกระดับการพัฒนาท้องถิ่น
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="signup">ลงทะเบียน</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
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
                  {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  หากไม่พบบัญชี ระบบจะนำท่านไปลงทะเบียนใหม่อัตโนมัติ
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">อีเมล</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="กรอกอีเมลของท่าน"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-สกุลผู้ให้ข้อมูล</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">หน่วยงาน</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "กำลังสร้างบัญชี..." : "สร้างบัญชีและเข้าทำแบบสอบถาม"}
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  สร้างบัญชีแล้วเข้าทำแบบสอบถามได้ทันที ไม่ต้องยืนยันอีเมล
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;