import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // ถ้ามี email ที่เคย login อยู่ใน localStorage → เข้าได้เลย
    const savedEmail = localStorage.getItem("survey_email");
    if (savedEmail) {
      navigate("/survey");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1) เช็กว่ามีผู้ใช้อยู่แล้วหรือไม่
      const { data: existingUser, error: selectError } = await supabase
        .from("survey_users")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingUser) {
        // → User เก่า → login ได้เลย
        localStorage.setItem("survey_email", cleanEmail);
        navigate("/survey");
      } else {
        // → User ใหม่ → insert แถวใหม่
        const { data: newUser, error: insertError } = await supabase
          .from("survey_users")
          .insert({ email: cleanEmail })
          .select("*")
          .single();

        if (insertError) throw insertError;

        localStorage.setItem("survey_email", newUser.email);
        navigate("/survey");
      }
    } catch (err: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err.message ?? "ไม่สามารถเข้าสู่ระบบได้",
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
            กรอกอีเมลเพื่อเข้าสู่ระบบ (ไม่ต้องใช้รหัสผ่าน)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
