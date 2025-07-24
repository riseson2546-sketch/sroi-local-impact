import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SurveyHeader from '@/components/survey/SurveyHeader';
import Section1Viewer from './Section1Viewer';
import Section2Viewer from './Section2Viewer';
import Section3Viewer from './Section3Viewer';

interface SurveyViewerProps {
  response: any;
}

const SurveyViewer: React.FC<SurveyViewerProps> = ({ response }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const user = response.survey_users;
  const section2 = response.survey_responses_section2?.[0] || {};
  const section3 = response.survey_responses_section3?.[0] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <div>
            <h1 className="text-xl font-semibold">คำตอบของ คุณ{user?.full_name}</h1>
            <p className="text-muted-foreground">{user?.position}, {user?.organization}</p>
          </div>
        </div>

        <SurveyHeader />

        <div className="flex justify-center mb-6">
          <div className="flex space-x-4">
            {[1, 2, 3].map((section) => (
              <Button
                key={section}
                variant={currentSection === section ? "default" : "outline"}
                onClick={() => setCurrentSection(section)}
                className="min-w-[100px]"
              >
                ส่วนที่ {section}
              </Button>
            ))}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {currentSection === 1 && (
              <Section1Viewer data={response} />
            )}
            {currentSection === 2 && (
              <Section2Viewer data={section2} />
            )}
            {currentSection === 3 && (
              <Section3Viewer data={section3} />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
          >
            ก่อนหน้า
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.min(3, currentSection + 1))}
            disabled={currentSection === 3}
          >
            ถัดไป
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          การดูคำตอบแบบสอบถาม
        </div>
      </div>
    </div>
  );
};

export default SurveyViewer;