import React from 'react';

interface OwnerSignatureProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function OwnerSignature({ className = '', width = '100%', height = '100%' }: OwnerSignatureProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="https://img1.pic.in.th/images/159c79bb67c4c78f5.png" 
        alt="ลายมือชื่อ นายชยพล ปุญนนท์" 
        referrerPolicy="no-referrer"
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
        className="max-h-20 w-auto object-contain select-none pointer-events-none filter drop-shadow hover:brightness-105 transition-all"
      />
    </div>
  );
}
