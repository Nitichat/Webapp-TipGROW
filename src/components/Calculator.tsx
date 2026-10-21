import React, { useState, useMemo, useEffect, useRef } from 'react';
import { safeExportToPng, normalizeImageUrl } from '../utils/imageExport.ts';
import {
  CROPS,
  CropInfo,
  SoilAssessment,
  SoilTextureType,
  SOIL_TYPES,
  calculateFertilizer,
  CalculationResult
} from '../data/agronomy.ts';
import { CROP_IMAGES } from './CropIcons.tsx';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface CalculatorProps {
  currentUser: User | null;
  initialCropId?: string;
  onOpenAuth: () => void;
  onOpenKnowledge: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currentUser,
  initialCropId,
  onOpenAuth,
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
  const [soilPh] = useState<number>(6.2);
  const [soilN] = useState<number>(15);
  const [soilP] = useState<number>(28);
  const [soilK] = useState<number>(45);

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

  // Prevent invalid characters in number inputs
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
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
      treesPerRai || 1,
      { rowMeters: rowSpacing || 1, treeMeters: treeSpacing || 1 }
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

  // Image Export State & Handler
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [imageExportSuccess, setImageExportSuccess] = useState(false);

  const handleDownloadImage = async () => {
    if (!resultCardRef.current) return;
    try {
      setIsExportingImage(true);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await safeExportToPng(resultCardRef.current);

      const cleanCropName = selectedCrop.nameTh.replace(/[\/\s]/g, '_');
      const cleanPlotName = (plotName || 'แปลงพืช').replace(/[\/\s]/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `TipGROW_สูตรปุ๋ย_${cleanCropName}_${cleanPlotName}_${dateStr}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      setImageExportSuccess(true);
      setTimeout(() => setImageExportSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to export calculation image:', error);
      alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ โปรดลองใหม่อีกครั้ง');
    } finally {
      setIsExportingImage(false);
    }
  };

  const selectedSoilDetail = SOIL_TYPES.find(s => s.id === soilTexture) || SOIL_TYPES[1];

  // Helper function to resolve best image URL with fallback for selected crop
  const cropImageSrc = useMemo(() => {
    if (selectedCrop.avatarUrl) {
      return normalizeImageUrl(selectedCrop.avatarUrl);
    }
    return CROP_IMAGES[selectedCrop.id] || CROP_IMAGES.durian;
  }, [selectedCrop]);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-3 pb-20">
      
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TipGROW Smart Ag Engine • ระบบคำนวณปุ๋ยอัจฉริยะ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            คำนวณปริมาณปุ๋ยเฉพาะแปลง
          </h1>
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

      {/* ========================================================= */}
      {/* INPUT SECTION */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-6">

        {/* CARD 1: CROP & CROP STAGE SELECTION */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950">ชนิดพืช & ระยะพืช</h2>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {selectedCrop.nameTh}
            </span>
          </div>

          {/* 8 Crop Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-5">
            {CROPS.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              const cropAvatarSrc = crop.avatarUrl
                ? normalizeImageUrl(crop.avatarUrl)
                : (CROP_IMAGES[crop.id] || CROP_IMAGES.durian);

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
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs z-10">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                    </span>
                  )}

                  <div className="w-12 h-12 rounded-2xl overflow-hidden mb-1.5 border border-stone-200 bg-white shadow-2xs shrink-0 p-0.5">
                    <img
                      src={cropAvatarSrc}
                      alt={crop.nameTh}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = CROP_IMAGES[crop.id] || CROP_IMAGES.durian;
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      referrerPolicy="no-referrer"
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

          {/* Growth Stage Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              ระยะพืช (Growth Stage):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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

        {/* 2-COLUMN GRID FOR CARD 2 & CARD 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* CARD 2: AREA, SPACING & TREES PER RAI */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950">พื้นที่ปลูก & การจัดแปลง</h2>
              </div>

              {/* Input: Area */}
              <div className="mb-5">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-emerald-700 text-base">square_foot</span>
                  พื้นที่ปลูก (ไร่-งาน):
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-4 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={areaRai === 0 ? '' : areaRai}
                      onKeyDown={handleNumberKeyDown}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAreaRai(val === '' ? 0 : parseFloat(val));
                      }}
                      placeholder="จำนวนไร่"
                      className="w-full bg-transparent text-lg font-black text-emerald-950 focus:outline-none"
                    />
                    <span className="text-sm font-bold text-emerald-800 pl-2 select-none">ไร่</span>
                  </div>

                  <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-4 h-12 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                    <input
                      type="number"
                      min="0"
                      max="3"
                      step="1"
                      value={areaNgan === 0 ? '' : areaNgan}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAreaNgan(val === '' ? 0 : parseFloat(val));
                      }}
                      placeholder="จำนวนงาน"
                      className="w-full bg-transparent text-lg font-black text-emerald-950 focus:outline-none"
                    />
                    <span className="text-sm font-bold text-emerald-800 pl-2 select-none">งาน</span>
                  </div>
                </div>
              </div>

              {/* Inputs: Spacing & Trees per Rai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    ระยะห่างต่อต้น (Plant Spacing):
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={rowSpacing === 0 ? '' : rowSpacing}
                        onKeyDown={handleNumberKeyDown}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRowSpacing(val === '' ? 0 : parseFloat(val));
                        }}
                        className="w-full bg-transparent text-sm font-bold text-emerald-950 focus:outline-none"
                      />
                      <span className="text-[11px] text-stone-500 font-semibold">ม.</span>
                    </div>

                    <span className="text-stone-400 font-bold">×</span>

                    <div className="relative flex-1 flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={treeSpacing === 0 ? '' : treeSpacing}
                        onKeyDown={handleNumberKeyDown}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTreeSpacing(val === '' ? 0 : parseFloat(val));
                        }}
                        className="w-full bg-transparent text-sm font-bold text-emerald-950 focus:outline-none"
                      />
                      <span className="text-[11px] text-stone-500 font-semibold">ม.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    จำนวนต้นต่อไร่ (Trees / Rai):
                  </label>

                  <div className="relative flex items-center bg-stone-50 rounded-2xl px-3 h-11 border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:bg-white">
                    <input
                      type="number"
                      min="0"
                      value={treesPerRai === 0 ? '' : treesPerRai}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTreesPerRai(val === '' ? 0 : parseInt(val, 10));
                      }}
                      className="w-full bg-transparent text-base font-black text-emerald-950 focus:outline-none"
                    />
                    <span className="text-xs text-stone-500 font-bold pl-2">ต้น/ไร่</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: SOIL TYPE */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-950">ประเภทดิน</h2>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                  {selectedSoilDetail.nameTh}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {SOIL_TYPES.map((soil) => {
                  const isActive = soil.id === soilTexture;
                  return (
                    <button
                      key={soil.id}
                      type="button"
                      onClick={() => setSoilTexture(soil.id)}
                      className={`py-4 px-2 rounded-2xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                        isActive
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-600/30 font-bold'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-bold block">{soil.nameTh}</span>
                      <span className={`text-[11px] block truncate max-w-full ${isActive ? 'text-emerald-200' : 'text-stone-400'}`}>
                        {soil.nameEn.replace(' Soil', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: ผลการคำนวณปุ๋ย                            */}
      {/* ========================================================= */}
      <div id="fertilizer-calculation-results" className="mt-10 flex flex-col gap-6 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[20px]">analytics</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-emerald-950">
            ผลการคำนวณปุ๋ยเฉพาะแปลง
          </h2>
        </div>

        {/* Image Export Success Alert */}
        {imageExportSuccess && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-300 text-teal-950 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-teal-700 text-[22px]">download_done</span>
              <span>ดาวน์โหลดรูปภาพผลคำนวณปุ๋ย (PNG) บันทึกลงในเครื่องของคุณเรียบร้อยแล้ว!</span>
            </div>
            <span className="text-teal-700 text-xs font-medium">TipGROW Image Export</span>
          </div>
        )}

        {/* MAIN OUTPUT HERO CARD */}
        <div
          ref={resultCardRef}
          className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden"
        >
          
          {/* Header of Result Card (Crop Avatar & Overview) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6 border-b border-emerald-700/60 pb-5">
            <div className="flex items-center gap-4">
              <img
                src={cropImageSrc}
                alt={selectedCrop.nameTh}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-emerald-400/40 shrink-0 bg-white/10"
                crossOrigin="anonymous" 
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = CROP_IMAGES[selectedCrop.id] || CROP_IMAGES.durian;
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {selectedCrop.nameTh}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                    {selectedCrop.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
                  {calculationResult.stage.name} • ชนิดดิน{selectedSoilDetail.nameTh}
                </p>
                <p className="text-[11px] sm:text-xs text-emerald-300/80 mt-0.5">
                  พื้นที่ปลูก {calculationResult.totalRai.toFixed(2)} ไร่ • {calculationResult.treesPerRai} ต้น/ไร่ (รวมทั้งแปลง ≈ {calculationResult.totalTrees.toLocaleString()} ต้น)
                </p>
              </div>
            </div>

            {/* Logo Section */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-emerald-200 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/15">
                ผลการคำนวณปุ๋ยแนะนำ
              </span>
              <img
                src="https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fid%3D1fZnm7nPeNZUlrWZZ93MBsGHCRVZQYaWv%26sz%3Dw500"
                alt="TipGROW Logo"
                className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm opacity-95"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* 3 Primary Metric Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-950/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/60 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-300 block uppercase tracking-wider mb-1">
                  1. ปริมาณต่อไร่
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight my-1">
                  {calculationResult.ratePerRaiKg} <span className="text-base font-bold text-emerald-200">กก./ไร่</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300">
                <span>อัตราเฉลี่ย:</span>
                <strong className="text-emerald-100 font-bold">{calculationResult.commercialRateText}</strong>
              </div>
            </div>

            <div className="bg-emerald-950/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/60 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-300 block uppercase tracking-wider mb-1">
                  2. ปริมาณรวมทั้งหมด
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight my-1">
                  {calculationResult.totalPlotKg} <span className="text-base font-bold text-emerald-200">กก.</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300">
                <span>จำนวนกระสอบ:</span>
                <strong className="text-emerald-100 font-bold">≈ {calculationResult.commercialBags} กระสอบ (50 กก.)</strong>
              </div>
            </div>

            <div className="bg-emerald-950/70 backdrop-blur-md rounded-2xl p-5 border border-emerald-600/50 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 block uppercase tracking-wider mb-1">
                  3. สูตรปุ๋ย NPK ที่แนะนำ
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
                  สูตร {calculationResult.commercialFormula}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-800/60">
                <span className="text-[11px] text-emerald-200/90 leading-relaxed block">
                  {calculationResult.stage.desc}
                </span>
              </div>
            </div>
          </div>

          {/* Advice Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
            <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-4 border border-emerald-700/50">
              <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs">
                {/* Fixed icon name from terrain */}
                <span className="material-symbols-outlined text-[18px]">terrain</span>
                <span>คำแนะนำการจัดการดิน ({selectedSoilDetail.nameTh})</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {calculationResult.soilAdvice}
              </p>
              <div className="mt-2 text-[11px] text-emerald-300/80">
                💡 ข้อแนะนำ: หว่านรอบรัศมีทรงพุ่ม (บริเวณปลายรากฝอย) ขณะดินมีความชื้นพอเหมาะ และให้น้ำตามทันที
              </div>
            </div>

            <div className="bg-emerald-950/50 backdrop-blur-xs rounded-2xl p-4 border border-emerald-700/50">
              <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-xs">
                {/* Fixed icon name from psychology_alt to psychology */}
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>คำแนะนำระยะพืช ({calculationResult.stage.name})</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {calculationResult.stageAdvice || calculationResult.stage.desc}
              </p>
              <div className="mt-2 text-[11px] text-emerald-300/80 flex items-center justify-between">
                <span>เป้าหมายธาตุอาหาร:</span>
                <span className="font-bold text-white">N: {calculationResult.targetN} | P: {calculationResult.targetP} | K: {calculationResult.targetK} กก./ไร่</span>
              </div>
            </div>
          </div>

          {/* Watermark Branding Footer */}
          <div className="pt-4 mt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-200/80">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-emerald-300">TipGROW</span>
              <span>•</span>
              <span>ระบบคำนวณปุ๋ย</span>
            </div>
            <div>
              วันที่คำนวณ: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">verified</span>
            <span>บันทึกผลการคำนวณนี้ลงประวัติแปลง หรือดาวน์โหลดรูปภาพสำหรับเกษตรกร</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Download Image Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="w-full sm:w-auto px-5 h-12 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              title="ดาวน์โหลดภาพผลการคำนวณปุ๋ย (PNG) บันทึกลงในเครื่อง"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isExportingImage ? 'sync' : 'image'}
              </span>
              <span>{isExportingImage ? 'กำลังสร้างรูปภาพ...' : 'ดาวน์โหลดรูปภาพ (PNG)'}</span>
            </button>

            {/* Save to Firebase Button */}
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