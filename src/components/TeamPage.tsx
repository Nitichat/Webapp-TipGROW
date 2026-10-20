import React, { useState } from 'react';

export interface TeamMember {
  id: number;
  studentId: string;
  fullName: string;
  nickname: string;
  role: string;
  gender: 'female' | 'male';
  roleCategory: 'management' | 'design' | 'dev' | 'report';
  bio: string;
  avatarSeed: string;
  photoUrl?: string;
  bgColor: string;
  borderColor: string;
  roleBadgeBg: string;
  roleBadgeText: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 1,
    studentId: '68040049',
    fullName: 'นางสาวกุลจิรา โลจันติ',
    nickname: 'ไอติม',
    role: 'Project Manager',
    gender: 'female',
    roleCategory: 'management',
    bio: 'บริหารจัดการโครงการ ควบคุมระยะเวลาการดำเนินงาน และประสานงานทีมงานทุกฝ่าย',
    avatarSeed: 'Kunjira',
    photoUrl: 'https://drive.google.com/thumbnail?id=1oRWMY5LaEEgbePv8MbMNQ0-vUn_pW5gP&sz=w500',
    bgColor: 'from-amber-500/10 to-emerald-500/10',
    borderColor: 'border-amber-400/40',
    roleBadgeBg: 'bg-amber-100 border border-amber-300',
    roleBadgeText: 'text-amber-900',
  },
  {
    id: 2,
    studentId: '68040238',
    fullName: 'นางสาวธัญรดา ศรีมงคลภากุล',
    nickname: 'เลม่อน',
    role: 'Graphic',
    gender: 'female',
    roleCategory: 'design',
    bio: 'ออกแบบกราฟิกอัตลักษณ์ โลโก้ TipGROW สื่อภาพประกอบ และ UI/UX ประสบการณ์ผู้ใช้',
    avatarSeed: 'Thanrada',
    photoUrl: 'https://drive.google.com/thumbnail?id=1TfdGZEbbIUBp91cqcdUX3Jc6_IpIKUMd&sz=w500',
    bgColor: 'from-fuchsia-500/10 to-rose-500/10',
    borderColor: 'border-rose-400/40',
    roleBadgeBg: 'bg-rose-100 border border-rose-300',
    roleBadgeText: 'text-rose-900',
  },
  {
    id: 3,
    studentId: '68040284',
    fullName: 'นายนิติฉัตร เตชพิพิธมงคล',
    nickname: 'ภูผา',
    role: 'Programmer',
    gender: 'male',
    roleCategory: 'dev',
    bio: 'พัฒนาโปรแกรมคำนวณสูตรปุ๋ย N-P-K สั่งตัด ระบบฐานข้อมูล Firebase และการคำนวณแม่นยำ',
    avatarSeed: 'Nitichat',
    photoUrl: 'https://drive.google.com/thumbnail?id=1w-zmz1PGTP9r2g4TK2bDhHIve7bbja-S&sz=w500',
    bgColor: 'from-emerald-500/15 to-teal-500/15',
    borderColor: 'border-emerald-500/50',
    roleBadgeBg: 'bg-emerald-100 border border-emerald-300',
    roleBadgeText: 'text-emerald-900',
  },
  {
    id: 4,
    studentId: '68040298',
    fullName: 'นางสาวเบญญาภา นาคเนียม',
    nickname: 'เมย์',
    role: 'Slide Report',
    gender: 'female',
    roleCategory: 'report',
    bio: 'เรียบเรียงข้อมูลวิชาการ จัดทำรายงานผลการวิเคราะห์ และจัดทำสื่อนำเสนอสไลด์โครงการ',
    avatarSeed: 'Benyapha',
    photoUrl: 'https://drive.google.com/thumbnail?id=1uqaJOInq8JOP4fBULtOrjoS75Dls34OO&sz=w500',
    bgColor: 'from-sky-500/10 to-indigo-500/10',
    borderColor: 'border-sky-400/40',
    roleBadgeBg: 'bg-sky-100 border border-sky-300',
    roleBadgeText: 'text-sky-900',
  },
  {
    id: 5,
    studentId: '68040355',
    fullName: 'นายพันธวัฒน์ สกนธวัฒน์',
    nickname: 'น้องโอ๊ต',
    role: 'Slide Report',
    gender: 'male',
    roleCategory: 'report',
    bio: 'รวบรวมข้อมูลธาตุอาหารพืช ตรวจสอบความถูกต้องทางวิชาการ และจัดทำเอกสารรายงานนำเสนอ',
    avatarSeed: 'Panthawat',
    photoUrl: 'https://drive.google.com/thumbnail?id=1n8r5m2SgSDrb7PgtdI7vYwx0s_aImuPC&sz=w500',
    bgColor: 'from-teal-500/10 to-cyan-500/10',
    borderColor: 'border-teal-400/40',
    roleBadgeBg: 'bg-teal-100 border border-teal-300',
    roleBadgeText: 'text-teal-900',
  },
  {
    id: 6,
    studentId: '68040395',
    fullName: 'นายภูมิพัฒน์ นาคบุรี',
    nickname: 'ภูมิ',
    role: 'Programmer',
    gender: 'male',
    roleCategory: 'dev',
    bio: 'พัฒนาระบบสถาปัตยกรรมเว็บ Frontend อัลกอริทึมตัดสูตรแม่ปุ๋ย และฟังก์ชันส่งออก PDF',
    avatarSeed: 'Bhumipat',
    photoUrl: 'https://drive.google.com/thumbnail?id=1bTLvHWJL1rvq5lQJjJO5fTB2U2snxOb5&sz=w500',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/40',
    roleBadgeBg: 'bg-blue-100 border border-blue-300',
    roleBadgeText: 'text-blue-900',
  },
  {
    id: 7,
    studentId: '68040414',
    fullName: 'นายยศพัทธ์ เวทางค์ยะมาตร',
    nickname: 'อัส',
    role: 'Programmer',
    gender: 'male',
    roleCategory: 'dev',
    bio: 'พัฒนาและทดสอบระบบจำลองแปลงเกษตร การจัดเก็บประวัติข้อมูล และความเสถียรของแอปพลิเคชัน',
    avatarSeed: 'Yossapat',
    photoUrl: 'https://drive.google.com/thumbnail?id=1Nof-7KvKKTMiesh2KZz70KX4qu4r1V32&sz=w500',
    bgColor: 'from-indigo-500/10 to-purple-500/10',
    borderColor: 'border-indigo-400/40',
    roleBadgeBg: 'bg-indigo-100 border border-indigo-300',
    roleBadgeText: 'text-indigo-900',
  },
];

