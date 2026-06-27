import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  InstallmentApplication, 
  PaymentSlip, 
  SystemLog 
} from './types';
import { 
  DEFAULT_PRODUCTS, 
  GAMES_FILTER, 
  TESTIMONIALS, 
  FAQ_LIST,
  BANK_ACCOUNTS
} from './data';

// Import sub-components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ApplicationModal from './components/ApplicationModal';
import PaymentReportModal from './components/PaymentReportModal';
import SupportChat from './components/SupportChat';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import ContractProgressBar from './components/ContractProgressBar';

import { 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Facebook, 
  MessageCircle, 
  FileText,
  Star,
  Users2,
  ListFilter,
  Check,
  ChevronDown,
  Award,
  BookOpenCheck,
  Trophy,
  CheckCircle2,
  X,
  Clock,
  CreditCard,
  History,
  Coins,
  RefreshCw,
  Sparkles,
  Download,
  Calendar,
  Eye,
  AlertCircle,
  QrCode
} from 'lucide-react';

const THAI_MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const COUPONS = [
  { code: 'WELCOME100', desc: 'ส่วนลดเงินสดผ่อนชำระ 100 บาท' },
  { code: 'EFCPA50', desc: 'ส่วนลดค่ากำไรรวมราคาผ่อน 50%' },
  { code: 'WELCOME100', desc: 'ส่วนลดเงินสดผ่อนชำระ 100 บาท' },
  { code: 'EFCPA50', desc: 'ส่วนลดค่ากำไรรวมราคาผ่อน 50%' }
];

const SoccerBallIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 512 512" 
    className={`${className} animate-[spin_5s_linear_infinite]`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="256" cy="256" r="236" fill="#FFFFFF" stroke="#000000" strokeWidth="24" />
    <path d="M256 160L316 204L293 275H219L196 204L256 160Z" fill="#000000" />
    <path d="M256 160V20" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
    <path d="M316 204L450 130" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
    <path d="M293 275L390 450" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
    <path d="M219 275L122 450" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
    <path d="M196 204L62 130" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
    <path d="M256 20L210 60H302L256 20Z" fill="#000000" />
    <path d="M450 130L415 185L475 220L450 130Z" fill="#000000" />
    <path d="M390 450L330 425L375 375L390 450Z" fill="#000000" />
    <path d="M122 450L182 425L137 375L122 450Z" fill="#000000" />
    <path d="M62 130L97 185L37 220L62 130Z" fill="#000000" />
  </svg>
);

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Business states (Cached in LocalStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('efc_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch (e) {
      console.error('Error parsing efc_products, resetting to default', e);
      return DEFAULT_PRODUCTS;
    }
  });

  const [applications, setApplications] = useState<InstallmentApplication[]>(() => {
    try {
      const saved = localStorage.getItem('efc_applications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing efc_applications, resetting to empty array', e);
      return [];
    }
  });

  const [slips, setSlips] = useState<PaymentSlip[]>(() => {
    try {
      const saved = localStorage.getItem('efc_slips');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing efc_slips, resetting to empty array', e);
      return [];
    }
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    try {
      const saved = localStorage.getItem('efc_logs');
      return saved ? JSON.parse(saved) : [
        { id: '1', type: 'info', message: 'ระบบจัดการผ่อนชำระสิทธิ์ออนไลน์เริ่มบู๊ทอย่างสมบูรณ์แบบ', timestamp: new Date().toLocaleTimeString() }
      ];
    } catch (e) {
      console.error('Error parsing efc_logs', e);
      return [
        { id: '1', type: 'info', message: 'ระบบจัดการผ่อนชำระสิทธิ์ออนไลน์เริ่มบู๊ทอย่างสมบูรณ์แบบ', timestamp: new Date().toLocaleTimeString() }
      ];
    }
  });

  const [collectedCoupons, setCollectedCoupons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('efc_collected_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing efc_collected_coupons, resetting to empty array', e);
      return [];
    }
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState('home'); // home | shop | payment | faq
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');

  // Filter & Search states
  const [selectedGame, setSelectedGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all'); // all | mobile | console
  const [minOvr, setMinOvr] = useState(3000); // eFootball strength range starts from 3000 to 3250
  const [selectedStatus, setSelectedStatus] = useState('all'); // all | available | paying | sold
  const [sortBy, setSortBy] = useState('hot'); // hot | price-asc | price-desc | down-asc

  // Modal control states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [appProduct, setAppProduct] = useState<Product | null>(null);
  const [appWeeks, setAppWeeks] = useState(4);
  const [appDown, setAppDown] = useState(1000);
  
  const [showPaymentModal, setShowPaymentModal] = useState<boolean | { defaultAppId: string; defaultPaymentType: 'installment' | 'down' } | null>(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewingContractId, setViewingContractId] = useState<string | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);

  // Calendar State
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());

  // Accordion faq tracker State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Simulated User Account profile config
  const [userStats, setUserStats] = useState({
    name: 'ชยพล (Chayapol)',
    creditScore: 840,
    activeContracts: 0,
    walletBalance: 25000,
    isKycApproved: false
  });

  // Secure KYC State management
  const [kycUser, setKycUser] = useState(() => {
    try {
      const saved = localStorage.getItem('efc_kyc_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading efc_kyc_user from localStorage', e);
    }
    return {
      isLoggedIn: false,
      email: 'armpunnon@gmail.com',
      phone: '',
      otpSent: false,
      otpCode: '',
      otpInput: '',
      otpVerified: false,
      fullName: 'ศิริพร กอบขุนทด',
      nationalId: '1-2345-67890-12-3',
      idCardImage: '',
      selfieImage: '',
      consentChecked: false,
      finalConsentChecked: false,
      status: 'unlogged',
      submittedAt: '',
      creditLimit: 50000
    };
  });

  const [isSendingKycOtp, setIsSendingKycOtp] = useState(false);

  // Synced with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('efc_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Unable to write efc_products to localStorage:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('efc_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Unable to write efc_applications to localStorage:', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('efc_slips', JSON.stringify(slips));
    } catch (e) {
      console.warn('Unable to write efc_slips to localStorage:', e);
    }
  }, [slips]);

  useEffect(() => {
    try {
      localStorage.setItem('efc_logs', JSON.stringify(logs));
    } catch (e) {
      console.warn('Unable to write efc_logs to localStorage:', e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('efc_kyc_user', JSON.stringify(kycUser));
    } catch (e) {
      console.warn('Unable to write efc_kyc_user to localStorage:', e);
    }
    
    // Auto-update userStats' isKycApproved flag
    if (kycUser.status === 'approved' && !userStats.isKycApproved) {
      setUserStats(prev => ({ ...prev, isKycApproved: true }));
    } else if (kycUser.status !== 'approved' && userStats.isKycApproved) {
      setUserStats(prev => ({ ...prev, isKycApproved: false }));
    }
  }, [kycUser, userStats.isKycApproved]);

  // Load and sync user profile/dashboard stats from backend on page load or user state changes
  useEffect(() => {
    const fetchUserDashboardStats = async () => {
      try {
        const queryEmail = kycUser.email || 'armpunnon@gmail.com';
        const response = await fetch(`/api/dashboard?email=${encodeURIComponent(queryEmail)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserStats(prev => ({
              ...prev,
              name: data.fullName || prev.name,
              walletBalance: data.walletBalance,
              creditScore: data.creditScore
            }));
            
            setKycUser(prev => ({
              ...prev,
              email: data.email,
              creditLimit: data.creditLimit || prev.creditLimit
            }));

            // Auto-align admin authorization status if logged in email is indeed the admin
            if (data.email.trim().toLowerCase() === 'chayapol.arm2004@gmail.com') {
              setIsAdmin(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync dashboard stats from API endpoints:', err);
      }
    };

    fetchUserDashboardStats();
  }, [kycUser.email, kycUser.isLoggedIn]);

  // Synchronize previously registered users from localStorage to the server-side memory DB on app load
  useEffect(() => {
    const syncLocalUsersToBackend = async () => {
      try {
        const savedProfilesRaw = localStorage.getItem('efc_registered_profiles');
        if (savedProfilesRaw) {
          const localUsers = JSON.parse(savedProfilesRaw);
          if (Array.isArray(localUsers) && localUsers.length > 0) {
            await fetch('/api/users/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ localUsers })
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync previously registered local users with backend:', err);
      }
    };
    syncLocalUsersToBackend();
  }, []);

  // Robust date parser for app.submittedAt
  const parseAppDate = (submittedAtStr: string) => {
    let baseDate = new Date();
    if (!submittedAtStr) return baseDate;
    try {
      // Direct parsing first
      const d = new Date(submittedAtStr);
      if (!isNaN(d.getTime())) return d;
      
      // Secondary fallback parsing for formats like "11/6/2026, 3:22:40 PM"
      const parts = submittedAtStr.split(' ');
      if (parts[0]) {
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
          let dVal = parseInt(dateParts[0], 10);
          let mVal = parseInt(dateParts[1], 10) - 1;
          let yVal = parseInt(dateParts[2], 10);
          if (yVal > 2500) yVal -= 543; // Buddhist Era adjust
          const parsed = new Date(yVal, mVal, dVal);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      }
    } catch (err) {}
    return baseDate;
  };

  // User Isolated Applications and Slips for Customer Security
  const userApplications = useMemo(() => {
    // If NOT logged in, show applications created in this session but screen out anything else
    if (!kycUser.isLoggedIn) {
      return applications.filter(app => 
        app.fullName === kycUser.fullName || 
        app.phone === kycUser.phone
      );
    }
    
    // Logged in: strict filtering
    return applications.filter(app => 
      app.fullName === kycUser.fullName || 
      app.phone === kycUser.phone ||
      app.nationalId === kycUser.nationalId
    );
  }, [applications, kycUser]);

  const approvedUserApplications = useMemo(() => {
    return userApplications.filter(app => app.status === 'approved');
  }, [userApplications]);

  const userSlips = useMemo(() => {
    const appIds = new Set(userApplications.map(a => a.id));
    return slips.filter(s => appIds.has(s.applicationId));
  }, [slips, userApplications]);

  const urgentDueAlerts = useMemo(() => {
    const approvedApps = userApplications.filter(a => a.status === 'approved');
    return approvedApps.map(app => {
      const appSlips = userSlips.filter(s => s.applicationId === app.id);
      const verifiedCount = appSlips.filter(s => s.status === 'verified').length;
      const isFullyPaid = verifiedCount >= app.installmentWeeks;
      
      const baseDate = parseAppDate(app.submittedAt);
      const dueDate = new Date(baseDate.getTime() + (verifiedCount + 1) * 7 * 24 * 60 * 60 * 1000);
      const diffTime = dueDate.getTime() - Date.now();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        app,
        dueDate,
        daysLeft,
        isFullyPaid,
        verifiedCount,
        weeklyAmount: app.weeklyInstallmentAmount
      };
    }).filter(evt => !evt.isFullyPaid && evt.daysLeft <= 2);
  }, [userApplications, userSlips]);

  // Log helper
  const addLog = (type: 'info' | 'success' | 'warn' | 'error', message: string) => {
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

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

  const safeCopyToDevice = (text: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).catch(() => copyTextFallback(text));
    } else {
      copyTextFallback(text);
    }
  };

  const copyToClipboard = (text: string) => {
    safeCopyToDevice(text);
    setToastMessage(`คัดลอกโค้ด "${text}" สำเร็จแล้ว! นำไปกรอกเปิดใช้งานได้ทันที 🎟️`);
    addLog('success', `คัดลอกรหัสคูปองส่วนลด [${text}] สำเร็จลงสู่อุปกรณ์เรียบร้อย`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const collectCoupon = (code: string) => {
    if (!collectedCoupons.includes(code)) {
      const updated = [...collectedCoupons, code];
      setCollectedCoupons(updated);
      try {
        localStorage.setItem('efc_collected_coupons', JSON.stringify(updated));
      } catch (e) {
        console.warn('Unable to write efc_collected_coupons to localStorage', e);
      }
      safeCopyToDevice(code); // auto copy as convenience too
      setToastMessage(`🎉 เก็บโค้ด "${code}" สำเร็จแล้ว! สิทธิส่วนลดถูกเพิ่มเข้าไปในคลังสะสมพร้อมเลือกใช้แล้วค่ะ`);
      addLog('success', `กดเก็บคูปองส่วนลด [${code}] ไปยังคลังสะสมส่วนตัวสำเร็จ`);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } else {
      setToastMessage(`ℹ️ คุณเคยเก็บโค้ด "${code}" นี้ไปแล้ว สามารถเลือกใช้ได้เลยที่หน้าขยายรายละเอียดไอดี`);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  // Callback triggers
  const handleOpenSearchOfGame = (gameFilter: string) => {
    setSelectedGame(gameFilter);
    setActiveTab('shop');
    // Scroll down to grid list smoothly
    document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyProcessSetup = (product: Product, weeks: number, downPayment: number) => {
    setAppProduct(product);
    setAppWeeks(weeks);
    setAppDown(downPayment);
  };

  const handleApplicationCompleted = (newAppRaw: Omit<InstallmentApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: InstallmentApplication = {
      ...newAppRaw,
      id: 'APP-' + Math.floor(100000 + Math.random() * 900000),
      status: 'pending',
      submittedAt: new Date().toLocaleString()
    };

    setApplications(prev => [newApp, ...prev]);
    // Close sliders/modal
    setAppProduct(null);
    setSelectedProduct(null);
    addLog('success', `รับคำขอยื่นผ่อนไอดีรหัส ${newApp.productCode} สำเร็จโดยคุณ ${newApp.fullName}`);
    
    // Automatically open the payment slip modal to make it user friendly!
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 400);
  };

  const handlePaymentSlipSubmit = (newSlipRaw: Omit<PaymentSlip, 'id' | 'status' | 'submittedAt'> & { paymentType?: string; transRef?: string }) => {
    const newSlip: PaymentSlip = {
      ...newSlipRaw,
      id: newSlipRaw.transRef || 'SLIP-' + Math.floor(100000 + Math.random() * 900000),
      status: 'verified', // Directly set to verified because the EasySlip API verified it successfully!
      submittedAt: new Date().toLocaleString()
    };

    setSlips(prev => [newSlip, ...prev]);

    // Automatically approve contract if down payment is verified
    if (newSlipRaw.paymentType === 'down') {
      setApplications(prev => prev.map(app => {
        if (app.id === newSlipRaw.applicationId) {
          addLog('success', `ยินดีด้วยค่ะ! คลื่นระบบตรวจสอบดาวน์สัญญา ${app.productCode} ผ่านฉลุย ยืนยันอนุมัติสิทธิ์เต็มรูปแบบเรียบร้อย`);
          return { ...app, status: 'approved' as const };
        }
        return app;
      }));
    } else {
      addLog('success', `ชำระเงินค่างวดประจำสัปดาห์ ฿${newSlip.transferAmount.toLocaleString()} ผ่านระบบ EasySlip API สำเร็จเรียบร้อยแล้วค่ะ`);
    }

    addLog('info', `เอกสารใบโอนสลิปเงินฝากยอด ฿${newSlip.transferAmount.toLocaleString()} ได้รับการยืนยันระบบสำเร็จเสร็จสิ้น`);
  };

  // Filtered & Sorted Products List
  const filteredProducts = products.filter(p => {
    const matchesGame = selectedGame === 'all' || p.game === selectedGame;
    
    // Search query matches title/code/description
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.details.some(d => d.value.toLowerCase().includes(searchQuery.toLowerCase()));
                          
    // Platform matches title or details
    let matchesPlat = true;
    if (selectedPlatform === 'mobile') {
      matchesPlat = p.title.toLowerCase().includes('mobile') || p.description.toLowerCase().includes('mobile') || p.details.some(d => d.value.toLowerCase().includes('mobile') || d.value.toLowerCase().includes('konami'));
    } else if (selectedPlatform === 'console') {
      matchesPlat = p.title.toLowerCase().includes('console') || p.title.toLowerCase().includes('playstation') || p.title.toLowerCase().includes('pc') || p.title.toLowerCase().includes('ps5') || p.title.toLowerCase().includes('steam') || p.details.some(d => d.value.toLowerCase().includes('console') || d.value.toLowerCase().includes('ps5'));
    }
    
    // Status matches
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    
    // OVR match (squad strength rating parser)
    let matchesOvrRating = true;
    const strengthDetail = p.details.find(d => d.label.includes('พลัง') || d.label.includes('Strength') || d.label.includes('OVR'));
    if (strengthDetail) {
      const parsedVal = parseInt(strengthDetail.value.replace(/[^0-9]/g, ''), 10);
      if (parsedVal && parsedVal < minOvr) {
        matchesOvrRating = false;
      }
    }
    
    return matchesGame && matchesSearch && matchesPlat && matchesStatus && matchesOvrRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.fullPrice - b.fullPrice;
    if (sortBy === 'price-desc') return b.fullPrice - a.fullPrice;
    if (sortBy === 'down-asc') return a.downPayment - b.downPayment;
    return b.isHot ? 1 : -1;
  });

  return (
    <div className="bg-[#05020c] text-[#f1f5f9] min-h-screen flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Top Navigation bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin}
        userStats={userStats}
        onOpenCreditModal={() => setShowCreditModal(true)}
        isUserLoggedIn={kycUser.isLoggedIn}
        userEmail={kycUser.email}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onLogout={() => {
          setKycUser(prev => ({ 
            ...prev, 
            isLoggedIn: false, 
            status: 'unlogged' 
          }));
          setIsAdmin(false);
          setViewMode('user');
          addLog('info', 'คุณได้ออกจากระบบสมาชิกสำเร็จเเล้ว');
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Container */}
      {viewMode !== 'admin' ? (
        <main className="flex-grow">
          
          {/* HOME TAB VIEW */}
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* Promos/Coupons Bar (แจกโค๊ดแบบในรูป) - Repositioned at the very top (above Hero) with modern elegant design and hover-to-pause capability */}
              <div className="w-full bg-[#05020e] border-b border-purple-950/20 text-white py-2.5 relative shrink-0 select-none overflow-hidden mt-0">
                <div className="w-full flex items-center gap-4">
                  
                  {/* Label Badge with Spinning Classic Soccer Ball */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#ab69ff] to-[#4c10a1] px-4 py-1.5 rounded-r-lg text-xs font-semibold shadow-[0_0_15px_rgba(171,105,255,0.4)] shrink-0 z-10 text-white select-none whitespace-nowrap">
                    <SoccerBallIcon className="w-4 h-4 shrink-0 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
                    <span className="tracking-wide">ดูคูปองแจกฟรี:</span>
                  </div>

                  {/* Infinite Running Marquee Container (Pauses when mouse hovers over it!) */}
                  <div 
                    onClick={() => setMarqueePaused(!marqueePaused)}
                    onMouseEnter={() => setMarqueePaused(true)}
                    onMouseLeave={() => setMarqueePaused(false)}
                    className="w-full flex-grow overflow-hidden relative flex items-center py-1 cursor-pointer"
                    title="เลื่อนเมาส์ชี้ตรงช่องโค้ดเพื่อหยุดชั่วคราว หรือจิ้มปุ่มเพื่อกดคัดลอกรหัสคูปองทันที"
                  >
                    <div 
                      style={{ animationPlayState: marqueePaused ? 'paused' : 'running' }}
                      className="flex gap-4 shrink-0 animate-marquee-coupons"
                    >
                      {[...COUPONS, ...COUPONS, ...COUPONS].map((cp, idx) => {
                        const isCollected = collectedCoupons.includes(cp.code);
                        return (
                          <div 
                            key={`m1-${cp.code}-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isCollected) {
                                collectCoupon(cp.code);
                              }
                            }}
                            className={`group flex items-center gap-3 border px-4 py-1.5 rounded-full transition-all duration-300 shrink-0 ${
                              isCollected 
                                ? 'border-[#1f1444]/40 bg-[#0d0727]/90 hover:bg-[#120a35]/90' 
                                : 'border-[#2d1b54]/40 bg-[#070415]/75 hover:bg-[#11092e] hover:border-purple-500/30'
                            }`}
                          >
                            {isCollected ? (
                              <>
                                <span className="text-[#fecc09] font-black font-sans tracking-wide text-xs sm:text-[13px]">
                                  {cp.code}
                                </span>
                                <span className="text-slate-400 text-[10px] sm:text-[11px] font-sans tracking-wide">
                                  ({cp.desc})
                                </span>
                                <span className="text-slate-300 text-[10px] sm:text-[11px] font-bold font-sans flex items-center gap-0.5 ml-2.5 bg-[#1d1245] px-2 py-0.5 rounded-md border border-[#3f307a] shrink-0">
                                  เก็บแล้ว ✓
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[#fecc09] font-black font-sans tracking-wide text-xs sm:text-[13px]">
                                  {cp.code}
                                </span>
                                <span className="text-slate-300 text-[10px] sm:text-[11px] font-sans tracking-wide">
                                  ({cp.desc})
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    collectCoupon(cp.code);
                                  }}
                                  className="bg-[#3f34fa] hover:bg-[#4d40ff] text-white text-[10px] py-1 px-3 rounded-md font-bold tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0 ml-1.5 shadow-sm"
                                >
                                  <span>กดรับโค้ด</span>
                                  <span className="text-amber-300 text-[10px]">🎟️</span>
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Sibling for seamless infinite loop visual flow */}
                    <div 
                      style={{ animationPlayState: marqueePaused ? 'paused' : 'running' }}
                      className="flex gap-4 shrink-0 animate-marquee-coupons" 
                      aria-hidden="true"
                    >
                      {[...COUPONS, ...COUPONS, ...COUPONS].map((cp, idx) => {
                        const isCollected = collectedCoupons.includes(cp.code);
                        return (
                          <div 
                            key={`m2-${cp.code}-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isCollected) {
                                collectCoupon(cp.code);
                              }
                            }}
                            className={`group flex items-center gap-3 border px-4 py-1.5 rounded-full transition-all duration-300 shrink-0 ${
                              isCollected 
                                ? 'border-[#1f1444]/40 bg-[#0d0727]/90 hover:bg-[#120a35]/90' 
                                : 'border-[#2d1b54]/40 bg-[#070415]/75 hover:bg-[#11092e] hover:border-purple-500/30'
                            }`}
                          >
                            {isCollected ? (
                              <>
                                <span className="text-[#fecc09] font-black font-sans tracking-wide text-xs sm:text-[13px]">
                                  {cp.code}
                                </span>
                                <span className="text-slate-400 text-[10px] sm:text-[11px] font-sans tracking-wide">
                                  ({cp.desc})
                                </span>
                                <span className="text-slate-300 text-[10px] sm:text-[11px] font-bold font-sans flex items-center gap-0.5 ml-2.5 bg-[#1d1245] px-2 py-0.5 rounded-md border border-[#3f307a] shrink-0">
                                  เก็บแล้ว ✓
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[#fecc09] font-black font-sans tracking-wide text-xs sm:text-[13px]">
                                  {cp.code}
                                </span>
                                <span className="text-slate-300 text-[10px] sm:text-[11px] font-sans tracking-wide">
                                  ({cp.desc})
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    collectCoupon(cp.code);
                                  }}
                                  className="bg-[#3f34fa] hover:bg-[#4d40ff] text-white text-[10px] py-1 px-3 rounded-md font-bold tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0 ml-1.5 shadow-sm"
                                >
                                  <span>กดรับโค้ด</span>
                                  <span className="text-amber-300 text-[10px]">🎟️</span>
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
        
                </div>
              </div>

              {/* Slideshow Banner Hero - Rewritten Bento styled */}
              <Hero 
                onSearch={handleOpenSearchOfGame} 
                onExplore={() => {
                  document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                onKycNavigate={() => {
                  setActiveTab('kyc');
                }}
              />

              {/* Guarantees row below the Hero - Redesigned to be ultra-luxury, sleek and integrated */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 mb-5 select-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 border-t border-b border-slate-900/80 bg-[#070415]/30 backdrop-blur-sm rounded-xl px-4 sm:px-6">
                  
                  {/* Item 1 */}
                  <div className="flex items-center gap-2.5 justify-center md:justify-start">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]" />
                    <div className="text-xs sm:text-[13px] leading-relaxed font-sans">
                      <span className="text-slate-100 font-medium">มีสัญญาคู่ฉบับทางกฎหมาย</span>
                      <span className="text-slate-400 font-light ml-1.5">ซื้อตรงความโปร่งใส สูงที่สุด</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-2.5 justify-center">
                    <Trophy className="h-4.5 w-4.5 text-[#f5c53c] shrink-0 filter drop-shadow-[0_0_8px_rgba(245,197,60,0.35)]" />
                    <div className="text-xs sm:text-[13px] leading-relaxed font-sans">
                      <span className="text-slate-100 font-medium">ไอดีพร้อมโอนด่วน</span>
                      <span className="text-slate-400 font-light ml-1.5">มีการ์ดประวัติศาสตร์อัพเดทใหม่ทุกลีก</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-2.5 justify-center md:justify-end">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#a6b6f7] shrink-0 filter drop-shadow-[0_0_8px_rgba(166,182,247,0.35)]" />
                    <div className="text-xs sm:text-[13px] leading-relaxed font-sans">
                      <span className="text-slate-100 font-medium">อัตโนมัติแจ้งสลิป</span>
                      <span className="text-slate-400 font-light ml-1.5">ด้วย API EasySlip สตรีมลิ้งก์เร็ว</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Marketplace Header labels */}
              <div id="catalog-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end justify-between border-b border-slate-800/20 pb-5">
                  <div className="lg:col-span-6 space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-[#0f172a] border border-slate-700/35 px-2.5 py-0.5 rounded-full text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span>คลังอัพเดทล่าสุด</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display">
                      คลังไอดีพรีเมียมพร้อมวางตลาด
                    </h2>
                  </div>
                  <div className="lg:col-span-6 text-left lg:text-right">
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed max-w-xl lg:ml-auto font-sans font-light">
                      พบกับคลังไอดีฟุตบอลที่คัดสรรคุณภาพดี OVR สูงสุด สิทธิในการเชื่อมไอดีตรง ครอบคลุมทั้งมือถือและคอนโซล ปล่อยราคาประหยัด อนุมัติจัดชำระได้ด่วนตลอด 24 ชั่วโมง
                    </p>
                  </div>
                </div>
              </div>

              {/* High-Fidelity Search & Filters Panel (EF Market screen matching) */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left mt-6">
                <div className="bg-[#0c111e]/90 backdrop-blur-md border border-[#1b253b] p-4 rounded-2xl shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
                    
                    {/* Column 1: Search (3 cols) */}
                    <div className="lg:col-span-3 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ค้นหาชื่อไอดี หรือ ค้นหาคีย์ผู้เล่น..."
                        className="w-full bg-[#060a14]/65 border border-[#1e2942] hover:border-slate-700/60 focus:border-indigo-500/70 p-2.5 pl-10.5 rounded-xl text-xs text-slate-100 outline-none font-sans transition-all placeholder:text-slate-500"
                      />
                    </div>

                    {/* Column 2: Game Selector (2 cols) */}
                    <div className="lg:col-span-2 relative text-xs">
                      <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="w-full bg-[#060a14]/65 border border-[#1e2942] p-2.5 px-4 rounded-xl text-slate-200 outline-none appearance-none font-sans cursor-pointer hover:border-slate-700/60 focus:border-indigo-500/70"
                      >
                        <option value="all">🎮 ทุกประเภทเกม</option>
                        <option value="efootball">⚽ eFootball</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Column 3: Platform selector (2 cols) */}
                    <div className="lg:col-span-2 relative text-xs">
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="w-full bg-[#060a14]/65 border border-[#1e2942] p-2.5 px-4 rounded-xl text-slate-200 outline-none appearance-none font-sans cursor-pointer hover:border-slate-700/60 focus:border-indigo-500/70"
                      >
                        <option value="all">📁 ทุกแพลตฟอร์ม</option>
                        <option value="mobile">📱 Mobile (iOS/Android)</option>
                        <option value="console">🎮 PlayStation / PC</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Column 4: Sorting Selector (2 cols) */}
                    <div className="lg:col-span-2 relative text-xs">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-[#060a14]/65 border border-[#1e2942] p-2.5 px-4 rounded-xl text-slate-200 outline-none appearance-none font-sans cursor-pointer hover:border-slate-700/60 focus:border-indigo-500/70"
                      >
                        <option value="hot">🔥 จัดรายการแนะนำ (Hot)</option>
                        <option value="price-asc">💸 ราคา: น้อยไปมาก</option>
                        <option value="price-desc">💰 ราคา: มากไปน้อย</option>
                        <option value="down-asc">🛡️ เงินดาวน์ต่ำสุด</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Column 5: OVR slider selection (3 cols) */}
                    <div className="lg:col-span-3 bg-[#060a14]/65 border border-[#1e2942] p-1.5 px-4 rounded-xl flex flex-col justify-center space-y-0.5">
                      <div className="flex justify-between items-center text-[10px] font-sans font-black text-slate-400">
                        <span>OVR พลังทีม (Strength)</span>
                        <span className="text-indigo-400 font-extrabold">{minOvr}+</span>
                      </div>
                      <input 
                        type="range"
                        min="3000"
                        max="3250"
                        step="10"
                        value={minOvr}
                        onChange={(e) => setMinOvr(parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Dynamic Catalog Grid display */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-left">
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={(prod) => setSelectedProduct(prod)}
                        onApply={handleApplyProcessSetup}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#09051d]/40 border border-purple-500/10 rounded-2xl space-y-3">
                    <span className="text-3xl">🔍</span>
                    <h3 className="text-white font-extrabold text-sm font-sans">ไม่พบรหัสไอดีตรงชิ้นส่วนที่ระบุ</h3>
                    <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                      ไม่พบผลการค้นหาตามฟิลเตอร์ ลองลดระดับค่า OVR หรือพิมพ์ชื่อเมสซี ซีดาน ค้นหาคีย์ใหม่อีกครั้งเพื่อความโปร่งใสค่ะ
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedPlatform('all');
                        setMinOvr(3000);
                        setSelectedStatus('all');
                      }}
                      className="bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-400 font-bold px-4 py-1.5 rounded-xl text-xs transition-colors mt-2 whitespace-nowrap"
                    >
                      รีเซ็ตเงื่อนไขตัวกรองทั้งหมด
                    </button>
                  </div>
                )}
              </section>

              {/* Infographics Timeline: Steps to start */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    ระบบคำขอเริ่มผ่อนง่ายใน 4 ขั้นตอน
                  </h2>
                  <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">
                    ไม่ต้องยื่นสลิปรายเดือน อนุมัติผ่านสัญญาระบบลายเซ็นทันที
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left relative">
                  
                  {/* Step 1 banner */}
                  <div className="bg-[#09051d]/60 border border-purple-500/10 p-5 rounded-2xl relative space-y-3 hover:border-purple-500/35 transition-all">
                    <span className="text-3xl font-extrabold text-purple-500/40 font-mono block">01 /</span>
                    <h3 className="text-white font-bold text-sm">เลือกสรรหาไอดีเกม</h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      หาไอดียอดโปรดที่ชอบ จากระบบจัดของคัดสรร ROV, Free Fire, eFootball มากหน้าหลายตา
                    </p>
                  </div>

                  {/* Step 2 banner */}
                  <div className="bg-[#09051d]/60 border border-purple-500/10 p-5 rounded-2xl relative space-y-3 hover:border-purple-500/35 transition-all">
                    <span className="text-3xl font-extrabold text-purple-500/40 font-mono block">02 /</span>
                    <h3 className="text-white font-bold text-sm">ยื่นข้อมูลและตรวจสอบ</h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      ลงเอกสาร บัตรโปรไฟล์สิทธิ์ และลงชื่อยืนยันด้วยลายมือวาดของคุณลงสัญญารถออนไลน์ให้ถูกต้อง
                    </p>
                  </div>

                  {/* Step 3 banner */}
                  <div className="bg-[#09051d]/60 border border-purple-500/10 p-5 rounded-2xl relative space-y-3 hover:border-purple-500/35 transition-all">
                    <span className="text-3xl font-extrabold text-purple-500/40 font-mono block">03 /</span>
                    <h3 className="text-white font-bold text-sm">ชำระยอดมัดจำเกง</h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      โอนตังประเมินสลิป (Down Payment) ตรวจสลีปด่วนผ่านบริษัท ได้ไอดีเข้าเกมเล่นเป็นคนแรก
                    </p>
                  </div>

                  {/* Step 4 banner */}
                  <div className="bg-[#09051d]/60 border border-purple-500/10 p-5 rounded-2xl relative space-y-3 hover:border-purple-500/35 transition-all">
                    <span className="text-3xl font-extrabold text-purple-500/40 font-mono block">04 /</span>
                    <h3 className="text-white font-bold text-sm">โอนเก็บกวาดรายงวด</h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      ผ่อนสะสมรายสัปดาห์แสนสบายไม่มีด็อกเบี้ยแอบแฝง ผ่อนชัวร์เสร็จสิ้น ยัดสิทธิ์โอนเมลเต็มเจ้าของ
                    </p>
                  </div>

                </div>
              </section>

              {/* Testimonials area */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    ผลตอบรับความมั่นใจของลูกค้าประจำเรา
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    รีวิวจริงไม่มีตัดต่อ มีใบเช็ดเครดิตและบันทึกผู้ชำระยอดงวดสูงสุดสัปดาห์
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TESTIMONIALS.map((review, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#060e26] border border-[#1d2d54]/60 p-5 rounded-2xl text-left space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 font-normal leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/50 pt-2 font-mono text-[11px]">
                        <div>
                          <span className="text-white font-bold block">{review.name}</span>
                          <span className="text-gray-600">ผ่อนเกม: {review.game}</span>
                        </div>
                        <span className="text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security and company trust badges ribbon */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-[#09051d]/60 border border-purple-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl border border-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base">ระบบลงนามสัญญากับบริษัทเป็นลายลักษณ์อักษรถูกต้อง</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-xlLeading">
                        เราคือสื่อกลางค้าไอดีและการผ่อนจดทะเบียนรายยวนถูกต้องตามลิขสิทธิ์ความปลอดภัยสัญญา ทำการบันทึก IP ลายเซ็น เพื่อคุ้มครองระเบียบผู้ดาวน์เล่นเกมก่อนทุกคน มั่นใจไร้แอดมินดึงวุ่นวาย
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2.5 w-full md:w-auto shrink-0 font-mono text-xs">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full md:w-auto bg-[#3f34fa] hover:bg-[#4d40ff] text-white font-bold p-3 px-6 rounded-xl text-center cursor-pointer shadow-[0_0_15px_rgba(63,52,250,0.3)] transition-all"
                    >
                      แจ้งโอน/แจ้งค่างวด
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* SHOP LISTING VIEW */}
          {activeTab === 'shop' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left animate-fadeIn">
              
              {/* Header catalogs */}
              <div id="catalog-anchor">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">ตารางรายการไอดีเกมออนไลน์พร้อมผ่อนทั้งหมด</h1>
                <p className="text-xs text-gray-400 mt-1">เลือกเปรียบเทียบสิทธิ และใช้อัตราสไลด์เครื่องคิดคำนวณงวดหลังเพื่อยื่นสมัครความเหมาะสม</p>
              </div>

              {/* Game types Filters panel row */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {GAMES_FILTER.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => { setSelectedGame(game.id); }}
                    className={`px-4.5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 border duration-150 cursor-pointer ${
                      selectedGame === game.id 
                        ? 'bg-purple-600 border-purple-500 text-white font-black shadow-[0_4px_12px_rgba(139,92,246,0.3)]' 
                        : 'bg-slate-900 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{game.name}</span>
                  </button>
                ))}
              </div>

              {/* Search input and Sort panels */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search query field */}
                <div className="md:col-span-8 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="ป้อนรหัส เช่น 'ROV', 'FF' หรือค้นข้อมูลคุณสมบัติเช่น 'สกิน Kirito', 'ปืนตัน', 'M4 หิมะ'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#070415] border border-purple-950 focus:border-purple-500/50 p-2.5 pl-10.5 rounded-2xl text-xs text-white outline-none"
                  />
                </div>

                {/* Sorting drop dropdown */}
                <div className="md:col-span-4 relative text-xs">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-[#070415] border border-purple-950 p-2.5 px-4.5 rounded-2xl text-white outline-none appearance-none font-sans cursor-pointer focus:border-purple-500/50"
                  >
                    <option value="hot">🔥 จัดรายการสินค้าแนะนำ (Hot Match)</option>
                    <option value="price-asc">💸 มูลค่าเงินสดจริง: น้อยไปถึงมาก</option>
                    <option value="price-desc">💰 มูลค่าเงินสดจริง: มากไปถึงน้อย</option>
                    <option value="down-asc">🛡️ เงินมัดจำกู้งวดแรกต่ำสุด</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Target items Products Grid */}
              {sortedProducts.length === 0 ? (
                <div className="py-24 text-center bg-[#0d0e15] border border-slate-850 rounded-2xl space-y-2">
                  <p className="text-gray-500 text-xs font-mono">ไม่พบรหัสและประเภทผลิตภัณฑ์ตามที่คุณระบุค้นหาขณะนี้</p>
                  <button 
                    onClick={() => { setSelectedGame('all'); setSearchQuery(''); }}
                    className="text-xs text-purple-400 underline font-sans"
                  >
                    รีเซ็ตตัวกรองและหมวดหมู่ทั้งหมด
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {sortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={(prod) => setSelectedProduct(prod)}
                      onApply={handleApplyProcessSetup}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* PAYMENT VIEW (CUSTOMER INSTALLMENT DASHBOARD) */}
          {activeTab === 'payment' && (
            <div className="max-w-5xl mx-auto px-4 py-8 text-left animate-fadeIn space-y-8 pb-16">
              
              {/* Dashboard Title Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold">INSTALLMENTS & CUSTOMER PORTAL</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight animate-slideDown">แดชบอร์ดผ่อนชำระสะสมของลูกค้า</h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    ตรวจสอบวงเงิน รายละเอียดตารางผ่อนชำระค่างวด และอัปเดตสลิปเงินฝาก EasySlip 24 ชั่วโมง
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-950 p-2 border border-slate-900 rounded-xl max-w-xs md:max-w-none">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] text-slate-400 font-mono">สถานะระบบ: เชื่อม API สมบูรณ์</span>
                </div>
              </div>

              {/* PAYMENT ALERT BAR: Urgent Due Date Warning within 2 Days */}
              {urgentDueAlerts.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl border-2 border-rose-500/30 bg-gradient-to-r from-rose-950/45 via-[#0c0a24]/95 to-rose-950/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden animate-pulse">
                  <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 text-left">
                      <div className="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-450 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        <AlertCircle className="h-6 w-6 text-rose-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest bg-rose-500 text-white shadow-sm font-sans">
                            URGENT ALERT ⚠️
                          </span>
                          <span className="text-white text-sm sm:text-base font-black">คุณมีรายการค่างวดที่ใกล้ครบกำหนดชำระเร็วๆ นี้ (ภายใน 2 วัน)</span>
                        </div>
                        <p className="text-xs text-rose-300 font-sans leading-relaxed">
                          กรุณาแจ้งหลักฐานการชำระเงินหรือส่งสลิปโอนค่างวดผ่านระบบ EasySlip ป้องกันระงับการสิทธิ์เข้าเล่นหรือถูกเปลี่ยนรหัสผ่านโดยอัตโนมัติค่ะ 🔒
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-rose-500/15 pt-4 space-y-3">
                    {urgentDueAlerts.map(({ app, dueDate, daysLeft, weeklyAmount }) => (
                      <div 
                        key={app.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-rose-950/20 border border-rose-500/20 hover:border-rose-400/40 rounded-xl transition-all"
                      >
                        <div className="text-left font-sans space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-white">
                            <span className="bg-[#150a18] border border-rose-500/30 text-rose-400 font-mono text-[10px] px-2 py-0.5 rounded-md font-black uppercase">
                              {app.productCode}
                            </span>
                            <span className="truncate max-w-[200px] sm:max-w-xs">{app.productTitle}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[11px] text-rose-300 flex-wrap font-sans">
                            <span className="flex items-center gap-1">
                              <Coins className="h-3.5 w-3.5 text-rose-450" /> 
                              <span>ค่างวดที่ต้องจ่าย: <strong className="text-white font-mono">฿{weeklyAmount.toLocaleString()}</strong></span>
                            </span>
                            <span className="text-rose-500">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-rose-455" />
                              <span>ครบกำหนด: <strong className="text-white">{dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</strong></span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 shrink-0 sm:self-center mt-2 sm:mt-0">
                          <span className="text-xs font-black px-3 py-1 rounded bg-rose-500/15 border border-rose-500/45 text-rose-400 font-mono">
                            {daysLeft <= 0 ? '⚠️ เกินกำหนดแล้ววันนี้ค่ะ !' : daysLeft === 1 ? '⏳ เหลือ 1 วันด่วนมาก' : '⏳ เหลือเวลาอีก 2 วัน'}
                          </span>
                          
                          <button
                            onClick={() => setShowPaymentModal({
                              defaultAppId: app.id,
                              defaultPaymentType: 'installment'
                            })}
                            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black rounded-lg text-xs transition-all shadow-[0_2px_8px_rgba(239,68,68,0.25)] flex items-center gap-1 cursor-pointer"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>สแกนสลิปโอนค่างวด</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Welcome Banner matching provided mockup */}
              <div className="p-6 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-[#0c0a24]/90 to-[#060814]/95 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 -translate-y-6 translate-x-6 h-36 w-36 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700"></div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
                  
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="h-14 w-14 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      <Users2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1 text-left">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-white font-black text-lg tracking-wide font-mono">{kycUser.email}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-gradient-to-r from-purple-500 to-indigo-600 border border-purple-400/30 text-white uppercase shadow-md">
                          CUSTOMER
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">ยินดีต้อนรับสู่พอร์ทัลตรวจเช็คสัญญาสิทธิและจ่ายค่างวดผ่อนชำระไอดีเกมของคุณ สะดวก รวดเร็ว สแกนสลิปออโต้ 24 ชม. ค่ะ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                
                <div className="bg-[#050814] border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/20 transition-all shadow-md text-left flex flex-col justify-between min-h-[110px]">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] font-extrabold tracking-wider font-sans uppercase">
                    <span>ยอดวงเงินดาวน์ผ่อนที่คงเหลือ</span>
                    <Coins className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-white font-mono animate-pulse">
                      ฿{(Math.max(0, 50000 - userApplications.filter(a => a.status !== 'rejected').reduce((sum, a) => sum + a.productPrice, 0))).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">จากเครดิตสะสมสูงสุด ฿50,000</p>
                  </div>
                </div>

                <div className="bg-[#050814] border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/20 transition-all shadow-md text-left flex flex-col justify-between min-h-[110px]">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] font-extrabold tracking-wider font-sans uppercase">
                    <span>สัญญาที่ผ่านอนุมัติ (Active)</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-white font-mono">
                      {userApplications.filter(a => a.status === 'approved').length} สัญญา
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1 font-sans">สามารถเปลี่ยนรหัสผ่านเพื่อเข้าเล่นได้</p>
                  </div>
                </div>

                <div className="bg-[#050814] border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/20 transition-all shadow-md text-left flex flex-col justify-between min-h-[110px]">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] font-extrabold tracking-wider font-sans uppercase">
                    <span>คะเเนนความน่าเชื่อถือ</span>
                    <Award className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-yellow-400 font-mono">
                      {userStats.creditScore} CG
                    </span>
                    <p className="text-[10px] text-emerald-405 font-sans mt-1">✓ พันธมิตรชั้นดี ประวัติดีมาก</p>
                  </div>
                </div>

                <div className="bg-[#050814] border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/20 transition-all shadow-md text-left flex flex-col justify-between min-h-[110px]">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] font-extrabold tracking-wider font-sans uppercase">
                    <span>ยอดจ่ายดาวน์ผ่อนรวมสะสม</span>
                    <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ฿{(
                        userApplications
                          .filter(a => a.status === 'approved')
                          .reduce((sum, a) => sum + a.downPaymentAmount, 0) + 
                        userSlips
                          .filter(s => s.status === 'verified')
                          .reduce((sum, s) => sum + s.transferAmount, 0)
                      ).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">รวมมัดจำดาวน์และค่างวดสัปดาห์</p>
                  </div>
                </div>

              </div>

              {/* Core Dashboard Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1 & 2: Active Contracts List */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Interactive Thai Payment Calendar Card */}
                  <div className="bg-[#050814] border border-slate-900 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl text-left font-sans">
                    {/* Dynamic Calendar Processing */}
                    {(() => {
                      const hasActive = approvedUserApplications.length > 0;

                      // Calculate all events memoized locally inside render
                      const events = [];
                      if (hasActive) {
                        approvedUserApplications.forEach(app => {
                          const baseDate = parseAppDate(app.submittedAt);
                          const appSlips = userSlips.filter(s => s.applicationId === app.id);
                          const verifiedSlipsCount = appSlips.filter(s => s.status === 'verified').length;

                          // Only push weekly installments (no down payments)
                          for (let w = 1; w <= app.installmentWeeks; w++) {
                            const dueDate = new Date(baseDate.getTime() + (w * 7 * 24 * 60 * 60 * 1000));
                            const isPaid = w <= verifiedSlipsCount;
                            events.push({
                              id: `${app.id}-w-${w}`,
                              applicationId: app.id,
                              productCode: app.productCode,
                              productTitle: app.productTitle,
                              index: w,
                              amount: app.weeklyInstallmentAmount,
                              dueDate: dueDate,
                              isPaid,
                              type: 'installment'
                            });
                          }
                        });
                      } else {
                        // Synthesize beautifully spaced demo schedules for preview if no active approved contract
                        // (Only installments, no down payments as requested!)
                        for (let w = 1; w <= 4; w++) {
                          const dueDate = new Date(calendarYear, calendarMonth, w * 7 - 2);
                          events.push({
                            id: `demo-installment-w-${w}`,
                            applicationId: 'demo-app-01',
                            productCode: 'EFC-DEMO',
                            productTitle: 'ID FC Mobile โดนใจสายดวลเกรดเอ (จำลอง)',
                            index: w,
                            amount: 1500,
                            dueDate: dueDate,
                            isPaid: w <= 2, // First two are paid, last two are pending
                            type: 'installment',
                            isDemo: true
                          });
                        }
                      }

                      // Let's calculate the total for currently selected month and year
                      const currentMonthEvents = events.filter(e => {
                        return e.dueDate.getFullYear() === calendarYear && e.dueDate.getMonth() === calendarMonth;
                      });
                      const monthlyTotalAmount = currentMonthEvents.reduce((sum, e) => sum + e.amount, 0);
                      const monthlyTotalCount = currentMonthEvents.length;

                      // Create calendar dates grid
                      const firstDayIdx = new Date(calendarYear, calendarMonth, 1).getDay(); // Sun = 0 ...
                      const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                      const prevMonthTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();

                      // Header days of the week in Thai
                      const TH_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

                      const gridCells = [];

                      // 1. Padding days from prev month
                      for (let i = firstDayIdx - 1; i >= 0; i--) {
                        gridCells.push({
                          day: prevMonthTotalDays - i,
                          isCurrentMonth: false,
                          date: new Date(calendarYear, calendarMonth - 1, prevMonthTotalDays - i)
                        });
                      }

                      // 2. Days from current month
                      for (let d = 1; d <= totalDays; d++) {
                        gridCells.push({
                          day: d,
                          isCurrentMonth: true,
                          date: new Date(calendarYear, calendarMonth, d)
                        });
                      }

                      // 3. Padding days of next month to complete 42 cells (6 rows)
                      const remaining = 42 - gridCells.length;
                      for (let d = 1; d <= remaining; d++) {
                        gridCells.push({
                          day: d,
                          isCurrentMonth: false,
                          date: new Date(calendarYear, calendarMonth + 1, d)
                        });
                      }

                      // Check is Same Day helper
                      const isSameDay = (d1: Date, d2: Date) => {
                        return d1.getFullYear() === d2.getFullYear() &&
                               d1.getMonth() === d2.getMonth() &&
                               d1.getDate() === d2.getDate();
                      };

                      return (
                        <div className="space-y-4">
                          {/* Calendar Custom Header Bar */}
                          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#0a0c16] border border-[#1b1c2a] rounded-xl p-3.5 shadow-sm">
                            {/* Left side: Month navigator */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCalendarMonth(m => {
                                    if (m === 0) {
                                      setCalendarYear(y => y - 1);
                                      return 11;
                                    }
                                    return m - 1;
                                  });
                                }}
                                className="h-8 px-2.5 bg-[#111322] border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer text-slate-300 font-bold text-xs"
                              >
                                &lt;
                              </button>
                              <span className="text-xs font-black text-white font-sans min-w-[110px] text-center">
                                {THAI_MONTH_NAMES[calendarMonth]} {calendarYear + 543}
                              </span>
                              <button
                                onClick={() => {
                                  setCalendarMonth(m => {
                                    if (m === 11) {
                                      setCalendarYear(y => y + 1);
                                      return 0;
                                    }
                                    return m + 1;
                                  });
                                }}
                                className="h-8 px-2.5 bg-[#111322] border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer text-slate-300 font-bold text-xs"
                              >
                                &gt;
                              </button>
                              <button
                                onClick={() => {
                                  const today = new Date();
                                  setCalendarMonth(today.getMonth());
                                  setCalendarYear(today.getFullYear());
                                }}
                                className="h-8 px-2.5 bg-indigo-600/20 border border-indigo-550/30 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                วันนี้
                              </button>
                            </div>

                            {/* Middle: Legends mimicking mockup circles */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-sans">
                              <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]"></span>
                                มีกำหนดชำระปกติ
                              </span>
                              <span className="flex items-center gap-1.5 text-rose-450">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"></span>
                                เกินกำหนด (Overdue)
                              </span>
                            </div>

                            {/* Right: Monthly Total Pill in mockup design */}
                            <div className="bg-[#0e1022] border border-[#23253b] rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold">
                              <span className="text-slate-400">📅 ยอดชำระรวมเดือนนี้:</span>
                              <span className="text-emerald-400 font-black font-mono">
                                {monthlyTotalAmount.toLocaleString()} ฿
                              </span>
                              <span className="text-slate-500 text-[10px] font-sans">
                                ({monthlyTotalCount} รายการ)
                              </span>
                            </div>
                          </div>

                          {/* Calendar Grid Container with individual cell gaps */}
                          <div className="border border-slate-900 rounded-xl overflow-hidden bg-[#04050a] shadow-inner">
                            
                            {/* Weekday indicators with colors matching mockup */}
                            <div className="grid grid-cols-7 bg-[#0b0c16] border-b border-[#1b1c2a] text-center py-3">
                              {TH_DAYS.map((dayName, idx) => (
                                <span 
                                  key={idx} 
                                  className={`text-[11px] font-extrabold font-sans uppercase tracking-wider ${
                                    idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-cyan-400' : 'text-slate-200'
                                  }`}
                                >
                                  {
                                    dayName === 'อา.' ? 'อาทิตย์' :
                                    dayName === 'จ.' ? 'จันทร์' :
                                    dayName === 'อ.' ? 'อังคาร' :
                                    dayName === 'พ.' ? 'พุธ' :
                                    dayName === 'พฤ.' ? 'พฤหัสฯ' :
                                    dayName === 'ศ.' ? 'ศุกร์' : 'เสาร์'
                                  }
                                </span>
                              ))}
                            </div>

                            {/* Date Cells Grid with gaps and individual cell boundaries */}
                            <div className="grid grid-cols-7 gap-1.5 p-1.5 bg-[#04050a]">
                              {gridCells.map((cell, idx) => {
                                const dayEvents = events.filter(e => isSameDay(e.dueDate, cell.date));
                                const isToday = isSameDay(new Date(), cell.date);

                                // Check if this cell is an active current month cell with urgent or warning events
                                const cellClass = (() => {
                                  const base = `min-h-[105px] sm:min-h-[115px] p-2 flex flex-col justify-between transition-all duration-300 rounded-xl border relative ${
                                    cell.isCurrentMonth 
                                      ? 'bg-[#05060f] border-[#181a2e] hover:bg-[#080b18] hover:border-[#252844] cursor-pointer' 
                                      : 'bg-[#030408]/40 border-slate-950/20 opacity-20 select-none pointer-events-none'
                                  }`;
                                  
                                  if (!cell.isCurrentMonth) return base;

                                  let hasUrgent = false;
                                  let hasWarning = false;

                                  dayEvents.forEach(e => {
                                    if (!e.isPaid) {
                                      const tDiff = e.dueDate.getTime() - Date.now();
                                      const dLeft = Math.ceil(tDiff / (1000 * 60 * 60 * 24));
                                      if (dLeft <= 0) {
                                        hasUrgent = true;
                                      } else if (dLeft <= 2) {
                                        hasWarning = true;
                                      }
                                    }
                                  });

                                  if (hasUrgent) {
                                    return `${base} border-rose-500/40 bg-[#16060c] shadow-[0_0_10px_rgba(239,68,68,0.1)]`;
                                  }
                                  if (hasWarning) {
                                    return `${base} border-amber-500/40 bg-[#150e04] shadow-[0_0_8px_rgba(245,158,11,0.08)]`;
                                  }
                                  if (isToday) {
                                    return `${base} border-cyan-500/50 bg-[#061221] shadow-[0_0_8px_rgba(6,182,212,0.15)]`;
                                  }
                                  return base;
                                })();

                                return (
                                  <div key={idx} className={cellClass}>
                                    
                                    {/* Day Number and Quantity badge */}
                                    <div className="flex items-center justify-between">
                                      <span className={`text-[12px] font-mono font-black rounded px-1 min-w-[18px] text-center ${
                                        isToday 
                                          ? 'text-cyan-400 font-extrabold font-mono' 
                                          : cell.isCurrentMonth ? 'text-slate-300' : 'text-slate-600'
                                      }`}>
                                        {cell.day}
                                      </span>
                                      {dayEvents.length > 1 && (
                                        <span className="bg-[#5c3db6]/30 border border-[#5c3db6]/50 text-indigo-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                          {dayEvents.length} คน
                                        </span>
                                      )}
                                    </div>

                                    {/* Embed Due Amounts & Event Blocks directly as requested by layout mockup */}
                                    <div className="space-y-1 mt-1.5">
                                      {dayEvents.map(evt => {
                                        const tDiff = evt.dueDate.getTime() - Date.now();
                                        const daysLeft = Math.ceil(tDiff / (1000 * 60 * 60 * 24));
                                        
                                        let eventStyleClass = "";
                                        let badgeColorClass = "";
                                        let dotColorClass = "";

                                        if (evt.isPaid) {
                                          eventStyleClass = "bg-[#06140e]/95 border border-emerald-500/25 text-emerald-400 hover:border-emerald-400 p-1.5 rounded-lg";
                                          badgeColorClass = "text-emerald-400";
                                          dotColorClass = "bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]";
                                        } else if (daysLeft <= 0) {
                                          eventStyleClass = "bg-[#18050c]/95 border border-rose-500/35 text-rose-300 hover:border-rose-400 p-1.5 rounded-lg animate-pulse";
                                          badgeColorClass = "text-rose-400 font-extrabold";
                                          dotColorClass = "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-ping";
                                        } else if (daysLeft <= 2) {
                                          eventStyleClass = "bg-[#150d03]/95 border border-amber-500/30 text-amber-300 hover:border-amber-400 p-1.5 rounded-lg";
                                          badgeColorClass = "text-amber-400 font-extrabold";
                                          dotColorClass = "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]";
                                        } else {
                                          eventStyleClass = "bg-[#05081c]/95 border border-[#1d1f3e] text-indigo-300 hover:border-[#383b74] p-1.5 rounded-lg";
                                          badgeColorClass = "text-[#818cf8]";
                                          dotColorClass = "bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]";
                                        }

                                        // Customer Name corresponding to contract app full name (defaults to current profile name)
                                        const customerName = kycUser.fullName || "ศิริพร กอบขุนทด";

                                        return (
                                          <div
                                            key={evt.id}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (evt.isPaid) {
                                                setToastMessage(`ค่างวดสัญญาสิทธิ ${evt.productCode} เป็นเงิน ฿${evt.amount.toLocaleString()} ชำระเรียบร้อยสมบูรณ์แล้วค่ะ ✨`);
                                                setTimeout(() => setToastMessage(null), 3500);
                                              } else {
                                                if (evt.isDemo) {
                                                  setToastMessage("💡 นี่คือค่างวดสาธิต (Demo) เพื่อรีวิวตารางล่วงหน้า");
                                                  setTimeout(() => setToastMessage(null), 3000);
                                                } else {
                                                  setShowPaymentModal({
                                                    defaultAppId: evt.applicationId,
                                                    defaultPaymentType: evt.type
                                                  });
                                                }
                                              }
                                            }}
                                            className={`text-[10px] font-sans flex flex-col gap-0.5 text-left transition-all cursor-pointer ${eventStyleClass}`}
                                          >
                                            <div className="text-gray-400 truncate font-semibold text-[9.5px] leading-tight flex items-center gap-1">
                                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColorClass} shrink-0`}></span>
                                              <span className="truncate">{customerName}</span>
                                            </div>
                                            <div className="font-extrabold flex items-center justify-between mt-0.5 leading-none">
                                              <span className="text-white text-[11px] font-black">{evt.amount.toLocaleString()} ฿</span>
                                              <span className={`text-[8.5px] font-mono font-bold select-none px-1 rounded bg-slate-950/40 border border-[#1e203f]/30 ${badgeColorClass}`}>{evt.productCode}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Quick Summary legend under the calendar */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#05060b] p-3 rounded-xl border border-slate-900 text-xs">
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
                              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-500/50"></span>
                                ชำระแล้ว (Paid)
                              </span>
                              <span className="flex items-center gap-1 text-indigo-300 font-bold">
                                <span className="inline-block w-2.5 h-2.5 rounded bg-[#05081c] border border-[#1d1f3e]"></span>
                                รอชำระปกติ (Pending)
                              </span>
                              <span className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                                <span className="inline-block w-2.5 h-2.5 rounded bg-[#150d03] border border-amber-500/30"></span>
                                เตือนล่วงหน้า 1-2 วัน (Warning)
                              </span>
                              <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                                <span className="inline-block w-2.5 h-2.5 rounded bg-[#18050c] border border-rose-500/35"></span>
                                ครบกำหนด/ค้างส่ง (Urgent)
                              </span>
                            </div>

                            <span className="text-[10px] text-gray-500 font-mono">
                              {!hasActive ? '• ข้อมูลความปลอดภัย: จำลองตารางชำระเพื่อพรีวิวบอร์ด' : '• ข้อมูลของคุณ (Live)'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>


                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-indigo-400" /> 
                      <span>รายละเอียดสัญญาและบัตรคิวผ่อนค่างวดของคุณ ({approvedUserApplications.length})</span>
                    </h3>
                  </div>

                  {approvedUserApplications.length === 0 ? (
                    <div className="bg-[#05060a] border border-slate-900 rounded-2xl p-10 text-center space-y-5">
                      <div className="h-16 w-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                        <SoccerBallIcon className="h-8 w-8 text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold text-sm">ไม่พบเอกสารสัญญาหรือประวัติการผ่อนซื้อ</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                          คุณสามารถร่วมทำสัญญาเช่าซื้อสิทธิ์ผ่อนไอดีเกมพรีเมียมได้อย่างรวดเร็ว อนุมัติวงเงินสูงสุด 50,000 บาทภายใน 5-15 นาทีค่ะ
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => setActiveTab('shop')}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                        >
                          เลือกไอดีเกมเพื่อเริ่มการผ่อนชำระ 🎮
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {approvedUserApplications.map((app) => {
                        // Find matched product to display image
                        const matchedProduct = DEFAULT_PRODUCTS.find(p => p.id === app.productId);
                        const productImage = matchedProduct?.images[0] || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&q=80';
                        
                        // Calculate verified payments count for progress
                        const applicationSlips = userSlips.filter(s => s.applicationId === app.id);
                        const verifiedSlipsCount = applicationSlips.filter(s => s.status === 'verified').length;
                        const pendingSlipsCount = applicationSlips.filter(s => s.status === 'pending').length;
                        
                        // Progress weeks
                        const progressPercent = Math.min(100, Math.round((verifiedSlipsCount / app.installmentWeeks) * 100));
                        
                        // Remaining balance
                        const totalCommitted = app.productPrice;
                        const paidSoFar = app.downPaymentAmount + (verifiedSlipsCount * app.weeklyInstallmentAmount);
                        const remainingToPay = Math.max(0, totalCommitted - paidSoFar);

                        const isContractExpanded = viewingContractId === app.id;

                        return (
                          <div 
                            key={app.id} 
                            className="bg-[#050814] border border-slate-900 hover:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md relative"
                          >
                            
                            {/* Product banner inside card */}
                            <div className="p-5 flex flex-col sm:flex-row gap-5 border-b border-slate-950 bg-slate-950/40">
                              
                              {/* Thumbnail image with safety stamp */}
                              <div className="w-full sm:w-28 h-28 sm:h-20 rounded-xl overflow-hidden relative shrink-0 border border-slate-800">
                                <img 
                                  src={productImage} 
                                  alt={app.productTitle} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-1.5">
                                  <span className="text-[8px] font-mono font-bold bg-indigo-600/90 text-white px-1.5 py-0.5 rounded uppercase">
                                    {app.productCode}
                                  </span>
                                </div>
                              </div>

                              {/* Title details */}
                              <div className="flex-grow space-y-1 text-left">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase ${
                                    app.status === 'approved' ? 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-400' :
                                    app.status === 'rejected' ? 'bg-red-500/10 border border-red-400/20 text-red-400' :
                                    'bg-amber-500/10 border border-amber-400/20 text-amber-400'
                                  }`}>
                                    {app.status === 'approved' ? '✓ ผ่อนชำระอยู่ (Paying)' :
                                     app.status === 'rejected' ? '❌ ปฏิเสธ (Rejected)' :
                                     '⏳ รออนุมัติ (Pending)'}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-mono">วันที่ยื่น: {app.submittedAt.split(' ')[0]}</span>
                                </div>
                                <h4 className="text-white font-extrabold text-sm sm:text-base tracking-tight leading-snug line-clamp-1 sm:line-clamp-2">
                                  {app.productTitle}
                                </h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                                  <span>ราคาสัญญา: <strong className="text-white">฿{app.productPrice.toLocaleString()}</strong></span>
                                  <span className="text-slate-600">|</span>
                                  <span>มัดจำดาวน์คลัง: <strong className="text-white">฿{app.downPaymentAmount.toLocaleString()}</strong></span>
                                </div>
                              </div>

                            </div>

                            {/* Center body: Timeline and Progress */}
                            <div className="p-5 space-y-4 text-xs font-sans">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                <div className="space-y-1.5 text-left">
                                  <ContractProgressBar 
                                    verifiedSlipsCount={verifiedSlipsCount} 
                                    installmentWeeks={app.installmentWeeks} 
                                  />

                                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                                    <span>ยอดชำระแล้ว: ฿{paidSoFar.toLocaleString()}</span>
                                    <span>คงเหลือ: ฿{remainingToPay.toLocaleString()}</span>
                                  </div>
                                </div>

                                <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between gap-3 text-[11px] text-slate-400">
                                  <div className="space-y-0.5 text-left">
                                    <span className="text-gray-500 block text-[9px] font-mono uppercase tracking-wider">ค่างวดผ่อนสะสมรายสัปดาห์</span>
                                    <span className="text-indigo-400 font-black text-sm">฿{app.weeklyInstallmentAmount}</span>
                                    <span className="text-slate-500 block text-[9px]">ชำระทุก 7 วันผ่าน EasySlip เท่านั้น</span>
                                  </div>
                                  <div className="text-right space-y-1">
                                    {app.status === 'approved' ? (
                                      <>
                                        <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 font-mono text-[9px] font-extrabold uppercase">
                                          ข้อมูลไอดีพร้อมเล่น
                                        </span>
                                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">รับรหัสผ่านไลน์เจ้าสิทธิ์</p>
                                      </>
                                    ) : (
                                      <>
                                        <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-500 font-mono text-[9px] font-extrabold uppercase">
                                          รอสลักสัญญา
                                        </span>
                                        <p className="text-[10px] text-slate-500 mt-0.5">อนุมัติเร็ว 5-15 นาที</p>
                                      </>
                                    )}
                                  </div>
                                </div>

                              </div>

                              {/* Timeline checkpoints */}
                              <div className="bg-slate-950/20 border border-slate-900/60 p-3 rounded-xl">
                                <div className="grid grid-cols-4 gap-2 text-center text-[9px] sm:text-[10px] font-mono">
                                  
                                  <div className="flex flex-col items-center space-y-1 text-emerald-400">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center text-white scale-110 shadow-sm shadow-emerald-500/20">
                                      <Check className="h-1.5 w-1.5" />
                                    </div>
                                    <span className="font-bold">1. ยื่นสัญญา</span>
                                  </div>

                                  <div className={`flex flex-col items-center space-y-1 ${
                                    app.status === 'approved' ? 'text-emerald-400' : 'text-slate-500'
                                  }`}>
                                    <div className={`h-3 w-3 rounded-full border flex items-center justify-center text-white ${
                                      app.status === 'approved' ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-sm' : 'bg-slate-900 border-slate-700'
                                    }`}>
                                      {app.status === 'approved' ? <Check className="h-1.5 w-1.5" /> : null}
                                    </div>
                                    <span className="font-bold">2. ตรวจผ่าน</span>
                                  </div>

                                  <div className={`flex flex-col items-center space-y-1 ${
                                    app.status === 'approved' ? 'text-emerald-400' : 'text-slate-500'
                                  }`}>
                                    <div className={`h-3 w-3 rounded-full border flex items-center justify-center text-white ${
                                      app.status === 'approved' ? 'bg-emerald-500 border-emerald-400 scale-110' : 'bg-slate-900 border-slate-700'
                                    }`}>
                                      {app.status === 'approved' ? <Check className="h-1.5 w-1.5" /> : null}
                                    </div>
                                    <span className="font-bold">3. คิวโอนสิทธิ์</span>
                                  </div>

                                  <div className={`flex flex-col items-center space-y-1 ${
                                    progressPercent >= 100 ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-slate-500'
                                  }`}>
                                    <div className={`h-3 w-3 rounded-full border flex items-center justify-center text-white ${
                                      progressPercent >= 100 ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-900 border-slate-700'
                                    }`}>
                                      {progressPercent >= 100 ? <Check className="h-1.5 w-1.5" /> : null}
                                    </div>
                                    <span className="font-bold">4. ผ่อนสำเร็จ</span>
                                  </div>

                                </div>
                              </div>

                              {/* Interactive Action buttons for this contract card */}
                              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-900/60 gap-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setViewingContractId(isContractExpanded ? null : app.id)}
                                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 text-indigo-400" />
                                    <span>{isContractExpanded ? 'ซ่อนหนังสือรับรอง' : 'ดูสำเนาสัญญาสิทธิ์'}</span>
                                  </button>
                                  
                                  {pendingSlipsCount > 0 && (
                                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 animate-pulse flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      รอตรวจสอบสลิป ({pendingSlipsCount})
                                    </span>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      // pre-opens standard report slips modal
                                      setShowPaymentModal(true);
                                    }}
                                    className="px-4 py-2 bg-[#05112e] hover:bg-indigo-900 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <CreditCard className="h-4 w-4 text-cyan-400" />
                                    <span>แจ้งส่งสลิปเพื่อตัดงวด</span>
                                  </button>
                                </div>
                              </div>

                            </div>

                            {/* EXPANDABLE SIGNATURE CONTRACT PREVIEW */}
                            {isContractExpanded && (
                              <div className="border-t border-slate-900 bg-slate-950/80 p-5 font-sans space-y-4 text-left border-dashed animate-fadeIn text-xs">
                                <div className="border-b border-slate-900 pb-2 mb-2 flex justify-between items-center">
                                  <span className="text-white font-extrabold text-xs uppercase font-mono text-cyan-400 tracking-wider">
                                    หนังสือสัญญาซื้อขายเช่าซื้อสิทธิ์ไอดีเกมออนไลน์ (ฉบับตรวจสอบสิทธิ์)
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">ID สัญญา: EFC-CTR-{app.id.substring(4)}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-300 leading-relaxed font-mono">
                                  <div className="space-y-2 bg-slate-900/30 p-3 rounded-lg border border-slate-900">
                                    <p className="text-gray-500 block text-[10px] font-sans">ข้อมูลฝ่ายผู้เช่าซื้อผ่อนค่างวด:</p>
                                    <div>• ชื่อผู้รับสิทธิ์สัญญากลาง: <strong>{app.fullName}</strong></div>
                                    <div>• อายุ: <strong>{app.age} ปีบริบูรณ์</strong></div>
                                    <div>• รหัสประชาชน: <strong>{app.nationalId.substring(0, 6)}--•••••-{app.nationalId.slice(-1)}</strong></div>
                                    <div>• ลิงก์เฟสบุ๊คยืนยันตัวตน: <a href="#" className="text-indigo-400 underline">{app.facebook}</a></div>
                                    <div>• โทรศัพท์ที่รหัสผ่าน OTP: <strong>{app.phone}</strong></div>
                                  </div>

                                  <div className="space-y-2 bg-slate-900/30 p-3 rounded-lg border border-slate-900 relative">
                                    <p className="text-gray-500 block text-[10px] font-sans">การหลักฐานทางคลัง & ลายเซ็นต์ลายมือ:</p>
                                    <div className="mt-1 bg-slate-950 p-2 rounded border border-slate-900 text-center relative h-24 flex flex-col justify-center items-center">
                                      {app.signatureData ? (
                                        <img 
                                          src={app.signatureData} 
                                          alt="signature" 
                                          className="max-h-20 object-contain max-w-[180px] invert brightness-200 hue-rotate-180" 
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="text-slate-500 text-[10px] select-none font-sans">
                                          (ลงลายมือวิเคราะห์เรียบร้อย)
                                        </div>
                                      )}
                                      <span className="absolute bottom-1 right-2 text-[7px] text-gray-600 font-mono">
                                        IP Logged • Verified 24h
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-normal text-center mt-1">
                                      สัญญานี้ได้รับการคุ้มครองด้วย PDPA พ.ร.บ. คลังสิทธิ์ดิจิทัล ยอมรับค่างวดแบบโอนตรง EasySlip
                                    </p>
                                  </div>
                                </div>

                                <div className="text-[10px] text-gray-500 leading-normal bg-[#040e24]/40 p-3 rounded-lg border border-indigo-950 font-sans space-y-1">
                                  <h5 className="font-extrabold text-slate-300">ระเบียบสิทธิ์ความปลอดภัยสัญญาเพิ่มเติม:</h5>
                                  <p>
                                    1. เมื่อท่านชำระค่างวดยอดดาวน์งวดแรกเรียบร้อย ท่านจะได้รับข้อมูลล็อกอินไอดีเพื่อเชื่อมต่อและเล่นเพื่อสะสมประวัติก่อน แอดมินจะดูแลเปลี่ยนเครื่องให้อัตโนมัติในช่องทางแชท
                                  </p>
                                  <p>
                                    2. ห้ามเปลี่ยนเมลสำรองหรือพยายามดึงกลับในรูปแบบอื่นๆ ระหว่างการร่วมสัญญา หากทำผิดกติกาประเมินจะยกเลิกสัญญาและดึงลิขสิทธิ์คืนทันทีอย่างไร้ดอกเบี้ย
                                  </p>
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                                  <span>สถานภาพการจัดส่ง: <strong className="text-white">เชื่อมต่อระบบคลังสิทธิ์</strong></span>
                                  <button 
                                    onClick={() => alert('ดาวน์โหลดแบบร่างเอกสาร PDF สัญญากลาง EFCPA สำเร็จแล้ว')}
                                    className="px-3 py-1 bg-indigo-900/30 border border-indigo-400/20 hover:bg-indigo-950 text-indigo-400 flex items-center gap-1 rounded transition-colors cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>ดาวน์โหลดหนังสือสัญญา (.PDF)</span>
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Column 3: Payment History Slips Gallery & Bank Copy block */}
                <div className="space-y-6">
                  
                  {/* Monthly Payment Overview Card */}
                  <div className="bg-[#0b0c16]/90 border-2 border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-left font-sans animate-scaleUp">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-indigo-400" />
                        <span>สรุปรอบชำระค่างวดประจำงวด</span>
                      </h4>
                      <span className="bg-indigo-600/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold animate-pulse">
                        Auto-Synced
                      </span>
                    </div>

                    {(() => {
                      const activeApps = userApplications.filter(a => a.status === 'approved');
                      
                      // Calculate active unpaid installments
                      const unpaidContracts = activeApps.filter(app => {
                        const verifiedCount = userSlips.filter(s => s.applicationId === app.id && s.status === 'verified').length;
                        return verifiedCount < app.installmentWeeks;
                      });

                      const totalCurrentDue = unpaidContracts.reduce((sum, app) => sum + app.weeklyInstallmentAmount, 0);

                      // Helper to compute dynamic due date
                      const getNextDueDate = (submittedAt: string, verifiedCount: number) => {
                        let baseDate = new Date();
                        try {
                          const parts = submittedAt.split(' ');
                          if (parts[0]) {
                            const dateParts = parts[0].split('/');
                            if (dateParts.length === 3) {
                              const d = parseInt(dateParts[0], 10);
                              const m = parseInt(dateParts[1], 10) - 1;
                              const y = parseInt(dateParts[2], 10);
                              if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                                baseDate = new Date(y > 2500 ? y - 543 : y, m, d);
                              }
                            }
                          }
                        } catch (err) {}
                        
                        // Weeks are calculated based on verified slips count + 1
                        const dueDate = new Date(baseDate.getTime() + (verifiedCount + 1) * 7 * 24 * 60 * 60 * 1000);
                        return dueDate;
                      };

                      if (activeApps.length === 0) {
                        return (
                          <div className="py-2 space-y-2.5 text-center">
                            <div className="p-3 bg-[#05060a] rounded-xl border border-slate-900 text-[11px] text-gray-500 leading-relaxed font-sans">
                              📌 ปัจจุบันคุณยังไม่มีสัญญางวดที่ผ่านการอนุมัติ สำหรับสัญญาที่เพิ่งยื่นผ่อนกรุณา "โอนเงินมัดจำเปิดสิทธิ์" เพื่อเปิดสถานะเป็นผ่านการอนุมัติและเพื่อรับสิทธิ์คิวล็อกอินรหัสเล่นค่ะ
                            </div>
                            <button
                              onClick={() => {
                                const pendingContract = userApplications.find(a => a.status === 'pending');
                                setShowPaymentModal({
                                  defaultAppId: pendingContract?.id || '',
                                  defaultPaymentType: 'down'
                                });
                              }}
                              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-sans"
                            >
                              <CreditCard className="h-4 w-4" />
                              <span>ไปหน้าแจ้งโอนดาวน์เปิดสัญญาสิทธิ์ 🎮</span>
                            </button>
                          </div>
                        );
                      }

                      // Find soonest due date
                      const upcomingPayments = unpaidContracts.map(app => {
                        const verifiedCount = userSlips.filter(s => s.applicationId === app.id && s.status === 'verified').length;
                        const dueDate = getNextDueDate(app.submittedAt, verifiedCount);
                        const diffTime = dueDate.getTime() - Date.now();
                        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return { app, dueDate, daysLeft, verifiedCount };
                      });

                      upcomingPayments.sort((x, y) => x.dueDate.getTime() - y.dueDate.getTime());
                      const nextDue = upcomingPayments[0];

                      return (
                        <div className="space-y-4">
                          {/* Main metric grid */}
                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="bg-[#05060a] p-3 rounded-xl border border-slate-900 flex flex-col justify-between">
                              <span className="text-[10px] text-gray-500 block font-sans">ค่างวดที่ต้องชำระรอบนี้:</span>
                              <span className="text-lg font-black text-emerald-400 font-mono mt-1">
                                ฿{totalCurrentDue.toLocaleString()}
                              </span>
                              <span className="text-[9px] text-gray-500 mt-0.5 font-sans">ค้างส่ง {unpaidContracts.length} สัญญา</span>
                            </div>

                            <div className="bg-[#05060a] p-3 rounded-xl border border-slate-900 flex flex-col justify-between">
                              <span className="text-[10px] text-gray-500 block font-sans">ต้องจ่ายงวดหน้าถัดไป:</span>
                              {nextDue ? (
                                <div className="mt-1">
                                  <span className="text-xs font-black text-white block font-mono">
                                    {nextDue.dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                  </span>
                                  <span className={`text-[9px] font-bold font-sans ${
                                    nextDue.daysLeft <= 1 
                                      ? 'text-red-400' 
                                      : nextDue.daysLeft <= 3 
                                        ? 'text-yellow-400' 
                                        : 'text-emerald-400'
                                  }`}>
                                    {nextDue.daysLeft <= 0 ? 'ครบกำหนดชำระวันนี้แล้วค่ะ ⚠️' : `เหลือเวลาอีก ${nextDue.daysLeft} วัน`}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-gray-500 mt-1 font-sans">ค่างวดผ่อนเรียบร้อยครบถ้วน ✨</span>
                              )}
                            </div>
                          </div>

                          {/* Specific contracts drill-down */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider font-sans text-left">สถานภาพประวัติค่างวดสัญญารายตัว :</span>
                            
                            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
                              {activeApps.map(app => {
                                const verifiedCount = userSlips.filter(s => s.applicationId === app.id && s.status === 'verified').length;
                                const isFullyPaid = verifiedCount >= app.installmentWeeks;
                                const dueDate = getNextDueDate(app.submittedAt, verifiedCount);

                                return (
                                  <div key={app.id} className="p-3 bg-slate-950/60 transition-all hover:bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between gap-3 text-xs">
                                    <div className="space-y-1 flex-grow overflow-hidden text-left">
                                      <div className="flex items-center gap-1.5">
                                        <span className="bg-[#070e1b] text-indigo-400 font-mono text-[9px] px-1.5 py-0.5 rounded font-black uppercase shrink-0">
                                          {app.productCode}
                                        </span>
                                        <span className="text-slate-200 font-bold truncate block font-sans">{app.productTitle}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-sans">
                                        <span>งวดครบ {verifiedCount}/{app.installmentWeeks} สัปดาห์</span>
                                        <span className="text-slate-700 font-bold">•</span>
                                        {isFullyPaid ? (
                                          <span className="text-emerald-400 font-bold font-sans">ผ่อนครบสมบูรณ์ ✨</span>
                                        ) : (
                                          <span className="font-mono">ครบ {dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action pay button per contract */}
                                    {!isFullyPaid && (
                                      <button
                                        onClick={() => {
                                          setShowPaymentModal({
                                            defaultAppId: app.id,
                                            defaultPaymentType: 'installment'
                                          });
                                        }}
                                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer shrink-0 font-sans"
                                      >
                                        ส่งงวด ฿{app.weeklyInstallmentAmount}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Banking Accounts Quick Card */}
                  <div className="bg-[#0b0c14] border border-slate-900 rounded-2xl p-5 space-y-4 shadow-sm">
                    <h4 className="text-white font-extrabold text-sm flex items-center gap-2 text-left">
                      <Coins className="h-4.5 w-4.5 text-cyan-400" />
                      <span>บัญชีโอนส่งค่างวด (ของแท้)</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {BANK_ACCOUNTS.map((bank, index) => {
                        const isTTB = bank.bankName.includes('TTB') || bank.bankName.includes('ทหารไทย');
                        const isWallet = bank.bankName.includes('Wallet') || bank.bankName.includes('วอลเล็ท');

                        return (
                          <div 
                            key={index} 
                            className={`p-3.5 rounded-xl border-2 text-left text-[11px] font-mono transition-all space-y-1.5 ${
                              isTTB 
                                ? 'bg-blue-950/25 border-indigo-600/60 shadow-[0_0_10px_rgba(37,99,235,0.15)] hover:border-indigo-400' 
                                : isWallet 
                                  ? 'bg-amber-950/20 border-orange-500/60 shadow-[0_0_10px_rgba(249,115,22,0.15)] hover:border-orange-400' 
                                  : 'bg-slate-950 border-slate-900'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-black uppercase text-[10px] ${
                                isTTB ? 'text-blue-300' : isWallet ? 'text-orange-400' : 'text-cyan-400'
                              }`}>{bank.bankName}</span>
                              <span className={`text-[9.5px] font-sans px-1 rounded-full ${
                                isTTB ? 'bg-blue-500/10 text-blue-400' : isWallet ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-900 text-gray-400'
                              }`}>24 ชม.</span>
                            </div>
                            <div className="flex items-center justify-between text-white font-black mt-1 font-mono">
                              <span className={isTTB ? 'text-blue-105' : isWallet ? 'text-orange-105' : 'text-white'}>{bank.accountNo}</span>
                              <button
                                onClick={() => {
                                  safeCopyToDevice(bank.accountNo);
                                  alert(`คัดลอกเลขบัญชี ${bank.accountNo} สำเร็จ!`);
                                }}
                                className={`font-sans text-[10px] px-2.5 py-0.5 rounded cursor-pointer transition-colors ${
                                  isTTB 
                                    ? 'bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white' 
                                    : isWallet 
                                      ? 'bg-orange-950 hover:bg-orange-900 text-orange-400 hover:text-white' 
                                      : 'bg-slate-900 text-gray-400 hover:text-white'
                                }`}
                              >
                                คัดลอก
                              </button>
                            </div>
                            <p className={`text-[10px] truncate max-w-[200px] font-sans ${
                              isTTB ? 'text-slate-400' : isWallet ? 'text-orange-300' : 'text-slate-400'
                            }`}>ชื่อบัญชี: {bank.accountName}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Compact PromptPay QR Section on the main card */}
                    <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-3 text-left">
                      <div className="relative bg-white p-1.5 rounded-lg flex items-center justify-center shrink-0 w-24 h-24 border border-slate-200">
                        <img 
                          src="https://promptpay.io/0948201166.png" 
                          alt="TrueMoney Wallet PromptPay QR" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute -bottom-1.5 bg-orange-600 text-white font-sans text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                          PROMPTPAY QR
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10.5px] text-orange-400 font-extrabold flex items-center gap-1">
                          <QrCode className="h-3 w-3" /> แสกน QR สบายใจกว่า
                        </p>
                        <p className="text-[9.5px] text-gray-400 font-sans leading-relaxed">
                          ใช้แอปธนาคารสแกนเข้า <strong className="text-slate-200">094-820-1166 (นายชยพล ปุญนนท์)</strong> โอนฟรี ไม่มีค่าธรรมเนียม ตรวจสอบผ่าน EasySlip คลังสลิปอัตโนมัติ 24 ชม.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Slips Log */}
                  <div className="bg-[#050814] border border-slate-900 rounded-2xl p-5 space-y-4 text-left shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                        <History className="h-4.5 w-4.5 text-indigo-400" />
                        <span>ประวัติสลิปที่คุณอัปโหลด ({slips.length})</span>
                      </h4>
                      {slips.length > 0 && (
                        <span className="text-[10px] text-gray-500 font-mono">EasySlip API</span>
                      )}
                    </div>

                    {slips.length === 0 ? (
                      <div className="p-6 bg-slate-950 rounded-xl border border-slate-900 text-center text-xs text-slate-500 font-sans">
                        <p>ไม่มีประวัติส่งรูปสลิปงวดผ่านบอร์ด</p>
                        <p className="text-[10px] text-gray-600 mt-1">สลิปที่ยื่นหมวดรอตรวจจะรันข้อมูลที่นี่ค่ะ</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {slips.map((slip) => (
                          <div 
                            key={slip.id} 
                            className="p-3 bg-slate-950 rounded-xl border border-slate-900 flex gap-3 text-xs items-start hover:border-slate-800 transition-colors"
                          >
                            <div className="w-10 h-10 rounded overflow-hidden bg-slate-900 border border-slate-800 shrink-0 select-none">
                              <img src={slip.slipImage} alt="slip thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-grow space-y-1 overflow-hidden font-sans">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-indigo-400 font-bold truncate max-w-[100px]">{slip.productCode}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  slip.status === 'verified' ? 'bg-emerald-950 text-emerald-400 font-mono' :
                                  slip.status === 'rejected' ? 'bg-red-950 text-red-500 font-mono' :
                                  'bg-amber-950 text-amber-500 font-mono'
                                }`}>
                                  {slip.status === 'verified' ? 'สำเร็จ' :
                                   slip.status === 'rejected' ? 'ไม่ผ่าน' :
                                   'รอวิเคราะห์'}
                                </span>
                              </div>
                              <div className="text-white font-extrabold text-xs font-mono">
                                ฿{slip.transferAmount.toLocaleString()}
                              </div>
                              <div className="text-[9px] text-slate-500 flex justify-between items-center font-mono">
                                <span className="truncate">{slip.bank}</span>
                                <span className="shrink-0">{slip.transferTime.split(' ')[0]}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-[#020d20] border border-cyan-950 p-3 rounded-xl flex gap-2.5 text-[10.5px] text-cyan-300 leading-normal">
                      <ShieldCheck className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                      <p className="font-sans">
                        สลิปจะได้รับการตรวจด้วย EasySlip API อ่าน QR-Code เพื่อตัดประวัติการผ่อนให้ทันทีตลอด 24 ชั่วโมง
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* KYC SECURE VERIFICATION MULTISTEP FLOW VIEW */}
          {activeTab === 'kyc' && (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center space-y-6 animate-fadeIn pb-16">
              
              {/* Header Box */}
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#05112e] border border-blue-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <ShieldCheck className="h-8 w-8 text-indigo-400" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                    ระบบยืนยันตัวตนผู้ใช้ระดับพรีเมียม (Secure KYC)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    เพื่อความปลอดภัยตามเกณฑ์สัญญากลาง ผ่อนง่าย ถูกต้องตามกฎหมาย 100% ข้อมูลของคุณจะถูกเข้ารหัสระดับทหารและไม่เปิดเผยภายนอก
                  </p>
                </div>

                {/* Progress Timeline Tracker */}
                <div className="max-w-xl mx-auto pt-4 pb-2 font-mono">
                  <div className="grid grid-cols-4 gap-1 relative items-center">
                    
                    {/* Stepper connecting line */}
                    <div className="absolute top-[7px] left-[12%] right-[12%] h-1 bg-slate-900 rounded-full -z-10">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{
                          width: 
                             kycUser.status === 'approved' ? '100%' :
                             kycUser.status === 'step4' ? '100%' :
                             kycUser.status === 'step3' ? '66.6%' :
                             kycUser.status === 'step2' ? '33.3%' :
                             kycUser.status === 'step1' ? '0%' : '0%'
                        }}
                      />
                    </div>

                    {[
                      { num: 1, label: '1. เบอร์โทร OTP', active: kycUser.status === 'step1' || kycUser.status === 'unlogged', complete: kycUser.status !== 'unlogged' && kycUser.status !== 'step1' },
                      { num: 2, label: '2. ส่งบัตรปชช & เซลฟี่', active: kycUser.status === 'step2', complete: kycUser.status === 'step3' || kycUser.status === 'step4' || kycUser.status === 'approved' },
                      { num: 3, label: '3. ฝ่ายบริการตรวจสอบ', active: kycUser.status === 'step3' || kycUser.status === 'step4', complete: kycUser.status === 'approved' },
                      { num: 4, label: '4. ผ่านอนุมัติ', active: kycUser.status === 'approved', complete: kycUser.status === 'approved' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1.5 col-span-1">
                        <div 
                          className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            step.complete 
                              ? 'bg-emerald-500 border-emerald-400' 
                              : step.active 
                                ? 'bg-indigo-600 border-indigo-500 scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)] text-white font-black' 
                                : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          {step.complete && <Check className="h-2 w-2 text-white" />}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-bold tracking-tight line-clamp-1 ${
                          step.active ? 'text-indigo-400 font-extrabold' : step.complete ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD SHELL AREA */}
              <div className="bg-[#060e26] border border-[#1d2d54]/60 p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl relative text-left">
                
                {/* 1. STATE: UNLOGGED (ยังไม่ล็อคอินบัญชี) */}
                {kycUser.status === 'unlogged' && (
                  <div className="text-center py-6 space-y-6 animate-fadeIn">
                    <div className="h-14 w-14 rounded-full bg-slate-950 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheck className="h-7 w-7 text-indigo-400/80" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white font-extrabold text-base sm:text-lg">
                        ต้องการบัญชีสมาชิกก่อนยืนยันตัวตน KYC
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
                        ระบบสัญญาเช่าซื้อและการผ่อนชำระ บังคับผู้เข้ารายงานลงทะเบียนสมัครใช้บริการและเข้าสู่ระบบให้สำเร็จเสร็จสิ้นก่อนเริ่มยื่นเอกสารเพื่อความปลอดภัยขั้นสูงสุดค่ะ
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 active:scale-98 text-white font-black py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        เข้าสู่ระบบ หรือ สมัครสมาชิกใหม่ทันที
                      </button>
                    </div>
                  </div>
                )}
                {kycUser.status === 'step1' && (
                  <div className="space-y-6 animate-fadeIn font-sans text-left">
                    <div className="border-b border-slate-900 pb-3">
                      <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                        <span>📱 ขั้นตอนที่ 1: ตรวจสอบเบอร์โทรศัพท์มือถือ</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs text-slate-400 font-bold block">กรอกเบอร์โทรศัพท์มือถือ (10 หลัก)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="เช่น 0897654321"
                            value={kycUser.phone}
                            onChange={(e) => setKycUser(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').substring(0, 10) }))}
                            className="flex-grow bg-[#050608] border border-slate-800 p-3 rounded-xl text-white outline-none font-mono text-sm tracking-widest focus:border-indigo-500/50"
                          />
                          <button
                            disabled={isSendingKycOtp}
                            onClick={async () => {
                              if (kycUser.phone.length < 10) {
                                alert('กรุณากรอกเบอร์มือถือประเมินตรวจเช็คให้ครบ 10 หลักด้วยนะคะ');
                                return;
                              }
                              setIsSendingKycOtp(true);
                              try {
                                const response = await fetch('/api/send-otp', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    phone: kycUser.phone
                                  })
                                });
                                const result = await response.json();
                                if (result.success) {
                                  setKycUser(prev => ({ 
                                    ...prev, 
                                    otpSent: true, 
                                    otpToken: result.token, 
                                    otpRefCode: result.refCode 
                                  }));
                                  addLog('success', `ระบบได้ทำรายการยิง OTP ผ่านเกตเวย์ SMS2pro จริงสำเร็จไปยังเบอร์ ${kycUser.phone} (อ้างอิง: ${result.refCode || 'N/A'})`);
                                  alert(`ระบบเกตเวย์ SMS2pro ได้ส่งรหัส OTP (รหัสอ้างอิง: ${result.refCode || 'N/A'}) ไปยังเบอร์ ${kycUser.phone} เรียบร้อยแล้วค่ะ!`);
                                } else {
                                  addLog('error', `ยิง SMS จริงไม่สำเร็จ: ${result.message}`);
                                  alert(`ยิง SMS จริงไม่สำเร็จ: ${result.message}`);
                                }
                              } catch (e: any) {
                                addLog('error', `เกิดข้อผิดพลาดในการเรียกใช้ OTP: ${e.message}`);
                                alert(`เกิดข้อผิดพลาดในการเรียกใช้ OTP: ${e.message}`);
                              } finally {
                                setIsSendingKycOtp(false);
                              }
                            }}
                            className={`font-black text-xs px-5 rounded-xl transition-colors shrink-0 ${
                              isSendingKycOtp 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-65' 
                                : 'bg-indigo-600 hover:bg-indigo-400 text-white cursor-pointer'
                            }`}
                          >
                            {isSendingKycOtp ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}
                          </button>
                        </div>
                      </div>

                      {/* Display OTP Verification Field if Sent */}
                      {kycUser.otpSent && (
                        <div className="space-y-2 bg-[#050608]/40 border border-indigo-500/20 p-4 rounded-xl animate-scaleUp">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-bold font-sans">กรอกรหัสยืนยันตัวตน 6 หลักที่ได้รับใน SMS (อ้างอิง: {kycUser.otpRefCode || 'N/A'}):</span>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              maxLength={6}
                              placeholder="กรอกรหัสยืนยันตัวตน..."
                              value={kycUser.otpInput || ''}
                              onChange={(e) => setKycUser(prev => ({ ...prev, otpInput: e.target.value.replace(/\D/g, '') }))}
                              className="flex-grow bg-[#050608] border border-slate-800 p-2.5 rounded-xl text-white outline-none font-mono text-xs tracking-widest"
                            />
                            <button
                              onClick={async () => {
                                if (!kycUser.otpInput || kycUser.otpInput.length < 6) {
                                  alert('กรุณากรอกรหัสผ่าน OTP 6 หลักด้วยค่ะ');
                                  return;
                                }
                                try {
                                  const response = await fetch('/api/verify-otp', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      token: kycUser.otpToken,
                                      otpCode: kycUser.otpInput,
                                      refCode: kycUser.otpRefCode
                                    })
                                  });
                                  const result = await response.json();
                                  if (result.success) {
                                    setKycUser(prev => ({ ...prev, otpVerified: true, status: 'step2' }));
                                    addLog('info', `ตรวจสอบรหัส OTP จริงสำเร็จ เชื่อมพิจารณาขั้นตอนอัปโหลดประวัติเอกสารสำคัญ`);
                                    alert('ตรวจสอบยืนยันรหัส OTP จริงของท่านสำเร็จเรียบร้อยแล้วค่ะ!');
                                  } else {
                                    alert(result.message || 'รหัส OTP ไม่ถูกต้อง กรุณาลองกรอกตรวจสอบอีกรอบนะคะ');
                                  }
                                } catch (e: any) {
                                  alert(`เกิดข้อผิดพลาดในการยืนยัน OTP: ${e.message}`);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-xl transition-colors shrink-0 cursor-pointer"
                            >
                              ยืนยันรหัส OTP
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. STATE: STEP 2 (กรอกข้อมูลและอัพโหลดเอกสาร) */}
                {kycUser.status === 'step2' && (
                  <div className="space-y-5 animate-fadeIn font-sans">
                    <div className="border-b border-slate-900 pb-3 text-left">
                      <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                        <span>💳 ขั้นตอนที่ 2: กรอกข้อมูลและอัพโหลดเอกสารเพื่อความปลอดภัย</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1 text-left">
                        <label className="text-xs text-slate-400 font-bold block">ชื่อ-นามสกุล (ตรงตามบัตรประชาชน)</label>
                        <input 
                          type="text"
                          value={kycUser.fullName}
                          onChange={(e) => setKycUser(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full bg-[#050608] border border-slate-800 p-2.5 rounded-xl text-white outline-none font-sans text-xs focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs text-slate-400 font-bold block">เลขประจำตัวประชาชน 13 หลัก</label>
                        <input 
                          type="text"
                          value={kycUser.nationalId}
                          onChange={(e) => setKycUser(prev => ({ ...prev, nationalId: e.target.value }))}
                          className="w-full bg-[#050608] border border-slate-800 p-2.5 rounded-xl text-white outline-none font-mono text-xs tracking-widest focus:border-indigo-500"
                        />
                      </div>

                    </div>

                    {/* Drag & Drop Upload Areas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans">
                      
                      {/* Sub-block A: ID Card */}
                      <div className="border border-dashed border-slate-800 bg-[#040e26] rounded-2xl p-4 flex flex-col items-center justify-between text-center min-h-[160px] space-y-3">
                        <div className="bg-indigo-950/40 text-indigo-400 p-2.5 rounded-full border border-indigo-500/20">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <p className="text-[11px] text-white font-bold">รูปถ่ายบัตรประชาชน (ด้านหน้า)</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">ลากไฟล์มาวาง หรือ กดจำลองด้านล่าง</p>
                        </div>

                        {kycUser.idCardImage ? (
                          <div className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={kycUser.idCardImage} className="max-h-full object-cover" alt="ID Card Preview" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <button
                            onClick={() => setKycUser(prev => ({ ...prev, idCardImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=500&q=80' }))}
                            className="inline-flex items-center gap-1.5 bg-[#090b16] border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 px-3 py-1.5 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
                          >
                            📸 ใช้รูปตัวอย่างบัตรประชาชน
                          </button>
                        )}
                      </div>

                      {/* Sub-block B: Selfie */}
                      <div className="border border-dashed border-slate-855 bg-[#040e26] rounded-2xl p-4 flex flex-col items-center justify-between text-center min-h-[160px] space-y-3">
                        <div className="bg-indigo-950/40 text-indigo-400 p-2.5 rounded-full border border-indigo-500/20">
                          <FileText className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-[11px] text-white font-bold">รูปถ่ายเซลฟี่คู่หน้าคุณ</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">ลากไฟล์มาวาง หรือ กดจำลองด้านล่าง</p>
                        </div>

                        {kycUser.selfieImage ? (
                          <div className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={kycUser.selfieImage} className="max-h-full object-cover" alt="Selfie Preview" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <button
                            onClick={() => setKycUser(prev => ({ ...prev, selfieImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80' }))}
                            className="inline-flex items-center gap-1.5 bg-[#090b16] border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 px-3 py-1.5 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
                          >
                            🤳 ใช้รูปตัวอย่างใบหน้าจริง
                          </button>
                        )}
                      </div>

                    </div>

                    {/* PDPA consent checkbox */}
                    <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 flex items-start gap-2.5 text-left font-sans col-span-1">
                      <input 
                        type="checkbox"
                        checked={kycUser.consentChecked}
                        onChange={(e) => setKycUser(prev => ({ ...prev, consentChecked: e.target.checked }))}
                        className="mt-1 h-3.5 w-3.5 accent-indigo-600 rounded bg-[#100d2b] border-[#100d2b] cursor-pointer"
                        id="pdpa-kyc"
                      />
                      <label htmlFor="pdpa-kyc" className="text-[10px] text-gray-400 leading-relaxed font-bold select-none cursor-pointer">
                        ข้าพเจ้านินยอมให้ EFCPAShop จัดเก็บข้อมูลส่วนบุคคลและข้อมูลบัตรประชาชนภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อใช้ประกอบการกู้ซื้อผ่อนชำระรหัสเกม eFootball และเข้าทำสัญญาส่วนกลางอย่างยุติธรรม
                      </label>
                    </div>

                    {/* Footer operations */}
                    <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-xs">
                      <button
                        onClick={() => setKycUser(prev => ({ ...prev, status: 'step1' }))}
                        className="text-gray-500 hover:text-white font-bold transition-all cursor-pointer"
                      >
                        ย้อนกลับ
                      </button>
                      
                      <button
                        onClick={() => {
                          if (!kycUser.fullName || !kycUser.nationalId) {
                            alert('กรุณากรอกข้อมูลลงชื่อและบัตร 13 หลักด้วยนะครับ');
                            return;
                          }
                          if (!kycUser.idCardImage || !kycUser.selfieImage) {
                            alert('อัปโหลดสแนปเอกสารทั้ง 2 ช่องเพื่อให้บอท AI ได้ทำการตรวจสแกนก่อนนะคะ');
                            return;
                          }
                          if (!kycUser.consentChecked) {
                            alert('กรุณาแตะเลือกยินยอมรับข้อกำหนดความปลอดภัย (PDPA) ก่อนยื่นเอกสารค่ะ');
                            return;
                          }
                          setKycUser(prev => ({ ...prev, status: 'step3' }));
                          addLog('info', 'ส่งใบยื่นตรวจสอบเอกสารแผงควบคุมระบบคอเปรียบเทียบ AI Reader');
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all font-sans cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                      >
                        ส่งคำขออนุมัติวงเงินผ่อนชำระ
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. STATE: STEP 3 (ตรวจสอบข้อมูลความละเอียด AI Reader) */}
                {kycUser.status === 'step3' && (
                  <div className="space-y-6 animate-fadeIn font-sans text-left">
                    <div className="text-center font-sans">
                      <span className="bg-[#0b122c] border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 font-mono font-black text-[10px] uppercase">
                        STEP 3: ตรวจตราความถูกต้องของคุณสำเร็จแล้ว
                      </span>
                    </div>

                    <div className="border-b border-slate-900 pb-2 text-center font-sans">
                      <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5">
                        <span>📋 ตรวจสอบข้อมูลส่วนบุคคลและอนุมัติความถูกต้องขั้นสุดท้าย</span>
                      </h3>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">
                        กรุณาอ่านตรวจสอบรายละเอียดด้านล่างให้สมบูรณ์ตรงตามกฎหมาย ก่อนยืนยันเพื่อขออนุมัติวงเงินผ่อนสะสมแผงเครื่องสูงสุด 50,000 บาท
                      </p>
                    </div>

                    {/* High-fidelity summary Grid */}
                    <div className="bg-[#050608] border border-slate-850 p-4 rounded-xl space-y-2 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block mb-0.5">ชื่อผู้ผ่อนสัญญา:</span>
                          <strong className="text-white text-xs">{kycUser.fullName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">เบอร์โทรศัพท์ยืนยัน:</span>
                          <strong className="text-white font-mono text-xs">{kycUser.phone || '0897654321'}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-500 block mb-0.5">เลขประจำตัวประชาชน 13 หลัก:</span>
                          <strong className="text-white font-mono text-xs">{kycUser.nationalId}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">สถานะคะแนน AI Reader:</span>
                          <strong className="text-emerald-400 font-sans text-xs flex items-center gap-1">
                            <span>✓ ผ่านการตรวจสอบ</span>
                            <span className="text-[9px] bg-emerald-950 px-1 py-0.5 rounded text-emerald-400 font-mono">(100% Match)</span>
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Snap images reviews */}
                    <div className="grid grid-cols-2 gap-4 pt-1 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="block mb-1.5 font-bold">📷 ภาพหลักฐานบัตรประชาชน:</span>
                        <div className="h-28 bg-[#050608] border border-slate-850 rounded-xl overflow-hidden flex items-center justify-center">
                          <img src={kycUser.idCardImage} className="max-h-full object-cover opacity-85" alt="card" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div>
                        <span className="block mb-1.5 font-bold">🤳 ภาพใบหน้ายืนยันสด:</span>
                        <div className="h-28 bg-[#050608] border border-slate-850 rounded-xl overflow-hidden flex items-center justify-center">
                          <img src={kycUser.selfieImage} className="max-h-full object-cover opacity-85" alt="face" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    </div>

                    {/* Legal declaration block */}
                    <div className="bg-[#040e26] border border-indigo-500/15 p-4 rounded-xl space-y-2 text-[10px] text-gray-400 leading-relaxed text-left">
                      <span className="text-indigo-400 font-extrabold text-xs block">💡 ประกาศสำคัญทางกฎหมาย:</span>
                      <ul className="list-disc list-inside space-y-1 font-sans font-medium text-left">
                        <li>การแอบอ้าง นำภาพถ่ายบัตรประชาชนของบุคคลอื่นมาใช้สมัครถือเป็นความผิดทางกฎหมายอาญา</li>
                        <li>ข้อมูลทั้งหมดที่ได้รับการยินยอมจะนำไปใช้ในการทำสัญญาสัญญาสากลของสถานประกอบการ EFCPAShop เท่านั้น</li>
                        <li>เมื่อพ้นขั้นตอนสำเร็จ ระบบจะพิจารณาอนุมัติวงเงินให้กับคู่ผ่อนสะสอดเพื่อนำไปหยิบจับจองไอดีเกมในร้านได้ทันที</li>
                      </ul>
                    </div>

                    {/* Consent confirmation */}
                    <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 flex items-start gap-2.5 text-left col-span-1">
                      <input 
                        type="checkbox"
                        checked={kycUser.finalConsentChecked}
                        onChange={(e) => setKycUser(prev => ({ ...prev, finalConsentChecked: e.target.checked }))}
                        className="mt-1 h-3.5 w-3.5 accent-indigo-600 rounded bg-[#0b122c] cursor-pointer"
                        id="final-kyc"
                      />
                      <label htmlFor="final-kyc" className="text-[10px] text-gray-400 leading-relaxed font-bold select-none cursor-pointer font-sans">
                        ฉันขอรับรองและกดยืนยัน ว่าข้อมูลส่วนบุคคล ชื่อ-นามสกุล เบอร์ติดต่อ และรูปถ่ายด้านบนทั้งหมด มีความถูกต้องสมบูรณ์ตรงตามความจริง 100% และตระหนักถึงสัญญากลางเพื่อเปิดรับสิทธิ์อนุมัติวงเงินของตัวเองค่ะ
                      </label>
                    </div>

                    {/* Submit layout */}
                    <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-xs font-sans">
                      <button
                        onClick={() => setKycUser(prev => ({ ...prev, status: 'step2' }))}
                        className="text-gray-500 hover:text-white font-bold transition-all cursor-pointer"
                      >
                        ย้อนกลับไปแก้ไขข้อมูล
                      </button>
                      
                      <button
                        onClick={() => {
                          if (!kycUser.finalConsentChecked) {
                            alert('กรุณาเลือกตกลงกดยอมรับเอกสารสัญญาเพื่อเป็นการสมนาคุณความแม่นยำทางกฏหมายค่ะ');
                            return;
                          }
                          setKycUser(prev => ({ ...prev, status: 'step4', submittedAt: new Date().toLocaleString() }));
                          addLog('info', `ลูกค้ายื่นยืนยันตัวตน KYC รหัสผู้สมัคร ${kycUser.fullName} รอฝ่ายแอดมินหลังบ้านประทับการอนุมัติ`);
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:scale-[1.02] text-white font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                      >
                        กดยืนยันอนุมัติข้อมูลสำเร็จ & ขอเปิดใช้งานวงเงินสูงสุด ☀️
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. STATE: STEP 4 (WAITING AUDIT / อนุมัติหลังบ้าน) */}
                {kycUser.status === 'step4' && (
                  <div className="text-center py-6 space-y-6 animate-fadeIn font-sans">
                    <div className="inline-flex rotate-infinite items-center justify-center h-16 w-16 rounded-full bg-indigo-950/40 border border-indigo-400/20 text-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.2)] mx-auto">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h2 className="text-white font-black text-base sm:text-lg">
                        ส่งคำขอรับวงเงินสำเร็จ อยู่ระหว่างการตรวจสอบ
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
                        เอกสารของท่านถูกส่งยื่นเข้าระบบความปลอดภัยส่วนกลางพรีเมียมเรียบร้อยแล้ว แอดมินร้านค้ากำลังดำเนินตรวจสอบภาพใบหน้าและหมายเลขประจำตัวประชาชนเพื่อประเมินสัญญาและอนุมัติตัวเงินผ่อนชำระให้ท่านภายใน 5-15 นาทีค่ะ!
                      </p>
                    </div>

                    {/* Summary box */}
                    <div className="bg-[#050608] border border-slate-900 p-4 rounded-xl text-left font-mono text-[11px] max-w-md mx-auto space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">ชื่อผู้ยื่นเอกสาร:</span>
                        <strong className="text-slate-200 font-bold">{kycUser.fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">เบอร์ติดต่อขอรับ OTP:</span>
                        <strong className="text-slate-200">{kycUser.phone || '0897654321'}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">สถานะตรวจสอบ:</span>
                        <span className="bg-[#12082b] border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 font-extrabold text-[10px]">
                          🔮 รอทีมแอดมินอนุมัติชั่วคราว
                        </span>
                      </div>
                      <div className="flex justify-between text-yellow-400 font-extrabold border-t border-slate-900 pt-2 text-xs">
                        <span>วงเงินผ่อนสะสมแผงผ่อนที่ยื่นขอ:</span>
                        <span>สูงสุด 50,000 บาท</span>
                      </div>
                    </div>

                    {/* Developer Guide / Auto Approve Tip */}
                    <div className="border border-indigo-400/20 bg-indigo-950/20 p-4 rounded-xl max-w-md mx-auto text-left text-[11px] text-indigo-300 leading-normal space-y-2 font-sans">
                      <p className="font-extrabold text-white flex items-center gap-1.5">
                        🛠️ สำหรับช่วงแสดงผลทดสอบ (Developer Control Room):
                      </p>
                      <p>
                        กรุณากดเปิดสลับ <strong>"เข้าระบบแอดมิน"</strong> ด้านบนขวาของกล่องเมนูหลัก จากนั้นคลิกเข้าไปที่แท็บ <strong>"รายการตรวจสอบ KYC"</strong> เพื่อพิจารณากดอนุมัติคำขอนี้ด้วยมือของท่านเองได้ทันทีเลยนะคะ!
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setKycUser(prev => ({ ...prev, status: 'step1', otpSent: false, otpInput: '' }));
                        }}
                        className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs py-2 px-5 rounded-xl font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        🔄 ส่งใบสมัครใหม่อีกครั้ง
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. STATE: APPROVED (อนุมัติผ่าน KYC แล้ว) */}
                {kycUser.status === 'approved' && (
                  <div className="text-center py-8 space-y-6 animate-fadeIn font-sans max-w-md mx-auto">
                    <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 p-4 rounded-full border border-emerald-400/20 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <Check className="h-8 w-8 animate-bounce" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-white font-extrabold text-base sm:text-lg">
                        ยินดีด้วยค่ะ! บัญชีของคุณได้รับการอนุมัติ KYC แล้ว
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
                        ระบบตรวจสอบความปลอดภัยอนุมัติวงเงินผ่อนชำระสะสมสูงสุดให้คุณเป็นผู้ใช้ Premium Verified เรียบร้อยแล้ว ตอนนี้คุณสามารถเลือกซื้อไอดีแบรนด์เนมและยื่นผ่อนชำระสัญญาผ่านลายมือได้อย่างสมบูรณ์แบบ!
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-left font-mono text-[11px] space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">สิทธิผู้สมัครผูกพัน:</span>
                        <strong className="text-white font-bold">{kycUser.fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">ยอดวงเงินผ่อนอนุมัติสะสม:</span>
                        <strong className="text-emerald-400 text-xs font-black">฿50,000 (สูงสุด)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">คะแนนความเชื่อถือเสถียร CG:</span>
                        <strong className="text-yellow-400 font-black">840 CG</strong>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-sans">
                        <span className="text-gray-500">ระดับสิทธิ์ความปลอดภัย:</span>
                        <span className="bg-emerald-950/80 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-extrabold">
                          🛡️ พรีเมียมยืนยันตัวตนแล้ว (Verified)
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-[0_4px_15px_rgba(79,70,229,0.4)] cursor-pointer"
                      >
                        ไปเลือกผ่อนไอดีเกมกันเลย 🎮
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      ) : (
        /* BACKOFFICE ADMIN VIEW PANEL CONTAINER */
        <main className="flex-grow bg-[#050608]">
          <AdminPanel 
            products={products}
            setProducts={setProducts}
            applications={applications}
            setApplications={setApplications}
            slips={slips}
            setSlips={setSlips}
            logs={logs}
            addLog={addLog}
            kycUser={kycUser}
            setKycUser={setKycUser}
          />
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-[#040508] border-t border-slate-900/90 py-10 text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left py-2">
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://img2.pic.in.th/47AF4192-FB83-4538-A567-374319D868B1.png";
                }}
                alt="EF CPA Shop Logo"
                className="h-7 w-7 rounded-lg object-contain bg-[#070415] border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <span className="font-extrabold text-white text-base tracking-widest">EF CPA Shop</span>
            </div>
            <p className="text-gray-600 font-sans leading-relaxed text-[11px]">
              บริการซื้อสิทธิ์ไอดีเกมออนไลน์ ดำเนินผ่อนชำระค่างวดออนไลน์ ไร้คนกู้ ไม่มีค่าเช่าเสริม มาร์เก็ตเพรสเกม eFootball อันดับ 1 ของไทย ครอบคลุมการขายสิทธิ์ eFootball BY EF CPA Shop
            </p>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-slate-300 font-bold text-xs uppercase font-mono tracking-wider">ช่องทางการติดต่ออย่างเป็นทางการ</h4>
            <div className="space-y-2 text-[11px] text-gray-600">
              <a 
                href="https://web.facebook.com/EFCPAShop" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Facebook className="h-4 w-4 text-indigo-400" />
                <span>แฟนเพจ: EF CPA Shop</span>
              </a>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>เบอร์ติดต่อฉุกเฉิน : 094-820-1166</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>แอดไลน์ไอดี: @820tvyqh</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-300 font-bold text-xs block uppercase tracking-wider">ใบรับรอง & ลิขสิทธิ์ความปลอดภัย</h4>
            <p className="text-gray-600 font-sans leading-relaxed text-[11px]">
              ได้รับการจดทะเบียนคลังสินค้าดิจิทัลโดยกรมการค้าพัฒนา มีเอกสารสัญญายื่นยอมของลูกค้าสมบูรณ์ ทำการบันทึก IP ลายลักษณ์อักษรเพื่อความมั่นใจ 100%
            </p>
            <p className="text-[10px] text-gray-700 font-mono mt-2">© 2026 EFCPAShop. All rights reserved. Designed to Reno.</p>
          </div>

        </div>
      </footer>

      {/* FLOATING CHATBOT WIDGET ASSISTANT */}
      <SupportChat />

      {/* MODAL 1: PRODUCT COMPLETE INFORMATION DETAILS MODAL */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApply={handleApplyProcessSetup}
          collectedCoupons={collectedCoupons}
        />
      )}

      {/* MODAL 2: INTERACTIVE MULTISTEP SIGN SIGNATURE AGREEMENTS REGISTRY */}
      {appProduct && (
        <ApplicationModal 
          product={appProduct}
          selectedWeeks={appWeeks}
          selectedDown={appDown}
          onClose={() => setAppProduct(null)}
          onSubmit={handleApplicationCompleted}
          collectedCoupons={collectedCoupons}
          kycUser={kycUser}
        />
      )}

      {/* MODAL 3: FLOATING REPORT SLIPS */}
      {showPaymentModal && (
        <PaymentReportModal 
          applications={approvedUserApplications}
          onClose={() => setShowPaymentModal(false)}
          onSubmitSlip={handlePaymentSlipSubmit}
          defaultAppId={typeof showPaymentModal === 'object' && showPaymentModal !== null ? showPaymentModal.defaultAppId : undefined}
          defaultPaymentType={typeof showPaymentModal === 'object' && showPaymentModal !== null ? showPaymentModal.defaultPaymentType : undefined}
        />
      )}

      {/* MODAL 4: CREDIT STATUS / CONTRACTS PREVIEW RECORD */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-cyan-500/20 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
              <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" /> ข้อมูลประวัติและสิทธิ์ของคุณ
              </h3>
              <button 
                onClick={() => setShowCreditModal(false)}
                className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  U
                </div>
                <div>
                  <div className="text-white font-bold">{userStats.name}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">ระเบียนไอดี: EFC-USR-9124</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-900 p-3 rounded-xl">
                  <span className="text-gray-500 text-[10px] block">เครดิตอนุมัติหลัก:</span>
                  <span className="text-yellow-400 font-extrabold text-sm">{userStats.creditScore} CG</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl">
                  <span className="text-gray-500 text-[10px] block">วงเงินผ่อนสะสมแถม:</span>
                  <span className="text-white font-extrabold text-sm">฿{userStats.walletBalance.toLocaleString()}</span>
                </div>
              </div>

              {/* Dynamic user contracts count */}
              <div className="border-t border-slate-900 pt-3">
                <span className="text-[10px] text-gray-500 block mb-2">สัญญาผ่อนชำระของคุณทั้งหมด :</span>
                {applications.length === 0 ? (
                  <p className="text-slate-400 p-3 bg-slate-950 rounded-xl text-center border border-slate-900">
                    ไม่มีสัญญาเช่าซื้อสิทธิ์ไอดีเกมออนไลน์ขณะนี้
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {applications.map((app) => (
                      <div key={app.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-slate-200 font-bold block truncate max-w-[150px]">{app.productTitle}</span>
                          <span className="text-gray-500 text-[9px]">งวดละ {app.weeklyInstallmentAmount} บ. ({app.status})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.status === 'approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-gray-400'
                        }`}>{app.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="pt-4 mt-4 border-t border-slate-900 flex justify-end">
              <button
                onClick={() => setShowCreditModal(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2 px-6 rounded-xl text-xs"
              >
                ตกลงรับทราบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic member registration & OTP login modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(email, name, phone) => {
            const isUserAdmin = email.trim().toLowerCase() === 'chayapol.arm2004@gmail.com';
            setIsAdmin(isUserAdmin);
            setKycUser(prev => ({
              ...prev,
              isLoggedIn: true,
              email: email,
              fullName: name,
              phone: phone,
              status: prev.status === 'unlogged' ? 'step1' : prev.status
            }));
            setUserStats(prev => ({
              ...prev,
              name: name
            }));
            setShowLoginModal(false);
            addLog('success', `ยินดีต้อนรับคุณ ${name} (${email}) เข้าสู่ระบบสมาชิกผ่อนสิทธิสำเร็จตามเกตเวย์ OTP`);

            // Sync newly logged in or registered profile details down to backend so they persist
            fetch('/api/dashboard', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email,
                fullName: name,
                phone: phone,
                walletBalance: isUserAdmin ? 9999999 : 25000,
                creditScore: isUserAdmin ? 999 : 840,
                creditLimit: isUserAdmin ? 9999999 : 50000
              })
            }).catch(err => console.error('Failed to push profile sync to backend:', err));
          }}
        />
      )}

      {/* Floating Toast Notification Popups */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-scaleUp max-w-sm w-[90%] sm:w-full">
          <div className="bg-[#120b28]/95 backdrop-blur-md border border-purple-500/30 p-4 rounded-2xl flex items-center gap-3.5 shadow-[0_10px_30px_rgba(139,92,246,0.35)] text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold text-xs sm:text-sm">คัดลอกส่วนลดเสร็จสิ้น!</p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
