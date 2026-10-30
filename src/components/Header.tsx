import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User } from 'firebase/auth';

export type NavigationTab = 'home' | 'calculator' | 'history' | 'knowledge' | 'team' | 'admin';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickReport?: () => void;
  onSearchCrop?: (query: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State สำหรับ Dropdown เว็บไซต์ที่เกี่ยวข้อง
  const [showLinksDropdown, setShowLinksDropdown] = useState(false);
  const [showMobileLinksDropdown, setShowMobileLinksDropdown] = useState(false);
  
  const linksDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Handle ESC key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowProfileMenu(false);
        setShowLinksDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linksDropdownRef.current && !linksDropdownRef.current.contains(event.target as Node)) {
        setShowLinksDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home' as const, label: 'หน้าแรก', icon: 'home' },
    { id: 'calculator' as const, label: 'คำนวณปุ๋ย', icon: 'calculate' },
    { id: 'history' as const, label: 'ประวัติการคำนวณ', icon: 'history' },
    { id: 'knowledge' as const, label: 'คู่มือดิน', icon: 'menu_book' },
    { id: 'team' as const, label: 'ผู้จัดทำ', icon: 'groups' },
  ];

  const externalLinks = [
    { label: 'กระทรวงเกษตรและสหกรณ์', url: 'https://www.moac.go.th/site-home', icon: 'account_balance' },
    { label: 'กรมวิชาการเกษตร', url: 'https://www.doa.go.th/th/', icon: 'science' },
  ];

  const isAdminUser = currentUser?.email?.toLowerCase() === 'nitichat38937@gmail.com';

  const handleSelectTab = (tab: NavigationTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
    setShowLinksDropdown(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
        <div className="h-16 sm:h-20 max-w-[1240px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo - clicking logo icon or word TipGROW navigates to home */}
          <div 
            className="flex items-center gap-2 shrink-0 cursor-pointer group"
            onClick={() => handleSelectTab('home')}
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1fZnm7nPeNZUlrWZZ93MBsGHCRVZQYaWv&sz=w500" 
              alt="TipGROW Logo" 
              className="h-9 sm:h-11 w-auto object-contain select-none group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight">
              TipGROW
            </span>
          </div>

          {/* Navigation Tabs - Desktop Only (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 py-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* เว็บไซต์ที่เกี่ยวข้อง Dropdown (Desktop) */}
            <div className="relative ml-1" ref={linksDropdownRef}>
              <button
                onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                className={`flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  showLinksDropdown
                    ? 'text-emerald-800 bg-emerald-50'
                    : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <span>เว็บไซต์ที่เกี่ยวข้อง</span>
                <span className="material-symbols-outlined text-[18px] transition-transform duration-200" style={{ transform: showLinksDropdown ? 'rotate(180deg)' : 'rotate(0)' }}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {showLinksDropdown && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[240px] bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 mb-1 border-b border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">ลิงก์หน่วยงานภาครัฐ</span>
                  </div>
                  {externalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors group"
                      onClick={() => setShowLinksDropdown(false)}
                    >
                      <span className="material-symbols-outlined text-[20px] text-emerald-600/70 group-hover:text-emerald-700 mt-0.5">
                        {link.icon}
                      </span>
                      <span className="font-semibold leading-tight">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Section: Profile / Auth Button & Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0">
            {/* Admin Badge/Button for Nitichat38937@gmail.com */}
            {isAdminUser && (
              <button
                onClick={() => {
                  if (onOpenAdmin) onOpenAdmin();
                  else handleSelectTab('admin');
                }}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                }`}
                title="เข้าสู่แดชบอร์ดผู้ดูแลระบบ"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600">admin_panel_settings</span>
                <span>โหมด Admin</span>
              </button>
            )}

            {/* Desktop/Tablet Profile / Auth Button */}
            <div className="hidden sm:flex items-center">
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
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 text-stone-800">
                      <div className="p-2 border-b border-stone-100 mb-2">
                        <p className="text-xs text-stone-500">เข้าสู่ระบบด้วย Gmail</p>
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {currentUser.displayName || currentUser.email}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {isAdminUser && (
                        <button
                          onClick={() => {
                            if (onOpenAdmin) onOpenAdmin();
                            else handleSelectTab('admin');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2 transition-colors mb-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-emerald-700">admin_panel_settings</span>
                          โหมด Admin หลังบ้าน
                        </button>
                      )}

                      <button
                        onClick={() => {
                          handleSelectTab('history');
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
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}
            </div>

            {/* Mobile User Avatar Shortcut (if logged in on small screen) */}
            {currentUser && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden flex items-center p-0.5 rounded-full ring-2 ring-emerald-500/40 cursor-pointer"
                title="ดูโปรไฟล์และเมนู"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">
                    {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </button>
            )}

            {/* Mobile Hamburger Menu Button (visible on mobile < 768px) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="md:hidden w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-950 bg-stone-100 hover:bg-emerald-50 active:bg-emerald-100 border border-stone-200 transition-colors cursor-pointer select-none"
              aria-label={isMobileMenuOpen ? "ปิดเมนูนำทาง" : "เปิดเมนูนำทาง"}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE HAMBURGER DRAWER OVERLAY (Rendered in Portal)       */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] md:hidden flex justify-end">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <div className="relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col z-10 border-l border-stone-200">
            
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSelectTab('home')}
              >
                <img 
                  src="https://drive.google.com/thumbnail?id=1fZnm7nPeNZUlrWZZ93MBsGHCRVZQYaWv&sz=w500" 
                  alt="TipGROW Logo" 
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-base font-black text-emerald-950">TipGROW</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="ปิดเมนู"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Nav Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">
                เมนูนำทาง
              </div>
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-white' : 'text-emerald-700'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* เว็บไซต์ที่เกี่ยวข้อง Dropdown (Mobile) */}
              <div className="mt-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setShowMobileLinksDropdown(!showMobileLinksDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
                    showMobileLinksDropdown ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-[22px] text-emerald-700">link</span>
                    <span>เว็บไซต์ที่เกี่ยวข้อง</span>
                  </div>
                  <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: showMobileLinksDropdown ? 'rotate(180deg)' : 'rotate(0)' }}>
                    expand_more
                  </span>
                </button>
                
                {/* Mobile Dropdown Items (Collapsible) */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showMobileLinksDropdown ? 'max-h-[200px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-[52px] pr-4 space-y-1 pb-2">
                    {externalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2.5 text-sm text-stone-600 hover:text-emerald-800 font-semibold"
                        onClick={() => setIsMobileMenuOpen(false)} // Close drawer on link click
                      >
                         <span className="material-symbols-outlined text-[18px] text-stone-400">
                          {link.icon}
                        </span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Account Section in Drawer */}
              <div className="pt-5 mt-4 border-t border-stone-200">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">
                  บัญชีผู้ใช้งาน
                </div>
                {currentUser ? (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2.5 mb-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="User Avatar"
                          className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                          {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="truncate flex-1">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {currentUser.displayName || currentUser.email}
                        </p>
                        <p className="text-[11px] text-emerald-700 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {isAdminUser && (
                      <button
                        onClick={() => {
                          if (onOpenAdmin) onOpenAdmin();
                          else handleSelectTab('admin');
                        }}
                        className="w-full mb-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-200/80 hover:bg-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-emerald-800">admin_panel_settings</span>
                        <span>โหมด Admin หลังบ้าน</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSelectTab('history')}
                      className="w-full mb-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/70 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">history</span>
                      <span>ประวัติแปลงปุ๋ยของฉัน</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>เข้าสู่ระบบด้วย Gmail</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
              <span className="text-[11px] text-stone-400 block font-semibold">
                TipGROW • ระบบคำนวณปุ๋ยอัจฉริยะ
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};