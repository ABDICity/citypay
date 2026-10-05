import React, { useState } from 'react';
import {
  Globe,
  Layers,
  Sparkles,
  Search,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  Eye,
  Languages,
  Tag,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
  Check,
  X,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Laptop,
  Smartphone,
  Info
} from 'lucide-react';
import { Language } from '../../types';
import { sounds } from '../../utils/soundEffects';

export interface SubsiteItem {
  id: string;
  name: string;
  purposeType: 'PRODUCT_SERVICE' | 'MULTILINGUAL';
  domainType: 'SUBDOMAIN' | 'SUBPATH';
  url: string;
  cnameStatus: 'VERIFIED_ACTIVE' | 'DNS_PROPAGATING' | 'SETUP_REQUIRED';
  targetLanguage: Language | 'ar' | 'en' | 'id';
  targetProductOrService: string;
  themeColor: 'emerald' | 'amber' | 'indigo' | 'sky' | 'purple' | 'rose';
  status: 'ACTIVE' | 'STAGING' | 'DRAFT' | 'MAINTENANCE';
  pagesCount: number;
  monthlyVisitors: number;
  conversionRate: string;
  description: string;
  heroHeadline: string;
  callToAction: string;
  createdDate: string;
  lastSync: string;
  features: string[];
}

interface SubsitesManagementProps {
  currentLang: Language;
}

