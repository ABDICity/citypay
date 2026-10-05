export type Language = 'id' | 'en' | 'ar';

export type VoucherCategory = 
  | 'ziswaf' 
  | 'umrah_hajj' 
  | 'halal_mart' 
  | 'islamic_education' 
  | 'masjid_community' 
  | 'qurban_aqiqah';

export type ShariaContract = 
  | 'Wakalah bil Ujrah' 
  | 'Mudharabah' 
  | 'Wadiah Yad Dhamanah' 
  | 'Hibah / Tabarru';

export type VoucherStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'FROZEN' | 'ALLOCATED';

export type Currency = 'IDR' | 'SAR' | 'USD';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  category: VoucherCategory;
  shariaContract: ShariaContract;
  faceValue: number;
  remainingBalance: number;
  currency: Currency;
  status: VoucherStatus;
  issuedDate: string;
  expiryDate: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  beneficiaryEmail: string;
  merchantsAllowed: string[];
  encryptedHash: string;
  digitalSignature: string;
  qrPayload: string;
  pinRequired: boolean;
  securityLevel: 'AES-256-GCM' | 'RSA-4096';
  totalUsageCount: number;
  maxUsageCount: number;
  description: string;
  terms: string;
}

export type TransactionType = 'ISSUE' | 'REDEEM' | 'TOPUP' | 'TRANSFER' | 'DISBURSE' | 'REFUND';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'BLOCKED' | 'FLAGGED';
export type BankChannel = 
  | 'BSI_SYARIAH' 
  | 'MUAMALAT' 
  | 'BCA_SYARIAH' 
  | 'CIMB_SYARIAH' 
  | 'ALADIN_SYARIAH'
  | 'MEGA_SYARIAH'
  | 'QRIS_SYARIAH' 
  | 'BI_FAST_SYARIAH';

export interface Transaction {
  id: string;
  voucherId: string;
  voucherCode: string;
  voucherTitle: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  status: TransactionStatus;
  merchantName: string;
  bankChannel: BankChannel;
  timestamp: string;
  endToEndHash: string;
  shariaAuditId: string;
  feeUjrah: number;
  location: string;
  isTamperProof: boolean;
  ipAddress: string;
  beneficiary: string;
  details?: string;
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'AUDIT_SEALED';
export type AuditCategory = 'SECURITY' | 'TRANSACTION' | 'SHARIA_COMPLIANCE' | 'API_INTEGRATION' | 'USER_AUTH' | 'CONFIG';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  ipAddress: string;
  action: string;
  category: AuditCategory;
  severity: AuditSeverity;
  payloadHash: string;
  dsnMuiCompliance: boolean;
  notes: string;
}

export interface BankIntegration {
  id: string;
  bankName: string;
  bankCode: string;
  shortName: string;
  status: 'CONNECTED' | 'SYNCING' | 'MAINTENANCE';
  protocol: 'BI-FAST' | 'SNAP-BI-SYARIAH' | 'ISO-20022' | 'REST-HMAC';
  latencyMs: number;
  dailyVolume: number;
  shariaAgreementNo: string;
  lastHeartbeat: string;
  logoColor: string;
  endpointUrl: string;
}

export interface RecurringVoucherSchedule {
  id: string;
  programTitle: string;
  category: VoucherCategory;
  shariaContract: ShariaContract;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  amountPerVoucher: number;
  recipientCount: number;
  beneficiaryGroup: string;
  asnafCategory: 'FAKIR_MISKIN' | 'FISABILILLAH' | 'GHARIMIN' | 'IBNU_SABIL' | 'MUALAF' | 'RIQAB' | 'AMIL';
  nextExecutionDate: string;
  lastExecutedDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  fundingSourceBank: string;
  autoIssue: boolean;
  totalDisbursed: number;
  cyclesCompleted: number;
  description: string;
}

export interface SecurityStatus {
  e2eeActive: boolean;
  twoFactorRequired: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  biometricType: 'fingerprint' | 'facial' | 'both';
  biometricDeviceRegistered: boolean;
  encryptionCipher: string;
  keyRotationDays: number;
  lastRotated: string;
  tamperProofSeals: number;
  threatDetectionScore: number;
  tlsVersion: string;
  totpSecret: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'TRANSACTION' | 'SECURITY' | 'SHARIA_ALERT' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  voucherCode?: string;
  amount?: number;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  name: string;
  description: string;
  category: 'VOUCHER' | 'TRANSACTION' | 'BANKING' | 'COMPLIANCE';
  requestSample: string;
  responseSample: string;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'content'
  | 'vouchers' 
  | 'security' 
  | 'banking_api' 
  | 'audit_log' 
  | 'mobile_wallet' 
  | 'ai_advisor'
  | 'masjid_pay'
  | 'settings';

export type NotificationItem = PushNotification;
