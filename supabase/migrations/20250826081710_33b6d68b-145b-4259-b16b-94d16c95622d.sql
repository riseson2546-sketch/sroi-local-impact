-- Phase 1: Fix Critical Authentication Issues & Admin Security
-- Remove the dangerous admin creation policy that allows anyone to create admin accounts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admin_users;

-- Create a secure admin creation policy that only allows existing super admins
CREATE POLICY "Only super admins can create admin accounts" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  -- Only allow if the current user is already a super admin or if this is the first admin
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE auth_user_id = auth.uid() 
    AND email IN ('admin@example.com') -- Replace with actual super admin emails
  ) OR 
  -- Allow first admin creation if no admins exist
  NOT EXISTS (SELECT 1 FROM public.admin_users)
);

-- Update admin view policy to be more restrictive
DROP POLICY IF EXISTS "Users can view their own admin data" ON public.admin_users;
CREATE POLICY "Admins can only view their own data" 
ON public.admin_users 
FOR SELECT 
USING (auth_user_id = auth.uid());

-- Create admin update policy
CREATE POLICY "Admins can update their own data" 
ON public.admin_users 
FOR UPDATE 
USING (auth_user_id = auth.uid());

-- Phase 2: Strengthen RLS Policies - Remove Anonymous Access
-- Update survey_responses policies to require authentication
DROP POLICY IF EXISTS "Admins can view all responses" ON public.survey_responses;
CREATE POLICY "Authenticated admins can view all responses" 
ON public.survey_responses 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins can delete responses" ON public.survey_responses;
CREATE POLICY "Authenticated admins can delete responses" 
ON public.survey_responses 
FOR DELETE 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

-- Update survey_users policies
DROP POLICY IF EXISTS "Admins can view all user data" ON public.survey_users;
CREATE POLICY "Authenticated admins can view all user data" 
ON public.survey_users 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

-- Update section2 policies
DROP POLICY IF EXISTS "Admins can view all section2 responses" ON public.survey_responses_section2;
CREATE POLICY "Authenticated admins can view all section2 responses" 
ON public.survey_responses_section2 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins can delete section2 responses" ON public.survey_responses_section2;
CREATE POLICY "Authenticated admins can delete section2 responses" 
ON public.survey_responses_section2 
FOR DELETE 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

-- Update section3 policies
DROP POLICY IF EXISTS "Admins can view all section3 responses" ON public.survey_responses_section3;
CREATE POLICY "Authenticated admins can view all section3 responses" 
ON public.survey_responses_section3 
FOR SELECT 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

DROP POLICY IF EXISTS "Admins can delete section3 responses" ON public.survey_responses_section3;
CREATE POLICY "Authenticated admins can delete section3 responses" 
ON public.survey_responses_section3 
FOR DELETE 
TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users));

-- Phase 3: Fix Database Function Security
-- Update the existing function to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;