import React, { useState } from 'react';
import { User } from 'firebase/auth';
// ลบ import { TipGrowLogo } ออกไปแล้ว เพราะเราใช้รูปจาก Google Drive แทน

interface HeaderProps {
  currentTab: 'home' | 'calculator' | 'history' | 'knowledge' | 'team';
  onSelectTab: (tab: 'home' | 'calculator' | 'history' | 'knowledge' | 'team') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickReport?: () => void;
  onSearchCrop?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="h-16 sm:h-20 max-w-[1240px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo - clicking logo icon or word TipGROW navigates to home */}
        <div 
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
          onClick={() => onSelectTab('home')}
        >
          <img 
            src="https://drive.google.com/thumbnail?id=1fZnm7nPeNZUlrWZZ93MBsGHCRVZQYaWv&sz=w500" 
            alt="TipGROW Logo" 
            className="h-9 sm:h-11 w-auto object-contain select-none group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight hidden sm:block">
            TipGROW
          </span>
        </div>

        {/* Navigation Tabs - All menus on the exact same line as TipGROW */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => onSelectTab('calculator')}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'calculator'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            คำนวณปุ๋ย
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'history'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            ประวัติการคำนวณ
          </button>
          <button
            onClick={() => onSelectTab('knowledge')}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'knowledge'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            คู่มือพืช
          </button>
          <button
            onClick={() => onSelectTab('team')}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'team'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            ผู้จัดทำ
          </button>
        </nav>

        {/* Profile / Auth Button */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-emerald-50 transition-colors ring-2 ring-emerald-500/40 cursor-pointer"
                title={currentUser.email || 'บัญชีผู้ใช้'}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 text-stone-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2 border-b border-stone-100 mb-2">
                    <p className="text-xs text-stone-500">เข้าสู่ระบบด้วย Gmail</p>
                    <p className="text-sm font-bold text-stone-900 truncate">
                      {currentUser.displayName || currentUser.email}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('history');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-700">history</span>
                    ประวัติแปลงปุ๋ยของฉัน
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors mt-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-all border border-emerald-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">login</span>
              <span className="hidden sm:inline">เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};