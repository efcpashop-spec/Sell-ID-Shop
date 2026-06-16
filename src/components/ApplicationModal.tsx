import React, { useState, useRef, useEffect } from 'react';
import { Product, InstallmentApplication } from '../types';
import { 
  X, 
  User, 
  CheckCircle2, 
  PenTool, 
  Loader2, 
  Check, 
  Award,
  ArrowRight,
  Info,
  Wallet,
  Printer
} from 'lucide-react';
import OwnerSignature from './OwnerSignature';
import OfficialStamp from './OfficialStamp';
import StoreLogo from './StoreLogo';

interface ApplicationModalProps {
  product: Product;
  selectedWeeks: number;
  selectedDown: number;
  onClose: () => void;
  onSubmit: (app: Omit<InstallmentApplication, 'id' | 'status' | 'submittedAt'>) => void;
  collectedCoupons?: string[];
  kycUser?: any;
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

export default function ApplicationModal({ 
  product, 
  selectedWeeks, 
  selectedDown, 
  onClose, 
  onSubmit,
  collectedCoupons = [],
  kycUser
}: ApplicationModalProps) {
  const isKycVerified = kycUser?.isLoggedIn;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Inputs State
  const [fullName, setFullName] = useState(() => kycUser?.fullName || '');
  const [phone, setPhone] = useState(() => kycUser?.phone || '');
  const [facebook, setFacebook] = useState('');

  // HTML5 Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState<string | undefined>(undefined);

  // Outcome contract values
  const [contractNo] = useState(() => 'CT-' + Math.floor(100000 + Math.random() * 900000));
  
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
      setCouponMsg({ type: 'success', text: '✓ คัดลอกเปิดใช้งาน คูปองส่วนลดเงินสด ฿100 สำเร็จ!' });
    } else if (cleanCode === 'EFCPA50') {
      setActiveCoupon({ code: 'EFCPA50', type: 'interest', discountVal: 0.50 });
      setCouponMsg({ type: 'success', text: '✓ คัดลอกเปิดใช้งาน คูปองลดค่ากำไรราคาผ่อน 50% สำเร็จ!' });
    } else {
      setCouponMsg({ type: 'err', text: '❌ คูปองนี้ไม่มีอยู่ หรือไม่พบในสารระบบแจกฟรีขณะนี้' });
      setActiveCoupon(null);
    }
  };

  const applyCouponDirectly = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME100') {
      setActiveCoupon({ code: 'WELCOME100', type: 'cash', discountVal: 100 });
      setCouponMsg({ type: 'success', text: '✓ คัดลอกเปิดใช้งาน คูปองส่วนลดเงินสด ฿100 สำเร็จ!' });
    } else if (cleanCode === 'EFCPA50') {
      setActiveCoupon({ code: 'EFCPA50', type: 'interest', discountVal: 0.50 });
      setCouponMsg({ type: 'success', text: '✓ คัดลอกเปิดใช้งาน คูปองลดค่ากำไรราคาผ่อน 50% สำเร็จ!' });
    } else {
      setCouponMsg({ type: 'err', text: '❌ คูปองนี้ไม่มีอยู่ หรือไม่พบในสารระบบแจกฟรีขณะนี้' });
      setActiveCoupon(null);
    }
  };

  const downPayment = selectedDown;
  const remainingPrincipal = Math.max(0, product.fullPrice - downPayment);
  
  let interestPct = getTieredRate(product.fullPrice, selectedWeeks);
  if (activeCoupon?.type === 'interest') {
    interestPct = interestPct * 0.50; // 50% discount on tiered margin
  }
  const interestAmount = Math.round(remainingPrincipal * interestPct);
  
  const discountAmount = activeCoupon?.type === 'cash' ? activeCoupon.discountVal : 0;
  const totalWithInterest = Math.max(0, remainingPrincipal + interestAmount - discountAmount);
  const finalWeeklyWithInterest = selectedWeeks > 0 ? Math.floor(totalWithInterest / selectedWeeks) : 0;
  
  const discountedFullPrice = Math.max(0, product.fullPrice - discountAmount);

  // Initialize Canvas paint listeners
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e3a8a'; // Ink blue look for official signature
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [step]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling on mobile touch
    if ('touches' in e) {
      e.preventDefault();
    }

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasSigned) {
      setSigDataUrl(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSigDataUrl(undefined);
  };

  // Advance steps with light checks
  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !facebook.trim()) {
        alert('กรุณากรอกข้อมูลส่วนตัว เบอร์โทรศัพท์ และช่องทางติดต่อ Facebook ให้ครบถ้วนก่อนส่งสัญญาครับ');
        return;
      }
      setStep(2);
    }
  };

  // Final Action execution with scoring animations
  const handleFinalSubmit = () => {
    if (!hasSigned) {
      alert('กรุณาเซ็นชื่อลายเซ็นอิเล็กทรอนิกส์ในช่องลงนามเพื่อสัญญาซื้อขายก่อนผูกสิทธิ์ค่่ะ');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleConfirmFinish = () => {
    onSubmit({
      productId: product.id,
      productTitle: product.title,
      productCode: product.code,
      productPrice: discountedFullPrice,
      downPaymentAmount: selectedDown,
      installmentWeeks: selectedWeeks,
      weeklyInstallmentAmount: finalWeeklyWithInterest,
      fullName,
      nationalId: '1122334455667', // Static placeholder
      age: 20,
      facebook,
      phone,
      signatureData: sigDataUrl
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="application-modal"
        className={`relative bg-[#0b0c10] border border-cyan-500/20 w-full ${step === 2 ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(6,182,212,0.2)] flex flex-col max-h-[92vh] animate-scaleUp text-left`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base md:text-lg">
                {step === 2 ? "ลงนามสัญญาเช่าซื้อออนไลน์" : "ข้อมูลยื่นระบบสมัครผ่อนสิทธิ์สล็อตไอดี"}
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                ไอดี {product.code} | ยอดดาวน์ ฿{selectedDown.toLocaleString()} | {selectedWeeks} สัปดาห์
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button 
              onClick={onClose}
              id="close-app-modal"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Step Banner indicators */}
        {step !== 3 && (
          <div className="bg-slate-950 px-6 py-3 border-b border-slate-900 flex justify-between items-center text-xs text-gray-400 font-mono">
            <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-cyan-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-slate-800'}`}>1</span>
              กรอกข้อมูลติดต่อส่วนตัว
            </span>
            <span className="h-[1px] bg-slate-800 flex-grow mx-4" />
            <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-cyan-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-cyan-500/20 border border-cyan-400' : 'bg-slate-800'}`}>2</span>
              ลงนามอ่านยอมรับร่างสัญญาซื้อขาย
            </span>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-grow space-y-5 bg-[#08090d]/95 scrollbar-thin">
          
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-white font-extrabold text-sm">ระบบกำลังตรวจสอบประวัติเครดิตบูโรด่วน . . .</p>
                <p className="text-xs text-gray-400 font-mono">กำลังจัดทำหนังสือร่างตราตั้งสิทธิสัญญาเช่าซื้อออนไลน์ความเร็วสูงแบบ A4</p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Applicant bio form */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-cyan-500/5 border border-cyan-500/10 p-3.5 rounded-xl flex gap-3 text-xs text-cyan-300 leading-normal">
                    <Info className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold block mb-0.5">ระเบียบข้อมูลสำคัญสำหรับการจัดส่งสิทธิ์ :</span>
                      กรุณากรอกข้อมูลส่วนตัว ลิงก์เฟสบุ๊ค และเบอร์โทรที่สามารถติดต่อได้จริง เพื่อระบบประเมินเครดิตแบบเรียลไทม์ และเจ้าหน้าที่สามารถประสานงานส่งมอบข้อมูลไอดีได้สะดวกรวดเร็วที่สุดครับ
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs font-mono">
                    
                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-medium block">ชื่อ - นามสกุลจริง (สำหรับผู้ผ่อนทำสัญญา) <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="เช่น นายสมบูรณ์ ใจดี"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#050608] border border-slate-800 focus:border-cyan-500/50 p-2.5 pl-9 rounded-xl text-white outline-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-medium block">เบอร์โทรศัพท์มือถือที่ใช้ติดต่อได้จริง (ใช้ติดต่อจัดส่ง) <span className="text-red-400">*</span></label>
                      <input 
                        type="tel" 
                        placeholder="เช่น 088-392-8174"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#050608] border border-slate-800 focus:border-cyan-500/50 p-2.5 rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-medium block">ลิงก์โปรไฟล์ Facebook ส่วนตัว (สำหรับรับรหัสและติดต่อดึงเข้ากลุ่มสิทธิ์) <span className="text-red-400">*</span></label>
                      <input 
                        type="url" 
                        placeholder="เช่น https://www.facebook.com/yourprofile"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        className="w-full bg-[#050608] border border-slate-800 focus:border-cyan-500/50 p-2.5 rounded-xl text-white outline-none font-sans"
                      />
                      <p className="text-[10px] text-gray-500">เฟสบุ๊คหลักที่ใช้ประจำ แอดมินจะติดต่อส่งและเปลี่ยนไอดีทันทีที่ยื่นเรื่องสำเร็จ</p>
                    </div>

                    {/* Promo Discount Code Field */}
                    <div className="space-y-1.5 text-left border-t border-slate-900 pt-4 mt-2">
                      <label className="text-gray-300 font-bold block flex items-center gap-1">
                        <span>🎟️ รหัสคูปองส่วนลดร้านค้า (คูปองแจกฟรีจากแถบหน้าเว็บ)</span>
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="กรอกโค้ด เช่น WELCOME100, EFCPA50"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-grow bg-[#050608] border border-slate-800 focus:border-cyan-500/50 p-2.5 rounded-xl text-white outline-none font-mono uppercase text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 rounded-xl text-xs transition-colors shrink-0"
                        >
                          ตรวจสอบคูปอง
                        </button>
                      </div>
                      {couponMsg && (
                        <p className={`text-[11px] font-bold leading-relaxed mt-1.5 ${
                          couponMsg.type === 'success' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                        }`}>
                          {couponMsg.text}
                        </p>
                      )}

                      {/* Collected Coupons Selection list */}
                      {collectedCoupons.length > 0 && (
                        <div className="pt-2 border-t border-slate-900/65 mt-3">
                          <span className="text-[10px] text-pink-400 font-extrabold flex items-center gap-1 mb-1.5 uppercase tracking-wide">
                            <span className="text-xs">🎟️</span> คูปองสะสมของคุณ (คลิкเพื่อเลือกใช้ทันที):
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

                  </div>
                </div>
              )}

              {/* STEP 2: Terms Agreement & Signature canvas */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Official Legal Action Bar */}
                  <div className="bg-[#11131c] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-left">
                      <span className="text-[10px] text-indigo-400 font-mono block uppercase">Legal Document Output</span>
                      <span className="text-xs text-slate-300 font-bold font-sans">หนังสือสัญญาเช่าซื้ออิเล็กทรอนิกส์ฉบับจริง (พิมพ์ขนาด A4 ได้)</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500/40 text-white font-extrabold text-[11px] font-mono p-2 px-4 rounded-lg flex items-center gap-1.5 transition-transform active:scale-98"
                      >
                        <Printer className="h-4 w-4" />
                        พิมพ์สัญญา / บันทึก PDF
                      </button>
                    </div>
                  </div>

                  {/* Official A4 White Paper Sheet */}
                  <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-slate-200 font-sans leading-relaxed text-xs">
                    {/* Paper Branding Header */}
                    <div className="flex flex-col items-center text-center border-b border-slate-300 pb-5 mb-5 relative">
                      {/* Store Logo Component instead of raw SVG */}
                      <div className="mb-2">
                        <StoreLogo width={120} height={120} />
                      </div>
                      <span className="text-slate-400 font-mono font-bold tracking-widest text-[9px] uppercase">EF CPA SHOP OFFICIAL LEGAL CONTRACT</span>
                      <h1 className="text-slate-900 font-black text-lg sm:text-xl tracking-tight mt-1">หนังสือสัญญาเช่าซื้อบัญชีอิเล็กทรอนิกส์และผ่อนชำระสิทธิ์ไอดีเกม</h1>
                      <p className="text-slate-500 text-[10px] font-medium tracking-wide mt-0.5">ห้างหุ้นส่วนจำกัด อีเอฟพีเอส ช็อป • EFCPASHOP LIMITED PARTNERSHIP</p>
                      <span className="text-[9px] text-gray-400 px-2.5 py-0.5 border border-slate-200 rounded-full bg-slate-50 font-bold mt-2">ทะเบียนนิติบุคคลเลขที่: 0103569003891 (ถูกต้องตามกฎหมายแพ่งและพาณิชย์)</span>
                    </div>

                    {/* Header metadata row */}
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4 mb-4 text-[11px] font-medium text-slate-600">
                      <div>
                        <strong>เขียนที่:</strong> สำนักงานจดทะเบียนจดสิทธิ หจก. อีเอฟพีเอส ช็อป สำนักงานใหญ่
                      </div>
                      <div className="text-right">
                        <strong>วันที่ทำสัญญา:</strong> {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Contract clauses body copy */}
                    <div className="space-y-3.5 text-slate-800 text-[11px] text-justify leading-relaxed">
                      <p>
                        สัญญาฉบับนี้จัดทำขึ้นโดยความประสงค์ผูกสิทธิ์อย่างชอบธรรมเพื่อเข้าสำรวจนิติกรรมอันเป็นความยุติธรรมและพยานหลักฐานตามหลักความสมบูรณ์ คู่สัญญาทั้งสองภาคส่วนตกลงยอมรับเงื่อนไขสิทธิ์ผูกพันดังรายละเอียดในข้อบัญญัติต่อไปนี้:
                      </p>

                      <p>
                        <strong className="text-slate-950">ฝ่ายผู้ให้เช่าซื้อ:</strong> <strong>ห้างหุ้นส่วนจำกัด อีเอฟพีเอส ช็อป</strong> (ต่อไปสัญญานี้เรียกว่า <strong>"ผู้ให้เช่าซื้อ"</strong>) สำนักงานจดทะเบียนตั้งอยู่เลขที่ระบุตามกฎหมาย มี <strong>นายชยพล ปุญนนท์</strong> เป็นหุ้นส่วนผู้จัดการซึ่งมีอำนาจลงนามผูกพันนิติกรรมแทนแต่เพียงผู้เดียว
                      </p>

                      <p>
                        <strong className="text-slate-950">ฝ่ายผู้เช่าซื้อ:</strong> <strong>{fullName}</strong> ข้อมูลโทรศัพท์สมบูรณ์ติดต่อ: <strong className="text-slate-950 font-mono">{phone}</strong> (ซึ่งต่อจากนี้ในสัญญานี้ เรียกว่า <strong>"ผู้เช่าซื้อ"</strong>)
                      </p>

                      <p className="border-t border-slate-100 pt-3">
                        คู่สัญญาทั้งสองฝ่ายสมัครใจเข้าลงชื่อในเงื่อนไขสัญญาสี่ส่วนสำคัญเพื่อควบคุมสิทธิ์ผ่อนไอดีเกมส์:
                      </p>

                      <div>
                        <strong className="text-slate-950 text-xs block mb-0.5">ข้อ 1. รายละเอียดทรัพย์สินและยอดโอนสิทธิผ่อน</strong>
                        ผู้ให้เช่าซื้อตกลงจัดเตรียมสิทธิ์ให้เช่าซื้อ ไอดีเกม eFootball รหัสคีย์: <strong className="text-slate-950">"{product.title}" ({product.code})</strong> ซึ่งผู้เช่าซื้อยินยอมตกลงผ่อนชำระในยอดมูลค่าเสร็จสิ้นจำนวนทั้งสิ้น <strong className="text-indigo-600">฿{discountedFullPrice.toLocaleString()} บาทถ้วน</strong> ({activeCoupon && <span>หักส่วนลดคูปอง {activeCoupon.code} แล้ว</span>}) โดยผู้เช่าซื้อได้ชำระเงินมัดจำก้อนแรกเรียบร้อยเป็นเงินดาวน์ <strong>฿{selectedDown.toLocaleString()} บาท</strong> และสำหรับยอดที่ค้างส่งผ่อนชำระเฉลี่ย เป็นจำนวนเงินส่งของรายสัปดาห์ละ <strong className="bg-yellow-105 px-1 font-bold">฿{finalWeeklyWithInterest.toLocaleString()} บาทต่อสัปดาห์</strong> เป็นเวลาต่อเนื่องทั้งสิ้น <strong>{selectedWeeks} งวดสัปดาห์</strong>
                      </div>

                      <div>
                        <strong className="text-slate-950 text-xs block mb-0.5">ข้อ 2. สิทธิและกรรมสิทธิ์ในรหัสความปลอดภัยของ หจก. อีเอฟพีเอส ช็อป</strong>
                        ผู้เช่าซื้อยอมรับว่า ตลอดระยะเวลาที่ยังผ่อนค่างวดไม่ครบจำนวน 100% สิทธิ์การเข้าสำรวจเปลี่ยนรหัสความปลอดภัย อีเมล คอนเนคเตอร์ OTP ประตูสิทธิ์ ระบบเข้าหลัก และระบบจัดการไอดีเกม ทั้งหมดเป็นกรรมสิทธิ์ความถูกต้องตามระบบกฎหมายของ หจก. อีเอฟพีเอส ช็อป แต่เพียงผู้เดียว ห้ามมิให้ผู้เช่าซื้อทำการแอบอ้างสิทธิ์แก้ไขอีเมลหลักหรือพยามหลบบิดสิทธิ์ของร้านโดยไม่แจ้งให้ทราบล่วงหน้าเป็นลายลักษณ์อักษร
                      </div>

                      <div>
                        <strong className="text-slate-950 text-xs block mb-0.5">ข้อ 3. การระงับสิทธิขัดข้องรหัสและการยกเลิกสัญญา</strong>
                        หากผู้เช่าซื้อ ค้างส่งชำระค่างวดเกินกว่ากำหนดล่าช้ากว่า 24 ชั่วโมงในงวดใดงวดหนึ่ง ผู้ให้เช่าซื้อมีสิทธิ์เข้าเปลี่ยนรหัสผ่านเพื่อล็อกระงับความปลอดภัยไอดีชั่วคราว และหากผิดนัดเกี่ยงชำระค่างวดครบกำหนดระยะเกิน 14 วัน (หรือค้าง 2 งวดติดต่อกัน) สัญญาฉบับนี้จะถือสิ้นสุดลงทันที หจก. อีเอฟพีเอส ช็อป สามารถเข้าควบคุมบัญชีและดำเนินการนำไอดีเกมส์กลับเข้ามาขายแก่ผู้ขอสิทธิ์คนใหม่ โดยเงินมัดจำที่จัดส่งมาก่อนจะถูกหักชดเชยค่าความรู้ความเสื่อมทรัพย์สิน
                      </div>

                      {/* Critical Red Warning Alert box on A4 printed sheet */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-900 leading-normal text-[10px]">
                        <strong>⚠ ข้อ 4. บทลงโทษ ข้อบังคับความเสียหายสูงสุด และคดีแบนบัญชีอาญา/เครื่องมือโกง (สำคัญที่สุด)</strong>
                        <p className="mt-1 font-sans">
                          ผู้เช่าซื้อยอมสัญญาในความสัจจริงว่า หากมีพฤติกรรมแก้ไขปลอมแปลงบัญชี, ลิงก์ทำลายระบบความปลอดภัย, การดึงเมลเจ้าหน้าที่ หรือเปิดโปรแกรมโกงใดๆ บนรหัสบัญชีของระบบ และส่งผลให้ไอดีเกิดความสูญเสียเสียหาย ถูกจำกัดสิทธิ แบนการใช้เครื่อง หรือระงับสิทธิ์บัญชีเกมดังกล่าว ก่อให้เกิดความชำรุดเสียหายเชิงทรัพย์สินของผู้ให้เช่าซื้อ ผู้เช่าซื้อยอมรับชำระค่าชดใช้เสียหายประเมินเทียบสามเท่าของวงเงิน และยอมรับให้ผู้ให้เช่าซื้อมีอำนาจเอกเทศสูงสุดในการยื่นร้องทุกข์ต่อกองบัญชาการสอบสวนคดีเทคโนโลยี และศาลยุติธรรมเพื่อดำเนินคดีทางแพ่งและคดีอาญาอย่างถึงที่สุดโดยสละสิทธิ์เพิกถอนโต้แย้งทุกกรณี
                        </p>
                      </div>
                    </div>

                    {/* Official Signature Lines 1:1 look */}
                    <div className="grid grid-cols-2 gap-8 border-t border-slate-300 pt-6 mt-6 font-mono text-[10px]">
                      
                      {/* Company Signature */}
                      <div className="text-center relative flex flex-col items-center pt-2 min-h-[170px] justify-between">
                        <div>
                          <span className="font-bold text-slate-800 text-[11px] block mb-1">ฝั่งผู้ให้เช่าซื้อ (SELLER / หจก.)</span>
                          <span className="text-slate-500 block mb-2">(ลงลายมือชื่อพยาน)</span>
                        </div>
                        
                        {/* Inside signature decoration - exact placement */}
                        <div className="absolute top-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10 w-full">
                          {/* Owner Signature Component */}
                          <div className="w-52 h-14">
                            <OwnerSignature />
                          </div>
                          
                          {/* Official stamp component overlaying the signature */}
                          <div className="absolute -top-4 left-[30%] w-24 h-24">
                            <OfficialStamp />
                          </div>
                        </div>

                        <div className="z-20 mt-14">
                          <div className="text-slate-900 font-bold">นายชยพล ปุญนนท์</div>
                          <div className="text-slate-500 text-[9px] mt-0.5">หุ้นส่วนผู้จัดการ / ผู้มีอำนาจลงนามแทน หจก. เจ้าของสิทธิ์</div>
                        </div>
                      </div>

                      {/* Customer Live Signature */}
                      <div className="text-center flex flex-col items-center pt-2 min-h-[170px] justify-between">
                        <div className="w-full">
                          <span className="font-bold text-slate-800 text-[11px] block mb-1">ฝั่งผู้เช่าซื้อ (BUYER / CUSTOMER)</span>
                          <span className="text-slate-500 block mb-2 flex justify-between items-center w-full">
                            <span>(ลงลายมือชื่อที่นี่) :</span>
                            {hasSigned && <span className="text-emerald-600 font-bold">✓ เซ็นแล้ว</span>}
                          </span>

                          {/* HTML5 Canvas inside the white A4 box column */}
                          <div className="relative bg-slate-50 border border-slate-300 rounded-xl overflow-hidden h-28 w-full cursor-crosshair">
                            <canvas 
                              ref={canvasRef}
                              width={400}
                              height={112}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="absolute inset-0 w-full h-full"
                            />
                            {!hasSigned && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-mono text-[9px] pointer-events-none space-y-1">
                                <PenTool className="h-4 w-4 text-slate-400 animate-pulse" />
                                <span>เซ็นลายมือชื่อของคุณลงบนหนังสือสัญญาได้ที่นี่</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-full">
                          <div className="flex justify-between items-center w-full px-1">
                            <div className="text-slate-900 font-bold text-left">{fullName}</div>
                            <button
                              type="button"
                              onClick={clearSignature}
                              className="text-[9px] text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 p-1 px-1.5 rounded transition-colors cursor-pointer"
                            >
                              ล้างลายมือ
                            </button>
                          </div>
                          <div className="text-slate-500 text-[9px] mt-1">ผู้คู่สัญญาผู้ใช้สิทธิ์ผ่อนสล็อตไอดี GAME SECURED</div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: Success Application Contract summary */}
              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Glowing Approved shield badge */}
                  <div className="text-center space-y-3 py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-xl font-sans tracking-wide">ผ่านการอนุมัติสิทธิ์สำเร็จ!</h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        รหัสสัญญาของคุณ: <span className="text-cyan-400 font-bold">{contractNo}</span>
                      </p>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="bg-[#0b0c12] border border-slate-800 p-4 rounded-xl space-y-3 text-xs font-mono">
                    <h4 className="text-cyan-400 font-bold flex items-center gap-1">
                      <Award className="h-4 w-4" /> สรุปข้อมูลผลเครดิตและการผ่อนชำระ
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
                        <span className="text-gray-500 text-[10px] block">คะแนนความน่าน่าเชื่อถือ (Credit Score):</span>
                        <span className="text-yellow-400 font-extrabold text-sm">820 / 1000 (ระดับดีมาก)</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
                        <span className="text-gray-500 text-[10px] block">สิทธิ์การอนุมัติ:</span>
                        <span className="text-emerald-400 font-extrabold text-sm">ดาวน์ลอยรับของได้ทันที</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40">
                        <span className="text-gray-500 text-[10px] block">ค่างวดที่ต้องชำระสะสม:</span>
                        <span className="text-white font-bold">฿{finalWeeklyWithInterest} / สัปดาห์ ({selectedWeeks} งวด)</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/40 col-span-1">
                        <span className="text-gray-500 text-[10px] block">เงินดาวน์งวดแรกที่ต้องโอน:</span>
                        <span className="text-cyan-400 font-extrabold">฿{selectedDown.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature with Stamp Seal */}
                  {sigDataUrl && (
                    <div className="bg-[#050608] border border-slate-800 p-4 rounded-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] text-gray-500 block font-mono">ลงชื่ออ้างอิงลายมืออิเล็กทรอนิกส์:</span>
                        <div className="text-xs font-bold text-white">{fullName}</div>
                        <div className="text-[9px] text-gray-400 font-sans">ลงนามบันทึกเวลา: {new Date().toLocaleDateString()} ผ่านเกณฑ์การประเมิน</div>
                      </div>
                      
                      <div className="relative border border-slate-300 bg-white p-2 rounded-lg max-w-[180px] w-full h-16 flex items-center justify-center">
                        <img 
                          src={sigDataUrl} 
                          alt="Signature" 
                          referrerPolicy="no-referrer"
                          className="max-h-12 object-contain"
                        />
                        {/* Red circular rubber stamp seal overlay */}
                        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-red-500/70 border-dashed flex flex-col items-center justify-center text-red-500/75 font-mono font-black scale-102 rotate-12 bg-white/45 select-none pointer-events-none text-[4px] tracking-tight">
                          <span className="leading-tight">EFCPASHOP</span>
                          <span className="text-[6px] font-black border-y border-dashed border-red-500 my-0.2">APPROVED</span>
                          <span>OFFICIAL SEAL</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transfer instruction card */}
                  <div className="p-4 bg-gradient-to-r from-[#121b22] to-slate-900 border border-emerald-500/20 rounded-xl space-y-3.5 text-xs text-left">
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1 font-mono">
                      <Wallet className="h-4.5 w-4.5" /> ขั้นตอนสำคัญถัดไปเพื่อนำเข้าไอดีเล่นเกม
                    </span>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      กรุณาชำระยอดเงินดาวน์จำนวน <strong className="text-cyan-400">฿{selectedDown.toLocaleString()}</strong> เข้าบัญชี หจก. (จากธนาคารใดก็ได้) โดยสามารถดูเลขบัญชีปลายทางและกดแนบหลักฐานสลิปการโอนเงินได้ทันทีในหน้าถัดไป แอดมินจะติดต่อส่งมอบบัญชีให้คุณทางช่องทางแชท Facebook <strong className="text-indigo-300 font-mono">"{fullName}"</strong> ทันทีหลังยืนยันยอด!
                    </p>
                  </div>

                </div>
              )}
            </>
          )}

        </div>

        {/* Action button row */}
        {step !== 3 && !loading && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center">
            <button
              onClick={() => {
                if (step === 1) onClose();
                else setStep(step - 1);
              }}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold p-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {step === 1 ? 'ยกเลิก' : 'ย้อนกลับ'}
            </button>

            {step === 1 ? (
              <button
                onClick={handleNextStep}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-2.5 px-6 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>ขั้นตอนถัดไป</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                id="submit-signed-application"
                className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold p-2.5 px-8 rounded-xl text-xs flex items-center gap-1 shadow-[0_4px_12px_rgba(6,182,212,0.3)] animate-pulse cursor-pointer"
              >
                <span>ตกลงยืนยันและส่งสัญญานี้</span>
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/60 text-center">
            <button
              onClick={handleConfirmFinish}
              id="confirm-app-success"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold p-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-[0_5px_15px_rgba(16,185,129,0.3)] font-mono transition-transform active:scale-99 cursor-pointer"
            >
              รับทราบยอดสัญญาและแจ้งชำระสลิปดาวน์ทันที
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
