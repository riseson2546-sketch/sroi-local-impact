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

      // Try to find existing user by email (case-insensitive)
      const { data: existingUser, error: findErr } = await supabase
        .from('survey_users')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();
      if (findErr) throw findErr;

      if (existingUser) {
        // Update profile fields (keep same id)
        const { error: upErr } = await supabase
          .from('survey_users')
          .update({
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            position: formData.position.trim(),
            organization: formData.organization.trim(),
            email: cleanEmail,
          })
          .eq('id', existingUser.id);
        if (upErr) throw upErr;
      } else {
        // Insert new respondent
        const { error: insErr } = await supabase
          .from('survey_users')
          .insert({
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            position: formData.position.trim(),
            organization: formData.organization.trim(),
            email: cleanEmail,
          });
        if (insErr) throw insErr;
      }

      // Store email token for later lookup and go to survey
      localStorage.setItem('survey_email', cleanEmail);
      toast({ title: 'เริ่มทำแบบสอบถาม', description: 'กำลังพาคุณไปยังหน้าแบบสอบถาม' });
      navigate('/survey');
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.message ?? 'ไม่สามารถเริ่มทำแบบสอบถามได้',
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
