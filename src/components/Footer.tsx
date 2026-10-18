import React from 'react';

interface FooterProps {
  onOpenKnowledge: () => void;
  onGoHome?: () => void;
  onOpenTeam?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenKnowledge, onGoHome, onOpenTeam }) => {
  return (
    <footer className="w-full bg-[#eaf6e9] border-t border-emerald-900/10 no-print mt-12">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
        
        {/* Brand statement - clicking logo or TipGROW text navigates to home */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer group select-none"
          title="TipGROW - คลิกเพื่อกลับหน้าแรก"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-600/10 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
            <img src="/src/assets/images/regenerated_image_1792216389026.png" alt="TipGROW" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-emerald-950 text-sm group-hover:text-emerald-700 transition-colors">
            TipGROW
          </span>
          <span className="text-[10px] text-emerald-700/80 bg-emerald-100/60 px-2 py-0.5 rounded-full font-medium">
            ระบบคำนวณปุ๋ยเฉพาะแปลง
          </span>
        </div>

        {/* Links & updated copyright */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenKnowledge}
            className="hover:text-emerald-900 transition-colors cursor-pointer"
          >
            คู่มือการวิเคราะห์ดิน
          </button>
          <span className="text-stone-300">•</span>
          <button
            onClick={onOpenTeam}
            className="hover:text-emerald-900 font-semibold text-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">groups</span>
            <span>ผู้จัดทำ (7 คน)</span>
          </button>
          <span className="text-stone-300">•</span>
          <span
            onClick={onGoHome}
            className="text-stone-600 font-medium hover:text-emerald-800 transition-colors cursor-pointer"
            title="คลิกเพื่อกลับหน้าแรก"
          >
            © 2026 TipGROW. NoCodeNoLife Group
          </span>
        </div>
      </div>
    </footer>
  );
};
