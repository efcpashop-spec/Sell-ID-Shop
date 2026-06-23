import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Product 
} from '../types';
import { 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onApply: (product: Product, initialWeeks: number, initDownPayment: number) => void;
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

export default function ProductCard({ product, onSelect, onApply }: ProductCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState(4);
  const [selectedDownIndex, setSelectedDownIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Compute discount states based on real product model price differences
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.fullPrice;
  const salePercentage = hasDiscount && product.originalPrice 
    ? Math.round(((product.originalPrice - product.fullPrice) / product.originalPrice) * 100)
    : 0;

  const currentFullPrice = product.fullPrice;
  const currentDownPaymentBase = product.downPayment;
  const currentWeeklyInstallmentBase = product.weeklyInstallment;

  // Discrete options for calculators instead of continuous sliders!
  const downPaymentOptions = Array.from(new Set([
    currentDownPaymentBase,
    Math.max(currentDownPaymentBase + 200, Math.round(currentFullPrice * 0.25)),
    Math.max(currentDownPaymentBase + 500, Math.round(currentFullPrice * 0.40)),
    Math.max(currentDownPaymentBase + 800, Math.round(currentFullPrice * 0.50))
  ])).sort((a, b) => a - b);

  const finalDownPayment = downPaymentOptions[selectedDownIndex] !== undefined 
    ? downPaymentOptions[selectedDownIndex] 
    : currentDownPaymentBase;

  const minW = 1;
  const maxW = 8;
  const weeksOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  // Safe percentage-based calculations with Tiered Profit Configuration
  const remainingAmount = Math.max(0, currentFullPrice - finalDownPayment);
  const interestPct = getTieredRate(currentFullPrice, selectedWeeks);
  const interestAmount = Math.round(remainingAmount * interestPct);
  const totalWithInterest = remainingAmount + interestAmount;
  const calculatedWeekly = selectedWeeks > 0 ? Math.floor(totalWithInterest / selectedWeeks) : 0;

  const getStatusBadge = () => {
    switch (product.status) {
      case 'available':
        return (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            พร้อมผ่อน (ว่าง)
          </span>
        );
      case 'reserved':
        return (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            ติดจองชั่วคราว
          </span>
        );
      case 'paying':
        return (
          <span className="bg-blue-500/10 text-blue-400 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            กำลังผ่อนชำระอยู่
          </span>
        );
      case 'sold':
        return (
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            ปิดค่างวด (ขายแล้ว)
          </span>
        );
      default:
        return null;
    }
  };

  const gameColors: Record<string, string> = {
    rov: 'from-orange-500 to-amber-600 border-orange-500/30',
    freefire: 'from-gold-600 to-amber-500 border-gold-500/30',
    pubg: 'from-yellow-500 to-red-600 border-yellow-500/30',
    genshin: 'from-teal-500 to-emerald-600 border-teal-500/30',
    fcmobile: 'from-lime-500 to-emerald-600 border-lime-500/30',
    valorant: 'from-rose-500 to-red-700 border-rose-500/30'
  };

  const currentTheme = gameColors[product.game] || 'from-gray-500 to-slate-600';

  return (
    <motion.div 
      id={`product-card-${product.id}`}
      className="bg-[#09051d] border border-purple-500/10 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:border-purple-500/45 hover:shadow-[0_20px_45px_rgba(0,0,0,0.5),_0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 group cursor-default"
      whileHover={{ 
        scale: 1.02, 
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      
      {/* Target/Product Image Carousel */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950 flex-shrink-0">
        
        {/* Hot badge */}
        {product.isHot && (
          <span className="absolute top-3 left-3 z-30 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md border border-red-400/30 flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-spin" />
            HOT ITEM
          </span>
        )}

        {/* Discount Tag Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 z-30 bg-gradient-to-l from-rose-500 to-pink-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md border border-rose-400/30 flex items-center gap-1 animate-pulse">
            <span className="text-[11px] leading-none">🏷️</span>
            <span>ลด {salePercentage}%</span>
          </span>
        )}

        <img 
          src={product.images[currentImgIdx]} 
          alt={product.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Carousel buttons */}
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-purple-500/30 border border-slate-800/80 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-md"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-purple-500/30 border border-slate-800/80 flex items-center justify-center text-gray-300 hover:text-white transition-all shadow-md"
          aria-label="Next image"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/40 p-1.5 rounded-full backdrop-blur-sm">
          {product.images.map((_, i) => (
            <span 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImgIdx ? 'bg-purple-500 scale-125' : 'bg-slate-500'}`}
            />
          ))}
        </div>

        {/* Game Code overlays */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-950/90 font-mono text-xs font-bold text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-lg">
          {product.code}
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 flex-grow flex flex-col text-left">
        
        {/* Game label and status row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded border ${currentTheme} bg-gradient-to-r text-white`}>
            {product.game}
          </span>
          {getStatusBadge()}
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product)}
          className="text-white hover:text-purple-400 font-bold text-sm sm:text-base leading-snug cursor-pointer line-clamp-2 h-11 transition-colors font-display"
        >
          {product.title}
        </h3>

        {/* Key specifications highlights */}
        <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50 mb-3 text-xs">
          {product.details.slice(0, 2).map((det, index) => (
            <div key={index} className="flex flex-col leading-tight">
              <span className="text-[10px] text-gray-500 font-sans">{det.label}</span>
              <span className="text-slate-300 font-bold truncate mt-0.5 font-sans">{det.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-slate-800/80 my-2" />

        {/* Payment and DownPayment pricing details */}
        <div className="grid grid-cols-3 gap-2 py-1 font-sans">
          <div className="text-left font-sans">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">ราคาเงินสด</span>
            {hasDiscount && product.originalPrice ? (
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 line-through font-number leading-none">฿{product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-black text-rose-400 font-number leading-tight">฿{product.fullPrice.toLocaleString()}</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-slate-300 font-number">฿{product.fullPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="text-left border-x border-slate-800 px-2 font-sans">
            <span className="text-[9px] text-gray-400 block uppercase font-bold font-sans">ดาวน์เริ่มต้น</span>
            <span className="text-sm font-extrabold text-purple-400 font-number">฿{product.downPayment.toLocaleString()}</span>
          </div>
          <div className="text-left font-sans">
            <span className="text-[9px] text-slate-400 block uppercase font-bold font-sans">ผ่อน/สัปดาห์</span>
            <span className="text-sm font-extrabold text-emerald-400 font-number">฿{product.weeklyInstallment}</span>
          </div>
        </div>

        {/* Dynamic Calculator slider section: built inline! */}
        {showCalculator && (
          <div className="mt-3 bg-[#120b2d] border border-purple-500/20 rounded-xl p-3 animate-fadeIn text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Calculator className="h-3.5 w-3.5 text-purple-400" />
                คำนวณงวดผ่อนชำระ
              </span>
              <span className="text-gray-500 text-[10px]">บวกค่าบริการสะสม {(interestPct * 100).toFixed(0)}%</span>
            </div>

            {/* Down Payment Button Grid Selection */}
            <div className="space-y-1.5 text-[11px] font-mono text-left">
              <span className="text-gray-400">เลือกจำนวนเงินดาวน์:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {downPaymentOptions.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedDownIndex(idx)}
                    type="button"
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all truncate text-center cursor-pointer ${
                      finalDownPayment === opt
                        ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-number">฿{opt.toLocaleString()}</span> {idx === 0 ? '(ต่ำสุด)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Installment weeks Button Selection */}
            <div className="space-y-1.5 text-[11px] font-sans text-left pt-1">
              <span className="text-gray-400">เลือกจำนวนสัปดาห์ผ่อน:</span>
              <div className="grid grid-cols-4 gap-1">
                {weeksOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedWeeks(opt)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                      selectedWeeks === opt
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-number text-[11px] font-black">{opt}</span> <span className="font-sans text-[10px]">สัปดาห์</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Calculation Result Panel */}
            <div className="bg-slate-900 px-2.5 py-2 rounded-lg flex items-center justify-between border border-slate-800/80 font-sans text-xs">
              <div className="text-left leading-none">
                <span className="text-[10px] text-gray-400 block mb-1">ยอดต้องชำระรายงวด:</span>
                <span className="text-emerald-400 font-extrabold text-sm font-number">฿{calculatedWeekly} <span className="text-[10px] font-normal text-slate-400 font-sans">/สัปดาห์</span></span>
              </div>
              <div className="text-right leading-none">
                <span className="text-[10px] text-gray-500 block mb-1">รวมราคาผ่อน:</span>
                <span className="text-slate-300 font-semibold text-xs font-number">฿{(finalDownPayment + (calculatedWeekly * selectedWeeks)).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Action inside Inline Slider */}
            {product.status === 'available' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(
                    {
                      ...product,
                      fullPrice: currentFullPrice,
                      downPayment: currentDownPaymentBase,
                      weeklyInstallment: currentWeeklyInstallmentBase
                    },
                    selectedWeeks,
                    finalDownPayment
                  );
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 font-display shadow-[0_2px_8px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                ยื่นผ่อนด้วยยอดคำนวณนี้
              </button>
            )}
          </div>
        )}

        {/* Primary Action Row */}
        <div className="mt-4 flex gap-2">
          
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            type="button"
            id={`calc-btn-${product.id}`}
            title="เปิดเครื่องมือคำนวณยอดชำระออนไลน์"
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              showCalculator 
                ? 'bg-purple-950/40 text-purple-300 border-purple-500/40 shadow-sm' 
                : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Calculator className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => onSelect({
              ...product,
              fullPrice: currentFullPrice,
              downPayment: currentDownPaymentBase,
              weeklyInstallment: currentWeeklyInstallmentBase
            })}
            id={`details-btn-${product.id}`}
            className="flex-grow bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-colors font-display cursor-pointer"
          >
            รายละเอียดไอดี
          </button>

          {product.status === 'available' ? (
            <button
              type="button"
              onClick={() => onApply(
                {
                  ...product,
                  fullPrice: currentFullPrice,
                  downPayment: currentDownPaymentBase,
                  weeklyInstallment: currentWeeklyInstallmentBase
                },
                selectedWeeks,
                finalDownPayment
              )}
              id={`apply-btn-${product.id}`}
              className="bg-gradient-to-r from-[#d2a632] to-[#bca142] hover:from-[#e3b740] hover:to-[#aa8c17] text-slate-950 hover:text-black font-extrabold px-4 py-2.5 rounded-xl text-xs transition-transform hover:scale-101 active:scale-99 font-display cursor-pointer"
            >
               ทำเรื่องผ่อนไอดี
            </button>
          ) : (
            <button
              disabled
              className="bg-slate-800 border border-slate-700/50 text-slate-500 font-bold px-4 py-2.5 rounded-xl text-xs cursor-not-allowed uppercase font-display"
            >
              ถูกครอบครอง
            </button>
          )}

        </div>

      </div>
    </motion.div>
  );
}
