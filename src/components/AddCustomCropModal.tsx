import React, { useState } from 'react';
import { CropInfo } from '../data/agronomy';

interface AddCustomCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCrop: (newCrop: CropInfo) => void;
  initialCrop?: CropInfo | null;
}

const EMOJI_OPTIONS = ['🌱', '🌿', '🌾', '🌽', '🍅', '🍉', '🍇', '🍓', '🥑', '🍍', '🥭', '🌶️', '🥔', '🥕', '🍎', '🍋'];

export const AddCustomCropModal: React.FC<AddCustomCropModalProps> = ({
  isOpen,
  onClose,
  onSaveCrop,
  initialCrop,
}) => {
  const [nameTh, setNameTh] = useState(initialCrop?.nameTh || '');
  const [nameEn, setNameEn] = useState(initialCrop?.nameEn || '');
  const [variety, setVariety] = useState(initialCrop?.variety || '');
  const [spacingDesc, setSpacingDesc] = useState(initialCrop?.spacingDesc || 'ระยะปลูก 4x4 ม.');
  const [defaultTreesPerRai, setDefaultTreesPerRai] = useState<number>(initialCrop?.defaultTreesPerRai || 100);
  const [emoji, setEmoji] = useState(initialCrop?.emoji || '🌱');

  // Stages
  const [stages, setStages] = useState(
    initialCrop?.stages && initialCrop.stages.length > 0
      ? initialCrop.stages
      : [
          {
            id: 'stage1',
            name: '🌱 ระยะต้นกล้า / ฟื้นฟูต้น',
            desc: 'เร่งการเจริญเติบโตของราก กิ่ง และใบ',
            icon: 'spa',
            targetN: 15,
            targetP: 10,
            targetK: 10,
            commercialFormula: '15-15-15 + 46-0-0',
            commercialRate: '1.0 กก./ต้น',
            commercialBagWeight: 50,
            commercialPricePerBag: 1450,
            timeline: [
              { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยบำรุงต้นทางดิน', desc: 'หว่านรอบทรงพุ่มและรดน้ำตามทันที', badgeColor: 'bg-emerald-600' }
            ]
          },
          {
            id: 'stage2',
            name: '🌸 ระยะออกดอก / สะสมอาหาร',
            desc: 'กระตุ้นตาดอก เสริมความสมบูรณ์ของเกสร',
            icon: 'local_florist',
            targetN: 10,
            targetP: 20,
            targetK: 20,
            commercialFormula: '8-24-24',
            commercialRate: '1.0 กก./ต้น',
            commercialBagWeight: 50,
            commercialPricePerBag: 1650,
            timeline: [
              { week: 'สัปดาห์ที่ 1', title: 'เปิดตาดอก', desc: 'ใส่ปุ๋ยฟอสฟอรัส-โพแทสเซียมสูง', badgeColor: 'bg-primary' }
            ]
          },
          {
            id: 'stage3',
            name: '🍎 ระยะสร้างผล / สะสมน้ำตาล',
            desc: 'ขยายขนาดผล บำรุงเนื้อ เพิ่มความหวานและน้ำหนัก',
            icon: 'grass',
            targetN: 12,
            targetP: 8,
            targetK: 25,
            commercialFormula: '13-13-21',
            commercialRate: '1.5 กก./ต้น',
            commercialBagWeight: 50,
            commercialPricePerBag: 1600,
            timeline: [
              { week: 'สัปดาห์ที่ 1', title: 'บำรุงเนื้อผล', desc: 'เน้นธาตุโพแทสเซียมเพื่อสร้างน้ำตาล', badgeColor: 'bg-amber-600' }
            ]
          }
        ]
  );

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUpdateStage = (field: string, val: any) => {
    setStages(prev => {
      const updated = [...prev];
      updated[activeStageIndex] = {
        ...updated[activeStageIndex],
        [field]: val
      };
      return updated;
    });
  };

  const handleAddStage = () => {
    if (stages.length >= 5) return;
    const newStageIndex = stages.length + 1;
    setStages(prev => [
      ...prev,
      {
        id: `stage${newStageIndex}`,
        name: `ระยะที่ ${newStageIndex}`,
        desc: 'คำอธิบายระยะการเจริญเติบโต',
        icon: 'spa',
        targetN: 10,
        targetP: 10,
        targetK: 10,
        commercialFormula: '15-15-15',
        commercialRate: '1.0 กก./ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1400,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยทางดิน', desc: 'ให้น้ำอย่างสม่ำเสมอ', badgeColor: 'bg-emerald-600' }
        ]
      }
    ]);
    setActiveStageIndex(stages.length);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) {
      setErrorMsg('พืชต้องมีระยะการเจริญเติบโตอย่างน้อย 1 ระยะ');
      return;
    }
    const updated = stages.filter((_, i) => i !== index);
    setStages(updated);
    setActiveStageIndex(Math.max(0, index - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTh.trim()) {
      setErrorMsg('กรุณาระบุชื่อพืชภาษาไทย');
      return;
    }
    if (defaultTreesPerRai <= 0) {
      setErrorMsg('จำนวนต้นต่อไร่ต้องมากกว่า 0');
      return;
    }

    const cropId = initialCrop?.id || `custom_${Date.now()}`;
    const newCrop: CropInfo = {
      id: cropId,
      nameTh: nameTh.trim(),
      nameEn: nameEn.trim() || nameTh.trim(),
      category: 'พืชกำหนดเอง',
      variety: variety.trim() || 'พันธุ์ทั่วไป',
      spacingDesc: spacingDesc.trim() || 'ตามคำแนะนำประจำสวน',
      defaultTreesPerRai: Number(defaultTreesPerRai),
      emoji: emoji || '🌱',
      avatarUrl: '',
      stages: stages.map((st, idx) => ({
        ...st,
        id: st.id || `stage_${idx + 1}`,
        targetN: Number(st.targetN) || 0,
        targetP: Number(st.targetP) || 0,
        targetK: Number(st.targetK) || 0,
        commercialBagWeight: Number(st.commercialBagWeight) || 50,
        commercialPricePerBag: Number(st.commercialPricePerBag) || 1400,
      }))
    };

    onSaveCrop(newCrop);
    onClose();
  };

  const currentStage = stages[activeStageIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-2xl backdrop-blur-sm border border-white/20">
              {emoji}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {initialCrop ? 'แก้ไขพืชกำหนดเอง' : 'เพิ่มพืชใหม่ในระบบคำนวณ'}
              </h3>
              <p className="text-xs text-emerald-200">
                ข้อมูลจะถูกบันทึกไว้ในเครื่องของคุณเพื่อความสะดวกในการคำนวณ
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: ข้อมูลพื้นฐาน */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-600">potted_plant</span>
              ข้อมูลพืชและระยะปลูก
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">ชื่อพืช (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น มะนาวแป้น, ลำไยอีดอ, ผักสลัดไฮโดร"
                  value={nameTh}
                  onChange={(e) => { setNameTh(e.target.value); setErrorMsg(''); }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">ชื่อภาษาอังกฤษ</label>
                <input
                  type="text"
                  placeholder="e.g. Lime, Longan"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">สายพันธุ์</label>
                <input
                  type="text"
                  placeholder="เช่น พันธุ์พื้นเมือง, พันธุ์การค้า"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">ระยะปลูก / รูปแบบ</label>
                <input
                  type="text"
                  placeholder="เช่น ระยะ 4x4 ม., แปลงยกร่อง"
                  value={spacingDesc}
                  onChange={(e) => setSpacingDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">จำนวนต้น/ไร่ (ค่ามาตรฐาน) *</label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  required
                  value={defaultTreesPerRai}
                  onChange={(e) => setDefaultTreesPerRai(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all tabular-nums"
                />
              </div>
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">เลือกสัญลักษณ์ไอคอน</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                      emoji === em
                        ? 'bg-emerald-100 border-2 border-emerald-600 scale-110 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: กำหนดระยะการเติบโตและธาตุอาหารเป้าหมาย */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">tune</span>
                  กำหนดระยะการเจริญเติบโต และความต้องการธาตุอาหาร (N-P-K)
                </h4>
                <p className="text-xs text-slate-500">
                  ระบบจะใช้ค่า N-P-K (กก./ไร่) นี้ในการคำนวณอัตราแม่ปุ๋ย (46-0-0, 18-46-0, 0-0-60)
                </p>
              </div>
              {stages.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  เพิ่มระยะ
                </button>
              )}
            </div>

            {/* Stage Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {stages.map((st, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    activeStageIndex === idx
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{st.name || `ระยะที่ ${idx + 1}`}</span>
                  {stages.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStage(idx);
                      }}
                      className="text-slate-400 hover:text-rose-500 ml-1"
                      title="ลบระยะนี้"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Stage Config Form */}
            {currentStage && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">ชื่อระยะการเติบโต</label>
                    <input
                      type="text"
                      value={currentStage.name}
                      onChange={(e) => handleUpdateStage('name', e.target.value)}
                      placeholder="เช่น ระยะแตกใบอ่อน / สะสมอาหาร"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">คำอธิบายระยะสั้น</label>
                    <input
                      type="text"
                      value={currentStage.desc}
                      onChange={(e) => handleUpdateStage('desc', e.target.value)}
                      placeholder="เช่น เน้นสะสมแป้งและน้ำตาล"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Target N P K */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    ธาตุอาหารเป้าหมาย (กก. ธาตุอาหารบริสุทธิ์ ต่อไร่)
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-blue-700">ไนโตรเจน (N)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={currentStage.targetN}
                        onChange={(e) => handleUpdateStage('targetN', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm text-blue-900 font-semibold tabular-nums"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-amber-700">ฟอสฟอรัส (P₂O₅)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={currentStage.targetP}
                        onChange={(e) => handleUpdateStage('targetP', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg text-sm text-amber-900 font-semibold tabular-nums"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-emerald-700">โพแทสเซียม (K₂O)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={currentStage.targetK}
                        onChange={(e) => handleUpdateStage('targetK', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg text-sm text-emerald-900 font-semibold tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Commercial comparison defaults */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">สูตรปุ๋ยสำเร็จรูปเทียบเคียง</label>
                    <input
                      type="text"
                      value={currentStage.commercialFormula}
                      onChange={(e) => handleUpdateStage('commercialFormula', e.target.value)}
                      placeholder="เช่น 15-15-15 หรือ 8-24-24"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">ราคาปุ๋ยสำเร็จรูปโดยประมาณ (บาท/กระสอบ 50 กก.)</label>
                    <input
                      type="number"
                      min="100"
                      value={currentStage.commercialPricePerBag}
                      onChange={(e) => handleUpdateStage('commercialPricePerBag', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs tabular-nums"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              บันทึกพืชในระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
