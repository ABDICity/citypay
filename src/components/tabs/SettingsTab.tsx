import React, { useState } from 'react';
import {
  Settings,
  FolderPlus,
  Image as ImageIcon,
  MessageSquare,
  Palette,
  Code2,
  Menu as MenuIcon,
  Globe,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sparkles,
  Sliders,
  Check,
  X,
  Laptop,
  Smartphone,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  FileCode,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageCircle,
  Clock,
  Layers,
  KeyRound,
  DownloadCloud
} from 'lucide-react';
import { Language } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface SettingsTabProps {
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
}

// ----------------------------------------------------
// 1. MANAGE TAB TYPES (Albums & Comments)
// ----------------------------------------------------
export interface PhotoAlbum {
  id: string;
  title: string;
  description: string;
  category: 'ZISWAF' | 'HALAL_COMMERCE' | 'ARCHITECTURE' | 'EDUCATION' | 'UMRAH';
  coverImage: string;
  photosCount: number;
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  createdDate: string;
  photos: {
    id: string;
    url: string;
    caption: string;
    uploadedAt: string;
    size: string;
  }[];
}

export interface ModeratedComment {
  id: string;
  authorName: string;
  authorEmail: string;
  avatar: string;
  targetType: 'PAGE' | 'BLOG' | 'ALBUM';
  targetTitle: string;
  content: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'FLAGGED' | 'SPAM';
  shariaSafetyScore: number; // 0 - 100
  adminReply?: string;
}

// ----------------------------------------------------
// 2. CUSTOMIZATION TAB TYPES (Templates & Code)
// ----------------------------------------------------
export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgTone: string;
  headingFont: string;
  bodyFont: string;
  arabicFont: string;
  headerStyle: 'STICKY_BLUR' | 'SOLID_BORDER' | 'FLOATING';
  borderRadius: 'PILL' | 'ROUNDED_12' | 'MINIMAL_6' | 'SHARP';
  cardDensity: 'SPACIOUS' | 'COMPACT';
  previewBg: string;
}

