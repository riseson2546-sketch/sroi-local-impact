-- Create users table for survey respondents
CREATE TABLE public.survey_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.survey_users(id) ON DELETE CASCADE NOT NULL,
  
  -- Section 1: Results from training
  section1_knowledge_outcomes TEXT[], -- Multiple choice outcomes from knowledge
  section1_application_outcomes TEXT[], -- Multiple choice outcomes from application
  section1_changes_description TEXT, -- Open text description of changes
  section1_problems_before TEXT[], -- Problems before training
  section1_problems_other TEXT, -- Other problems specified
  section1_knowledge_solutions TEXT[], -- How knowledge was used to solve problems
  section1_knowledge_solutions_other TEXT, -- Other solutions specified
  section1_knowledge_before INTEGER CHECK (section1_knowledge_before >= 1 AND section1_knowledge_before <= 10),
  section1_knowledge_after INTEGER CHECK (section1_knowledge_after >= 1 AND section1_knowledge_after <= 10),
  
  -- Information technology mechanisms (1.5)
  section1_it_usage TEXT[], -- How IT is used
  section1_it_usage_other TEXT,
  section1_it_level INTEGER CHECK (section1_it_level >= 1 AND section1_it_level <= 10),
  
  -- Cooperation mechanisms (1.6)
  section1_cooperation_usage TEXT[], -- How cooperation is used
  section1_cooperation_usage_other TEXT,
  section1_cooperation_level INTEGER CHECK (section1_cooperation_level >= 1 AND section1_cooperation_level <= 10),
  
  -- Funding mechanisms (1.7)
  section1_funding_usage TEXT[], -- How funding is used
  section1_funding_usage_other TEXT,
  section1_funding_level INTEGER CHECK (section1_funding_level >= 1 AND section1_funding_level <= 10),
  
  -- Culture and local assets mechanisms (1.8)
  section1_culture_usage TEXT[], -- How culture/assets are used
  section1_culture_usage_other TEXT,
  section1_culture_level INTEGER CHECK (section1_culture_level >= 1 AND section1_culture_level <= 10),
  
  -- Green and circular economy mechanisms (1.9)
  section1_green_usage TEXT[], -- How green economy is used
  section1_green_usage_other TEXT,
  section1_green_level INTEGER CHECK (section1_green_level >= 1 AND section1_green_level <= 10),
  
  -- New development mechanisms (1.10)
  section1_new_dev_usage TEXT[], -- How new development is used
  section1_new_dev_usage_other TEXT,
  section1_new_dev_level INTEGER CHECK (section1_new_dev_level >= 1 AND section1_new_dev_level <= 10),
  
  -- Success factors (1.12)
  section1_success_factors TEXT[], -- Success factors
  section1_success_factors_other TEXT,
  section1_success_description TEXT, -- Description of success factors
  section1_overall_change_level INTEGER CHECK (section1_overall_change_level >= 1 AND section1_overall_change_level <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey responses section 2 table for data development and usage
CREATE TABLE public.survey_responses_section2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES public.survey_responses(id) ON DELETE CASCADE NOT NULL,
  
  -- Data usage (2.1)
  section2_data_types TEXT[], -- Types of data used
  section2_data_types_other TEXT,
  section2_data_sources TEXT, -- Sources of data
  section2_partner_organizations TEXT[], -- Partner organizations
  section2_partner_organizations_other TEXT,
  section2_partner_participation TEXT, -- How partners participate
  
  -- Data benefits (2.2-2.3)
  section2_data_benefits TEXT[], -- How data helps
  section2_data_level INTEGER CHECK (section2_data_level >= 1 AND section2_data_level <= 10),
  
  -- Continued development (2.4)
  section2_continued_development TEXT, -- Continued data development
  
  -- Applications (2.5)
  section2_applications JSONB, -- Applications with acquisition method
  
  -- Network expansion (2.6)
  section2_network_expansion JSONB, -- Network partnerships
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey responses section 3 table for data-driven organization
CREATE TABLE public.survey_responses_section3 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES public.survey_responses(id) ON DELETE CASCADE NOT NULL,
  
  -- Driving factors ratings (all 1-5 scale)
  budget_system_development INTEGER CHECK (budget_system_development >= 1 AND budget_system_development <= 5),
  budget_knowledge_development INTEGER CHECK (budget_knowledge_development >= 1 AND budget_knowledge_development <= 5),
  cooperation_between_agencies INTEGER CHECK (cooperation_between_agencies >= 1 AND cooperation_between_agencies <= 5),
  innovation_ecosystem INTEGER CHECK (innovation_ecosystem >= 1 AND innovation_ecosystem <= 5),
  government_digital_support INTEGER CHECK (government_digital_support >= 1 AND government_digital_support <= 5),
  
  digital_infrastructure INTEGER CHECK (digital_infrastructure >= 1 AND digital_infrastructure <= 5),
  digital_mindset INTEGER CHECK (digital_mindset >= 1 AND digital_mindset <= 5),
  learning_organization INTEGER CHECK (learning_organization >= 1 AND learning_organization <= 5),
  it_skills INTEGER CHECK (it_skills >= 1 AND it_skills <= 5),
  internal_communication INTEGER CHECK (internal_communication >= 1 AND internal_communication <= 5),
  
  policy_continuity INTEGER CHECK (policy_continuity >= 1 AND policy_continuity <= 5),
  policy_stability INTEGER CHECK (policy_stability >= 1 AND policy_stability <= 5),
  leadership_importance INTEGER CHECK (leadership_importance >= 1 AND leadership_importance <= 5),
  staff_importance INTEGER CHECK (staff_importance >= 1 AND staff_importance <= 5),
  
  communication_to_users INTEGER CHECK (communication_to_users >= 1 AND communication_to_users <= 5),
  reaching_target_groups INTEGER CHECK (reaching_target_groups >= 1 AND reaching_target_groups <= 5),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.survey_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_section2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_section3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for survey_users
CREATE POLICY "Users can view their own profile" 
ON public.survey_users 
FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can create their own profile" 
ON public.survey_users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
ON public.survey_users 
FOR UPDATE 
USING (auth.uid() = auth_user_id);

-- Create RLS policies for survey_responses
CREATE POLICY "Users can view their own responses" 
ON public.survey_responses 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users WHERE id = user_id));

