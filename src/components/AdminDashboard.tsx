import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { CROPS, CropInfo } from '../data/agronomy';
import { ADMIN_EMAIL } from './AdminAuthModal';

interface AdminDashboardProps {
  currentUser: User | null;
  onExitAdmin: () => void;
  onOpenReportModal?: (calc: any) => void;
}

interface CalculationRecord {
  id: string;
  userId?: string;
  farmerName?: string;
  email?: string;
  cropId: string;
  cropNameTh?: string;
  cropVariety?: string;
  plotName?: string;
  province?: string;
  soilAnalysisMethod?: string;
  plotAreaRai?: number;
  treesCount?: number;
  stageName?: string;
  targetN?: number;
  targetP?: number;
  targetK?: number;
  pureN?: number;
  pureP?: number;
  pureK?: number;
  urea46?: number;
  dap18?: number;
  mop0060?: number;
  totalCarrierWeight?: number;
  costCustom?: number;
  costCommercial?: number;
  savings?: number;
  formulaLabel?: string;
  calculatedAt?: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'crops' | 'overview'>('history');
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');

  // Selected Record for Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<CalculationRecord | null>(null);

  // Delete confirmation
  const [deleteCandidate, setDeleteCandidate] = useState<CalculationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selected crop in Crops tab
  const [inspectCropId, setInspectCropId] = useState<string>('durian');

