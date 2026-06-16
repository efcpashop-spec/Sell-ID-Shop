export interface ProductDetail {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  code: string;
  game: 'rov' | 'freefire' | 'pubg' | 'genshin' | 'fcmobile' | 'valorant' | string;
  title: string;
  description: string;
  fullPrice: number;
  originalPrice?: number;
  downPayment: number;
  minInstallmentWeeks: number;
  maxInstallmentWeeks: number;
  weeklyInstallment: number;
  images: string[];
  details: ProductDetail[];
  status: 'available' | 'reserved' | 'paying' | 'sold';
  isHot?: boolean;
  costPrice?: number;
  platform?: string;
  ovr?: number;
  epicCount?: number;
  minDownPercent?: number;
  maxDownPercent?: number;
  interestRate?: number;
  division?: string;
  winRate?: string;
  keyPlayers?: string;
}

export interface InstallmentApplication {
  id: string;
  productId: string;
  productTitle: string;
  productCode: string;
  productPrice: number;
  downPaymentAmount: number;
  installmentWeeks: number;
  weeklyInstallmentAmount: number;
  fullName: string;
  nationalId: string;
  age: number;
  facebook: string;
  phone: string;
  signatureData?: string; // canvas draw base64
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PaymentSlip {
  id: string;
  applicationId: string;
  productTitle: string;
  productCode: string;
  transferAmount: number;
  bank: string;
  transferTime: string;
  slipImage: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface SystemLog {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface KycApplication {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  idCardImage: string;
  selfieImage: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
}
