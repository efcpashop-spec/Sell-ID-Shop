import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'efb-101',
    code: 'EF-BOY-101',
    game: 'efootball',
    title: 'eFootball | ไอดีฟูลทีม Epic & Big Time ตัวละครแรร์ระดับประวัติศาสตร์ Messi / Neymar / Ronaldinho',
    description: 'ไอดีสายเติมจัดหนัก Collective Strength 3220+ พร้อมใช้งานใน Division 1 สกินนักเตะและตัวละครระดับตำนาน Big Time อัดแน่นเต็มโควต้า ปลดพลังการจัดทีมสูงสุดด้วยยอดผู้จัดการทีมเป๊ป กวาร์ดิโอล่า เวอร์ชันพิเศษ คุมทีมบู๊ได้ทุกแผนการเล่น',
    fullPrice: 12900,
    downPayment: 1900,
    minInstallmentWeeks: 1,
    maxInstallmentWeeks: 8,
    weeklyInstallment: 350,
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579952367143-a006db234e6c?w=800&auto=format&fit=crop&q=80'
    ],
    details: [
      { label: 'ค่าพลังทีมรวม (Strength)', value: '3,240 Collective OVR' },
      { label: 'การ์ด Epic / Big Time', value: '28 ใบ (Messi Big Time 2022, Ronaldinho, Beckham, Vieira)' },
      { label: 'การ์ด Show Time / Highlight', value: '45 ใบ (Mbappé, Bellingham, Haaland ปีท๊อป)' },
      { label: 'ยอดเงิน eFootball Coins', value: '2,450 Coins ในตัวเครื่อง' },
      { label: 'ผู้จัดการทีม (Manager)', value: 'P. Guardiola (88 - Boost Out Wide / Possession)' },
      { label: 'ระบบผูกมัด (Linked)', value: 'Konami ID สะอาด (มอบอีเมลเชื่อมแบบถาวร พร้อมรหัสความปลอดภัย)' }
    ],
    status: 'available',
    isHot: true
  },
  {
    id: 'efb-102',
    code: 'EF-BOY-102',
    game: 'efootball',
    title: 'eFootball | ไอดีระดับสตาร์ทเตอร์ Epic การ์ดพรีเมียมแน่น บัญชีอายุ 3 ปี เหรียญสะสมเต็มเหนี่ยว',
    description: 'ไอดีราคาสบายกระเป๋าสำหรับผู้เริ่มตั้งตัวรวมพลังตำนานแนวรุกสุดคลาสสิก แผงหลังแข็งแกร่งอย่าง Maldini และเด่นด้วยกลางรับอัศวินเกราะแดงปืนโต มีเงิน GP สะสมล้นหลามพร้อมนำไปเปิดแพ็คอัปเกรดแผน',
    fullPrice: 4200,
    downPayment: 600,
    minInstallmentWeeks: 1,
    maxInstallmentWeeks: 8,
    weeklyInstallment: 190,
    images: [
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80'
    ],
    details: [
      { label: 'ค่าพลังทีมรวม (Strength)', value: '3,080 Collective OVR' },
      { label: 'การ์ด Epic / Big Time', value: '8 ใบ (Rummenigge, Roberto Carlos, Maldini)' },
      { label: 'การ์ด Show Time / Highlight', value: '18 ใบ (Salah, Kevin De Bruyne, Son Heung-min)' },
      { label: 'เหรียญสะสม GP', value: '3,200,000 GP สามารถรีเซ็ตพลังนักเตะฟรี' },
      { label: 'ผู้จัดการทีม (Manager)', value: 'Xabi Alonso (88 - Quick Counter Boost)' },
      { label: 'การล็อกอินสแกนหลัก', value: 'Konami ID สะอาด ยินดีพาเปลี่ยนเมล์ผ่าน OTP ในแชท' }
    ],
    status: 'available',
    isHot: false
  },
  {
    id: 'efb-103',
    code: 'EF-BOY-103',
    game: 'efootball',
    title: 'eFootball | บัญชีสายสะสมการ์ดเจแปนทีม แฟรนไชส์ระดับท็อปลีก การันตีความเทพห้องเครื่อง',
    description: 'ตัวเลือกที่ดีที่สุดสำหรับคอบรรยากาศฟุตบอลเอเชียและยุโรป มีการ์ดพรีเมียมเวอร์ชันลิมิเตดที่หาไม่ได้อีกแล้วในซีซันปัจจุบัน ชนะจัดๆ ในโหมดออนไลน์ อัตราความแม่นยำสูง',
    fullPrice: 7550,
    downPayment: 1100,
    minInstallmentWeeks: 1,
    maxInstallmentWeeks: 8,
    weeklyInstallment: 280,
    images: [
      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'
    ],
    details: [
      { label: 'ค่าพลังทีมรวม (Strength)', value: '3,150 Collective OVR' },
      { label: 'การ์ด Epic / Big Time', value: '15 ใบ (Nakamura, Lampard, Drogba, Fernando Torres)' },
      { label: 'การ์ด Show Time / Highlight', value: '25 ใบ (Trippier, Kim Min-jae, Casemiro)' },
      { label: 'ไอเทมแจกฟรีกดสิทธิ์', value: 'แถมการ์ดสัญญานักเตะ 5 ดาว 5 ใบ' },
      { label: 'คู่มือผู้จัดการทีม', value: 'G. Gasperini (85 - Long Ball Counter)' },
      { label: 'มาตรฐานความปลอดภัย', value: 'ทางร้านเปลี่ยนผ่านเว็บหลักทันที รับประกันดึงกลับ 100%' }
    ],
    status: 'available',
    isHot: true
  },
  {
    id: 'efb-104',
    code: 'EF-BOY-104',
    game: 'efootball',
    title: 'eFootball | ไอดีเกรดตํานานอินเตอร์เนชันเพลเยอร์ ดาวยิงสูงสุดคริสเตียโน่ โรนัลโด้ ร่างมาดริดไร้เทียมทาน',
    description: 'เน้นพลังโจมตีโหดร้ายด้วยสุดยอดการยิงฟรีคิกและลูกโหม่งของโรนัลโด้ร่างไอเดียสีขาว มาพร้อมแผงกลางเทพขับเคลื่อน Vieira บดขยี้คู่แข่งให้ราบคาบ สภาพสมบูรณ์แรงก์ประวัติสุดเท่',
    fullPrice: 9500,
    downPayment: 1500,
    minInstallmentWeeks: 1,
    maxInstallmentWeeks: 8,
    weeklyInstallment: 290,
    images: [
      'https://images.unsplash.com/photo-1579952367143-a006db234e6c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&auto=format&fit=crop&q=80'
    ],
    details: [
      { label: 'ค่าพลังทีมรวม (Strength)', value: '3,190 Collective OVR' },
      { label: 'การ์ด Epic / Big Time', value: '20 ใบ (Cristiano Ronaldo Madrid, Kaka, Vieira, Puyol)' },
      { label: 'การ์ด Show Time / Highlight', value: '32 ใบ (Nico Williams, Rice, Bastoni)' },
      { label: 'ตั๋วสุ่มพิเศษพรีเมียม', value: '8 Chance Deals ที่ยังไม่ได้กดใช้' },
      { label: 'ผู้จัดการทีม (Manager)', value: 'L. Roman (88 - Boost Out Wide)' },
      { label: 'สัญญาส่งมอบปลอดภัย', value: 'ลงนามดิจิทัลสองฝ่าย มั่นใจตรวจสอบความปลอดภัยเต็มร้อย' }
    ],
    status: 'paying',
    isHot: false
  }
];

