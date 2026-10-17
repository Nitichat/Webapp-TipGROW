export interface CropInfo {
  id: string;
  nameTh: string;
  nameEn: string;
  category: string;
  variety: string;
  defaultTreesPerRai: number;
  spacingDesc: string;
  avatarUrl: string;
  emoji: string;
  stages: {
    id: string;
    name: string;
    desc: string;
    icon: string;
    targetN: number; // kg/rai
    targetP: number; // kg/rai
    targetK: number; // kg/rai
    commercialFormula: string;
    commercialRate: string;
    commercialBagWeight: number; // kg
    commercialPricePerBag: number;
    timeline: {
      week: string;
      title: string;
      desc: string;
      badgeColor: string;
    }[];
  }[];
}

export const CROPS: CropInfo[] = [
  {
    id: 'durian',
    nameTh: 'ทุเรียน',
    nameEn: 'Durian',
    category: 'ไม้ผลยืนต้น',
    variety: 'หมอนทอง / ชะนี / ก้านยาว',
    defaultTreesPerRai: 25,
    spacingDesc: 'ระยะปลูก 8x8 ม. (มาตรฐานสวนผลไม้)',
    emoji: '🍈',
    avatarUrl: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ฟื้นฟูต้น/แตกใบอ่อน',
        desc: 'สะสมสารอาหารหลังเก็บเกี่ยว เร่งการแตกใบชุดใหม่ 2-3 ชุด',
        icon: 'spa',
        targetN: 25,
        targetP: 12,
        targetK: 15,
        commercialFormula: '15-15-15 + 46-0-0',
        commercialRate: '1.5 - 2.0 กก./ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1450,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ตัดแต่งกิ่งแขนง และใส่ปุ๋ยทางดิน 1.5 กก./ต้น', desc: 'หว่านรอบรัศมีทรงพุ่ม รดน้ำตามทันที 40-50 ลิตร/ต้น', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 2', title: 'พ่นสารสาหร่ายทะเล + กรดอะมิโนเร่งใบ', desc: 'อัตรา 20 ซีซี ต่อน้ำ 20 ลิตร เพื่อเปิดปากใบรับแสง', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 4', title: 'ตรวจเช็คเพลี้ยไก่แจ้และเชื้อราไฟทอปธอร่า', desc: 'รักษาความชื้นดินสม่ำเสมอ พ่นยาป้องกันตามความจำเป็น', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌸 สะสมอาหาร/เปิดตาดอก',
        desc: 'กดใบอ่อน สะสมแป้งและน้ำตาลเพื่อกระตุ้นตาดอกตามกิ่งประธาน',
        icon: 'local_florist',
        targetN: 12,
        targetP: 24,
        targetK: 24,
        commercialFormula: '8-24-24',
        commercialRate: '1.5 กิโลกรัม / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1650,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยทางดินรอบรัศมีทรงพุ่ม 1.5 กก./ต้น', desc: 'หว่านหลังเปิดหน้าดินเบาๆ ให้น้ำตามทันที 40-50 ลิตรต่อต้น', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นแคลเซียม-โบรอน เสริมทางใบ', desc: 'อัตรา 20 ซีซี ต่อน้ำ 20 ลิตร ช่วยขยายตาดอกและเกสรสมบูรณ์', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 5', title: 'ลดปริมาณน้ำเหลือ 60% คุมความชื้นดิน', desc: 'หยุดปุ๋ยไนโตรเจนชั่วคราวเพื่อป้องกันการแตกใบอ่อนแทงแซงดอก', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🍈 ขยายขนาดผล (สร้างเนื้อ)',
        desc: 'เร่งเซลล์ผล พูลูกสวย หนามเขียว เมล็ดลีบ เนื้อแน่น',
        icon: 'grass',
        targetN: 18,
        targetP: 10,
        targetK: 28,
        commercialFormula: '12-12-17+2MgO',
        commercialRate: '2.0 กิโลกรัม / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1580,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยสูตรโพแทสเซียมสูง 2.0 กก./ต้น', desc: 'กระจายรอบรัศมีทรงพุ่ม ให้น้ำสม่ำเสมอทุก 2 วัน', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 2', title: 'ฉีดพ่นแมกนีเซียมและสังกะสีทางใบ', desc: 'ป้องกันอาการใบเหลืองซีดจากภาวะลูกดึงธาตุอาหาร', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 4', title: 'โยงกิ่งและค้ำกิ่งรับน้ำหนักผล', desc: 'ตรวจวัดขนาดผลคัดเกรด ตัดแต่งลูกทรงบิดเบี้ยวออก', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage4',
        name: '🍯 บำรุงความหวานก่อนเก็บ',
        desc: 'สะสมแป้งเปลี่ยนเป็นน้ำตาล กลิ่นหอม เนื้อเนียนแห้ง',
        icon: 'hive',
        targetN: 8,
        targetP: 8,
        targetK: 32,
        commercialFormula: '0-0-60 (หรือ 13-0-46 ทางใบ)',
        commercialRate: '0.8 - 1.0 กก./ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1620,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'หว่านปุ๋ยโพแทสเซียมคลอไรด์ 0.8 กก./ต้น', desc: 'ใส่ก่อนกำหนดเก็บเกี่ยว 30-45 วัน', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'ลดปริมาณการให้น้ำลง 30%', desc: 'ให้เนื้อแห้งเนียน ไม่แฉะน้ำ เส้นใยเนื้อละเอียด', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 4', title: 'ตรวจเช็คเปอร์เซ็นต์น้ำหนักเนื้อแห้ง', desc: 'เก็บเกี่ยวที่ความแก่ 85% สำหรับส่งออก', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'rubber',
    nameTh: 'ยางพารา',
    nameEn: 'Rubber Tree',
    category: 'พืชไร่/ยาง',
    variety: 'RRIM 600 / RRIT 251 / PB 235',
    defaultTreesPerRai: 76,
    spacingDesc: 'ระยะปลูก 3x7 ม. (ประมาณ 76 ต้น/ไร่)',
    emoji: '🌳',
    avatarUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ต้นยางอ่อนก่อนเปิดกรีด (1-6 ปี)',
        desc: 'เร่งการเจริญเติบโตรอบวงต้นให้ถึง 50 ซม. เร็วขึ้น',
        icon: 'park',
        targetN: 20,
        targetP: 10,
        targetK: 15,
        commercialFormula: '20-8-20',
        commercialRate: '500 กรัม / ต้น / ปี (แบ่งใส่ 2 ครั้ง)',
        commercialBagWeight: 50,
        commercialPricePerBag: 1350,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยรอบโคนต้นห่าง 1 เมตร (ต้นฤดูฝน)', desc: 'ใส่หลังฝนตกชุกดินมีความชื้น ห้ามใส่ตอนดินแห้งแล้ง', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'กำจัดวัชพืชรอบโคนต้นและคลุมโคน', desc: 'ช่วยรักษาความชื้นและลดการแย่งธาตุอาหาร', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 8', title: 'วัดอัตราการเพิ่มของรอบวงต้น', desc: 'บันทึกสถิติเพื่อประเมินความพร้อมเปิดกรีด', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🪵 เปิดกรีดระยะแรก (7-15 ปี)',
        desc: 'บำรุงเปลือกสร้างเซลล์ท่อน้ำยางใหม่ ป้องกันเปลือกแห้ง',
        icon: 'architecture',
        targetN: 30,
        targetP: 8,
        targetK: 20,
        commercialFormula: '30-5-18',
        commercialRate: '1.0 กก. / ต้น / ปี',
        commercialBagWeight: 50,
        commercialPricePerBag: 1420,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'หว่านปุ๋ยระหว่างแถวยางพารา', desc: 'หว่านเป็นแถบกว้าง 1 เมตรกลางร่องยาง', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 4', title: 'ทายาป้องกันเชื้อราเส้นดำหน้ากรีด', desc: 'รักษาหน้ายางให้เรียบเนียน กรีดง่าย น้ำยางไหลสม่ำเสมอ', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 6', title: 'ตรวจสอบค่า DRC (%เนื้อยางแห้ง)', desc: 'สังเกตความเข้มข้นและความหนืดของน้ำยางสด', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '💧 กรีดสม่ำเสมอ/ให้ผลผลิตเต็มที่ (>15 ปี)',
        desc: 'รักษาระดับผลผลิตน้ำยางสดและคุณภาพเนื้อยางแห้ง',
        icon: 'water_drop',
        targetN: 28,
        targetP: 7,
        targetK: 22,
        commercialFormula: '29-5-18',
        commercialRate: '1.2 กก. / ต้น / ปี',
        commercialBagWeight: 50,
        commercialPricePerBag: 1400,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยรอบหลักประจำปีรอบแรก', desc: 'แบ่งใส่ต้นฤดูฝน (พ.ค.-มิ.ย.) และปลายฤดูฝน (ต.ค.)', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'เสริมฮอร์โมนกระตุ้นน้ำยางอย่างถูกวิธี', desc: 'ใช้ความเข้มข้นต่ำไม่เกิน 2.5% และเว้นรอบกรีดพักต้น', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'ตรวจสุขภาพหน้ายางล่างและหน้าซ้ำ', desc: 'ป้องกันภาวะ TPD (Tapping Panel Dryness)', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'coconut',
    nameTh: 'มะพร้าว',
    nameEn: 'Coconut',
    category: 'มะพร้าวน้ำหอม/แกง',
    variety: 'มะพร้าวน้ำหอมก้นจีบ / มะพร้าวแกงชุมพร',
    defaultTreesPerRai: 22,
    spacingDesc: 'ระยะปลูก 8.5x8.5 ม. (แกง) หรือ 6x6 ม. (น้ำหอม ~44 ต้น/ไร่)',
    emoji: '🥥',
    avatarUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ต้นเล็ก/ปลูกใหม่ (1-2 ปี)',
        desc: 'เร่งระบบรากและขยายความกว้างของทางใบ',
        icon: 'yard',
        targetN: 18,
        targetP: 12,
        targetK: 18,
        commercialFormula: '15-15-15 + 21-0-0',
        commercialRate: '1.0 กก. / ต้น / ปี',
        commercialBagWeight: 50,
        commercialPricePerBag: 1390,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ขุดร่องตื้นรอบโคนรัศมี 1 ม. โรยปุ๋ยกลบดิน', desc: 'รดน้ำให้ชุ่มทันที ป้องกันแสงแดดเผาทำลายปุ๋ย', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'โรยเกลือแกง (NaCl) 200 กรัม/ต้น', desc: 'คลอไรด์ช่วยกระตุ้นการดูดซับน้ำและอาหารของมะพร้าว', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 6', title: 'ตรวจเช็คหนอนหัวดำและด้วงแรดมะพร้าว', desc: 'ใส่ลูกเหม็นหรือทรายผสมสารเคมีที่ซอกคอทางใบ', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌴 เริ่มให้ผลผลิต/ติดจั่น (3-5 ปี)',
        desc: 'สร้างจั่นดอกดก เกสรผสมติดง่าย ไม่สลัดลูกอ่อน',
        icon: 'nest_cam_wired_stand',
        targetN: 20,
        targetP: 10,
        targetK: 30,
        commercialFormula: '13-13-21',
        commercialRate: '2.0 กก. / ต้น / ปี',
        commercialBagWeight: 50,
        commercialPricePerBag: 1550,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 13-13-21 อัตรา 1.0 กก./ต้น', desc: 'หว่านห่างโคน 1.5-2.0 เมตร บริเวณปลายทางใบ', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 2', title: 'เสริมเกลือแกง 500 กรัม/ต้น', desc: 'เพิ่มน้ำหนักทะลายและความหวานของน้ำมะพร้าว', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 5', title: 'ฉีดพ่นโบรอนทางจั่นดอก', desc: 'ช่วยให้อัตราการติดลูกสม่ำเสมอเต็มทะลาย', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🥥 ให้ผลผลิตเต็มที่ (>5 ปี)',
        desc: 'รักษาระดับผลผลิตต่อเนื่อง น้ำหอมหวาน เนื้อชั้นครึ่ง',
        icon: 'inventory',
        targetN: 22,
        targetP: 10,
        targetK: 36,
        commercialFormula: '13-13-21 + 0-0-60',
        commercialRate: '2.5 - 3.0 กก. / ต้น / ปี',
        commercialBagWeight: 50,
        commercialPricePerBag: 1590,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'แบ่งใส่ปุ๋ยรอบแรกต้นฤดูฝน', desc: 'ใส่ห่างโคน 2 เมตร พร้อมเกลือสมุทร 1 กก./ต้น', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 4', title: 'ลอกเลนหรือขุดลอกคูน้ำในสวน', desc: 'นำดินตะกอนก้นร่องขึ้นมาโปะโคนต้นบำรุงอินทรียวัตถุ', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 6', title: 'ตัดแต่งทางใบล่างที่แห้งเหี่ยว', desc: 'ระบายแสงแดด ป้องกันการสะสมของศัตรูพืช', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'mangosteen',
    nameTh: 'มังคุด',
    nameEn: 'Mangosteen',
    category: 'ราชินีผลไม้',
    variety: 'มังคุดเมืองนนท์ / มังคุดใต้ / มังคุดจันทบุรี',
    defaultTreesPerRai: 25,
    spacingDesc: 'ระยะปลูก 8x8 ม. (ประมาณ 25 ต้น/ไร่)',
    emoji: '🟣',
    avatarUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ฟื้นฟูต้น/แตกใบชุดใหม่',
        desc: 'ตัดแต่งกิ่งแขนง เร่งใบให้เขียวเข้มเพื่อพร้อมสร้างตาดอก',
        icon: 'energy_savings_leaf',
        targetN: 22,
        targetP: 10,
        targetK: 14,
        commercialFormula: '16-16-16',
        commercialRate: '1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1480,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ตัดกิ่งแห้งในทรงพุ่ม และใส่ปุ๋ย 16-16-16', desc: 'หว่านใต้ทรงพุ่ม ให้น้ำ 30 ลิตร/ต้น', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นธาตุสังกะสีและเหล็ก', desc: 'ลดอาการใบแก้วและเพิ่มความแข็งแรงของใบ', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'ตรวจเช็คหนอนกินใบอ่อนและเพลี้ยไฟ', desc: 'รักษาใบชุดใหม่ให้สมบูรณ์อย่างน้อย 1-2 ชุด', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌸 สะสมตาดอก/สร้างตาดอก',
        desc: 'งดน้ำสร้างความเครียด สะสมฟอสฟอรัสเปิดตาดอก',
        icon: 'temp_preferences_custom',
        targetN: 10,
        targetP: 22,
        targetK: 20,
        commercialFormula: '8-24-24',
        commercialRate: '1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1650,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 8-24-24 ก่อนงดน้ำ', desc: 'หว่านใต้ทรงพุ่ม ให้น้ำเต็มที่ 1 ครั้งแล้วเริ่มคุมน้ำ', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'งดน้ำ 2-3 สัปดาห์จนใบเริ่มสลด', desc: 'กระตุ้นให้ตาใบเปลี่ยนเป็นตาดอก', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 5', title: 'เปิดน้ำกระแทกดอกหลังตาดอกเริ่มผลิ', desc: 'ให้น้ำพอชุ่มเพื่อดึงดอกออกมาพร้อมเพรียงกัน', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🟣 ติดผลอ่อนจนถึงเก็บเกี่ยว',
        desc: 'ป้องกันเนื้อแก้วยางไหล ขยายขนาดผล ผิวผุดผ่อง',
        icon: 'circle',
        targetN: 14,
        targetP: 10,
        targetK: 24,
        commercialFormula: '13-13-21 หรือ 12-12-17+2MgO',
        commercialRate: '1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1560,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 13-13-21 อัตรา 1.5 กก./ต้น', desc: 'กระจายรอบรัศมีทรงพุ่ม ให้น้ำสม่ำเสมออย่าให้ขาด', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นแคลเซียมคลอไรด์ป้องกันเนื้อแก้ว', desc: 'อัตรา 30 กรัม/น้ำ 20 ลิตร ช่วยให้ผนังเซลล์ผลเหนียวแน่น', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'คุมน้ำช่วงใกล้เก็บเกี่ยว', desc: 'เก็บผลระยะสายเลือดเพื่ออายุการวางจำหน่ายสูงสุด', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'rambutan',
    nameTh: 'เงาะ',
    nameEn: 'Rambutan',
    category: 'โรงเรียน/สีชมพู',
    variety: 'เงาะโรงเรียนนาสาร / เงาะสีชมพู',
    defaultTreesPerRai: 25,
    spacingDesc: 'ระยะปลูก 8x8 ม. (ประมาณ 25 ต้น/ไร่)',
    emoji: '🔴',
    avatarUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ตัดแต่งกิ่ง/ฟื้นฟูต้น',
        desc: 'หลังเก็บเกี่ยว ตัดกิ่งกระโดง เร่งแตกใบอ่อน 2 ชุด',
        icon: 'content_cut',
        targetN: 24,
        targetP: 10,
        targetK: 14,
        commercialFormula: '15-15-15 + ยูเรีย 46-0-0',
        commercialRate: '1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1450,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 15-15-15 ร่วมกับปุ๋ยคอก', desc: 'หว่านใต้ทรงพุ่ม รดน้ำให้ชุ่มสม่ำเสมอ', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นปุ๋ยเกล็ดสูตร 30-20-10 ทางใบ', desc: 'เร่งการเจริญเติบโตของใบอ่อนให้พร้อมกัน', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'ตัดแต่งกิ่งไม่สมบูรณ์', desc: 'เพิ่มความโปร่งในทรงพุ่มให้แสงแดดส่องถึง', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌸 สะสมอาหาร/เปิดตาดอก',
        desc: 'สร้างตาดอกสมบูรณ์ ก้านช่อดอกเหนียว',
        icon: 'wb_sunny',
        targetN: 10,
        targetP: 22,
        targetK: 20,
        commercialFormula: '8-24-24',
        commercialRate: '1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1650,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 8-24-24 หว่านรอบทรงพุ่ม', desc: 'รดน้ำพอประมาณแล้วเริ่มลดน้ำกักโศก', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'กักน้ำ 15-20 วันจนยอดเหี่ยวเล็กน้อย', desc: 'บีบให้แทงตาดอกตามปลายกิ่ง', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 5', title: 'ให้น้ำกระตุ้นดอกเมื่อแทงตาดอกชัดเจน', desc: 'ค่อยๆ เพิ่มปริมาณน้ำขึ้นอย่างเป็นระบบ', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🔴 บำรุงผล/ขนเขียว/เนื้อหวานล่อน',
        desc: 'ผลโต ขนสีแดงสดปลายเขียว เนื้อหวานแห้งกรอบไม่ติดเปลือก',
        icon: 'scatter_plot',
        targetN: 14,
        targetP: 10,
        targetK: 26,
        commercialFormula: '13-13-21',
        commercialRate: '1.5 - 2.0 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1550,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 13-13-21 อัตรา 1.5 กก./ต้น', desc: 'ใส่เมื่อผลมีขนาดเท่าหัวแม่มือ ให้น้ำสม่ำเสมอ', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นแคลเซียม-โบรอนทางช่อผล', desc: 'ช่วยให้ขั้วเหนียว ขนยาวสวย ผลไม่แตก', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'หยุดปุ๋ยก่อนเก็บเกี่ยว 15 วัน', desc: 'รักษาความหวานกรอบและไม่ให้เนื้อแฉะ', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'longkong',
    nameTh: 'ลองกอง',
    nameEn: 'Longkong',
    category: 'พันธุ์ตันหยงมัส',
    variety: 'ลองกองตันหยงมัส / ดูกู',
    defaultTreesPerRai: 30,
    spacingDesc: 'ระยะปลูก 7x7 ม. หรือ 6x8 ม. (~30 ต้น/ไร่)',
    emoji: '🟡',
    avatarUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ฟื้นฟูต้น/บำรุงกิ่งก้าน',
        desc: 'ให้ใบสมบูรณ์ กิ่งหลักอวบหนาเพื่อรองรับช่อดอกตามลำต้น',
        icon: 'eco',
        targetN: 20,
        targetP: 10,
        targetK: 15,
        commercialFormula: '15-15-15',
        commercialRate: '1.0 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1450,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 15-15-15 ใต้ทรงพุ่ม', desc: 'โรยห่างโคนต้น 1 เมตร ให้น้ำสม่ำเสมอ', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'ทำความสะอาดลำต้นและกิ่งใหญ่', desc: 'ขูดคราบตะไคร่น้ำและเชื้อราเพื่อให้ตาดอกแทงสะดวก', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'ตรวจเช็คความชื้นใต้ดิน', desc: 'รักษาความชื้นแบบพอดี ไม่แฉะขัง', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌸 สะสมตาดอก/ดึงช่อดอก',
        desc: 'ช่อดอกยาว เม็ดดอกเรียงแน่น ไม่หลุดร่วง',
        icon: 'grain',
        targetN: 10,
        targetP: 22,
        targetK: 20,
        commercialFormula: '8-24-24',
        commercialRate: '1.0 - 1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1650,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 8-24-24 บำรุงตาดอก', desc: 'ให้น้ำตามพอชุ่มแล้วเว้นระยะเพื่อกระตุ้นดอก', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 2', title: 'พ่นโบรอนทางลำต้นและกิ่ง', desc: 'ช่วยให้ช่อดอกยืดยาวและเกสรติดสมบูรณ์', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 4', title: 'ซอยช่อดอกที่แน่นเกินไป', desc: 'คงเหลือเฉพาะช่อที่สมบูรณ์เพื่อให้ผลโตสม่ำเสมอ', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🟡 ขยายผล/สร้างเนื้อหวานใส',
        desc: 'ผลโต ช่อแน่น รสหวานอมเปรี้ยวกลมกล่อม เมล็ดลีบ',
        icon: 'brightness_low',
        targetN: 12,
        targetP: 10,
        targetK: 25,
        commercialFormula: '13-13-21',
        commercialRate: '1.0 - 1.5 กก. / ต้น',
        commercialBagWeight: 50,
        commercialPricePerBag: 1550,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ย 13-13-21 ทางดิน', desc: 'หว่านใต้ทรงพุ่ม ให้น้ำวันเว้นวัน', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'ห่อช่อผลด้วยถุงตาข่ายป้องกันค้างคาวและแมลง', desc: 'ช่วยให้ผิวผลสวยสะอาด ไร้รอยตำหนิ', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 5', title: 'ตรวจเช็คช่อผลพร้อมตัดเก็บ', desc: 'เก็บเกี่ยวช่อผลที่สุกสีเหลืองทองทั่วทั้งช่อ', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'banana',
    nameTh: 'กล้วย',
    nameEn: 'Banana',
    category: 'กล้วยหอม/น้ำว้า/ไข่',
    variety: 'กล้วยหอมทอง / กล้วยน้ำว้ามะลิอ่อง / กล้วยไข่',
    defaultTreesPerRai: 400,
    spacingDesc: 'ระยะปลูก 2x2 ม. (~400 กอ/ไร่)',
    emoji: '🍌',
    avatarUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ระยะปลูกใหม่/แตกหน่อ (1-3 เดือน)',
        desc: 'สร้างระบบรากฝอย ลำต้นเทียมตั้งตัวเร็ว',
        icon: 'psychiatry',
        targetN: 22,
        targetP: 12,
        targetK: 18,
        commercialFormula: '15-15-15 + 46-0-0',
        commercialRate: '150 - 200 กรัม / ต้น / เดือน',
        commercialBagWeight: 50,
        commercialPricePerBag: 1450,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'โรยปุ๋ยห่างโคน 30 ซม. พรวนดินกลบ', desc: 'รดน้ำให้ชุ่มสม่ำเสมอกล้วยชอบน้ำแต่ไม่ชอบแฉะขัง', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'แต่งหน่อเหลือหน่อตาม 1 หน่อ', desc: 'ตัดแต่งหน่อส่วนเกินออกไม่ให้แย่งธาตุอาหารต้นแม่', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 6', title: 'ตรวจเช็คโรคตายพราย (Panama disease)', desc: 'ใส่ปูนโดโลไมท์ปรับปรุงดินหากมีกรดสะสม', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌿 เจริญเติบโตเต็มที่/สร้างใบ (4-6 เดือน)',
        desc: 'สร้างใบขนาดใหญ่ ลำต้นอวบหนาเตรียมแทงปลี',
        icon: 'forest',
        targetN: 25,
        targetP: 10,
        targetK: 30,
        commercialFormula: '20-10-12 หรือ 15-15-15',
        commercialRate: '250 กรัม / ต้น / เดือน',
        commercialBagWeight: 50,
        commercialPricePerBag: 1420,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยรอบโคนต้นห่าง 50 ซม.', desc: 'รดน้ำเช้า-เย็นในวันที่แดดจัด', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'ลิดใบแห้งด้านล่างออก', desc: 'รักษาใบเขียวสมบูรณ์ไว้ 10-12 ใบต่อต้น', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 6', title: 'พูนโคนดินรอบกอ', desc: 'ป้องกันต้นโยกเอนเมื่อมีลมพัด', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🍌 แทงปลี/บำรุงเครือและหวี (7-9 เดือน)',
        desc: 'หวีดก ลูกใหญ่เรียวยาว ผิวเนียน น้ำหนักดี',
        icon: 'star',
        targetN: 15,
        targetP: 8,
        targetK: 40,
        commercialFormula: '13-13-21 หรือ 0-0-60',
        commercialRate: '300 กรัม / ต้น / เดือน',
        commercialBagWeight: 50,
        commercialPricePerBag: 1580,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยเน้นโพแทสเซียมสูง 300 กรัม/ต้น', desc: 'เร่งการสะสมแป้งในผลกล้วย', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 2', title: 'ตัดปลีกล้วยออกหลังติดหวีสุดท้าย', desc: 'หักปลีกล้วยออกเพื่อให้ธาตุอาหารลงหวีผลเต็มที่', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 4', title: 'ค้ำต้นกล้วยและห่อเครือด้วยถุงสีฟ้า', desc: 'ป้องกันกล้วยโค่นล้มและผิวผลสวยป้องกันเพลี้ยแป้ง', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  },
  {
    id: 'pineapple',
    nameTh: 'สับปะรด',
    nameEn: 'Pineapple',
    category: 'พืชไร่/อุตสาหกรรม',
    variety: 'ปัตตาเวีย (ส่งโรงงาน) / ภูแล / ตราดสีทอง',
    defaultTreesPerRai: 8000,
    spacingDesc: 'ปลูกแถวคู่ 30x50x90 ซม. (~8,000 ต้น/ไร่)',
    emoji: '🍍',
    avatarUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=150&auto=format&fit=crop&q=80',
    stages: [
      {
        id: 'stage1',
        name: '🌱 ระยะปลูกใหม่ถึงเจริญเติบโต (1-6 เดือน)',
        desc: 'สร้างราก ลำต้นและใบสะสมอาหารอย่างรวดเร็ว',
        icon: 'filter_vintage',
        targetN: 22,
        targetP: 8,
        targetK: 18,
        commercialFormula: '16-16-16 หรือ 21-0-0',
        commercialRate: '30 - 40 กก. / ไร่ (ยอดกาบใบ)',
        commercialBagWeight: 50,
        commercialPricePerBag: 1480,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'หยอดปุ๋ยลงกาบใบล่าง หรือหว่านระหว่างแถว', desc: 'ระวังอย่าให้เม็ดปุ๋ยค้างที่ยอดอ่อนโดยตรง', badgeColor: 'bg-emerald-600' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นธาตุสังกะสีและเหล็กทางใบ', desc: 'ช่วยเร่งการสังเคราะห์แสงในดินทราย', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 6', title: 'กำจัดวัชพืชระหว่างร่องแถวคู่', desc: 'ป้องกันการแย่งสารอาหารและความชื้น', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage2',
        name: '🌸 บังคับดอก/แทงช่อดอก (8-10 เดือน)',
        desc: 'ต้นสมบูรณ์น้ำหนักใบ 2.5 กก. หยอดฮอร์โมนชักนำดอก',
        icon: 'flare',
        targetN: 10,
        targetP: 18,
        targetK: 25,
        commercialFormula: '13-13-21',
        commercialRate: '40 กก. / ไร่',
        commercialBagWeight: 50,
        commercialPricePerBag: 1550,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'ใส่ปุ๋ยสะสมอาหารก่อนหยอดแก๊ส 1 เดือน', desc: 'เพิ่มความสมบูรณ์ของช่อดอก', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'หยอดสารเร่งดอก (เอทิฟอน/ถ่านแก๊ส)', desc: 'หยอดช่วงค่ำหรือเช้าตรู่ขณะอากาศเย็น', badgeColor: 'bg-secondary' },
          { week: 'สัปดาห์ที่ 6', title: 'ตรวจเช็คตาแดงที่ใจกลางยอด', desc: 'บันทึกเปอร์เซ็นต์การออกดอกสม่ำเสมอ', badgeColor: 'bg-amber-600' }
        ]
      },
      {
        id: 'stage3',
        name: '🍍 ขยายขนาดผล/สะสมความหวาน (11-13 เดือน)',
        desc: 'ผลโต ตากว้าง เนื้อเนียนฉ่ำ หวานเข้มข้น ไส้ไม่แตก',
        icon: 'stars',
        targetN: 12,
        targetP: 6,
        targetK: 35,
        commercialFormula: '0-0-60 หรือ 14-7-35',
        commercialRate: '50 กก. / ไร่',
        commercialBagWeight: 50,
        commercialPricePerBag: 1600,
        timeline: [
          { week: 'สัปดาห์ที่ 1', title: 'หยอดปุ๋ยโพแทสเซียม 0-0-60 ลงกาบใบล่าง', desc: 'อัตรา 5 กรัม/ต้น ช่วยขยายขนาดเซลล์ผล', badgeColor: 'bg-primary' },
          { week: 'สัปดาห์ที่ 3', title: 'พ่นแคลเซียมทางช่อผล', desc: 'ป้องกันอาการแกนผลแตกหรือไส้ดำ', badgeColor: 'bg-teal-600' },
          { week: 'สัปดาห์ที่ 6', title: 'หักจุกสับปะรด หรือคลุมฟางบังแดดผล', desc: 'ป้องกันแสงแดดเผาผิวผลไหม้ก่อนเก็บเกี่ยว', badgeColor: 'bg-amber-600' }
        ]
      }
    ]
  }
];

