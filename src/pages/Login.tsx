// ---------- เข้าระบบ: อีเมลเท่านั้น (เช็ค auth ก่อน + ซิงก์ survey_users ผ่าน RPC) ----------
const handleEmailOnly = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const email = emailOnly.trim().toLowerCase();
    if (!email) return;

    // เรียก RPC: จะเช็ค auth.users ให้ และ upsert survey_users ให้ด้วย
    const { data, error } = await supabase.rpc('email_only_login_sync', { p_email: email });

    if (error) {
      // กรณีไม่มีใน auth.users จะได้ error 'NO_AUTH'
      const msg = (error as any)?.message || '';
      if (msg.includes('NO_AUTH')) {
        toast({
          title: 'ยังไม่มีบัญชีอีเมลนี้ในระบบผู้ใช้ (auth)',
          description: 'โปรดลงทะเบียนก่อน จึงจะเข้าทำแบบสอบถามได้',
          variant: 'destructive',
        });
        return;
      }
      throw error;
    }

    const row = data?.[0];
    if (!row?.survey_user_id) {
      toast({
        title: 'ไม่สามารถซิงก์โปรไฟล์ได้',
        description: 'ติดต่อผู้ดูแลระบบ',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('survey_email', row.email);
    localStorage.setItem('survey_user_id', String(row.survey_user_id));
    // หมายเหตุ: เราไม่ได้สร้าง session (ยังคง “อีเมลอย่างเดียว”)
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
