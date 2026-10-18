import React from 'react';
import { MascotTonKla } from './CropIcons.tsx';
import { CROPS } from '../data/agronomy.ts';

interface HomeOverviewProps {
  onStartCalculation: (cropId?: string) => void;
  onOpenKnowledge: () => void;
  onOpenAuth: () => void;
  onOpenTeam?: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onStartCalculation,
  onOpenKnowledge,
  onOpenAuth,
  onOpenTeam,
}) => {
  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 pt-2 pb-16 space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-4 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            TipGROW ระบบคำนวณปุ๋ย
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
            คำนวณปุ๋ยง่าย ๆ แค่ไม่กี่ขั้นตอน
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartCalculation('durian')}
              className="px-6 py-3 rounded-full bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <span>เริ่มคำนวณสูตรปุ๋ยทันที</span>
            </button>
            <button
              onClick={onOpenKnowledge}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              <span>ดูคู่มือวิชาการ 8 พืช</span>
            </button>
            {onOpenTeam && (
              <button
                onClick={onOpenTeam}
                className="px-5 py-3 rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 font-bold text-sm border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span>คณะผู้จัดทำ (7 คน)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center">
          <MascotTonKla className="w-40 h-40 transform hover:scale-105 transition-transform" />
        </div>
      </div>

      {/* 8 Crops Selection Quick Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-950">
              เลือกพืชที่คุณสนใจ
            </h2>
            <p className="text-xs text-stone-500">
              ครอบคลุมอัตราความต้องการธาตุอาหาร N-P-K ตามสรีรวิทยาของแต่ละชนิด
            </p>
          </div>
          <button
            onClick={() => onStartCalculation('durian')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>ดูทั้งหมด</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {CROPS.map((crop) => (
            <button
              key={crop.id}
              onClick={() => onStartCalculation(crop.id)}
              className="group bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xs border border-emerald-900/10 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all">
                    <img
                      src={crop.avatarUrl}
                      alt={crop.nameTh}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {crop.nameTh}
                </h3>
                <p className="text-xs text-stone-400">{crop.nameEn} • {crop.category}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>คำนวณสูตร</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
