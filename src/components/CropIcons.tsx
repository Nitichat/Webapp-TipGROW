import React from 'react';

// Exact TipGROW Seedling Mascot matching 10.png
export const MascotTonKla: React.FC<{ className?: string }> = ({ 
  className = "w-52 h-52"
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img
      src="/src/assets/images/regenerated_image_1791928013693.png"
      alt="TipGROW Mascot Logo"
      className="w-full h-full object-contain select-none"
      referrerPolicy="no-referrer"
    />
  </div>
);

// TipGROW Header Logo
export const TipGrowLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-200/60">
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-9" />
        <path d="M12 13a7 7 0 0 0 7-7c0-2-2-4-7-4a7 7 0 0 0-7 4c0 5 7 7 7 7z" fill="#91D6A7" />
        <path d="M12 13a5 5 0 0 1-5-5c0-1.5 1.5-3 5-3" />
      </svg>
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-extrabold text-xl text-emerald-950 tracking-tight">TipGROW</span>
      </div>
      <span className="text-[10px] text-emerald-700/80 font-medium">ระบบวิเคราะห์ธาตุอาหารและสูตรปุ๋ยเฉพาะแปลง</span>
    </div>
  </div>
);

// Crop illustration badge with fallback icons
export const CropBadgeImage: React.FC<{
  cropId: string;
  name: string;
  emoji: string;
  isSelected?: boolean;
}> = ({ cropId, emoji }) => {
  const getCropVector = () => {
    switch (cropId) {
      case 'durian':
        return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-inner">🍈</div>;
      case 'rubber':
        return <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-2xl shadow-inner">🌳</div>;
      case 'coconut':
        return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-inner">🥥</div>;
      case 'mangosteen':
        return <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-2xl shadow-inner">🟣</div>;
      case 'rambutan':
        return <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-2xl shadow-inner">🔴</div>;
      case 'longkong':
        return <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-2xl shadow-inner">🟡</div>;
      case 'banana':
        return <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-inner">🍌</div>;
      case 'pineapple':
        return <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-2xl shadow-inner">🍍</div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">{emoji}</div>;
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {getCropVector()}
    </div>
  );
};
