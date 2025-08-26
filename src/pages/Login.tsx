// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // เข้าสู่ระบบ: อีเมลเท่านั้น (ตรวจใน auth ก่อน + sync survey_users ผ่าน RPC)
  const handleEmailOnlyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) return;

      // เรียก RPC ที่คุณสร้างไว้: public.email_only_login_sync(text)
      const { data, error } = await supabase.rpc("email_only_login_sync", { p_email: cleanEmail });

      if (error) {
        const msg = (error as any)?.message || "";
        if (msg.includes("NO_AUTH")) {
          toast({
            title: "ยังไม่มีอีเมลนี้ในระบบผู้ใช้ (auth)",
            description: "โปรดให้ผู้ดูแลเพิ่มบัญชีในหน้า Authentication หรือใช้เมนูลงทะเบียนของระบบ",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      const row = data?.[0];
      if (!row?.survey_user_id || !row?.email) {
        toast({
          title: "ซิงก์โปรไฟล์ไม่สำเร็จ",
          description: "ติดต่อผู้ดูแลระบบเพื่อผูกบัญชีผู้ใช้",
          variant: "destructive",
        });
        return;
      }

      // เก็บข้อมูลสำหรับหน้าแบบสอบถาม (โหมดอีเมลอย่างเดียว)
      localStorage.setItem("survey_email", row.email);
      localStorage.setItem("survey_user_id", String(row.survey_user_id));

      navigate("/survey");
    } catch (err: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err?.message || "ไม่สามารถเข้าสู่ระบบได้",
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
          <CardDescription>เข้าสู่ระบบด้วยอีเมลเท่านั้น</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailOnlyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email_only">อีเมล</Label>
              <Input
                id="email_only"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                ระบบจะตรวจว่าอีเมลนี้มีอยู่ใน <b>Authentication (auth.users)</b> ก่อน และจะซิงก์เข้า <b>survey_users</b> ให้อัตโนมัติ
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "กำลังตรวจสอบ..." : "เข้าทำแบบสอบถาม"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ผู้ดูแลระบบ?{" "}
            <a className="underline cursor-pointer" onClick={() => navigate("/admin-login")}>
              ไปยังระบบผู้ดูแล
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
