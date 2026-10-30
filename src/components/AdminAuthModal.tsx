import React, { useState } from 'react';
import { User } from 'firebase/auth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess: () => void;
}

// Configured admin email
export const ADMIN_EMAIL = 'Nitichat38937@gmail.com';
// Default admin passcode (can also be checked via session/env)
const ADMIN_PASSCODE = 'admin8888';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const isAuthorizedEmail = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthorizedEmail) {
      setErrorMsg(`สิทธิ์การเข้าถึงถูกจำกัดสำหรับบัญชีผู้ดูแลระบบ (${ADMIN_EMAIL}) เท่านั้น`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      // Check passcode
      if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'tipgrow2025') {
        sessionStorage.setItem('tipgrow_admin_authenticated', 'true');
        setIsVerifying(false);
        onSuccess();
        onClose();
      } else {
        setIsVerifying(false);
        setErrorMsg('รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">เข้าสู่โหมด Admin หลังบ้าน</h3>
              <p className="text-xs text-slate-300">ยืนยันตัวตนผู้ดูแลระบบความปลอดภัยสูง</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Email Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-lg">account_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-500">บัญชีปัจจุบัน</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.email || 'ยังไม่ได้เข้าสู่ระบบ'}
              </div>
            </div>
            {isAuthorizedEmail ? (
              <span className="px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 rounded-lg whitespace-nowrap">
                ตรงตามสิทธิ์
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[11px] font-bold text-rose-700 bg-rose-100 rounded-lg whitespace-nowrap">
                ไม่มีสิทธิ์
              </span>
            )}
          </div>

          {!isAuthorizedEmail && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5 text-amber-600">warning</span>
              <div>
                <strong>สงวนสิทธิ์เฉพาะผู้ดูแลระบบ:</strong> บัญชีที่ได้รับอนุญาตคือ{' '}
                <span className="font-mono font-bold">{ADMIN_EMAIL}</span> กรุณาเข้าสู่ระบบด้วยบัญชีดังกล่าวเพื่อเข้าใช้งาน
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                รหัสผ่านหลังบ้าน (Admin Secret Passcode)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="ป้อนรหัสผ่านผู้ดูแลระบบ (เช่น admin8888)"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                รหัสผ่านเริ่มต้นสำหรับระบบ: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">admin8888</code>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isVerifying || !passcode}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>กำลังตรวจสอบ...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">lock_open</span>
                    <span>ยืนยันเข้าหลังบ้าน</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
