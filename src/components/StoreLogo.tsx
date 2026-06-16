import React from 'react';

interface StoreLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function StoreLogo({ className = '', width = 160, height = 160 }: StoreLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img 
        src="https://img2.pic.in.th/4a751df52f2f7b7d013f291ce4493913.png" 
        alt="EF CPA SHOP" 
        referrerPolicy="no-referrer"
        style={{ width: width, height: height }}
        className="w-full h-auto max-w-[200px] object-contain select-none pointer-events-none filter drop-shadow hover:scale-102 transition-transform"
      />
    </div>
  );
}
