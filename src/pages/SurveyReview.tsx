import React from 'react';

const SurveyReview = () => {
  return (
    <div className="min-h-screen bg-red-100 p-8">
      <h1 className="text-4xl font-bold text-red-800">
        🎉 หน้าใหม่ทำงานแล้ว!
      </h1>
      <p className="text-xl mt-4">
        ถ้าเห็นข้อความนี้แปลว่า Route ใหม่ทำงานได้แล้ว
      </p>
      <div className="mt-8 p-4 bg-white rounded shadow">
        <p>URL ปัจจุบัน: /admin/survey-review</p>
        <p>เวลา: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SurveyReview;
