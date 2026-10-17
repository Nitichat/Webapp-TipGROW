import React, { useState } from 'react';
import { CROPS } from '../data/agronomy.ts';

interface KnowledgeHubProps {
  onSelectCropForCalc: (cropId: string) => void;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ onSelectCropForCalc }) => {
  const [activeTab, setActiveTab] = useState<'crops' | 'soil_ph' | 'single_salts' | 'sampling'>('crops');
  const [selectedCropId, setSelectedCropId] = useState<string>('durian');

  const selectedCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 pt-4 pb-16">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-emerald-950">
          คลังความรู้ & คู่มือวิชาการปุ๋ยแม่นยำ
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          รวมหลักวิชาการสรีรวิทยาพืช 8 ชนิด การจัดการดิน และเทคนิคปุ๋ยสั่งตัดลดต้นทุน
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'crops'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychiatry</span>
          <span>คู่มือพืชเศรษฐกิจ 8 ชนิด</span>
        </button>
        <button
          onClick={() => setActiveTab('soil_ph')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'soil_ph'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>การปรับ pH ดินด้วยโดโลไมท์</span>
        </button>
        <button
          onClick={() => setActiveTab('single_salts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'single_salts'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">science</span>
          <span>วิธีผสมแม่ปุ๋ยสั่งตัด (N-P-K)</span>
        </button>
        <button
          onClick={() => setActiveTab('sampling')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'sampling'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>วิธีเก็บตัวอย่างดินส่งตรวจ</span>
        </button>
      </div>

      {/* TAB 1: CROPS DETAIL */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Crop List Selector (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-1.5">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block px-2 mb-2">
              เลือกพืชที่ต้องการศึกษา
            </span>
            {CROPS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                className={`w-full text-left p-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                  c.id === selectedCropId
                    ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <span className="block font-bold">{c.nameTh}</span>
                    <span className="text-[11px] text-stone-400 font-normal">{c.variety}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-stone-400">
                  chevron_right
                </span>
              </button>
            ))}
          </div>

          {/* Selected Crop Guide View (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCrop.emoji}</span>
                <div>
                  <h3 className="text-xl font-black text-emerald-950">
                    คู่มือธาตุอาหาร: {selectedCrop.nameTh} ({selectedCrop.nameEn})
                  </h3>
                  <p className="text-xs text-stone-500">
                    กลุ่ม: {selectedCrop.category} • พันธุ์แนะนำ: {selectedCrop.variety}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectCropForCalc(selectedCrop.id)}
                className="px-4 py-2 rounded-full bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer shadow-xs"
              >
                คำนวณแปลงนี้ทันที
              </button>
            </div>

            {/* Standard specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-stone-400 block font-medium">ระยะปลูกมาตรฐาน:</span>
                <span className="font-bold text-stone-800">{selectedCrop.spacingDesc}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">จำนวนต้นเฉลี่ย/ไร่:</span>
                <span className="font-bold text-stone-800">{selectedCrop.defaultTreesPerRai} ต้น</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">ระดับ pH ดินที่เหมาะสม:</span>
                <span className="font-bold text-emerald-900">5.8 - 6.5</span>
              </div>
            </div>

            {/* Growth Stages Protocol */}
            <div>
              <h4 className="text-sm font-bold text-emerald-950 mb-3">
                ความต้องการธาตุอาหารและสูตรปุ๋ยแต่ละระยะ
              </h4>
              <div className="space-y-4">
                {selectedCrop.stages.map((stg) => (
                  <div key={stg.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-700 text-[18px]">
                          {stg.icon}
                        </span>
                        {stg.name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                        สูตรแนะนำ: {stg.commercialFormula}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mb-3">{stg.desc}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-[10px] text-stone-400 block">N เป้าหมาย</span>
                        <strong className="text-emerald-900">{stg.targetN} กก./ไร่</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">P เป้าหมาย</span>
                        <strong className="text-emerald-900">{stg.targetP} กก./ไร่</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">K เป้าหมาย</span>
                        <strong className="text-emerald-900">{stg.targetK} กก./ไร่</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOIL PH & DOLOMITE */}
      {activeTab === 'soil_ph' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-emerald-950">
              การจัดการความเป็นกรด-ด่างของดิน (Soil pH) และการใส่ปูนโดโลไมท์
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              ความเป็นกรดด่างเป็นกุญแจสำคัญที่สุดในการปลดปล่อยธาตุอาหาร หากดินเป็นกรด ปุ๋ยที่ใส่จะถูกตรึงไว้ พืชไม่สามารถดูดซึมได้
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-900 text-white">
                  <th className="p-3 rounded-tl-xl">ระดับ pH ดิน</th>
                  <th className="p-3">สถานะของดิน</th>
                  <th className="p-3">ผลกระทบต่อธาตุอาหาร</th>
                  <th className="p-3 rounded-tr-xl">อัตราปูนโดโลไมท์ที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="bg-rose-50/50">
                  <td className="p-3 font-bold text-rose-800">&lt; 4.5</td>
                  <td className="p-3 font-semibold text-rose-800">กรดรุนแรงมาก</td>
                  <td className="p-3 text-stone-600">ฟอสฟอรัสถูกตรึงเกือบ 100%, อะลูมิเนียมเป็นพิษต่อราก</td>
                  <td className="p-3 font-bold text-stone-900">200 - 300 กก. / ไร่</td>
                </tr>
                <tr className="bg-amber-50/50">
                  <td className="p-3 font-bold text-amber-800">4.5 - 5.5</td>
                  <td className="p-3 font-semibold text-amber-800">กรดจัด</td>
                  <td className="p-3 text-stone-600">ฟอสฟอรัส แมกนีเซียม และแคลเซียมดูดซึมได้ต่ำ</td>
                  <td className="p-3 font-bold text-stone-900">100 - 200 กก. / ไร่</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="p-3 font-bold text-emerald-800">5.8 - 6.5</td>
                  <td className="p-3 font-semibold text-emerald-800">เหมาะสมสมดุล (Optimum)</td>
                  <td className="p-3 text-stone-700 font-medium">ปุ๋ย N-P-K และจุลธาตุทุกชนิดทำงานได้สูงสุด</td>
                  <td className="p-3 font-bold text-emerald-800">ไม่ต้องใส่ปูนปรับสภาพ</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-3 font-bold text-stone-700">&gt; 7.5</td>
                  <td className="p-3 font-semibold text-stone-700">ด่างจัด</td>
                  <td className="p-3 text-stone-600">ธาตุเหล็ก แมงกานีส สังกะสีตกตะกอน เกิดอาการใบแก้ว</td>
                  <td className="p-3 font-bold text-stone-900">ใส่กำมะถันผง หรือใช้อินทรียวัตถุหมัก</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
            <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-800 text-[18px]">lightbulb</span>
              ข้อควรระวังในการใส่ปูนโดโลไมท์
            </h5>
            <p className="text-stone-700 leading-relaxed">
              1. <strong>ห้ามใส่ปูนโดโลไมท์พร้อมปุ๋ยไนโตรเจน (ยูเรีย หรือ แอมโมเนียม) ในวันเดียวกัน</strong> เพราะจะทำปฏิกิริยากลายเป็นก๊าซแอมโมเนียระเหยสูญเสียไป
            </p>
            <p className="text-stone-700 leading-relaxed">
              2. ควรหว่านโดโลไมท์กระจายทั่วแปลงก่อนใส่ปุ๋ยเคมีอย่างน้อย <strong>15 - 20 วัน</strong> และรดน้ำให้ชุ่มเพื่อให้ปูนทำปฏิกิริยาลดกรดในดินอย่างสมบูรณ์
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: SINGLE SALTS */}
      {activeTab === 'single_salts' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-emerald-950">
              หลักการคำนวณและผสม "ปุ๋ยสั่งตัด" จากแม่ปุ๋ยเดี่ยว 3 ชนิด
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              ผสมเองตรงตามความต้องการของดิน ช่วยลดต้นทุนค่าปุ๋ยได้ 20 - 30% เมื่อเทียบกับการซื้อปุ๋ยสำเร็จรูป
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                แหล่งไนโตรเจน (N)
              </span>
              <h4 className="text-base font-black text-stone-900 mt-1">ยูเรีย (46-0-0)</h4>
              <p className="text-xs text-stone-600 mt-1">
                มีเนื้อไนโตรเจนบริสุทธิ์ 46 กิโลกรัม ในปุ๋ย 100 กิโลกรัม ช่วยสร้างใบ กิ่งก้าน และการเจริญเติบโตทางลำต้น
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                แหล่งฟอสฟอรัส (P)
              </span>
              <h4 className="text-base font-black text-stone-900 mt-1">แดป DAP (18-46-0)</h4>
              <p className="text-xs text-stone-600 mt-1">
                ไดแอมโมเนียมฟอสเฟต มีฟอสฟอรัส 46% และแถมไนโตรเจน 18% เร่งระบบราก การสะสมอาหาร และการออกดอก
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">
                แหล่งโพแทสเซียม (K)
              </span>
              <h4 className="text-base font-black text-stone-900 mt-1">โพแทสเซียมคลอไรด์ (0-0-60)</h4>
              <p className="text-xs text-stone-600 mt-1">
                มีโพแทสเซียม 60% ช่วยขยายขนาดผล สะสมแป้งและน้ำตาล เพิ่มความหวาน และสร้างความทนทานต่อแล้ง
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAMPLING */}
      {activeTab === 'sampling' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-emerald-950">
              ขั้นตอนการเก็บตัวอย่างดินเพื่อส่งวิเคราะห์ในห้องปฏิบัติการ
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              ความถูกต้องของสูตรปุ๋ยสั่งตัดขึ้นอยู่กับคุณภาพของตัวอย่างดินที่เก็บ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold mb-2">1</span>
              <h5 className="font-bold text-stone-900 mb-1">สุ่มจุดเก็บแบบซิกแซก</h5>
              <p className="text-stone-600">เดินสุ่ม 15-20 จุดต่อแปลงในพื้นที่ที่มีลักษณะดินและความลาดชันสม่ำเสมอ</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold mb-2">2</span>
              <h5 className="font-bold text-stone-900 mb-1">ขุดลึก 0-15 และ 15-30 ซม.</h5>
              <p className="text-stone-600">กวาดเศษใบไม้ออก ขุดหลุมรูปตัว V และปาดดินหนา 1 นิ้วจากขอบหลุม</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold mb-2">3</span>
              <h5 className="font-bold text-stone-900 mb-1">คลุกเคล้าและผึ่งลม</h5>
              <p className="text-stone-600">นำดินทุกจุดมารวมกัน คลุกเคล้าให้เข้ากัน ผึ่งในร่มให้แห้ง ห้ามตากแดด</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold mb-2">4</span>
              <h5 className="font-bold text-stone-900 mb-1">แบ่งตัวอย่าง 500 กรัม</h5>
              <p className="text-stone-600">บรรจุใส่ถุงพลาสติกสะอาด เขียนป้ายชื่อแปลงและวันที่ ส่งตรวจที่สถานีพัฒนาที่ดิน</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