export const GAMES_FILTER = [
  { id: 'all', name: 'ไอดีทั้งหมด', icon: 'Gamepad2' },
  { id: 'efootball', name: 'eFootball (PES Mobile)', icon: 'Activity' }
];

export const BANK_ACCOUNTS = [
  { bankName: 'ธนาคารทหารไทย (TTB)', accountNo: '165-2-54814-8', accountName: 'นายชยพล ปุญนนท์', branch: 'ธุรกรรมหลักสำนักงานใหญ่' },
  { bankName: 'ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)', accountNo: '094-820-1166', accountName: 'นายชยพล ปุญนนท์', branch: 'อัตโนมัติแจ้งโอน 24 ชั่วโมง' }
];

export const TESTIMONIALS = [
  {
    name: 'คุณธีรยุทธ รักฟุตบอล',
    rating: 5,
    comment: 'ผ่อนไอดี eFootball คลัตช์เทพสะใจมากครับ Collective Kraft สูงแซงเพื่อนทั้งกลุ่ม ใช้สลิปเงินโอน EasySlip ผ่านระบบไวมาก ไม่ต้องง้อแอดมินตอบแชทเลย ปลื้มสุดๆ!',
    game: 'eFootball',
    date: 'เมื่อวานนี้'
  },
  {
    name: 'คุณพงศกร สกุลเมฆ',
    rating: 5,
    comment: 'ประทับใจระบบ SMS ยืนยันของ smsm2pro มาก มีรหัส OTP ยิงเข้าเครือข่ายเบอร์มือถือเราตอนกรอกสัญญาลายมือวาด รู้สึกได้ถึงความปลอดภัยของร้านผ่อนรายยักษ์นี้จริงๆ ผ่อนหมดเปลี่ยนเมลเรียบร้อยครับ',
    game: 'eFootball',
    date: '3 วันที่แล้ว'
  },
  {
    name: 'คุณชนัญชิดา ชื่นโกเมน',
    rating: 5,
    comment: 'สั่งผ่อนการ์ดเบคแฮมบิ๊กไทม์ให้นวดเล่นเป็นของขวัญวันเกิด ระบบน่าเชื่อถือ เซ็นยินยอมทางออนไลน์รัดกุม แอดมิน AI ช่วยตอบคำถามเรื่องจ่ายงวดได้ดีมากๆ เลยค่ะ',
    game: 'eFootball',
    date: '1 สัปดาห์ที่แล้ว'
  }
];