export const SubsitesManagement: React.FC<SubsitesManagementProps> = ({ currentLang }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'PRODUCT_SERVICE' | 'MULTILINGUAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Modals
  const [previewSubsite, setPreviewSubsite] = useState<SubsiteItem | null>(null);
  const [editingSubsite, setEditingSubsite] = useState<SubsiteItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initial Subsites Dataset (covering both Product/Service Promotion and Multi-Lingual sites)
  const [subsites, setSubsites] = useState<SubsiteItem[]>([
    {
      id: 'SUBS-01',
      name: 'ZISWAF Peduli Umat Digital',
      purposeType: 'PRODUCT_SERVICE',
      domainType: 'SUBDOMAIN',
      url: 'https://ziswaf.islamicitypay.id',
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: 'id',
      targetProductOrService: 'Penyaluran Voucher Zakat, Infaq & Bantuan Mustahik QRIS',
      themeColor: 'emerald',
      status: 'ACTIVE',
      pagesCount: 5,
      monthlyVisitors: 48250,
      conversionRate: '14.2%',
      description: 'Subsite khusus kampanye dan distribusi voucher bantuan ZISWAF yang terverifikasi ke 1.200+ merchant sembako halal binaan.',
      heroHeadline: 'Salurkan ZISWAF Lebih Tepat Sasaran dengan Kupon Digital Terenkripsi',
      callToAction: 'Ajukan Program Bantuan Santri & Dhuafa',
      createdDate: '2026-06-15',
      lastSync: '2026-08-27 17:00:00 UTC',
      features: [
        'Kalkulator Zakat Mal & Profesi Otomatis',
        'Peta Sebaran 12.000+ Mustahik Terverifikasi',
        'Laporan Real-Time Penyaluran Dana Akuntabel',
        'Integrasi QRIS Dinamis Antar-Bank Syariah'
      ]
    },
    {
      id: 'SUBS-02',
      name: 'Merchant & Retailer Syariah Hub',
      purposeType: 'PRODUCT_SERVICE',
      domainType: 'SUBDOMAIN',
      url: 'https://merchant.islamicitypay.id',
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: 'id',
      targetProductOrService: 'Ekosistem POS Kasir, QRIS Settlement H+0 & Onboarding Toko Halal',
      themeColor: 'amber',
      status: 'ACTIVE',
      pagesCount: 4,
      monthlyVisitors: 31400,
      conversionRate: '9.8%',
      description: 'Portal promosi dan pendaftaran bagi UMKM, toko ritel, dan koperasi masjid untuk menerima transaksi voucher digital dengan bagi hasil transparan.',
      heroHeadline: 'Modernisasi Toko Anda dengan POS Kasir & Transaksi Bebas Riba',
      callToAction: 'Daftar Sebagai Merchant Mitra Sekarang',
      createdDate: '2026-07-01',
      lastSync: '2026-08-27 16:50:00 UTC',
      features: [
        'Simulasi Biaya Transaksi 0% (MDR Bebas Riba)',
        'Unduh Aplikasi POS Kasir Android & Web POS',
        'Panduan Sertifikasi Halal BPJPH & DSN-MUI',
        'Pencairan Dana Otomatis H+0 ke Bank Syariah'
      ]
    },
    {
      id: 'SUBS-03',
      name: 'Tabungan & Voucher Umrah Berkah',
      purposeType: 'PRODUCT_SERVICE',
      domainType: 'SUBDOMAIN',
      url: 'https://umrah.islamicitypay.id',
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: 'id',
      targetProductOrService: 'Paket Voucher Perjalanan Ibadah & Escrow Syariah Wadiah',
      themeColor: 'indigo',
      status: 'STAGING',
      pagesCount: 6,
      monthlyVisitors: 18900,
      conversionRate: '11.5%',
      description: 'Layanan terpadu perencanaan tabungan umrah, pembelian paket voucher akomodasi Makkah-Madinah, dan proteksi dana jamaah.',
      heroHeadline: 'Wujudkan Impian Ibadah Umrah dengan Tabungan Terencana & Aman',
      callToAction: 'Pilih Paket Voucher Umrah Ramadhan 1448 H',
      createdDate: '2026-08-10',
      lastSync: '2026-08-27 16:30:00 UTC',
      features: [
        'Katalog 50+ Biro Travel Resmi Berizin Kemenag',
        'Itinerary 12 Hari & Paket VIP Bintang 5',
        'Rekening Escrow Syariah Terkunci Otomatis',
        'Fitur Cicilan Bebas Denda Akad Qardh'
      ]
    },
    {
      id: 'SUBS-04',
      name: 'Global English FinTech Gateway',
      purposeType: 'MULTILINGUAL',
      domainType: 'SUBDOMAIN',
      url: 'https://en.islamicitypay.id',
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: 'en',
      targetProductOrService: 'International Sharia FinTech Platform & Open Banking SNAP-BI APIs',
      themeColor: 'sky',
      status: 'ACTIVE',
      pagesCount: 8,
      monthlyVisitors: 62800,
      conversionRate: '8.4%',
      description: 'Multi-lingual subsite catering to international Islamic banks, global fintechs, and diaspora communities with complete English documentation.',
      heroHeadline: 'Next-Generation Ethical FinTech & Digital Sharia Voucher Infrastructure',
      callToAction: 'Explore Developer Sandbox & API Keys',
      createdDate: '2026-05-20',
      lastSync: '2026-08-27 16:15:00 UTC',
      features: [
        'Interactive Multi-Currency Converter (USD/EUR/SAR/IDR)',
        'DSN-MUI & AAOIFI Compliance English Whitepapers',
        'High-Throughput SNAP-BI REST Endpoints & Webhooks',
        '24/7 Global Enterprise SLA Support'
      ]
    },
    {
      id: 'SUBS-05',
      name: 'MENA & Gulf Islamic Portal (بوابة الشرق الأوسط)',
      purposeType: 'MULTILINGUAL',
      domainType: 'SUBDOMAIN',
      url: 'https://ar.islamicitypay.id',
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: 'ar',
      targetProductOrService: 'منظومة القسائم الرقمية الإسلامية والتكامل مع المصارف الخليجية',
      themeColor: 'purple',
      status: 'ACTIVE',
      pagesCount: 7,
      monthlyVisitors: 39100,
      conversionRate: '7.2%',
      description: 'موقع فرعي متكامل باللغة العربية مخصص للشركاء الاستراتيجيين وصناديق الوقف والمؤسسات المالية في منطقة الشرق الأوسط وشمال إفريقيا.',
      heroHeadline: 'البنية التحتية الرائدة للقسائم الرقمية المتوافقة مع أحكام الشريعة الإسلامية',
      callToAction: 'طلب الشراكة والتوثيق المؤسسي',
      createdDate: '2026-06-01',
      lastSync: '2026-08-27 16:00:00 UTC',
      features: [
        'واجهة عربية كاملة بتنسيق RTL المتطور',
        'اعتماد الفتاوى المتوافقة مع معايير الأيوفي (AAOIFI)',
        'الربط الآمن مع شبكات المدفوعات الخليجية (مدى / بنفت)',
        'استشارات التمويل الإسلامي الرقمي المباشرة'
      ]
    }
  ]);

  // Form State for Creating New Subsite
  const [newSubsiteForm, setNewSubsiteForm] = useState<Partial<SubsiteItem>>({
    name: '',
    purposeType: 'PRODUCT_SERVICE',
    domainType: 'SUBDOMAIN',
    url: '',
    targetLanguage: 'id',
    targetProductOrService: '',
    themeColor: 'emerald',
    status: 'ACTIVE',
    pagesCount: 3,
    description: '',
    heroHeadline: '',
    callToAction: '',
    features: ['Fitur Utama 1', 'Fitur Utama 2', 'Fitur Utama 3']
  });

  const showNotification = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    showNotification(`URL ${text} berhasil disalin ke papan klip!`);
  };

  const handleSyncAllSubsites = () => {
    sounds.playClick();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      sounds.playSuccess();
      showNotification('Seluruh 5 Subsite berhasil disinkronkan ke Global Edge CDN!');
    }, 900);
  };

  const handleDeleteSubsite = (id: string, name: string) => {
    sounds.playClick();
    setSubsites(subsites.filter(s => s.id !== id));
    showNotification(`Subsite "${name}" berhasil dihapus.`);
  };

  const handleSaveCreateSubsite = () => {
    if (!newSubsiteForm.name || !newSubsiteForm.heroHeadline) {
      showNotification('Mohon lengkapi nama subsite dan judul headline.');
      return;
    }

    const created: SubsiteItem = {
      id: `SUBS-0${subsites.length + 1}`,
      name: newSubsiteForm.name || 'Subsite Baru',
      purposeType: newSubsiteForm.purposeType || 'PRODUCT_SERVICE',
      domainType: newSubsiteForm.domainType || 'SUBDOMAIN',
      url: newSubsiteForm.url || `https://${newSubsiteForm.name?.toLowerCase().replace(/\s+/g, '-')}.islamicitypay.id`,
      cnameStatus: 'VERIFIED_ACTIVE',
      targetLanguage: (newSubsiteForm.targetLanguage as Language) || 'id',
      targetProductOrService: newSubsiteForm.targetProductOrService || 'Layanan Promosi Produk',
      themeColor: newSubsiteForm.themeColor || 'emerald',
      status: (newSubsiteForm.status as SubsiteItem['status']) || 'ACTIVE',
      pagesCount: newSubsiteForm.pagesCount || 3,
      monthlyVisitors: 0,
      conversionRate: '0.0%',
      description: newSubsiteForm.description || 'Deskripsi subsite...',
      heroHeadline: newSubsiteForm.heroHeadline || 'Headline Produk',
      callToAction: newSubsiteForm.callToAction || 'Mulai Sekarang',
      createdDate: new Date().toISOString().substring(0, 10),
      lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      features: newSubsiteForm.features || ['Dukungan Syariah', 'Integrasi API Otomatis']
    };

    setSubsites([created, ...subsites]);
    setIsCreatingNew(false);
    sounds.playSuccess();
    showNotification(`Subsite "${created.name}" berhasil dibuat dan siap dipublikasikan!`);
  };

  // Filtered List
  const filteredSubsites = subsites.filter(sub => {
    const matchesFilter = filterType === 'ALL' || sub.purposeType === filterType;
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.targetProductOrService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalVisitors = subsites.reduce((acc, curr) => acc + curr.monthlyVisitors, 0);
  const productServiceCount = subsites.filter(s => s.purposeType === 'PRODUCT_SERVICE').length;
  const multiLingualCount = subsites.filter(s => s.purposeType === 'MULTILINGUAL').length;

  const getThemeBadgeStyles = (color: SubsiteItem['themeColor']) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'amber': return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'indigo': return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
      case 'sky': return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30';
      case 'purple': return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'rose': return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="subsites-management-module">
      
      {/* Toast Notification Banner */}
      {bannerNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs font-semibold animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{bannerNotice}</span>
          </div>
          <button onClick={() => setBannerNotice(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Subsite Knowledge & Definition Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Site & Subsite Management</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Subsite (Subsites Hub)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              <strong>Subsite</strong> adalah bagian terpisah di dalam ekosistem situs utama yang dibuat untuk <strong>mempromosikan produk atau layanan spesifik</strong> (misal: ZISWAF, Merchant Hub, Tabungan Umrah) atau untuk membangun <strong>situs multi-bahasa</strong> (Multi-lingual seperti Global English & Arabic MENA).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncAllSubsites}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#16161A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Subdomain</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setIsCreatingNew(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Subsite Baru</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Total Subsite Aktif</span>
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {subsites.length} <span className="text-xs font-normal text-slate-400">Sub-domain</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Promosi Produk/Layanan</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {productServiceCount} <span className="text-xs font-normal text-slate-400">Kampanye</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Situs Multi-Bahasa</span>
              <Languages className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {multiLingualCount} <span className="text-xs font-normal text-slate-400">Bahasa (EN, AR)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Total Traffic Gabungan</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {(totalVisitors / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">/bln</span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121215] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08]">
        
        {/* Purpose Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setFilterType('ALL');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Semua Subsite ({subsites.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilterType('PRODUCT_SERVICE');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'PRODUCT_SERVICE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🚀 Promosi Produk & Layanan ({productServiceCount})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilterType('MULTILINGUAL');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'MULTILINGUAL'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🌐 Situs Multi-Bahasa ({multiLingualCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama subsite, produk, URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

      </div>

      {/* Subsites Grid Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSubsites.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all shadow-sm group"
          >
            <div className="space-y-3">
              
              {/* Header Badge Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getThemeBadgeStyles(sub.themeColor)}`}>
                      {sub.purposeType === 'PRODUCT_SERVICE' ? '🚀 Promosi Produk / Layanan' : '🌐 Multi-Lingual Site'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                      {sub.targetLanguage.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>SSL CNAME Active</span>
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  sub.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  {sub.status}
                </span>
              </div>

              {/* Subdomain URL pill with copy action */}
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold truncate">
                    {sub.url}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(sub.url)}
                  title="Salin URL Subsite"
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product/Service Target Banner */}
              <div className="p-2.5 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 block">
                  Fokus Produk / Layanan:
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {sub.targetProductOrService}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              {/* Key Features List */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Fitur Utama Subsite:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {sub.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Metrics and Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-3">
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span>{sub.pagesCount} Halaman</span>
                  <span>•</span>
                  <span>{sub.monthlyVisitors.toLocaleString('id-ID')} Pengunjung/bln</span>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  Konversi: {sub.conversionRate}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setPreviewSubsite(sub);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka / Pratinjau Subsite</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setEditingSubsite(sub);
                    }}
                    title="Edit Konfigurasi Subsite"
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubsite(sub.id, sub.name)}
                    title="Hapus Subsite"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE SUBSITE SANDBOX SIMULATOR (MODAL)            */}
      {/* ======================================================== */}
      {previewSubsite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Simulator Browser Top Bar */}
            <div className="px-5 py-3.5 bg-slate-100 dark:bg-[#16161A] border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate max-w-xs">{previewSubsite.url}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] p-0.5 text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2 py-1 rounded-md flex items-center gap-1 font-semibold ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2 py-1 rounded-md flex items-center gap-1 font-semibold ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <button
                  onClick={() => setPreviewSubsite(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulator Content Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0B0B0D]">
              <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-sm rounded-3xl border-8 border-slate-800 p-4 bg-white dark:bg-[#121215]' : 'max-w-3xl space-y-6'}`}>
                
                {/* Subsite Navigation Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {previewSubsite.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {previewSubsite.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Powered by IslamiCity Platform
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {previewSubsite.targetLanguage.toUpperCase()}
                    </span>
                    <button className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                      Hubungi
                    </button>
                  </div>
                </div>

                {/* Subsite Hero Promo Section */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white space-y-4 relative overflow-hidden my-4">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl" />
                  
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-indigo-300 text-[11px] font-semibold backdrop-blur-xs">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{previewSubsite.targetProductOrService}</span>
                  </div>

                  <h1 className="text-2xl font-black tracking-tight leading-snug">
                    {previewSubsite.heroHeadline}
                  </h1>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {previewSubsite.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        showNotification(`Aksi Promosi "${previewSubsite.callToAction}" berhasil diaktifkan!`);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <span>{previewSubsite.callToAction}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(previewSubsite.url)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
                    >
                      Salin Link Subsite
                    </button>
                  </div>
                </div>

                {/* Subsite Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {previewSubsite.features.map((feature, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                          {feature}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Tersedia di rute khusus subsite {previewSubsite.url}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subsite Live Analytics Footer */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Kunjungan:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {previewSubsite.monthlyVisitors.toLocaleString('id-ID')} /bln
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tingkat Konversi:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {previewSubsite.conversionRate}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 text-[10px] font-mono">
                    Status Server: 200 OK • Global CDN
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="px-6 py-3.5 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Mode Simulasi Subsite Aktif (Interaktif)
              </span>
              <button
                onClick={() => setPreviewSubsite(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90"
              >
                Tutup Pratinjau
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE NEW SUBSITE MODAL                                */}
      {/* ======================================================== */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Buat Subsite Baru (Product / Multi-Lingual)
                </h3>
              </div>
              <button onClick={() => setIsCreatingNew(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Purpose Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 dark:text-white block">
                  Tujuan Utama Pembuatan Subsite:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewSubsiteForm({ ...newSubsiteForm, purposeType: 'PRODUCT_SERVICE' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      newSubsiteForm.purposeType === 'PRODUCT_SERVICE'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-300 font-bold'
                        : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-sm">🚀 Promosi Produk / Layanan</span>
                    <span className="text-[11px] font-normal text-slate-400 mt-1">
                      Untuk kampanye produk khusus (ZISWAF, Merchant POS, Umrah)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSubsiteForm({ ...newSubsiteForm, purposeType: 'MULTILINGUAL' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      newSubsiteForm.purposeType === 'MULTILINGUAL'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-800 dark:text-sky-300 font-bold'
                        : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-sm">🌐 Situs Multi-Bahasa</span>
                    <span className="text-[11px] font-normal text-slate-400 mt-1">
                      Untuk target internasional atau regional (English, Arabic)
                    </span>
                  </button>
                </div>
              </div>

              {/* Subsite Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">
                  Nama Subsite:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tabungan Qurban Digital Syariah"
                  value={newSubsiteForm.name}
                  onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Subdomain & Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Subdomain / URL:
                  </label>
                  <input
                    type="text"
                    placeholder="https://qurban.islamicitypay.id"
                    value={newSubsiteForm.url}
                    onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Bahasa Utama Subsite:
                  </label>
                  <select
                    value={newSubsiteForm.targetLanguage}
                    onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, targetLanguage: e.target.value as Language })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="id">Bahasa Indonesia (ID)</option>
                    <option value="en">English (EN)</option>
                    <option value="ar">العربية (AR)</option>
                  </select>
                </div>
              </div>

              {/* Product/Service Target */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">
                  Produk / Layanan yang Dipromosikan:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Paket Voucher Hewan Qurban 1448 H & Akad Wakalah"
                  value={newSubsiteForm.targetProductOrService}
                  onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, targetProductOrService: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Hero Headline */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">
                  Judul Headline Promosi (Hero Banner):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tunaikan Ibadah Qurban Mudah & Berkah dengan Voucher Digital"
                  value={newSubsiteForm.heroHeadline}
                  onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Call to Action & Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">
                  Tombol Aksi (Call To Action):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Beli Voucher Qurban Sekarang"
                  value={newSubsiteForm.callToAction}
                  onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, callToAction: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">
                  Deskripsi Lengkap Subsite:
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsikan penawaran produk atau jangkauan multi-bahasa subsite ini..."
                  value={newSubsiteForm.description}
                  onChange={(e) => setNewSubsiteForm({ ...newSubsiteForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="px-6 py-4 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCreateSubsite}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-colors"
              >
                Publikasikan Subsite
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT SUBSITE MODAL                                      */}
      {/* ======================================================== */}
      {editingSubsite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Edit Konfigurasi Subsite: {editingSubsite.name}
                </h3>
              </div>
              <button onClick={() => setEditingSubsite(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Nama Subsite:</label>
                <input
                  type="text"
                  value={editingSubsite.name}
                  onChange={(e) => setEditingSubsite({ ...editingSubsite, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Fokus Produk/Layanan:</label>
                <input
                  type="text"
                  value={editingSubsite.targetProductOrService}
                  onChange={(e) => setEditingSubsite({ ...editingSubsite, targetProductOrService: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Headline Banner:</label>
                <input
                  type="text"
                  value={editingSubsite.heroHeadline}
                  onChange={(e) => setEditingSubsite({ ...editingSubsite, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Call to Action (CTA):</label>
                <input
                  type="text"
                  value={editingSubsite.callToAction}
                  onChange={(e) => setEditingSubsite({ ...editingSubsite, callToAction: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Status Subsite:</label>
                <select
                  value={editingSubsite.status}
                  onChange={(e) => setEditingSubsite({ ...editingSubsite, status: e.target.value as SubsiteItem['status'] })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">ACTIVE (Live di Internet)</option>
                  <option value="STAGING">STAGING (Uji Coba Internal)</option>
                  <option value="DRAFT">DRAFT (Dalam Penyusunan)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Pemeliharaan)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingSubsite(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setSubsites(subsites.map(s => s.id === editingSubsite.id ? editingSubsite : s));
                  setEditingSubsite(null);
                  sounds.playSuccess();
                  showNotification(`Perubahan pada subsite "${editingSubsite.name}" berhasil disimpan!`);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
