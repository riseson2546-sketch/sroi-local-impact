-- Fix the admin_users policy to properly restrict to authenticated users only

-- Drop the current policy
DROP POLICY IF EXISTS "Authenticated admins can view admin data" ON public.admin_users;

-- Create a properly secured policy that explicitly requires authentication
CREATE POLICY "Authenticated admins can view admin data" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (
  SELECT auth_user_id 
  FROM public.admin_users 
  WHERE auth_user_id IS NOT NULL
  AND auth_user_id = auth.uid()
));