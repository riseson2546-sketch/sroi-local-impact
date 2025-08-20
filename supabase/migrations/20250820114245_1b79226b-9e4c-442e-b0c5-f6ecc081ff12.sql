-- Fix security vulnerability: Restrict admin_users table access to authenticated admins only

-- Drop the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_users;

-- Create a secure policy that only allows authenticated admin users to view admin data
CREATE POLICY "Authenticated admins can view admin data" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IN (
  SELECT auth_user_id 
  FROM public.admin_users 
  WHERE auth_user_id = auth.uid()
));