export const FAQ_LIST = [
  {
    q: 'ทำไมการผ่อนไอดี eFootball กับเราจึงปลอดภัยสูงสุด?',
    a: 'เนื่องจากไอดีทั้งหมดเป็นของคุณภาพขาวสะอาด ทางร้านซื้อและจดทะเบียนรับรองถูกกฎหมาย ไม่เคยผ่านโปรแกรมโกงใดๆ และได้รับการผูกเข้ากับที่เก็บถาวรของบริษัท เมื่อผ่อนครบตามงวดสะสม ระบบหลังบ้านจะโอนย้ายที่อยู่อีเมล Konami ID ให้คุณครอบครอง 100% ทันที'
  },
  {
    q: 'สลิปโอนเงินจะได้รับการตรวจสอบรวดเร็วแค่ไหน?',
    a: 'เรามีบริการระบบ API ของ EasySlip แบบไฮสปีด! ระบบหลังบ้านจะแกะเช็ค QR Code บนสลิปเงินโอนของธนาคารไทยทุกแห่งโดยอัตโนมัติ เพื่อยืนยันจำนวนเงิน วันเวลา และบัญชีปลายทาง ทำให้ไม่ต้องคอยแอดมินยืนยัน สามารถตรวจสอบผ่านในเวลาเพียง 2 วินาทีเท่านั้น!'
  },
  {
    q: 'บริการยืนยันเบอร์โทรศัพท์ด้วย SMSM2PRO คืออะไร?',
    a: 'เพื่อความปลอดภัยสูงสุดในการทำสัญญาเช่าซื้อสิทธิ์ไอดีเกม ระบบจะทำการเข้าถึง API ของ smsm2pro เพื่อส่งรหัสรวดเร็วหรือส่ง SMS แจ้งสถานะของใบคำขอผ่อนของคุณเพื่อยืนยันพิกัดความเป็นทีมงานและผู้รับผิดชอบอย่างแท้จริง'
  },
  {
    q: 'ขั้นตอนการสมัครมีกติกาลดระดับอายุไหม?',
    a: 'น้องๆ ตั้งแต่อายุ 15 ปีสามารถลงชื่อสมัครผ่อนในสัญญาลายมือดิจิทัลด้วยตนเองได้ทันที หากต่ำกว่านั้น แนะนำให้อ้างอิงชื่อและรูปถ่ายสำเนาของผู้ปกครองเพื่อดำเนินการยื่นแทนอย่างถูกต้อง'
  },
  {
    q: 'เมื่อดาวน์เงินก้อนแรกเสร็จ สามารถเปลี่ยนรหัสผ่านเพื่อเล่นได้ทันทีเลยไหม?',
    a: 'หลังจากชำระยอดมัดจำ (Down Payment) และได้รับการยืนยัน คุณระบบจะส่งข้อมูลสำหรับเข้าใช้งานให้คุณเล่นก่อนทันที แต่เพื่อความปลอดภัยของตัวไอดี ทางร้านจะเปิดอีเมลรักษาความปลอดภัยร่วมจนกว่าจะรับงวดแรกถึงงวดสุดท้ายสะสมครบ จึงจะเปลี่ยนเป็นผู้ดูแลถาวรโดยแท้จริง'
  }
];

