import React, { useState } from 'react';
import { 
  Gamepad2, 
  User, 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2, 
  Coins, 
  Menu, 
  X, 
  Award, 
  LogOut,
  Sliders,
  Sparkles,
  CreditCard,
  Globe,
  Bell,
  Home,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  userStats: {
    name: string;
    creditScore: number;
    activeContracts: number;
    walletBalance: number;
  };
  onOpenCreditModal: () => void;
  isUserLoggedIn?: boolean;
  userEmail?: string;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  viewMode?: 'user' | 'admin';
  setViewMode?: (mode: 'user' | 'admin') => void;
}

// Highly polished logo loading the requested image, with local slot/path /logo.png and a remote fallback link
export const EfCpaShopLogo = ({ className = "h-11 w-11" }: { className?: string }) => {
  const localSrc = "/logo.png";
  const remoteSrc = "https://img2.pic.in.th/47AF4192-FB83-4538-A567-374319D868B1.png";

  return (
    <img 
      src={localSrc}
      onError={(e) => {
        (e.target as HTMLImageElement).src = remoteSrc;
      }}
      alt="efcpashop.online Logo"
      referrerPolicy="no-referrer"
      className={`${className} object-contain transition-all hover:scale-110 shrink-0 bg-[#070415]`}
    />
  );
};

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  setIsAdmin, 
  userStats,
  onOpenCreditModal,
  isUserLoggedIn = false,
  userEmail = 'armpunnon@gmail.com',
  onOpenLoginModal,
  onLogout,
  viewMode = 'user',
  setViewMode
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'chayapol.arm2004@gmail.com' && adminPassword === 'Arm15658') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      setLoginError('');
    } else {
      setLoginError('อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }
  };

  const navItems: { id: string; label: string; icon: string; isTrigger?: boolean }[] = [
    { id: 'home', label: 'หน้าหลักตลาดซื้อขาย', icon: 'home' },
    { id: 'kyc', label: 'ยืนยันตัวตน (KYC)', icon: 'kyc' },
    { id: 'payment', label: 'ผ่อนชำระของฉัน', icon: 'payment' }
  ];

  const renderTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'kyc':
        return <ShieldCheck className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />;
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-45 bg-[#070415]/95 border-b border-purple-950/20 backdrop-blur-md shadow-[0_5px_25px_rgba(0,0,0,0.65)] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand aligned in the top left */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            id="brand-logo"
          >
            <EfCpaShopLogo className="h-11 w-11 hover:rotate-2 duration-300 border border-[#d4af37]/80 p-[1.5px] bg-[#070415] rounded-xl shadow-[0_0_12px_rgba(212,175,55,0.45)]" />
            
            <div className="text-left select-none">
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-none">
                  EF CPA Shop
                </span>
                <span className="text-blue-500 font-black text-[9px] tracking-widest mt-1 uppercase font-mono hidden xl:block">
                  EFOOTBALL MARKETPLACE
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Nav Items matching the screenshot */}
          <div className="hidden md:flex items-center space-x-1 border border-purple-500/10 p-1 bg-[#120b2d] rounded-2xl shrink-0">
            {navItems.map((item) => {
              const isActive = item.isTrigger ? false : (activeTab === item.id);
              
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    if (item.isTrigger) {
                      onOpenCreditModal();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`group px-3 py-2 xl:px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 xl:gap-2 relative ${
                    isActive 
                      ? 'text-white bg-purple-600/35 border border-purple-500/30' 
                      : 'text-slate-350 hover:text-white hover:bg-[#12224d]/40'
                  }`}
                >
                  {renderTabIcon(item.icon)}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-500 rounded-full blur-[1px]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Quick User Panel & Language Selection (TH) & Notification Bell */}
          <div className="hidden md:flex items-center gap-1.5 xl:gap-3.5 min-w-0 shrink">
            
            {/* TH Language indicator capsule */}
            <div className="flex items-center gap-1.5 border border-purple-950 bg-[#120b2d] text-purple-400 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm shrink-0">
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <span>TH</span>
            </div>

            {/* Notification Bell option with alert active badge */}
            <button 
              onClick={onOpenCreditModal}
              className="relative p-2 rounded-xl border border-purple-950 bg-[#120b2d] hover:bg-purple-900/10 text-slate-200 transition-all cursor-pointer shadow-sm shrink-0"
              title="ระบบการแจ้งเตือน"
            >
              <Bell className="h-4 w-4 text-slate-200" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-[#03091e]" />
            </button>

            {/* Premium Simulated Account session details widget */}
            {isUserLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <div 
                  onClick={onOpenCreditModal}
                  className="flex items-center gap-2 xl:gap-3 pl-1 xl:pl-2 cursor-pointer hover:opacity-90 min-w-0 font-sans"
                  id="user-credit-box"
                  title={`สิทธิ์ผู้ใช้: ${userEmail} (คลิกเพื่อขอเพิ่มวงเงิน / ตรวจสอบประวัติ)`}
                >
                  <div className="text-right leading-tight select-none min-w-0 block">
                    <span className="text-xs text-white font-extrabold block truncate max-w-[130px]">
                      {userEmail}
                    </span>
                    <span className="inline-block mt-0.5 text-[8px] bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-extrabold tracking-widest uppercase truncate max-w-full">
                      CONNECTED
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#120b2d] border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 shadow-md">
                    <User className="h-4.5 w-4.5 text-purple-400" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 border border-purple-500/10 bg-[#140c31] hover:bg-purple-900/20 text-indigo-400 rounded-xl transition-all cursor-pointer text-xs font-bold shrink-0"
                  title="ออกจากระบบ"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-400 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(139,92,246,0.3)] animate-pulse hover:animate-none cursor-pointer"
                id="navbar-login-btn"
              >
                <Key className="h-3.5 w-3.5 text-white" />
                <span>เข้าสู่ระบบ / ยืนยัน OTP</span>
              </button>
            )}

            {/* Admin Backoffice controls - ONLY shown if logged in as Admin */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 shrink-0">
                {viewMode === 'user' ? (
                  <button
                    onClick={() => setViewMode && setViewMode('admin')}
                    className="px-3.5 py-2 border border-cyan-500/30 bg-[#08221b] hover:bg-[#0c3127] text-cyan-400 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] active:scale-95 duration-205 shrink-0 cursor-pointer"
                    title="สลับไปยังแผงควบคุมระบบแอดมิน"
                  >
                    <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                    <span>จัดการหลังบ้าน</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode && setViewMode('user')}
                    className="px-3.5 py-2 border border-indigo-500/30 bg-[#0c122b] hover:bg-[#121b42] text-indigo-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)] active:scale-95 duration-205 shrink-0 cursor-pointer"
                    title="กลับไปหน้าแรกของร้านพรีวิว"
                  >
                    <Gamepad2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>กลับหน้าร้านค้า</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    if (setViewMode) setViewMode('user');
                    if (onLogout) onLogout();
                  }}
                  id="admin-panel-toggle"
                  title="ออกจากระบบแอดมิน"
                  className="flex items-center justify-center border border-red-500/20 bg-[#2b0c16] hover:bg-[#3d0f1e] text-red-400 p-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-[0_2px_10px_rgba(239,68,68,0.1)] active:scale-95 shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile responsive triggers */}
          <div className="flex items-center gap-2 md:hidden">
            {isAdmin && (
              <div className="flex items-center gap-1">
                {viewMode === 'user' ? (
                  <button
                    onClick={() => setViewMode && setViewMode('admin')}
                    className="p-2 rounded-xl border text-[10px] bg-[#0c2e25] text-emerald-400 border-cyan-500/30 font-black cursor-pointer"
                  >
                    สลับหลังบ้าน
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode && setViewMode('user')}
                    className="p-2 rounded-xl border text-[10px] bg-[#121c43] text-indigo-300 border-indigo-500/30 font-black cursor-pointer"
                  >
                    กลับหน้าร้าน
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    if (setViewMode) setViewMode('user');
                    if (onLogout) onLogout();
                  }}
                  id="admin-toggle-mobile"
                  className="p-2 rounded-xl border text-[10px] bg-red-950/60 hover:bg-red-900/60 text-red-400 border-red-500/30 font-black cursor-pointer"
                  title="ออกจากระบบแอดมิน"
                >
                  ออก
                </button>
              </div>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 text-gray-400 hover:text-white bg-[#070415] border border-purple-950 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070415]/95 backdrop-blur-md border-b border-purple-950/20 px-4 pt-2 pb-5 space-y-3">
          <div className="space-y-1 text-left">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.isTrigger) {
                    onOpenCreditModal();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === item.id && !item.isTrigger
                    ? 'text-white bg-purple-600/35 border-l-4 border-purple-500'
                    : 'text-gray-300 hover:text-white hover:bg-[#05112e]/50'
                }`}
              >
                {renderTabIcon(item.icon)}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Stats Summary */}
          <div className="pt-4 border-t border-purple-950/20 space-y-2 text-left">
            <div className="flex justify-between items-center bg-[#120b2d]/50 p-2.5 rounded-xl border border-purple-500/10">
              <span className="text-xs text-slate-400 font-bold">บัญชีผู้ใช้ :</span>
              <span className="text-xs text-purple-400 font-extrabold">{userStats.name}</span>
            </div>
            
            <div className="flex justify-between items-center bg-[#120b2d]/50 p-2.5 rounded-xl border border-purple-500/10 text-xs">
              <span className="text-slate-400 font-bold">คะแนนสกอร์หลัก :</span>
              <span className="text-yellow-400 font-extrabold">{userStats.creditScore}/1000 CG</span>
            </div>

            <div className="flex justify-between items-center bg-[#120b2d]/50 p-2.5 rounded-xl border border-purple-500/10 text-xs">
              <span className="text-slate-400 font-bold">วงเงินดาวน์จำลอง :</span>
              <span className="text-emerald-400 font-extrabold">฿{userStats.walletBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 text-center">
            {/* Top Close button */}
            <button
              type="button"
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Lock Icon & Titles */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
                <Lock className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">ตรวจสอบสิทธิ์แอดมินหลังบ้าน</h3>
              <p className="text-slate-400 text-xs font-sans font-light">
                เฉพาะแอดมินที่มีสิทธิ์อนุญาตเท่านั้น กรุณาป้อนคุณสมบัติรหัสลับเพื่อเข้าใช้งาน
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">อีเมลแอดมิน</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="chayapol.arm2004@gmail.com"
                    className="w-full bg-[#05070e] border border-slate-800 focus:border-indigo-500/70 text-slate-200 p-3 pl-8 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">รหัสผ่านแอดมิน</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Key className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="ป้อนรหัสแอดมิน..."
                    className="w-full bg-[#05070e] border border-slate-800 focus:border-indigo-500/70 text-slate-200 p-3 pl-9 pr-10 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error messages */}
              {loginError && (
                <div className="flex items-start gap-2 bg-red-950/25 border border-red-500/30 p-2.5 rounded-xl">
                  <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-red-400 text-[10px] leading-relaxed text-left">{loginError}</span>
                </div>
              )}

              {/* Action buttons */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                เข้าสู่ระบบตั้งค่าหลังบ้าน
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
