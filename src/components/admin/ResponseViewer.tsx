import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ResponseViewerProps {
  response: any;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const user = response.survey_users;
  const section2 = response.survey_responses_section2?.[0] || {};
  const section3 = response.survey_responses_section3?.[0] || {};

  const renderArrayField = (value: any, label: string) => {
    if (!value || !Array.isArray(value) || value.length === 0) return null;
    return (
      <div className="mb-3">
        <strong>{label}:</strong>
        <div className="mt-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderTextField = (value: any, label: string) => {
    if (!value) return null;
    return (
      <div className="mb-3">
        <strong>{label}:</strong>
        <p className="mt-1 text-sm text-muted-foreground">{value}</p>
      </div>
    );
  };

  const renderRatingField = (value: any, label: string) => {
    if (!value) return null;
    return (
      <div className="mb-3">
        <strong>{label}:</strong>
        <Badge variant="outline" className="ml-2">
          {value}/10
        </Badge>
      </div>
    );
  };

  const renderRating5Field = (value: any, label: string) => {
    if (!value) return null;
    return (
      <div className="mb-3">
        <strong>{label}:</strong>
        <Badge variant="outline" className="ml-2">
          {value}/5
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ข้อมูลผู้ตอบ */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลผู้ตอบแบบสอบถาม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>ชื่อ-สกุล:</strong> {user?.full_name}
            </div>
            <div>
              <strong>ตำแหน่ง:</strong> {user?.position}
            </div>
            <div>
              <strong>หน่วยงาน:</strong> {user?.organization}
            </div>
            <div>
              <strong>เบอร์โทร:</strong> {user?.phone}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 1 */}
      <Card>
        <CardHeader>
          <CardTitle>ส่วนที่ 1: ผลลัพธ์จากการเข้าร่วมอบรมหลักสูตรนักพัฒนาเมืองระดับสูง (พมส.)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderArrayField(response.section1_knowledge_outcomes, "ด้านองค์ความรู้")}
          {renderArrayField(response.section1_application_outcomes, "ด้านการประยุกต์ใช้องค์ความรู้")}
          {renderTextField(response.section1_changes_description, "การเปลี่ยนแปลงที่เกิดขึ้น")}
          
          <Separator />
          
          {renderArrayField(response.section1_problems_before, "ปัญหาก่อนเข้าร่วมอบรม")}
          {renderTextField(response.section1_problems_other, "ปัญหาอื่น ๆ")}
          
          <Separator />
          
          {renderArrayField(response.section1_knowledge_solutions, "การใช้องค์ความรู้ในการแก้ปัญหา")}
          {renderTextField(response.section1_knowledge_solutions_other, "วิธีแก้ปัญหาอื่น ๆ")}
          
          <div className="grid grid-cols-2 gap-4">
            {renderRatingField(response.section1_knowledge_before, "ระดับความรู้ก่อนอบรม")}
            {renderRatingField(response.section1_knowledge_after, "ระดับความรู้หลังอบรม")}
          </div>
          
          <Separator />
          
          {renderArrayField(response.section1_it_usage, "การใช้เทคโนโลยีดิจิทัล")}
          {renderTextField(response.section1_it_usage_other, "การใช้เทคโนโลยีอื่น ๆ")}
          {renderRatingField(response.section1_it_level, "ระดับการช่วยเหลือของเทคโนโลยี")}
          
          <Separator />
          
          {renderArrayField(response.section1_cooperation_usage, "กลไกประสานความร่วมมือ")}
          {renderTextField(response.section1_cooperation_usage_other, "ความร่วมมืออื่น ๆ")}
          {renderRatingField(response.section1_cooperation_level, "ระดับการช่วยเหลือของความร่วมมือ")}
          
          <Separator />
          
          {renderArrayField(response.section1_funding_usage, "กลไกการระดมทุน")}
          {renderTextField(response.section1_funding_usage_other, "การระดมทุนอื่น ๆ")}
          {renderRatingField(response.section1_funding_level, "ระดับการช่วยเหลือของการระดมทุน")}
          
          <Separator />
          
          {renderArrayField(response.section1_culture_usage, "กลไกวัฒนธรรมและสินทรัพย์ท้องถิ่น")}
          {renderTextField(response.section1_culture_usage_other, "วัฒนธรรมอื่น ๆ")}
          {renderRatingField(response.section1_culture_level, "ระดับการช่วยเหลือของวัฒนธรรม")}
          
          <Separator />
          
          {renderArrayField(response.section1_green_usage, "กลไกเศรษฐกิจสีเขียวและเศรษฐกิจหมุนเวียน")}
          {renderTextField(response.section1_green_usage_other, "เศรษฐกิจสีเขียวอื่น ๆ")}
          {renderRatingField(response.section1_green_level, "ระดับการช่วยเหลือของเศรษฐกิจสีเขียว")}
          
          <Separator />
          
          {renderArrayField(response.section1_new_dev_usage, "กลไกการพัฒนาใหม่")}
          {renderTextField(response.section1_new_dev_usage_other, "การพัฒนาใหม่อื่น ๆ")}
          {renderRatingField(response.section1_new_dev_level, "ระดับการช่วยเหลือของการพัฒนาใหม่")}
          
          <Separator />
          
          {renderArrayField(response.section1_success_factors, "ปัจจัยความสำเร็จ")}
          {renderTextField(response.section1_success_factors_other, "ปัจจัยความสำเร็จอื่น ๆ")}
          {renderTextField(response.section1_success_description, "อธิบายปัจจัยความสำเร็จ")}
          {renderRatingField(response.section1_overall_change_level, "ระดับการเปลี่ยนแปลงโดยรวม")}
        </CardContent>
      </Card>

      {/* ส่วนที่ 2 */}
      {Object.keys(section2).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ส่วนที่ 2: การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderArrayField(section2.section2_data_types, "ชุดข้อมูลที่ใช้")}
            {renderTextField(section2.section2_data_types_other, "ชุดข้อมูลอื่น ๆ")}
            {renderTextField(section2.section2_data_sources, "แหล่งที่มาของข้อมูล")}
            
            <Separator />
            
            {renderArrayField(section2.section2_partner_organizations, "หน่วยงานที่เข้าร่วม")}
            {renderTextField(section2.section2_partner_organizations_other, "หน่วยงานอื่น ๆ")}
            {renderTextField(section2.section2_partner_participation, "วิธีการเข้าร่วมของหน่วยงาน")}
            
            <Separator />
            
            {renderArrayField(section2.section2_data_benefits, "ประโยชน์ของชุดข้อมูล")}
            {renderRatingField(section2.section2_data_level, "ระดับการตอบโจทย์ของข้อมูล")}
            {renderTextField(section2.section2_continued_development, "การพัฒนาอย่างต่อเนื่อง")}
          </CardContent>
        </Card>
      )}

      {/* ส่วนที่ 3 */}
      {Object.keys(section3).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ส่วนที่ 3: การขับเคลื่อนสู่องค์กรที่ขับเคลื่อนด้วยข้อมูล (Data Driven Organization)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">1. ทรัพยากรภายในองค์กร</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderRating5Field(section3.budget_system_development, "งบประมาณพัฒนาระบบ")}
                {renderRating5Field(section3.budget_knowledge_development, "งบประมาณพัฒนาความรู้")}
                {renderRating5Field(section3.cooperation_between_agencies, "ความร่วมมือระหว่างหน่วยงาน")}
                {renderRating5Field(section3.innovation_ecosystem, "ระบบนิเวศนวัตกรรม")}
                {renderRating5Field(section3.government_digital_support, "การสนับสนุนระบบดิจิทัลจากภาครัฐ")}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">2. สถานะหน่วยงาน เทศบาล/อปท.</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderRating5Field(section3.digital_infrastructure, "โครงสร้างดิจิทัล")}
                {renderRating5Field(section3.digital_mindset, "ความคิดแบบดิจิทัล")}
                {renderRating5Field(section3.learning_organization, "องค์กรแห่งการเรียนรู้")}
                {renderRating5Field(section3.it_skills, "ทักษะด้าน IT")}
                {renderRating5Field(section3.internal_communication, "การสื่อสารภายใน")}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">3. พันธะผูกพันของหน่วยงาน</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderRating5Field(section3.policy_continuity, "ความต่อเนื่องของนโยบาย")}
                {renderRating5Field(section3.policy_stability, "เสถียรภาพของนโยบาย")}
                {renderRating5Field(section3.leadership_importance, "ความสำคัญจากผู้นำ")}
                {renderRating5Field(section3.staff_importance, "ความสำคัญจากเจ้าหน้าที่")}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">4. การสื่อสารกับผู้ใช้บริการ/กลุ่มเป้าหมาย</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderRating5Field(section3.communication_to_users, "การสื่อสารไปยังผู้ใช้บริการ")}
                {renderRating5Field(section3.reaching_target_groups, "การเข้าถึงกลุ่มเป้าหมาย")}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponseViewer;