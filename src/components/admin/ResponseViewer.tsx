import React from 'react';
import SurveyViewer from './SurveyViewer';

interface ResponseViewerProps {
  response: any;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  return <SurveyViewer response={response} />;
};

export default ResponseViewer;