export interface SoilAssessment {
  texture: 'clay' | 'sandy_loam' | 'sandy';
  ph: number;
  n_ppm: number;
  p_ppm: number;
  k_ppm: number;
}

export interface CalculationResult {
  matchPercent: number;
  crop: CropInfo;
  stage: CropInfo['stages'][0];
  totalRai: number;
  totalSqMeters: number;
  totalTrees: number;
  
  // Nutrients kg/rai
  deficitN: number;
  deficitP: number;
  deficitK: number;
  soilSupplyN: number;
  soilSupplyP: number;
  soilSupplyK: number;
  targetN: number;
  targetP: number;
  targetK: number;
  
  // Status badges
  statusN: 'Low' | 'Med' | 'High';
  statusP: 'Low' | 'Med' | 'High';
  statusK: 'Low' | 'Med' | 'High';
  phStatus: 'กรดจัด' | 'ค่อนข้างเป็นกรด' | 'เหมาะสมสมดุล' | 'ด่างจัด';
  phAdvice: string;

  // Commercial recommendation
  commercialFormula: string;
  commercialBags: number;
  commercialKg: number;
  commercialCost: number;
  commercialRateText: string;

  // Custom single nutrient (Urea, DAP, MOP)
  customUreaKg: number;
  customDapKg: number;
  customPotashKg: number;
  customTotalKg: number;
  customCost: number;

