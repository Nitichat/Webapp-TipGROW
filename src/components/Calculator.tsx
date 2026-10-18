import React, { useState, useMemo } from 'react';
import { CROPS, CropInfo, SoilAssessment, calculateFertilizer, CalculationResult } from '../data/agronomy.ts';
import { CropBadgeImage } from './CropIcons.tsx';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface CalculatorProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenReport: (result: CalculationResult) => void;
  onOpenKnowledge: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currentUser,
  onOpenAuth,
  onOpenReport,
  onOpenKnowledge,
}) => {
  // Crop & Stage Selection
  const [selectedCropId, setSelectedCropId] = useState<string>('durian');
  const selectedCrop = useMemo(() => CROPS.find(c => c.id === selectedCropId) || CROPS[0], [selectedCropId]);
  
  const [selectedStageId, setSelectedStageId] = useState<string>('stage2');

  // Field Dimensions
  const [plotName, setPlotName] = useState<string>('แปลงทุเรียนจันทบุรี');
  const [areaRai, setAreaRai] = useState<number>(5);
  const [areaNgan, setAreaNgan] = useState<number>(0);
  const [areaWah, setAreaWah] = useState<number>(0);

  // Soil Analysis
  const [soilTexture, setSoilTexture] = useState<'clay' | 'sandy_loam' | 'sandy'>('sandy_loam');
  const [soilPh, setSoilPh] = useState<number>(6.2);
  const [soilN, setSoilN] = useState<number>(15);
  const [soilP, setSoilP] = useState<number>(28);
  const [soilK, setSoilK] = useState<number>(45);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Calculated Result
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateFertilizer(
      selectedCropId,
      selectedStageId,
      areaRai,
      areaNgan,
      areaWah,
      {
        texture: soilTexture,
        ph: soilPh,
        n_ppm: soilN,
        p_ppm: soilP,
        k_ppm: soilK,
      }
    );
  }, [selectedCropId, selectedStageId, areaRai, areaNgan, areaWah, soilTexture, soilPh, soilN, soilP, soilK]);

  // Handle Crop Change
  const handleSelectCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    const newCrop = CROPS.find(c => c.id === cropId);
    if (newCrop && newCrop.stages.length > 0) {
      setSelectedStageId(newCrop.stages[1]?.id || newCrop.stages[0].id);
      setPlotName(`แปลง${newCrop.nameTh}พัฒนา`);
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    setSelectedCropId('durian');
    setSelectedStageId('stage2');
    setAreaRai(5);
    setAreaNgan(0);
    setAreaWah(0);
    setSoilTexture('sandy_loam');
    setSoilPh(6.2);
    setSoilN(15);
    setSoilP(28);
    setSoilK(45);
    setPlotName('แปลงทุเรียนจันทบุรี');
  };

  // Quick Preset Loader (e.g. Chantaburi Durian Orchard)
  const handleLoadPresetChantaburi = () => {
    setSelectedCropId('durian');
    setSelectedStageId('stage2');
    setAreaRai(5);
    setAreaNgan(0);
    setAreaWah(0);
    setSoilTexture('sandy_loam');
    setSoilPh(6.2);
    setSoilN(15);
    setSoilP(28);
    setSoilK(45);
    setPlotName('แปลงทุเรียนจันทบุรี (หมอนทอง)');
  };

  // Save to Firebase Firestore
  const handleSaveToFirebase = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsSaving(true);
    setSaveSuccessMessage(null);

    const docData = {
      userId: currentUser.uid,
      userEmail: currentUser.email || 'Nitichat38937@gmail.com',
      plotName: plotName.trim() || `แปลง${selectedCrop.nameTh}`,
      cropId: selectedCrop.id,
      cropName: selectedCrop.nameTh,
      growthStage: calculationResult.stage.name,
      areaRai: areaRai,
      areaNgan: areaNgan,
      areaWah: areaWah,
      totalSquareMeters: calculationResult.totalSqMeters,
      treeCount: calculationResult.totalTrees,
      soilTexture: soilTexture,
      soilPh: soilPh,
      soilN: soilN,
      soilP: soilP,
      soilK: soilK,
      commercialFormula: calculationResult.commercialFormula,
      commercialBags: calculationResult.commercialBags,
      commercialRatePerTree: calculationResult.commercialRateText,
      customUreaKg: calculationResult.customUreaKg,
      customDapKg: calculationResult.customDapKg,
      customPotashKg: calculationResult.customPotashKg,
      totalCustomKg: calculationResult.customTotalKg,
      estimatedCost: calculationResult.commercialCost,
      customCost: calculationResult.customCost,
      savingsPercent: calculationResult.savingsPercent,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'fertilizerCalculations'), docData);
      setSaveSuccessMessage('บันทึกข้อมูลแปลงลง Firebase เรียบร้อยแล้ว!');
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } catch (error) {
      console.error('Error saving calculation to Firestore:', error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'fertilizerCalculations');
      } catch (e: any) {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (e?.message || 'โปรดตรวจสอบการเชื่อมต่อ'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 pt-2 pb-16">
      
      {/* Status & Diagnostic Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>TipGROW Soil Diagnostic System • อัลกอริทึมปุ๋ยแม่นยำรายแปลง</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mt-1">
            คำนวณสูตรปุ๋ยเฉพาะแปลงพืชเศรษฐกิจ
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            ประเมินความต้องการธาตุอาหาร N-P-K จากผลวิเคราะห์ดินจริง ลดต้นทุนปุ๋ย เพิ่มผลผลิตอย่างยั่งยืน
          </p>
        </div>

        {/* Quick Action Preset Pills */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleLoadPresetChantaburi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 text-xs font-bold transition-all shadow-2xs border border-emerald-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>โหลดประวัติล่าสุด (แปลงทุเรียนจันทบุรี)</span>
          </button>
          <button
            onClick={onOpenKnowledge}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-800 flex items-center justify-center transition-all cursor-pointer"
            title="คู่มือวิชาการ"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">check_circle</span>
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-emerald-700 text-xs">เก็บใน Firebase Project Wepapp Fertilizer</span>
        </div>
      )}

      {/* Main Workspace Split: 7 Cols Left (Input Form), 5 Cols Right (Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: INPUT FORM & SOIL DIAGNOSTIC (7 COLS) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 1: CROP SELECTOR (8 Crops Grid) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">psychiatry</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">1. เลือกชนิดพืชเศรษฐกิจ</h2>
                  <p className="text-xs text-stone-500">เจาะจงความต้องการตามสรีรวิทยาของพืชแต่ละกลุ่ม</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                <img
                  src={selectedCrop.avatarUrl}
                  alt={selectedCrop.nameTh}
                  className="w-5 h-5 rounded-full object-cover shadow-2xs border border-emerald-300"
                  referrerPolicy="no-referrer"
                />
                <span>เลือกแล้ว: {selectedCrop.nameTh} ({selectedCrop.nameEn})</span>
              </span>
            </div>

            {/* 8 Crops Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CROPS.map((crop) => {
                const isSelected = crop.id === selectedCropId;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => handleSelectCrop(crop.id)}
                    className={`relative flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-700 shadow-xs scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    )}

                    <div className="mb-1.5">
                      <CropBadgeImage
                        cropId={crop.id}
                        name={crop.nameTh}
                        emoji={crop.emoji}
                        isSelected={isSelected}
                      />
                    </div>
                    <span className="text-sm font-bold block">{crop.nameTh}</span>
                    <span className="text-[11px] text-stone-500 truncate max-w-full">
                      {crop.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: GROWTH STAGE & FIELD DIMENSIONS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">2. ระยะการเจริญเติบโต & ขนาดแปลง</h2>
                  <p className="text-xs text-stone-500">กำหนดอัตราปุ๋ยตามความต้องการระยะสรีรวิทยาและจำนวนต้น</p>
                </div>
              </div>
              <input
                type="text"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="ชื่อแปลง เช่น แปลงทุเรียนจันทบุรี"
                className="hidden sm:block text-xs font-semibold px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 max-w-[180px]"
              />
            </div>

            {/* Growth Stage Pills for selected crop */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                ระยะการเจริญเติบโตปัจจุบัน (Growth Phase):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCrop.stages.map((stg) => {
                  const isStageActive = stg.id === selectedStageId;
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setSelectedStageId(stg.id)}
                      className={`py-2.5 px-3 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center gap-2 border ${
                        isStageActive
                          ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] shrink-0">
                        {stg.icon}
                      </span>
                      <div className="truncate">
                        <div className="truncate">{stg.name}</div>
                        <div className={`text-[10px] truncate ${isStageActive ? 'text-emerald-100' : 'text-stone-400'}`}>
                          {stg.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area Size Inputs: Rai, Ngan, Tarang Wah */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ขนาดพื้นที่ (ไร่)
                </label>
                <div className="relative flex items-center bg-stone-50 rounded-xl px-3 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={areaRai}
                    onChange={(e) => setAreaRai(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent text-lg font-black text-emerald-900 focus:outline-none"
                  />
                  <span className="text-xs text-stone-500 font-semibold pl-2">ไร่</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  งาน
                </label>
                <div className="relative flex items-center bg-stone-50 rounded-xl px-3 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={areaNgan}
                    onChange={(e) => setAreaNgan(Math.min(3, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full bg-transparent text-lg font-black text-emerald-900 focus:outline-none"
                  />
                  <span className="text-xs text-stone-500 font-semibold pl-2">งาน</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ตารางวา
                </label>
                <div className="relative flex items-center bg-stone-50 rounded-xl px-3 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={areaWah}
                    onChange={(e) => setAreaWah(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full bg-transparent text-lg font-black text-emerald-900 focus:outline-none"
                  />
                  <span className="text-xs text-stone-500 font-semibold pl-2">ตร.ว.</span>
                </div>
              </div>
            </div>

            {/* Computed Field Summary Strip */}
            <div className="bg-emerald-50/70 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-stone-700 border border-emerald-200/50">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                  square_foot
                </span>
                <span className="text-xs">
                  พื้นที่รวม: <strong className="text-emerald-950 font-bold text-sm">{calculationResult.totalSqMeters.toLocaleString()}</strong> ตร.ม.
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                  forest
                </span>
                <span className="text-xs">
                  ประมาณ <strong className="text-emerald-950 font-bold text-sm">{calculationResult.totalTrees.toLocaleString()}</strong> ต้น
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                  check_circle
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  {selectedCrop.spacingDesc}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: SOIL TEST INPUTS (N-P-K & pH) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">science</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">3. ผลวิเคราะห์ตัวอย่างดินในแปลง</h2>
                  <p className="text-xs text-stone-500">ป้อนค่าจากใบรายงานห้องปฏิบัติการ หรือใช้ชุดตรวจดินพกพา (Soil Test Kit)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                ความแม่นยำสูง
              </span>
            </div>

            {/* Soil Texture Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                ลักษณะเนื้อดิน (Soil Texture):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSoilTexture('clay')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    soilTexture === 'clay'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {soilTexture === 'clay' && '✓ '}ดินเหนียว (Clay)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilTexture('sandy_loam')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    soilTexture === 'sandy_loam'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {soilTexture === 'sandy_loam' && '✓ '}ดินร่วนปนทราย (Sandy Loam)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilTexture('sandy')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    soilTexture === 'sandy'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {soilTexture === 'sandy' && '✓ '}ดินทราย (Sandy)
                </button>
              </div>
            </div>

            {/* Soil pH Interactive Slider */}
            <div className="bg-stone-50 rounded-2xl p-4 mb-5 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-stone-800">
                    ค่าความเป็นกรด-ด่างของดิน (Soil pH)
                  </span>
                  <span className="text-xs text-stone-500">(เป้าหมาย 6.0 - 6.5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-emerald-900">
                    {soilPh.toFixed(1)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    calculationResult.phStatus === 'เหมาะสมสมดุล'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {calculationResult.phStatus}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="4.0"
                max="8.5"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-800 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-stone-500 mt-1.5 font-medium">
                <span>4.0 (กรดจัด)</span>
                <span className="text-emerald-800 font-bold">6.0 - 6.5 (เหมาะสม)</span>
                <span>8.5 (ด่างจัด)</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-2 bg-white/70 p-2 rounded-lg border border-stone-200/50">
                💡 <span className="font-semibold">{calculationResult.phAdvice}</span>
              </p>
            </div>

            {/* Nutrients 3-Box Grid: N, P, K */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Nitrogen (N) */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800">ไนโตรเจน (N)</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    calculationResult.statusN === 'Low'
                      ? 'bg-rose-100 text-rose-800'
                      : calculationResult.statusN === 'Med'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {calculationResult.statusN === 'Low' ? 'ต่ำ (Low)' : calculationResult.statusN === 'Med' ? 'ปานกลาง (Med)' : 'สูง (High)'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={soilN}
                    onChange={(e) => setSoilN(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white border border-stone-300 text-lg font-bold text-emerald-900 rounded-lg px-2 py-1 text-center"
                  />
                  <span className="text-[11px] text-stone-500 font-medium">mg/kg (ppm)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  ความต้องการเพื่อสร้างความสมบูรณ์ของใบ
                </p>
              </div>

              {/* Phosphorus (P) */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800">ฟอสฟอรัส (P)</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    calculationResult.statusP === 'Low'
                      ? 'bg-rose-100 text-rose-800'
                      : calculationResult.statusP === 'Med'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {calculationResult.statusP === 'Low' ? 'ต่ำ (Low)' : calculationResult.statusP === 'Med' ? 'ปานกลาง (Med)' : 'สูง (High)'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={soilP}
                    onChange={(e) => setSoilP(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white border border-stone-300 text-lg font-bold text-emerald-900 rounded-lg px-2 py-1 text-center"
                  />
                  <span className="text-[11px] text-stone-500 font-medium">mg/kg (Bray II)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  อยู่ในเกณฑ์พอดี ไม่ตกค้างในดิน
                </p>
              </div>

              {/* Potassium (K) */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800">โพแทสเซียม (K)</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    calculationResult.statusK === 'Low'
                      ? 'bg-rose-100 text-rose-800'
                      : calculationResult.statusK === 'Med'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {calculationResult.statusK === 'Low' ? 'ต่ำ (Low)' : calculationResult.statusK === 'Med' ? 'ปานกลาง (Med)' : 'สูง (High)'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={soilK}
                    onChange={(e) => setSoilK(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white border border-stone-300 text-lg font-bold text-emerald-900 rounded-lg px-2 py-1 text-center"
                  />
                  <span className="text-[11px] text-stone-500 font-medium">mg/kg (NH4OAc)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  ต้องการเสริมด่วนเพื่อยืดช่อดอกและผล
                </p>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:flex-1 h-12 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>คำนวณสูตรปุ๋ยเฉพาะแปลง (Calculate)</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 h-12 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                รีเซ็ตค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: RESULTS & SMART PRESCRIPTION DASHBOARD (5 COLS) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* TOP SUMMARY CARD: High Impact Match Badge (Dark Green as in Image 3) */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-950 text-[11px] font-black tracking-wider uppercase">
                ผลการวิเคราะห์แม่นยำ {calculationResult.matchPercent}% MATCH
              </span>
              <span className="text-[11px] text-emerald-200/80">อัปเดต: วันนี้</span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={selectedCrop.avatarUrl}
                alt={selectedCrop.nameTh}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-sm border border-emerald-400/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedCrop.nameTh} • {calculationResult.stage.name.replace(/^[^\s]+\s*/, '')}
                </h3>
                <p className="text-xs text-emerald-100/90 mt-1">
                  พื้นที่ {calculationResult.totalRai.toFixed(1)} ไร่ (ประมาณ {calculationResult.totalTrees.toLocaleString()} ต้น) • แนะนำเสริมฟอสฟอรัส-โพแทสเซียมเข้มข้น
                </p>
              </div>
            </div>

            {/* Cost & Quantity Highlight Strip */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-emerald-700/60">
              <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-3 border border-emerald-700/40">
                <span className="block text-[11px] text-emerald-200 font-medium">ประมาณการค่าปุ๋ยรวม</span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ฿{calculationResult.commercialCost.toLocaleString()}
                </span>
                <span className="block text-[10px] text-emerald-300">
                  ≈ {calculationResult.totalTrees > 0 ? Math.round(calculationResult.commercialCost / calculationResult.totalTrees) : 0} บาท/ต้น
                </span>
              </div>

              <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-3 border border-emerald-700/40">
                <span className="block text-[11px] text-emerald-200 font-medium">ประหยัดเทียบปุ๋ยสำเร็จ</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                  -{calculationResult.savingsPercent}%
                </span>
                <span className="block text-[10px] text-emerald-300">
                  เซฟ ฿{calculationResult.savingsAmount.toLocaleString()} ต่อรอบ
                </span>
              </div>
            </div>
          </div>

          {/* NUTRIENT BALANCE COMPARISON CHART */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-base font-bold text-emerald-950">สมดุลธาตุอาหารในแปลง</h4>
                <p className="text-xs text-stone-500">ระดับปัจจุบันในดิน vs ปริมาณเป้าหมายที่ต้องการ</p>
              </div>
              <span className="material-symbols-outlined text-emerald-700 text-[22px]">bar_chart</span>
            </div>

            <div className="space-y-4 py-1">
              {/* N Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-stone-800">N - ไนโตรเจน (กก./ไร่)</span>
                  <span className="text-stone-500">
                    ขาดอีก <strong className="text-rose-600">{calculationResult.deficitN} กก.</strong> (ต้องการ {calculationResult.targetN} / ดินมี {calculationResult.soilSupplyN})
                  </span>
                </div>
                <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-800 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.soilSupplyN / calculationResult.targetN) * 100)}%` }}
                    title={`ดินมี ${calculationResult.soilSupplyN} กก.`}
                  ></div>
                  <div
                    className="bg-emerald-300 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.deficitN / calculationResult.targetN) * 100)}%` }}
                    title={`ขาดอีก ${calculationResult.deficitN} กก.`}
                  ></div>
                </div>
              </div>

              {/* P Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-stone-800">P - ฟอสฟอรัส (กก./ไร่)</span>
                  <span className="text-stone-500">
                    ขาดอีก <strong className="text-emerald-700">{calculationResult.deficitP} กก.</strong> (ต้องการ {calculationResult.targetP} / ดินมี {calculationResult.soilSupplyP})
                  </span>
                </div>
                <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-800 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.soilSupplyP / calculationResult.targetP) * 100)}%` }}
                  ></div>
                  <div
                    className="bg-emerald-300 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.deficitP / calculationResult.targetP) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* K Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-stone-800">K - โพแทสเซียม (กก./ไร่)</span>
                  <span className="text-stone-500">
                    ขาดอีก <strong className="text-rose-600">{calculationResult.deficitK} กก.</strong> (ต้องการ {calculationResult.targetK} / ดินมี {calculationResult.soilSupplyK})
                  </span>
                </div>
                <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-800 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.soilSupplyK / calculationResult.targetK) * 100)}%` }}
                  ></div>
                  <div
                    className="bg-emerald-300 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calculationResult.deficitK / calculationResult.targetK) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-2 text-stone-600 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-800"></span>
                  <span>ธาตุอาหารสะสมในดินเดิม</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-300"></span>
                  <span>ปริมาณปุ๋ยต้องเติมเพิ่ม</span>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDED FERTILIZER FORMULAS (2 OPTIONS) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-emerald-950">สูตรปุ๋ยที่แนะนำ</h4>
                <p className="text-xs text-stone-500">เลือกตามความสะดวกในการใช้งานหรือต้นทุน</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                2 ทางเลือก
              </span>
            </div>

            {/* Option 1: Commercial Ready Mix */}
            <div className="rounded-2xl p-4 bg-stone-50 border border-stone-200">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-white text-[10px] font-bold">
                    ทางเลือกที่ 1 • ปุ๋ยผสมสูตรสำเร็จรูป
                  </span>
                  <h5 className="text-lg font-black text-emerald-950 mt-1">
                    สูตร {calculationResult.commercialFormula}
                  </h5>
                  <p className="text-xs text-stone-600">
                    {calculationResult.stage.desc}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-emerald-950">
                    {calculationResult.commercialBags} กระสอบ
                  </span>
                  <span className="block text-[11px] text-stone-500">
                    ({calculationResult.commercialKg} กก.)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2.5 flex items-center justify-between text-xs border border-stone-200/60">
                <span className="text-stone-800 font-semibold">
                  อัตราใส่: {calculationResult.commercialRateText}
                </span>
                <span className="text-emerald-800 font-bold">หว่านรอบรัศมีทรงพุ่ม</span>
              </div>
            </div>

            {/* Option 2: Custom Tailored Single Salts */}
            <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                      ทางเลือกที่ 2 • ปุ๋ยสั่งตัด (ผสมเอง)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                      ประหยัดสุด
                    </span>
                  </div>
                  <h5 className="text-lg font-black text-emerald-950 mt-1">
                    สูตรแม่ปุ๋ยเดี่ยว 3 ชนิด
                  </h5>
                  <p className="text-xs text-stone-600">
                    ผสมเองตรงสัดส่วนความต้องการดินเป๊ะ
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-emerald-900">
                    {calculationResult.customTotalKg} กก.
                  </span>
                  <span className="block text-xs text-emerald-700 font-bold">
                    ฿{calculationResult.customCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 3 Ingredients Break-up */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-white rounded-xl p-2 text-center border border-emerald-100 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold">ยูเรีย 46-0-0</span>
                  <span className="text-sm font-black text-emerald-950">
                    {calculationResult.customUreaKg} กก.
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2 text-center border border-emerald-100 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold">DAP 18-46-0</span>
                  <span className="text-sm font-black text-emerald-950">
                    {calculationResult.customDapKg} กก.
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2 text-center border border-emerald-100 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold">0-0-60</span>
                  <span className="text-sm font-black text-emerald-950">
                    {calculationResult.customPotashKg} กก.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* APPLICATION TIMELINE (30 DAYS) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-emerald-950">ตารางรอบการให้ปุ๋ย (30 วัน)</h4>
                <p className="text-xs text-stone-500">ขั้นตอนการปฏิบัติการแปลง{selectedCrop.nameTh}</p>
              </div>
              <span className="material-symbols-outlined text-emerald-700 text-[20px]">calendar_today</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {calculationResult.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${step.badgeColor} flex items-center justify-center text-[10px] text-white font-bold`}>
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800">
                      {step.week}
                    </span>
                    <h6 className="text-xs font-bold text-stone-900 mt-0.5">
                      {step.title}
                    </h6>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORT & SAVE ACTIONS */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-200/80 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenReport(calculationResult)}
              className="w-full sm:flex-1 h-12 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>ส่งออกรายงาน PDF พร้อมตาราง</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToFirebase}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 h-12 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-emerald-200 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSaving ? 'sync' : 'bookmark_add'}
              </span>
              <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกแปลงนี้'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* BENEFIT & SCIENTIFIC CITATION BANNER */}
      <div className="mt-8 bg-emerald-50/70 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-200/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div>
            <h4 className="text-base font-bold text-emerald-950">มาตรฐานการคำนวณตามหลักวิชาการดินและพืช</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              อ้างอิงฐานข้อมูลความต้องการธาตุอาหารพืช กรมวิชาการเกษตร และสมาคมดินและปุ๋ยแห่งประเทศไทย
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-stone-500 font-medium">TipGROW Agronomic Engine v2.4</span>
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="px-4 py-2 rounded-full bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-800 hover:text-white transition-all shadow-xs border border-emerald-200 cursor-pointer"
          >
            ดูคู่มือวิชาการ
          </button>
        </div>
      </div>
    </div>
  );
};
