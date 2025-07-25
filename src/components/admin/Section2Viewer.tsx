import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Section2ViewerProps {
  data: any;
}

const Section2Viewer: React.FC<Section2ViewerProps> = ({ data }) => {
  const renderArrayField = (value: any, label: string) => {
    if (!value || !Array.isArray(value) || value.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">{label}</h4>
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-primary/10 border border-primary/20 rounded">
              <div className="w-4 h-4 rounded border-2 bg-primary border-primary flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTextField = (value: any, label: string) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">{label}</h4>
        <div className="p-3 bg-secondary/20 rounded">
          {value}
        </div>
      </div>
    );
  };

  const renderRatingScale = (value: any, max: number = 10) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-3">ระดับการตอบโจทย์ของข้อมูล (1-{max})</h4>
        <div className="flex space-x-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded border flex items-center justify-center text-sm ${
                value === num
                  ? 'bg-primary text-white border-primary'
                  : 'bg-secondary border-secondary'
              }`}
            >
              {num}
            </div>
          ))}
          <Badge variant="outline" className="ml-4">
            เลือก: {value}/{max}
          </Badge>
        </div>
      </div>
    );
  };

  const dataTypes = [
    "ข้อมูลด้านเศรษฐกิจ",
    "ข้อมูลด้านสังคม",
    "ข้อมูลด้านสิ่งแวดล้อม",
    "ข้อมูลด้านการเมือง/การปกครอง",
    "ข้อมูลด้านเทคโนโลยี",
    "ข้อมูลด้านกายภาพ/โครงสร้างพื้นฐาน",
  ];

  const partnerOrgs = [
    "หน่วยงานรัฐระดับกลาง",
    "หน่วยงานรัฐระดับภูมิภาค",
    "องค์กรปกครองส่วนท้องถิ่นอื่น",
    "หน่วยงานเอกชน",
    "องค์กรวิชาการ/มหาวิทยาลัย",
    "องค์กรภาคประชาสังคม",
    "องค์กรระหว่างประเทศ",
  ];

  const dataBenefits = [
    "ช่วยในการวางแผนพัฒนา",
    "ช่วยในการตัดสินใจเชิงนโยบาย",
    "ช่วยในการจัดสรรทรัพยากร",
    "ช่วยในการติดตามและประเมินผล",
    "ช่วยในการให้บริการประชาชน",
    "ช่วยในการสร้างความโปร่งใส",
    "ช่วยในการประสานงาน",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">ส่วนที่ 2</h2>
        <p className="text-lg text-muted-foreground">
          การพัฒนาและการใช้ประโยชน์จากข้อมูล ความรู้ และความร่วมมือระดับประเทศ
        </p>
      </div>

      {Object.keys(data).length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">ยังไม่มีข้อมูลในส่วนนี้</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* ชุดข้อมูลที่ใช้ */}
          <Card>
            <CardHeader>
              <CardTitle>2.1 ชุดข้อมูลที่นำมาใช้ในการพัฒนาเมือง</CardTitle>
            </CardHeader>
            <CardContent>
              {renderArrayField(data.section2_data_types, "ประเภทข้อมูล")}
              {renderTextField(data.section2_data_types_other, "ประเภทข้อมูลอื่น ๆ")}
              {renderTextField(data.section2_data_sources, "แหล่งที่มาของข้อมูล")}
            </CardContent>
          </Card>

          {/* หน่วยงานที่เข้าร่วม */}
          <Card>
            <CardHeader>
              <CardTitle>2.2 การประสานความร่วมมือกับหน่วยงาน</CardTitle>
            </CardHeader>
            <CardContent>
              {renderArrayField(data.section2_partner_organizations, "หน่วยงานที่เข้าร่วม")}
              {renderTextField(data.section2_partner_organizations_other, "หน่วยงานอื่น ๆ")}
              {renderTextField(data.section2_partner_participation, "วิธีการเข้าร่วมของหน่วยงาน")}
            </CardContent>
          </Card>

          {/* ประโยชน์ของข้อมูล */}
          <Card>
            <CardHeader>
              <CardTitle>2.3 ประโยชน์ของการใช้ข้อมูล</CardTitle>
            </CardHeader>
            <CardContent>
              {renderArrayField(data.section2_data_benefits, "ประโยชน์ที่ได้รับ")}
              {renderRatingScale(data.section2_data_level)}
              {renderTextField(data.section2_continued_development, "การพัฒนาอย่างต่อเนื่อง")}
            </CardContent>
          </Card>

          {/* แสดง Network Expansion ถ้ามี */}
          {data.section2_network_expansion && Object.keys(data.section2_network_expansion).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>2.4 การขยายเครือข่าย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const orgKey = `org${num}`;
                    const cooperationKey = `cooperation${num}`;
                    const orgName = data.section2_network_expansion[orgKey];
                    const cooperation = data.section2_network_expansion[cooperationKey];
                    
                    // แสดงเฉพาะรายการที่มีข้อมูล
                    if (!orgName && !cooperation) return null;
                    
                    return (
                      <div key={num} className="p-3 bg-secondary/20 rounded">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>หน่วยงาน:</strong> {orgName || 'ไม่ระบุ'}</p>
                          </div>
                          <div>
                            <p><strong>ด้านความร่วมมือ:</strong> {cooperation || 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* แสดง Applications ถ้ามี */}
          {data.section2_applications && Object.keys(data.section2_applications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>2.5 แอพพลิเคชั่น/ระบบที่พัฒนา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* แสดงแอพพลิเคชั่น 1 */}
                  {data.section2_applications.app1_name && (
                    <div>
                      <h4 className="font-medium mb-2">แอพพลิเคชั่น: {data.section2_applications.app1_name}</h4>
                      <div className="p-3 bg-secondary/20 rounded space-y-2">
                        <p><strong>วิธีการได้มา:</strong></p>
                        <div className="flex gap-4 ml-4">
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app1_method_buy ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app1_method_buy && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ซื้อ</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app1_method_develop ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app1_method_develop && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>พัฒนาเอง</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app1_method_transfer ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app1_method_transfer && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ถ่ายทอดเทคโนโลยี</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* แสดงแอพพลิเคชั่น 2 */}
                  {data.section2_applications.app2_name && (
                    <div>
                      <h4 className="font-medium mb-2">แอพพลิเคชั่น: {data.section2_applications.app2_name}</h4>
                      <div className="p-3 bg-secondary/20 rounded space-y-2">
                        <p><strong>วิธีการได้มา:</strong></p>
                        <div className="flex gap-4 ml-4">
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app2_method_buy ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app2_method_buy && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ซื้อ</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app2_method_develop ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app2_method_develop && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>พัฒนาเอง</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app2_method_transfer ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app2_method_transfer && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ถ่ายทอดเทคโนโลยี</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* แสดงแอพพลิเคชั่น 3 */}
                  {data.section2_applications.app3_name && (
                    <div>
                      <h4 className="font-medium mb-2">แอพพลิเคชั่น: {data.section2_applications.app3_name}</h4>
                      <div className="p-3 bg-secondary/20 rounded space-y-2">
                        <p><strong>วิธีการได้มา:</strong></p>
                        <div className="flex gap-4 ml-4">
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app3_method_buy ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app3_method_buy && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ซื้อ</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app3_method_develop ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app3_method_develop && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>พัฒนาเอง</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              data.section2_applications.app3_method_transfer ? 'bg-primary border-primary' : 'border-gray-300'
                            }`}>
                              {data.section2_applications.app3_method_transfer && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span>ถ่ายทอดเทคโนโลยี</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Section2Viewer;