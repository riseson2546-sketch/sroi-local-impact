import React from 'react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          คณะผู้วิจัยขอขอบพระคุณเป็นอย่างสูง
        </h1>
        <p className="text-lg md:text-xl leading-relaxed">
          ที่กรุณาสละเวลาอันมีค่ายิ่งเพื่อการตอบแบบสอบถามมา ณ โอกาสนี้
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
