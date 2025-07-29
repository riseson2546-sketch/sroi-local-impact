-- Add problem detail fields to survey_responses table
-- These fields store the additional details users provide for selected problems in section 1.3

ALTER TABLE public.survey_responses 
ADD COLUMN IF NOT EXISTS section1_problems_detail_0 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_1 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_2 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_3 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_4 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_5 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_6 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_7 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_8 TEXT,
ADD COLUMN IF NOT EXISTS section1_problems_detail_9 TEXT;

-- Also add the missing application_other field if it doesn't exist
ALTER TABLE public.survey_responses 
ADD COLUMN IF NOT EXISTS section1_application_other TEXT;

-- Add comment to document the purpose of these fields
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_0 IS 'Additional details for problem 0: มีปัญหาและความจำเป็นเร่งด่วนในพื้นที่';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_1 IS 'Additional details for problem 1: วิสัยทัศน์และความต่อเนื่องของผู้นำในการพัฒนานวัตกรรมท้องถิ่น';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_2 IS 'Additional details for problem 2: การบริหารจัดการองค์กร';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_3 IS 'Additional details for problem 3: ความชัดเจนของแผนและนโยบายมายังผู้ปฏิบัติงาน';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_4 IS 'Additional details for problem 4: ขาดที่ปรึกษาในการสร้างสรรค์นวัตกรรมท้องถิ่น';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_5 IS 'Additional details for problem 5: ไม่ใช้ข้อมูลเป็นฐานในการวางแผน';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_6 IS 'Additional details for problem 6: บุคลากรไม่กล้าที่จะลงมือทำ เพราะกลัวความผิดพลาด';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_7 IS 'Additional details for problem 7: ขาดเครือข่ายในการพัฒนาเมือง';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_8 IS 'Additional details for problem 8: ขาดความรู้ทักษะในการพัฒนาเมือง';
COMMENT ON COLUMN public.survey_responses.section1_problems_detail_9 IS 'Additional details for problem 9: ขาดข้อมูลที่ใช้ในการวางแผน/พัฒนาเมือง';
