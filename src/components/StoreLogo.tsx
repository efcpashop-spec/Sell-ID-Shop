import React from 'react';

interface StoreLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function StoreLogo({ className = '', width = 160, height = 160 }: StoreLogoProps) {
  const localSrc = "/logo.png";
  const remoteSrc = "https://img2.pic.in.th/47AF4192-FB83-4538-A567-374319D868B1.png";

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img 
        src={localSrc} 
        onError={(e) => {
          (e.target as HTMLImageElement).src = remoteSrc;
        }}
        alt="efcpashop.online Logo" 
        referrerPolicy="no-referrer"
        style={{ width: width, height: height }}
        className="w-full h-auto max-w-[200px] object-contain select-none pointer-events-none filter drop-shadow hover:scale-102 transition-transform rounded-xl"
      />
    </div>
  );
}