export const CHAT_BOT_ANSWERS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['ผ่อน', 'วิธีผ่อน', 'ขั้นตอน', 'เริ่มต้น', 'ทำยังไง'],
    answer: 'วิธีการผ่อนไอดี eFootball มีขั้นตอนง่ายๆ ดังนี้ครับ:\n1. เลือกไอดีทีม Epic & Big Time ที่คุณอยากเป็นเจ้าของ\n2. เลื่อนคำนวณเงินมัดจำและจำนวนสัปดาห์ผ่อน\n3. กรอกข้อมูลส่วนตัว เซ็นสัญญาลายมือวาด และยืนยันเบอร์ด้วย SMS OTP จาก smsm2pro\n4. โอนเงินค่ามัดจำและส่งสลิปเพื่อใช้ EasySlip ตรวจสอบแบบออโต้ จากนั้นรับไอดีเข้าเล่นได้ฉลุยเลยครับ!'
  },
  {
    keywords: ['easyslip', 'ตรวจสอบสลิป', 'สลิป', 'สลีป', 'โอนเงิน', 'จ่ายงวด'],
    answer: 'ระบบของเราใช้ระบบ EasySlip API ตรวจสอบค่างวดอัตโนมัติครับ! เพียงคุณโอนเงินเข้าบัญชีกสิกรไทย หรือไทยพาณิชย์ของร้าน แล้วอัปโหลดภาพสลิป ระบบจะอ่าน QR Code เพื่อเช็คยอดเงินอนุมัติภายใน 2 วินาที สะดวกรวดเร็วตลอด 24 ชั่วโมงครับ'
  },
  {
    keywords: ['smsm2pro', 'sms', 'smsm', 'ส่งรหัส', 'เบอร์'],
    answer: 'เราใช้ API ของ smsm2pro เพื่อส่งข้อความยืนยันธุรกรรมและล็อกอินด้วยเบอร์มือถือของผู้ขอผ่อนสิทธิ์ ช่วยเพิ่มความมั่นใจว่าข้อมูลของคุณเป็นของจริงและปลอดภัยไม่มีการกลั่นแกล้งกันครับ'
  },
  {
    keywords: ['เอกสาร', 'รูปถ่าย', 'ใช้อะไรบ้าง', 'บัตร'],
    answer: 'เอกสารง่ายที่สุดในโลกครับ:\n1. รูปภาพถ่ายบัตรประชาชน (แนะนำกรอกลายน้ำข้อความ "ผ่อนไอดีเกม eFootball กับ EF Shop เท่านั้น เพื่อความปลอดภัย")\n2. ลิงก์ช่องทางติดต่อเฟสบุ๊คหลัก\n3. โคนามิไอดีผู้ผูก หรือเบอร์โทรศัพท์จริง\nไม่ต้องใช้อัตรารายได้หรือคนค้ำแต่อย่างใดครับ'
  },
  {
    keywords: ['โกงไหม', 'ปลอดภัยไหม', 'น่าเชื่อถือ', 'จริงหรือเปล่า'],
    answer: 'ร้านของเราจดทะเบียนธุรกิจออนไลน์ตามประมวลกฎหมายแพ่ง มีสัญญาลงลายมือดิจิทัลที่สามารถใช้ฟ้องทางลิขสิทธิ์ได้จริง และมีการเช็คคิวผ่าน API เสริมความปลอดภัย 100% ไร้มิจฉาชีพแน่นอน วางใจได้ครับ!'
  }
];
