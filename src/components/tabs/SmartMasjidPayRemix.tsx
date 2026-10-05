import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  QrCode, 
  Wallet, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Download, 
  Receipt, 
  Users, 
  Coins, 
  ShieldCheck, 
  Layers, 
  Smartphone, 
  Check, 
  Copy, 
  TrendingUp, 
  Heart,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Store,
  Info,
  History,
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  Printer,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Voucher, Transaction, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface SmartMasjidPayRemixProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  onAddTransaction?: (transaction: Transaction) => void;
  onShowToast: (message: string) => void;
  onViewVoucherDetails?: (voucher: Voucher) => void;
}

export interface MosquePartner {
  id: string;
  name: string;
  location: string;
  totalDonationCollected: number;
  activeJamaahCount: number;
  dkmLeader: string;
  qrisId: string;
}

export interface InfaqTransactionRecord {
  id: string;
  txCode: string;
  date: string;
  timestamp: string;
  mosqueId: string;
  mosqueName: string;
  allocationId: string;
  allocationTitle: string;
  donorName: string;
  donorMaskedPhone: string;
  paymentMethod: 'QRIS' | 'VOUCHER' | 'BANK_SYARIAH';
  channelName: string;
  baseAmount: number;
  infaqAdminFee: number;
  totalAmount: number;
  status: 'SUCCESS' | 'SETTLED' | 'PROCESSING';
  auditId: string;
  sha256Hash: string;
  notes: string;
}

const initialMosques: MosquePartner[] = [
  {
    id: 'msj-01',
    name: 'Masjid Raya IslamiCity Hub',
    location: 'Kawasan Finansial Syariah Terpadu',
    totalDonationCollected: 38450000,
    activeJamaahCount: 1850,
    dkmLeader: 'Ustadz H. Abdullah Syukri, M.A.',
    qrisId: 'ID1020268841029'
  },
  {
    id: 'msj-02',
    name: 'Masjid Al-Falah & Koperasi Berkah',
    location: 'Kecamatan Sukamaju, Bandung Timur',
    totalDonationCollected: 21600000,
    activeJamaahCount: 920,
    dkmLeader: 'Hj. Siti Rahmah & Tim DKM',
    qrisId: 'ID1020268841030'
  },
  {
    id: 'msj-03',
    name: 'Masjid Jami Al-Muhajirin',
    location: 'Perumahan Graha Syariah Asri',
    totalDonationCollected: 16750000,
    activeJamaahCount: 640,
    dkmLeader: 'Ir. H. Bambang Irawan',
    qrisId: 'ID1020268841031'
  }
];

const infaqAllocations = [
  {
    id: 'operasional',
    title: 'Operasional & Tagihan Listrik Masjid',
    desc: 'Menjaga AC sejuk, lampu terang, dan kebersihan tempat wudhu 24 jam.',
    icon: Building2,
    color: 'emerald'
  },
  {
    id: 'yatim_dhuafa',
    title: 'Santunan Yatim & Sembako Dhuafa',
    desc: 'Bantuan bahan pokok dan biaya hidup warga prasejahtera sekitar masjid.',
    icon: Heart,
    color: 'rose'
  },
  {
    id: 'sound_karpet',
    title: 'Renovasi Karpet & Sound System',
    desc: 'Kenyamanan sujud jamaah dan kejelasan suara azan serta kajian.',
    icon: Layers,
    color: 'amber'
  },
  {
    id: 'air_subuh',
    title: 'Air Minum & Dapur Berkah Subuh',
    desc: 'Sedekah air minum gratis dan sarapan pagi untuk jamaah sholat subuh.',
    icon: Coins,
    color: 'blue'
  }
];

