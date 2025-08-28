import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SurveyHeader from '@/components/survey/SurveyHeader';
import CompleteSurveyViewer from './CompleteSurveyViewer';

interface SurveyViewerProps {
  response: any;
}

const SurveyViewer: React.FC<SurveyViewerProps> = ({ response }) => {
  const user = response.survey_users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6">
          <div>
            <h1 className="text-xl font-semibold">คำตอบของ คุณ{user?.full_name}</h1>
            <p className="text-muted-foreground">{user?.position}, {user?.organization}</p>
          </div>
        </div>

        <CompleteSurveyViewer data={response} />
      </div>
    </div>
  );
};

export default SurveyViewer;