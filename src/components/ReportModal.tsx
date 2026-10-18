import React from 'react';
import { CalculationResult } from '../data/agronomy.ts';
import { TipGrowLogo } from './CropIcons.tsx';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult | null;
  farmerName?: string;
  plotName?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  farmerName = 'เกษตรกรแปลงทดสอบ',
  plotName = 'แปลงทุเรียนจันทบุรี',
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-6 print-area">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
            <span className="material-symbols-outlined text-emerald-800 text-[18px]">description</span>
            <span>รายงานผลการวิเคราะห์และสูตรปุ๋ยเฉพาะแปลง (PDF Export)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 sm:p-10 space-y-6 text-stone-800 bg-white">
          
          {/* Official Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-5">
            <div>
              <TipGrowLogo className="h-10 mb-2" />
              <p className="text-xs text-stone-500">
                ศูนย์วิจัยและพัฒนาปุ๋ยอัจฉริยะเพื่อการเกษตรกรรมยั่งยืน (TipGROW Smart Ag Engine)
              </p>
              <p className="text-[11px] text-stone-400">
                มาตรฐานอ้างอิง: กรมวิชาการเกษตร และสมาคมดินและปุ๋ยแห่งประเทศไทย
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1">
                เอกสารรับรองสูตรปุ๋ยแม่นยำ
              </span>
              <p className="text-xs text-stone-500">วันที่ประเมิน: {todayStr}</p>
              <p className="text-[11px] text-stone-400">รหัสรายงาน: TG-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          {/* Plot Information Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={result.crop.avatarUrl}
                alt={result.crop.nameTh}
                className="w-10 h-10 rounded-xl object-cover shadow-2xs border border-emerald-900/10 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-stone-400 block font-medium text-[11px]">ชนิดพืช:</span>
                <span className="font-bold text-stone-900 text-sm block">{result.crop.nameTh}</span>
                <span className="text-[10px] text-stone-400 font-medium">{result.crop.category}</span>
              </div>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">ระยะการเจริญเติบโต:</span>
              <span className="font-bold text-emerald-900">{result.stage.name}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">ขนาดแปลง:</span>
              <span className="font-bold text-stone-900">{result.totalRai.toFixed(1)} ไร่ ({result.totalSqMeters.toLocaleString()} ตร.ม.)</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">จำนวนต้นประเมิน:</span>
              <span className="font-bold text-stone-900">{result.totalTrees.toLocaleString()} ต้น</span>
            </div>
          </div>

          {/* Soil Diagnostic Diagnosis */}
          <div>
            <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-800">science</span>
              ผลการวิเคราะห์สภาพดิน & สถานะธาตุอาหาร
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="block text-stone-500 text-[11px]">pH ดิน</span>
                <span className="text-base font-extrabold text-emerald-950">{result.phStatus}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="block text-stone-500 text-[11px]">ไนโตรเจน (N)</span>
                <span className="text-base font-extrabold text-stone-900">ขาด {result.deficitN} กก./ไร่</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="block text-stone-500 text-[11px]">ฟอสฟอรัส (P)</span>
                <span className="text-base font-extrabold text-stone-900">ขาด {result.deficitP} กก./ไร่</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="block text-stone-500 text-[11px]">โพแทสเซียม (K)</span>
                <span className="text-base font-extrabold text-stone-900">ขาด {result.deficitK} กก./ไร่</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-2 italic bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              📌 คำแนะนำการปรับปรุงดิน: {result.phAdvice}
            </p>
          </div>

          {/* Fertilizer Prescription Comparison */}
          <div>
            <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-800">medication</span>
              ใบสั่งสูตรปุ๋ยทางดิน (Fertilizer Prescription)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1 */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 text-xs">
                <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-bold text-[10px]">
                  ทางเลือกที่ 1 • ปุ๋ยผสมสูตรสำเร็จรูป
                </span>
                <h5 className="text-base font-extrabold text-emerald-950 mt-1">
                  สูตร {result.commercialFormula}
                </h5>
                <ul className="mt-2 space-y-1 text-stone-600">
                  <li>• ปริมาณรวม: <strong>{result.commercialBags} กระสอบ ({result.commercialKg} กก.)</strong></li>
                  <li>• อัตราใส่: <strong>{result.commercialRateText}</strong></li>
                  <li>• ประมาณการต้นทุน: <strong>฿{result.commercialCost.toLocaleString()}</strong></li>
                </ul>
              </div>

              {/* Option 2 */}
              <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-bold text-[10px]">
                    ทางเลือกที่ 2 • แม่ปุ๋ยเดี่ยวสั่งตัด (ประหยัดสุด)
                  </span>
                  <span className="text-emerald-800 font-bold">เซฟ {result.savingsPercent}%</span>
                </div>
                <h5 className="text-base font-extrabold text-emerald-950 mt-1">
                  แม่ปุ๋ย 3 ชนิด ผสมเอง
                </h5>
                <div className="mt-2 grid grid-cols-3 gap-1 text-center bg-white p-2 rounded-xl border border-emerald-200">
                  <div>
                    <span className="block text-[10px] text-stone-500">46-0-0</span>
                    <strong className="text-emerald-950">{result.customUreaKg} กก.</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-500">18-46-0</span>
                    <strong className="text-emerald-950">{result.customDapKg} กก.</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-500">0-0-60</span>
                    <strong className="text-emerald-950">{result.customPotashKg} กก.</strong>
                  </div>
                </div>
                <div className="mt-2 flex justify-between font-bold text-emerald-900 pt-1 border-t border-emerald-200">
                  <span>น้ำหนักรวม: {result.customTotalKg} กก.</span>
                  <span>ต้นทุน: ฿{result.customCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 30-Day Step Timeline */}
          <div>
            <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-800">event_note</span>
              ขั้นตอนและตารางปฏิบัติงาน 30 วัน
            </h4>
            <div className="space-y-2 text-xs">
              {result.timeline.map((st, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-emerald-900">{st.week}: {st.title}</span>
                    <p className="text-stone-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Sign-off footer */}
          <div className="pt-6 border-t border-stone-200 flex justify-between items-end text-xs text-stone-500">
            <div>
              <p>ผู้จัดการแปลง / เกษตรกร: {farmerName}</p>
              <p className="text-[10px] text-stone-400">สร้างรายงานอัตโนมัติด้วย TipGROW Platform v2.4</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-stone-400 mb-1"></div>
              <p className="text-[11px]">ลายมือชื่อผู้บันทึก</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