const defaultInfaqHistory: InfaqTransactionRecord[] = [
  {
    id: 'infaq-001',
    txCode: 'SMP-928104',
    date: '04 Okt 2026, 21:15',
    timestamp: '2026-10-04T21:15:00Z',
    mosqueId: 'msj-01',
    mosqueName: 'Masjid Raya IslamiCity Hub',
    allocationId: 'operasional',
    allocationTitle: 'Operasional & Tagihan Listrik Masjid',
    donorName: 'Ahmad Fauzi (Mustahiq)',
    donorMaskedPhone: '+62 812-****-7890',
    paymentMethod: 'QRIS',
    channelName: 'QRIS Syariah (BSI)',
    baseAmount: 75000,
    infaqAdminFee: 1500,
    totalAmount: 76500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-928104',
    sha256Hash: 'a7c9e1b3d5f782194602bb4819cae56012ff9c882145bda0831cbaef4012de99',
    notes: 'Biaya admin Rp 1.500 disalurkan 100% ke kas listrik masjid.'
  },
  {
    id: 'infaq-002',
    txCode: 'SMP-927450',
    date: '04 Okt 2026, 18:42',
    timestamp: '2026-10-04T18:42:00Z',
    mosqueId: 'msj-02',
    mosqueName: 'Masjid Al-Falah & Koperasi Berkah',
    allocationId: 'yatim_dhuafa',
    allocationTitle: 'Santunan Yatim & Sembako Dhuafa',
    donorName: 'Hj. Siti Rahmah',
    donorMaskedPhone: '+62 813-****-4321',
    paymentMethod: 'VOUCHER',
    channelName: 'Voucher Berkah Digital',
    baseAmount: 150000,
    infaqAdminFee: 1500,
    totalAmount: 151500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-927450',
    sha256Hash: 'f4b2c8a1e9d375210984ee6271aeb49033cd8b771234cda0721baaed3021fe88',
    notes: 'Pembayaran sembako halal, infaq admin untuk santunan anak yatim.'
  },
  {
    id: 'infaq-003',
    txCode: 'SMP-926812',
    date: '04 Okt 2026, 15:20',
    timestamp: '2026-10-04T15:20:00Z',
    mosqueId: 'msj-03',
    mosqueName: 'Masjid Jami Al-Muhajirin',
    allocationId: 'air_subuh',
    allocationTitle: 'Air Minum & Dapur Berkah Subuh',
    donorName: 'M. Rizky Pratama',
    donorMaskedPhone: '+62 815-****-9012',
    paymentMethod: 'QRIS',
    channelName: 'QRIS Syariah (Muamalat)',
    baseAmount: 25000,
    infaqAdminFee: 1500,
    totalAmount: 26500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-926812',
    sha256Hash: '12d8a4c6e0b297341567ff8910aed54321ba9c775432eda0654cbafe1234bc55',
    notes: 'Infaq air mineral galon dan sarapan gratis jamaah subuh.'
  },
  {
    id: 'infaq-004',
    txCode: 'SMP-925190',
    date: '04 Okt 2026, 12:05',
    timestamp: '2026-10-04T12:05:00Z',
    mosqueId: 'msj-01',
    mosqueName: 'Masjid Raya IslamiCity Hub',
    allocationId: 'sound_karpet',
    allocationTitle: 'Renovasi Karpet & Sound System',
    donorName: 'Ir. H. Bambang Irawan',
    donorMaskedPhone: '+62 811-****-5566',
    paymentMethod: 'BANK_SYARIAH',
    channelName: 'SNAP-BI Bank Syariah Indonesia',
    baseAmount: 250000,
    infaqAdminFee: 1500,
    totalAmount: 251500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-925190',
    sha256Hash: '78bc34de12fa90563412ab7890cde12345ef67890123fabc4567deab8901ef23',
    notes: 'Infaq jariyah penggantian karpet shaf pertama masjid.'
  },
  {
    id: 'infaq-005',
    txCode: 'SMP-924301',
    date: '04 Okt 2026, 09:30',
    timestamp: '2026-10-04T09:30:00Z',
    mosqueId: 'msj-02',
    mosqueName: 'Masjid Al-Falah & Koperasi Berkah',
    allocationId: 'operasional',
    allocationTitle: 'Operasional & Tagihan Listrik Masjid',
    donorName: 'Nurul Hidayah',
    donorMaskedPhone: '+62 817-****-3321',
    paymentMethod: 'QRIS',
    channelName: 'QRIS Syariah (Bank Aladin)',
    baseAmount: 50000,
    infaqAdminFee: 1500,
    totalAmount: 51500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-924301',
    sha256Hash: '90ab56cd34ef12789012cd3456ef789012ab34567890bcde1234ef56789012ab',
    notes: 'Sedekah rutin harian dialirkan ke kas kebersihan dan wudhu.'
  },
  {
    id: 'infaq-006',
    txCode: 'SMP-922118',
    date: '03 Okt 2026, 20:10',
    timestamp: '2026-10-03T20:10:00Z',
    mosqueId: 'msj-03',
    mosqueName: 'Masjid Jami Al-Muhajirin',
    allocationId: 'yatim_dhuafa',
    allocationTitle: 'Santunan Yatim & Sembako Dhuafa',
    donorName: 'Fajar Ramadhan',
    donorMaskedPhone: '+62 818-****-6677',
    paymentMethod: 'QRIS',
    channelName: 'QRIS Syariah (BCA Syariah)',
    baseAmount: 100000,
    infaqAdminFee: 1500,
    totalAmount: 101500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-922118',
    sha256Hash: '56ef789012ab34cd5678ef9012ab345678cd90123456efab7890123456cd7890',
    notes: 'Paket sembako beras 5kg untuk dhuafa sekitar masjid.'
  },
  {
    id: 'infaq-007',
    txCode: 'SMP-921405',
    date: '03 Okt 2026, 14:45',
    timestamp: '2026-10-03T14:45:00Z',
    mosqueId: 'msj-01',
    mosqueName: 'Masjid Raya IslamiCity Hub',
    allocationId: 'air_subuh',
    allocationTitle: 'Air Minum & Dapur Berkah Subuh',
    donorName: 'Dedi Setiawan (Musafir)',
    donorMaskedPhone: '+62 819-****-2233',
    paymentMethod: 'VOUCHER',
    channelName: 'Voucher Berkah Digital',
    baseAmount: 35000,
    infaqAdminFee: 1500,
    totalAmount: 36500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-921405',
    sha256Hash: '34cd56ef789012ab3456cd789012ab3456ef78901234cdab567890123456ef78',
    notes: 'Infaq musafir setelah istirahat sholat di rest area masjid.'
  },
  {
    id: 'infaq-008',
    txCode: 'SMP-919830',
    date: '03 Okt 2026, 06:15',
    timestamp: '2026-10-03T06:15:00Z',
    mosqueId: 'msj-02',
    mosqueName: 'Masjid Al-Falah & Koperasi Berkah',
    allocationId: 'sound_karpet',
    allocationTitle: 'Renovasi Karpet & Sound System',
    donorName: 'Jamaah Subuh Berkah',
    donorMaskedPhone: '+62 821-****-9988',
    paymentMethod: 'QRIS',
    channelName: 'QRIS Tromol Digital',
    baseAmount: 200000,
    infaqAdminFee: 1500,
    totalAmount: 201500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-919830',
    sha256Hash: '12ab34cd56ef78901234ab56789012cd3456ef789012cdab345678901234ef56',
    notes: 'Sedekah tromol digital selesai sholat subuh berjamaah.'
  },
  {
    id: 'infaq-009',
    txCode: 'SMP-918220',
    date: '02 Okt 2026, 21:00',
    timestamp: '2026-10-02T21:00:00Z',
    mosqueId: 'msj-03',
    mosqueName: 'Masjid Jami Al-Muhajirin',
    allocationId: 'operasional',
    allocationTitle: 'Operasional & Tagihan Listrik Masjid',
    donorName: 'H. Syamsul Maarif',
    donorMaskedPhone: '+62 822-****-4455',
    paymentMethod: 'BANK_SYARIAH',
    channelName: 'SNAP-BI Bank Muamalat',
    baseAmount: 500000,
    infaqAdminFee: 1500,
    totalAmount: 501500,
    status: 'SUCCESS',
    auditId: 'AUD-DSNMUI-SMP-918220',
    sha256Hash: '789012ab34cd56ef7890cd123456ab789012ef345678cdab901234567890ef12',
    notes: 'Kafalah marbot & operasional kebersihan masjid mingguan.'
  }
];

