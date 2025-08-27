import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const StartSurvey = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    organization: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      // ตรวจสอบข้อมูลให้ครบถ้วน
      if (!formData.fullName.trim() || !cleanEmail || !formData.phone.trim() || 
          !formData.position.trim() || !formData.organization.trim()) {
        toast({
          title: 'ข้อมูลไม่ครบถ้วน',
          description: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
          variant: 'destructive',
        });
        return;
      }

      // ตรวจสอบว่าอีเมลถูกต้องหรือไม่
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        toast({
          title: 'อีเมลไม่ถูกต้อง',
          description: 'กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง',
          variant: 'destructive',
        });
        return;
      }

      // ลองหาผู้ใช้เก่าด้วยอีเมล
      const { data: existingUser, error: findErr } = await supabase
        .from('survey_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();
      
      if (findErr) {
        console.error('Find user error:', findErr);
        throw new Error('ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้');
      }

      if (existingUser) {
        // อัพเดทข้อมูลผู้ใช้เก่า
        const { error: updateErr } = await supabase
          .from('survey_users')
          .update({
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            position: formData.position.trim(),
            organization: formData.organization.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id);
        
        if (updateErr) {
          console.error('Update user error:', updateErr);
          throw new Error('ไม่สามารถอัพเดทข้อมูลได้');
        }

        toast({ 
          title: 'พบข้อมูลเดิม', 
          description: 'กำลังโหลดคำตอบเดิมของคุณ...' 
        });
      } else {
        // สร้างผู้ใช้ใหม่
        const { error: insertErr } = await supabase
          .from('survey_users')
          .insert({
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            position: formData.position.trim(),
            organization: formData.organization.trim(),
            email: cleanEmail,
          });
        
        if (insertErr) {
          console.error('Insert user error:', insertErr);
          throw new Error('ไม่สามารถสร้างข้อมูลผู้ใช้ได้');
        }

        toast({ 
          title: 'ลงทะเบียนสำเร็จ', 
          description: 'เริ่มทำแบบสอบถาม' 
        });
      }

      // เก็บอีเมลไว้ใน localStorage
      localStorage.setItem('survey_email', cleanEmail);
      navigate('/survey');
    } catch (err: any) {
      console.error('Login error:', err);
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
          <CardDescription>กรอกข้อมูลพื้นฐานเพื่อเริ่มทำแบบสอบถาม หรือกลับมาแก้ไขคำตอบเดิม</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ชื่อ-สกุล</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังเริ่มต้น...' : 'เริ่มทำแบบสอบถาม'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              ระบบนี้ไม่ต้องใช้รหัสผ่าน หากคุณเคยทำไว้แล้ว ให้กรอกอีเมลเดิม ระบบจะโหลดคำตอบเดิมขึ้นมาให้แก้ไขได้
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartSurvey;
