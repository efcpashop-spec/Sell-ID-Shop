import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  User, 
  UserPlus, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string, name: string, phone: string) => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'login' | 'register'>('login');
  
  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register input states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // OTP simulations
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Quick preset data for demo verification
  const handleDefaultLogin = () => {
    // Allows review bypass with demo credentials
    setLoginEmail('armpunnon@gmail.com');
    setLoginPassword('Arm15658');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.includes('@')) {
      setLoginError('กรุณากรอกรูปแบบอีเมลคู่สัญญาให้ถูกต้องค่ะ');
      return;
    }
    if (loginPassword.length < 4) {
      setLoginError('กรุณากรอกรหัสผ่านอย่างน้อย 4 ตัวอักษรค่ะ');
      return;
    }

    // Check if it is the admin
    if (loginEmail.trim() === 'chayapol.arm2004@gmail.com' && loginPassword === 'Arm15658') {
      onLoginSuccess(loginEmail, 'แอดมิน ชยพล', '089-765-4321');
      return;
    }

    // Check if it is the default demo user
    if (loginEmail.trim() === 'armpunnon@gmail.com' && loginPassword === 'Arm15658') {
      onLoginSuccess(loginEmail, 'ชยพล (Chayapol)', '089-765-4321');
      return;
    }

    // Check if it matches any registered profiles from localStorage
    let foundProfile = null;
    try {
      const savedProfilesRaw = localStorage.getItem('efc_registered_profiles') || '[]';
      const profiles = JSON.parse(savedProfilesRaw);
      if (Array.isArray(profiles)) {
        foundProfile = profiles.find((p: any) => p && p.email && p.email.trim().toLowerCase() === loginEmail.trim().toLowerCase());
      }
    } catch (err) {
      console.error('Error reading profiles from localStorage', err);
    }

    if (foundProfile) {
      if (foundProfile.password !== loginPassword) {
        setLoginError('รหัสผ่านที่คุณป้อนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ');
        return;
      }
      onLoginSuccess(foundProfile.email, foundProfile.fullName, foundProfile.phone);
    } else {
      setLoginError('ไม่พบอีเมลคู่สัญญานี้ในระบบ กรุณาตรวจสอบอีเมล หรือสมัครสมาชิกใหม่ด้านบนค่ะ');
    }
  };

  const handleSendOtp = async () => {
    if (regPhone.length < 10) {
      alert('กรุณากรอกหมายเลขโทรศัพท์ 10 หลักให้ถูกต้องครบถ้วนค่ะ');
      return;
    }
    
    // Generate real 6-digit OTP code to check against
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpError('');
    setIsSendingOtp(true);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: regPhone,
          message: `รหัสความปลอดภัย OTP ของท่านคือ: ${generatedCode} (สำหรับยืนยันสมัครผ่อนไอดีเกม)`
        })
      });
      const result = await response.json();
      if (result.success) {
        setOtpCode(generatedCode);
        setOtpSent(true);
        alert(`ระบบเกตเวย์ SMS2pro ได้ส่งรหัส OTP ไปยังเบอร์ ${regPhone} เรียบร้อยแล้วค่ะ! กรุณารอรับ SMS และนำรหัสมากรอกยืนยันตัวตนนะคะ`);
      } else {
        alert(`ส่ง OTP ไม่สำเร็จ: ${result.message || 'กรุณาตรวจสอบการตั้งค่า SMS2PRO_API_TOKEN บนเซิร์ฟเวอร์ค่ะ'}`);
      }
    } catch (error: any) {
      alert(`เกิดข้อผิดพลาดในการระบุส่ง OTP ของเว็บ: ${error.message}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAction = () => {
    if (otpInput === otpCode && otpCode !== '') {
      setOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('รหัสผ่าน OTP ของท่านไม่ถูกต้อง กรุณาตรวจสอบหรือขอใหม่อีกครั้งค่ะ');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      alert('กรุณากรอก ชื่อ-นามสกุลจริงตามบัตรประชาชน เพื่อควบคุม KYC ด้วยค่ะ');
      return;
    }
    if (!regEmail.includes('@')) {
      alert('กรุณากรอก อีเมลสำหรับติดต่อ ให้ถูกต้องค่ะ');
      return;
    }
    if (!otpVerified) {
      alert('กรุณากดรับ OTP และป้อนรหัส 6 หลักเพื่อทำสัญญาอนุมัติวงเงินค่ะ (หรือกดข้าม OTP เพื่อทดสอบเร็ว)');
      return;
    }
    if (regPassword.length < 4) {
      alert('กรุณาตั้งรหัสผ่านสำหรับใช้งานอย่างน้อย 4 ตัวขึ้นไปค่ะ');
      return;
    }

    // Save newly created user dynamically in localStorage for persistence
    try {
      const savedProfiles = localStorage.getItem('efc_registered_profiles') || '[]';
      let decodedProfiles = [];
      try {
        const parsed = JSON.parse(savedProfiles);
        if (Array.isArray(parsed)) {
          decodedProfiles = parsed;
        }
      } catch (e) {
        // use default empty array
      }
      decodedProfiles.push({
        email: regEmail,
        password: regPassword,
        fullName: regFullName,
        phone: regPhone
      });
      localStorage.setItem('efc_registered_profiles', JSON.stringify(decodedProfiles));
    } catch (e) {
      console.error('Error saving new profile to localStorage', e);
    }

    setRegistrationSuccess(true);
    setTimeout(() => {
      onLoginSuccess(regEmail, regFullName, regPhone);
      setRegistrationSuccess(false);
    }, 1800);
  };

  const handleForgotPassword = () => {
    alert('ระบบตรวจพบรอยสลักสิทธิ์คู่สัญญาเกตเวย์\nระบบจะทำการส่ง SMS รหัสผ่านชั่วคราวให้ในกรณีท่านประเมินเบอร์มือถือที่เคยย้ายสิทธิ์สำเร็จแล้ว กรุณาติดต่อเพจแอดมินหรือใช้ระบบ OTP สมัครสมาชิกใหม่แทนได้เช่นกันค่ะ');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-4 flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fadeIn transition-all select-none">
      
      {/* Interactive Main Box Card */}
      <div className="w-full max-w-[480px] bg-[#0c0d16] border border-indigo-950 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden">
        
        {/* Double Rounded Tabs Bar */}
        <div className="grid grid-cols-2 border-b border-indigo-950 select-none">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('login');
              setLoginError('');
            }}
            className={`py-4 text-xs sm:text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
              activeSubTab === 'login' 
                ? 'text-white border-b-2 border-indigo-500 bg-[#0f111e]' 
                : 'text-slate-400 bg-slate-950/40 hover:text-white hover:bg-slate-900/10'
            }`}
          >
            เข้าสู่ระบบสมาชิก
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('register');
              setLoginError('');
            }}
            className={`py-4 text-xs sm:text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
              activeSubTab === 'register' 
                ? 'text-white border-b-2 border-indigo-500 bg-[#0f111e]' 
                : 'text-slate-400 bg-slate-950/40 hover:text-white hover:bg-slate-900/10'
            }`}
          >
            สมัครสมาชิกใหม่ (ยืนยัน OTP)
          </button>
        </div>

        {registrationSuccess ? (
          <div className="p-8 text-center space-y-4 animate-scaleUp">
            <div className="h-14 w-14 rounded-full bg-emerald-500/12 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/20">
              <CheckCircle2 className="h-7 w-7 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-white font-black text-lg">สมัครสมาชิกเสร็จสมบูรณ์เรียบร้อย!</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans max-w-xs mx-auto">
                เกตเวย์ SMS2pro และคลังสัญญาสลักสิทธิ์ได้ทำการเปิดบัญชีคู่สัญญา {regEmail} สำเร็จแล้ว กำลังนำท่านเข้าสู่แดชบอร์ดผ่อนชำระ...
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-7 space-y-6">

            {/* TAB CONTENT: LOGIN FORM */}
            {activeSubTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5 text-left animate-fadeIn">
                
                {/* Central circular banner avatar */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-white font-black text-base sm:text-lg">ยินดีต้อนรับกลับสู่ EFCPAShop</h2>
                    <p className="text-[11px] text-slate-400">
                      กรอกข้อมูลบัญชีเพื่อเข้าจัดเตรียมสลิปและสัญญาผ่อนของคุณ
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Field: Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 block uppercase tracking-wider">
                      อีเมลคู่สัญญา (EMAIL)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input 
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-[#05060a] border border-slate-800 p-3 pl-11 rounded-xl text-white outline-none font-sans text-xs tracking-wide focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-mono font-bold text-gray-400">
                      <span className="uppercase tracking-wider">รหัสผ่าน (PASSWORD)</span>
                      <button 
                        type="button" 
                        onClick={handleDefaultLogin}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-sans cursor-pointer underline hidden sm:block"
                        title="กรอกบัญชีผู้ใช้ทดสอบสำหรับการทดสอบด่วน"
                      >
                        (ใช้ไอดีทดสอบด่วน)
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input 
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#05060a] border border-slate-800 p-3 pl-11 pr-11 rounded-xl text-white outline-none font-mono text-xs focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-950/20 border border-red-500/10 p-3 rounded-lg text-red-400 text-[10.5px] leading-relaxed">
                    ⚠ {loginError}
                  </div>
                )}

                <div className="flex flex-col space-y-4 pt-1">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all font-black text-white rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    <ArrowRight className="h-4.5 w-4.5 text-white" />
                    <span>เข้าสู่ระบบสมาชิก</span>
                  </button>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10.5px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      ลืมรหัสผ่าน? (กู้คืนผ่าน OTP)
                    </button>
                  </div>
                </div>

              </form>
            )}


            {/* TAB CONTENT: REGISTER FORM WITH REAL TIME OTP VERIFICATION */}
            {activeSubTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left animate-fadeIn">
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-white font-black text-base">สมัครสมาชิกระบบตรวจสอบ OTP</h2>
                    <p className="text-[10.5px] text-slate-400 max-w-sm leading-relaxed">
                      ลงทะเบียนพร้อมควบคุมความปลอดภัยผ่าน OTP ส่งสัญญาณโดยเกตเวย์ SMS2pro
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* Field: Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-gray-400 block uppercase tracking-wide">
                      ชื่อ-นามสกุลจริงตามบัตรประชาชน (REAL FULL NAME)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        placeholder="เช่น สมชาย ใจดี (ระบุชื่อ เว้นวรรค นามสกุล)"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full bg-[#05060a] border border-slate-800 p-2.5 pl-11 rounded-xl text-white outline-none font-sans text-xs focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* High Quality Warning block matching requested image exact yellow lettering */}
                  <div className="p-3.5 bg-yellow-950/15 border border-yellow-500/10 rounded-xl">
                    <p className="text-[10px] text-yellow-500/90 leading-relaxed font-sans text-left">
                      ⚠️ <strong className="text-yellow-400">มีผลต่อการยืนยันตัวตนผ่อน ID:</strong> เพื่อความปลอดภัยสูงสุดในการทำธุรกรรม และมีสิทธิประโยชน์ตามกฎหมายในสัญญาผ่อนชำระไอดี ลูกค้าต้องกรอก ชื่อและนามสกุลจริงตามบัตรประชาชนเท่านั้น หากไม่ตรงกัน ทางระบบจะไม่สามารถตรวจสอบอนุมัติการรับไอดีและสัญญาได้ในระบบ KYC ค่ะ
                    </p>
                  </div>

                  {/* Field: Register Email */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-gray-400 block uppercase tracking-wide">
                      อีเมลสำหรับติดต่อ (EMAIL ADDRESS)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input 
                        type="email"
                        required
                        placeholder="register.demo@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#05060a] border border-slate-800 p-2.5 pl-11 rounded-xl text-white outline-none font-sans text-xs focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field: Phone & Request OTP Trigger Row */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-gray-400 block uppercase tracking-wide">
                      เบอร์โทรศัพท์มือถือรับ SMS OTP (PHONE)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <input 
                          type="text"
                          required
                          maxLength={10}
                          placeholder="xxxxxxxxxx"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[#05060a] border border-slate-800 p-2.5 pl-11 rounded-xl text-white outline-none font-mono text-xs tracking-wider focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isSendingOtp}
                        onClick={handleSendOtp}
                        className={`px-4.5 py-2.5 text-white font-extrabold text-[11px] rounded-xl transition-all shrink-0 ${
                          isSendingOtp 
                            ? 'bg-slate-700 cursor-not-allowed opacity-65' 
                            : 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer'
                        }`}
                      >
                        {isSendingOtp ? 'กำลังส่ง...' : (otpSent ? 'ขอส่งซ้ำ' : 'ขอรับ OTP')}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic OTP validation pin block if requested */}
                  {otpSent && (
                    <div className="bg-[#080a14] border border-indigo-500/20 p-3.5 rounded-xl space-y-2.5 animate-scaleUp text-left">
                      <div className="flex justify-between items-center text-[10px] font-sans">
                        <span className="text-slate-400 font-bold">ป้อนรหัส 6 หลักความปลอดภัยที่ส่งไปทาง SMS:</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          maxLength={6}
                          placeholder="กรอกรหัสผ่าน OTP 6 ตัว..."
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow bg-slate-950 border border-slate-800 p-2 text-center text-white outline-none font-mono text-sm tracking-[0.25em] focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAction}
                          className={`px-4 py-2 text-[10.5px] font-black rounded-lg transition-all cursor-pointer ${
                            otpVerified 
                              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-indigo-650 hover:bg-indigo-550 text-white'
                          }`}
                        >
                          {otpVerified ? '✓ ตรวจสำเร็จ' : 'ตรวจรหัส OTP'}
                        </button>
                      </div>
                      {otpError && (
                        <p className="text-[10px] text-red-400">{otpError}</p>
                      )}
                    </div>
                  )}

                  {/* Field: Password */}
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-gray-400 block uppercase tracking-wide">
                      รหัสผ่านที่ต้องการ (PASSWORD)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input 
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="รหัสผ่านเข้าใช้งาน . . ."
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-[#05060a] border border-slate-800 p-2.5 pl-11 pr-11 rounded-xl text-white outline-none font-mono text-xs focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 font-black transition-all rounded-xl text-xs sm:text-xs text-center flex items-center justify-center gap-2 select-none cursor-pointer ${
                      otpVerified 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white cursor-pointer shadow-lg hover:shadow-indigo-500/20' 
                        : 'bg-[#15192e] border border-[#2b335e] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>สมัครสมาชิกบริการผ่อนชำระสำเร็จ</span>
                  </button>
                </div>

              </form>
            )}

            {/* Bottom Back Button Layout matching requested screenshots */}
            <div className="border-t border-indigo-950/50 pt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-slate-450 hover:text-white text-xs font-bold transition-all duration-250 cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-400" />
                <span>ยกเลิกและกลับด้านหน้า</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
