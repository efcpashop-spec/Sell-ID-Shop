import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  Gamepad, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Calendar, 
  Coins, 
  Tag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onApply: (product: Product, selectedWeeks: number, customDown: number) => void;
  collectedCoupons?: string[];
}

function getTieredRate(price: number, weeks: number): number {
  if (price <= 2000) {
    if (weeks <= 2) return 0.05;
    if (weeks <= 4) return 0.10;
    return 0.15;
  } else if (price <= 5000) {
    if (weeks <= 2) return 0.10;
    if (weeks <= 4) return 0.15;
    return 0.20;
  } else if (price <= 8000) {
    if (weeks <= 2) return 0.15;
    if (weeks <= 4) return 0.20;
    return 0.25;
  } else { // 8001+
    if (weeks <= 2) return 0.20;
    if (weeks <= 4) return 0.25;
    return 0.30;
  }
}

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onApply,
  collectedCoupons = []
}: ProductDetailModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [activeMode, setActiveMode] = useState<'installment' | 'full'>('installment');
  
  // Installment configuration states
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [customDownPayment, setCustomDownPayment] = useState(Math.round(product.fullPrice * 0.10));
  const [selectedWeeks, setSelectedWeeks] = useState(4); // Default to 4 weeks like the screenshot!
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; type: 'cash' | 'interest'; discountVal: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'err'; text: string } | null>(null);

  const handleApplyCoupon = () => {
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      setCouponMsg(null);
      return;
    }
    if (cleanCode === 'WELCOME100') {
      setActiveCoupon({ code: 'WELCOME100', type: 'cash', discountVal: 100 });
      setCouponMsg({ type: 'success', text: '✓ คูปองส่วนลดเงินสด ฿100 สำเร็จ!' });
    } else if (cleanCode === 'EFCPA50') {
      setActiveCoupon({ code: 'EFCPA50', type: 'interest', discountVal: 0.50 });
      setCouponMsg({ type: 'success', text: '✓ คัดลอกลดค่ากำไรราคาผ่อน 50% สำเร็จ!' });
    } else {
      setCouponMsg({ type: 'err', text: '❌ ดคูปองนี้ไม่มีอยู่ในระบบคูปองแจกฟรีขณะนี้' });
      setActiveCoupon(null);
    }
  };

  const applyCouponDirectly = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME100') {
      setActiveCoupon({ code: 'WELCOME100', type: 'cash', discountVal: 100 });
      setCouponMsg({ type: 'success', text: '✓ คูปองส่วนลดเงินสด ฿100 สำเร็จ!' });
    } else if (cleanCode === 'EFCPA50') {
      setActiveCoupon({ code: 'EFCPA50', type: 'interest', discountVal: 0.50 });
      setCouponMsg({ type: 'success', text: '✓ คัดลอกลดค่ากำไรราคาผ่อน 50% สำเร็จ!' });
    } else {
      setCouponMsg({ type: 'err', text: '❌ ดคูปองนี้ไม่มีอยู่ในระบบคูปองแจกฟรีขณะนี้' });
      setActiveCoupon(null);
    }
  };

  // Pricing math matching screenshot and logic perfectly with Tiered Profit Configuration
  const downPayment = customDownPayment;
  const remainingPrincipal = Math.max(0, product.fullPrice - downPayment);
  
  let interestPct = getTieredRate(product.fullPrice, selectedWeeks);
  if (activeCoupon?.type === 'interest') {
    interestPct = interestPct * 0.50; // 50% discount on tiered margin
  }
  const interestAmount = Math.round(remainingPrincipal * interestPct);
  
  const discountAmount = activeCoupon?.type === 'cash' ? activeCoupon.discountVal : 0;
  const totalWithInterest = Math.max(0, remainingPrincipal + interestAmount - discountAmount);
  const calculatedWeekly = selectedWeeks > 0 ? Math.floor(totalWithInterest / selectedWeeks) : 0;
  const discountedFullPrice = Math.max(0, product.fullPrice - discountAmount);

  // Handler when down payment percentage is clicked
  const handleDownPaymentPctClick = (pct: number) => {
    setDownPaymentPct(pct);
    const amount = Math.round(product.fullPrice * (pct / 100));
    setCustomDownPayment(amount);
  };

  // Sync range slider dragging back to percentage estimation or vice versa
  const handleSliderChange = (val: number) => {
    setCustomDownPayment(val);
    // Find nearest percentage for button highlight
    const estimatedPct = Math.round((val / product.fullPrice) * 10) * 10;
    if ([10, 20, 30, 40, 50].includes(estimatedPct)) {
      setDownPaymentPct(estimatedPct);
    } else {
      setDownPaymentPct(0); // Custom selection
    }
  };

  // Dummy values to match screenshot's platform and win rate info
  const platformName = "Mobile";
  const winRateInfo = "89.2% (980 นัด)";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div 
        id="product-detail-modal"
        className="relative bg-[#060412] border border-purple-500/20 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(139,92,246,0.25)] max-h-[96vh] flex flex-col animate-scaleUp"
      >
        
        {/* Sleek Custom Top Toolbar Row */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-purple-500/10 bg-[#09051d]/40 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>รหัสอ้างอิงสินค้า: {product.code}</span>
          </div>
          <button 
            onClick={onClose}
            id="close-detail-modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Master Workspace */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
          
          {/* Main layout split columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Col: Media Showcase (5 spans) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Product title header inside content space */}
              <div className="text-left space-y-1.5">
                <span className="text-[#a855f7] font-extrabold text-[12px] uppercase font-mono tracking-wider">
                  {product.code}
                </span>
                <h1 className="text-white font-extrabold text-xl md:text-2xl leading-tight">
                  {product.title}
                </h1>
                
                {/* Embedded tags from the screenshot */}
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="bg-[#120b2d] border border-purple-500/20 text-[#a855f7] px-3 py-1 rounded-full font-bold">
                    แพลตฟอร์ม: <span className="text-white font-black">{platformName}</span>
                  </span>
                  <span className="bg-[#120b2d] border border-purple-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                    อัตราชนะ: <span className="text-white font-black">{winRateInfo}</span>
                  </span>
                </div>
              </div>

              {/* Cover Slide Viewports */}
              <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden border border-purple-500/15 bg-slate-950 shadow-md">
                <img 
                  src={product.images[activeImgIdx]} 
                  alt={product.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Slide navigations overlay */}
                <button
                  onClick={() => setActiveImgIdx((p) => p === 0 ? product.images.length - 1 : p - 1)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-xl bg-slate-950/80 text-gray-300 hover:text-white border border-slate-900 flex items-center justify-center hover:bg-[#4d3efc] transition-all"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setActiveImgIdx((p) => p === product.images.length - 1 ? 0 : p + 1)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-xl bg-slate-950/80 text-gray-300 hover:text-white border border-slate-900 flex items-center justify-center hover:bg-[#4d3efc] transition-all"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>

                <div className="absolute top-3.5 right-3.5 bg-[#070314]/90 border border-purple-500/10 px-3 py-1.5 rounded-xl shadow-lg">
                  <span className="text-emerald-400 text-[10px] font-black font-mono">✓ ตรวจรับความปลอดภัย 100%</span>
                </div>
              </div>

              {/* Slide Thumbnails line */}
              <div className="flex gap-2 justify-start overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-20 h-13 rounded-xl overflow-hidden border transition-all ${
                      idx === activeImgIdx ? 'border-purple-500 scale-102 ring-1 ring-purple-500/40' : 'border-slate-900 opacity-55 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Game details specs table */}
              <div className="bg-[#09051d]/60 border border-purple-950/20 p-4 rounded-2xl text-left space-y-2">
                <h4 className="text-xs text-[#38bdf8] font-black font-mono flex items-center gap-1.5">
                  <Gamepad className="h-4 w-4" /> คุณสมบัติบัญชีหลักอย่างละเอียด
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 pt-1.5">
                  {product.details.map((detail, index) => (
                    <div key={index} className="flex flex-col border-b border-purple-900/10 pb-1.5 text-xs">
                      <span className="text-[10px] text-gray-500 font-mono font-bold uppercase">{detail.label}</span>
                      <span className="text-slate-200 font-black truncate mt-0.5">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: High-Fidelity Interactive Form (7 spans) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Active Plan Tabs Selector */}
              <div className="grid grid-cols-2 gap-3 bg-[#080517] border border-purple-900/10 p-1.5 rounded-2xl">
                <button
                  onClick={() => setActiveMode('installment')}
                  className={`py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeMode === 'installment'
                      ? 'bg-[#4d3efc] text-white shadow-[0_4px_15px_rgba(77,62,252,0.5)] border border-indigo-400/20'
                      : 'text-slate-400 hover:text-white hover:bg-purple-950/20'
                  }`}
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span>🗓️ ผ่อนชำระค่างวด</span>
                </button>
                <button
                  onClick={() => setActiveMode('full')}
                  className={`py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeMode === 'full'
                      ? 'bg-emerald-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] border border-emerald-400/20'
                      : 'text-emerald-500/85 hover:text-emerald-400 hover:bg-emerald-950/20'
                  }`}
                >
                  <Coins className="h-4.5 w-4.5" />
                  <span>💵 ซื้อขาดจ่ายเต็ม</span>
                </button>
              </div>

              {activeMode === 'installment' ? (
                <>
                  {/* Container matching standard dark theme */}
                  <div className="bg-[#09051f]/80 border border-purple-500/15 rounded-2xl p-5 text-left space-y-4">
                    
                    {/* Select Down Payment Title Ribbon */}
                    <div className="flex items-center justify-between border-b border-[#1b1542] pb-3.5">
                      <h3 className="text-white font-extrabold text-sm sm:text-base">
                        เงินดาวน์ที่ต้องชำระวันนี้ (บาท)
                      </h3>
                      
                      <div className="border border-emerald-500/20 bg-emerald-950/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded">
                        SELECT DOWN PAYMENT
                      </div>
                    </div>

                    {/* Choose Percentage row */}
                    <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                      <span className="text-slate-300 font-bold">เลือกอัตราเงินดาวน์:</span>
                      <div className="bg-[#12082b] border border-purple-500/20 px-3 py-1.5 rounded-full text-yellow-400 font-mono font-black text-xs">
                        {downPaymentPct}% ({customDownPayment.toLocaleString()} บาท)
                      </div>
                    </div>

                    {/* Percentage buttons selector */}
                    <div className="grid grid-cols-5 gap-2">
                       {[10, 20, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleDownPaymentPctClick(pct)}
                          className={`py-2 px-1 rounded-xl text-xs font-black font-mono transition-all border ${
                            downPaymentPct === pct
                              ? 'bg-[#4d3efc] border-indigo-400 text-white shadow-[0_0_12px_rgba(77,62,252,0.3)]'
                              : 'bg-[#0d0728] border-purple-950/60 text-slate-300 hover:text-white hover:bg-purple-950/35'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-gray-500 font-mono text-center pt-1.5">
                      💡 อัตรางวดผ่อนแปรผันตามเกณฑ์ดาวน์ (ยิ่งเลือกดาวน์สูง ค่างวดต่อสัปดาห์ยิ่งลดลงประหยัดกว่า)
                    </div>

                  </div>

                  {/* Weeks installment selection card */}
                  <div className="bg-[#09051f]/80 border border-purple-500/15 rounded-2xl p-5 text-left space-y-4">
                    
                    {/* Header indicator row */}
                    <div className="flex items-center justify-between border-b border-[#1b1542] pb-3.5">
                      <h3 className="text-white font-extrabold text-sm sm:text-base">
                        ระยะเวลาผ่อนชำระ (สัปดาห์)
                      </h3>
                      
                      <div className="border border-indigo-500/35 bg-[#12082b] text-indigo-400 text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full">
                        1 ถึง 6 สัปดาห์
                      </div>
                    </div>

                    {/* Weeks buttons (No Slider!) */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {[1, 2, 3, 4, 5, 6].map((wk) => (
                        <button
                          key={wk}
                          onClick={() => setSelectedWeeks(wk)}
                          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-black font-sans transition-all border ${
                            selectedWeeks === wk
                              ? 'bg-[#4d3efc] border-indigo-400 text-white shadow-[0_0_12px_rgba(77,62,252,0.3)]'
                              : 'bg-[#0a0721]/80 border-purple-950/60 text-slate-300 hover:text-white hover:bg-purple-950/30'
                          }`}
                        >
                          {wk} สัปดาห์
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Coupon section card */}
                  <div className="bg-[#09051f]/50 border border-purple-950/40 p-4.5 rounded-2xl text-left space-y-3">
                    <span className="text-xs text-slate-300 font-bold block">กรอกโค้ดคูปองส่วนลดคู่สัญญา (ถ้ามี)</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="เช่น WELCOME100"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-grow bg-[#09041a] border border-purple-950 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#4d3efc]/80 placeholder:text-gray-600 font-mono font-bold"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="bg-[#3e2abf] hover:bg-[#4d36db] active:scale-95 text-white text-xs py-2 px-5 rounded-xl font-black transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        ใช้โค้ด
                      </button>
                    </div>

                    {couponMsg && (
                      <p className={`text-[11px] font-bold ${couponMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {couponMsg.text}
                      </p>
                    )}

                    {/* Collected Coupons Selection list */}
                    {collectedCoupons.length > 0 && (
                      <div className="pt-2 border-t border-purple-950/30">
                        <span className="text-[10px] text-pink-400 font-extrabold flex items-center gap-1 mb-1.5 uppercase tracking-wide">
                          <span className="text-xs">🎟️</span> คูปองสะสมของคุณ (คลิกเพื่อเลือกใช้ทันที):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {collectedCoupons.map((code) => {
                            const discountText = code === 'WELCOME100' ? 'ลด 100฿' : 'ลดกำไร 50%';
                            const isApplied = activeCoupon?.code === code;
                            
                            return (
                              <button
                                key={code}
                                type="button"
                                onClick={() => {
                                  setCouponInput(code);
                                  applyCouponDirectly(code);
                                }}
                                className={`text-[10px] font-mono font-black rounded-lg px-2.5 py-1.5 transition-all text-left flex items-center gap-1.5 cursor-pointer border ${
                                  isApplied 
                                    ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)] font-black' 
                                    : 'bg-[#0f0a28]/80 hover:bg-[#1b1248] border-purple-500/20 hover:border-purple-500/40 text-slate-300 font-black'
                                }`}
                              >
                                <span>{code}</span>
                                <span className={isApplied ? 'text-yellow-400' : 'text-gray-400'}>
                                  ({discountText})
                                </span>
                                {isApplied && <span className="text-emerald-400 ml-0.5 font-bold">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Outcome Price Breakdown Sheet matching exactly the mock screenshot */}
                  <div className="bg-[#09041b] border border-purple-500/10 rounded-2xl p-5 text-left space-y-4 font-sans shadow-inner">
                    
                    {/* Rows */}
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-medium text-slate-400">ยอดไอดีตั้งต้น (บาท) :</span>
                        {product.originalPrice && product.originalPrice > product.fullPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through text-xs font-mono font-bold">฿{product.originalPrice.toLocaleString()}</span>
                            <span className="text-rose-400 font-mono font-black">฿{product.fullPrice.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-100 font-mono font-black">{product.fullPrice.toLocaleString()} บาท</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">เงินดาวน์ที่ต้องชำระวันนี้ (บาท) :</span>
                        <span className="text-yellow-400 font-mono font-black">-{customDownPayment.toLocaleString()} บาท ({downPaymentPct > 0 ? `${downPaymentPct}%` : 'Custom'})</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#a855f7] font-medium">คูปองเงินสดนำไปลดหักลดสิทธิ :</span>
                          <span className="text-magenta-400 font-mono font-black">-{discountAmount.toLocaleString()} บาท</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-medium text-slate-400">เงินต้นคงเหลือนำไปผ่อนชำระ (บาท) :</span>
                        <span className="text-slate-100 font-mono font-black">{remainingPrincipal.toLocaleString()} บาท</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium font-sans">ส่วนต่างราคาขายแบบผ่อนชำระ :</span>
                        <span className="text-indigo-400 font-mono font-black">+{interestAmount.toLocaleString()} บาท</span>
                      </div>
                    </div>

                    {/* Border Division */}
                    <div className="border-t border-[#1a0f44]" />

                    {/* Outstanding summaries matching exactly the gold and green items */}
                    <div className="space-y-4 pt-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-slate-400 font-bold">เงินดาวน์ที่ต้องชำระวันนี้ (บาท):</span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">
                          {customDownPayment.toLocaleString()} <span className="text-xs text-slate-400 font-normal">บาท</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold">ระยะเวลาผ่อนชำระ (สัปดาห์):</span>
                        <span className="text-base sm:text-lg font-black text-white font-mono">
                          {selectedWeeks} <span className="text-xs text-slate-400 font-normal">สัปดาห์</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-[#070310] p-4.5 rounded-xl border border-purple-500/10">
                        <div className="text-left">
                          <span className="text-xs text-slate-400 font-black block">ยอดผ่อนชำระรายสัปดาห์ (บาท):</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl sm:text-3xl font-black text-[#10b981] font-mono tracking-tight glow-emerald">
                            {calculatedWeekly.toLocaleString()} <span className="text-xs text-[#10b981] font-normal leading-none block mt-1">ต่อสัปดาห์</span>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Submitting Trigger Button */}
                  <div className="pt-2">
                    {product.status === 'available' ? (
                      <button
                        onClick={() => onApply(product, selectedWeeks, customDownPayment)}
                        id="modal-submit-apply"
                        className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black py-4 px-6 rounded-2xl text-sm transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
                      >
                        <ArrowRight className="h-4.5 w-4.5" />
                        <span>🛒 เริ่มผ่อนและตั้งสัญญางวดแรก</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-slate-800 text-slate-500 font-bold py-4 px-6 rounded-2xl text-xs cursor-not-allowed"
                      >
                        สินค้านี้เสร็จสิ้นผู้รับผ่อนหมดแล้ว
                      </button>
                    )}
                  </div>

                  {/* Bottom safety guarantees row matching screenshot */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs text-gray-500 font-sans pt-1">
                    <span className="flex items-center justify-center gap-1">✓ มีใบรับประกันแอดมิน</span>
                    <span className="flex items-center justify-center gap-1">✓ ส่วนต่างสัญญารักษาสิทธิ์ที่</span>
                    <span className="flex items-center justify-center gap-1">✓ คืนสลิปทดลองได้</span>
                  </div>
                </>
              ) : (
                /* BUY OUT FULL PRICE PLAN */
                <div className="bg-[#09051f]/80 border border-emerald-500/20 rounded-2xl p-5 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1b1542] pb-3.5">
                    <h3 className="text-white font-extrabold text-sm sm:text-base">
                      ซื้อขาดจ่ายเต็ม (Buyout Full Option)
                    </h3>
                    <div className="border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded">
                      FULL OPTION CASH
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    การทำธุรกรรมซื้อสิทธิ์ขาดทันที คุณจะได้รับส่วนลดพิเศษสำหรับการโอนเงินสมบูรณ์ โดยไม่ต้องตรวจเช็คเครดิตหรือไม่จำเป็นต้องทำผู้ลงลายมือเซ็นสัญญา รับบัญชีและรหัส Konami ID ทันทีในแชทแฮนเดิลดูแล 24 ชั่วโมง
                  </p>

                  <div className="bg-[#070310] p-5 rounded-2xl border border-emerald-500/10 space-y-4">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-400 font-bold">มูลค่าโอนเงินสดปกติ :</span>
                      <span className="text-slate-400 font-mono line-through font-bold">฿{product.fullPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-black text-xs sm:text-sm">ยอดจ่ายขาดสุดพิเศษช่วงนี้ :</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono glow-emerald">
                        ฿{Math.round(product.fullPrice * 0.95).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onApply(product, 0, Math.round(product.fullPrice * 0.95))}
                      id="modal-submit-buyout"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl text-sm transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_30px_rgba(16,185,129,0.25)]"
                    >
                      <span>💳 ชำระยอดซื้อสิทธิ์ขาดทันที</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          <div className="h-[1px] bg-slate-900 pt-1" />

          {/* Secure purchase instruction notes */}
          <div className="bg-slate-950/40 border border-slate-900/80 p-5 rounded-2xl text-left space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase font-mono tracking-wider">
              <ShieldCheck className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
              ข้อกำหนดสัญญาและขั้นตอนสำหรับผู้ผ่อนชำระ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed text-slate-400 font-sans">
              <div className="bg-[#090516]/80 p-3.5 rounded-xl border border-purple-950/30">
                <span className="text-purple-400 font-black font-mono">1. สมัครยืนยันความพร้อม :</span>
                <p className="mt-1 text-gray-500">กรอกข้อมูลผู้ผ่อนชำระ เอกสารอ้างอิง และลงนามเซ็นเอกสารดิจิทัลอิเล็กทรอนิกส์ครบถ้วนตามความจริง</p>
              </div>
              <div className="bg-[#090516]/80 p-3.5 rounded-xl border border-purple-950/30">
                <span className="text-emerald-400 font-black font-mono">2. โอนจ่ายยอดดาวน์ชำระ :</span>
                <p className="mt-1 text-gray-500">แคปหรืออัปโหลดรูปภาพสลิปที่ผ่านการโอนดาวน์งวดแรกในระบบ แอดมินสุ่มตรวจสอบอัตโนมัติภายใน 1 นาที</p>
              </div>
              <div className="bg-[#090516]/80 p-3.5 rounded-xl border border-purple-950/30">
                <span className="text-indigo-400 font-black font-mono">3. ส่งรับมอบไอดีเข้าเช่าเล่น :</span>
                <p className="mt-1 text-gray-500">ระบบจะทำการอนุมัติข้อมูล Konami ID และส่งเมลผ่านกระบวนการความปลอดภัย และให้เข้าจัดสิทธิ์ผู้ถือของสายผ่อนทันที</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Outer Footer layout info */}
        <div className="p-4.5 border-t border-slate-900 bg-slate-950/90 text-[11px] text-gray-500 text-center font-mono">
          <span>ความปลอดภัยมาตรฐานสูงสุดสัญญากรมพัฒนาการตลาดแห่งชาติสิทธิ์แท้ 100% บันทึกที่อยู่ IP-SSL SECURE</span>
        </div>

      </div>
    </div>
  );
}
