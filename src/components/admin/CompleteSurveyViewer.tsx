import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

// --- (1) ลบการประกาศ options ทั้งหมดทิ้ง แล้ว import เข้ามาแทน ---
import {
  knowledgeOutcomes, applicationOutcomes, problemsBefore, knowledgeSolutions,
  itUsage, cooperationUsage, fundingUsage, cultureUsage, greenUsage, newDevUsage,
  successFactors, dataTypes, partnerOrgs, dataBenefits, section3Factors
} from './surveyConstants'; // <-- **ปรับ Path ให้ถูกต้อง**

// --- (2) ปรับปรุงฟังก์ชัน renderCheckboxes ให้จัดการกับ "อื่นๆ" ได้ถูกต้อง ---
const renderCheckboxes = (title: string, options: string[], selectedValues: string[] | undefined, otherValue?: string) => {
    // เช็คว่า "อื่นๆ" ถูกเลือกหรือไม่โดยดูจากค่าที่บันทึกมา หรือการมีข้อความใน otherValue
    const isOtherSelected = (Array.isArray(selectedValues) && selectedValues.includes('อื่น ๆ')) || (otherValue && otherValue.trim() !== '');
    
    return (
        <div className="mb-4 p-4 border rounded-lg bg-white print-item-block">
            <h4 className="font-semibold mb-3">{title}</h4>
            <div className="space-y-2">
                {options.map((opt, i) => {
                    const isChecked = Array.isArray(selectedValues) && selectedValues.includes(opt);
                    return (
                        <div key={i} className="flex items-start space-x-3">
                            <div className={`mt-1 w-5 h-5 r-m border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                                {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                            </div>
                            <span className={`text-sm ${isChecked ? 'font-medium' : 'text-gray-500'}`}>{opt}</span>
                        </div>
                    );
                })}

                {/* ส่วนของ "อื่น ๆ" */}
                <div className="flex items-start space-x-3">
                    <div className={`mt-1 w-5 h-5 r-m border-2 flex items-center justify-center shrink-0 ${isOtherSelected ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}>
                        {isOtherSelected && <span className="text-white font-bold text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${isOtherSelected ? 'font-medium' : 'text-gray-500'}`}>อื่น ๆ</span>
                </div>
                
                {/* แสดงกล่องข้อความ "อื่น ๆ" ถ้ามีค่า */}
                {otherValue && otherValue.trim() !== '' && (
                    <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>ระบุ:</strong> <span className="font-medium">{otherValue}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... โค้ดส่วนที่เหลือของไฟล์เหมือนเดิมได้เลย ...
// อย่าลืมปรับการเรียกใช้ renderCheckboxes ให้ถูกต้อง (ซึ่งโค้ดเดิมของคุณทำไว้ดีแล้ว)
// ตัวอย่าง: renderCheckboxes("...", cooperationUsage, section1.section1_cooperation_usage, section1.section1_cooperation_usage_other)