  // Savings
  savingsAmount: number;
  savingsPercent: number;

  // Timeline
  timeline: {
    week: string;
    title: string;
    desc: string;
    badgeColor: string;
  }[];
}

export function calculateFertilizer(
  cropId: string,
  stageId: string,
  rai: number,
  ngan: number,
  wah: number,
  soil: SoilAssessment
): CalculationResult {
  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const stage = crop.stages.find(s => s.id === stageId) || crop.stages[0];

  const totalRai = Math.max(0.1, rai + (ngan / 4) + (wah / 400));
  const totalSqMeters = Math.round(totalRai * 1600);
  const totalTrees = Math.round(totalRai * crop.defaultTreesPerRai);

  // Soil Nutrient Contribution in kg/rai based on soil test
  // In Thailand agronomic guidelines: 
  // Available N (kg/rai) ≈ N_ppm * 0.5 (texture modifier)
  const textureModifier = soil.texture === 'clay' ? 0.6 : soil.texture === 'sandy_loam' ? 0.5 : 0.4;
  const soilSupplyN = Math.min(stage.targetN * 0.8, Math.round(soil.n_ppm * textureModifier * 10) / 10);
  const soilSupplyP = Math.min(stage.targetP * 0.8, Math.round(soil.p_ppm * textureModifier * 10) / 10);
  const soilSupplyK = Math.min(stage.targetK * 0.8, Math.round(soil.k_ppm * textureModifier * 0.25 * 10) / 10);

  const deficitN = Math.max(0, Math.round((stage.targetN - soilSupplyN) * 10) / 10);
  const deficitP = Math.max(0, Math.round((stage.targetP - soilSupplyP) * 10) / 10);
  const deficitK = Math.max(0, Math.round((stage.targetK - soilSupplyK) * 10) / 10);

  // Status badges
  const statusN: 'Low' | 'Med' | 'High' = soil.n_ppm < 18 ? 'Low' : soil.n_ppm < 30 ? 'Med' : 'High';
  const statusP: 'Low' | 'Med' | 'High' = soil.p_ppm < 20 ? 'Low' : soil.p_ppm < 35 ? 'Med' : 'High';
  const statusK: 'Low' | 'Med' | 'High' = soil.k_ppm < 60 ? 'Low' : soil.k_ppm < 100 ? 'Med' : 'High';

  let phStatus: 'กรดจัด' | 'ค่อนข้างเป็นกรด' | 'เหมาะสมสมดุล' | 'ด่างจัด' = 'เหมาะสมสมดุล';
  let phAdvice = 'ค่า pH อยู่ในเกณฑ์เหมาะสม ธาตุอาหารละลายและถูกดูดซึมได้ดีที่สุด';
  if (soil.ph < 5.0) {
    phStatus = 'กรดจัด';
    phAdvice = 'ดินเป็นกรดรุนแรง ธาตุฟอสฟอรัสถูกตรึง แนะนำหว่านปูนโดโลไมท์ 150-200 กก./ไร่ ก่อนใส่ปุ๋ย 2 สัปดาห์';
  } else if (soil.ph < 5.8) {
    phStatus = 'ค่อนข้างเป็นกรด';
    phAdvice = 'ดินค่อนข้างเป็นกรด แนะนำใส่ปูนโดโลไมท์ 50-100 กก./ไร่ เพื่อปรับสมดุลและเพิ่มแคลเซียม-แมกนีเซียม';
  } else if (soil.ph > 7.3) {
    phStatus = 'ด่างจัด';
    phAdvice = 'ดินเป็นด่าง ธาตุเหล็กและสังกะสีละลายได้น้อย แนะนำฉีดพ่นจุลธาตุเสริมทางใบ';
  }

  // Commercial Formula calculation
  // Total nutrient needed for whole plot
  const totalDeficitN = deficitN * totalRai;
  const totalDeficitP = deficitP * totalRai;
  const totalDeficitK = deficitK * totalRai;

  // Standard Commercial Calculation
  const commercialKg = Math.max(50, Math.round((totalDeficitP / 0.24) || (totalDeficitN / 0.15) || 50));
  const commercialBags = Math.max(1, Math.round(commercialKg / 50));
  const actualCommercialKg = commercialBags * 50;
  const commercialCost = commercialBags * stage.commercialPricePerBag;

  // Rate text per tree or per rai
  let commercialRateText = '';
  if (totalTrees > 0 && crop.id !== 'pineapple') {
    const kgPerTree = (actualCommercialKg / totalTrees).toFixed(1);
    commercialRateText = `${kgPerTree} กิโลกรัม / ต้น`;
  } else {
    commercialRateText = `${Math.round(actualCommercialKg / totalRai)} กิโลกรัม / ไร่`;
  }

  // Custom Single Nutrients (ปุ๋ยสั่งตัดแม่ปุ๋ยเดี่ยว 3 ชนิด):
  // 1. DAP (18-46-0) supplies all P:
  const dapKg = Math.round((totalDeficitP / 0.46) || 0);
  const nFromDap = dapKg * 0.18;
  // 2. Urea (46-0-0) supplies remaining N:
  const remainingN = Math.max(0, totalDeficitN - nFromDap);
  const ureaKg = Math.round((remainingN / 0.46) || 0);
  // 3. MOP (0-0-60) supplies all K:
  const potashKg = Math.round((totalDeficitK / 0.60) || 0);

  const customTotalKg = ureaKg + dapKg + potashKg;

  // Single salt raw material prices (THB/kg): Urea 17 THB/kg, DAP 28 THB/kg, Potash 25 THB/kg
  const customCost = Math.round((ureaKg * 17) + (dapKg * 28) + (potashKg * 25));
  const savingsAmount = Math.max(0, commercialCost - customCost);
  const savingsPercent = commercialCost > 0 ? Math.round((savingsAmount / commercialCost) * 1000) / 10 : 18.4;

  return {
    matchPercent: Math.min(99, Math.max(88, 94 + (soil.ph >= 6.0 && soil.ph <= 6.5 ? 4 : -2))),
    crop,
    stage,
    totalRai,
    totalSqMeters,
    totalTrees,
    deficitN,
    deficitP,
    deficitK,
    soilSupplyN,
    soilSupplyP,
    soilSupplyK,
    targetN: stage.targetN,
    targetP: stage.targetP,
    targetK: stage.targetK,
    statusN,
    statusP,
    statusK,
    phStatus,
    phAdvice,
    commercialFormula: stage.commercialFormula,
    commercialBags,
    commercialKg: actualCommercialKg,
    commercialCost,
    commercialRateText,
    customUreaKg: ureaKg,
    customDapKg: dapKg,
    customPotashKg: potashKg,
    customTotalKg,
    customCost,
    savingsAmount,
    savingsPercent,
    timeline: stage.timeline
  };
}