interface TeamPageProps {
  onGoHome: () => void;
  onStartCalculation: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onGoHome, onStartCalculation }) => {
  const [customPhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('tipgrow_team_custom_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const renderAvatar = (member: TeamMember) => {
    const photoSrc = member.photoUrl || customPhotos[member.studentId];
    if (photoSrc) {
      return (
        <img
          src={photoSrc}
          alt={member.fullName}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      );
    }

    if (member.gender === 'female') {
      return (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-200 via-amber-100 to-emerald-100 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id={`hair-${member.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d2314" />
                <stop offset="100%" stopColor="#1a0f08" />
              </linearGradient>
              <linearGradient id={`shirt-${member.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={member.roleCategory === 'management' ? '#d97706' : member.roleCategory === 'design' ? '#db2777' : '#0284c7'} />
                <stop offset="100%" stopColor={member.roleCategory === 'management' ? '#b45309' : member.roleCategory === 'design' ? '#be185d' : '#0369a1'} />
              </linearGradient>
            </defs>
            <path d="M 24 50 Q 20 70 30 85 Q 50 90 70 85 Q 80 70 76 50 Z" fill={`url(#hair-${member.id})`} />
            <path d="M 44 65 L 56 65 L 56 75 L 44 75 Z" fill="#ffd8b3" />
            <path d="M 28 82 Q 50 72 72 82 L 78 100 L 22 100 Z" fill={`url(#shirt-${member.id})`} />
            <ellipse cx="50" cy="50" rx="20" ry="24" fill="#ffe4cb" />
            <path d="M 27 45 Q 50 25 73 45 Q 65 30 50 30 Q 35 30 27 45 Z" fill={`url(#hair-${member.id})`} />
            <ellipse cx="32" cy="48" rx="5" ry="10" fill={`url(#hair-${member.id})`} />
            <ellipse cx="68" cy="48" rx="5" ry="10" fill={`url(#hair-${member.id})`} />
            <ellipse cx="43" cy="50" rx="2.5" ry="3.5" fill="#2d170b" />
            <ellipse cx="57" cy="50" rx="2.5" ry="3.5" fill="#2d170b" />
            <circle cx="44" cy="49" r="0.9" fill="#ffffff" />
            <circle cx="58" cy="49" r="0.9" fill="#ffffff" />
            <path d="M 39 44 Q 43 42 47 44" stroke="#3d2314" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 53 44 Q 57 42 61 44" stroke="#3d2314" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 46 60 Q 50 64 54 60" stroke="#d9534f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <circle cx="39" cy="56" r="3" fill="#ffb4a2" opacity="0.6" />
            <circle cx="61" cy="56" r="3" fill="#ffb4a2" opacity="0.6" />
            {member.id === 2 && (
              <g stroke="#9d174d" strokeWidth="1.2" fill="none">
                <circle cx="43" cy="50" r="6" />
                <circle cx="57" cy="50" r="6" />
                <path d="M 49 50 L 51 50" />
              </g>
            )}
          </svg>
        </div>
      );
    }

    return (
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-200 via-teal-100 to-sky-100 flex items-center justify-center relative overflow-hidden shadow-inner">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`hair-m-${member.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c1a0e" />
              <stop offset="100%" stopColor="#140b06" />
            </linearGradient>
            <linearGradient id={`shirt-m-${member.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={member.roleCategory === 'dev' ? '#059669' : '#0d9488'} />
              <stop offset="100%" stopColor={member.roleCategory === 'dev' ? '#047857' : '#115e59'} />
            </linearGradient>
          </defs>
          <path d="M 43 64 L 57 64 L 57 76 L 43 76 Z" fill="#ffd8b3" />
          <path d="M 26 80 Q 50 70 74 80 L 80 100 L 20 100 Z" fill={`url(#shirt-m-${member.id})`} />
          <path d="M 44 76 L 50 84 L 56 76" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <ellipse cx="50" cy="50" rx="21" ry="24" fill="#ffe4cb" />
          <path d="M 27 42 Q 28 26 50 26 Q 72 26 73 42 Q 62 34 50 34 Q 36 34 27 42 Z" fill={`url(#hair-m-${member.id})`} />
          <path d="M 27 40 L 29 48 L 33 44 Z" fill={`url(#hair-m-${member.id})`} />
          <path d="M 73 40 L 71 48 L 67 44 Z" fill={`url(#hair-m-${member.id})`} />
          <ellipse cx="28" cy="51" rx="3.5" ry="5" fill="#ffd8b3" />
          <ellipse cx="72" cy="51" rx="3.5" ry="5" fill="#ffd8b3" />
          <ellipse cx="42" cy="49" rx="2.5" ry="3" fill="#2d170b" />
          <ellipse cx="58" cy="49" rx="2.5" ry="3" fill="#2d170b" />
          <circle cx="43" cy="48" r="0.8" fill="#ffffff" />
          <circle cx="59" cy="48" r="0.8" fill="#ffffff" />
          <path d="M 37 43 Q 42 41 47 43" stroke="#2c1a0e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 53 43 Q 58 41 63 43" stroke="#2c1a0e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 45 59 Q 50 63 55 59" stroke="#b45309" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {(member.id === 3 || member.id === 6) && (
            <g stroke="#0f172a" strokeWidth="1.4" fill="none">
              <rect x="36" y="44" width="12" height="10" rx="2" />
              <rect x="52" y="44" width="12" height="10" rx="2" />
              <path d="M 48 48 L 52 48" />
              <path d="M 36 48 L 30 46" />
              <path d="M 64 48 L 70 46" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-10 shadow-lg mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-3 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>NoCodeNoLife Group • คณะผู้จัดทำโครงการ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
              ผู้จัดทำโครงการ TipGROW
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-light">
              ระบบคำนวณสูตรปุ๋ยเฉพาะแปลงและจัดการแปลงเกษตรอัจฉริยะแม่นยำสูง (Smart Fertilizer Precision Management)
              พัฒนาโดยคณะผู้จัดทำทั้ง 7 คน
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onGoHome}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>กลับสู่หน้าแรก</span>
            </button>
            <button
              onClick={onStartCalculation}
              className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>ทดลองคำนวณปุ๋ย</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {INITIAL_MEMBERS.map((member, index) => {
            return (
              <div
                key={member.studentId}
                className={`bg-white rounded-3xl p-6 border ${member.borderColor} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group hover:-translate-y-1`}
              >
                <div className="absolute top-4 right-4 text-xs font-black text-stone-400 bg-stone-100 rounded-full w-6 h-6 flex items-center justify-center">
                  #{index + 1}
                </div>

                <div>
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 ring-4 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-300 shadow-sm bg-white">
                      {renderAvatar(member)}
                    </div>
                  </div>

                  <div className="flex justify-center mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-bold tracking-wide border border-stone-200">
                      <span className="material-symbols-outlined text-[14px] text-stone-500">badge</span>
                      <span>รหัส: {member.studentId}</span>
                    </span>
                  </div>

                  <div className="text-center mb-1">
                    <h3 className="text-lg font-black text-emerald-950 tracking-tight">
                      {member.fullName}
                    </h3>
                  </div>

                  <div className="text-center mb-2.5">
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      ({member.nickname})
                    </span>
                  </div>

                  <div className="text-center mb-2">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs ${member.roleBadgeBg} ${member.roleBadgeText}`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};