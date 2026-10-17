import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

interface HistoryRecord {
  id: string;
  userId: string;
  userEmail?: string;
  plotName: string;
  cropId: string;
  cropName: string;
  growthStage: string;
  areaRai: number;
  areaNgan: number;
  areaWah: number;
  totalSquareMeters: number;
  treeCount: number;
  soilTexture: string;
  soilPh: number;
  soilN: number;
  soilP: number;
  soilK: number;
  commercialFormula: string;
  commercialBags: number;
  commercialRatePerTree: string;
  customUreaKg: number;
  customDapKg: number;
  customPotashKg: number;
  totalCustomKg: number;
  estimatedCost: number;
  customCost: number;
  savingsPercent: number;
  createdAt: string;
}

interface HistoryViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onNewCalculation: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentUser,
  onOpenAuth,
  onNewCalculation,
}) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setRecords([]);
      return;
    }

    setLoading(true);
    const path = 'fertilizerCalculations';
    try {
      // Query documents where userId matches current user
      const q = query(
        collection(db, path),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs: HistoryRecord[] = [];
          snapshot.forEach((d) => {
            docs.push({ id: d.id, ...d.data() } as HistoryRecord);
          });
          // Sort by createdAt descending
          docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setRecords(docs);
          setLoading(false);
        },
        (error) => {
          console.error('Snapshot error:', error);
          setLoading(false);
          try {
            handleFirestoreError(error, OperationType.LIST, path);
          } catch (e) {
            // Keep local state safe
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Query setup error:', err);
      setLoading(false);
    }
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบประวัติการคำนวณแปลงนี้หรือไม่?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'fertilizerCalculations', id));
    } catch (error) {
      console.error('Delete error:', error);
      handleFirestoreError(error, OperationType.DELETE, `fertilizerCalculations/${id}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRecords = records.filter(r => {
    if (cropFilter === 'all') return true;
    return r.cropId === cropFilter;
  });

  if (!currentUser) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          เข้าสู่ระบบเพื่อดูประวัติแปลงของคุณ
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          บันทึกและซิงค์ข้อมูลสูตรปุ๋ยของคุณบนคลาวด์ Firebase ปลอดภัย เข้าถึงได้ทุกที่
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          เข้าสู่ระบบด้วย Gmail
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 pt-4 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-emerald-950">
            ประวัติการคำนวณสูตรปุ๋ย
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            บันทึกแปลงของคุณทั้งหมดใน Firebase Project Wepapp Fertilizer ({currentUser.email})
          </p>
        </div>

        <button
          onClick={onNewCalculation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>คำนวณแปลงใหม่</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setCropFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            cropFilter === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          ทั้งหมด ({records.length})
        </button>
        {['durian', 'rubber', 'coconut', 'mangosteen', 'rambutan', 'longkong', 'banana', 'pineapple'].map((cId) => {
          const names: Record<string, string> = {
            durian: 'ทุเรียน',
            rubber: 'ยางพารา',
            coconut: 'มะพร้าว',
            mangosteen: 'มังคุด',
            rambutan: 'เงาะ',
            longkong: 'ลองกอง',
            banana: 'กล้วย',
            pineapple: 'สับปะรด',
          };
          const count = records.filter(r => r.cropId === cId).length;
          if (count === 0) return null;
          return (
            <button
              key={cId}
              onClick={() => setCropFilter(cId)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                cropFilter === cId
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {names[cId]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500">
          <span className="material-symbols-outlined text-[36px] animate-spin text-emerald-700">sync</span>
          <p className="text-xs mt-2">กำลังโหลดประวัติจาก Firebase...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 max-w-lg mx-auto">
          <span className="text-4xl block mb-2">🌱</span>
          <h3 className="text-base font-bold text-stone-800 mb-1">ยังไม่มีประวัติการคำนวณ</h3>
          <p className="text-xs text-stone-500 mb-5">
            เริ่มต้นคำนวณสูตรปุ๋ยเฉพาะแปลงพืชเศรษฐกิจของคุณ และกด "บันทึกแปลงนี้" ได้ทันที
          </p>
          <button
            onClick={onNewCalculation}
            className="px-5 py-2 rounded-full bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer"
          >
            เริ่มคำนวณเลย
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                      {item.cropName}
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 mt-1 truncate">
                      {item.plotName}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="ลบรายการนี้"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {deletingId === item.id ? 'sync' : 'delete'}
                    </span>
                  </button>
                </div>

                <div className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 text-xs mb-3 border border-stone-200/60">
                  <div className="flex justify-between">
                    <span className="text-stone-500">ระยะ:</span>
                    <span className="font-semibold text-stone-800 truncate max-w-[150px]">{item.growthStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">พื้นที่ / จำนวนต้น:</span>
                    <span className="font-semibold text-stone-800">{item.areaRai} ไร่ ({item.treeCount} ต้น)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">ดิน pH:</span>
                    <span className="font-semibold text-stone-800">{item.soilPh} (N:{item.soilN} P:{item.soilP} K:{item.soilK})</span>
                  </div>
                </div>

                {/* Prescription Highlights */}
                <div className="border-t border-stone-100 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-600 font-medium">สูตรสำเร็จ:</span>
                    <span className="font-bold text-emerald-900">{item.commercialFormula} ({item.commercialBags} กระสอบ)</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-600 font-medium">ปุ๋ยสั่งตัดเดี่ยว:</span>
                    <span className="font-bold text-emerald-700">{item.totalCustomKg} กก. (ประหยัด {item.savingsPercent}%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">ค่าปุ๋ยประมาณการ:</span>
                <span className="text-base font-black text-emerald-950">
                  ฿{(item.customCost || item.estimatedCost || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
