import React from 'react';

interface FooterProps {
  onOpenKnowledge: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenKnowledge }) => {
  return (
    <footer className="w-full bg-[#eaf6e9] border-t border-emerald-900/10 no-print mt-12">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
        
        {/* Brand statement */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950 text-sm">TipGROW</span>
        </div>

        {/* Links & updated copyright */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenKnowledge}
            className="hover:text-emerald-900 transition-colors cursor-pointer"
          >
            คู่มือการวิเคราะห์ดิน
          </button>
          <span className="text-stone-300">•</span>
          <span className="hover:text-emerald-900 transition-colors cursor-pointer">
            เงื่อนไขการใช้งาน
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-600 font-medium">
            © 2026 TipGROW. NoCodeNoLife Group
          </span>
        </div>
      </div>
    </footer>
  );
};
