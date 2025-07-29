import React from 'react';

const SurveyReview = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ff6b6b', 
      padding: '2rem',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🎉 สำเร็จแล้ว!
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        หน้า Survey Review ทำงานได้แล้ว!
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        color: 'black', 
        padding: '1rem', 
        borderRadius: '8px' 
      }}>
        <p><strong>URL:</strong> /admin/survey-review</p>
        <p><strong>เวลา:</strong> {new Date().toLocaleString()}</p>
        <p><strong>สถานะ:</strong> ✅ ทำงานปกติ</p>
      </div>
    </div>
  );
};

export default SurveyReview;
