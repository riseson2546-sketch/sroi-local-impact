-- Fix infinite recursion in admin_users policies
DROP POLICY IF EXISTS "Authenticated admins can view admin data" ON public.admin_users;

-- Create a simple policy that allows users to view their own admin record
-- This avoids circular reference by directly checking auth.uid() without subquery
CREATE POLICY "Users can view their own admin data" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (auth_user_id = auth.uid());