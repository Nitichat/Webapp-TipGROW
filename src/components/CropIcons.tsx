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
export const TipGrowLogo: React.FC<{
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
}> = ({ className = "h-8", onClick, showSubtitle = true }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 cursor-pointer select-none transition-all ${className}`}
      title="TipGROW - คลิกเพื่อกลับหน้าแรก"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* TipGROW Mascot / Sprout Logo Icon */}
      <div
        onClick={handleClick}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-50 p-1 flex items-center justify-center shadow-xs ring-2 ring-emerald-300/60 group-hover:ring-emerald-500 group-hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
      >
        <img
          src="/src/assets/images/regenerated_image_1792216389026.png"
          alt="TipGROW Logo"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* TipGROW Text Branding */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            onClick={handleClick}
            className="font-black text-2xl text-emerald-950 tracking-tight group-hover:text-emerald-700 transition-colors cursor-pointer"
          >
            TipGROW
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-emerald-700/80 font-medium">
            ระบบวิเคราะห์ธาตุอาหารและสูตรปุ๋ยเฉพาะแปลง
          </span>
        )}
      </div>
    </div>
  );
};

// Real Crop Product Photographs
export const CROP_IMAGES: Record<string, string> = {
  durian: '/src/assets/images/regenerated_image_1792218133979.png',
  rubber: '/src/assets/images/regenerated_image_1792218137108.png',
  coconut: '/src/assets/images/regenerated_image_1792218138819.png',
  mangosteen: '/src/assets/images/regenerated_image_1792218141843.png',
  rambutan: '/src/assets/images/regenerated_image_1792218144926.png',
  longkong: '/src/assets/images/regenerated_image_1792218146804.png',
  banana: '/src/assets/images/regenerated_image_1792218148833.png',
  pineapple: '/src/assets/images/regenerated_image_1792218150785.png',
};

// Reusable Real Crop Photo Image Component
export const CropImage: React.FC<{
  cropId: string;
  alt?: string;
  className?: string;
}> = ({ cropId, alt = '', className = "w-10 h-10 rounded-xl object-cover" }) => {
  const imgSrc = CROP_IMAGES[cropId] || CROP_IMAGES.durian;
  return (
    <img
      src={imgSrc}
      alt={alt || cropId}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};

// Crop photo badge for selection cards and lists
export const CropBadgeImage: React.FC<{
  cropId: string;
  name?: string;
  emoji?: string;
  isSelected?: boolean;
  className?: string;
}> = ({ cropId, name = '', isSelected, className = "w-11 h-11" }) => {
  const imgSrc = CROP_IMAGES[cropId] || CROP_IMAGES.durian;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${isSelected ? 'ring-2 ring-emerald-600 rounded-xl' : ''}`}>
      <img
        src={imgSrc}
        alt={name || cropId}
        className={`${className} rounded-xl object-cover shadow-xs border border-emerald-900/10 transition-transform`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
