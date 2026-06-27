import React, { useState, useEffect } from 'react';
import { InstallmentApplication, PaymentSlip } from '../types';
import { 
  X, 
  Info, 
  Copy, 
  Check, 
  Upload, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Building2,
  Sparkles,
  QrCode,
  Loader2,
  Facebook
} from 'lucide-react';
import { BANK_ACCOUNTS } from '../data';
import PromptPayQR from './PromptPayQR';

interface PaymentReportModalProps {
  applications: InstallmentApplication[];
  onClose: () => void;
  onSubmitSlip: (slip: Omit<PaymentSlip, 'id' | 'status' | 'submittedAt'> & { paymentType?: string; transRef?: string }) => void;
  defaultAppId?: string;
  defaultPaymentType?: 'down' | 'installment';
}

export default function PaymentReportModal({ 
  applications, 
  onClose, 
  onSubmitSlip,
  defaultAppId,
  defaultPaymentType = 'down'
}: PaymentReportModalProps) {
  const [selectedAppId, setSelectedAppId] = useState(() => {
    if (defaultAppId && applications.some(a => a.id === defaultAppId)) {
      return defaultAppId;
    }
    return applications.length > 0 ? applications[0].id : '';
  });

  const [paymentType, setPaymentType] = useState<'down' | 'installment'>(defaultPaymentType);
  const [transferTime, setTransferTime] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('th-TH') + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  });
  
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState('');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customAmountOverride, setCustomAmountOverride] = useState<number | null>(null);

  const matchedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Auto-switch payment type to installment for already approved applications
  useEffect(() => {
    if (matchedApp && matchedApp.status === 'approved' && paymentType !== 'installment') {
      setPaymentType('installment');
    }
  }, [selectedAppId, matchedApp, paymentType]);

  // Reset custom amount override when switching apps or payment modes
  useEffect(() => {
    setCustomAmountOverride(null);
  }, [selectedAppId, paymentType]);

  const baseAmount = matchedApp 
    ? (paymentType === 'down' ? matchedApp.downPaymentAmount : matchedApp.weeklyInstallmentAmount) 
    : 1500;

  const currentAmount = customAmountOverride !== null ? customAmountOverride : baseAmount;

  const copyTextFallback = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.warn('Fallback copy failed:', err);
      return false;
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).catch(() => copyTextFallback(text));
    } else {
      copyTextFallback(text);
    }
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSlipFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) {
      alert('กรุณาเลือกไฟล์รูปภาพใบเสร็จ/สลิปโอนเงิน เพื่อตรวจสอบความถูกต้องด้านความปลอดภัยระบบอัตโนมัติ 24 ชม. ครับ');
      return;
    }

    const finalTime = transferTime || (new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.');

    setIsVerifying(true);
    try {
      // Automatic real API validation with EasySlip
      const response = await fetch('/api/verify-slip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slipImage: slipImage,
          expectedAmount: currentAmount,
          targetAccount: '0948201166'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success callback to update database and lists
        const verifyData = result.data || {};
        onSubmitSlip({
          applicationId: matchedApp?.id || 'manual-general',
          productTitle: matchedApp?.productTitle || 'ผ่อนชำระไอดีเกมนักเตะลิมิเต็ด',
          productCode: matchedApp?.productCode || 'EFC-GENERAL',
          transferAmount: currentAmount,
          bank: 'โอนผ่าน PromptPay (ตรวจสอบอัตโนมัติ)',
          transferTime: finalTime,
          slipImage: slipImage,
          paymentType: paymentType, // Pass down / installment explicitly 
          transRef: verifyData.transRef || 'REF-' + Math.floor(100000 + Math.random() * 899999)
        });
        setIsDone(true);
      } else {
        // Prompt incorrect conditions (rejection, wrong amount, wrong account or duplicate)
        alert(`❌ ระบบ EasySlip ตลาดกลางตรวจสอบไม่สำเร็จ:\n\n${result.message || 'สลิปไม่ผ่านการตรวจสอบความถูกต้อง กรุณาลองแนบสลิปใหม่อีกครั้ง'}`);
      }
    } catch (err: any) {
      alert(`❌ บริการเซิร์ฟเวอร์ตรวจสอบสลิปขัดข้องชั่วคราว: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="payment-report-modal"
        className="relative bg-[#0b0c10] border border-cyan-500/20 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[92vh] animate-scaleUp text-left font-sans"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base md:text-lg">แจ้งการชำระเงินสลิป / ค่างวดอัตโนมัติ</h2>
              <p className="text-[11px] text-gray-400 font-mono">ส่งหลักฐานสลิปตรวจสอบเรียลไทม์ผ่าน EasySlip API 24 ชม.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        {!isDone ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs font-mono font-sans">
            
            {/* Context Step: Select application and payment target */}
            {applications.length > 0 && (
              <div className="bg-[#050814] border border-slate-900 rounded-xl p-4.5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 font-extrabold block mb-1.5 font-sans">เลือกสัญญาจัดส่งที่ร่วมผ่อน:</label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 px-3 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                    >
                      {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.productCode} - {app.productTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 font-extrabold block mb-1.5 font-sans">ประเภทเงินทีโอนจริง:</label>
                    {matchedApp && matchedApp.status === 'approved' ? (
                      <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl p-2.5 px-3 flex items-center justify-between font-bold font-sans">
                        <span>ค่างวดรายสัปดาห์เท่านั้น</span>
                        <span className="text-[10px] bg-indigo-500 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">ผ่อนชำระค่างวด ⚡</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentType('down')}
                          className={`p-2.5 rounded-xl border font-bold font-sans text-center transition-all cursor-pointer ${
                            paymentType === 'down'
                              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-gray-400 hover:text-slate-200'
                          }`}
                        >
                          มัดจำดาวน์สิทธิ์
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType('installment')}
                          className={`p-2.5 rounded-xl border font-bold font-sans text-center transition-all cursor-pointer ${
                            paymentType === 'installment'
                              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-gray-400 hover:text-slate-200'
                          }`}
                        >
                          ค่างวดรายสัปดาห์
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-[11px] text-gray-500 font-sans">
                    รายการ: <span className="text-slate-300 font-bold">{paymentType === 'down' ? 'มัดจำดาวน์เปิดสิทธิ์ไอดี' : 'ผ่อนค่างวดรายสัปดาห์ปกติ'}</span>
                  </div>
                  <div className="text-xs font-sans text-slate-300 flex items-center gap-1.5">
                    <span>ยอดที่ต้องชำระตรงพอดี:</span>
                    <span className="text-base text-emerald-400 font-black font-mono">฿{currentAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Target 1: Bank Accounts copyable panel */}
            <div className="space-y-3">
              <h3 className="text-white text-xs font-extrabold flex items-center gap-1.5 font-sans">
                <Building2 className="h-4.5 w-4.5 text-cyan-400" /> บัญชีรับฝากโอนค่างวด (ปลายทาง นายชยพล ปุญนนท์ เท่านั้น)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BANK_ACCOUNTS.map((acc, idx) => {
                  const isTTB = acc.bankName.includes('TTB') || acc.bankName.includes('ทหารไทย');
                  const isWallet = acc.bankName.includes('Wallet') || acc.bankName.includes('วอลเล็ท');
                  
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border-2 transition-all text-left relative group space-y-1.5 ${
                        isTTB 
                          ? 'bg-blue-950/20 border-indigo-600/70 shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:border-indigo-400' 
                          : isWallet 
                            ? 'bg-amber-950/20 border-orange-500/70 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:border-orange-400' 
                            : 'bg-slate-950 border-slate-800 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className={`text-[10px] font-black tracking-wider uppercase flex items-center gap-1 ${
                          isTTB 
                            ? 'text-blue-300' 
                            : isWallet 
                              ? 'text-orange-400' 
                              : 'text-cyan-400'
                        }`}>
                          {isTTB && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                          {isWallet && <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                          <span>{acc.bankName}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isTTB 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : isWallet 
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                              : 'bg-slate-900 text-gray-400'
                        }`}>
                          {isTTB ? 'แนะนำ TTB' : isWallet ? 'ทรูวอลเล็ทพร้อมเพย์' : 'ปลายทาง'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="text-[10px] text-gray-500">เลขบัญชีพร้อมเพย์ / ธนาคาร:</div>
                        <div className={`text-sm font-black font-mono flex items-center justify-between gap-1 mt-0.5 ${
                          isTTB ? 'text-blue-200' : isWallet ? 'text-orange-200' : 'text-white'
                        }`}>
                          <span className="tracking-wider selection:bg-orange-500/30">
                            {acc.accountNo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.accountNo, 'acc-'+idx)}
                            className={`p-1 rounded-md transition-colors ${
                              isTTB 
                                ? 'bg-blue-900/40 text-blue-300 hover:text-white hover:bg-blue-800/40' 
                                : isWallet 
                                  ? 'bg-orange-950/40 text-orange-400 hover:text-white hover:bg-orange-900/40' 
                                  : 'text-gray-500 hover:text-cyan-400'
                            }`}
                            title="คัดลอกเลขบัญชี"
                          >
                            {isCopied === 'acc-'+idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-[10px] text-gray-500">ชื่อผู้ถือบัญชีเป้าหมาย:</div>
                        <p className={`font-semibold text-xs truncate ${
                          isTTB ? 'text-blue-100' : isWallet ? 'text-orange-100' : 'text-slate-300'
                        }`}>
                          {acc.accountName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic PromptPay QR code block using EasySlip-computed images */}
              <div className="mt-4">
                <PromptPayQR 
                  amount={baseAmount}
                  payeeId="1100401206065"
                  payeeName="ชยพล ปุญนนท์ Chayapol Punnon"
                  onAmountChange={(val) => setCustomAmountOverride(val)}
                  allowAdjustAmount={true}
                />
              </div>
            </div>

            <div className="h-[1px] bg-slate-900" />

            {/* Target 2: Payment submission Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">

              {/* Upload image receipt box */}
              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold block font-sans text-xs">อัปโหลดสลิปธนาคารเพื่อสแกนใบเสร็จผ่าน API <span className="text-red-400">*</span></label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    id="slip-file-input" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="slip-file-input" 
                    className="flex items-center justify-center gap-1.5 bg-[#0a0c10] border border-dashed border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl cursor-pointer w-full text-center transition-all text-xs font-sans text-slate-300"
                  >
                    <Upload className="h-4.5 w-4.5 text-cyan-400" />
                    <span>{slipFileName ? 'เปลี่ยนรูปภาพสลิปใบโอน' : 'เลือกรูปถ่ายสลิปโมบายแบงก์กิ้งเพื่อตรวจเช็ค'}</span>
                  </label>
                </div>

                {slipImage && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-950 overflow-hidden border border-slate-800">
                        <img src={slipImage} alt="slip" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">✓ สลีป {slipFileName || 'payment_receipt.png'} พร้อมอัปโหลดแล้ว</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Security info note */}
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3.5 rounded-xl flex gap-3 text-[10px] sm:text-xs text-cyan-300">
                <ShieldCheck className="h-5 w-5 text-cyan-400 flex-shrink-0 animate-pulse" />
                <div className="font-sans leading-relaxed">
                  <strong>กลไก EasySlip สมาร์ทไคลเอนต์ :</strong> โปรแกรมหลังบ้านจะทำการดึงรหัสธุรกรรมหลัก (transRef) ถอดมูลค่าตัวกรองและผู้ได้รับเงิน หากยอดชำระถูกตรวจสอบและถูกต้องตรงตามเงื่อนไขสำเร็จ ระบบจะทำการอัปเดตสิทธิค่างวดผ่อนของคุณเป็นสำเร็จ (Success) ตลอด 24 ชม. ทันทีโดยไม่ต้องรอแอดมินตรวจมือ!
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-2 flex justify-end gap-2 text-xs font-sans">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white p-2.5 px-6 rounded-xl font-bold transition-all cursor-pointer"
                >
                  ย้อนกลับ
                </button>
                <button
                  disabled={isVerifying || applications.length === 0}
                  type="submit"
                  id="submit-payment-slip"
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold p-2.5 px-8 rounded-xl transition-all shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-45"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังคุยกับ EasySlip API...</span>
                    </>
                  ) : (
                    <>
                      <span>แจ้งส่งสลิปโอนเข้าคลัง</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        ) : (
          <div className="p-8 text-center space-y-5 font-sans animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="space-y-1 px-4 text-left sm:text-center text-xs">
              <h3 className="text-white font-extrabold text-lg text-center font-sans mb-1">EasySlip อนุมัติการจ่ายค่างวดสำเร็จ!</h3>
              <p className="text-xs text-gray-400 font-mono text-center">
                ระบบสลิปตัดประวัติการผ่อนเรียบร้อย เวลา {transferTime || 'ปัจจุบัน'}
              </p>
              <p className="text-slate-400 leading-normal text-xs font-sans pt-2 max-w-sm mx-auto text-center">
                ✓ รหัสธุรกรรมได้รับการยืนยันโดย EasySlip API <br />✓ ตารางสัญญาระบายสีงวดค่างวดและปรับสถานภาพผ่อนสิทธิของคุณเป็น <strong>SUCCESS</strong> เรียบร้อยแล้วค่ะ ขอบพระคุณที่รักษาเครดิตการผ่อนกับเราเสมอมานะคะ!
              </p>
            </div>

            {/* Glowing call-to-action Facebook chat button */}
            <div className="bg-blue-950/40 border border-blue-500/30 p-4.5 rounded-2xl max-w-md mx-auto space-y-3 shadow-[0_0_20px_rgba(59,130,246,0.15)] animate-pulse">
              <p className="text-blue-300 font-bold text-xs">
                🎉 ชำระเงินเรียบร้อยแล้ว! เพื่อความรวดเร็วในการจัดส่งไอดีเกม
              </p>
              <a
                href="https://web.facebook.com/EFCPAShop/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Facebook className="h-4.5 w-4.5 text-white fill-white" />
                <span>คลิกที่ตรงนี้ เพื่อทักแชทไปหาแอดมินเพื่อรับ Email และ Password</span>
              </a>
            </div>

            <div className="pt-2 max-w-md mx-auto">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-3 rounded-xl text-xs font-bold font-sans cursor-pointer"
              >
                เสร็จสิ้น ปิดหน้าต่างการชำระ
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