export const SmartMasjidPayRemix: React.FC<SmartMasjidPayRemixProps> = ({
  currentLang,
  vouchers,
  transactions,
  onAddTransaction,
  onShowToast,
  onViewVoucherDetails
}) => {
  const t = translations[currentLang];

  // Active View Mode: 'jamaah' | 'dkm_cashier' | 'history' | 'remix_calculator'
  const [activeMode, setActiveMode] = useState<'jamaah' | 'dkm_cashier' | 'history' | 'remix_calculator'>('jamaah');

  // Infaq History Ledger State
  const [infaqHistory, setInfaqHistory] = useState<InfaqTransactionRecord[]>(defaultInfaqHistory);

  // History Filter & Search States
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyMosqueFilter, setHistoryMosqueFilter] = useState<string>('all');
  const [historyAllocationFilter, setHistoryAllocationFilter] = useState<string>('all');
  const [historyMethodFilter, setHistoryMethodFilter] = useState<string>('all');
  const [historyTimeFilter, setHistoryTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [historySortBy, setHistorySortBy] = useState<'newest' | 'amount_desc' | 'infaq_desc'>('newest');

  // Detailed Modal for specific history record audit
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<InfaqTransactionRecord | null>(null);

  // Transaction Form States
  const [selectedMosqueId, setSelectedMosqueId] = useState<string>('msj-01');
  const [selectedAllocationId, setSelectedAllocationId] = useState<string>('operasional');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'voucher' | 'bank_syariah'>('qris');
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');
  
  // Quick Preset Amounts
  const presetAmounts = [10000, 25000, 50000, 100000, 250000];

  // Fixed Administrative Fee that is converted 100% to Mosque Donation
  const adminFeeToMosque = 1500;

  // Receipt Modal State after successful payment
  const [lastReceipt, setLastReceipt] = useState<{
    txId: string;
    date: string;
    mosqueName: string;
    allocationTitle: string;
    nominal: number;
    adminDonation: number;
    total: number;
    method: string;
    donorName: string;
  } | null>(null);

  // Impact Calculator States
  const [jamaahCount, setJamaahCount] = useState<number>(750);
  const [monthlyTxPerPerson, setMonthlyTxPerPerson] = useState<number>(8);
  const [simulatedAdminFee, setSimulatedAdminFee] = useState<number>(1500);

  // DKM Voucher Verification state
  const [verifyCodeInput, setVerifyCodeInput] = useState<string>('');
  const [verifiedVoucherResult, setVerifiedVoucherResult] = useState<Voucher | null | 'NOT_FOUND'>(null);

  // Active vouchers suitable for voucher-based checkout
  const activeVouchers = vouchers.filter(v => v.status === 'ACTIVE' && v.remainingBalance > 0);

  const selectedMosque = initialMosques.find(m => m.id === selectedMosqueId) || initialMosques[0];
  const selectedAllocation = infaqAllocations.find(a => a.id === selectedAllocationId) || infaqAllocations[0];

  // Calculate Impact
  const calculatedMonthlyMosqueIncome = jamaahCount * monthlyTxPerPerson * simulatedAdminFee;
  const calculatedAnnualMosqueIncome = calculatedMonthlyMosqueIncome * 12;

  // Filtered History for Financial Oversight
  const filteredHistory = useMemo(() => {
    return infaqHistory.filter((item) => {
      // Search matching
      if (historySearchQuery.trim()) {
        const q = historySearchQuery.toLowerCase();
        const matchesCode = item.txCode.toLowerCase().includes(q);
        const matchesDonor = item.donorName.toLowerCase().includes(q);
        const matchesMosque = item.mosqueName.toLowerCase().includes(q);
        const matchesAlloc = item.allocationTitle.toLowerCase().includes(q);
        const matchesChannel = item.channelName.toLowerCase().includes(q);
        if (!matchesCode && !matchesDonor && !matchesMosque && !matchesAlloc && !matchesChannel) {
          return false;
        }
      }

      // Mosque filter
      if (historyMosqueFilter !== 'all' && item.mosqueId !== historyMosqueFilter) {
        return false;
      }

      // Allocation filter
      if (historyAllocationFilter !== 'all' && item.allocationId !== historyAllocationFilter) {
        return false;
      }

      // Payment method filter
      if (historyMethodFilter !== 'all' && item.paymentMethod !== historyMethodFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (historySortBy === 'amount_desc') {
        return b.baseAmount - a.baseAmount;
      }
      if (historySortBy === 'infaq_desc') {
        return b.infaqAdminFee - a.infaqAdminFee;
      }
      // default: newest
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [infaqHistory, historySearchQuery, historyMosqueFilter, historyAllocationFilter, historyMethodFilter, historySortBy]);

  // Aggregate stats from processed Infaq history
  const totalInfaqAdminCollected = useMemo(() => {
    return infaqHistory.reduce((acc, curr) => acc + curr.infaqAdminFee, 0);
  }, [infaqHistory]);

  const totalBaseTransactionsVolume = useMemo(() => {
    return infaqHistory.reduce((acc, curr) => acc + curr.baseAmount, 0);
  }, [infaqHistory]);

  // Handle Quick Pay Execution
  const handleExecutePayment = () => {
    const finalNominal = customAmountStr ? parseInt(customAmountStr, 10) : amount;
    if (!finalNominal || isNaN(finalNominal) || finalNominal <= 0) {
      onShowToast('Silakan pilih atau masukkan nominal transaksi yang valid.');
      return;
    }

    if (paymentMethod === 'voucher' && !selectedVoucherId) {
      onShowToast('Pilih voucher aktif untuk melakukan pembayaran.');
      return;
    }

    sounds.playSuccess();

    const txCode = 'SMP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDateFormatted = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newTxHash = 'e2ee_' + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18);
    const auditId = 'AUD-DSNMUI-SMP-' + Date.now().toString().slice(-6);

    const newTx: Transaction = {
      id: 'tx-smp-' + Date.now(),
      voucherId: selectedVoucherId || 'vch-smp',
      voucherCode: selectedVoucherId ? (vouchers.find(v => v.id === selectedVoucherId)?.code || 'VCH-ACTIVE') : 'SMP-QRIS',
      voucherTitle: `Smart MasjidPay: ${selectedMosque.name}`,
      amount: finalNominal,
      currency: 'IDR',
      type: 'REDEEM',
      status: 'SUCCESS',
      merchantName: `${selectedMosque.name} (${selectedAllocation.title})`,
      bankChannel: 'QRIS_SYARIAH',
      timestamp: new Date().toISOString(),
      endToEndHash: newTxHash,
      shariaAuditId: auditId,
      feeUjrah: adminFeeToMosque,
      location: selectedMosque.location,
      isTamperProof: true,
      ipAddress: '192.168.1.1',
      beneficiary: selectedMosque.name,
      details: `Smart MasjidPay: Biaya admin Rp ${adminFeeToMosque.toLocaleString('id-ID')} dialirkan 100% menjadi Infaq ${selectedAllocation.title}. Akad: Tabarru' & Wakalah bil Ujrah.`
    };

    if (onAddTransaction) {
      onAddTransaction(newTx);
    }

    // Prepend to Infaq History
    const newInfaqRecord: InfaqTransactionRecord = {
      id: 'infaq-' + Date.now(),
      txCode: txCode,
      date: currentDateFormatted,
      timestamp: new Date().toISOString(),
      mosqueId: selectedMosque.id,
      mosqueName: selectedMosque.name,
      allocationId: selectedAllocation.id,
      allocationTitle: selectedAllocation.title,
      donorName: 'Ahmad Fauzi (Hamba Allah)',
      donorMaskedPhone: '+62 812-****-7890',
      paymentMethod: paymentMethod === 'qris' ? 'QRIS' : paymentMethod === 'voucher' ? 'VOUCHER' : 'BANK_SYARIAH',
      channelName: paymentMethod === 'qris' ? 'QRIS Syariah Multi-Bank' : paymentMethod === 'voucher' ? 'Voucher Berkah Digital' : 'SNAP-BI Bank Syariah Direct',
      baseAmount: finalNominal,
      infaqAdminFee: adminFeeToMosque,
      totalAmount: finalNominal + adminFeeToMosque,
      status: 'SUCCESS',
      auditId: auditId,
      sha256Hash: newTxHash,
      notes: `Biaya admin Rp ${adminFeeToMosque.toLocaleString('id-ID')} dialirkan 100% ke kas ${selectedAllocation.title}.`
    };

    setInfaqHistory(prev => [newInfaqRecord, ...prev]);

    setLastReceipt({
      txId: txCode,
      date: currentDateFormatted,
      mosqueName: selectedMosque.name,
      allocationTitle: selectedAllocation.title,
      nominal: finalNominal,
      adminDonation: adminFeeToMosque,
      total: finalNominal + adminFeeToMosque,
      method: paymentMethod === 'qris' ? 'QRIS Syariah Multi-Bank' : paymentMethod === 'voucher' ? 'Voucher Berkah Digital' : 'Bank Syariah Direct',
      donorName: 'Ahmad Fauzi (Hamba Allah)'
    });

    onShowToast(`Alhamdulillah! Transaksi berhasil dan Infaq Rp ${adminFeeToMosque.toLocaleString('id-ID')} telah disalurkan ke kas ${selectedMosque.name}`);
  };

  const handleVerifyCoupon = () => {
    sounds.playClick();
    if (!verifyCodeInput.trim()) {
      onShowToast('Masukkan kode voucher/kupon terlebih dahulu.');
      return;
    }

    const cleanInput = verifyCodeInput.trim().toUpperCase();
    const found = vouchers.find(v => v.code.toUpperCase().includes(cleanInput) || v.id.toUpperCase() === cleanInput);
    if (found) {
      setVerifiedVoucherResult(found);
      sounds.playSuccess();
      onShowToast('Kupon valid ditemukan!');
    } else {
      setVerifiedVoucherResult('NOT_FOUND');
      onShowToast('Kode kupon tidak ditemukan dalam basis data DKM.');
    }
  };

  const copyReceiptToClipboard = () => {
    if (!lastReceipt) return;
    sounds.playClick();
    const text = `*BUKTI TRANSAKSI & INFAQ SMART MASJIDPAY*\n` +
      `No Transaksi: ${lastReceipt.txId}\n` +
      `Masjid: ${lastReceipt.mosqueName}\n` +
      `Peruntukan Infaq: ${lastReceipt.allocationTitle}\n` +
      `Nominal: Rp ${lastReceipt.nominal.toLocaleString('id-ID')}\n` +
      `Biaya Admin (100% Infaq Masjid): Rp ${lastReceipt.adminDonation.toLocaleString('id-ID')}\n` +
      `Total: Rp ${lastReceipt.total.toLocaleString('id-ID')}\n` +
      `Metode: ${lastReceipt.method}\n` +
      `Waktu: ${lastReceipt.date}\n\n` +
      `*Doa*: "Jazakumullah Khairan Katsiran. Semoga berkah dan menjadi amal jariyah."`;
    
    navigator.clipboard.writeText(text);
    onShowToast('Bukti transaksi berhasil disalin! Siap dibagikan ke WhatsApp.');
  };

  // Export processed Infaq history to CSV
  const handleExportCsv = () => {
    sounds.playClick();
    const headers = [
      'No Transaksi',
      'Tanggal',
      'Masjid Penerima',
      'Peruntukan Infaq',
      'Donatur / Pembayar',
      'Kanal Pembayaran',
      'Nominal Pokok (IDR)',
      'Infaq Kas Masjid (IDR)',
      'Total Dibayar (IDR)',
      'Status Audit',
      'ID Audit DSN-MUI',
      'Hash Kriptografi SHA-256'
    ];

    const rows = filteredHistory.map(item => [
      item.txCode,
      `"${item.date}"`,
      `"${item.mosqueName}"`,
      `"${item.allocationTitle}"`,
      `"${item.donorName}"`,
      `"${item.channelName}"`,
      item.baseAmount,
      item.infaqAdminFee,
      item.totalAmount,
      item.status,
      item.auditId,
      item.sha256Hash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Infaq_SmartMasjidPay_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Rekap ${filteredHistory.length} transaksi Infaq berhasil diunduh sebagai CSV.`);
  };

  // Copy Summary text for DKM oversight
  const handleCopyAuditSummary = () => {
    sounds.playClick();
    const summaryText = `*RINGKASAN PENGAWASAN KEUANGAN SMART MASJIDPAY*\n` +
      `Tanggal Audit: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n` +
      `Total Infaq Masuk Kas: Rp ${totalInfaqAdminCollected.toLocaleString('id-ID')}\n` +
      `Total Volume Transaksi: Rp ${totalBaseTransactionsVolume.toLocaleString('id-ID')}\n` +
      `Jumlah Transaksi Terproses: ${infaqHistory.length} Transaksi\n` +
      `Status Fikih: 100% Akad Tabarru' DSN-MUI Terverifikasi\n` +
      `Sistem: Smart MasjidPay Digital Financial Infrastructure`;

    navigator.clipboard.writeText(summaryText);
    onShowToast('Ringkasan pengawasan keuangan berhasil disalin ke clipboard.');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="smart-masjidpay-container">
      
      {/* Hero Banner: Identity & Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-[#0B2319] to-teal-950 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>INOVASI SYARIAH: KEMUDAHAN TRANSAKSI + AMAL JARIYAH</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Smart Masjid<span className="text-emerald-400">Pay</span></span>
            </h1>

            <p className="text-slate-200 text-sm leading-relaxed">
              Sistem transaksi digital sederhana yang menghubungkan kemudahan pembayaran sehari-hari dengan nilai luhur Syariah. <strong className="text-emerald-300">Setiap biaya admin transaksi 100% otomatis dialirkan menjadi donasi & infaq ke kas masjid pilihan Anda!</strong>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                0% Riba & Gharar
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Akad Tabarru' DSN-MUI
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Pengawasan Finansial Real-time
              </span>
            </div>
          </div>

          {/* Quick Counter Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[240px] text-center space-y-2 shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
              Infaq Admin Fee Terkumpul
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              Rp {(76800000 + totalInfaqAdminCollected).toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-300 flex items-center justify-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Dari {(51200 + infaqHistory.length).toLocaleString('id-ID')} Transaksi Jamaah</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs: Simple & Clean (Includes Historical Oversight) */}
      <div className="flex flex-wrap bg-slate-100 dark:bg-[#121215] p-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] max-w-3xl mx-auto gap-1">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('jamaah');
          }}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'jamaah'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Bayar & Infaq</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('dkm_cashier');
          }}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'dkm_cashier'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kasir DKM</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('history');
          }}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'history'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat & Audit Infaq</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
            {infaqHistory.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('remix_calculator');
          }}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'remix_calculator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Kalkulator Dampak</span>
        </button>
      </div>

      {/* VIEW 1: JAMAAH MODE (Sederhana & Mudah Dipakai) */}
      {activeMode === 'jamaah' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Transaction Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Pilih Masjid Tujuan Donasi
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Biaya admin transaksi Anda akan dialirkan 100% ke kas masjid ini.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mosque Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {initialMosques.map((mosque) => {
                  const isSelected = selectedMosqueId === mosque.id;
                  return (
                    <div
                      key={mosque.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedMosqueId(mosque.id);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {mosque.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-1">
                        {mosque.location}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Infaq Fund Allocation */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Peruntukan Infaq dari Biaya Admin (Pilih Fokus Kebaikan):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {infaqAllocations.map((alloc) => {
                    const isSelected = selectedAllocationId === alloc.id;
                    const IconComp = alloc.icon;
                    return (
                      <div
                        key={alloc.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedAllocationId(alloc.id);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                            : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {alloc.title}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {alloc.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nominal Input & Quick Chips */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nominal Transaksi / Pembayaran:
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Biaya Admin: Rp {adminFeeToMosque.toLocaleString('id-ID')} (Infaq)
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setAmount(preset);
                        setCustomAmountStr('');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all border ${
                        amount === preset && !customAmountStr
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:bg-slate-100'
                      }`}
                    >
                      {preset >= 1000000 ? `${preset / 1000000} Jt` : `${preset / 1000} Rb`}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={customAmountStr || (amount ? amount.toString() : '')}
                    onChange={(e) => {
                      setCustomAmountStr(e.target.value);
                      const parsed = parseInt(e.target.value, 10);
                      if (!isNaN(parsed)) setAmount(parsed);
                    }}
                    placeholder="Masukkan nominal lainnya..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#16161A] text-slate-900 dark:text-white font-mono text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Metode Pembayaran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setPaymentMethod('qris');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QRIS Syariah</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">BSI, Muamalat, GoPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setPaymentMethod('voucher');
                      if (activeVouchers.length > 0 && !selectedVoucherId) {
                        setSelectedVoucherId(activeVouchers[0].id);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'voucher'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Voucher Halal</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{activeVouchers.length} Kupon Siap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setPaymentMethod('bank_syariah');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'bank_syariah'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Bank Syariah</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Direct SNAP-BI</span>
                  </button>
                </div>

                {/* Voucher Dropdown if voucher method selected */}
                {paymentMethod === 'voucher' && (
                  <div className="pt-2 animate-fade-in">
                    {activeVouchers.length > 0 ? (
                      <select
                        value={selectedVoucherId}
                        onChange={(e) => setSelectedVoucherId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#16161A] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      >
                        {activeVouchers.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.title} — Sisa: Rp {v.remainingBalance.toLocaleString('id-ID')} ({v.code})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                        Belum ada voucher aktif dengan sisa saldo. Silakan pilih QRIS Syariah.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cost & Infaq Breakdown Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Nominal Transaksi</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    Rp {(customAmountStr ? parseInt(customAmountStr, 10) || 0 : amount).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    Biaya Admin (100% Infaq {selectedMosque.name})
                  </span>
                  <span className="font-mono font-bold">
                    +Rp {adminFeeToMosque.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total yang Dibayarkan</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                    Rp {((customAmountStr ? parseInt(customAmountStr, 10) || 0 : amount) + adminFeeToMosque).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Akad Tabarru' (Sedekah Sukarela) & Wakalah bil Ujrah diawasi DSN-MUI.</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bayar Sekarang & Salurkan Infaq (1 Klik)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Right Column: Mini Interactive Wallet & Mosque Live Infaq Feed */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Mosque Profile Spotlight */}
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedMosque.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    DKM: {selectedMosque.dkmLeader}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Infaq Digital</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    Rp {selectedMosque.totalDonationCollected.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jamaah Berdaya</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">
                    {selectedMosque.activeJamaahCount.toLocaleString('id-ID')} Warga
                  </span>
                </div>
              </div>

              {/* QRIS Tromol Code Visual */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-black text-white text-center space-y-2 border border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>QRIS Tromol Infaq Berkah</span>
                </div>
                <div className="bg-white p-3 rounded-lg inline-block shadow-inner">
                  {/* Procedural QR Code Grid */}
                  <div className="w-28 h-28 grid grid-cols-6 gap-1 bg-white p-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-xs ${
                          (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 29) ? 'bg-slate-950' : 'bg-transparent'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  NMID: {selectedMosque.qrisId}
                </p>
              </div>
            </div>

            {/* Live Masjid Infaq Activity Feed */}
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <span>Aktivitas Infaq Masuk Terkini</span>
                </h4>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Real-time
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {infaqHistory.slice(0, 4).map((tx) => (
                  <div 
                    key={tx.id}
                    onClick={() => setSelectedAuditRecord(tx)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {tx.mosqueName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Admin Infaq: <strong className="text-emerald-500 font-mono">+Rp {tx.infaqAdminFee.toLocaleString('id-ID')}</strong> ({tx.allocationTitle.split(' ')[0]})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        Rp {tx.baseAmount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        Terkirim
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shortcut to Full History View */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveMode('history');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-2 border border-emerald-500/20"
              >
                <History className="w-3.5 h-3.5" />
                <span>Buka Seluruh Riwayat & Pengawasan Finansial ({infaqHistory.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: DKM / CASHIER MODE (Untuk Marbot / Pengurus DKM) */}
      {activeMode === 'dkm_cashier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left: Quick Coupon Verifier */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 shadow-sm space-y-5">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Verifikasi Kupon Bantuan DKM
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Periksa keabsahan voucher sembako, dhuafa, atau beasiswa jamaah masjid.
                  </p>
                </div>
              </div>

              {/* Input Code */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Masukkan Kode Kupon / ID Voucher:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyCodeInput}
                    onChange={(e) => setVerifyCodeInput(e.target.value)}
                    placeholder="Contoh: ICP-ZIS-8821 atau 8821"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#16161A] text-slate-900 dark:text-white font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Periksa</span>
                  </button>
                </div>

                {/* Sample quick fill buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">Coba kupon contoh:</span>
                  {vouchers.slice(0, 3).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setVerifyCodeInput(v.code);
                        setVerifiedVoucherResult(v);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.05] text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      {v.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Result Card */}
              {verifiedVoucherResult && (
                <div className="pt-2 animate-fade-in">
                  {verifiedVoucherResult === 'NOT_FOUND' ? (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-3">
                      <Info className="w-5 h-5 shrink-0" />
                      <div>
                        <strong>Kupon Tidak Ditemukan!</strong> Pastikan kode sudah sesuai dengan yang tertera di kartu atau ponsel jamaah.
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                          Kupon Valid & Terverifikasi
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {verifiedVoucherResult.securityLevel}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {verifiedVoucherResult.title}
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Penerima: <strong className="text-slate-800 dark:text-slate-200">{verifiedVoucherResult.beneficiaryName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Sisa Saldo Kupon</span>
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                            Rp {verifiedVoucherResult.remainingBalance.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            sounds.playSuccess();
                            onShowToast(`Kupon ${verifiedVoucherResult.code} berhasil divalidasi untuk pencairan di kasir DKM.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                        >
                          Cairkan di Kasir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Right: Tromol Digital Stand Display & Oversight Link */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 shadow-sm text-center space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
                <QrCode className="w-8 h-8" />
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Tromol Digital Masjid (Siap Cetak / Pasang)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Tampilkan QRIS ini di meja kasir koperasi masjid, pintu masuk sholat Jumat, atau meja layanan DKM.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950 to-[#0A1A12] border-2 border-emerald-500/40 text-white max-w-xs mx-auto shadow-xl space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-xs tracking-wide">
                    {selectedMosque.name}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                  <div className="w-40 h-40 grid grid-cols-7 gap-1 bg-white p-1">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-xs ${
                          (i % 3 === 0 || i % 5 === 0 || i < 7 || i > 41) ? 'bg-slate-950' : 'bg-transparent'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <div className="text-xs font-bold text-emerald-300">
                    100% Admin Fee = Infaq Kas Masjid
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    NMID: {selectedMosque.qrisId}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onShowToast('Format cetak poster standee QRIS Tromol Masjid siap dicetak.');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Poster Standee</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveMode('history');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Lihat Buku Kas Infaq</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: HISTORICAL LIST VIEW OF ALL PROCESSED INFAQ TRANSACTIONS (Financial Oversight) */}
      {activeMode === 'history' && (
        <div className="space-y-6 animate-fade-in" id="infaq-history-oversight-section">
          
          {/* Financial Oversight KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Infaq Kas Masjid</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                Rp {totalInfaqAdminCollected.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>100% dari alihan biaya admin</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Volume Transaksi</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                Rp {totalBaseTransactionsVolume.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Nilai pokok belanja & bantuan</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Transaksi Terproses</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {infaqHistory.length} Transaksi
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Rata-rata Rp 1.500 / transaksi</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Kepatuhan Fikih</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                100% Sah
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Akad Tabarru' DSN-MUI Sealed</span>
              </div>
            </div>

          </div>

          {/* Action Header & Financial Oversight Toolbar */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.08]">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-500" />
                  <span>Buku Besar & Riwayat Audit Transaksi Infaq Kas Masjid</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daftar transaksi historis terverifikasi untuk rekonsiliasi kas bendahara DKM, donatur, dan audit kepatuhan Syariah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  title="Unduh data dalam format CSV untuk Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Rekap CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAuditSummary}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  title="Salin ringkasan ke clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Ringkasan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    window.print();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  title="Cetak buku kas infaq"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Cetak</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-1">
              
              {/* Search input */}
              <div className="lg:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder="Cari kode transaksi, donatur, masjid..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {historySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setHistorySearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Masjid */}
              <div className="lg:col-span-3">
                <select
                  value={historyMosqueFilter}
                  onChange={(e) => setHistoryMosqueFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Semua Masjid Penerima</option>
                  {initialMosques.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Filter Allocation */}
              <div className="lg:col-span-3">
                <select
                  value={historyAllocationFilter}
                  onChange={(e) => setHistoryAllocationFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Semua Alokasi Infaq</option>
                  {infaqAllocations.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              {/* Filter Payment Method */}
              <div className="lg:col-span-2">
                <select
                  value={historyMethodFilter}
                  onChange={(e) => setHistoryMethodFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Semua Metode</option>
                  <option value="QRIS">QRIS Syariah</option>
                  <option value="VOUCHER">Voucher Halal</option>
                  <option value="BANK_SYARIAH">Bank Syariah</option>
                </select>
              </div>

            </div>

            {/* Filter Status & Count Indicator */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>Menampilkan <strong>{filteredHistory.length}</strong> dari {infaqHistory.length} transaksi infaq</span>
                {(historySearchQuery || historyMosqueFilter !== 'all' || historyAllocationFilter !== 'all' || historyMethodFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setHistorySearchQuery('');
                      setHistoryMosqueFilter('all');
                      setHistoryAllocationFilter('all');
                      setHistoryMethodFilter('all');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span>Urutkan:</span>
                <select
                  value={historySortBy}
                  onChange={(e) => setHistorySortBy(e.target.value as 'newest' | 'amount_desc' | 'infaq_desc')}
                  className="bg-transparent border-0 font-bold text-slate-700 dark:text-slate-300 cursor-pointer focus:ring-0 text-[11px]"
                >
                  <option value="newest">Waktu Terbaru</option>
                  <option value="amount_desc">Nominal Tertinggi</option>
                  <option value="infaq_desc">Infaq Terbesar</option>
                </select>
              </div>
            </div>

          </div>

          {/* Historical Transactions Table (Responsive: Table on Desktop, Cards on Mobile) */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
            
            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  Tidak Ada Transaksi yang Cocok
                </h4>
                <p className="text-xs max-w-sm mx-auto">
                  Coba sesuaikan kata kunci pencarian atau bersihkan filter untuk menampilkan data transaksi infaq lainnya.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Transaksi & Waktu</th>
                      <th className="py-3.5 px-4">Masjid & Peruntukan Infaq</th>
                      <th className="py-3.5 px-4">Donatur / Pembayar</th>
                      <th className="py-3.5 px-4">Metode Bayar</th>
                      <th className="py-3.5 px-4 text-right">Nominal Pokok</th>
                      <th className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">Infaq Kas Masjid</th>
                      <th className="py-3.5 px-4 text-center">Status Audit</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                    {filteredHistory.map((item) => (
                      <tr 
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => setSelectedAuditRecord(item)}
                      >
                        {/* Transaction ID & Date */}
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.txCode}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{item.date}</span>
                        </td>

                        {/* Mosque & Allocation */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {item.mosqueName}
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            {item.allocationTitle}
                          </span>
                        </td>

                        {/* Donor */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {item.donorName}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.donorMaskedPhone}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                            {item.channelName}
                          </span>
                        </td>

                        {/* Base Amount */}
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          Rp {item.baseAmount.toLocaleString('id-ID')}
                        </td>

                        {/* Infaq Admin Fee */}
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <Heart className="w-3 h-3 fill-current" />
                            +Rp {item.infaqAdminFee.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">100% ke Kas</span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Sah DSN-MUI</span>
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                sounds.playClick();
                                setSelectedAuditRecord(item);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 transition-colors"
                              title="Lihat Rincian Audit & Struk"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                sounds.playClick();
                                navigator.clipboard.writeText(item.txCode);
                                onShowToast(`Kode transaksi ${item.txCode} disalin!`);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                              title="Salin Kode Transaksi"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer with Summary Breakdown */}
            <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Seluruh mutasi infaq terlindungi enkripsi AES-256 dan hash audit anti-tamper.</span>
              </div>
              <div className="font-mono text-xs">
                Total Infaq Terfilter: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">Rp {filteredHistory.reduce((acc, c) => acc + c.infaqAdminFee, 0).toLocaleString('id-ID')}</strong>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 4: IMPACT CALCULATOR (Simulasi Dampak Ekonomi Kas Masjid) */}
      {activeMode === 'remix_calculator' && (
        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          
          <div className="max-w-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Kalkulator Dampak Infaq Biaya Admin</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Buktikan bagaimana pengalihan biaya admin digital (yang biasanya diambil utuh oleh perusahaan konvensional) dapat menjadi sumber kemandirian finansial masjid secara abadi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Sliders Input */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Jumlah Jamaah */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Jumlah Jamaah Aktif Masjid:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    {jamaahCount.toLocaleString('id-ID')} Jamaah
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={jamaahCount}
                  onChange={(e) => setJamaahCount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50 Jamaah</span>
                  <span>2.500 Jamaah</span>
                  <span>5.000 Jamaah</span>
                </div>
              </div>

              {/* Slider 2: Transaksi per Bulan */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Rata-rata Transaksi Digital per Jamaah / Bulan:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    {monthlyTxPerPerson} Transaksi
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={monthlyTxPerPerson}
                  onChange={(e) => setMonthlyTxPerPerson(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1x (Sekali seminggu)</span>
                  <span>15x</span>
                  <span>30x (Harian)</span>
                </div>
              </div>

              {/* Slider 3: Biaya Admin per Transaksi */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Besaran Biaya Admin yang Dialihkan ke Kas Masjid:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    Rp {simulatedAdminFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="250"
                  value={simulatedAdminFee}
                  onChange={(e) => setSimulatedAdminFee(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Rp 500</span>
                  <span>Rp 1.500 (Standar)</span>
                  <span>Rp 3.000</span>
                </div>
              </div>

            </div>

            {/* Projected Outcome Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#0B251B] to-teal-950 text-white border border-emerald-500/30 space-y-5 shadow-xl">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                    Potensi Infaq Kas Masjid Otomatis
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                    Rp {calculatedMonthlyMosqueIncome.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-300 block mt-0.5">/ bulan tanpa membebani jamaah</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Proyeksi Kas Tahunan:</span>
                    <strong className="text-amber-300 font-mono text-sm">
                      Rp {calculatedAnnualMosqueIncome.toLocaleString('id-ID')}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs space-y-1 text-[11px] text-slate-200">
                    <strong className="text-emerald-300 block font-bold">Dampak Nyata bagi Kemakmuran Masjid:</strong>
                    <p>
                      ✨ Cukup untuk membayar listrik masjid selama <strong>{Math.max(1, Math.floor(calculatedAnnualMosqueIncome / 2500000))} bulan</strong>.
                    </p>
                    <p>
                      🍲 Menyantuni hingga <strong>{Math.floor(calculatedAnnualMosqueIncome / 300000)} paket sembako</strong> yatim & dhuafa.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveMode('jamaah');
                    onShowToast('Bagus! Mari mulai transaksi perdana untuk mendukung kas masjid.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Coba Bayar & Infaq Sekarang</span>
                </button>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* POPUP 1: RECEIPT MODAL AFTER IMMEDIATE TRANSACTION */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.1] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            {/* Header with Green Badge */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Transaksi & Infaq Berhasil!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
                "Jazakumullah Khairan Katsiran. Semoga Allah melipatgandakan rezeki dan menjadikannya amal jariyah."
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-dashed border-slate-300 dark:border-white/20 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>No. Transaksi</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{lastReceipt.txId}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Waktu</span>
                <span>{lastReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Masjid Tujuan</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{lastReceipt.mosqueName}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Fokus Infaq Admin</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{lastReceipt.allocationTitle}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Nominal Belanja/Bayar</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  Rp {lastReceipt.nominal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Infaq Kas Masjid (Admin Fee)</span>
                <span className="font-mono">+Rp {lastReceipt.adminDonation.toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Total Dibayar</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  Rp {lastReceipt.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyReceiptToClipboard}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Salin Struk (WA)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setLastReceipt(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Tutup & Selesai</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP 2: FINANCIAL OVERSIGHT DETAIL & AUDIT MODAL */}
      {selectedAuditRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.1] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Audit Mutasi Infaq Kas Masjid
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedAuditRecord.auditId}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAuditRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audit Status Badge */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Status: Terverifikasi & Tersalurkan Sah
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold">
                DSN-MUI SEAL
              </span>
            </div>

            {/* Financial Oversight Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                  <span className="text-[10px] text-slate-400 block">Masjid Penerima</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAuditRecord.mosqueName}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                  <span className="text-[10px] text-slate-400 block">Alokasi Infaq</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedAuditRecord.allocationTitle}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-2">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Donatur / Pembayar:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAuditRecord.donorName}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Kontak Donatur:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedAuditRecord.donorMaskedPhone}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Kanal Pembayaran:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{selectedAuditRecord.channelName}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Waktu Kliring BI-FAST/QRIS:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedAuditRecord.date}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Nominal Transaksi Pokok:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Rp {selectedAuditRecord.baseAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    Infaq Kas Masjid (Biaya Admin):
                  </span>
                  <span className="font-mono text-sm">
                    +Rp {selectedAuditRecord.infaqAdminFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-slate-200 dark:border-white/[0.08] flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Dana Terproses:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    Rp {selectedAuditRecord.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Seal Box */}
              <div className="p-3 rounded-xl bg-slate-900 text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">Hash Kriptografi SHA-256 (Anti-Tamper)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAuditRecord.sha256Hash);
                      onShowToast('Hash SHA-256 berhasil disalin!');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] break-all text-slate-300 bg-black/40 p-2 rounded-md">
                  {selectedAuditRecord.sha256Hash}
                </div>
              </div>

              {/* Sharia Dua */}
              <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <span className="text-[11px] font-serif italic text-slate-600 dark:text-slate-300">
                  "Jazakumullah Khairan Katsiran. Semoga Allah melipatgandakan pahala kebaikan donatur dan memberkahi kas kemakmuran masjid."
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  const shareText = `*BUKTI AUDIT INFAQ SMART MASJIDPAY*\n` +
                    `Kode: ${selectedAuditRecord.txCode}\n` +
                    `Masjid: ${selectedAuditRecord.mosqueName}\n` +
                    `Alokasi: ${selectedAuditRecord.allocationTitle}\n` +
                    `Infaq Kas Masjid: Rp ${selectedAuditRecord.infaqAdminFee.toLocaleString('id-ID')}\n` +
                    `Total Transaksi: Rp ${selectedAuditRecord.totalAmount.toLocaleString('id-ID')}\n` +
                    `Audit ID: ${selectedAuditRecord.auditId}\n` +
                    `Status: 100% Sah Terverifikasi DSN-MUI`;
                  navigator.clipboard.writeText(shareText);
                  onShowToast('Rincian audit disalin ke WhatsApp.');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke WA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedAuditRecord(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Tutup Rincian</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
