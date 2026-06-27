import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Info, 
  TrendingUp, 
  CreditCard,
  Building2,
  BookmarkCheck,
  RefreshCw
} from 'lucide-react';
import { generatePromptPayPayload } from '../utils/promptpay';

interface PromptPayQRProps {
  amount: number;
  payeeId?: string;
  payeeName?: string;
  onAmountChange?: (newAmount: number) => void;
  allowAdjustAmount?: boolean;
}

export default function PromptPayQR({
  amount,
  payeeId = "1100401206065",
  payeeName = "นายชยพล ปุญนนท์",
  onAmountChange,
  allowAdjustAmount = true
}: PromptPayQRProps) {
  const [currentAmount, setCurrentAmount] = useState(amount);
  const [isCopiedText, setIsCopiedText] = useState(false);
  const [isCopiedPayload, setIsCopiedPayload] = useState(false);
  const [useAlternativeApi, setUseAlternativeApi] = useState(false);
  
  // Update internal amount when prop changes
  useEffect(() => {
    setCurrentAmount(amount);
  }, [amount]);

  // Generate EMVCo standard payload text
  const payloadText = generatePromptPayPayload(payeeId, currentAmount);

  // Generate QR code raw image URLs (Dual system for high availability)
  const primaryQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payloadText)}`;
  const secondaryQrUrl = `https://promptpay.io/${payeeId}/${currentAmount}.png`;
  
  const qrImageToDisplay = useAlternativeApi ? secondaryQrUrl : primaryQrUrl;

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

  const handleCopyText = (text: string, type: 'payee' | 'payload') => {
    let copyVal = text;
    if (type === 'payee' && text.replace(/\D/g, '').length === 13) {
      // If 13-digit national ID card number, copy the masked string to protect owner's privacy
      copyVal = formatPayeeId(text);
      alert('🔒 เพื่อความปลอดภัยส่วนบุคคล (PDPA) ระบบได้ทำการปกปิดเลขบัตรประชาชนพร้อมเพย์เอาไว้ แนะนำให้ใช้แอปพลิเคชันธนาคารสแกนรูปภาพคิวอาร์โค้ดทางซ้ายมือแทนเพื่อความสะดวกและปลอดภัยสูงสุดค่ะ');
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(copyVal).catch(() => copyTextFallback(copyVal));
    } else {
      copyTextFallback(copyVal);
    }
    if (type === 'payee') {
      setIsCopiedText(true);
      setTimeout(() => setIsCopiedText(null as any), 1500);
    } else {
      setIsCopiedPayload(true);
      setTimeout(() => setIsCopiedPayload(null as any), 1500);
    }
  };

  const handlePresetAmountAdd = (addValue: number) => {
    const nextVal = currentAmount + addValue;
    setCurrentAmount(nextVal);
    if (onAmountChange) {
      onAmountChange(nextVal);
    }
  };

  const handleResetAmount = () => {
    setCurrentAmount(amount);
    if (onAmountChange) {
      onAmountChange(amount);
    }
  };

  // Format PromptPay ID for easier display E.g. Citizen ID: 1-1004-01206-06-5 or Phone: 089-765-4321
  const formatPayeeId = (id: string) => {
    const raw = id.replace(/\D/g, '');
    if (raw.length === 10) {
      return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
    }
    if (raw.length === 13) {
      // Mask the ID card digits to protect owner's privacy as requested by the user
      return `${raw.slice(0, 1)}-${raw.slice(1, 5)}-${raw.slice(5, 9)}x-xx-x`;
    }
    return id;
  };

  return (
    <div id="promptpay-qr-container" className="bg-[#05060a] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl max-w-full">
      {/* Brand Header representing PromptPay Official Style */}
      <div id="pp-brand-header" className="bg-gradient-to-r from-[#002f6c] to-[#01418c] px-4.5 py-3 flex justify-between items-center border-b border-[#001a40]">
        <div className="flex items-center gap-2">
          {/* PromptPay Stylized Text Logo using CSS styling */}
          <div className="flex flex-col text-left">
            <span className="text-white text-xs font-black tracking-wider leading-none uppercase">Prompt <span className="text-cyan-400">Pay</span></span>
            <span className="text-[7.5px] text-cyan-300 font-sans tracking-widest leading-none mt-0.5">พ ร้ อ ม เ พ ย์</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-[8.5px] text-cyan-200 font-extrabold uppercase tracking-wide">Real-time Check</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Info Grid */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
          
          {/* Left Column: QR Display Area */}
          <div className="flex flex-col items-center space-y-2.5">
            <div 
              id="qr-image-wrapper" 
              className="relative bg-white p-3 rounded-2xl flex items-center justify-center border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] w-40 h-40 group transition-all duration-300 hover:scale-[1.02]"
            >
              <img 
                src={qrImageToDisplay} 
                alt="Dynamic PromptPay QR Code" 
                referrerPolicy="no-referrer"
                onError={() => {
                  // Auto fallback to alternative URL if first fails to load
                  setUseAlternativeApi(true);
                }}
                className="w-full h-full object-contain"
              />
              {/* Scan indicator overlay */}
              <div className="absolute inset-0 bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                <QrCode className="h-8 w-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Quick Switch QR Server */}
            <button
              type="button"
              onClick={() => setUseAlternativeApi(!useAlternativeApi)}
              className="text-[9.5px] text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-2.5 w-2.5 animate-spin-slow" />
              <span>สลับเซิร์ฟเวอร์สำรอง ({useAlternativeApi ? "เซิร์ฟเวอร์ 2" : "เซิร์ฟเวอร์ 1"})</span>
            </button>
          </div>

          {/* Right Column: Key details */}
          <div className="flex-1 w-full space-y-3.5 text-left">
            <div>
              <span className="text-[9.5px] text-slate-500 font-bold block tracking-wider uppercase">ชื่อผู้รับเงินปลายทาง (Payee Bank Name)</span>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-white text-xs sm:text-sm font-black font-sans">{payeeName}</p>
                <span className="text-[9.5px] bg-slate-900 border border-slate-800 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                  {payeeId.replace(/\D/g, '').length === 13 ? "พร้อมเพย์ (PromptPay)" : payeeId.replace(/\D/g, '') === "0948201166" ? "ทรูมันนี่ วอลเล็ท" : "ธ.ทหารไทยธนชาต"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[9.5px] text-slate-500 font-bold block tracking-wider uppercase">
                {payeeId.replace(/\D/g, '').length === 10 ? "หมายเลขพร้อมเพย์ (เบอร์โทรศัพท์มือถือ)" : "หมายเลขพร้อมเพย์ (เลขบัตรประชาชนตรวจสอบ)"}
              </span>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-cyan-400 font-mono text-sm sm:text-base font-black tracking-wider">
                  {formatPayeeId(payeeId)}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyText(payeeId, 'payee')}
                  className="bg-slate-950 hover:bg-slate-900 p-1.5 rounded-lg border border-slate-850 hover:border-slate-800 transition-colors text-slate-400 hover:text-white"
                  title="คัดลอกเลขพร้อมเพย์"
                >
                  {isCopiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Displaying Current Dynamic Amount */}
            <div className="bg-slate-950 p-2.5 py-3 rounded-xl border border-slate-900 flex justify-between items-center shadow-inner">
              <div>
                <span className="text-[8px] text-gray-400 font-bold block uppercase tracking-wider">ยอดเงินล็อกไว้ (Transaction Amount)</span>
                <span className="text-[10px] text-amber-500 font-sans">ต้องโอนยอดนี้ตรงกันพอดีทศนิยม</span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-xl font-black font-mono text-emerald-400">
                  ฿{currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-white block font-sans">บาท</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount adjustment section if allowed */}
        {allowAdjustAmount && onAmountChange && (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 space-y-2 text-left">
            <span className="text-[10px] text-gray-400 font-bold block flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-cyan-400" /> ต้องการจ่ายมากกว่ายอดขั้นต่ำ? ปรับจำนวนเงินโอนได้ที่นี่:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetAmountAdd(100)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-[10.5px] text-slate-200 font-bold font-mono transition-all active:scale-95 cursor-pointer"
              >
                + ฿100
              </button>
              <button
                type="button"
                onClick={() => handlePresetAmountAdd(500)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-[10.5px] text-slate-200 font-bold font-mono transition-all active:scale-95 cursor-pointer"
              >
                + ฿500
              </button>
              <button
                type="button"
                onClick={() => handlePresetAmountAdd(1000)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-[10.5px] text-slate-200 font-bold font-mono transition-all active:scale-95 cursor-pointer"
              >
                + ฿1,000
              </button>
              <button
                type="button"
                onClick={handleResetAmount}
                className="bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all active:scale-95 cursor-pointer ml-auto"
              >
                ย้อนกลับเป็นยอดเริ่มต้น
              </button>
            </div>
          </div>
        )}

        {/* Copy raw EMVCo payload button */}
        <div className="bg-[#05060a]/50 p-2.5 rounded-lg border border-slate-900 flex justify-between items-center text-left">
          <div className="space-y-0.5">
            <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-wide flex items-center gap-1">
              <BookmarkCheck className="h-3 w-3 text-cyan-400" /> รหัสธุรกรรมดิบ EMVCo Payload
            </span>
            <p className="text-[8px] text-slate-400 max-w-[190px] sm:max-w-[280px] truncate font-mono">
              {payloadText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopyText(payloadText, 'payload')}
            className="flex items-center gap-1.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-300 font-bold p-1.5 px-3 rounded-lg text-[9px] font-mono transition-all cursor-pointer shadow-sm shrink-0"
          >
            {isCopiedPayload ? (
              <>
                <Check className="h-3 w-3" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>คัดลอกรหัส</span>
              </>
            )}
          </button>
        </div>

        {/* App Action Instructions */}
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-900 flex gap-2.5 text-[10px] text-slate-400 text-left">
          <Info className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <span className="font-extrabold text-white text-[10.5px]">ขั้นตอนการชำระเงินที่ง่ายและปลอดภัย</span>
            <ol className="list-decimal pl-3.5 space-y-0.5 leading-relaxed text-gray-400">
              <li>เปิดแอปพลิเคชันตู้ธนาคาร/ธนาคารบนมือถือของท่านที่รองรับสแกน QR</li>
              <li>บันทึกภาพหน้าจอคิวอาร์ (QR Code) ด้านบน หรือสแกนโดยตรงด้วยกล้อง</li>
              <li>ยืนยันยอดโอนและชื่อผู้รับ <strong className="text-white font-sans">{payeeName}</strong> ให้ตรงกันพอดี</li>
              <li>ส่งใบเสร็จ สลิปการโอนเงินคืนทางช่องอัปโหลด เพื่อให้ระบบ EasySlip ตรวจสอบอนุมัติแบบออโต้</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
