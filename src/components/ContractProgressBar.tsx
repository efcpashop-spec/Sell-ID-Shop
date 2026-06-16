import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ContractProgressBarProps {
  verifiedSlipsCount: number;
  installmentWeeks: number;
}

export default function ContractProgressBar({ verifiedSlipsCount, installmentWeeks }: ContractProgressBarProps) {
  const progressPercent = Math.min(100, Math.round((verifiedSlipsCount / installmentWeeks) * 100));
  
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentWeeks, setCurrentWeeks] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2 seconds smooth animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // OutQuad cubic bezier approximation easing
      const easeProgress = progress * (2 - progress);

      setCurrentPercent(Math.round(easeProgress * progressPercent));
      setCurrentWeeks(Math.round(easeProgress * verifiedSlipsCount));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animFrameId);
    };
  }, [progressPercent, verifiedSlipsCount]);

  return (
    <div className="space-y-1.5 text-left w-full" id={`progress-bar-container-${verifiedSlipsCount}-${installmentWeeks}`}>
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-gray-400 font-semibold">ความคืบหน้างวดรายสัปดาห์ :</span>
        <span className="text-cyan-400 font-mono font-bold flex items-center gap-1">
          <span className="text-cyan-300 font-black text-sm">{currentWeeks}</span>
          <span className="text-slate-700">/</span>
          <span>{installmentWeeks}</span>
          <span className="text-[10px] text-slate-500 font-normal">สัปดาห์</span>
          <span className="text-indigo-400 font-black font-number text-[11px] ml-1 bg-[#120f26] border border-indigo-500/10 px-1.5 py-0.5 rounded shadow-inner">
            {currentPercent}%
          </span>
        </span>
      </div>
      
      {/* Progress bar visual container */}
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/60 flex items-center p-[1px]">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }} // smooth easeOutCubic
        />
      </div>
    </div>
  );
}
