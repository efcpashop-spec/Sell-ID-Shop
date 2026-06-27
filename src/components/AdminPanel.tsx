import React, { useState } from 'react';
import { Product, InstallmentApplication, PaymentSlip, SystemLog } from '../types';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Check, 
  X, 
  FileText, 
  Coins, 
  Layers, 
  Clock, 
  User, 
  FileCheck2, 
  ShieldAlert, 
  ListPlus,
  Gamepad,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Settings,
  Users,
  Bell,
  Cpu,
  FileSignature,
  DollarSign,
  MessageSquare,
  Percent,
  Tag
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  applications: InstallmentApplication[];
  setApplications: React.Dispatch<React.SetStateAction<InstallmentApplication[]>>;
  slips: PaymentSlip[];
  setSlips: React.Dispatch<React.SetStateAction<PaymentSlip[]>>;
  logs: SystemLog[];
  addLog: (type: 'info' | 'success' | 'warn' | 'error', message: string) => void;
  kycUser: any;
  setKycUser: any;
}

export default function AdminPanel({ 
  products, 
  setProducts, 
  applications, 
  setApplications, 
  slips, 
  setSlips, 
  logs,
  addLog,
  kycUser,
  setKycUser
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'slips' | 'sms' | 'kyc' | 'applications' | 'installments' | 'users'>('dashboard');
  const [testSmsPhone, setTestSmsPhone] = useState('0897654321');
  const [testSmsMessage, setTestSmsMessage] = useState('ทดสอบส่งข้อความแจ้งเตือนผ่านเกตเวย์ SMS2pro');

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formGame, setFormGame] = useState('efootball');
  const [formDescription, setFormDescription] = useState('');
  const [formFullPrice, setFormFullPrice] = useState('12000');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDownPayment, setFormDownPayment] = useState('1200');
  const [formMinWeeks, setFormMinWeeks] = useState('1');
  const [formMaxWeeks, setFormMaxWeeks] = useState('8');
  const [formWeekly, setFormWeekly] = useState('450');
  const [formDetails, setFormDetails] = useState('');

  // eFootball specialized states matching the mockup screenshot
  const [formPlatform, setFormPlatform] = useState('Mobile (มือถือ)');
  const [formOvr, setFormOvr] = useState('3150');
  const [formEpicCount, setFormEpicCount] = useState('15');
  const [formCostPrice, setFormCostPrice] = useState('5000');
  const [formMinDownPercent, setFormMinDownPercent] = useState('10');
  const [formMaxDownPercent, setFormMaxDownPercent] = useState('100');
  const [formInterestRate, setFormInterestRate] = useState('5');
  const [formDivision, setFormDivision] = useState('Division 1');
  const [formWinRate, setFormWinRate] = useState('สะอาด2ระบบ');
  const [formImageList, setFormImageList] = useState<string[]>([
    'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800'
  ]);
  const [formKeyPlayers, setFormKeyPlayers] = useState('L. Messi (Epic), Neymar, Ronaldinho');

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formFullPrice) {
      alert('กรุณากรอกหัวข้อสเปคไอดีและราคาตั้งขายสดก่อนบันทึกรายการด้วยนะคะ');
      return;
    }

    // Auto-calculate the down payment (baht) and weekly payment (baht) based on percentage inputs for solid precision
    const priceNum = Number(formFullPrice || 12000);
    const minDownPct = Number(formMinDownPercent || 10);
    const calculatedDownPrice = Math.round(priceNum * (minDownPct / 100));
    const finalDownPaymentPrice = calculatedDownPrice || 1200;

    const calculatedInterestRate = Number(formInterestRate || 5);
    const remainingToPay = priceNum - finalDownPaymentPrice;
    const weeksToPay = Number(formMinWeeks || 1);
    const totalWithInterest = remainingToPay * (1 + (calculatedInterestRate / 100));
    const calculatedWeeklyPrice = weeksToPay > 0 ? Math.round(totalWithInterest / weeksToPay) : 150;

    // Build the dynamic details array for full compatibility with storefront display card highlights
    const detailPairs = [
      { label: 'ค่าพลังทีมรวม (Strength)', value: `${formOvr || '3150'} Collective OVR` },
      { label: 'การ์ด Epic / Big Time', value: `${formEpicCount || '15'} ใบ` },
      { label: 'กลุ่มลีก (Division)', value: formDivision || 'Division 1' },
      { label: 'การเชื่อมต่อไอดี', value: formWinRate || 'สะอาด2ระบบ' },
      { label: 'คีย์ผู้เล่นคนสำคัญ', value: formKeyPlayers || 'L. Messi (Epic), Neymar, Ronaldinho' },
      { label: 'แพลตฟอร์ม', value: formPlatform || 'Mobile (มือถือ)' }
    ];

    // Generate a beautiful, unique EFC code if not manually set or on first creation
    const generatedCode = formCode.trim() 
      ? formCode.trim().toUpperCase() 
      : `EFC-${Math.floor(1000 + Math.random() * 9000)}`;

    if (editProductId) {
      // Edit existing product
      setProducts(prev => prev.map(p => {
        if (p.id === editProductId) {
          return {
            ...p,
            code: generatedCode,
            title: formTitle,
            game: 'efootball',
            description: formDescription || 'สกินสวยงามฮีโร่พร้อมแข่งขัน ไอดีปลอดภัย สัญญากฏหมายมอบอำนาจค้ำชูเสถียร',
            fullPrice: priceNum,
            originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
            downPayment: finalDownPaymentPrice,
            minInstallmentWeeks: Number(formMinWeeks),
            maxInstallmentWeeks: Number(formMaxWeeks),
            weeklyInstallment: calculatedWeeklyPrice,
            images: formImageList.filter(img => img.trim() !== ''),
            details: detailPairs,
            // eFootball custom specs attached
            costPrice: Number(formCostPrice),
            minDownPercent: minDownPct,
            maxDownPercent: Number(formMaxDownPercent),
            interestRate: calculatedInterestRate,
            division: formDivision,
            winRate: formWinRate,
            keyPlayers: formKeyPlayers,
            platform: formPlatform,
            ovr: Number(formOvr),
            epicCount: Number(formEpicCount)
          };
        }
        return p;
      }));
      addLog('success', `แก้ไขรายละเอียดไอดีเกมรหัส ${generatedCode} เรียบร้อยแล้ว`);
      setEditProductId(null);
    } else {
      // Add brand new product
      const newProd: Product = {
        id: 'p-' + Date.now(),
        code: generatedCode,
        title: formTitle,
        game: 'efootball',
        description: formDescription || 'สกินแนวรุกสุดตำนาน สะอาด ปลอดภัย ยินดีเปลี่ยนผ่านเว็บหลักรับประกัน 100%',
        fullPrice: priceNum,
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        downPayment: finalDownPaymentPrice,
        minInstallmentWeeks: Number(formMinWeeks),
        maxInstallmentWeeks: Number(formMaxWeeks),
        weeklyInstallment: calculatedWeeklyPrice,
        images: formImageList.filter(img => img.trim() !== ''),
        details: detailPairs,
        status: 'available',
        isHot: true,
        // eFootball custom specs attached
        costPrice: Number(formCostPrice),
        minDownPercent: minDownPct,
        maxDownPercent: Number(formMaxDownPercent),
        interestRate: calculatedInterestRate,
        division: formDivision,
        winRate: formWinRate,
        keyPlayers: formKeyPlayers,
        platform: formPlatform,
        ovr: Number(formOvr),
        epicCount: Number(formEpicCount)
      };
      setProducts(prev => [newProd, ...prev]);
      addLog('success', `เพิ่มไอดี eFootball ตัวใหม่รหัส ${generatedCode} เข้าคลังสินค้าจัดวางหน้าร้านสำเร็จ`);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormCode('');
    setFormTitle('');
    setFormGame('efootball');
    setFormDescription('');
    setFormFullPrice('12000');
    setFormOriginalPrice('');
    setFormDownPayment('1200');
    setFormMinWeeks('10');
    setFormMaxWeeks('30');
    setFormWeekly('450');
    setFormDetails('');
    
    // reset customized fields
    setFormPlatform('Mobile (มือถือ)');
    setFormOvr('3150');
    setFormEpicCount('15');
    setFormCostPrice('5000');
    setFormMinDownPercent('10');
    setFormMaxDownPercent('100');
    setFormInterestRate('5');
    setFormDivision('Division 1');
    setFormWinRate('สะอาด2ระบบ');
    setFormImageList(['https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800']);
    setFormKeyPlayers('L. Messi (Epic), Neymar, Ronaldinho');
    
    setShowAddForm(false);
    setEditProductId(null);
  };

  const triggerEditProduct = (prod: Product) => {
    setEditProductId(prod.id);
    setFormCode(prod.code);
    setFormTitle(prod.title);
    setFormGame(prod.game);
    setFormDescription(prod.description);
    setFormFullPrice(String(prod.fullPrice));
    setFormOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setFormDownPayment(String(prod.downPayment));
    setFormMinWeeks(String(prod.minInstallmentWeeks || '1'));
    setFormMaxWeeks(String(prod.maxInstallmentWeeks || '8'));
    setFormWeekly(String(prod.weeklyInstallment || '450'));
    
    // parse details or use defaults to populate eFootball states
    const findDetail = (lbl: string, defVal: string) => {
      const match = prod.details.find(d => d.label.toLowerCase().includes(lbl.toLowerCase()) || d.label.includes(lbl));
      return match ? match.value : defVal;
    };

    setFormPlatform(prod.details.find(d => d.label === 'แพลตฟอร์ม')?.value || prod.platform || 'Mobile (มือถือ)');
    setFormOvr(String(prod.ovr || findDetail('OVR', '3150').replace(/[^0-9]/g, '')));
    setFormEpicCount(String(prod.epicCount || findDetail('Epic', '15').replace(/[^0-9]/g, '')));
    setFormCostPrice(String(prod.costPrice || 5000));
    setFormMinDownPercent(String(prod.minDownPercent || 10));
    setFormMaxDownPercent(String(prod.maxDownPercent || 100));
    setFormInterestRate(String(prod.interestRate || findDetail('ดอกเบี้ย', '5').replace(/[^0-9]/g, '') || '5'));
    setFormDivision(prod.division || findDetail('Division', 'Division 1'));
    setFormWinRate(prod.winRate || findDetail('เชื่อมต่อ', '') || findDetail('ชนะ', 'สะอาด2ระบบ'));
    setFormImageList(prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800']);
    setFormKeyPlayers(prod.keyPlayers || findDetail('ผู้เล่น', 'L. Messi (Epic), Neymar, Ronaldinho'));
    
    setShowAddForm(true);
    // scroll back up to form
    const container = document.getElementById('admin-add-product');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteProduct = (pId: string, pCode: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบไอดีเกมรหัส ${pCode} ออกจากเว็ปไซต์?`)) {
      setProducts(prev => prev.filter(p => p.id !== pId));
      addLog('warn', `ลบรายการไอดีเกม ${pCode} ออกจากตารางเรียบร้อยแล้ว`);
    }
  };

  const handleDiscountProduct = (pId: string, pCode: string) => {
    const customPromptVal = prompt(`กรอกเปอร์เซ็นต์ที่ต้องการหักลดราคาสำหรับ ${pCode} (เช่น 10 สำหรับลด 10%, 20 สำหรับลด 20%):`, "10");
    if (customPromptVal === null) return; // user cancelled
    const discountPct = parseFloat(customPromptVal);
    if (isNaN(discountPct) || discountPct <= 0 || discountPct > 99) {
      alert("กรุณากรอกเปอร์เซ็นต์ที่ถูกต้องระหว่าง 1 ถึง 99 ด้วยค่ะ");
      return;
    }
    const rate = discountPct / 100;
    setProducts(prev => prev.map(p => {
      if (p.id === pId) {
        const original = p.originalPrice || p.fullPrice;
        const discountedFull = Math.max(0, Math.round(p.fullPrice * (1 - rate)));
        const discountedDown = Math.max(0, Math.round(p.downPayment * (1 - rate)));
        const discountedWeekly = Math.max(0, Math.round(p.weeklyInstallment * (1 - rate)));
        return {
          ...p,
          originalPrice: original,
          fullPrice: discountedFull,
          downPayment: discountedDown,
          weeklyInstallment: discountedWeekly,
          isHot: true // Mark discounted products as hot so they catch attention!
        };
      }
      return p;
    }));
    addLog('success', `ปรับราคาลดพิเศษสำหรับไอดี ${pCode} ลง ${discountPct}% เรียบร้อยแล้วค่ะ!`);
  };

  // Contracts Status approvals
  const handleApproveApp = (appId: string, itemCode: string, isApproved: boolean) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: isApproved ? 'approved' : 'rejected',
          reviewedAt: new Date().toLocaleString()
        };
      }
      return app;
    }));

    // Update product status to matching state
    const matchedApp = applications.find(a => a.id === appId);
    if (matchedApp) {
      setProducts(prev => prev.map(p => {
        if (p.id === matchedApp.productId) {
          return {
            ...p,
            status: isApproved ? 'paying' : 'available'
          };
        }
        return p;
      }));
    }

    addLog(
      isApproved ? 'success' : 'warn', 
      `ผู้ตรวจสอบอนุมัติใบสัญญาและตอบรับสิทธิ์ของใบสมัครรหัสไอดี ${itemCode} กลายเป็น [${isApproved ? 'อนุมัติผ่าน' : 'ปฏิเสธคำขอ'}]`
    );
  };

  // Slip audit verified
  const handleVerifySlip = (slipId: string, isVerified: boolean) => {
    setSlips(prev => prev.map(slip => {
      if (slip.id === slipId) {
        return {
          ...slip,
          status: isVerified ? 'verified' : 'rejected'
        };
      }
      return slip;
    }));

    addLog(
      isVerified ? 'success' : 'error', 
      `ยืนยันผลการตรวจสอบหลักฐานสลิปยอดเงินโอนอ้างอิงรหัสสลิป #${slipId.substring(0,6)} : [${isVerified ? 'ได้รับเงินจริง' : 'สลิปไม่ถูกต้อง/คลาดตก'}]`
    );
  };

  // Summary widgets stats
  const totalItemsCount = products.length;
  const availableItemsCount = products.filter(p => p.status === 'available').length;
  const payingItemsCount = products.filter(p => p.status === 'paying').length;
  const totalEarningsSim = slips.filter(s => s.status === 'verified').reduce((sum, current) => sum + current.transferAmount, 0);
  const pendingSlipsCount = slips.filter(s => s.status === 'pending').length;
  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR COLUMNS */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#0a0b16] border border-slate-800/90 p-5 rounded-3xl space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Settings className="h-5 w-5 hover:rotate-90 transition-transform duration-500" />
            </div>
            <h2 className="text-white font-extrabold text-base tracking-wide font-sans">แผงควบคุมแอดมิน</h2>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1.5 pt-1">
            
            {/* Item 1: 📊 ภาพรวมสถิติแผงควบคุม */}
            <button
              onClick={() => setAdminTab('dashboard')}
              id="admin-tab-dashboard"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left ${
                adminTab === 'dashboard'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📊</span>
                <span className="font-sans">ภาพรวมสถิติแผงควบคุม</span>
              </div>
            </button>

            {/* Item 2: 📦 คลังไอดี & สัญญากลาง */}
            <button
              onClick={() => setAdminTab('products')}
              id="admin-tab-products"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left ${
                adminTab === 'products'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📦</span>
                <span className="font-sans">คลังไอดี & สัญญากลาง</span>
              </div>
            </button>

            {/* Item 3: 🤖 ระบบ EasySlip & ลิงค์คลาวด์ */}
            <button
              onClick={() => setAdminTab('slips')}
              id="admin-tab-slips"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left ${
                adminTab === 'slips'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🤖</span>
                <span className="font-sans">ระบบ EasySlip & ลิงค์คลาวด์</span>
              </div>
            </button>

            {/* Item 4: 🔔 การแจ้งเตือน & เทมเพลต SMS */}
            <button
              onClick={() => setAdminTab('sms')}
              id="admin-tab-sms"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left ${
                adminTab === 'sms'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🔔</span>
                <span className="font-sans">การแจ้งเตือน & เทมเพลต SMS</span>
              </div>
            </button>

            {/* Item 5: 🪪 ตรวจอนุมัติ KYC ค้างพิจารณา */}
            <button
              onClick={() => setAdminTab('kyc')}
              id="admin-tab-kyc"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left relative ${
                adminTab === 'kyc'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 font-sans">
                <span className="text-sm">🪪</span>
                <span className="font-sans">ตรวจอนุมัติ KYC ค้างพิจารณา</span>
              </div>
              <span className={`text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center font-mono ${
                adminTab === 'kyc' ? 'bg-white text-[#ef4444]' : 'bg-[#ef4444] text-white'
              }`}>
                {kycUser.status === 'step4' ? '1' : '0'}
              </span>
            </button>

            {/* Item 6: ✍️ ตรวจสอบสัญญา & รายการซื้อสด */}
            <button
              onClick={() => setAdminTab('applications')}
              id="admin-tab-applications"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left relative ${
                adminTab === 'applications'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 font-sans">
                <span className="text-sm">✍️</span>
                <span className="font-sans">ตรวจสอบสัญญา & รายการซื้อสด</span>
              </div>
              <span className={`text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center font-mono ${
                adminTab === 'applications' ? 'bg-white text-[#5850ec]' : 'bg-[#6366f1] text-white'
              }`}>
                {pendingAppsCount || '2'}
              </span>
            </button>

            {/* Item 7: 💰 แผงจัดการค่างวดและตามหนี้ */}
            <button
              onClick={() => setAdminTab('installments')}
              id="admin-tab-installments"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left relative ${
                adminTab === 'installments'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 font-sans">
                <span className="text-sm">💰</span>
                <span className="font-sans">แผงจัดการค่างวดและตามหนี้</span>
              </div>
              <span className={`text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center font-mono ${
                adminTab === 'installments' ? 'bg-white text-amber-600' : 'bg-[#f59e0b] text-black'
              }`}>
                {payingItemsCount || '4'}
              </span>
            </button>

            {/* Item 8: 👥 รายชื่อลูกค้า & สมาชิกผู้ใช้ */}
            <button
              onClick={() => setAdminTab('users')}
              id="admin-tab-users"
              className={`w-full flex items-center justify-between p-3 ml-0 sm:p-3.5 rounded-xl font-bold text-xs transition-all text-left relative ${
                adminTab === 'users'
                  ? 'bg-[#5850ec] border-2 border-white ring-2 ring-[#0a0b16] text-white shadow-[0_4px_20px_rgba(88,80,236,0.45)] scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 font-sans">
                <span className="text-sm">👥</span>
                <span className="font-sans">รายชื่อลูกค้า & สมาชิกผู้ใช้</span>
              </div>
              <span className={`text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center font-mono ${
                adminTab === 'users' ? 'bg-white text-emerald-600' : 'bg-[#10b981] text-white'
              }`}>
                5
              </span>
            </button>

          </div>

          {/* Footer of Sidebar Status Container */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono leading-relaxed text-left space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-900/40">
            <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1.5 rounded-lg">
              <span className="text-gray-500 font-bold">ฐานข้อมูลคลาวด์:</span>
              <span className="text-[#10b981] font-black flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1.5 rounded-lg">
              <span className="text-gray-500 font-bold">SMS API:</span>
              <span className="text-blue-400 font-black">
                CONNECT
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1.5 rounded-lg">
              <span className="text-gray-500 font-bold">EasySlip:</span>
              <span className="text-indigo-400 font-black">
                ACTIVE
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT HAND VIEW COLUMNS */}
        <div className="lg:col-span-8 xl:col-span-9 bg-[#0f111a] border border-slate-800/80 rounded-3xl p-6 min-h-[550px] shadow-[0_12px_45px_rgba(0,0,0,0.35)]">
          
          {/* TAB 0: SYSTEM SUMMARY DASHBOARD */}
          {adminTab === 'dashboard' && (
          <div className="space-y-8 text-left animate-fadeIn">
            {/* Real-time Admin Welcome Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#0c0d19] to-[#121626] p-6 rounded-2xl border border-purple-500/10 gap-4">
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400 rotate-6 animate-pulse" />
                  <span>ระบบแดชบอร์ดสรุปผลรายรับและข้อมูลบริหารคลังบัญชีภาพรวม (Real-time Financial Suite)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">กระดานบันทึก สัดส่วนโควต้า กำไรประเมินตามทุน พอร์ตสะสมงวดค้างชำระของเว็บบัญชีไอดี eFootball</p>
              </div>
              <div className="bg-[#080315] border border-purple-500/20 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-purple-300 font-bold block uppercase font-mono tracking-wider">สถานะการเชื่อมต่อตลาด</span>
                <span className="text-xs text-[#10b981] font-extrabold flex items-center gap-1.5 justify-center mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE / SYNCED
                </span>
              </div>
            </div>

            {/* EXPANDED 8 CUSTOM BENTO STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              
              {/* Card 1: Inventory GMV */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-cyan-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">มูลค่าตลาดรวมคลัง (GMV)</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">฿{totalItemsCount > 0 ? products.reduce((sum, p) => sum + p.fullPrice, 0).toLocaleString() : '0'}</div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>ไอดีจัดจำหน่ายทั้งหมด:</span>
                  <strong className="text-white font-extrabold">{products.length} รายการ</strong>
                </div>
              </div>

              {/* Card 2: Inventory Capital locked */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-red-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">เงินทุนจัดซื้อในคลังสะสม</span>
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">฿{products.reduce((sum, p) => sum + (p.costPrice || 5000), 0).toLocaleString()}</div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>ประเมินทุนจัดซื้อเฉลี่ย:</span>
                  <strong className="text-red-400 font-extrabold">~5,000 ฿</strong>
                </div>
              </div>

              {/* Card 3: Projected Gross Margin Product */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-emerald-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">สัดส่วนกำไรเมื่อขายออกหมด</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#10b981]">
                  +{products.length > 0 ? (products.reduce((sum, p) => sum + p.fullPrice, 0) - products.reduce((sum, p) => sum + (p.costPrice || 5000), 0)).toLocaleString() : '0'} ฿
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>มาร์จิ้นเฉลี่ยรวมสถิติ:</span>
                  <strong className="text-emerald-400 font-extrabold">
                    {products.reduce((sum, p) => sum + p.fullPrice, 0) > 0 
                      ? Math.round(((products.reduce((sum, p) => sum + p.fullPrice, 0) - products.reduce((sum, p) => sum + (p.costPrice || 5000), 0)) / products.reduce((sum, p) => sum + p.fullPrice, 0)) * 100) 
                      : 0}% Margin
                  </strong>
                </div>
              </div>

              {/* Card 4: Collected verified cash */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-amber-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">รายรับจริงผ่านสลิป (Cash Flow)</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-yellow-400">฿{totalEarningsSim.toLocaleString()}</div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>จำนวนสลิปรับเงินจริง:</span>
                  <strong className="text-yellow-400 font-extrabold">
                    {slips.filter(s => s.status === 'verified').length} ฉบับ
                  </strong>
                </div>
              </div>

              {/* Card 5: Contract Book outstanding value */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-indigo-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">มูลค่าพอร์ตสัญญากำลังผ่อน</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-indigo-300">
                  ฿{applications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.productPrice, 0).toLocaleString()}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>จำนวนสัญญา Active ผ่อนงวด:</span>
                  <strong className="text-indigo-400 font-extrabold">{payingItemsCount} สัญญา</strong>
                </div>
              </div>

              {/* Card 6: Approval rate */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-violet-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">อัตราการอนุมัติสัญญาผ่อน</span>
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-violet-300">
                  {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'approved').length / applications.length) * 100) : 0}%
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>คำอนุมัติทั้งหมด:</span>
                  <strong className="text-violet-300 font-extrabold">
                    {applications.filter(a => a.status === 'approved').length} / {applications.length} รายการ
                  </strong>
                </div>
              </div>

              {/* Card 7: Slips check pending tasks */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-amber-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">คุณสมบัติรอดำเนินการด่วน</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {slips.filter(s => s.status === 'pending').length + applications.filter(a => a.status === 'pending').length + (kycUser.status === 'step4' ? 1 : 0)} ตัวงาน
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>สลิป:{slips.filter(s => s.status === 'pending').length} / ผ่อน:{applications.filter(a => a.status === 'pending').length} / KYC:{kycUser.status === 'step4' ? 1 : 0}</span>
                </div>
              </div>

              {/* Card 8: Portfolio risk factor score */}
              <div className="bg-[#0b0e17] border border-slate-800/80 hover:border-emerald-500/30 p-5 rounded-2xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide font-sans">ดัชนีภาพรวมหนี้ดีของลูกค้า</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  98.2<span className="text-slate-500 font-bold text-xs">%</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-gray-500 font-sans">
                  <span>ระดับชั้นเกรดค้างชำระ:</span>
                  <strong className="text-[#10b981] font-extrabold uppercase">เสถียรภาพสูง</strong>
                </div>
              </div>

            </div>

            {/* BAR PROGRESS AND REVENUE / MARGIN AUDIT SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              
              {/* Left progress panels of stock status distribution */}
              <div className="bg-[#0b0e17] border border-slate-800/80 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-white font-extrabold text-sm">การกระจายตัวยอดจัดสรรไอดีในตลาด</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">จำแนกตามความถี่สัดส่วนว่างจำหน่าย ผ่อนเสร็จ หรือติดล็อคสัญญา</p>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Progress 1: Available */}
                  {(() => {
                    const count = products.filter(p => p.status === 'available').length;
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                            ว่างรอจำหน่าย
                          </span>
                          <span className="font-mono text-slate-400">{count} ตัว ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#05060a] h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Progress 2: Paying */}
                  {(() => {
                    const count = products.filter(p => p.status === 'paying').length;
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                            กำลังผ่อนส่งเฉลี่ย
                          </span>
                          <span className="font-mono text-slate-400">{count} รหัส ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#05060a] h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Progress 3: Reserved */}
                  {(() => {
                    const count = products.filter(p => p.status === 'reserved').length;
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-orange-400 shrink-0" />
                            ใบจองคิวรับสิทธิ์
                          </span>
                          <span className="font-mono text-slate-400">{count} ดีล ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#05060a] h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Progress 4: Sold */}
                  {(() => {
                    const count = products.filter(p => p.status === 'sold').length;
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-500 shrink-0" />
                            ปิดโอนสิทธิ์เสร็จสิ้น
                          </span>
                          <span className="font-mono text-slate-400">{count} ตัว ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#05060a] h-2.5 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <span className="text-purple-400 font-extrabold block mb-1">💡 เสนอแนะการตั้งเป้ายอดขาย:</span>
                  แผง Milan Full Pack และ Epic ในคลังปัจจุบันให้ผลดีกับค่าสัมประสิทธิ์กำไรสูงสุด ท่านสามารถลากประกาศไอดีประเภทนี้เพิ่มเติมเพื่อคงคะแนนมาร์จิ้นระบบสะสม
                </div>
              </div>

              {/* Right table Profit Margin audit list */}
              <div className="lg:col-span-2 bg-[#0b0e17] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-extrabold text-sm">ตรวจสอบรายการมาร์จิ้นและกำไรรายไอดีคลัง (Margin Audit)</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">ระบบดึงข้อมูลคำนวณกำไรประเมินตามต้นทุนและกำไรจัดซื้อโดยอัตโนมัติ</p>
                </div>

                <div className="my-4 overflow-y-auto max-h-[220px] rounded-xl border border-slate-800/90 bg-[#05060b] text-xs text-left">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-rose-950/10 bg-slate-950 text-slate-400 font-bold">
                        <th className="p-3 pl-4">รหัสไอดี ID</th>
                        <th className="p-3">ต้นทุนทุนซื้อ</th>
                        <th className="p-3">ราคาตั้งจำหน่าย</th>
                        <th className="p-3">กำไรสุทธิ</th>
                        <th className="p-3 text-right pr-4">เปอร์เซ็นต์กำไร</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {products.map((p) => {
                        const cost = p.costPrice || 5000;
                        const profit = p.fullPrice - cost;
                        const pct = p.fullPrice > 0 ? Math.round((profit / p.fullPrice) * 100) : 0;
                        return (
                          <tr key={p.id} className="hover:bg-slate-900/40">
                            <td className="p-2.5 pl-4 font-black text-cyan-400 tracking-wide text-[11px]">{p.code}</td>
                            <td className="p-2.5 text-gray-400">{cost.toLocaleString()} ฿</td>
                            <td className="p-2.5 font-bold text-slate-200">{p.fullPrice.toLocaleString()} ฿</td>
                            <td className="p-2.5 text-emerald-400 font-bold">+{profit.toLocaleString()} ฿</td>
                            <td className="p-2.5 text-right pr-4 text-amber-500 font-black">{pct}% Margin</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-2 border-t border-slate-800/80">
                  <span>* คำนวณตามเกณฑ์ API Google Sheet Sync ล่าสุด</span>
                  <span className="text-emerald-500">REAL-TIME</span>
                </div>
              </div>

            </div>

            {/* CENTRAL DIRECT ACTION DESK MANAGER QUEUE */}
            <div className="bg-[#0b0e17] border border-slate-800/80 p-6 rounded-2xl text-xs space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-left flex-wrap gap-2">
                <div>
                  <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-yellow-400 rotate-180 animate-spin-slow" />
                    <span>งานรอตรวจรับการชำระหรือคำขอค้างพิจารณา (System Action Center Desk)</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">ตรวจหลักสลิปยอดเข้า หรืออนุมัติการผ่อนได้ตรงนี้ทันที ไม่จำเป็นต้องคลิกสลับแท็บเมนูอื่น</p>
                </div>
                <div className="flex gap-2">
                  <span className="py-1 px-3 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] rounded-lg font-mono">สลิปรอตรวจสอบ: {pendingSlipsCount} ฉบับ</span>
                  <span className="py-1 px-3 bg-[#4f46e5]/10 border border-[#818cf8]/20 text-indigo-400 text-[10px] rounded-lg font-mono">สัญญารอเซ็น: {pendingAppsCount} ฉบับ</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* 1. Dashboard pending Slips desk */}
                <div className="space-y-3">
                  <h5 className="text-slate-300 font-extrabold flex justify-between items-center">
                    <span>1. หลักฐานสลับรอยืนยันยอดงวดค้างชำระ (Pending Slips Queue)</span>
                    <button onClick={() => setAdminTab('slips')} className="text-cyan-400 hover:underline text-[10px] font-semibold">แก้ไขเต็มหน้า ↗</button>
                  </h5>

                  {slips.filter(s => s.status === 'pending').length === 0 ? (
                    <div className="p-8 text-center bg-[#070a13]/30 border border-slate-800/80 text-gray-500 font-mono rounded-xl border-dashed">
                      ไม่มีรายการแจ้งชำระยอดงวดคงค้างรอตรวจในขณะนี้ค่ะ ✨
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {slips.filter(s => s.status === 'pending').slice(0, 3).map((slip) => (
                        <div key={slip.id} className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl space-y-3 font-mono hover:border-slate-700/60 transition-all">
                          <div className="flex justify-between text-[10px] text-gray-500 font-semibold mb-1">
                            <span>อ้างอิงรหัสสัญญา: #{slip.id.substring(0, 8)}</span>
                            <span className="text-yellow-500">ธนาคาร: {slip.bank}</span>
                          </div>
                          <div className="flex justify-between items-center font-sans text-slate-300">
                            <div>
                              <span className="text-cyan-400 font-bold block text-[10px] font-mono">ไอดี: {slip.productCode}</span>
                              <span className="text-xs text-slate-100 font-semibold">{slip.productTitle}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-[#eab308] font-mono">฿{slip.transferAmount.toLocaleString()}</span>
                              <span className="text-[10px] text-gray-500 block font-mono">{slip.transferTime}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => handleVerifySlip(slip.id, false)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-900/20 text-[10px] font-bold"
                            >
                              ยอดไม่เข้าจริง
                            </button>
                            <button
                              onClick={() => handleVerifySlip(slip.id, true)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold"
                            >
                              ✓ ยอดเงินเข้าถูกต้อง
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Dashboard Pending Applications contract desk */}
                <div className="space-y-3">
                  <h5 className="text-slate-300 font-extrabold flex justify-between items-center font-sans">
                    <span>2. ใบสมัครยื่นเสนอผ่อนสัญญารอตรวจสอบอนุมัติ (Installment Application Queue)</span>
                    <button onClick={() => setAdminTab('applications')} className="text-cyan-400 hover:underline text-[10px] font-semibold">คัดกรองใบสัญญา ↗</button>
                  </h5>

                  {applications.filter(a => a.status === 'pending').length === 0 ? (
                    <div className="p-8 text-center bg-[#070a13]/30 border border-slate-800/80 text-gray-500 font-mono rounded-xl border-dashed">
                      ไม่มีการส่งใบสัญญายื่นผ่อนค้างรอการตรวจสอบจากแอดมินเวลานี้ค่ะ ✨
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.filter(a => a.status === 'pending').slice(0, 2).map((app) => (
                        <div key={app.id} className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl space-y-3 font-sans hover:border-slate-700/60 transition-all">
                          <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                            <span>ผู้สมัคร: {app.fullName} (อายุ {app.age} ปี)</span>
                            <span className="text-indigo-400 font-bold">รอเซ็นผ่าน</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <div>
                              <span className="text-cyan-400 font-bold block text-[10px] font-mono">รหัสเสนอ: {app.productCode}</span>
                              <span className="text-xs text-slate-100 font-semibold">{app.productTitle}</span>
                            </div>
                            <div className="text-right text-[11px] font-mono whitespace-nowrap">
                              <span className="text-white font-bold block">ดาวน์สะสม: ฿{app.downPaymentAmount.toLocaleString()}</span>
                              <span className="text-gray-400 block">{app.installmentWeeks} สัปดาห์ × ฿{app.weeklyInstallmentAmount}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => handleApproveApp(app.id, app.productCode, false)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-900/20 text-[10px] font-bold animate-scaleUp"
                            >
                              ปฏิเสธผ่านผ่อน
                            </button>
                            <button
                              onClick={() => handleApproveApp(app.id, app.productCode, true)}
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-extrabold animate-scaleUp"
                            >
                              ✓ อนุมัติผ่านใบสมรสกู้
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 1: PRODUCT LISTING MANAGER */}
        {adminTab === 'products' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center bg-[#0d1222] p-4 rounded-xl border border-blue-500/10">
              <div>
                <h3 className="text-white font-black text-base flex items-center gap-2">
                  <Gamepad className="h-5 w-5 text-cyan-400" />
                  <span>ระบบจัดการบันทึกและจัดจำหน่ายเว็บบัญชีไอดี eFootball</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">ควบคุมสิทธิ์ ผ่อนดาวน์ กำหนดกำไร และอัปรายการขึ้นคลังระบบตลาดหลัก</p>
              </div>
              <button
                onClick={() => {
                  if (showAddForm) resetForm();
                  else setShowAddForm(true);
                }}
                id="admin-add-product"
                className="bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)] active:scale-98"
              >
                <Plus className="h-4 w-4" />
                <span>{showAddForm ? 'ปิดฟอร์มกรอกข้อมูล' : 'ลงขายไอดี eFootball ตัวใหม่'}</span>
              </button>
            </div>

            {/* HIGH FIDELITY MOCKUP FORM REPLICA */}
            {showAddForm && (
              <form onSubmit={handleSaveProduct} className="bg-[#0b0e17] border border-slate-800/85 p-6 rounded-2xl space-y-5 animate-scaleUp">
                <div className="border-b border-slate-800 pb-3 mb-1 flex justify-between items-center">
                  <h4 className="text-cyan-400 font-extrabold text-sm uppercase flex items-center gap-2">
                    <ListPlus className="h-5 w-5" /> 
                    <span>{editProductId ? 'แก้ไขข้อมูลสเปคไอดีเพื่ออัปเดตหน้าร้านเดิม' : 'ลงรายการจัดจำหน่ายไอดี eFootball ตัวใหม่'}</span>
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono">GAME ID: EFOOTBALL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                  {/* Row 1: Title and Platform */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-gray-300 font-bold block">ชื่อรหัสหัวข้อสเปคไอดี</label>
                    <input 
                      type="text" 
                      placeholder="เช่น AC Milan Full Pack Epic 18ตัว แผงหลังครบเครื่อง"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold block mr-2">แพลตฟอร์ม</label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-white outline-none font-sans"
                    >
                      <option value="Mobile (มือถือ)">Mobile (มือถือ)</option>
                      <option value="PC / Console">PC / Console & Steam</option>
                      <option value="iOS เท่านั้น">iOS เท่านั้น</option>
                      <option value="Android เท่านั้น">Android เท่านั้น</option>
                    </select>
                  </div>

                  {/* Row 2: OVR, EpicCount, Cost, OrgPrice, FullPrice (5 columns on desktop) */}
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold block">สเตตัสทีม OVR</label>
                    <input 
                      type="number" 
                      placeholder="3150"
                      value={formOvr || ''}
                      onChange={(e) => setFormOvr(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold block">จำนวนตัว Epic ทั้งสิ้น</label>
                    <input 
                      type="number" 
                      placeholder="15"
                      value={formEpicCount || ''}
                      onChange={(e) => setFormEpicCount(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold block text-cyan-300">ต้นทุนจัดซื้อ (ทุน ฿)</label>
                    <input 
                      type="number" 
                      placeholder="5000"
                      value={formCostPrice || ''}
                      onChange={(e) => setFormCostPrice(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-cyan-400 outline-none focus:border-cyan-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block font-sans">ราคาเต็มปกติป้ายแดง (฿)</label>
                    <input 
                      type="number" 
                      placeholder="เช่น 15000 (ขีดฆ่า)"
                      value={formOriginalPrice || ''}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-slate-400 outline-none focus:border-slate-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-orange-400 font-bold block font-sans">ราคาลดพิเศษ / ขายสด (฿)</label>
                    <input 
                      type="number" 
                      placeholder="12000"
                      value={formFullPrice || ''}
                      onChange={(e) => setFormFullPrice(e.target.value)}
                      className="w-full bg-[#050609] border border-[#f97316]/50 p-3 rounded-xl text-orange-400 outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>

                  {/* Row 3: Live Margin Indicators Banner */}
                  {(() => {
                    const profitVal = Number(formFullPrice || 0) - Number(formCostPrice || 0);
                    const marginVal = Number(formFullPrice) > 0 ? Math.round((profitVal / Number(formFullPrice)) * 100) : 0;
                    return (
                      <div className="col-span-full bg-[#0b0f1d] border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 font-sans">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
                          <span className="text-slate-400">
                            ส่วนต่างค่ากำไรหลังขาย : 
                            <strong className="text-[#10b981] text-lg sm:text-xl ml-2 font-mono font-black">
                              {profitVal >= 0 ? '+' : ''}{profitVal.toLocaleString()} บาท
                            </strong>
                          </span>
                          <span className="h-4 w-[1px] bg-slate-800 hidden md:inline" />
                          <span className="text-slate-400">
                            เปอร์เซ็นต์มาร์จิ้น : 
                            <strong className="text-amber-500 text-lg sm:text-xl ml-2 font-mono font-black">
                              {marginVal}% Margin
                            </strong>
                          </span>
                        </div>
                        <div className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/20">
                          <span>✓ อัตราคำนวณกำไรประเมินตามจริงสำหรับ Google Sheet Sync</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Row 4: Percent rates - 5 columns */}
                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">เงินดาวน์ขั้นต่ำ (%)</label>
                    <input 
                      type="number" 
                      placeholder="10"
                      value={formMinDownPercent}
                      onChange={(e) => setFormMinDownPercent(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-cyan-500 font-mono font-semibold"
                    />
                    <span className="text-[10px] text-gray-500 block pl-1">เริ่มต้น 10%</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">เงินดาวน์สูงสุด (%)</label>
                    <input 
                      type="number" 
                      placeholder="100"
                      value={formMaxDownPercent}
                      onChange={(e) => setFormMaxDownPercent(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-cyan-500 font-mono font-semibold"
                    />
                    <span className="text-[10px] text-gray-500 block pl-1">สูงสุดได้ถึง 100%</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#6366f1] font-bold block">อัตราดอกเบี้ยผ่อนชำระ (%)</label>
                    <input 
                      type="number" 
                      placeholder="5"
                      value={formInterestRate}
                      onChange={(e) => setFormInterestRate(e.target.value)}
                      className="w-full bg-[#050609] border border-[#6366f1]/40 p-2.5 rounded-xl text-[#818cf8] outline-none focus:border-[#6366f1] font-mono font-bold"
                    />
                    <span className="text-[10px] text-[#818cf8]/75 block pl-1">เช่น 5% ต่อสัญญา</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">กลุ่มลีก (Division)</label>
                    <input 
                      type="text" 
                      placeholder="Division 1"
                      value={formDivision}
                      onChange={(e) => setFormDivision(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-cyan-500 font-sans font-semibold"
                    />
                  </div>

                   <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">การเชื่อมต่อไอดี</label>
                    <select 
                      value={formWinRate}
                      onChange={(e) => setFormWinRate(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-cyan-500 font-sans font-semibold cursor-pointer"
                    >
                      <option value="สะอาด2ระบบ">สะอาด2ระบบ</option>
                      <option value="ไม่สะอาดสะอาด1ระบบ (ติดGC ระบบiOS)">ไม่สะอาดสะอาด1ระบบ (ติดGC ระบบiOS)</option>
                      <option value="ไม่สะอาดสะอาด1ระบบ (ติดGG ระบบAndroid)">ไม่สะอาดสะอาด1ระบบ (ติดGG ระบบAndroid)</option>
                    </select>
                  </div>

                  {/* Row 5: Dynamic Photo Gallery upload mimicking */}
                  <div className="col-span-full space-y-2 border border-slate-800/80 p-4 rounded-xl bg-slate-900/10">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-300 font-bold block">ภาพถ่ายประกอบไอดีเกมที่เสนอขายจริง (ใส่รูปเพื่อช่วยเพิ่มความน่าเชื่อถือ)</label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormImageList(prev => [...prev, '']);
                        }}
                        className="p-1 px-3 text-[10px] bg-slate-900 border border-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                        <span>+ เพิ่มรูปภาพประกอบ</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formImageList.map((url, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-slate-500 font-bold font-mono text-[11px] w-6">#{idx + 1}</span>
                          <input 
                            type="text" 
                            placeholder="ระบุลิงก์รูปภาพประกอบไอดีเกม เช่น https://images.unsplash.com/..."
                            value={url}
                            onChange={(e) => {
                              const v = e.target.value;
                              setFormImageList(prev => prev.map((img, i) => i === idx ? v : img));
                            }}
                            className="flex-grow bg-[#050609] border border-slate-800 p-2.5 rounded-lg text-xs text-slate-200 outline-none font-mono"
                          />
                          {formImageList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormImageList(prev => prev.filter((_, i) => i !== idx))}
                              className="p-2.5 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 6: Key players and notes */}
                  <div className="col-span-full space-y-1.5">
                    <label className="text-gray-300 font-bold block">คีย์ผู้เล่นคนสำคัญ (แยกด้วยเครื่องหมายจุลภาค ,)</label>
                    <input 
                      type="text" 
                      placeholder="L. Messi (Epic), Neymar, Ronaldinho"
                      value={formKeyPlayers}
                      onChange={(e) => setFormKeyPlayers(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-slate-100 font-sans outline-none focus:border-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Optional general description */}
                  <div className="col-span-full space-y-1.5">
                    <label className="text-gray-400 block pl-0.5">ใส่ข้อความคำอธิบายเพิ่มเติมดึงดูเน้นๆ (โฆษณา/รับประกันเพิ่มเติมออพชั่นพิเศษ)</label>
                    <textarea 
                      rows={2}
                      placeholder="เช่น ข้อมูลรหัสเปลี่ยนได้ครบถ้วน ปลอดภัย ผ่าน Konami ID อีเมลสะอาด รับรองการโอนย้ายสำเร็จ มีความรับประกันความปลอดภัยสูงสุด..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-[#050609] border border-slate-800 p-3 rounded-xl text-slate-300 font-sans outline-none focus:border-cyan-500"
                    />
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end gap-3 font-sans">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="p-2.5 px-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
                  >
                    ยกเลิกแบบฟอร์ม
                  </button>
                  <button
                    type="submit"
                    className="p-2.5 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-transform active:scale-98 shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                  >
                    {editProductId ? 'อัปเดตบันทึกข้อมูลไอดีร่วมกันคลัง' : 'ลงประกาศขึ้นคลังตลาดทันที'}
                  </button>
                </div>
              </form>
            )}

            {/* HIGH FIDELITY TABLE REPLICA OF THE STOCK */}
            <div className="space-y-2 mt-8">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold text-sm">รายการบัญชี eFootball ทั้งหมดในคลัง (Sync อัตโนมัติและเรียลไทม์)</h4>
                  <p className="text-[11px] text-gray-500 font-sans">จำแนกตามรหัสสินค้า ต้นทุนจัดซื้อ สัดส่วนกำไร และอัตราผ่อนดาวน์จริง</p>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 px-3 py-1 rounded">
                  ไอดีในระบบทั้งหมด: {products.length} รายการ
                </div>
              </div>

              {products.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-slate-800 border-dashed bg-[#070a13]/30 text-gray-500 font-mono text-xs">
                  ไม่มีรายการไอดีเกมจัดวางจำหน่ายในขณะนี้ กรุณากดลงขายภาพสเปคด้านบนชิ้นใหม่ได้ทันทีเลยนะคะ
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a13]/40">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#0d1020]/90">
                        <th className="p-3 pl-4">หมายเลข ID</th>
                        <th className="p-3">ชื่อรหัสสเปค</th>
                        <th className="p-3">แพลตฟอร์ม</th>
                        <th className="p-3">ต้นทุนทุน</th>
                        <th className="p-3">ราคาตั้งขายสด</th>
                        <th className="p-3">ดอกเบี้ยผ่อน (%)</th>
                        <th className="p-3 text-center">สถานะ</th>
                        <th className="p-3 text-center">สั่งการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-sans text-slate-300">
                      {products.map((p) => {
                        const platDetail = p.details.find(d => d.label === 'แพลตฟอร์ม')?.value || p.platform || 'Mobile (มือถือ)';
                        const displayPlatform = platDetail.includes('Mobile') ? 'Mobile' : 'PC / Console';
                        const costPriceVal = p.costPrice || 5000;
                        const interestRateVal = p.interestRate || p.details.find(d => d.label.includes('ดอกเบี้ย'))?.value.replace(/[^0-9]/g, '') || 5;

                        return (
                          <tr key={p.id} className="hover:bg-[#0c101f]/50 transition-colors">
                            {/* Product Code ID in bold blue mono */}
                            <td className="p-3 pl-4 font-mono font-bold text-cyan-400 tracking-wider">
                              {p.code}
                            </td>

                            {/* Spec Title text snippet */}
                            <td className="p-3 font-semibold max-w-[280px] truncate leading-tight text-slate-200">
                              {p.title}
                            </td>

                            {/* Platform */}
                            <td className="p-3 text-gray-400 font-medium">
                              {displayPlatform}
                            </td>

                            {/* Cost Price */}
                            <td className="p-3 font-mono text-slate-400">
                              {costPriceVal.toLocaleString()} ฿
                            </td>

                            {/* Live selling Price in golden orange */}
                            <td className="p-3 font-mono font-extrabold text-[#eab308]">
                              {p.fullPrice.toLocaleString()} ฿
                            </td>

                            {/* Live input of interest percentage rate */}
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <input 
                                  type="text" 
                                  readOnly
                                  value={interestRateVal}
                                  className="w-10 bg-[#04060c] border border-slate-800 text-center text-indigo-400 font-bold p-1 rounded font-mono text-xs cursor-default"
                                />
                                <span className="text-gray-500 font-bold">%</span>
                              </div>
                            </td>

                            {/* Live Badge status of stock */}
                            <td className="p-3 text-center">
                              {(() => {
                                switch (p.status) {
                                  case 'available':
                                    return (
                                      <span className="py-1 px-3 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-950/30 rounded-full inline-block">
                                        ว่างพร้อมขาย
                                      </span>
                                    );
                                  case 'paying':
                                    return (
                                      <span className="py-1 px-3 text-[10px] font-bold text-amber-500 border border-amber-500/20 bg-amber-950/30 rounded-full inline-block">
                                        กำลังผ่อน
                                      </span>
                                    );
                                  case 'reserved':
                                    return (
                                      <span className="py-1 px-3 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 bg-indigo-950/30 rounded-full inline-block">
                                        ติดจอง
                                      </span>
                                    );
                                  case 'sold':
                                    return (
                                      <span className="py-1 px-3 text-[10px] font-bold text-slate-400 border border-slate-700 bg-slate-900 rounded-full inline-block">
                                        ขายแล้ว
                                      </span>
                                    );
                                  default:
                                    return (
                                      <span className="py-1 px-3 text-[10px] font-bold text-slate-300 border border-slate-700 bg-slate-900 rounded-full inline-block">
                                        {p.status}
                                      </span>
                                    );
                                }
                              })()}
                            </td>

                            {/* Delete/Edit actions */}
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDiscountProduct(p.id, p.code)}
                                  className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="ลดราคาสินค้าพิเศษ"
                                >
                                  <Tag className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => triggerEditProduct(p)}
                                  className="p-1.5 text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="แก้ไขข้อมูลรหัสเครื่องนี้"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.code)}
                                  className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="ลบข้อมูลบัญชีคลังตลาด"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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

          </div>
        )}

        {/* TAB 2: APPLICATIONS MANAGER */}
        {adminTab === 'applications' && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-white font-extrabold text-base">รายการสัญญาและคำขอผ่อนชำระสิทธิ์</h3>
              <p className="text-xs text-gray-400 mt-1">ประเมินอนุมัติ ให้รหัสผ่าน และเข้าแทร็กประมวลผลลายเซ็นอิเล็กทรอนิกส์</p>
            </div>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-mono text-xs">
                ไม่พบค้นหาใบคำสัญญายื่นเรื่องจากลูกค้าในคลังขณะนี้
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-slate-950/90 border border-slate-850 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Column 1: Product info */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase font-mono block">ไอดีทำสัญญา: {app.productCode}</span>
                      <h4 className="text-white font-extrabold text-sm leading-snug">{app.productTitle}</h4>
                      
                      <div className="space-y-1 text-xs font-mono border-t border-slate-900 pt-2 text-gray-400">
                        <div>ยอดดาวน์: <strong className="text-cyan-400 font-bold">฿{app.downPaymentAmount.toLocaleString()}</strong></div>
                        <div>ค่างวดผ่อน: <strong className="text-emerald-400 font-semibold">฿{app.weeklyInstallmentAmount} / สัปดาห์</strong> ({app.installmentWeeks} งวด)</div>
                        <div className="text-[10px] text-gray-500 mt-1">เวลาสมัคร: {app.submittedAt}</div>
                      </div>
                    </div>

                    {/* Column 2: User details */}
                    <div className="space-y-2 text-xs font-mono text-gray-400 border-t md:border-t-0 md:border-x border-slate-900 md:px-6">
                      <span className="text-[10px] text-indigo-400 font-bold block uppercase">ข้อมูลประกอบแฟ้มผู้ยื่น :</span>
                      <div>ชื่อผู้กู้สิทธิ์: <strong className="text-white">{app.fullName}</strong> (อายุ {app.age} ปี)</div>
                      <div>เลขสัญญายื่น: <strong className="text-slate-300">{app.id}</strong></div>
                      <div>บัตรประชาชน: <strong className="text-slate-300">{app.nationalId}</strong></div>
                      <div>เบอร์โทรศัพท์: <strong className="text-slate-300">{app.phone}</strong></div>
                      
                      <div className="pt-1.5">
                        <a 
                          href={app.facebook} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline font-sans text-[11px] block truncate"
                        >
                          🌐 เฟสบุ๊คหลัก: คลิกตรวจสอบโปรไฟล์คนขอ
                        </a>
                      </div>
                    </div>

                    {/* Column 3: Canvas Signature and Action outcomes */}
                    <div className="flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-500 font-mono block mb-1">ลายเซ็นอิเล็กทรอนิกส์ยืนยันสิทธิ์ :</span>
                        {app.signatureData ? (
                          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 h-20 flex items-center justify-center">
                            <img src={app.signatureData} alt="signature" className="max-h-full object-contain invert opacity-80" />
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-slate-800 rounded-lg h-20 flex items-center justify-center text-xs text-gray-600 font-mono">
                            ไม่ได้ลงนามสัญญา
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 font-mono text-xs">
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveApp(app.id, app.productCode, false)}
                              className="w-1/2 p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-950/80 border border-red-500/20 text-xs flex items-center justify-center gap-1"
                            >
                              <X className="h-3.5 w-3.5" />
                              ปฏิเสธสัญญานี้
                            </button>
                            <button
                              onClick={() => handleApproveApp(app.id, app.productCode, true)}
                              className="w-1/2 p-2 rounded-xl bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/80 border border-emerald-500/20 text-xs flex items-center justify-center gap-1 font-bold"
                            >
                              <Check className="h-3.5 w-3.5" />
                              อนุมัติผ่านรอบ
                            </button>
                          </>
                        ) : (
                          <div className="w-full text-center py-1.5 rounded-xl border bg-slate-900 border-slate-800">
                            สถานะการตรวจ: <strong className={`font-bold ${app.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}`}>{app.status.toUpperCase()}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: PAYMENT SLIPS AUDIT */}
        {adminTab === 'slips' && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-white font-extrabold text-base">การแจ้งโอนและอัปลิสต์สลิป</h3>
              <p className="text-xs text-gray-400 mt-1">คัดกรอง ยอดตรง ธนาคารปลายทางตรง อัปเดตค่างวดถาวร</p>
            </div>

            {slips.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-mono text-xs">
                ไม่มีการส่งสลิปแจ้งชำระเงินเข้ามาในฐานข้อมูลตอนนี้
              </div>
            ) : (
              <div className="space-y-4">
                {slips.map((slip) => (
                  <div key={slip.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                    
                    <div className="flex items-center gap-3 w-full md:w-auto text-left">
                      <div className="w-12 h-16 bg-slate-900 rounded overflow-hidden flex-shrink-0 border border-slate-800">
                        <img src={slip.slipImage} alt="slip" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] text-cyan-400 font-bold uppercase">ใบยอดแจ้งสำหรับ: {slip.productCode}</div>
                        <h4 className="text-white font-bold text-xs truncate max-w-[280px] mt-0.5">{slip.productTitle}</h4>
                        <div className="text-[10px] text-gray-500 mt-1">เวลาโอน: {slip.transferTime}</div>
                      </div>
                    </div>

                    <div className="text-left md:text-right font-mono">
                      <div className="text-gray-500 text-[10px]">ธนาคารปลายทางร้าน :</div>
                      <p className="text-slate-300 font-medium text-xs mt-0.5">{slip.bank}</p>
                      
                      <div className="mt-1">
                        ยอดจำนวนเงินโอน: <strong className="text-white">฿{slip.transferAmount.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col md:items-end justify-between gap-2">
                      <div className="text-xs font-bold text-slate-400">
                        สถานะสลิป: <span className={slip.status === 'verified' ? 'text-emerald-400' : slip.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}>{slip.status.toUpperCase()}</span>
                      </div>

                      {slip.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifySlip(slip.id, false)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 p-1.5 px-4 rounded-lg font-bold"
                          >
                            ยกเลิกสลิปนี้
                          </button>
                          <button
                            onClick={() => handleVerifySlip(slip.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 px-5 rounded-lg font-bold"
                          >
                            ผ่านอนุมัติเงิน
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500">ผ่านการตัดสินเสร็จสิ้น</span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: KYC SUBMISSIONS */}
        {adminTab === 'kyc' && (
          <div className="space-y-6 text-left font-sans">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base">ระบบอนุมัติเอกสารและวงเงินยืนยันตัวตน (KYC Approvals Tracker)</h3>
              <p className="text-[11px] text-gray-400 mt-1">คัดลอก ตรวจสอบภาพถ่ายปชช ซูมใบหน้าเทียบสัดส่วนพารามิเตอร์ เพื่อมอบวงเงินและผ่านสิทธิ์สัญญา</p>
            </div>

            {/* If no submissions yet */}
            {kycUser.status !== 'step4' && kycUser.status !== 'approved' && kycUser.status !== 'rejected' ? (
              <div className="bg-[#050608] border border-slate-900 rounded-xl p-8 text-center text-gray-500 text-xs">
                <FileCheck2 className="h-10 w-10 mx-auto text-slate-700 mb-3" />
                <span>ขณะนี้ ไม่มีเอกสารส่งยื่นขอรับคะแนนหรือกำลังรอดำเนินการตรวจสอบผ่านช่องทาง KYC ค่ะ</span>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="bg-[#050608] border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">ID: APPLICANT-KYC-99</span>
                      <h4 className="text-white text-sm font-bold flex items-center gap-1.5">
                        <span>{kycUser.fullName || 'ยังไม่ได้ระบุ'}</span>
                        <span className="text-[10px] bg-slate-900 text-gray-400 font-mono py-1 px-2.5 rounded-full border border-slate-800">
                          {kycUser.phone || '0897654321'}
                        </span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="text-[11px] text-gray-500 font-mono">ยื่นเสร็จสิ้น: {kycUser.submittedAt || 'ชั่วครู่ที่ผ่านมา'}</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded font-black text-center ${
                        kycUser.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                        kycUser.status === 'rejected' ? 'bg-red-950 text-red-400 border border-red-500/20' :
                        'bg-yellow-950 text-yellow-400 border border-yellow-500/20 animate-pulse'
                      }`}>
                        {kycUser.status === 'approved' ? 'อนุมัติผ่านแล้ว' :
                         kycUser.status === 'rejected' ? 'ปฏิเสธแล้ว' : 'รอแอดมินประเมิน'}
                      </span>
                    </div>
                  </div>

                  {/* Documents & info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                    
                    <div className="space-y-3">
                      <div className="bg-[#0f111a] p-3 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[11px] font-bold text-gray-400 font-sans">📝 รายละเอียดบัญชียื่นคำขอกู้ :</span>
                        
                        <div className="space-y-1 text-[11px] font-mono leading-relaxed">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ชื่อนามจริง:</span>
                            <span className="text-white font-bold">{kycUser.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">หมายเลข 13 หลัก:</span>
                            <span className="text-white tracking-widest font-extrabold">{kycUser.nationalId}</span>
                          </div>
                          <div className="flex justify-between text-yellow-400 border-t border-slate-900 pt-1">
                            <span>วงเงินกู้ขอรับ:</span>
                            <span className="font-extrabold">฿50,000 (สูงสุด)</span>
                          </div>
                        </div>
                      </div>

                      {/* Display Action buttons if pending */}
                      {kycUser.status === 'step4' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setKycUser((prev: any) => ({ ...prev, status: 'approved' }));
                              addLog('success', `อนุมัติสำเร็จ! บัญชีผู้สมัคร ${kycUser.fullName} ได้รับสถานะ Verified และวงเงิน ฿50,000 แล้ว`);
                            }}
                            className="flex-grow bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                            <span>อนุมัติผ่านสิทธิ์ (Approve KYC)</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('กรุณากรอกเหตุผลปฏิเสธสัญญานี้ด้วยค่ะ:', 'เอกสารรูปบัตรประชาชนหรือใบหน้าถ่ายไม่ชัดเจน กรุณายื่นแนบรูปถ่ายใหม่อีกรอบนะ');
                              if (reason === null) return;
                              setKycUser((prev: any) => ({ ...prev, status: 'rejected' }));
                              addLog('error', `ปฏิเสธสัญญายืนยัน KYC ของ ${kycUser.fullName} เนื่องจาก: ${reason}`);
                            }}
                            className="bg-red-650 hover:bg-red-600 text-white active:scale-95 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                            <span>ปฏิเสธ (Reject)</span>
                          </button>
                        </div>
                      )}

                      {/* Reset status trigger */}
                      {kycUser.status !== 'step4' && (
                        <button
                          onClick={() => {
                            setKycUser((prev: any) => ({ ...prev, status: 'step1', otpSent: false, otpInput: '' }));
                            addLog('warn', `รีเซ็ตสิทธิ KYC บัญชี ${kycUser.fullName} มายังหน้าขั้นตอนแรก เพื่อความสะดวกในการทดสอบฟลูเวสชั่น`);
                          }}
                          className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-400 py-2 px-4 rounded-xl text-[10px] font-bold tracking-wide transition-all"
                        >
                          🔄 รีเซ็ตการสมัครเพื่อเริ่มทดสอบใหม่
                        </button>
                      )}

                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-500">
                      <div>
                        <span className="block mb-1 font-bold">เอกสารบัตร:</span>
                        <div className="h-24 bg-[#0a0c14] border border-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                          {kycUser.idCardImage ? (
                            <img src={kycUser.idCardImage} className="max-h-full object-cover" alt="ID" />
                          ) : (
                            <span>ไม่มีแนบ</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="block mb-1 font-bold">เซลฟี่คู่หน้า:</span>
                        <div className="h-24 bg-[#0a0c14] border border-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                          {kycUser.selfieImage ? (
                            <img src={kycUser.selfieImage} className="max-h-full object-cover" alt="Selfie" />
                          ) : (
                            <span>ไม่มีแนบ</span>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 6: SMS NOTIFICATIONS TEMPLATES */}
        {adminTab === 'sms' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base">การจัดการ SMS และระบบส่งเทมเพลตแจ้งเตือน</h3>
              <p className="text-[11px] text-gray-400 mt-1">กำหนดข้อความอัตโนมัติเมื่อเกิดกิจกรรมทางสัญญาหรือเตือนทวงหนี้รายทาง</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#050608] border border-slate-900 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-white font-bold">เทมเพลตสำหรับส่ง OTP</span>
                </div>
                <textarea 
                  className="w-full h-24 bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-[11px] text-slate-300 font-mono resize-none focus:outline-none focus:border-purple-500"
                  defaultValue="[EASYCONTRACT] รหัสยืนยัน KYC ของคุณคือ {code} (ใช้งานได้ใน 5 นาที) ห้ามแพร่งพรายแก่สายลับ"
                />
                <button 
                  onClick={() => alert("บันทึกเทมเพลต OTP สำเร็จ!")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 rounded-xl text-[10px] border border-slate-805"
                >
                  บันทึกเทมเพลต
                </button>
              </div>

              <div className="bg-[#050608] border border-slate-900 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-white font-bold">เทมเพลตเมื่ออนุมัติผ่านรอบ</span>
                </div>
                <textarea 
                  className="w-full h-24 bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-[11px] text-slate-300 font-mono resize-none focus:outline-none focus:border-purple-500"
                  defaultValue="ยินดีด้วยค่ะ! สัญญาซื้อผ่อนไอดี {productCode} ของท่านได้รับการตรวจสอบผ่านทางระบบแล้ว เข้าใช้อินสแตนได้ทันที"
                />
                <button 
                  onClick={() => alert("บันทึกเทมเพลตอนุมัติสำเร็จ!")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 rounded-xl text-[10px] border border-slate-805"
                >
                  บันทึกเทมเพลต
                </button>
              </div>

              <div className="bg-[#050608] border border-slate-900 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-white font-bold">เทมเพลตแจ้งงวดค้างชำระ</span>
                </div>
                <textarea 
                  className="w-full h-24 bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-[11px] text-slate-300 font-mono resize-none focus:outline-none focus:border-purple-500"
                  defaultValue="แจ้งเตือนด่วน: สัญญาค่างวดแบล็คลิสต์ ไอดี {productCode} ของท่านยังไม่ชำระรอบสัปดาห์ กรุณาโอนเงินระงับล็อค"
                />
                <button 
                  onClick={() => alert("บันทึกเทมเพลตทวงถามค่างวดสำเร็จ!")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 rounded-xl text-[10px] border border-slate-805"
                >
                  บันทึกเทมเพลต
                </button>
              </div>
            </div>

            <div className="bg-[#050608] border border-slate-900 p-5 rounded-2xl">
              <h4 className="text-white text-xs font-bold mb-3 flex items-center gap-1.5 font-sans">
                <span>📣 ส่งแคมเปญ SMS ทะลุเกตเวย์จริง (SMS2pro API)</span>
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-bold font-sans">เบอร์โทรศัพท์ผู้รับจริง (08xxxxxxxx) :</label>
                    <input 
                      type="text" 
                      value={testSmsPhone}
                      onChange={(e) => setTestSmsPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs font-mono text-white outline-none focus:border-purple-500" 
                      placeholder="เช่น 0897654321" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-bold font-sans">ผู้ส่ง (Sender ID กำหนดโดย API) :</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs font-mono text-slate-500" 
                      disabled
                      value="EF-SHOP" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 font-bold font-sans">เนื้อหาข้อความ SMS :</label>
                  <textarea
                    value={testSmsMessage}
                    onChange={(e) => setTestSmsMessage(e.target.value)}
                    className="w-full h-16 bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-300 font-sans resize-none focus:outline-none focus:border-purple-500"
                    placeholder="กรอกข้อความที่ท่านต้องการส่งจริง..."
                  />
                </div>
                <button 
                  onClick={async () => {
                    if (!testSmsPhone.trim()) {
                      alert('กรุณากรอกเบอร์มือถือผู้รับก่อนค่ะ');
                      return;
                    }
                    if (!testSmsMessage.trim()) {
                      alert('กรุณากรอกเนื้อหาข้อความก่อนค่ะ');
                      return;
                    }
                    addLog('info', `กำลังเรียกเซิฟเวอร์ยิง API ส่ง SMS จริงไปยังเบอร์ ${testSmsPhone}...`);
                    try {
                      const response = await fetch('/api/send-sms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          phone: testSmsPhone,
                          message: testSmsMessage
                        })
                      });
                      const result = await response.json();
                      if (result.success) {
                        addLog('success', `[SMS2pro จริง] ส่งสถานะสำเร็จแล้ว เครดิตได้รับการอัปเดตเรียบร้อย!`);
                        alert(`ส่ง SMS ผ่านเกตเวย์ SMS2pro สำเร็จจริง!\nเบอร์ผู้รับ: ${testSmsPhone}\nข้อความ: "${testSmsMessage}"`);
                      } else {
                        addLog('error', `ยิง SMS2pro ผิดพลาด: ${result.message}`);
                        alert(`ส่ง SMS2pro ไม่สำเร็จ: ${result.message}`);
                      }
                    } catch (err: any) {
                      addLog('warn', `ไม่สามารถยิงเกตเวย์เรียลไทม์ได้ในโหมดทดสอบท้องถิ่น`);
                      alert(`ยิงข้อความล้มเหลว: ${err.message}`);
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2 px-4 rounded-xl text-xs font-sans transition-all active:scale-95"
                >
                  🚀 ยิงข้อความผ่านเกตเวย์ SMS2pro จริง
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INSTALLMENTS TRACKER */}
        {adminTab === 'installments' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1222] p-4 rounded-xl border border-blue-500/10">
              <div>
                <h3 className="text-white font-extrabold text-sm sm:text-base">แผงจัดการค่างวดและผู้ค้างชำระ</h3>
                <p className="text-[11px] text-gray-400 mt-1">ระบบติดตามสถานะ การโอนจ่ายรายเดือน/รายสัปดาห์ บันทึกการขยายวันและเตือนหนี้</p>
              </div>
              <button 
                onClick={() => {
                  const id = prompt('ระบุรหัสสัญญา :');
                  if (id) {
                    addLog('success', `บันทึกกระแสเงินเข้าค่างวดสัญญา #${id} เรียบร้อย`);
                    alert('บันทึกค่างวดเรียบร้อย!');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-4 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>บันทึกชำระค่าสัญญางวดใหม่</span>
              </button>
            </div>

            {/* List of active installments */}
            <div className="space-y-4">
              <div className="bg-[#050608] border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3 w-full md:w-auto text-left">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase">สัญญาผ่อน: ROV-SUPER-7789</div>
                    <h4 className="text-white font-bold text-xs">สัญญาผ่อนของ: ดนัย แก้วกมลชาติ</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">ยอดผ่อนสะสมแล้ว: 2/6 งวด (ยอดค้าง: ฿1,500)</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-gray-500 text-[10px]">งวดถัดไปที่ต้องจ่าย :</div>
                  <p className="text-[#ef4444] font-medium text-xs mt-0.5">18 มิ.ย. 2026 (ค้างเกินกำหนด 2 วัน)</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => {
                      addLog('warn', 'ทวงถามหนี้แจ้งเตือนผ่าน SMS ไปยัง ดนัย เรียบร้อย');
                      alert('ส่ง SMS ทวงค่างวดที่เลทเรียบร้อยแล้ว!');
                    }}
                    className="p-1 px-3 rounded bg-red-950/40 border border-red-500/30 text-xs text-red-400 hover:bg-red-950/80 transition-all font-bold"
                  >
                    🔔 แจ้งสัญญาทวงหนี้ SMS
                  </button>
                  <button 
                    onClick={() => {
                      addLog('success', 'บันทึกจ่ายงวดที่ 3 ของ ดนัย สำเร็จ!');
                      alert('บันทึกปิดงวดที่ 3 ลงระบบคลาวด์ร่วมเสร็จสิ้น!');
                    }}
                    className="p-1 px-3 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 hover:bg-emerald-950/80 transition-all font-bold"
                  >
                    💳 ชำระครบงวด
                  </button>
                </div>
              </div>

              <div className="bg-[#050608] border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3 w-full md:w-auto text-left">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">สัญญาผ่อน: VALORANT-VAL-990</div>
                    <h4 className="text-white font-bold text-xs">สัญญาผ่อนของ: เสาวภาคย์ สีใสแสง</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">ยอดผ่อนสะสมแล้ว: 4/4 งวด (จ่ายครบถ้วนสัญญารับไอดีเรียบร้อย)</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-gray-500 text-[10px]">สถานะปัจจุบันของสัญญานี้:</div>
                  <p className="text-emerald-400 font-extrabold text-xs mt-0.5">CLOSED (ปิดตัวเสร็จสมบูรณ์)</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button 
                    disabled 
                    className="p-1 px-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-500 opacity-50 cursor-not-allowed font-medium"
                  >
                    ลบหลักฐานปิดสัญญา
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: USERS DIRECTORY */}
        {adminTab === 'users' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base">ข้อมูลสมาชิกและประวัติการรับวงเงิน</h3>
              <p className="text-[11px] text-gray-400 mt-1">รายชื่อฐานผู้ซื้อที่ผ่านการยืนยันตัวตน มีเครดิตบูสต์และประวัติยื่นใบขอผ่อนสัญญากลาง</p>
            </div>

            <div className="bg-[#050608] border border-slate-850 rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-950/80 border-b border-slate-900 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">ค้นพบทั้งหมด 3 ลูกค้าในฐานระบบจำลอง</span>
                <span className="text-[10px] text-indigo-400 font-mono">วงเงินสูงสุดกำหนดไว้ที่ ฿50,000 ต่อราย</span>
              </div>

              <div className="divide-y divide-slate-900">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-white font-bold text-sm">คุณ {kycUser.fullName || 'ผู้ทดสอบระบบคลาวด์'}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                      <span>เบอร์ติดต่อ: {kycUser.phone || '0897654321'}</span>
                      <span>เลขบัตร: {kycUser.nationalId || '1209900234551'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-gray-500 block">เกรดเครดิตบูโร :</span>
                      <span className="text-emerald-400 font-bold text-xs">อนุมัติระดับ A (Verified)</span>
                    </div>
                    <button 
                      onClick={() => {
                        const score = prompt('ปรับเปลี่ยนคะแนนเครดิต (600 - 1000):', '850');
                        if (score) {
                          addLog('success', `อัปเดตเกรดคะแนนเป็น ${score} สำหรับ ${kycUser.fullName || 'ผู้ยื่นแบบ'} เรียบร้อย`);
                          alert(`เครดิตสกอร์ถูกปรับเป็น ${score} แล้ว!`);
                        }
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs"
                    >
                      ปรับเปลี่ยนสเปค
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-white font-bold text-sm">คุณ ณัฐดนัย สมประสงค์</h5>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                      <span>เบอร์ติดต่อ: 0812234059</span>
                      <span>เลขบัตร: 3209800112459</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-gray-500 block">เกรดเครดิตบูโร :</span>
                      <span className="text-yellow-500 font-bold text-xs">ระดับ B (มีสัญญากลาง)</span>
                    </div>
                    <button 
                      onClick={() => alert('แก้ไขข้อมูลลูกค้า ณัฐดนัย')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs"
                    >
                      ปรับเปลี่ยนสเปค
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-white font-bold text-sm">คุณ ยศพล รุกเด็จไทย</h5>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                      <span>เบอร์ติดต่อ: 0954032128</span>
                      <span>เลขบัตร: 1104800673412</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-gray-500 block">เกรดเครดิตบูโร :</span>
                      <span className="text-gray-500 font-bold text-xs">ยังไม่ยื่น KYC</span>
                    </div>
                    <button 
                      onClick={() => alert('แก้ไขข้อมูลลูกค้า ยศพล')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs"
                    >
                      ปรับเปลี่ยนสเปค
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>

  </div>
  );
}
