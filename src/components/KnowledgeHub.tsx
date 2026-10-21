import React, { useState, useMemo } from 'react';
import { CROPS, CropInfo } from '../data/agronomy.ts';
import { CROP_KNOWLEDGE_LIST, CropDetailedKnowledge } from '../data/cropKnowledge.ts';

interface KnowledgeHubProps {
  onSelectCropForCalc: (cropId: string) => void;
}

// Order requested by user: 1. ยางพารา 2. มะพร้าว 3. ทุเรียน 4. มังคุด 5. กล้วย 6. เงาะ 7. ลองกอง 8. สับปะรด
const ORDERED_CROP_IDS = ['rubber', 'coconut', 'durian', 'mangosteen', 'banana', 'rambutan', 'longkong', 'pineapple'];

// Photography assets mapping for each crop synchronized with agronomy.ts avatarUrls
export const CROP_PHOTO_GALLERY: Record<string, { photoUrl: string; tag: string; caption: string; highlight: string }> = {
  rubber: {
    photoUrl: CROPS.find(c => c.id === 'rubber')?.avatarUrl || '',
    tag: 'พืชเศรษฐกิจอุตสาหกรรม',
    caption: 'สวนยางพาราสมบูรณ์ กรีดน้ำยางสม่ำเสมอ คุณภาพน้ำยางเข้มข้น',
    highlight: 'ต้องการ N สร้างใบ และ K เสริมความสมบูรณ์ของท่อน้ำยาง'
  },
  coconut: {
    photoUrl: CROPS.find(c => c.id === 'coconut')?.avatarUrl || '',
    tag: 'พืชยืนต้นทนเค็ม',
    caption: 'มะพร้าวน้ำหอมและมะพร้าวแกง ทะลายดก ผลใหญ่ น้ำหวานหอม',
    highlight: 'ต้องการ K และคลอรีนสูงเพื่อพัฒนาผลและเนื้อแน่น'
  },
  durian: {
    photoUrl: CROPS.find(c => c.id === 'durian')?.avatarUrl || '',
    tag: 'ราชาแห่งผลไม้ (King of Fruits)',
    caption: 'ทุเรียนหมอนทองผลสวย พูเต็ม หนามเขียว เมล็ดลีบ เนื้อเนียนละเอียด',
    highlight: 'เน้น K สูงช่วงขยายขนาดผล และ Ca-B เสริมขั้วเหนียว'
  },
  mangosteen: {
    photoUrl: CROPS.find(c => c.id === 'mangosteen')?.avatarUrl || '',
    tag: 'ราชินีแห่งผลไม้ (Queen of Fruits)',
    caption: 'มังคุดผิวเนียน กลีบเลี้ยงสด เนื้อขาวฟู รสหวานอมเปรี้ยวกลมกล่อม',
    highlight: 'ชอบร่มเงา ดินร่วนชื้นสม่ำเสมอ ไม่ชอบน้ำท่วมขัง'
  },
  banana: {
    photoUrl: CROPS.find(c => c.id === 'banana')?.avatarUrl || '',
    tag: 'พืชเศรษฐกิจโตไว',
    caption: 'กล้วยหอมทองและกล้วยน้ำว้า เครือใหญ่ หวีถี่ ผลอวบแน่น ผิวเนียน',
    highlight: 'ต้องการ K สูงมากในการพัฒนาผลและน้ำหนักเครือ'
  },
  rambutan: {
    photoUrl: CROPS.find(c => c.id === 'rambutan')?.avatarUrl || '',
    tag: 'ไม้ผลยอดนิยมภาคตะวันออกและใต้',
    caption: 'เงาะโรงเรียนผลสด ขนเขียวปลายแดง เนื้อหนาร่อนกรอบ หวานฉ่ำ',
    highlight: 'ต้องการน้ำสม่ำเสมอช่วงติดผล และระบายน้ำดีช่วงฝนชุก'
  },
  longkong: {
    photoUrl: CROPS.find(c => c.id === 'longkong')?.avatarUrl || '',
    tag: 'ไม้ผลช่อพวงรสหวานเย็น',
    caption: 'ลองกองช่อดก ผลแน่นกลม ผิวสะอาด เนื้อใสไร้เมล็ด รสหวานชื่นใจ',
    highlight: 'ต้องการความชื้นสม่ำเสมอ ร่มเงาพอเหมาะ ดินระบายน้ำดี'
  },
  pineapple: {
    photoUrl: CROPS.find(c => c.id === 'pineapple')?.avatarUrl || '',
    tag: 'พืชทนแล้ง ดูแลง่าย',
    caption: 'สับปะรดปัตตาเวียและภูแล ตาตื้น เนื้อสีทองฉ่ำ กลิ่นหอมหวาน',
    highlight: 'ต้องการ N สร้างต้นช่วงแรก และ K+กำมะถันช่วงพัฒนาผล'
  }
};

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ onSelectCropForCalc }) => {
  const [activeTab, setActiveTab] = useState<'crops' | 'soil_types' | 'nutrients' | 'productivity'>('crops');
  const [selectedCropId, setSelectedCropId] = useState<string>('rubber');

  // Sorted list of crops based on ordered array
  const orderedCrops = useMemo(() => {
    return ORDERED_CROP_IDS.map(id => CROPS.find(c => c.id === id)!).filter(Boolean);
  }, []);

  const selectedCrop: CropInfo = CROPS.find(c => c.id === selectedCropId) || orderedCrops[0];
  const cropKnowledge: CropDetailedKnowledge = CROP_KNOWLEDGE_LIST[selectedCrop.id] || CROP_KNOWLEDGE_LIST.rubber;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 pb-20">
      
      {/* Top Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <span className="material-symbols-outlined text-[180px] text-white">agriculture</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-3 border border-emerald-400/30">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>TipGROW คู่มือดิน</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ข้อมูลพืช 8 ชนิดและการจัดการปุ๋ย
          </h1>
        </div>
      </div>

      {/* Main Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'crops'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychiatry</span>
          <span>ข้อมูลพืช</span>
        </button>
        <button
          onClick={() => setActiveTab('soil_types')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'soil_types'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">layers</span>
          <span>การใช้ปุ๋ยกับชนิดดิน</span>
        </button>
        <button
          onClick={() => setActiveTab('nutrients')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'nutrients'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">nutrition</span>
          <span>ธาตุอาหาร N-P-K</span>
        </button>
        <button
          onClick={() => setActiveTab('productivity')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'productivity'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span>เคล็ดลับเพิ่มผลผลิต</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CROPS DETAIL - VISUAL FIRST REDESIGN */}
      {/* ========================================================================= */}
      {activeTab === 'crops' && (
        <div className="space-y-8">
          
          {/* Section: Visual Crop Ribbon Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h2 className="text-base sm:text-lg font-black text-emerald-950">
                  เลือกพืชที่สนใจ
                </h2>
              </div>
            </div>

            {/* 8 Crop Cards Grid with Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
              {orderedCrops.map((c) => {
                const isSelected = c.id === selectedCropId;
                const photoData = CROP_PHOTO_GALLERY[c.id];
                const orderNumber = ORDERED_CROP_IDS.indexOf(c.id) + 1;

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCropId(c.id);
                    }}
                    className={`group relative rounded-2xl p-2.5 sm:p-3 text-left transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/30 shadow-sm -translate-y-0.5'
                        : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 hover:border-emerald-300'
                    }`}
                  >
                    {/* Order Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {orderNumber}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-emerald-700 text-[16px]">
                          check_circle
                        </span>
                      )}
                    </div>

                    {/* Crop Image Thumbnail */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 shadow-2xs relative border border-emerald-900/10">
                      <img
                        src={photoData?.photoUrl || c.avatarUrl}
                        alt={c.nameTh}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          isSelected ? 'scale-105' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected ? 'text-emerald-950 font-black' : 'text-stone-800'
                      }`}>
                        {c.nameTh}
                      </h3>
                      <p className="text-[10px] text-stone-500 truncate">{c.nameEn}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HERO VISUAL SHOWCASE FOR THE SELECTED CROP */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-8">
            
            {/* Top Bar: Title & Primary CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-xs shrink-0 bg-emerald-50/50 p-1">
                  <img
                    src={selectedCrop.avatarUrl}
                    alt={selectedCrop.nameTh}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1 border border-emerald-200">
                    <span>ลำดับที่ {cropKnowledge.order} ในคู่มือ TipGROW</span>
                    <span>•</span>
                    <span>{selectedCrop.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                    {selectedCrop.nameTh} <span className="text-stone-400 font-medium text-lg sm:text-xl">({selectedCrop.nameEn})</span>
                  </h2>
                </div>
              </div>

              {/* Direct Jump to Calculator */}
              <button
                onClick={() => onSelectCropForCalc(selectedCrop.id)}
                className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start md:self-center"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>คำนวณสูตรปุ๋ย{selectedCrop.nameTh}</span>
              </button>
            </div>

            {/* Visual KPI Specs Cards & Key Attributes */}
            <div className="space-y-4">
              
              {/* 4 Quick KPI Visual Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* KPI 1: ระยะปลูก */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-2xs flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">straighten</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800 font-semibold block">ระยะปลูกมาตรฐาน</span>
                    <strong className="text-sm sm:text-base font-black text-emerald-950">
                      {selectedCrop.spacingDesc}
                    </strong>
                  </div>
                </div>

                {/* KPI 2: จำนวนต้นต่อไร่ */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 shadow-2xs flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">forest</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-teal-800 font-semibold block">จำนวนต้นต่อไร่ (เฉลี่ย)</span>
                    <strong className="text-sm sm:text-base font-black text-teal-950">
                      {selectedCrop.defaultTreesPerRai} ต้น/ไร่
                    </strong>
                  </div>
                </div>

                {/* KPI 3: pH ดินที่เหมาะสม */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-800 font-semibold block">ระดับ pH ดินที่เหมาะสม</span>
                    <strong className="text-sm sm:text-base font-black text-amber-950">
                      5.8 - 6.5 <span className="text-[11px] font-normal text-stone-500">(กรดอ่อน)</span>
                    </strong>
                  </div>
                </div>

                {/* KPI 4: น้ำและการระบายน้ำ */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-2xs flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">water_drop</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-blue-800 font-semibold block">ความต้องการน้ำ</span>
                    <strong className="text-sm sm:text-base font-black text-blue-950">
                      ชุ่มชื้น / ระบายน้ำดี
                    </strong>
                  </div>
                </div>
              </div>

              {/* Agronomic Quick Facts Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-emerald-50/40 to-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">psychiatry</span>
                  <span>สรุปสาระสำคัญด้านการจัดการปุ๋ยสำหรับ {selectedCrop.nameTh}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {cropKnowledge.sections.nutritionRequirements}
                </p>
              </div>

              {/* Direct Action Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-stone-400 font-medium">สูตรปุ๋ยเด่นประจำพืช:</span>
                {selectedCrop.stages.map((stg) => (
                  <span
                    key={stg.id}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 font-bold border border-stone-200 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px] text-emerald-700">inventory_2</span>
                    <span>{stg.commercialFormula}</span>
                  </span>
                ))}
              </div>

            </div>

            {/* INFOGRAPHIC CARDS SECTION */}
            <div className="space-y-6 pt-4">

              {/* CARD 1: การปรับใช้กับชนิดดิน 3 แบบ (Soil Adaptation Matrix) */}
              <div className="rounded-3xl p-5 sm:p-6 bg-stone-50/80 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-emerald-950">
                        การปรับใช้ตามชนิดดินสำหรับ {selectedCrop.nameTh}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        ดินแต่ละประเภทมีความสามารถกักเก็บธาตุอาหารและน้ำแตกต่างกัน
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                    ดินและสภาพแวดล้อม
                  </span>
                </div>

                {/* 3 Columns: ดินร่วน / ดินเหนียว / ดินทราย */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  
                  {/* ดินร่วน */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-700 text-[20px]">eco</span>
                        <strong className="text-emerald-950 text-sm font-black">ดินร่วน (Loam)</strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        ⭐ เหมาะสมที่สุด
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      ราก{selectedCrop.nameTh}เจริญเติบโตได้ดีที่สุด การดูดซึมปุ๋ยมีประสิทธิภาพสม่ำเสมอ
                    </p>
                    <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-900 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>ใส่ปุ๋ยตามอายุต้นและช่วงการเจริญเติบโต</span>
                    </div>
                  </div>

                  {/* ดินเหนียว */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-stone-600 text-[20px]">water_drop</span>
                        <strong className="text-stone-900 text-sm font-black">ดินเหนียว (Clay)</strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                        อุ้มน้ำแน่น / ระบายช้า
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      กักปุ๋ยได้ดี แต่ต้องระวังน้ำขังจนรากเน่าโคนเน่า โดยเฉพาะช่วงฤดูฝน
                    </p>
                    <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-900 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>จัดระบบระบายน้ำ + เติมปุ๋ยหมักปรับโครงสร้าง</span>
                    </div>
                  </div>

                  {/* ดินทราย */}
                  <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-700 text-[20px]">grain</span>
                        <strong className="text-amber-950 text-sm font-black">ดินทราย (Sand)</strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        ซึมไว / เสี่ยงชะล้าง
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      น้ำระบายเร็ว แต่เก็บปุ๋ยได้น้อย เสี่ยงต่อการสูญเสียธาตุอาหารจากการชะล้าง
                    </p>
                    <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-900 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">alt_route</span>
                      <span>แบ่งใส่ปุ๋ยเป็นครั้งย่อย ๆ + คลุมโคนด้วยอินทรีย์</span>
                    </div>
                  </div>

                </div>

                <div className="p-3.5 rounded-xl bg-emerald-100/60 border border-emerald-200 text-xs text-emerald-950 font-medium">
                  <strong>💡 สรุปสภาพดินเฉพาะสำหรับ {selectedCrop.nameTh}:</strong> {cropKnowledge.sections.soilAndEnvironment}
                </div>
              </div>

              {/* CARD 2: การดูแลรักษาดินและการจัดการน้ำ (Soil Care & Mulching) */}
              <div className="rounded-3xl p-5 sm:p-6 bg-stone-50/80 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-emerald-950">
                        การดูแลรักษาดินและการจัดการน้ำสำหรับ {selectedCrop.nameTh}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        เพิ่มอินทรียวัตถุ คลุมโคน และควบคุมความชื้นให้เหมาะสม
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                    การจัดการแปลง
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">yard</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900">คลุมดินด้วยอินทรียวัตถุ</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      ใช้เศษใบไม้ ใบหญ้า หรือปุ๋ยหมักคลุมดินใต้ทรงพุ่ม เว้นระยะจากโคนต้น 20-30 ซม. เพื่อรักษาความชื้นและลดการระเหยของน้ำ
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">waves</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900">จัดการระบบระบายน้ำ</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      ทำร่องระบายน้ำ ป้องกันน้ำท่วมขังในฤดูฝน เพราะราก{selectedCrop.nameTh}ต้องการออกซิเจนเพื่อดูดซึมธาตุอาหาร
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">biotech</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900">ตรวจวิเคราะห์ดินเป็นประจำ</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      ตรวจวัดค่า pH และปริมาณ N-P-K ทุกปี เพื่อปรับปรุงค่าความเป็นกรด-ด่าง และเลือกสูตรปุ๋ยได้อย่างตรงเป้าหมาย
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 font-medium">
                  <strong>💡 แนวปฏิบัติแนะนำ:</strong> {cropKnowledge.sections.soilCareAndMaintenance}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOIL TYPES & FERTILIZATION */}
      {/* ========================================================================= */}
      {activeTab === 'soil_types' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          
          {/* Header Title & Overview */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">layers</span>
              <span>การจัดการธาตุอาหารตามลักษณะดิน</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              การใช้ปุ๋ยอย่างเหมาะกับชนิดดิน
            </h3>
            
            {/* Overview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200 text-stone-800">
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                การใส่ปุ๋ยให้เหมาะสมควรพิจารณาจากชนิดของดิน ความต้องการของพืช อายุของพืช และสภาพพื้นที่ เพราะดินแต่ละชนิดมีความสามารถในการเก็บน้ำและธาตุอาหารแตกต่างกัน การใช้ปุ๋ยในปริมาณที่เหมาะสมจะช่วยให้พืชได้รับสารอาหารอย่างเพียงพอ ลดการสูญเสียปุ๋ย และช่วยลดต้นทุนการผลิต
              </p>
            </div>
          </div>

          {/* 3 Main Soil Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. ดินทราย (Sandy Soil) */}
            <div className="rounded-3xl p-5 sm:p-6 border-2 border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">grain</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                    ระบายน้ำเร็ว / ซึมไว
                  </span>
                </div>

                <h4 className="text-lg font-black text-amber-950 mb-2 flex items-center gap-1.5">
                  <span>ดินทราย (Sandy Soil)</span>
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  ดินทรายมีการระบายน้ำได้ดี แต่เก็บน้ำและธาตุอาหารได้น้อย จึงควรเพิ่มอินทรียวัตถุ เช่น ปุ๋ยหมักหรือปุ๋ยคอก และแบ่งการใส่ปุ๋ยเป็นครั้ง ๆ เพื่อป้องกันการสูญเสียธาตุอาหาร
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">water_drop</span>
                  <span>การอุ้มน้ำ: <strong>ต่ำ (ระบายน้ำดี)</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">nutrition</span>
                  <span>การกักปุ๋ย: <strong>สูญเสียง่าย / ถูกชะล้างไว</strong></span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-100/70 text-[11px] text-amber-950 font-bold border border-amber-200">
                  💡 เทคนิค: แบ่งใส่ปุ๋ยทีละน้อยแต่บ่อยครั้ง + คลุมโคนด้วยอินทรียวัตถุ
                </div>
              </div>
            </div>

            {/* 2. ดินเหนียว (Clay Soil) */}
            <div className="rounded-3xl p-5 sm:p-6 border-2 border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-300/60 text-stone-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300">
                    อุ้มน้ำแน่น / ตรึงปุ๋ยดี
                  </span>
                </div>

                <h4 className="text-lg font-black text-stone-900 mb-2 flex items-center gap-1.5">
                  <span>ดินเหนียว (Clay Soil)</span>
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  ดินเหนียวสามารถเก็บน้ำและธาตุอาหารได้ดี แต่ระบายน้ำได้ช้า ควรเพิ่มอินทรียวัตถุเพื่อช่วยปรับโครงสร้างดิน และควรระมัดระวังการให้น้ำหรือใส่ปุ๋ยมากเกินไป
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <span className="material-symbols-outlined text-[16px] text-stone-600">opacity</span>
                  <span>การอุ้มน้ำ: <strong>สูงมาก (ระบายน้ำช้า)</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <span className="material-symbols-outlined text-[16px] text-stone-600">lock</span>
                  <span>การกักปุ๋ย: <strong>กักธาตุอาหารได้ดีเยี่ยม</strong></span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-200/70 text-[11px] text-stone-900 font-bold border border-stone-300">
                  💡 เทคนิค: เติมปุ๋ยหมักเพิ่มความร่วนซุย ระวังน้ำขังรากเน่าและปุ๋ยสะสมเกิน
                </div>
              </div>
            </div>

            {/* 3. ดินร่วน (Loam Soil) */}
            <div className="rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50/80 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">eco</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    สมดุลเหมาะสมที่สุด
                  </span>
                </div>

                <h4 className="text-lg font-black text-emerald-950 mb-2 flex items-center gap-1.5">
                  <span>ดินร่วน (Loam Soil)</span>
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  ดินร่วนมีคุณสมบัติค่อนข้างเหมาะสมต่อการเพาะปลูก เพราะสามารถเก็บความชื้นและระบายน้ำได้ดี ควรใส่ปุ๋ยตามความต้องการของพืชและรักษาปริมาณอินทรียวัตถุในดินอย่างสม่ำเสมอ
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">check_circle</span>
                  <span>การอุ้มน้ำ: <strong>สมดุลยอดเยี่ยม (ชุ่มชื้นพอดี)</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">published_with_changes</span>
                  <span>การกักปุ๋ย: <strong>พืชดูดซึมได้มีประสิทธิภาพสูงสุด</strong></span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-100/70 text-[11px] text-emerald-950 font-bold border border-emerald-200">
                  💡 เทคนิค: ให้ปุ๋ยตามช่วงวัยพืช รักษาหน้าดินด้วยอินทรียวัตถุสม่ำเสมอ
                </div>
              </div>
            </div>

          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto pt-2">
            <h4 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">table_chart</span>
              <span>ตารางเปรียบเทียบคุณสมบัติและการจัดการปุ๋ยตามชนิดดิน</span>
            </h4>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-900 text-white">
                  <th className="p-3 rounded-tl-xl w-1/4">ชนิดดิน</th>
                  <th className="p-3 w-1/4">การระบายน้ำ & การอุ้มน้ำ</th>
                  <th className="p-3 w-1/4">การเก็บกักธาตุอาหาร</th>
                  <th className="p-3 rounded-tr-xl w-1/4">กลยุทธ์การใส่ปุ๋ยที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="bg-amber-50/40">
                  <td className="p-3 font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>ดินทราย</span>
                  </td>
                  <td className="p-3 text-stone-700">ระบายน้ำได้ดีมาก แต่เก็บน้ำได้น้อย</td>
                  <td className="p-3 text-stone-700">เก็บธาตุอาหารได้น้อย เสี่ยงชะล้างสูง</td>
                  <td className="p-3 text-stone-900 font-semibold">
                    เพิ่มอินทรียวัตถุ (ปุ๋ยหมัก/คอก) และแบ่งใส่ปุ๋ยเป็นครั้ง ๆ
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3 font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
                    <span>ดินเหนียว</span>
                  </td>
                  <td className="p-3 text-stone-700">เก็บน้ำได้ดีเยี่ยม แต่ระบายน้ำได้ช้า</td>
                  <td className="p-3 text-stone-700">เก็บกักธาตุอาหารได้ดี ตรึงปุ๋ยสูง</td>
                  <td className="p-3 text-stone-900 font-semibold">
                    เพิ่มอินทรียวัตถุเพื่อปรับโครงสร้าง ระวังให้น้ำหรือใส่ปุ๋ยมากเกินไป
                  </td>
                </tr>
                <tr className="bg-emerald-50/60">
                  <td className="p-3 font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>ดินร่วน</span>
                  </td>
                  <td className="p-3 text-stone-700">เก็บความชื้นและระบายน้ำได้ดี เหมาะสมที่สุด</td>
                  <td className="p-3 text-stone-700">ดูดซับและปลดปล่อยธาตุอาหารได้ดีเลิศ</td>
                  <td className="p-3 text-emerald-950 font-semibold">
                    ใส่ปุ๋ยตามความต้องการของพืช และรักษาอินทรียวัตถุอย่างสม่ำเสมอ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Principle / Advice Callout */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-emerald-300 text-2xl">biotech</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                  หลักการสำคัญ
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  คำแนะนำสำคัญก่อนการใส่ปุ๋ย
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                ก่อนใส่ปุ๋ยควรตรวจวิเคราะห์ดินเพื่อทราบระดับธาตุอาหารและความเป็นกรด-ด่างของดิน จากนั้นจึงเลือกสูตรและปริมาณปุ๋ยที่เหมาะสมกับพืช
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PLANT NUTRIENTS */}
      {/* ========================================================================= */}
      {activeTab === 'nutrients' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-7">
          
          {/* Header Title & Overview */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">nutrition</span>
              <span>โภชนาการพืชและการดูดซึมสารอาหาร</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              ธาตุอาหารพืช
            </h3>
            
            {/* Overview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200 text-stone-800">
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                พืชต้องการธาตุอาหารหลายชนิดเพื่อใช้ในการเจริญเติบโต สร้างใบ ราก ดอก และผล ธาตุอาหารแต่ละชนิดมีหน้าที่แตกต่างกัน และพืชจำเป็นต้องได้รับในปริมาณที่เหมาะสม
              </p>
            </div>
          </div>

          {/* Section 1: ธาตุอาหารหลัก (Primary Macronutrients: N-P-K) */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h4 className="text-base sm:text-lg font-black text-emerald-950">
                  ธาตุอาหารหลัก (Primary Macronutrients)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                ธาตุอาหารหลัก ได้แก่ ไนโตรเจน (N) ฟอสฟอรัส (P) และโพแทสเซียม (K) โดยไนโตรเจนช่วยส่งเสริมการเจริญเติบโตของลำต้นและใบ ฟอสฟอรัสช่วยในการพัฒนาราก การออกดอก และการสร้างเมล็ด ส่วนโพแทสเซียมช่วยเสริมความแข็งแรงของพืชและช่วยพัฒนาคุณภาพของผลผลิต
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* N Card */}
              <div className="p-5 rounded-3xl bg-blue-50/60 border-2 border-blue-200 hover:bg-blue-50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                      N
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-300">
                      สร้างใบ & กิ่งก้าน
                    </span>
                  </div>
                  <h5 className="text-base font-black text-blue-950 mb-1">
                    ไนโตรเจน (Nitrogen)
                  </h5>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    ส่งเสริมการเจริญเติบโตของลำต้นและใบ เป็นองค์ประกอบหลักของคลอโรฟิลล์ กรดอะมิโน และโปรตีน ช่วยให้พืชสร้างทรงพุ่มเขียวชอุ่มและสังเคราะห์แสงได้อย่างเต็มที่
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200/80 text-[11px] text-blue-900 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">energy_savings_leaf</span>
                  <span>บทบาทหลัก: เร่งโต เร่งใบ ลำต้นสมบูรณ์</span>
                </div>
              </div>

              {/* P Card */}
              <div className="p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-200 hover:bg-amber-50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                      P
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                      ราก ดอก & เมล็ด
                    </span>
                  </div>
                  <h5 className="text-base font-black text-amber-950 mb-1">
                    ฟอสฟอรัส (Phosphorus)
                  </h5>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    ช่วยในการพัฒนาราก การออกดอก และการสร้างเมล็ด มีส่วนสำคัญในการถ่ายทอดพลังงาน (ATP) ภายในเซลล์พืช ทำให้ระบบรากแผ่กว้าง ดูดซับอาหารได้ดี และสะสมตาดอกสมบูรณ์
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">psychiatry</span>
                  <span>บทบาทหลัก: รากแข็งแรง ดอกดก ติดเมล็ดดี</span>
                </div>
              </div>

              {/* K Card */}
              <div className="p-5 rounded-3xl bg-rose-50/60 border-2 border-rose-200 hover:bg-rose-50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                      K
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs border border-rose-300">
                      ขยายผล & เสริมแกร่ง
                    </span>
                  </div>
                  <h5 className="text-base font-black text-rose-950 mb-1">
                    โพแทสเซียม (Potassium)
                  </h5>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    ช่วยเสริมความแข็งแรงของพืชและช่วยพัฒนาคุณภาพของผลผลิต ควบคุมการเปิด-ปิดปากใบ การลำเลียงน้ำตาลและแป้ง ช่วยเพิ่มน้ำหนัก รสชาติ ความหวาน และความทนทานต่อสภาพแห้งแล้งหรือโรค
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] text-rose-900 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-rose-600">verified</span>
                  <span>บทบาทหลัก: ผลโต เนื้อแน่น รสหวาน ต้านทานโรค</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ธาตุอาหารรอง และ จุลธาตุ */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <h4 className="text-base sm:text-lg font-black text-emerald-950">
                  ธาตุอาหารรอง และ จุลธาตุ (Secondary & Micronutrients)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                นอกจากนี้พืชยังต้องการธาตุอาหารรอง ได้แก่ แคลเซียม แมกนีเซียม และกำมะถัน รวมถึงจุลธาตุ เช่น เหล็ก สังกะสี แมงกานีส ทองแดง โบรอน โมลิบดีนัม คลอรีน และนิกเกิล แม้พืชต้องการในปริมาณน้อย แต่มีความสำคัญต่อกระบวนการต่าง ๆ ภายในพืช
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Secondary Nutrients */}
              <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-700 text-[18px]">interests</span>
                    <span>ธาตุอาหารรอง (Secondary Nutrients)</span>
                  </h5>
                  <span className="text-[11px] text-stone-500 font-medium">ต้องการปานกลาง</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                    <span className="font-black text-teal-900 text-sm block">แคลเซียม</span>
                    <span className="text-[10px] text-teal-700 font-bold">(Ca)</span>
                    <p className="text-[11px] text-stone-600 mt-1">โครงสร้างผนังเซลล์ ขั้วเหนียว ผลไม่แตก</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                    <span className="font-black text-teal-900 text-sm block">แมกนีเซียม</span>
                    <span className="text-[10px] text-teal-700 font-bold">(Mg)</span>
                    <p className="text-[11px] text-stone-600 mt-1">ใจกลางคลอโรฟิลล์ ใบเขียวเข้ม สร้างพลังงาน</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                    <span className="font-black text-teal-900 text-sm block">กำมะถัน</span>
                    <span className="text-[10px] text-teal-700 font-bold">(S)</span>
                    <p className="text-[11px] text-stone-600 mt-1">สร้างกลิ่นเฉพาะตัว โปรตีนและวิตามิน</p>
                  </div>
                </div>
              </div>

              {/* Micronutrients */}
              <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-[18px]">grain</span>
                    <span>จุลธาตุ / ธาตุอาหารเสริม (Micronutrients)</span>
                  </h5>
                  <span className="text-[11px] text-stone-500 font-medium">ต้องการปริมาณน้อยแต่ขาดไม่ได้</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>เหล็ก (Fe)</strong> • สังเคราะห์คลอโรฟิลล์
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>สังกะสี (Zn)</strong> • ฮอร์โมนออกซิน ยอดไม่หดสั้น
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>แมงกานีส (Mn)</strong> • ระบบเอนไซม์ย่อยสลาย
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>ทองแดง (Cu)</strong> • การหายใจและการสืบพันธุ์
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>โบรอน (B)</strong> • ผสมเกสร การงอกละอองเรณู
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>โมลิบดีนัม (Mo)</strong> • ตรึงและแปรรูปไนโตรเจน
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>คลอรีน (Cl)</strong> • รักษาสมดุลแรงดันออสโมซิส
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium shadow-2xs">
                    <strong>นิกเกิล (Ni)</strong> • การทำงานของเอนไซม์ยูรีเอส
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: การขาดธาตุอาหารและการตรวจสอบดิน */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-amber-700/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                  ข้อสังเกตและคำแนะนำ
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  อาการผิดปกติจากการขาดธาตุอาหาร
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                การขาดธาตุอาหารอาจทำให้พืชโตช้า ใบเปลี่ยนสี รากไม่แข็งแรง ออกดอกหรือให้ผลผลิตลดลง ดังนั้นควรสังเกตอาการของพืชและตรวจสอบดินร่วมด้วยก่อนเพิ่มปริมาณปุ๋ย
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRODUCTIVITY TIPS */}
      {/* ========================================================================= */}
      {activeTab === 'productivity' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-7">
          
          {/* Header Title & Overview */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>กลยุทธ์การจัดการแปลงแบบบูรณาการ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              เคล็ดลับการเพิ่มผลผลิต
            </h3>
            
            {/* Overview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200 text-stone-800">
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                การเพิ่มผลผลิตไม่ได้ขึ้นอยู่กับการใส่ปุ๋ยเพียงอย่างเดียว แต่ต้องจัดการทั้งพันธุ์พืช ดิน น้ำ ปุ๋ย และสภาพแวดล้อมให้เหมาะสมร่วมกัน
              </p>
            </div>
          </div>

          {/* 4 Core Pillars of Productivity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Pillar 1: พันธุ์พืชและช่วงเวลาปลูก */}
            <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/40 border-2 border-amber-200 hover:bg-amber-50/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">eco</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                    เสาหลักที่ 1
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-amber-950 mb-2">
                  การเลือกพันธุ์พืชและช่วงเวลาปลูก
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  ควรเลือกพันธุ์พืชที่เหมาะกับสภาพพื้นที่และสภาพอากาศ รวมถึงเลือกช่วงเวลาปลูกให้เหมาะสม เพื่อให้พืชสามารถเจริญเติบโตได้เต็มศักยภาพ
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80 space-y-1.5 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">check_circle</span>
                  <span>เลือกพันธุ์ที่ทนทานต่อโรคประจำถิ่นและสภาพดินในพื้นที่</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">calendar_month</span>
                  <span>ปลูกสอดคล้องกับวงจรฤดูกาล หลีกเลี่ยงช่วงสภาพอากาศรุนแรง</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: การเตรียมดินและการใช้ปุ๋ย */}
            <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-300 hover:bg-emerald-50/80 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">science</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    เสาหลักที่ 2
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-emerald-950 mb-2">
                  การเตรียมดินและการใช้ปุ๋ยอย่างแม่นยำ
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  ควรเตรียมดินให้เหมาะสมก่อนปลูก และตรวจวิเคราะห์ดินเพื่อวางแผนการใช้ปุ๋ย การใส่ปุ๋ยควรเลือกสูตรและปริมาณให้ตรงกับความต้องการของพืชในแต่ละช่วงการเจริญเติบโต ไม่ควรใส่ปุ๋ยมากเกินความจำเป็น เพราะอาจทำให้ต้นทุนเพิ่มขึ้นและส่งผลเสียต่อดินและสิ่งแวดล้อม
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">biotech</span>
                  <span>ตรวจค่า pH และปริมาณธาตุอาหารในดินก่อนตัดสินใจซื้อปุ๋ย</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">savings</span>
                  <span>ใส่ปุ๋ยตรงระยะการเจริญเติบโต ลดการสูญเปล่าและประหยัดต้นทุน</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: การจัดการน้ำและอารักขาพืช */}
            <div className="p-5 sm:p-6 rounded-3xl bg-blue-50/50 border-2 border-blue-200 hover:bg-blue-50/80 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-300">
                    เสาหลักที่ 3
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-blue-950 mb-2">
                  การจัดการน้ำและการป้องกันโรคแมลง
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  การจัดการน้ำก็มีความสำคัญ ควรให้น้ำอย่างเหมาะสมกับชนิดและระยะการเจริญเติบโตของพืช รวมถึงหมั่นตรวจสอบโรค แมลง และวัชพืชอย่างสม่ำเสมอ
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200/80 space-y-1.5 text-xs text-blue-950">
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-blue-700">water</span>
                  <span>ควบคุมปริมาณน้ำตามระยะสำคัญ เช่น ช่วงฟื้นต้น เปิดตาดอก และพัฒนาผล</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-blue-700">pest_control</span>
                  <span>เดินสำรวจแปลงสัปดาห์ละ 1-2 ครั้งเพื่อควบคุมศัตรูพืชได้ทันท่วงที</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: การบันทึกข้อมูลการปลูก */}
            <div className="p-5 sm:p-6 rounded-3xl bg-teal-50/50 border-2 border-teal-200 hover:bg-teal-50/80 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-800 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">fact_check</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
                    เสาหลักที่ 4
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-teal-950 mb-2">
                  การบันทึกข้อมูลเพื่อเปรียบเทียบและพัฒนา
                </h4>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  การบันทึกข้อมูลการปลูก เช่น วันที่ปลูก ปริมาณปุ๋ย ปริมาณน้ำ และผลผลิต จะช่วยให้เกษตรกรสามารถนำข้อมูลมาเปรียบเทียบและปรับปรุงการจัดการในรอบการปลูกครั้งต่อไปได้อย่างมีประสิทธิภาพ
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-teal-200/80 space-y-1.5 text-xs text-teal-950">
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-teal-700">analytics</span>
                  <span>จดบันทึกต้นทุนและปริมาณผลผลิตเพื่อคำนวณกำไรสุทธิต่อไร่</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-teal-700">history_edu</span>
                  <span>ใช้ประวัติการคำนวณใน TipGROW วิเคราะห์เปรียบเทียบระหว่างรอบปลูก</span>
                </div>
              </div>
            </div>

          </div>

          {/* Integrated Action Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-300">tips_and_updates</span>
                <span>ยกระดับผลผลิตแปลงของคุณด้วยระบบคำนวณปุ๋ยแม่นยำ</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                TipGROW ช่วยให้คุณคำนวณสูตรปุ๋ยที่ตรงกับระยะพืช สภาพดิน และขนาดพื้นที่ พร้อมระบบบันทึกประวัติแปลง
              </p>
            </div>
            <button
              onClick={() => onSelectCropForCalc('durian')}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>เริ่มคำนวณสูตรปุ๋ย</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};