CREATE POLICY "Users can create their own responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.survey_users WHERE id = user_id));

CREATE POLICY "Users can update their own responses" 
ON public.survey_responses 
FOR UPDATE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users WHERE id = user_id));

-- Create RLS policies for survey_responses_section2
CREATE POLICY "Users can view their own section2 responses" 
ON public.survey_responses_section2 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

CREATE POLICY "Users can create their own section2 responses" 
ON public.survey_responses_section2 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

CREATE POLICY "Users can update their own section2 responses" 
ON public.survey_responses_section2 
FOR UPDATE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

-- Create RLS policies for survey_responses_section3
CREATE POLICY "Users can view their own section3 responses" 
ON public.survey_responses_section3 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

CREATE POLICY "Users can create their own section3 responses" 
ON public.survey_responses_section3 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

CREATE POLICY "Users can update their own section3 responses" 
ON public.survey_responses_section3 
FOR UPDATE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.survey_users su JOIN public.survey_responses sr ON su.id = sr.user_id WHERE sr.id = response_id));

-- Admin policies (admins can view/delete all responses)
CREATE POLICY "Admins can view all user data" 
ON public.survey_users 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can view all responses" 
ON public.survey_responses 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can delete responses" 
ON public.survey_responses 
FOR DELETE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can view all section2 responses" 
ON public.survey_responses_section2 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can delete section2 responses" 
ON public.survey_responses_section2 
FOR DELETE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can view all section3 responses" 
ON public.survey_responses_section3 
FOR SELECT 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

CREATE POLICY "Admins can delete section3 responses" 
ON public.survey_responses_section3 
FOR DELETE 
USING (auth.uid() IN (SELECT auth_user_id FROM public.admin_users));

-- Admin users policies
CREATE POLICY "Admins can view admin profiles" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can create their profile" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_survey_users_updated_at
  BEFORE UPDATE ON public.survey_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON public.survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_section2_updated_at
  BEFORE UPDATE ON public.survey_responses_section2
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_section3_updated_at
  BEFORE UPDATE ON public.survey_responses_section3
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();