  // Load all records from Firestore
  const fetchAllCalculations = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const q = query(
        collection(db, 'fertilizerCalculations'),
        orderBy('calculatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const docs: CalculationRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docs.push({
          id: docSnap.id,
          ...data,
        } as CalculationRecord);
      });
      setRecords(docs);
    } catch (err: any) {
      console.error('Error fetching all calculations:', err);
      // Fallback query if index is building or not available
      try {
        const snap = await getDocs(collection(db, 'fertilizerCalculations'));
        const docs: CalculationRecord[] = [];
        snap.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() } as CalculationRecord);
        });
        docs.sort((a, b) => {
          const tA = a.calculatedAt?.toMillis ? a.calculatedAt.toMillis() : 0;
          const tB = b.calculatedAt?.toMillis ? b.calculatedAt.toMillis() : 0;
          return tB - tA;
        });
        setRecords(docs);
      } catch (fallbackErr: any) {
        setErrorMsg('ไม่สามารถดึงข้อมูลประวัติทั้งหมดได้: ' + (fallbackErr.message || 'Permission denied'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCalculations();
  }, []);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesCrop = selectedCropFilter === 'all' || rec.cropId === selectedCropFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCrop;

      const matchesSearch =
        (rec.farmerName && rec.farmerName.toLowerCase().includes(q)) ||
        (rec.email && rec.email.toLowerCase().includes(q)) ||
        (rec.plotName && rec.plotName.toLowerCase().includes(q)) ||
        (rec.cropNameTh && rec.cropNameTh.toLowerCase().includes(q)) ||
        (rec.province && rec.province.toLowerCase().includes(q)) ||
        rec.id.toLowerCase().includes(q);

      return matchesCrop && matchesSearch;
    });
  }, [records, selectedCropFilter, searchQuery]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalCalculations = records.length;
    const totalArea = records.reduce((sum, r) => sum + (Number(r.plotAreaRai) || 0), 0);
    const totalSavings = records.reduce((sum, r) => sum + (Number(r.savings) || 0), 0);
    const uniqueUsers = new Set(records.map(r => r.userId || r.email || 'anon')).size;

    // Crop distribution
    const cropCounts: Record<string, number> = {};
    records.forEach(r => {
      const name = r.cropNameTh || r.cropId || 'ไม่ระบุ';
      cropCounts[name] = (cropCounts[name] || 0) + 1;
    });
    const topCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

    return {
      totalCalculations,
      totalArea,
      totalSavings,
      uniqueUsers,
      topCropName: topCrop[0],
      topCropCount: topCrop[1],
    };
  }, [records]);

  // Delete Action
  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'fertilizerCalculations', deleteCandidate.id));
      setRecords(prev => prev.filter(r => r.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการลบรายการ: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = [
      'ID',
      'วันที่คำนวณ',
      'เกษตรกร/ผู้บันทึก',
      'อีเมล/User ID',
      'ชื่อแปลง',
      'จังหวัด',
      'พืช',
      'ระยะการเจริญเติบโต',
      'ขนาดพื้นที่ (ไร่)',
      'จำนวนต้น',
      '46-0-0 (กก.)',
      '18-46-0 (กก.)',
      '0-0-60 (กก.)',
      'น้ำหนักแม่ปุ๋ยรวม (กก.)',
      'ต้นทุนปุ๋ยสั่งตัด (บาท)',
      'ต้นทุนปุ๋ยสำเร็จรูป (บาท)',
      'ประหยัดได้ (บาท)'
    ];

    const rows = filteredRecords.map(r => {
      const dateStr = r.calculatedAt?.toDate
        ? r.calculatedAt.toDate().toLocaleString('th-TH')
        : '-';
      return [
        `"${r.id}"`,
        `"${dateStr}"`,
        `"${r.farmerName || '-'}"`,
        `"${r.email || r.userId || '-'}"`,
        `"${r.plotName || '-'}"`,
        `"${r.province || '-'}"`,
        `"${r.cropNameTh || r.cropId}"`,
        `"${r.stageName || '-'}"`,
        r.plotAreaRai ?? 0,
        r.treesCount ?? 0,
        r.urea46 ?? 0,
        r.dap18 ?? 0,
        r.mop0060 ?? 0,
        r.totalCarrierWeight ?? 0,
        r.costCustom ?? 0,
        r.costCommercial ?? 0,
        r.savings ?? 0,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tipgrow_all_calculations_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const inspectedCrop = CROPS.find(c => c.id === inspectCropId) || CROPS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">โหมดผู้ดูแลระบบหลังบ้าน (Admin Console)</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">
                Authorized
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            เข้าสู่ระบบโดย <span className="font-mono text-emerald-400 font-semibold">{currentUser?.email || ADMIN_EMAIL}</span> — จัดการคลังพืช สูตรปุ๋ย และสืบค้นประวัติการคำนวณทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchAllCalculations}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1.5"
            title="รีเฟรชข้อมูล"
          >
            <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>sync</span>
            รีเฟรช
          </button>
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>การคำนวณทั้งหมด</span>
            <span className="material-symbols-outlined text-base text-slate-400">analytics</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats.totalCalculations.toLocaleString()} <span className="text-xs font-normal text-slate-500">ครั้ง</span>
          </div>
          <div className="text-[11px] text-slate-500">
            จากผู้ใช้งาน {stats.uniqueUsers} บัญชี
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>พื้นที่แปลงสะสม</span>
            <span className="material-symbols-outlined text-base text-slate-400">landscape</span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {stats.totalArea.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-slate-500">ไร่</span>
          </div>
          <div className="text-[11px] text-slate-500">
            แปลงเกษตรที่บันทึกในระบบ
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ประหยัดต้นทุนปุ๋ยรวม</span>
            <span className="material-symbols-outlined text-base text-slate-400">payments</span>
          </div>
          <div className="text-2xl font-bold text-teal-700 tabular-nums">
            ฿{stats.totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-teal-600">
            เปรียบเทียบปุ๋ยสั่งตัด vs สำเร็จรูป
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>พืชยอดนิยมอันดับ 1</span>
            <span className="material-symbols-outlined text-base text-slate-400">eco</span>
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {stats.topCropName}
          </div>
          <div className="text-[11px] text-slate-500 tabular-nums">
            คำนวณ {stats.topCropCount} ครั้ง ({stats.totalCalculations > 0 ? ((stats.topCropCount / stats.totalCalculations) * 100).toFixed(0) : 0}%)
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">manage_search</span>
          ประวัติการคำนวณทั้งหมด ({records.length})
        </button>

        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'crops'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">compost</span>
          คลังพืชและสูตรปุ๋ยมาตรฐาน ({CROPS.length})
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">donut_large</span>
          วิเคราะห์สถิติระบบ
        </button>
      </div>

      {/* Tab 1: All Users History Table */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเกษตรกร, แปลง, จังหวัด, พืช, อีเมล..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Crop Filter */}
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">ทุกชนิดพืช</option>
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.nameTh}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Action */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 tabular-nums">
                พบ {filteredRecords.length} รายการ
              </span>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                ส่งออก CSV
              </button>
            </div>
          </div>

          {/* Table State */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-500">กำลังดึงข้อมูลประวัติการคำนวณทั้งหมดจากฐานข้อมูล...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">error</span>
              </div>
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
              <button
                onClick={fetchAllCalculations}
                className="px-4 py-2 text-xs bg-slate-900 text-white rounded-xl"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-slate-300">folder_off</span>
              <p className="text-xs font-semibold text-slate-600">ไม่พบรายการคำนวณที่ตรงกับเงื่อนไข</p>
              <p className="text-[11px] text-slate-400">ลองเปลี่ยนคำค้นหาหรือตัวกรองพืช</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">วันที่คำนวณ</th>
                    <th className="py-3 px-4">ผู้บันทึก / แปลง</th>
                    <th className="py-3 px-4">พืชและระยะ</th>
                    <th className="py-3 px-4 text-right">พื้นที่ (ไร่)</th>
                    <th className="py-3 px-4">สูตรแม่ปุ๋ย (46 / 18 / 60)</th>
                    <th className="py-3 px-4 text-right">ประหยัดได้</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((rec) => {
                    const dateFormatted = rec.calculatedAt?.toDate
                      ? rec.calculatedAt.toDate().toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'ไม่ระบุวัน';

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {dateFormatted}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {rec.farmerName || 'เกษตรกรทั่วไป'}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>{rec.plotName || 'แปลงไม่ระบุชื่อ'}</span>
                            {rec.province && (
                              <>
                                <span>·</span>
                                <span>{rec.province}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                            <span>{rec.cropNameTh || rec.cropId}</span>
                            {rec.cropVariety && (
                              <span className="text-[11px] text-slate-500 font-normal">
                                ({rec.cropVariety})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {rec.stageName || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-800 tabular-nums">
                          {rec.plotAreaRai ?? 1}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-700 tabular-nums">
                          <div className="flex items-center gap-1.5">
                            <span className="text-blue-700 font-semibold">{rec.urea46 ?? 0}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-amber-700 font-semibold">{rec.dap18 ?? 0}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-emerald-700 font-semibold">{rec.mop0060 ?? 0}</span>
                            <span className="text-slate-400 text-[10px]">กก.</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-teal-700 tabular-nums">
                          ฿{Number(rec.savings || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedRecord(rec)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="ดูรายละเอียดการคำนวณ"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(rec)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="ลบรายการนี้"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Crops & Formulas Presets */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crop List Sidebar */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              พืชมาตรฐานในระบบ ({CROPS.length})
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {CROPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setInspectCropId(c.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all ${
                    inspectCropId === c.id
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{c.emoji}</span>
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">{c.nameTh}</div>
                      <div className={`text-[11px] truncate ${inspectCropId === c.id ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {c.variety}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] tabular-nums font-mono ${inspectCropId === c.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {c.stages.length} ระยะ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Inspected Crop Details & Formula Matrix */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{inspectedCrop.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{inspectedCrop.nameTh} ({inspectedCrop.nameEn})</h2>
                  <p className="text-xs text-slate-500">{inspectedCrop.spacingDesc} · {inspectedCrop.defaultTreesPerRai} ต้น/ไร่</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium">
                {inspectedCrop.variety}
              </span>
            </div>

            {/* Stages & N-P-K Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ตารางความต้องการธาตุอาหารในแต่ละระยะการเจริญเติบโต
              </h4>
              <div className="space-y-3">
                {inspectedCrop.stages.map((st, sIdx) => (
                  <div key={st.id || sIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-emerald-700">{st.icon || 'spa'}</span>
                        {st.name}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        สูตรเทียบเคียง: {st.commercialFormula}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{st.desc}</p>

                    {/* NPK Targets */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-200">
                        <div className="text-[10px] text-blue-700 font-bold uppercase">ไนโตรเจน (N)</div>
                        <div className="text-base font-bold text-blue-900 tabular-nums">{st.targetN} <span className="text-[10px] font-normal">กก./ไร่</span></div>
                      </div>
                      <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                        <div className="text-[10px] text-amber-700 font-bold uppercase">ฟอสฟอรัส (P₂O₅)</div>
                        <div className="text-base font-bold text-amber-900 tabular-nums">{st.targetP} <span className="text-[10px] font-normal">กก./ไร่</span></div>
                      </div>
                      <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                        <div className="text-[10px] text-emerald-700 font-bold uppercase">โพแทสเซียม (K₂O)</div>
                        <div className="text-base font-bold text-emerald-900 tabular-nums">{st.targetK} <span className="text-[10px] font-normal">กก./ไร่</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Formula Reference */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-700">science</span>
                แม่ปุ๋ยมาตรฐานสำหรับผสมปุ๋ยสั่งตัดในระบบ
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-slate-900 block">ยูเรีย (46-0-0)</span>
                  <span className="text-[11px] text-slate-500">ให้ N 46%</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-slate-900 block">แดป (18-46-0)</span>
                  <span className="text-[11px] text-slate-500">ให้ N 18%, P 46%</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-slate-900 block">โพแทสเซียมคลอไรด์ (0-0-60)</span>
                  <span className="text-[11px] text-slate-500">ให้ K 60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Analytics Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">สรุปภาพรวมและแนวโน้มการใช้งาน TipGROW Smart Ag</h3>
            <p className="text-xs text-slate-500">ข้อมูลรวบรวมจากประวัติการคำนวณทั้งหมดในระบบคลาวด์</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ประสิทธิภาพการประหยัดต้นทุน
              </h4>
              <div className="text-3xl font-bold text-teal-700 tabular-nums">
                ฿{stats.totalSavings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600">
                ผลประหยัดรวมจากการผสมแม่ปุ๋ยสั่งตัดแทนการซื้อปุ๋ยสำเร็จรูปในทุกแปลงเกษตรกร
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                พื้นที่แปลงเฉลี่ยต่อการคำนวณ
              </h4>
              <div className="text-3xl font-bold text-emerald-800 tabular-nums">
                {stats.totalCalculations > 0 ? (stats.totalArea / stats.totalCalculations).toFixed(1) : 0}{' '}
                <span className="text-base font-normal text-slate-500">ไร่ / แปลง</span>
              </div>
              <p className="text-xs text-slate-600">
                ขนาดแปลงเฉลี่ยของเกษตรกรที่ใช้โปรแกรม
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ความปลอดภัยและการเข้าถึง
              </h4>
              <div className="text-xs font-mono text-slate-800 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div><strong>Admin Email:</strong> {ADMIN_EMAIL}</div>
                <div><strong>DB ID:</strong> ai-studio-tipgrow</div>
                <div><strong>Security Rules:</strong> Role-based active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">รายละเอียดการคำนวณปุ๋ย</h3>
                <p className="text-[11px] text-slate-400 font-mono">ID: {selectedRecord.id}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">ผู้บันทึก:</span>
                  <span className="font-semibold text-slate-900">{selectedRecord.farmerName || 'เกษตรกร'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">แปลงปลูก:</span>
                  <span className="font-semibold text-slate-900">{selectedRecord.plotName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">พืชที่ปลูก:</span>
                  <span className="font-semibold text-emerald-800">{selectedRecord.cropNameTh || selectedRecord.cropId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">พื้นที่ / ต้น:</span>
                  <span className="font-semibold text-slate-900">{selectedRecord.plotAreaRai} ไร่ ({selectedRecord.treesCount} ต้น)</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="font-bold text-slate-800 block">สัดส่วนแม่ปุ๋ยที่ต้องใช้:</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <span className="text-[10px] text-blue-700 block font-bold">ยูเรีย (46-0-0)</span>
                    <span className="text-sm font-bold text-blue-900 tabular-nums">{selectedRecord.urea46 ?? 0} กก.</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <span className="text-[10px] text-amber-700 block font-bold">แดป (18-46-0)</span>
                    <span className="text-sm font-bold text-amber-900 tabular-nums">{selectedRecord.dap18 ?? 0} กก.</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="text-[10px] text-emerald-700 block font-bold">0-0-60</span>
                    <span className="text-sm font-bold text-emerald-900 tabular-nums">{selectedRecord.mop0060 ?? 0} กก.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl border border-teal-200">
                <span className="font-semibold text-teal-900">ประหยัดต้นทุนปุ๋ยได้:</span>
                <span className="text-base font-bold text-teal-800 tabular-nums">฿{Number(selectedRecord.savings || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ยืนยันการลบรายการประวัติ</h3>
              <p className="text-xs text-slate-500 mt-1">
                คุณแน่ใจหรือไม่ว่าต้องการลบรายการของ "{deleteCandidate.farmerName || 'เกษตรกร'}" (ID: {deleteCandidate.id.slice(0, 8)}...)? ข้อมูลจะถูกลบออกจากฐานข้อมูลอย่างถาวร
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl"
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
