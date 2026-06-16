import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  Trophy,
  Activity,
  Award,
  Zap,
  Globe,
  UserCheck
} from 'lucide-react';
import { EfCpaShopLogo } from './Navbar';

interface HeroProps {
  onSearch: (game: string) => void;
  onExplore: () => void;
  onKycNavigate?: () => void;
}

// Custom interactive 3D WebGL-like Canvas Sphere with constellations & elegant orbiting rings
const InteractiveSphereCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const angleRef = useRef({ x: 0.35, y: 0.45 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle high-dpi screen rendering flawlessly
    const resizeAndDpiAdjust = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    
    resizeAndDpiAdjust();
    window.addEventListener('resize', resizeAndDpiAdjust);

    // Generate Purple Spiral points on a sphere
    const nodeCount = 55;
    const sphereNodes: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      sphereNodes.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi)
      });
    }

    // Outer Orbit Ring particles
    const orbitPointsCount1 = 40;
    const orbitPointsCount2 = 30;
    const orbit1: number[] = Array.from({ length: orbitPointsCount1 }, (_, i) => (i / orbitPointsCount1) * Math.PI * 2);
    const orbit2: number[] = Array.from({ length: orbitPointsCount2 }, (_, i) => (i / orbitPointsCount2) * Math.PI * 2);

    let frame = 0;

    const render = () => {
      frame++;
      
      const rect = canvas.getBoundingClientRect();
      const cssWidth = rect.width;
      const cssHeight = rect.height;
      
      // Clear with dark deep purple spatial gradient
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Sphere centers and boundaries
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const sphereRadius = Math.min(cssWidth, cssHeight) * 0.32;
      const perspective = 350;

      // Update rotation angles with gentle automatic drift + subtle mouse influence
      if (mouseRef.current.active) {
        angleRef.current.y += (mouseRef.current.x * 0.04 - angleRef.current.y) * 0.1;
        angleRef.current.x += (mouseRef.current.y * 0.04 - angleRef.current.x) * 0.1;
      } else {
        angleRef.current.y += 0.004; // steady rotation
        angleRef.current.x += 0.0012;
      }

      const cosY = Math.cos(angleRef.current.y);
      const sinY = Math.sin(angleRef.current.y);
      const cosX = Math.cos(angleRef.current.x);
      const sinX = Math.sin(angleRef.current.x);

      // Projected sphere node coordinates
      const projectedNodes: { x: number; y: number; z: number; opacity: number }[] = [];

      sphereNodes.forEach((node) => {
        // Rotate Sphere relative 3D space (Y-axis)
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate X-axis
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // 3D perspective depth scaling
        const depthFactor = (perspective + z2) / perspective; // closer = larger factor
        const scale = sphereRadius;
        const pX = centerX + x1 * scale * (perspective / (perspective + z2));
        const pY = centerY + y2 * scale * (perspective / (perspective + z2));
        const opacity = Math.max(0.08, Math.min(1.0, (perspective - z2 * 1.5) / perspective));

        projectedNodes.push({ x: pX, y: pY, z: z2, opacity });
      });

      // 1. Draw glowing space nebula backdrops inside the sphere
      const gradientBg = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, sphereRadius * 1.3);
      gradientBg.addColorStop(0, 'rgba(139, 92, 246, 0.16)'); // Purple inside
      gradientBg.addColorStop(0.4, 'rgba(12, 11, 45, 0.08)'); // Dark purple/indigo glow
      gradientBg.addColorStop(1, 'rgba(3, 1, 11, 0)');
      ctx.fillStyle = gradientBg;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw outer orbiting rings (Orbital paths with neon particles sliding)
      // Orbit 1: Tilted horizontally (Amber-Orange Glow)
      const orbitRadiusX1 = sphereRadius * 1.45;
      const orbitRadiusY1 = sphereRadius * 0.45;
      const orbitAngle1 = -Math.PI / 6; // 30 deg incline

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(orbitAngle1);
      
      // Ring Stroke
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitRadiusX1, orbitRadiusY1, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glowing sliding nodes on Orbit 1
      orbit1.forEach((angle, idx) => {
        const offsetAngle = angle + frame * 0.003;
        const oX = Math.cos(offsetAngle) * orbitRadiusX1;
        const oY = Math.sin(offsetAngle) * orbitRadiusY1;
        const isFar = Math.sin(offsetAngle) < 0; 
        
        ctx.beginPath();
        ctx.arc(oX, oY, idx % 6 === 0 ? 3.2 : 1.4, 0, Math.PI * 2);
        ctx.fillStyle = idx % 6 === 0 
          ? `rgba(212, 175, 55, ${isFar ? 0.35 : 0.95})` 
          : `rgba(243, 200, 68, ${isFar ? 0.2 : 0.75})`;
        ctx.fill();
      });

      ctx.restore();

      // Orbit 2: Tilted vertically (Cyan-Indigo Glow)
      const orbitRadiusX2 = sphereRadius * 1.35;
      const orbitRadiusY2 = sphereRadius * 0.3;
      const orbitAngle2 = Math.PI / 4; // 45 deg incline

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(orbitAngle2);
      
      // Ring Stroke
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitRadiusX2, orbitRadiusY2, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Nodes on Orbit 2
      orbit2.forEach((angle, idx) => {
        const offsetAngle = angle - frame * 0.005;
        const oX = Math.cos(offsetAngle) * orbitRadiusX2;
        const oY = Math.sin(offsetAngle) * orbitRadiusY2;
        const isFar = Math.sin(offsetAngle) < 0;

        ctx.beginPath();
        ctx.arc(oX, oY, idx % 5 === 0 ? 2.8 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = idx % 5 === 0 
          ? `rgba(139, 92, 246, ${isFar ? 0.35 : 0.9})` 
          : `rgba(99, 102, 241, ${isFar ? 0.2 : 0.65})`;
        ctx.fill();
      });

      ctx.restore();

      // 3. Draw constellations (lines connecting nearby nodes on the sphere)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedNodes.length; i++) {
        const nodeA = projectedNodes[i];
        
        // Find nearest nodes
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const nodeB = projectedNodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          // Connect if distance matches spherical metrics
          if (dist < sphereRadius * 0.58) {
            const minOpacity = Math.min(nodeA.opacity, nodeB.opacity);
            const lineAlpha = (1 - dist / (sphereRadius * 0.58)) * 0.22 * minOpacity;
            
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // 4. Draw sphere points with interactive neon glow
      projectedNodes.forEach((node) => {
        ctx.beginPath();
        // size varies based on relative depth Z
        const radius = Math.max(0.8, (2.8 * (perspective - node.z * 0.6)) / perspective);
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        // Front nodes glow brighter (Z < 0 is closer, Z > 0 is further away)
        if (node.z < 0) {
          ctx.fillStyle = `rgba(216, 180, 254, ${node.opacity})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#a855f7';
        } else {
          ctx.fillStyle = `rgba(139, 92, 246, ${node.opacity * 0.8})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse interactive events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      mouseRef.current = { x: mouseX, y: mouseY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeAndDpiAdjust);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square md:w-[460px] md:h-[460px] mx-auto flex flex-col items-center justify-center">
      {/* Absolute space dust particles background */}
      <div className="absolute inset-0 bg-transparent radial-space-dust opacity-35 pointer-events-none" />
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing max-w-[420px] max-h-[420px]"
        title="ขยับเมาส์มาวางทับเพื่อควบคุมทิศทางลูกบอล 3 มิติได้ทันที"
      />
    </div>
  );
};


export default function Hero({ onSearch, onExplore, onKycNavigate }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#070415] pt-4 pb-1">
      {/* Decorative Lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 md:py-14">
          
          {/* Left Column Text details */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Badge matching the screen logo exactly */}
            <div className="inline-flex items-center gap-2 bg-[#120b2d] border border-purple-500/20 p-1.5 px-4 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.12)]">
              <EfCpaShopLogo className="h-5 w-5 rounded border border-[#d4af37]/75 p-[0.5px]" />
              <span className="text-[#fecc09] text-xs font-bold animate-pulse">⚡</span>
              <span className="text-white text-[11px] sm:text-xs font-black tracking-wide font-sans">
                ตลาดซื้อขาย & ผ่อนชำระบัญชี eFootball อันดับ 1
              </span>
            </div>

            {/* Main Header Headline with neon Division 1 text */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium tracking-normal text-white leading-tight font-display">
                เลือกทีมที่ถูกใจ
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium tracking-normal text-white leading-snug flex flex-wrap items-center gap-x-3">
                <span className="font-display">เพื่อมุ่งไปสู่</span>
                <span className="text-[#fecc09] tracking-wide font-sans font-black">DIVISION</span>
                <span className="text-[#a6b6f7] font-sans font-black">1</span>
              </h1>
            </div>

            {/* Sub description text with exact copywriting from screenshot */}
            <p className="text-slate-200 text-xs sm:text-[14.5px] leading-relaxed max-w-2xl font-light font-sans">
              สัมผัสประสบการณ์ทีมฟุตบอลคลาโซ่ มิลาน และบาร์เซโลน่าในอุมดคติที่ประกอบด้วย 
              การ์ด Epic / Big Time ครบเครื่องในฝัน มั่นใจด้วยเกตเวย์ <span className="text-purple-400 font-bold">EasySlip™</span> แจ้งจ่าย 
              สแกนสลิปรวดเร็ว 100% อนุมัติการผ่อนชำระทันที
            </p>

            {/* Call to action buttons mimicking exact copy & color */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onExplore}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold p-3 px-8 rounded-xl shadow-[0_4px_25px_rgba(139,92,246,0.35)] transition-all text-xs sm:text-sm tracking-wide transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-purple-500/35 font-sans"
              >
                <span>เลือกซื้อไอดีในคลัง</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={onKycNavigate}
                className="bg-[#120b2d]/85 hover:bg-[#1a0f3d] text-[#f1f5f9] border border-purple-500/30 hover:border-purple-500/50 font-extrabold p-3 px-8 rounded-xl transition-all text-xs sm:text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md active:scale-98 font-sans"
              >
                <UserCheck className="h-4 w-4 text-purple-400" />
                <span>ยืนยัน KYC รับวงเงินผ่อน</span>
              </button>
            </div>

            {/* Luxury-profile eFootball Stats block beneath buttons using the new Serif/Maitree display layout */}
            <div className="grid grid-cols-3 gap-6 pt-7 max-w-xl border-t border-slate-800/50">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-none font-sans">
                  99.8%
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-light tracking-wide font-sans">
                  ประกันบัญชีไม่แฮก
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-semibold text-[#f5c53c] tracking-tight leading-none font-sans">
                  10%
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-light tracking-wide font-sans">
                  ดาวน์เริ่มต้นถูกสุด
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-semibold text-[#a6b6f7] tracking-tight leading-none font-sans">
                  6 สัปดาห์
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-light tracking-wide font-sans">
                  งวดผ่อนสูงสุดต่อตัว
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Constellation Sphere WebGL alternative */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-full flex justify-center">
              <InteractiveSphereCanvas />
            </div>

            {/* Holographic system indicator badge matching user screenshot */}
            <div className="mt-4 inline-flex items-center gap-2 bg-[#120b2d]/90 border border-purple-500/20 py-1.5 px-4.5 rounded-full text-xs font-mono select-none shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <span className="text-purple-500 text-xs mr-0.5 leading-none">●</span>
              <span className="text-[#a2a6cc] text-[10.5px] font-medium tracking-wide">
                WebGL Engine: Interactive 3D Sphere Orbit
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
