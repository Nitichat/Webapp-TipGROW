import React, { useState } from 'react';
import { TipGrowLogo } from './CropIcons.tsx';
import { loginWithGoogle } from '../firebase.ts';
import { User } from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Exclusive Google (Gmail) Authentication via Firebase Popup
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithGoogle();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('เบราว์เซอร์บล็อกป๊อปอัป กรุณาอนุญาตป๊อปอัปของ Google เพื่อเข้าสู่ระบบ');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('หน้าต่างเข้าสู่ระบบถูกปิดก่อนทำรายการสำเร็จ');
      } else {
        setErrorMessage(err?.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebffe7] flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-900/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TipGrowLogo />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-900">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>เข้าสู่ระบบด้วย Gmail</span>
          </button>
        </div>
      </header>

      {/* Center Main Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-900/10 flex flex-col md:flex-row">
          
          {/* ========================================= */}
          {/* LEFT SIDE: Brand Presentation with Farm Background & TipGROW Logo */}
          {/* ========================================= */}
          <div className="md:w-5/12 relative overflow-hidden bg-[#eaf8ea] border-b md:border-b-0 md:border-r border-emerald-100 flex flex-col justify-center items-center p-6 sm:p-8 text-center">
            {/* Background Farm Landscape */}
            <img
              src="/src/assets/images/regenerated_image_1791929224458.png"
              alt="TipGROW Farm Landscape"
              className="absolute inset-0 w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />

            {/* Foreground: TipGROW Logo & Branding */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              {/* TipGROW Mascot Logo */}
              <div className="mb-3">
                <img
                  src="/src/assets/images/regenerated_image_1791928013693.png"
                  alt="TipGROW Logo"
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain select-none drop-shadow-md transform hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Tagline in frosted pill */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-emerald-900/10 max-w-xs">
                <h2 className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight leading-snug">
                  ยินดีต้อนรับสู่ TipGROW
                </h2>
                <p className="text-[11px] sm:text-xs text-emerald-800/80 mt-1 leading-relaxed font-medium">
                  ระบบคำนวณสูตรปุ๋ยเฉพาะแปลงและจัดการแปลงเกษตรอัจฉริยะแม่นยำสูง
                </p>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT SIDE: Exclusive Gmail Login */}
          {/* ========================================= */}
          <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div className="my-auto">
              {/* Role Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-4 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                สำหรับเกษตรกรและผู้จัดการแปลง
              </div>

              {/* Title: ยินดีต้อนรับ */}
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                ยินดีต้อนรับ 🌱
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-8 leading-relaxed">
                เข้าสู่ระบบด้วยบัญชี Google (Gmail) เพื่อเริ่มคำนวณปุ๋ย จัดการแปลง และติดตามสุขภาพพืชของคุณ
              </p>

              {errorMessage && (
                <div className="p-3 mb-6 rounded-2xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Exclusive Gmail Login Action Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-emerald-600 flex items-center justify-center gap-3.5 text-sm sm:text-base font-bold text-stone-800 transition-all shadow-xs hover:shadow-md cursor-pointer group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                      <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                      <span>กำลังเชื่อมต่อ Google...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>เข้าสู่ระบบด้วย Google (Gmail)</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-stone-400">
                  รองรับบัญชี @gmail.com หรือ Google Workspace ของทุกองค์กร
                </p>
              </div>
            </div>

            {/* Bottom PDPA Legal Footer */}
            <div className="pt-6 mt-8 border-t border-stone-100 flex items-center justify-center text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">verified_user</span>
                มาตรฐานความปลอดภัยตามกฎหมาย PDPA
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Global Footer */}
      <footer className="w-full bg-[#ebffe7] border-t border-emerald-900/10 px-4 sm:px-8 py-4 flex items-center justify-center text-xs text-stone-600">
        <div>
          © 2026 TipGROW. NoCodeNoLife Group
        </div>
      </footer>
    </div>
  );
};
