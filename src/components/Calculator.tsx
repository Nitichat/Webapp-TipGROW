import React, { useState, useMemo, useEffect } from 'react';
import { 
  CROPS, 
  CropInfo, 
  SoilAssessment, 
  SoilTextureType, 
  SOIL_TYPES, 
  calculateFertilizer, 
  CalculationResult 
} from '../data/agronomy.ts';
import { CropBadgeImage } from './CropIcons.tsx';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface CalculatorProps {
  currentUser: User | null;
  initialCropId?: string;
  onOpenAuth: () => void;
  onOpenReport: (result: CalculationResult) => void;
  onOpenKnowledge: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currentUser,
  initialCropId,
  onOpenAuth,
  onOpenReport,
  onOpenKnowledge,
}) => {
  // 1. Crop & Growth Stage
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'durian');
  const selectedCrop = useMemo(() => CROPS.find(c => c.id === selectedCropId) || CROPS[0], [selectedCropId]);
  const [selectedStageId, setSelectedStageId] = useState<string>('stage2');

  useEffect(() => {
    if (initialCropId) {
      handleSelectCrop(initialCropId);
    }
  }, [initialCropId]);

  // 2. Planting Area (พื้นที่ปลูก)
  const [plotName, setPlotName] = useState<string>('แปลงทุเรียนจันทบุรี');
  const [areaRai, setAreaRai] = useState<number>(5);
  const [areaNgan, setAreaNgan] = useState<number>(0);
  const [areaWah, setAreaWah] = useState<number>(0);

  // 3. Spacing & Trees per Rai (ระยะห่างต่อต้น และ จำนวนต้นต่อไร่)
  const [rowSpacing, setRowSpacing] = useState<number>(8);
  const [treeSpacing, setTreeSpacing] = useState<number>(8);
  const [treesPerRai, setTreesPerRai] = useState<number>(25);

  // 4. Soil Type & Soil Analysis (ประเภทดิน และ การตรวจดิน)
  const [soilTexture, setSoilTexture] = useState<SoilTextureType>('loam');
  const [soilPh, setSoilPh] = useState<number>(6.2);
  const [soilN, setSoilN] = useState<number>(15);
  const [soilP, setSoilP] = useState<number>(28);
  const [soilK, setSoilK] = useState<number>(45);
  const [showAdvancedSoil, setShowAdvancedSoil] = useState<boolean>(false);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Sync spacing defaults when crop changes
  const handleSelectCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    const newCrop = CROPS.find(c => c.id === cropId);
    if (!newCrop) return;

    if (newCrop.stages.length > 0) {
      setSelectedStageId(newCrop.stages[1]?.id || newCrop.stages[0].id);
      setPlotName(`แปลง${newCrop.nameTh}พัฒนา`);
    }

    // Default spacing presets per crop
    let defaultRow = 8;
    let defaultTree = 8;
    let defaultTrees = newCrop.defaultTreesPerRai;

    if (cropId === 'durian') {
      defaultRow = 8; defaultTree = 8; defaultTrees = 25;
    } else if (cropId === 'rubber') {
      defaultRow = 7; defaultTree = 3; defaultTrees = 76;
    } else if (cropId === 'coconut') {
      defaultRow = 6; defaultTree = 6; defaultTrees = 44;
    } else if (cropId === 'mangosteen') {
      defaultRow = 8; defaultTree = 8; defaultTrees = 25;
    } else if (cropId === 'rambutan') {
      defaultRow = 8; defaultTree = 8; defaultTrees = 25;
    } else if (cropId === 'longkong') {
      defaultRow = 7; defaultTree = 7; defaultTrees = 32;
    } else if (cropId === 'banana') {
      defaultRow = 2; defaultTree = 2; defaultTrees = 400;
    } else if (cropId === 'pineapple') {
      defaultRow = 0.5; defaultTree = 0.4; defaultTrees = 8000;
    }

    setRowSpacing(defaultRow);
    setTreeSpacing(defaultTree);
    setTreesPerRai(defaultTrees);
  };

  // Recompute trees per rai from spacing
  const handleAutoCalcTreesPerRai = () => {
    if (rowSpacing > 0 && treeSpacing > 0) {
      const calculated = Math.max(1, Math.round(1600 / (rowSpacing * treeSpacing)));
      setTreesPerRai(calculated);
    }
  };

  // Set spacing preset
  const handleApplyPresetSpacing = (row: number, tree: number) => {
    setRowSpacing(row);
    setTreeSpacing(tree);
    const calculated = Math.max(1, Math.round(1600 / (row * tree)));
    setTreesPerRai(calculated);
  };

  // Main Calculation Result
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
      },
      treesPerRai,
      { rowMeters: rowSpacing, treeMeters: treeSpacing }
    );
  }, [
    selectedCropId,
    selectedStageId,
    areaRai,
    areaNgan,
    areaWah,
    soilTexture,
    soilPh,
    soilN,
    soilP,
    soilK,
    treesPerRai,
    rowSpacing,
    treeSpacing
  ]);

  // Reset to Defaults
  const handleReset = () => {
    setSelectedCropId('durian');
    setSelectedStageId('stage2');
    setAreaRai(5);
    setAreaNgan(0);
    setAreaWah(0);
    setRowSpacing(8);
    setTreeSpacing(8);
    setTreesPerRai(25);
    setSoilTexture('loam');
    setSoilPh(6.2);
    setSoilN(15);
    setSoilP(28);
    setSoilK(45);
    setPlotName('แปลงทุเรียนจันทบุรี');
    setShowAdvancedSoil(false);
  };

  // Quick Preset Loader (แปลงทุเรียนจันทบุรี)
  const handleLoadPresetChantaburi = () => {
    setSelectedCropId('durian');
    setSelectedStageId('stage2');
    setAreaRai(5);
    setAreaNgan(0);
    setAreaWah(0);
    setRowSpacing(8);
    setTreeSpacing(8);
    setTreesPerRai(25);
    setSoilTexture('loam');
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
      treesPerRai: calculationResult.treesPerRai,
      spacingDesc: calculationResult.spacingDesc,
      rowSpacing: rowSpacing,
      treeSpacing: treeSpacing,
      soilTexture: soilTexture,
      soilTypeNameTh: calculationResult.soilTypeNameTh,
      soilPh: soilPh,
      soilN: soilN,
      soilP: soilP,
      soilK: soilK,
      commercialFormula: calculationResult.commercialFormula,
      commercialBags: calculationResult.commercialBags,
      commercialKg: calculationResult.commercialKg,
      ratePerRaiKg: calculationResult.ratePerRaiKg,
      ratePerTreeKg: calculationResult.ratePerTreeKg,
      commercialRatePerTree: calculationResult.commercialRateText,
      customUreaKg: calculationResult.customUreaKg,
      customDapKg: calculationResult.customDapKg,
      customPotashKg: calculationResult.customPotashKg,
      totalCustomKg: calculationResult.customTotalKg,
      estimatedCost: calculationResult.commercialCost,
      customCost: calculationResult.customCost,
      savingsPercent: calculationResult.savingsPercent,
      soilAdvice: calculationResult.soilAdvice,
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

  const selectedSoilDetail = SOIL_TYPES.find(s => s.id === soilTexture) || SOIL_TYPES[1];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-3 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TipGROW Smart Ag Engine • ระบบคำนวณปุ๋ยอัจฉริยะ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            คำนวณสูตรปุ๋ยเฉพาะแปลง
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
            กำหนดพื้นที่ปลูก, ระยะพืช, ประเภทดิน, จำนวนต้นต่อไร่ และระยะห่าง เพื่อรับสูตรปุ๋ย NPK ที่แนะนำ ปริมาณต่อไร่ ปริมาณรวม และคำแนะนำการดูแล
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleLoadPresetChantaburi}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white text-xs font-bold transition-all border border-white/20 cursor-pointer backdrop-blur-xs"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>โหลดค่าแปลงตัวอย่าง</span>
          </button>
          <button
            onClick={onOpenKnowledge}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
            title="คู่มือวิชาการ"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </div>

      {/* Save Alert */}
      {saveSuccessMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[22px]">check_circle</span>
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-emerald-700 text-xs font-medium">Firebase Firestore Synced</span>
        </div>
      )}

      {/* 2-Column Responsive Layout: Inputs (Left 7) & Outputs (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: INPUT SECTION */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* CARD 1: CROP & CROP STAGE SELECTION (ชนิดพืช และ ระยะพืช) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">ชนิดพืช & ระยะพืช</h2>
                  <p className="text-xs text-stone-500">เลือกชนิดพืชเศรษฐกิจและระยะการเจริญเติบโตปัจจุบัน</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {selectedCrop.nameTh}
              </span>
            </div>

            {/* 8 Crop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
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
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[12px]">check</span>
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
                    <span className="text-xs sm:text-sm font-bold block">{crop.nameTh}</span>
                    <span className="text-[10px] text-stone-500 truncate max-w-full">
                      {crop.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Growth Stage Selector (ระยะพืช) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                ระยะพืช (Growth Stage):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCrop.stages.map((stg) => {
                  const isStageActive = stg.id === selectedStageId;
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setSelectedStageId(stg.id)}
                      className={`p-3 rounded-2xl text-left text-xs transition-all cursor-pointer flex items-center gap-2.5 border ${
                        isStageActive
                          ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] shrink-0">
                        {stg.icon}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-xs truncate">{stg.name}</div>
                        <div className={`text-[10px] truncate ${isStageActive ? 'text-emerald-100' : 'text-stone-400'}`}>
                          {stg.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: AREA, SPACING & TREES PER RAI (พื้นที่ปลูก, ระยะห่างต่อต้น, จำนวนต้นต่อไร่) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">พื้นที่ปลูก & การจัดแปลง</h2>
                  <p className="text-xs text-stone-500">ระบุขนาดพื้นที่ ระยะห่างต่อต้น และจำนวนต้นต่อไร่</p>
                </div>
              </div>

              <input
                type="text"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="ชื่อแปลง เช่น แปลง 1 สวนทุเรียน"
                className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 max-w-[190px]"
              />
            </div>

            {/* Input: พื้นที่ปลูก (Planting Area in Rai only) */}
            <div className="mb-5">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-700 text-base">square_foot</span>
                  พื้นที่ปลูก:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 3, 5, 10, 20].map((presetRai) => (
                    <button
                      key={presetRai}
                      type="button"
                      onClick={() => setAreaRai(presetRai)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border font-semibold transition-all ${
                        areaRai === presetRai
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-stone-50 hover:bg-emerald-50 text-stone-600 border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      {presetRai} ไร่
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center bg-stone-50 rounded-2xl px-4 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  max="10000"
                  value={areaRai === 0 ? '' : areaRai}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setAreaRai(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  placeholder="ระบุจำนวนไร่ เช่น 5 หรือ 2.5"
                  className="w-full bg-transparent text-lg font-black text-emerald-950 focus:outline-none"
                />
                <span className="text-sm font-bold text-emerald-800 pl-2 select-none whitespace-nowrap">
                  ไร่
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 px-1">
                <span>พื้นที่ปลูกรวม: <strong className="text-emerald-900 font-bold">{areaRai} ไร่</strong></span>
                <span>เทียบเท่า: <strong className="text-emerald-900 font-bold">{(Math.round(areaRai * 1600)).toLocaleString()} ตารางเมตร</strong></span>
              </div>
            </div>

            {/* Inputs: ระยะห่างต่อต้น & จำนวนต้นต่อไร่ (Spacing & Trees per Rai) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              
              {/* ระยะห่างต่อต้น */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    ระยะห่างต่อต้น (Plant Spacing):
                  </label>
                  <span className="text-[11px] text-stone-500">แถว x ต้น (ม.)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                    <input
                      type="number"
                      step="0.5"
                      min="0.2"
                      max="30"
                      value={rowSpacing}
                      onChange={(e) => {
                        const val = Math.max(0.2, parseFloat(e.target.value) || 0.2);
                        setRowSpacing(val);
                      }}
                      className="w-full bg-transparent text-sm font-bold text-emerald-950 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-500 font-semibold">ม.</span>
                  </div>

                  <span className="text-stone-400 font-bold">×</span>

                  <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                    <input
                      type="number"
                      step="0.5"
                      min="0.2"
                      max="30"
                      value={treeSpacing}
                      onChange={(e) => {
                        const val = Math.max(0.2, parseFloat(e.target.value) || 0.2);
                        setTreeSpacing(val);
                      }}
                      className="w-full bg-transparent text-sm font-bold text-emerald-950 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-500 font-semibold">ม.</span>
                  </div>
                </div>

                {/* Spacing Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpacing(8, 8)}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] font-semibold text-stone-700 cursor-pointer"
                  >
                    8×8 ม.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpacing(7, 3)}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] font-semibold text-stone-700 cursor-pointer"
                  >
                    7×3 ม.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpacing(6, 6)}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] font-semibold text-stone-700 cursor-pointer"
                  >
                    6×6 ม.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpacing(2, 2)}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] font-semibold text-stone-700 cursor-pointer"
                  >
                    2×2 ม.
                  </button>
                </div>
              </div>

              {/* จำนวนต้นต่อไร่ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    จำนวนต้นต่อไร่ (Trees / Rai):
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoCalcTreesPerRai}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    title="คำนวณจากระยะห่าง 1600/(แถว x ต้น)"
                  >
                    <span className="material-symbols-outlined text-[13px]">calculate</span>
                    คำนวณจากระยะ
                  </button>
                </div>

                <div className="relative flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                  <input
                    type="number"
                    min="1"
                    max="20000"
                    value={treesPerRai}
                    onChange={(e) => setTreesPerRai(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-transparent text-base font-black text-emerald-950 focus:outline-none"
                  />
                  <span className="text-xs text-stone-500 font-bold pl-2">ต้น/ไร่</span>
                </div>

                <div className="text-[11px] text-stone-500 mt-2 px-1 flex items-center justify-between">
                  <span>ทั้งแปลงรวม:</span>
                  <span className="font-extrabold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ≈ {calculationResult.totalTrees.toLocaleString()} ต้น
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: SOIL TYPE & CHARACTERISTICS (ประเภทดิน) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">ประเภทดิน (Soil Type)</h2>
                  <p className="text-xs text-stone-500">เลือกชนิดดินเพื่อประเมินความสามารถในการอุ้มน้ำและดูดซับปุ๋ย</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                {selectedSoilDetail.nameTh}
              </span>
            </div>

            {/* 3 Soil Types Selector: ดินเหนียว ดินร่วน ดินทราย */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {SOIL_TYPES.map((soil) => {
                const isActive = soil.id === soilTexture;
                return (
                  <button
                    key={soil.id}
                    type="button"
                    onClick={() => setSoilTexture(soil.id)}
                    className={`py-3 px-2 rounded-2xl text-center transition-all cursor-pointer border flex flex-col items-center justify-between ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-600/30 font-bold'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <span className="text-sm font-bold block">{soil.nameTh}</span>
                    <span className={`text-[11px] mt-0.5 block truncate max-w-full ${isActive ? 'text-emerald-200' : 'text-stone-400'}`}>
                      {soil.nameEn.replace(' Soil', '')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Soil Detail & Insight Banner */}
            <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-800 text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <h4 className="font-bold text-emerald-950 mb-0.5">
                    คุณสมบัติ{selectedSoilDetail.nameTh}: {selectedSoilDetail.description}
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    {selectedSoilDetail.advice}
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Advanced Soil Lab Inputs (pH, N, P, K) */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAdvancedSoil(!showAdvancedSoil)}
                className="w-full flex items-center justify-between text-xs font-bold text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">science</span>
                  <span>ตัวเลือกเสริม: ป้อนผลตรวจวิเคราะห์ดิน (pH, N, P, K ppm)</span>
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  {showAdvancedSoil ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showAdvancedSoil && (
                <div className="mt-4 space-y-4 pt-3 border-t border-stone-100">
                  {/* pH Slider */}
                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-stone-800">
                        ค่าความเป็นกรด-ด่างของดิน (pH): <strong className="text-emerald-900 text-sm">{soilPh.toFixed(1)}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        calculationResult.phStatus === 'เหมาะสมสมดุล'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {calculationResult.phStatus}
                      </span>
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
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>4.0 (กรดจัด)</span>
                      <span className="text-emerald-800 font-bold">6.0 - 6.5 (เหมาะสม)</span>
                      <span>8.5 (ด่างจัด)</span>
                    </div>
                  </div>

                  {/* N P K Inputs */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200 text-center">
                      <span className="text-[11px] font-bold text-stone-700 block">N (ppm)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={soilN}
                        onChange={(e) => setSoilN(parseFloat(e.target.value) || 0)}
                        className="w-full text-center bg-white border border-stone-300 rounded-lg py-1 text-sm font-bold text-emerald-950 mt-1"
                      />
                    </div>
                    <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200 text-center">
                      <span className="text-[11px] font-bold text-stone-700 block">P (ppm)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={soilP}
                        onChange={(e) => setSoilP(parseFloat(e.target.value) || 0)}
                        className="w-full text-center bg-white border border-stone-300 rounded-lg py-1 text-sm font-bold text-emerald-950 mt-1"
                      />
                    </div>
                    <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200 text-center">
                      <span className="text-[11px] font-bold text-stone-700 block">K (ppm)</span>
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={soilK}
                        onChange={(e) => setSoilK(parseFloat(e.target.value) || 0)}
                        className="w-full text-center bg-white border border-stone-300 rounded-lg py-1 text-sm font-bold text-emerald-950 mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="mt-4 pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                รีเซ็ตค่าเริ่มต้นทั้งหมด
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: OUTPUT SECTION (ผลลัพธ์ที่คำนวณได้) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* MAIN OUTPUT HERO CARD: NPK FORMULA & RATES */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-emerald-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-black tracking-wider uppercase text-emerald-200">
                  ผลการคำนวณปุ๋ยแนะนำ
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-300 text-emerald-950 text-[10px] font-black uppercase">
                {calculationResult.matchPercent}% Match
              </span>
            </div>

            {/* Crop & Stage Title */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src={selectedCrop.avatarUrl}
                alt={selectedCrop.nameTh}
                className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-emerald-400/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedCrop.nameTh}
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5 font-medium">
                  {calculationResult.stage.name} • {selectedSoilDetail.nameTh}
                </p>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  พื้นที่ {calculationResult.totalRai.toFixed(2)} ไร่ • {calculationResult.treesPerRai} ต้น/ไร่ (รวม ≈ {calculationResult.totalTrees.toLocaleString()} ต้น)
                </p>
              </div>
            </div>

            {/* 1. สูตรปุ๋ย NPK ที่แนะนำ (RECOMMENDED NPK FORMULA) */}
            <div className="bg-emerald-950/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-600/40 mb-4">
              <span className="text-[11px] font-bold text-emerald-300 block uppercase tracking-wider mb-1">
                สูตรปุ๋ย NPK ที่แนะนำ (Recommended Formula)
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  สูตร {calculationResult.commercialFormula}
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 shrink-0">
                  เกรดพรีเมียม
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-1.5 leading-relaxed">
                {calculationResult.stage.desc}
              </p>
            </div>

            {/* 2. ปริมาณต่อไร่ และ 3. ปริมาณรวมทั้งหมด (QUANTITY PER RAI & TOTAL) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              
              {/* ปริมาณต่อไร่ */}
              <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-3.5 border border-emerald-700/40">
                <span className="block text-[11px] text-emerald-200 font-bold mb-0.5">
                  ปริมาณต่อไร่
                </span>
                <div className="text-2xl font-black text-white">
                  {calculationResult.ratePerRaiKg} <span className="text-sm font-semibold text-emerald-200">กก./ไร่</span>
                </div>
                <span className="block text-[10px] text-emerald-300 mt-1">
                  เฉลี่ย {calculationResult.commercialRateText}
                </span>
              </div>

              {/* ปริมาณรวมทั้งหมด */}
              <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-3.5 border border-emerald-700/40">
                <span className="block text-[11px] text-emerald-200 font-bold mb-0.5">
                  ปริมาณรวมทั้งหมด
                </span>
                <div className="text-2xl font-black text-white">
                  {calculationResult.totalPlotKg} <span className="text-sm font-semibold text-emerald-200">กก.</span>
                </div>
                <span className="block text-[10px] text-emerald-300 mt-1">
                  ประมาณ {calculationResult.commercialBags} กระสอบ (50 กก.)
                </span>
              </div>
            </div>

            {/* Cost & Savings Bar */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-emerald-700/60 text-emerald-100">
              <span>ประมาณการค่าปุ๋ยรวม: <strong className="text-white font-black text-sm">฿{calculationResult.commercialCost.toLocaleString()}</strong></span>
              <span className="text-emerald-300 font-bold">ประหยัดได้ -{calculationResult.savingsPercent}%</span>
            </div>
          </div>

          {/* CUSTOM FERTILIZER (ปุ๋ยสั่งตัดแม่ปุ๋ยเดี่ยว N-P-K ผสมเอง) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-base font-bold text-emerald-950">ทางเลือกปุ๋ยสั่งตัด (ผสมเอง)</h4>
                <p className="text-xs text-stone-500">ใช้แม่ปุ๋ยเดี่ยว 3 ชนิด ประหยัดต้นทุนได้สูงสุด</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                ประหยัด ฿{calculationResult.savingsAmount.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-2">
              <div className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-200">
                <span className="block text-[10px] text-stone-500 font-bold">ไนโตรเจน (Urea)</span>
                <span className="text-xs font-black text-emerald-900 block mt-0.5">46-0-0</span>
                <span className="text-base font-black text-emerald-950 mt-1 block">
                  {calculationResult.customUreaKg} <span className="text-[10px] font-normal text-stone-500">กก.</span>
                </span>
                <span className="text-[9px] text-stone-400 block">
                  ({Math.round((calculationResult.customUreaKg / calculationResult.totalRai) * 10) / 10} กก./ไร่)
                </span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-200">
                <span className="block text-[10px] text-stone-500 font-bold">ฟอสฟอรัส (DAP)</span>
                <span className="text-xs font-black text-emerald-900 block mt-0.5">18-46-0</span>
                <span className="text-base font-black text-emerald-950 mt-1 block">
                  {calculationResult.customDapKg} <span className="text-[10px] font-normal text-stone-500">กก.</span>
                </span>
                <span className="text-[9px] text-stone-400 block">
                  ({Math.round((calculationResult.customDapKg / calculationResult.totalRai) * 10) / 10} กก./ไร่)
                </span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-200">
                <span className="block text-[10px] text-stone-500 font-bold">โพแทสเซียม (MOP)</span>
                <span className="text-xs font-black text-emerald-900 block mt-0.5">0-0-60</span>
                <span className="text-base font-black text-emerald-950 mt-1 block">
                  {calculationResult.customPotashKg} <span className="text-[10px] font-normal text-stone-500">กก.</span>
                </span>
                <span className="text-[9px] text-stone-400 block">
                  ({Math.round((calculationResult.customPotashKg / calculationResult.totalRai) * 10) / 10} กก./ไร่)
                </span>
              </div>
            </div>

            <div className="mt-3.5 bg-emerald-50 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-950 border border-emerald-200/60 font-semibold">
              <span>รวมน้ำหนักแม่ปุ๋ยเดี่ยวทั้งหมด:</span>
              <span className="text-sm font-black text-emerald-900">
                {calculationResult.customTotalKg} กก. (ต้นทุน ฿{calculationResult.customCost.toLocaleString()})
              </span>
            </div>
          </div>

          {/* 4. คำแนะนำ (AGRONOMIC RECOMMENDATIONS & ADVICE) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-emerald-950">คำแนะนำการปฏิบัติ (Recommendations)</h4>
                <p className="text-xs text-stone-500">คำแนะนำตามระยะพืชและประเภทดินเพื่อประสิทธิภาพสูงสุด</p>
              </div>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">eco</span>
              </span>
            </div>

            {/* Advice Box 1: Soil Specific Advice */}
            <div className="rounded-2xl p-3.5 bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-[16px]">landscape</span>
                <span>คำแนะนำสำหรับ{selectedSoilDetail.nameTh}:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedSoilDetail.advice}
              </p>
            </div>

            {/* Advice Box 2: Growth Stage Advice */}
            <div className="rounded-2xl p-3.5 bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-[16px]">spa</span>
                <span>คำแนะนำระยะ{calculationResult.stage.name}:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {calculationResult.applicationAdvice}
              </p>
            </div>

            {/* Advice Box 3: Watering Advice */}
            <div className="rounded-2xl p-3.5 bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-[16px]">water_drop</span>
                <span>การให้น้ำและสภาพแวดล้อม:</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {calculationResult.wateringAdvice}
              </p>
            </div>

            {/* Timeline Action Checklist */}
            <div className="mt-1">
              <span className="block text-xs font-bold text-stone-800 mb-2">
                รอบการปฏิบัติงาน (Action Timeline):
              </span>
              <div className="space-y-2">
                {calculationResult.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-emerald-900 mr-1.5">{step.week}:</span>
                      <span className="text-stone-700 font-semibold">{step.title}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (บันทึกแปลง & ส่งออกรายงาน) */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenReport(calculationResult)}
              className="w-full sm:flex-1 h-12 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>ส่งออกรายงาน PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToFirebase}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-emerald-300 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSaving ? 'sync' : 'bookmark_add'}
              </span>
              <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกแปลงนี้'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
