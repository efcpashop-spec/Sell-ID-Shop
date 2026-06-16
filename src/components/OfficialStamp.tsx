import React from 'react';

interface OfficialStampProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function OfficialStamp({ className = '', width = 96, height = 96 }: OfficialStampProps) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 300 300" 
        width={width} 
        height={height}
        className="w-full h-full max-w-[130px] opacity-85"
      >
        <defs>
          {/* Paths for circular SVG text */}
          <path id="topTextPath" d="M 40,150 A 110,110 0 1,1 260,150" fill="none" />
          <path id="bottomTextPath" d="M 260,150 A 110,110 0 1,1 40,150" fill="none" />
        </defs>

        {/* Double circular border with grunge stamp look */}
        <circle cx="150" cy="150" r="136" fill="none" stroke="#2563eb" strokeWidth="4" />
        <circle cx="150" cy="150" r="126" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="5,4" />
        <circle cx="150" cy="150" r="82" fill="none" stroke="#2563eb" strokeWidth="2" />
        
        {/* Top Arc Text: THAI COMPANY NAME */}
        <text fill="#2563eb" fontFamily="'Prompt', 'Sarabun', 'sans-serif'" fontSize="17.5" fontWeight="900" style={{ letterSpacing: '4.5px' }}>
          <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
            ห้างหุ้นส่วนจำกัด อีเอฟพีเอส ช็อป
          </textPath>
        </text>

        {/* Bottom Arc Text: ENGLISH COMPANY NAME */}
        <text fill="#2563eb" fontFamily="'Inter', 'sans-serif'" fontSize="13.5" fontWeight="900" style={{ letterSpacing: '3.2px' }}>
          <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
            EF CPA SHOP LIMITED PARTNERSHIP
          </textPath>
        </text>

        {/* Inner seal design elements */}
        {/* Decorative Stars */}
        <text x="35" y="156" fill="#2563eb" fontSize="20" fontWeight="bold">★</text>
        <text x="252" y="156" fill="#2563eb" fontSize="20" fontWeight="bold">★</text>

        {/* Bold Center text */}
        <text 
          x="150" 
          y="142" 
          fill="#2563eb" 
          fontFamily="'Arial Black', 'Inter', 'sans-serif'" 
          fontSize="36" 
          fontWeight="900" 
          textAnchor="middle"
        >
          EF CPA
        </text>

        {/* Approved Ribbon Banner text inside circle */}
        <rect x="75" y="162" width="150" height="2" fill="#2563eb" />
        <text 
          x="150" 
          y="180" 
          fill="#2563eb" 
          fontFamily="'Inter', 'Prompt', 'sans-serif'" 
          fontSize="14.5" 
          fontWeight="800" 
          textAnchor="middle"
          style={{ letterSpacing: '1px' }}
        >
          APPROVED SEAL
        </text>
        <rect x="90" y="190" width="120" height="1.5" fill="#2563eb" />
      </svg>
    </div>
  );
}