// ----------------------------------------------------
// 3. CONFIGURATION TAB TYPES (Menu, Lang, SSL, SEO)
// ----------------------------------------------------
export interface MenuItemConfig {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  isVisible: boolean;
  iconName: string;
  badgeText?: string;
  children?: {
    id: string;
    label: string;
    url: string;
  }[];
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ currentLang, onLanguageChange }) => {
  // Main Sub-Tab in Settings: 'manage' | 'customization' | 'configuration'
  const [mainSubTab, setMainSubTab] = useState<'manage' | 'customization' | 'configuration'>('manage');

  // Secondary sub-tab selections inside each main section
  const [manageSection, setManageSection] = useState<'albums' | 'comments'>('albums');
  const [customizationSection, setCustomizationSection] = useState<'templates' | 'code'>('templates');
  const [configurationSection, setConfigurationSection] = useState<'menu' | 'language' | 'ssl' | 'seo'>('menu');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ====================================================
  // DATA STATE 1: PHOTO ALBUMS & COMMENTS (MANAGE TAB)
  // ====================================================
  const [albums, setAlbums] = useState<PhotoAlbum[]>([
    {
      id: 'ALB-01',
      title: 'Arsitektur Masjid & Pusat Peradaban Islam',
      description: 'Dokumentasi kubah megah, mihrab kaligrafi kufi, dan lanskap pelataran masjid ramah lingkungan.',
      category: 'ARCHITECTURE',
      coverImage: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
      photosCount: 6,
      visibility: 'PUBLIC',
      createdDate: '2026-07-10',
      photos: [
        {
          id: 'P-101',
          url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
          caption: 'Kubah Utama dengan pencahayaan surya modern',
          uploadedAt: '2026-07-10',
          size: '2.8 MB'
        },
        {
          id: 'P-102',
          url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
          caption: 'Detail ornamen ukiran dan kaligrafi Asmaul Husna',
          uploadedAt: '2026-07-11',
          size: '3.4 MB'
        },
        {
          id: 'P-103',
          url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
          caption: 'Pelataran marmer sejuk berkapasitas 5.000 jamaah',
          uploadedAt: '2026-07-12',
          size: '4.1 MB'
        },
        {
          id: 'P-104',
          url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
          caption: 'Perpustakaan digital kitab kuning & manuskrip langka',
          uploadedAt: '2026-07-14',
          size: '2.1 MB'
        }
      ]
    },
    {
      id: 'ALB-02',
      title: 'Penyaluran Bantuan Sembako & Mustahik QRIS',
      description: 'Dokumentasi penyerahan voucher sembako digital kepada 1.200 keluarga dhuafa di Jawa Timur & Madura.',
      category: 'ZISWAF',
      coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
      photosCount: 5,
      visibility: 'PUBLIC',
      createdDate: '2026-08-01',
      photos: [
        {
          id: 'P-201',
          url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
          caption: 'Penyerahan voucher digital sembako berkah QRIS',
          uploadedAt: '2026-08-01',
          size: '3.1 MB'
        },
        {
          id: 'P-202',
          url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
          caption: 'Kebahagiaan penerima manfaat program ZISWAF berdaya',
          uploadedAt: '2026-08-02',
          size: '2.9 MB'
        }
      ]
    },
    {
      id: 'ALB-03',
      title: 'Pelatihan Santripreneur & Halal Business Hub',
      description: 'Workshop penggunaan POS Kasir Syariah dan onboarding QRIS dinamis untuk 150 santri pengusaha pondok.',
      category: 'EDUCATION',
      coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      photosCount: 4,
      visibility: 'PUBLIC',
      createdDate: '2026-08-15',
      photos: [
        {
          id: 'P-301',
          url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
          caption: 'Sesi pengenalan aplikasi POS Kasir Syariah Android',
          uploadedAt: '2026-08-15',
          size: '2.5 MB'
        }
      ]
    },
    {
      id: 'ALB-04',
      title: 'Manasik & Pelepasan Jamaah Umrah Ramadhan',
      description: 'Pemberangkatan 450 jamaah umrah berkah dengan perlindungan rekening escrow syariah wadiah.',
      category: 'UMRAH',
      coverImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
      photosCount: 8,
      visibility: 'PUBLIC',
      createdDate: '2026-08-20',
      photos: [
        {
          id: 'P-401',
          url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
          caption: 'Prosesi thawaf jamaah di pelataran Kaabah Makkah',
          uploadedAt: '2026-08-20',
          size: '4.5 MB'
        }
      ]
    }
  ]);

  const [activeAlbumModal, setActiveAlbumModal] = useState<PhotoAlbum | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumForm, setNewAlbumForm] = useState<Partial<PhotoAlbum>>({
    title: '',
    description: '',
    category: 'ZISWAF',
    coverImage: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
    visibility: 'PUBLIC'
  });

  // Comments State
  const [commentFilter, setCommentFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'FLAGGED' | 'SPAM'>('ALL');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [comments, setComments] = useState<ModeratedComment[]>([
    {
      id: 'COM-01',
      authorName: 'Ustadz Ahmad Fauzi, M.Ag',
      authorEmail: 'ahmad.fauzi@pesantrendigital.id',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      targetType: 'BLOG',
      targetTitle: 'Fatwa DSN-MUI No. 116: Akad Wakalah bil Ujrah pada Voucher Digital',
      content: 'Penjelasan akad dalam artikel ini sangat gamblang dan runtut. Apakah ada pedoman teknis bila terjadi refund voucher jika merchant tutup?',
      createdAt: '2026-08-27 15:42 WIB',
      status: 'APPROVED',
      shariaSafetyScore: 99,
      adminReply: 'Terima kasih Ustadz. Sesuai SOP pasal 4, dana voucher otomatis kembali ke dompet mustahik via akad Kafalah.'
    },
    {
      id: 'COM-02',
      authorName: 'Hj. Siti Rahmah (Koperasi Masjid Al-Falah)',
      authorEmail: 'koperasi.alfalah@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      targetType: 'PAGE',
      targetTitle: 'Pendaftaran Merchant Mitra Halal POS',
      content: 'Alhamdulillah koperasi kami sudah terdaftar dan mesin POS sudah kami terima. Pencairan H+0 ke Bank Syariah sangat membantu perputaran modal warung.',
      createdAt: '2026-08-27 16:10 WIB',
      status: 'APPROVED',
      shariaSafetyScore: 100
    },
    {
      id: 'COM-03',
      authorName: 'Budi Santoso',
      authorEmail: 'budi.santoso99@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      targetType: 'ALBUM',
      targetTitle: 'Penyaluran Bantuan Sembako & Mustahik QRIS',
      content: 'Mohon info bagaimana cara mendaftarkan panti asuhan kami agar bisa mendapatkan alokasi kupon sembako bulan depan?',
      createdAt: '2026-08-27 16:55 WIB',
      status: 'PENDING',
      shariaSafetyScore: 95
    },
    {
      id: 'COM-04',
      authorName: 'Crypto Investment Bot 88',
      authorEmail: 'fastmoney@darkmarket.xyz',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
      targetType: 'BLOG',
      targetTitle: 'Implementasi SNAP-BI Open Banking Syariah',
      content: 'Dapatkan pinjaman kilat tanpa jaminan bunga 0% klik https://bit.ly/pinjol-ilegal-cepat-cair sekarang juga!!',
      createdAt: '2026-08-27 17:05 WIB',
      status: 'FLAGGED',
      shariaSafetyScore: 12
    }
  ]);

  // Comment Moderation Rules Settings
  const [adabFilterEnabled, setAdabFilterEnabled] = useState(true);
  const [autoBlockSpamLinks, setAutoBlockSpamLinks] = useState(true);
  const [autoApproveVerified, setAutoApproveVerified] = useState(true);

  // ====================================================
  // DATA STATE 2: CUSTOMIZATION TAB (TEMPLATES & CODE)
  // ====================================================
  const themePresets: ThemePreset[] = [
    {
      id: 'THEME-EMERALD',
      name: 'Modern Sharia Emerald (Default)',
      tagline: 'Keseimbangan harmoni hijau zamrud, kontras tinggi, dan tipografi elegan.',
      primaryColor: '#059669',
      accentColor: '#14b8a6',
      bgTone: '#0d0d10',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans',
      arabicFont: 'Amiri',
      headerStyle: 'STICKY_BLUR',
      borderRadius: 'ROUNDED_12',
      cardDensity: 'SPACIOUS',
      previewBg: 'from-emerald-950 via-slate-900 to-black'
    },
    {
      id: 'THEME-ANDALUSIA',
      name: 'Classic Andalusian Gold & Ochre',
      tagline: 'Nuansa peradaban emas Cordova dengan aksen emas warm ochre andalusia.',
      primaryColor: '#d97706',
      accentColor: '#fbbf24',
      bgTone: '#12100e',
      headingFont: 'Playfair Display',
      bodyFont: 'Plus Jakarta Sans',
      arabicFont: 'Scheherazade New',
      headerStyle: 'SOLID_BORDER',
      borderRadius: 'MINIMAL_6',
      cardDensity: 'SPACIOUS',
      previewBg: 'from-amber-950 via-slate-900 to-black'
    },
    {
      id: 'THEME-INDIGO',
      name: 'FinTech Indigo & Cyber Cyan',
      tagline: 'Gaya visual modern institusi finansial global dengan high-contrast border.',
      primaryColor: '#4f46e5',
      accentColor: '#06b6d4',
      bgTone: '#0b0c10',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      arabicFont: 'Noto Sans Arabic',
      headerStyle: 'STICKY_BLUR',
      borderRadius: 'PILL',
      cardDensity: 'COMPACT',
      previewBg: 'from-indigo-950 via-slate-900 to-black'
    },
    {
      id: 'THEME-SAPPHIRE',
      name: 'Midnight Sapphire Luxury',
      tagline: 'Elegan, hening dan nyaman di mata dengan kedalaman sapphire blue.',
      primaryColor: '#0284c7',
      accentColor: '#38bdf8',
      bgTone: '#080d1a',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans',
      arabicFont: 'Amiri',
      headerStyle: 'FLOATING',
      borderRadius: 'ROUNDED_12',
      cardDensity: 'SPACIOUS',
      previewBg: 'from-sky-950 via-slate-900 to-black'
    }
  ];

  const [selectedThemeId, setSelectedThemeId] = useState<string>('THEME-EMERALD');
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#059669');
  const [selectedHeadingFont, setSelectedHeadingFont] = useState('Plus Jakarta Sans');
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState<'STICKY_BLUR' | 'SOLID_BORDER' | 'FLOATING'>('STICKY_BLUR');
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<'PILL' | 'ROUNDED_12' | 'MINIMAL_6' | 'SHARP'>('ROUNDED_12');
  const [showShariaWatermark, setShowShariaWatermark] = useState(true);

  // Code Editor State
  const [codeEditorTab, setCodeEditorTab] = useState<'css' | 'head' | 'footer'>('css');
  const [customCssCode, setCustomCssCode] = useState(`/* ============================================================ */
/* IslamiCityPay Custom Style Sheet (style.css)                 */
/* ============================================================ */

:root {
  --islamicity-accent-glow: rgba(5, 150, 105, 0.25);
  --sharia-gold-border: rgba(217, 119, 6, 0.4);
  --font-arabic-quran: 'Amiri', serif;
}

/* Custom Geometric Mosque Motif Pattern */
.islamic-mesh-pattern {
  background-image: radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 0);
  background-size: 24px 24px;
}

/* Smooth Focus Glow for High Security Fields */
.secure-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--islamicity-accent-glow);
  border-color: #059669;
}

/* Halal Verified Seal Animation */
@keyframes shariaPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.badge-sharia-pulse {
  animation: shariaPulse 4s infinite ease-in-out;
}`);

  const [customHeadCode, setCustomHeadCode] = useState(`<!-- Google Tag Manager / Analytics 4 (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ISLAMICITY99"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ISLAMICITY99', { 'anonymize_ip': true });
</script>

<!-- Open Graph Sharia Financial Tags -->
<meta property="og:site_name" content="IslamiCityPay Platform" />
<meta property="og:type" content="financial.service" />
<meta name="sharia-certification-authority" content="DSN-MUI Jakarta" />`);

  const [customFooterCode, setCustomFooterCode] = useState(`<!-- Hijri Calendar Sync & Automated Adhan Widget -->
<script>
  window.islamicDateConfig = {
    method: 'UmmAlQura',
    latitude: -6.2088,
    longitude: 106.8456,
    timeZone: 'Asia/Jakarta'
  };
</script>
<!-- Live Sharia Customer Support Integration -->
<script src="https://cdn.islamicitypay.id/sdk/widget-support.js" defer></script>`);

  // ====================================================
  // DATA STATE 3: CONFIGURATION TAB (MENU, LANG, SSL, SEO)
  // ====================================================

  // 1. Menu Builder State
  const [headerMenuItems, setHeaderMenuItems] = useState<MenuItemConfig[]>([
    {
      id: 'MENU-01',
      label: 'Beranda & Analitik',
      url: '/dashboard',
      isExternal: false,
      isVisible: true,
      iconName: 'LayoutDashboard',
      badgeText: 'LIVE'
    },
    {
      id: 'MENU-02',
      label: 'Kupon & Voucher ZISWAF',
      url: '/vouchers',
      isExternal: false,
      isVisible: true,
      iconName: 'Ticket',
      children: [
        { id: 'SUB-01', label: 'Penyaluran ZISWAF', url: 'https://ziswaf.islamicitypay.id' },
        { id: 'SUB-02', label: 'Paket Umrah Berkah', url: 'https://umrah.islamicitypay.id' },
        { id: 'SUB-03', label: 'Halal Mart POS', url: 'https://merchant.islamicitypay.id' }
      ]
    },
    {
      id: 'MENU-03',
      label: 'Gateway API Perbankan',
      url: '/banking_api',
      isExternal: false,
      isVisible: true,
      iconName: 'Building2',
      badgeText: 'SNAP-BI'
    },
    {
      id: 'MENU-04',
      label: 'Audit & Regulasi DSN-MUI',
      url: '/audit_log',
      isExternal: false,
      isVisible: true,
      iconName: 'FileText'
    },
    {
      id: 'MENU-05',
      label: 'Global English Portal',
      url: 'https://en.islamicitypay.id',
      isExternal: true,
      isVisible: true,
      iconName: 'Globe',
      badgeText: 'EN'
    }
  ]);

  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [newMenuForm, setNewMenuForm] = useState<Partial<MenuItemConfig>>({
    label: '',
    url: '',
    isExternal: false,
    isVisible: true,
    iconName: 'Layers',
    badgeText: ''
  });

  // 2. Language Configuration State
  const [defaultSiteLanguage, setDefaultSiteLanguage] = useState<'id' | 'en' | 'ar'>('id');
  const [enableAutoDetectLocale, setEnableAutoDetectLocale] = useState(true);
  const [enableRtlAutoSwitch, setEnableRtlAutoSwitch] = useState(true);
  const [fallbackLanguage, setFallbackLanguage] = useState<'id' | 'en'>('en');
  const [activeLocales, setActiveLocales] = useState<{ id: boolean; en: boolean; ar: boolean }>({
    id: true,
    en: true,
    ar: true
  });

  // 3. SSL Configuration State
  const [forceHttpsRedirect, setForceHttpsRedirect] = useState(true);
  const [hstsEnabled, setHstsEnabled] = useState(true);
  const [tlsVersion, setTlsVersion] = useState<'TLS_1_2' | 'TLS_1_3_STRICT'>('TLS_1_3_STRICT');
  const [sslCertificateStatus, setSslCertificateStatus] = useState({
    issuer: "Let's Encrypt Authority X3 / Cloudflare Universal Edge",
    commonName: '*.islamicitypay.id',
    validFrom: '2026-01-01',
    validUntil: '2027-01-01 (365 Hari Tersisa)',
    cipherSuite: 'TLS_AES_256_GCM_SHA384 (RSA 4096-bit)',
    status: 'ACTIVE_VALID_200_OK'
  });

  // 4. SEO & Social Share State
  const [seoTitleTemplate, setSeoTitleTemplate] = useState('%title% | IslamiCityPay - Solusi Voucher Digital & Open Banking Syariah');
  const [seoMetaDescription, setSeoMetaDescription] = useState('Platform penerbitan kupon digital halal terenkripsi end-to-end dengan akad Wakalah & Mudharabah sesuai Fatwa DSN-MUI No. 116 & 131, terhubung dengan perbankan syariah via SNAP-BI.');
  const [seoKeywords, setSeoKeywords] = useState('voucher syariah, ziswaf digital, open banking syariah, snap bi, pos kasir halal, fatwa dsn mui, kupon umrah');
  const [googleSearchConsoleCode, setGoogleSearchConsoleCode] = useState('google-site-verification=ISLAMICITY_SECURE_AUTH_2026_TOKEN');
  const [ogImageUrl, setOgImageUrl] = useState('https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&h=630&q=80');
  const [sitemapPingStatus, setSitemapPingStatus] = useState<'IDLE' | 'PINGING' | 'SUCCESS'>('IDLE');

  // ====================================================
  // HANDLERS
  // ====================================================

  // Album Handlers
  const handleSaveCreateAlbum = () => {
    if (!newAlbumForm.title) {
      showToast('Nama album tidak boleh kosong.');
      return;
    }

    const created: PhotoAlbum = {
      id: `ALB-0${albums.length + 1}`,
      title: newAlbumForm.title || 'Album Baru',
      description: newAlbumForm.description || '',
      category: newAlbumForm.category || 'ZISWAF',
      coverImage: newAlbumForm.coverImage || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
      photosCount: 1,
      visibility: newAlbumForm.visibility || 'PUBLIC',
      createdDate: new Date().toISOString().substring(0, 10),
      photos: [
        {
          id: `P-${Date.now()}`,
          url: newAlbumForm.coverImage || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
          caption: 'Foto Sampul Utama Album',
          uploadedAt: new Date().toISOString().substring(0, 10),
          size: '3.2 MB'
        }
      ]
    };

    setAlbums([created, ...albums]);
    setIsCreatingAlbum(false);
    sounds.playSuccess();
    showToast(`Album "${created.title}" berhasil dibuat!`);
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    sounds.playClick();
    setAlbums(albums.filter(a => a.id !== id));
    showToast(`Album "${title}" berhasil dihapus.`);
  };

  // Comment Handlers
  const handleApproveComment = (id: string) => {
    sounds.playSuccess();
    setComments(comments.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
    showToast('Komentar berhasil disetujui dan dipublikasikan!');
  };

  const handleRejectComment = (id: string) => {
    sounds.playClick();
    setComments(comments.map(c => c.id === id ? { ...c, status: 'FLAGGED' } : c));
    showToast('Komentar ditolak / disembunyikan.');
  };

  const handleSpamComment = (id: string) => {
    sounds.playClick();
    setComments(comments.map(c => c.id === id ? { ...c, status: 'SPAM' } : c));
    showToast('Komentar ditandai sebagai SPAM dan pengirim diblokir.');
  };

  const handleDeleteComment = (id: string) => {
    sounds.playClick();
    setComments(comments.filter(c => c.id !== id));
    showToast('Komentar berhasil dihapus permanen.');
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    sounds.playSuccess();
    setComments(comments.map(c => c.id === id ? { ...c, adminReply: replyText, status: 'APPROVED' } : c));
    setReplyingCommentId(null);
    setReplyText('');
    showToast('Balasan resmi admin berhasil dipublikasikan!');
  };

  // Menu Handlers
  const handleMoveMenu = (index: number, direction: 'UP' | 'DOWN') => {
    sounds.playClick();
    const newItems = [...headerMenuItems];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setHeaderMenuItems(newItems);
  };

  const handleToggleMenuVisibility = (id: string) => {
    sounds.playClick();
    setHeaderMenuItems(headerMenuItems.map(m => m.id === id ? { ...m, isVisible: !m.isVisible } : m));
  };

  const handleDeleteMenuItem = (id: string) => {
    sounds.playClick();
    setHeaderMenuItems(headerMenuItems.filter(m => m.id !== id));
    showToast('Item menu berhasil dihapus.');
  };

  const handleAddMenuItem = () => {
    if (!newMenuForm.label || !newMenuForm.url) {
      showToast('Label dan URL menu wajib diisi.');
      return;
    }
    const item: MenuItemConfig = {
      id: `MENU-0${headerMenuItems.length + 1}`,
      label: newMenuForm.label || '',
      url: newMenuForm.url || '',
      isExternal: newMenuForm.isExternal || false,
      isVisible: true,
      iconName: newMenuForm.iconName || 'Layers',
      badgeText: newMenuForm.badgeText || undefined
    };
    setHeaderMenuItems([...headerMenuItems, item]);
    setIsAddingMenuItem(false);
    setNewMenuForm({ label: '', url: '', isExternal: false, isVisible: true });
    sounds.playSuccess();
    showToast(`Menu "${item.label}" berhasil ditambahkan!`);
  };

  // Sitemap Ping
  const handlePingSitemap = () => {
    sounds.playClick();
    setSitemapPingStatus('PINGING');
    setTimeout(() => {
      setSitemapPingStatus('SUCCESS');
      sounds.playSuccess();
      showToast('Sitemap XML (sitemap.xml) berhasil di-ping ke Google Search Console & Bing Bot!');
    }, 1000);
  };

  // Filtered comments
  const filteredComments = comments.filter(c => {
    if (commentFilter === 'ALL') return true;
    return c.status === commentFilter;
  });

  const pendingCommentsCount = comments.filter(c => c.status === 'PENDING').length;

  return (
    <div className="space-y-6 animate-fade-in" id="settings-management-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs font-semibold animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Main Settings Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Portal Control Panel & Customizer</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pengaturan & Kustomisasi Situs (Settings Hub)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Kelola album foto & moderasi komentar di tab <strong>Manage</strong>, kustomisasi template visual & injeksi kode di tab <strong>Customization</strong>, serta kendalikan navigasi menu, bahasa, SSL, dan SEO di tab <strong>Configuration</strong>.
            </p>
          </div>

          {/* Quick Action Info Pill */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                SSL: <strong>TLS 1.3 Active</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Main Sub-Tabs Navigation (Manage | Customization | Configuration) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          
          <button
            onClick={() => {
              sounds.playClick();
              setMainSubTab('manage');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              mainSubTab === 'manage'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.01]'
                : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderPlus className={`w-4 h-4 ${mainSubTab === 'manage' ? 'text-white' : 'text-indigo-500'}`} />
              <div>
                <div className="text-xs font-extrabold">1. Manage Tab</div>
                <div className={`text-[10px] ${mainSubTab === 'manage' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Album Foto & Moderasi Komentar
                </div>
              </div>
            </div>
            {pendingCommentsCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                mainSubTab === 'manage' ? 'bg-white text-indigo-700' : 'bg-amber-500 text-white'
              }`}>
                {pendingCommentsCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setMainSubTab('customization');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              mainSubTab === 'customization'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.01]'
                : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Palette className={`w-4 h-4 ${mainSubTab === 'customization' ? 'text-white' : 'text-amber-500'}`} />
              <div>
                <div className="text-xs font-extrabold">2. Customization Tab</div>
                <div className={`text-[10px] ${mainSubTab === 'customization' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Template Visual & Editor Kode
                </div>
              </div>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              mainSubTab === 'customization' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-500'
            }`}>
              CSS/JS
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setMainSubTab('configuration');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              mainSubTab === 'configuration'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.01]'
                : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className={`w-4 h-4 ${mainSubTab === 'configuration' ? 'text-white' : 'text-emerald-500'}`} />
              <div>
                <div className="text-xs font-extrabold">3. Configuration Tab</div>
                <div className={`text-[10px] ${mainSubTab === 'configuration' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Menu, Bahasa, SSL & SEO
                </div>
              </div>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              mainSubTab === 'configuration' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-500'
            }`}>
              SEO/SSL
            </span>
          </button>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MANAGE TAB (PHOTO ALBUMS & COMMENT MODERATION)        */}
      {/* ======================================================== */}
      {mainSubTab === 'manage' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Sub Navigation between Photo Albums & Comments */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setManageSection('albums');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  manageSection === 'albums'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Kelola Album Foto (Photo Albums)</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {albums.length}
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setManageSection('comments');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  manageSection === 'comments'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Moderasi Komentar (Moderate Comments)</span>
                {pendingCommentsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500 text-white font-bold">
                    {pendingCommentsCount}
                  </span>
                )}
              </button>
            </div>

            {manageSection === 'albums' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsCreatingAlbum(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Album Baru</span>
              </button>
            )}
          </div>

          {/* 1A. PHOTO ALBUMS SECTION */}
          {manageSection === 'albums' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-sm group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white border border-white/20">
                          {album.photosCount} Foto
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/80 text-white mb-1 inline-block">
                          {album.category}
                        </span>
                        <h4 className="text-sm font-extrabold text-white line-clamp-1">
                          {album.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Dibuat: {album.createdDate}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setActiveAlbumModal(album);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Buka Foto</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album.id, album.title)}
                            title="Hapus Album"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1B. MODERATE COMMENTS SECTION */}
          {manageSection === 'comments' && (
            <div className="space-y-4">
              
              {/* Adab Sharia Auto-Filter Control Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Filter & Aturan Moderasi Adab Syariah
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sistem otomatis mendeteksi kata-kata tidak sopan, spam tautan pinjaman/crypto ilegal, dan anomali konten.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={adabFilterEnabled}
                      onChange={(e) => setAdabFilterEnabled(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Filter Kata Kasar</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoBlockSpamLinks}
                      onChange={(e) => setAutoBlockSpamLinks(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Blokir Link Spam</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoApproveVerified}
                      onChange={(e) => setAutoApproveVerified(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Auto-Approve Mitra Terverifikasi</span>
                  </label>
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08]">
                {(['ALL', 'PENDING', 'APPROVED', 'FLAGGED', 'SPAM'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      sounds.playClick();
                      setCommentFilter(status);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      commentFilter === status
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {status === 'ALL' && `Semua Komentar (${comments.length})`}
                    {status === 'PENDING' && `Menunggu Moderasi (${comments.filter(c => c.status === 'PENDING').length})`}
                    {status === 'APPROVED' && `Disetujui (${comments.filter(c => c.status === 'APPROVED').length})`}
                    {status === 'FLAGGED' && `Ditandai (${comments.filter(c => c.status === 'FLAGGED').length})`}
                    {status === 'SPAM' && `Spam (${comments.filter(c => c.status === 'SPAM').length})`}
                  </button>
                ))}
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-[#121215] border transition-all space-y-3 ${
                      comment.status === 'PENDING'
                        ? 'border-amber-500/40 shadow-xs'
                        : comment.status === 'SPAM'
                        ? 'border-rose-500/30 opacity-75'
                        : 'border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={comment.avatar}
                          alt={comment.authorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/[0.1]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {comment.authorName}
                            </span>
                            <span className="text-[11px] text-slate-400">({comment.authorEmail})</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Di {comment.targetType}: <strong className="text-indigo-600 dark:text-indigo-400">{comment.targetTitle}</strong> • {comment.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          comment.shariaSafetyScore >= 90
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          Skor Adab: {comment.shariaSafetyScore}%
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comment.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-600' :
                          comment.status === 'PENDING' ? 'bg-amber-500/15 text-amber-600' :
                          comment.status === 'SPAM' ? 'bg-rose-500/15 text-rose-600' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {comment.status}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{comment.content}"
                    </div>

                    {/* Admin Reply Box if present */}
                    {comment.adminReply && (
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] block">
                          Tanggapan Resmi Admin Syariah:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">
                          {comment.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    {replyingCommentId === comment.id && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Tulis balasan resmi..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-2.5 text-xs rounded-lg bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyingCommentId(null)}
                            className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSendReply(comment.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500"
                          >
                            Kirim Balasan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Moderation Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {comment.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApproveComment(comment.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui (Approve)</span>
                          </button>
                        )}
                        {comment.status !== 'FLAGGED' && (
                          <button
                            onClick={() => handleRejectComment(comment.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        )}
                        {comment.status !== 'SPAM' && (
                          <button
                            onClick={() => handleSpamComment(comment.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Flag className="w-3.5 h-3.5" />
                            <span>Tandai Spam</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setReplyingCommentId(comment.id);
                          }}
                          className="px-3 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Balas</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CUSTOMIZATION TAB (TEMPLATES & CODE INJECTION)        */}
      {/* ======================================================== */}
      {mainSubTab === 'customization' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Sub Navigation: Templates vs Code Editor */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCustomizationSection('templates');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  customizationSection === 'templates'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                <span>Kustomisasi Template & Tema Visual</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCustomizationSection('code');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  customizationSection === 'code'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Editor Kode Kustom (CSS & Script Injector)</span>
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                showToast('Semua perubahan visual & skrip berhasil disimpan dan diterapkan secara langsung!');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Terapkan Live</span>
            </button>
          </div>

          {/* 2A. TEMPLATES & THEME CUSTOMIZER */}
          {customizationSection === 'templates' && (
            <div className="space-y-6">
              
              {/* Preset Cards Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Pilih Preset Tema Website (Theme Presets):
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {themePresets.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedThemeId(theme.id);
                        setCustomPrimaryColor(theme.primaryColor);
                        setSelectedHeadingFont(theme.headingFont);
                        setSelectedHeaderStyle(theme.headerStyle);
                        setSelectedBorderRadius(theme.borderRadius);
                        showToast(`Tema preset "${theme.name}" dipilih.`);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                        selectedThemeId === theme.id
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121215] hover:border-slate-400'
                      }`}
                    >
                      {selectedThemeId === theme.id && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className={`h-16 rounded-xl bg-gradient-to-tr ${theme.previewBg} p-2 flex items-end justify-between border border-white/10`}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                        <span className="text-[10px] font-mono text-white/80 font-bold">{theme.headingFont}</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {theme.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {theme.tagline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Granular Theme Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Color Palette */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Warna Utama (Primary Brand Color)</span>
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-white/20 p-0.5"
                    />
                    <input
                      type="text"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Warna ini otomatis menjadi acuan tombol CTA, badge aktif, dan header aksen.
                  </p>
                </div>

                {/* 2. Typography Pairing */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tipografi Judul (Display Font)</span>
                  </h4>
                  
                  <select
                    value={selectedHeadingFont}
                    onChange={(e) => setSelectedHeadingFont(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                    <option value="Playfair Display">Playfair Display (Klasik Premium)</option>
                    <option value="Outfit">Outfit (High-Tech FinTech)</option>
                    <option value="Amiri">Amiri (Kaligrafi Islamik)</option>
                  </select>

                  <p className="text-[10px] text-slate-400">
                    Mendukung perenderan karakter Latin, Unicode, dan Naskh Syariah.
                  </p>
                </div>

                {/* 3. Layout & Header Style */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gaya Navigasi & Border</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHeaderStyle('STICKY_BLUR')}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        selectedHeaderStyle === 'STICKY_BLUR' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-[#16161A] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Sticky Blur
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHeaderStyle('SOLID_BORDER')}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        selectedHeaderStyle === 'SOLID_BORDER' ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-[#16161A] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Solid Border
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={showShariaWatermark}
                      onChange={(e) => setShowShariaWatermark(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Watermark Kepatuhan DSN-MUI</span>
                  </label>
                </div>

              </div>

            </div>
          )}

          {/* 2B. CODE EDITOR & SCRIPT INJECTION */}
          {customizationSection === 'code' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.08]">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>Editor Kode Langsung (Live Script & Style Injector)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sisipkan custom CSS, tag pelacakan GTM/GA4 di tag <code>&lt;head&gt;</code>, atau skrip widget di <code>&lt;/body&gt;</code>.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#16161A] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
                  <button
                    onClick={() => setCodeEditorTab('css')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      codeEditorTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Custom CSS (style.css)
                  </button>
                  <button
                    onClick={() => setCodeEditorTab('head')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      codeEditorTab === 'head' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Header Scripts (&lt;head&gt;)
                  </button>
                  <button
                    onClick={() => setCodeEditorTab('footer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      codeEditorTab === 'footer' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Footer Scripts (&lt;/body&gt;)
                  </button>
                </div>
              </div>

              {/* Code Box Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Syntax: {codeEditorTab === 'css' ? 'CSS3' : 'HTML / JavaScript'} • UTF-8</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        showToast('Kode berhasil diverifikasi! Tidak ditemukan error sintaks.');
                      }}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Validasi Sintaks</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0a0a0d] overflow-hidden font-mono text-xs shadow-inner">
                  <div className="px-4 py-2 bg-[#121218] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="ml-2 text-slate-300 font-bold">
                        {codeEditorTab === 'css' ? 'custom-styles.css' : codeEditorTab === 'head' ? 'header-inject.html' : 'footer-scripts.js'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400">Auto-Minified on Deploy</span>
                  </div>

                  <textarea
                    rows={12}
                    value={
                      codeEditorTab === 'css' ? customCssCode :
                      codeEditorTab === 'head' ? customHeadCode : customFooterCode
                    }
                    onChange={(e) => {
                      if (codeEditorTab === 'css') setCustomCssCode(e.target.value);
                      else if (codeEditorTab === 'head') setCustomHeadCode(e.target.value);
                      else setCustomFooterCode(e.target.value);
                    }}
                    className="w-full p-4 bg-transparent text-emerald-400 dark:text-emerald-300 font-mono text-xs focus:outline-hidden leading-relaxed resize-y selection:bg-emerald-800 selection:text-white"
                  />
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CONFIGURATION TAB (MENU, LANGUAGE, SSL, SEO)          */}
      {/* ======================================================== */}
      {mainSubTab === 'configuration' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Sub Navigation for Configuration */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2 flex-wrap">
              
              <button
                onClick={() => {
                  sounds.playClick();
                  setConfigurationSection('menu');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  configurationSection === 'menu'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MenuIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Navigasi Menu (Menu)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConfigurationSection('language');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  configurationSection === 'language'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Bahasa & RTL (Language)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConfigurationSection('ssl');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  configurationSection === 'ssl'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sertifikat SSL & Domain</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setConfigurationSection('seo');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  configurationSection === 'seo'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-amber-500" />
                <span>SEO & Social Share</span>
              </button>

            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                showToast('Konfigurasi berhasil disimpan dan disinkronkan ke seluruh server!');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Konfigurasi</span>
            </button>
          </div>

          {/* 3A. MENU CONTROLLER */}
          {configurationSection === 'menu' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Struktur Menu Navigasi Utama (Header Navigation Menu)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Urutkan posisi menu, buat sub-menu dropdown, atau tambahkan tautan subsite baru.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsAddingMenuItem(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item Menu</span>
                </button>
              </div>

              {/* Menu Items Hierarchy List */}
              <div className="space-y-2">
                {headerMenuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex flex-col space-y-2 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {item.label}
                            </span>
                            {item.badgeText && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                {item.badgeText}
                              </span>
                            )}
                            {item.isExternal && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <ExternalLink className="w-2.5 h-2.5" /> Eksternal
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block">
                            {item.url}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Up, Down, Visibility, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveMenu(index, 'UP')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveMenu(index, 'DOWN')}
                          disabled={index === headerMenuItems.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleMenuVisibility(item.id)}
                          className={`p-1.5 rounded-lg ${
                            item.isVisible ? 'text-emerald-500' : 'text-slate-400'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-menu Dropdowns if any */}
                    {item.children && (
                      <div className="ml-10 pl-3 border-l-2 border-indigo-500/20 space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Dropdown Sub-Menu:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {item.children.map((child) => (
                            <div key={child.id} className="p-2 rounded-lg bg-slate-50 dark:bg-[#16161A] text-[11px] flex items-center justify-between">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{child.label}</span>
                              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[100px]">{child.url}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3B. LANGUAGE & LOCALIZATION */}
          {configurationSection === 'language' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <span>Bahasa Utama & Penataan Arah Teks (RTL)</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 dark:text-white">
                      Bahasa Default Portal:
                    </label>
                    <select
                      value={defaultSiteLanguage}
                      onChange={(e) => {
                        const lang = e.target.value as 'id' | 'en' | 'ar';
                        setDefaultSiteLanguage(lang);
                        if (onLanguageChange) onLanguageChange(lang);
                        showToast(`Bahasa default diatur ke ${lang.toUpperCase()}.`);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-bold"
                    >
                      <option value="id">🇮🇩 Bahasa Indonesia (ID) - Default</option>
                      <option value="en">🇬🇧 English Global (EN)</option>
                      <option value="ar">🇸🇦 العربية (Arabic Sharia - RTL)</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableAutoDetectLocale}
                        onChange={(e) => setEnableAutoDetectLocale(e.target.checked)}
                        className="rounded text-sky-600"
                      />
                      <span>Deteksi Otomatis Bahasa Browser Pengunjung (Auto-Locale)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableRtlAutoSwitch}
                        onChange={(e) => setEnableRtlAutoSwitch(e.target.checked)}
                        className="rounded text-sky-600"
                      />
                      <span>Aktifkan Engine RTL (Right-to-Left) untuk Bahasa Arab</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Daftar Bahasa Aktif (Active Multi-Lingual Locales)</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🇮🇩</span>
                      <span className="font-bold text-slate-900 dark:text-white">Bahasa Indonesia</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                      100% Diterjemahkan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span className="font-bold text-slate-900 dark:text-white">English (Global)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                      100% Diterjemahkan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🇸🇦</span>
                      <span className="font-bold text-slate-900 dark:text-white font-arabic">العربية (RTL)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                      100% Diterjemahkan
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 3C. SSL & SECURITY DOMAIN */}
          {configurationSection === 'ssl' && (
            <div className="space-y-6">
              
              {/* SSL Status Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-black border border-emerald-500/30 text-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base">
                        Sertifikat SSL / TLS 1.3 Terenkripsi Aktif
                      </h3>
                      <span className="text-xs text-emerald-400 font-mono">
                        Status: 200 OK • Enkripsi 256-bit GCM
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm shadow-emerald-500/40">
                    SECURED (HTTPS)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono border-t border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Penerbit Sertifikat:</span>
                    <span className="text-slate-200 font-semibold">{sslCertificateStatus.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Domain Terlindungi:</span>
                    <span className="text-emerald-400 font-bold">{sslCertificateStatus.commonName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Masa Berlaku:</span>
                    <span className="text-slate-200 font-semibold">{sslCertificateStatus.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* SSL Controls */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Pengaturan Keamanan Jalur Enkripsi (SSL/TLS Rules)
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        Force HTTPS (Otomatis Alihkan HTTP ke HTTPS)
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Mengirimkan 301 Permanent Redirect untuk semua request HTTP non-aman.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={forceHttpsRedirect}
                      onChange={(e) => setForceHttpsRedirect(e.target.checked)}
                      className="w-5 h-5 rounded text-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06]">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        HSTS (HTTP Strict Transport Security) Preload
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Memaksa browser hanya mengakses situs via HTTPS selama 365 hari (max-age=31536000).
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hstsEnabled}
                      onChange={(e) => setHstsEnabled(e.target.checked)}
                      className="w-5 h-5 rounded text-emerald-600"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 3D. SEO & SOCIAL OPENGRAPH */}
          {configurationSection === 'seo' && (
            <div className="space-y-6">
              
              {/* Google SERP Snippet Preview */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-500" />
                    <span>Pratinjau Hasil Pencarian Google (SERP Preview)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    SEO Score: 98/100
                  </span>
                </div>

                {/* Google Search Card Preview */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <span>https://islamicitypay.id</span>
                    <span>›</span>
                    <span>id</span>
                  </div>
                  <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {seoTitleTemplate.replace('%title%', 'Beranda')}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {seoMetaDescription}
                  </p>
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Meta Tag Global & Deskripsi
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 dark:text-white">
                        Format Judul Halaman (Meta Title Template):
                      </label>
                      <input
                        type="text"
                        value={seoTitleTemplate}
                        onChange={(e) => setSeoTitleTemplate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 dark:text-white">
                        Deskripsi Global (Meta Description):
                      </label>
                      <textarea
                        rows={3}
                        value={seoMetaDescription}
                        onChange={(e) => setSeoMetaDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 dark:text-white">
                        Kata Kunci (SEO Meta Keywords):
                      </label>
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Sitemap & Webmaster Verification */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Verifikasi Webmaster & XML Sitemap
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 dark:text-white">
                        Google Search Console Code:
                      </label>
                      <input
                        type="text"
                        value={googleSearchConsoleCode}
                        onChange={(e) => setGoogleSearchConsoleCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Peta Situs Otomatis (sitemap.xml)
                        </span>
                        <span className="text-[10px] text-emerald-500 font-mono font-bold">
                          18 URLs Terindeks
                        </span>
                      </div>
                      <button
                        onClick={handlePingSitemap}
                        disabled={sitemapPingStatus === 'PINGING'}
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${sitemapPingStatus === 'PINGING' ? 'animate-spin' : ''}`} />
                        <span>{sitemapPingStatus === 'PINGING' ? 'Mengirim Ping...' : 'Ping Google & Bing Sitemaps'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: PHOTO ALBUM VIEWER & UPLOADER                   */}
      {/* ======================================================== */}
      {activeAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeAlbumModal.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {activeAlbumModal.photos.length} Foto dalam album ini • Kategori: {activeAlbumModal.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveAlbumModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              
              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeAlbumModal.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08] aspect-video bg-slate-900"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                      <div className="flex justify-end">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-black/60 font-mono">
                          {photo.size}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload New Photo Drag/Drop Box */}
              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-white/[0.1] rounded-2xl text-center space-y-2 hover:border-indigo-500 transition-colors">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Unggah Foto Baru ke Album Ini
                </div>
                <p className="text-[11px] text-slate-400">
                  Tarik & lepas file foto di sini, atau klik untuk memilih file (Maks 15 MB)
                </p>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Semua foto dioptimalkan otomatis dengan WebP & CDN Caching
              </span>
              <button
                onClick={() => setActiveAlbumModal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl"
              >
                Tutup Album
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CREATE ALBUM MODAL                              */}
      {/* ======================================================== */}
      {isCreatingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Buat Album Foto Baru
                </h3>
              </div>
              <button onClick={() => setIsCreatingAlbum(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Judul Album:</label>
                <input
                  type="text"
                  placeholder="Contoh: Rapat Koordinasi Dewan Pengawas Syariah 1448 H"
                  value={newAlbumForm.title}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Kategori:</label>
                  <select
                    value={newAlbumForm.category}
                    onChange={(e) => setNewAlbumForm({ ...newAlbumForm, category: e.target.value as PhotoAlbum['category'] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="ZISWAF">ZISWAF & Filantropi</option>
                    <option value="HALAL_COMMERCE">Halal Mart & UMKM</option>
                    <option value="ARCHITECTURE">Arsitektur & Masjid</option>
                    <option value="EDUCATION">Pendidikan Santri</option>
                    <option value="UMRAH">Umrah & Haji</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white">Visibilitas:</label>
                  <select
                    value={newAlbumForm.visibility}
                    onChange={(e) => setNewAlbumForm({ ...newAlbumForm, visibility: e.target.value as PhotoAlbum['visibility'] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="PUBLIC">Publik (Terbuka untuk Umum)</option>
                    <option value="PRIVATE">Privat (Hanya Internal Admin)</option>
                    <option value="RESTRICTED">Terbatas (Mitra Terverifikasi)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">URL Foto Sampul (Cover Image):</label>
                <input
                  type="text"
                  value={newAlbumForm.coverImage}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Deskripsi Album:</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan isi kegiatan dalam album ini..."
                  value={newAlbumForm.description}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsCreatingAlbum(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCreateAlbum}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs"
              >
                Buat & Simpan Album
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD MENU ITEM MODAL                             */}
      {/* ======================================================== */}
      {isAddingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-md w-full flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Tambah Item Menu Navigasi
              </h3>
              <button onClick={() => setIsAddingMenuItem(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Label Menu:</label>
                <input
                  type="text"
                  placeholder="Contoh: Konsultasi Dewan Syariah"
                  value={newMenuForm.label}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Target URL / Route:</label>
                <input
                  type="text"
                  placeholder="Contoh: /ai_advisor atau https://ziswaf.islamicitypay.id"
                  value={newMenuForm.url}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-white">Badge Tag (Opsional):</label>
                <input
                  type="text"
                  placeholder="Contoh: BARU atau 2026"
                  value={newMenuForm.badgeText}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, badgeText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={newMenuForm.isExternal}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, isExternal: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>Buka di Tab Baru (External Link)</span>
              </label>
            </div>

            <div className="px-6 py-4 bg-slate-100 dark:bg-[#16161A] border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddingMenuItem(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleAddMenuItem}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
              >
                Tambahkan Menu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
