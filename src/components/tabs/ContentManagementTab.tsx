import React, { useState } from 'react';
import { 
  FileText, 
  FolderOpen, 
  BookOpen, 
  Inbox, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  UploadCloud, 
  Image as ImageIcon, 
  FileCode, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Sparkles, 
  Download, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  AlertCircle, 
  Check,
  Filter,
  Layers,
  ArrowUpRight,
  HardDrive,
  MessageSquare,
  Mail,
  Phone,
  Paperclip,
  Share2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Language } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { SubsitesManagement } from './SubsitesManagement';
import { Layout, Palette, Sparkles as SparklesIcon } from 'lucide-react';

interface ContentManagementTabProps {
  currentLang: Language;
  onOpenWebsiteEditor?: () => void;
}

type ContentSubTab = 'pages' | 'subsites' | 'files' | 'blogs' | 'forms';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  lastModified: string;
  author: string;
  layout: 'Landing / Hero' | 'Ledger & Analytics' | 'Interactive Simulator' | 'Docs / Compliance' | 'Standard View';
  description: string;
  views: number;
}

interface MediaFileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'vector' | 'archive';
  size: string;
  dimensions?: string;
  uploadedAt: string;
  url: string;
  source: 'Local Upload' | 'Integrated Library' | 'System Asset';
  category: 'Branding' | 'Halal Certificates' | 'Voucher Templates' | 'Banners' | 'Documentation';
  thumbnailUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Edukasi Syariah' | 'Teknologi Finansial' | 'ZISWAF & Filantropi' | 'Panduan Merchant' | 'Regulasi DSN-MUI';
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  publishedAt: string;
  author: string;
  readTime: string;
  views: number;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage: string;
}

interface FormSubmission {
  id: string;
  formType: 'Pendaftaran Merchant Syariah' | 'Pengajuan Voucher ZISWAF' | 'Konsultasi Dewan Syariah' | 'Layanan Pengaduan Nasabah' | 'Kemitraan Perbankan';
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  institution?: string;
  status: 'BARU' | 'DITINJAU' | 'DISETUJUI' | 'SELESAI';
  submittedAt: string;
  payload: Record<string, string>;
  notes?: string;
}

export const ContentManagementTab: React.FC<ContentManagementTabProps> = ({ currentLang, onOpenWebsiteEditor }) => {
  const [subTab, setSubTab] = useState<ContentSubTab>('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedFileFilter, setSelectedFileFilter] = useState<'ALL' | 'image' | 'document' | 'vector' | 'archive'>('ALL');
  const [mediaLibraryFilter, setMediaLibraryFilter] = useState<'ALL' | 'uploads' | 'library'>('ALL');

  // Interactive Edit & View Modals
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [viewingForm, setViewingForm] = useState<FormSubmission | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaFileItem | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Initial Pages
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: 'PAGE-01',
      title: 'Pusat Analitik & Dashboard Eksekutif',
      slug: '/',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 17:01:54 UTC',
      author: 'Dewan Teknologi IslamiCity',
      layout: 'Ledger & Analytics',
      description: 'Halaman dashboard utama untuk monitoring likuiditas, peredaran voucher syariah, dan telemetri server.',
      views: 14280,
    },
    {
      id: 'PAGE-02',
      title: 'Ledger Voucher Digital & Penerbitan Akad',
      slug: '/vouchers',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 16:58:10 UTC',
      author: 'Sharia Compliance Officer',
      layout: 'Interactive Tool',
      description: 'Pusat manajemen dan penerbitan voucher digital dengan verifikasi akad Wakalah, Mudharabah, dan Wadiah.',
      views: 9850,
    },
    {
      id: 'PAGE-03',
      title: 'Pusat Keamanan Kriptografis & Konsol 2FA',
      slug: '/security',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 16:45:22 UTC',
      author: 'Cyber Security Admin',
      layout: 'Docs / Compliance',
      description: 'Pengaturan enkripsi AES-256-GCM, rotasi kunci kriptografi, dan segel anti-tamper SHA-256.',
      views: 4520,
    },
    {
      id: 'PAGE-04',
      title: 'Gateway Integrasi SNAP-BI & API Bank Syariah',
      slug: '/banking-api',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 16:30:00 UTC',
      author: 'Fintech Integration Lead',
      layout: 'Standard View',
      description: 'Dokumentasi interaktif dan sandbox uji API Open Banking SNAP-BI dan BI-FAST syariah.',
      views: 6310,
    },
    {
      id: 'PAGE-05',
      title: 'Jejak Audit Forensik & Kepatuhan DSN-MUI',
      slug: '/audit-log',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 16:15:40 UTC',
      author: 'Auditor Eksternal DSN-MUI',
      layout: 'Docs / Compliance',
      description: 'Pencatatan aktivitas sistem yang tidak dapat diubah (immutable) sesuai standar OJK & Bank Indonesia.',
      views: 3190,
    },
    {
      id: 'PAGE-06',
      title: 'Simulator Dompet Digital Syariah & POS Merchant',
      slug: '/mobile-wallet',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 16:00:15 UTC',
      author: 'UX & Product Team',
      layout: 'Interactive Simulator',
      description: 'Simulasi aplikasi mobile pengguna dan kasir POS merchant syariah dengan pemindaian QRIS dinamis.',
      views: 8940,
    },
    {
      id: 'PAGE-07',
      title: 'Konsultan AI Fatwa & Asisten Kepatuhan Syariah',
      slug: '/ai-advisor',
      status: 'PUBLISHED',
      lastModified: '2026-08-27 15:50:30 UTC',
      author: 'AI Research Unit',
      layout: 'Interactive Tool',
      description: 'Layanan konsultasi fatwa digital interaktif yang merujuk pada regulasi DSN-MUI dan fikih muamalah kontemporer.',
      views: 11200,
    },
  ]);

  // Files & Integrated Image Library
  const [files, setFiles] = useState<MediaFileItem[]>([
    {
      id: 'FILE-01',
      name: 'islamicitypay-master-logo.svg',
      type: 'vector',
      size: '28.4 KB',
      dimensions: '512x512',
      uploadedAt: '2026-08-27 14:10:00',
      url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
      source: 'System Asset',
      category: 'Branding',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'FILE-02',
      name: 'sertifikat-dsn-mui-fatwa-116.pdf',
      type: 'document',
      size: '1.45 MB',
      uploadedAt: '2026-08-26 10:20:00',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      source: 'Local Upload',
      category: 'Halal Certificates',
    },
    {
      id: 'FILE-03',
      name: 'banner-voucher-ramadhan-berkah.jpg',
      type: 'image',
      size: '420 KB',
      dimensions: '1920x1080',
      uploadedAt: '2026-08-25 18:30:00',
      url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Banners',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'FILE-04',
      name: 'ziswaf-community-empowerment.jpg',
      type: 'image',
      size: '315 KB',
      dimensions: '1200x800',
      uploadedAt: '2026-08-24 11:00:00',
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Voucher Templates',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'FILE-05',
      name: 'masjid-nabawi-gold-pattern.png',
      type: 'image',
      size: '890 KB',
      dimensions: '2048x1536',
      uploadedAt: '2026-08-23 09:15:00',
      url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Voucher Templates',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'FILE-06',
      name: 'panduan-integrasi-open-banking-snap.pdf',
      type: 'document',
      size: '3.80 MB',
      uploadedAt: '2026-08-22 16:40:00',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      source: 'Local Upload',
      category: 'Documentation',
    },
  ]);

  // Integrated Image Library Presets (Curated Islamic & FinTech Collection)
  const integratedLibraryAssets: MediaFileItem[] = [
    {
      id: 'LIB-01',
      name: 'islamic-geometric-mosaic-emerald.jpg',
      type: 'image',
      size: '560 KB',
      dimensions: '1920x1080',
      uploadedAt: '2026-08-27 10:00:00',
      url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Voucher Templates',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'LIB-02',
      name: 'umrah-pilgrims-makkah.jpg',
      type: 'image',
      size: '680 KB',
      dimensions: '2400x1600',
      uploadedAt: '2026-08-27 10:00:00',
      url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Banners',
      thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'LIB-03',
      name: 'halal-culinary-market-fresh.jpg',
      type: 'image',
      size: '410 KB',
      dimensions: '1600x1200',
      uploadedAt: '2026-08-27 10:00:00',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Voucher Templates',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'LIB-04',
      name: 'fintech-crypto-security-nodes.jpg',
      type: 'image',
      size: '495 KB',
      dimensions: '1920x1080',
      uploadedAt: '2026-08-27 10:00:00',
      url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      source: 'Integrated Library',
      category: 'Branding',
      thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=300&q=80',
    },
  ];

  // Blogs & Sharia Knowledge Articles
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: 'BLOG-01',
      title: 'Harmonisasi Akad Wakalah bil Ujrah pada Sistem Voucher Digital Syariah',
      slug: 'harmonisasi-akad-wakalah-bil-ujrah-voucher-digital',
      category: 'Edukasi Syariah',
      status: 'PUBLISHED',
      publishedAt: '2026-08-25',
      author: 'Dr. Ahmad Zaki, M.E.I (Pakar Muamalah)',
      readTime: '6 min read',
      views: 3420,
      excerpt: 'Tinjauan mendalam mengenai penerapan fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 dalam transaksi penerbitan voucher digital tanpa unsur riba dan gharar.',
      content: 'Perkembangan ekonomi digital menuntut inovasi instrumen penyaluran dana yang patuh syariah. Akad Wakalah bil Ujrah memberikan landasan hukum yang kokoh di mana penerbit bertindak sebagai wakil yang menerima imbalan jasa (ujrah) yang transparan dan terukur tanpa mengenakan bunga tersembunyi...',
      tags: ['DSN-MUI', 'Wakalah', 'Ujrah', 'FinTech Syariah'],
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'BLOG-02',
      title: 'Mengenal Standardisasi SNAP-BI Syariah untuk Interoperabilitas Open Banking',
      slug: 'standardisasi-snap-bi-syariah-open-banking',
      category: 'Teknologi Finansial',
      status: 'PUBLISHED',
      publishedAt: '2026-08-20',
      author: 'Fajar Pratama, S.Kom (Fintech Engineer)',
      readTime: '8 min read',
      views: 2890,
      excerpt: 'Bagaimana Standar Nasional Open API Pembayaran (SNAP) Bank Indonesia diterapkan untuk transaksi keuangan syariah yang aman dan real-time.',
      content: 'Integrasi API perbankan nasional kini mengadopsi standar SNAP-BI. Melalui protokol enkripsi HMAC-SHA256 dan sertifikat digital RSA-2048, ekosistem voucher dapat berinteraksi langsung dengan core banking syariah (BSI, Muamalat, dsb) secara efisien...',
      tags: ['SNAP-BI', 'Bank Indonesia', 'Open Banking', 'API'],
      coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'BLOG-03',
      title: 'Strategi Optimalisasi Penyaluran Zakat & Infaq Berbasis Voucher QRIS',
      slug: 'optimalisasi-penyaluran-zakat-infaq-voucher-qris',
      category: 'ZISWAF & Filantropi',
      status: 'PUBLISHED',
      publishedAt: '2026-08-15',
      author: 'H. Ridwan Malik (Direktur Lazis)',
      readTime: '5 min read',
      views: 4120,
      excerpt: 'Meningkatkan akuntabilitas dan kecepatan distribusi bantuan kemanusiaan kepada mustahik melalui kupon digital terverifikasi.',
      content: 'Penyaluran ZISWAF secara non-tunai melalui voucher digital menjamin dana zakat hanya dapat dibelanjakan pada merchant halal terverifikasi, mencegah penyalahgunaan dana dan memastikan 100% tepat sasaran...',
      tags: ['ZISWAF', 'Mustahik', 'QRIS', 'Filantropi'],
      coverImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  // Form Submissions (Leads, Merchant Signups, Consultations)
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([
    {
      id: 'FORM-101',
      formType: 'Pendaftaran Merchant Syariah',
      senderName: 'Ustadz Danang Suryo',
      senderEmail: 'danang@halalmart-jogja.com',
      senderPhone: '+62 812-3344-5566',
      institution: 'Halal Mart Berkah Nusantara, Yogyakarta',
      status: 'BARU',
      submittedAt: '2026-08-27 16:20:11',
      payload: {
        'Nama Usaha': 'Halal Mart Berkah Nusantara',
        'Kategori': 'Sembako & Produk Halal',
        'Nomor NIB': '9120003849102',
        'Sertifikat Halal BPJPH': 'ID3111000049281',
        'Rekening Pencairan': 'BSI (Bank Syariah Indonesia) - 7149204812',
        'Estimasi Transaksi': 'Rp 50.000.000 / bulan',
      },
      notes: 'Calon merchant mengajukan integrasi POS kasir untuk menerima voucher ZISWAF dan santunan yatim.',
    },
    {
      id: 'FORM-102',
      formType: 'Pengajuan Voucher ZISWAF',
      senderName: 'Siti Aminah, S.Pd',
      senderEmail: 'siti.aminah@pesantren-alikhlas.org',
      senderPhone: '+62 856-7890-1234',
      institution: 'Yayasan Pesantren Al-Ikhlas Bandung',
      status: 'DITINJAU',
      submittedAt: '2026-08-27 14:05:45',
      payload: {
        'Nama Program': 'Beasiswa Pendidikan Santri Dhuafa 2026',
        'Jumlah Penerima': '85 Santri',
        'Total Nominal yang Diajukan': 'Rp 42.500.000',
        'Akad yang Dipilih': 'Hibah / Tabarru',
        'Durasi Validitas': '6 Bulan',
      },
      notes: 'Verifikasi berkas kemustahikan sedang diperiksa oleh Divisi Penyaluran Lazis.',
    },
    {
      id: 'FORM-103',
      formType: 'Konsultasi Dewan Syariah',
      senderName: 'Bambang Irawan, M.Si',
      senderEmail: 'bambang.irawan@koperasi-syariah.co.id',
      senderPhone: '+62 813-9988-7766',
      institution: 'BMT Mandiri Syariah Sejahtera',
      status: 'DISETUJUI',
      submittedAt: '2026-08-26 11:30:20',
      payload: {
        'Topik Konsultasi': 'Penerapan Skema Mudharabah Muqayyadah pada Voucher Tabungan Qurban',
        'Lampiran Draft Akad': 'draft_akad_qurban_v2.docx',
        'Jadwal Sidang Online': '28 Agustus 2026, 14:00 WIB',
      },
      notes: 'Disetujui untuk sesi telaah fatwa bersama Anggota DSN-MUI via Google Meet.',
    },
    {
      id: 'FORM-104',
      formType: 'Kemitraan Perbankan',
      senderName: 'Farhan Maulana',
      senderEmail: 'f.maulana@bank-syariah.co.id',
      senderPhone: '+62 821-4455-6677',
      institution: 'PT Bank Mega Syariah - Divisi Digital Banking',
      status: 'SELESAI',
      submittedAt: '2026-08-25 09:15:30',
      payload: {
        'Jenis Kerjasama': 'Direct Host-to-Host SNAP-BI Settlement',
        'Protokol': 'REST API / HMAC-SHA256',
        'Target Go-Live': 'September 2026',
      },
      notes: 'MoU & PKS Kerjasama telah ditandatangani secara digital.',
    },
  ]);

  const showBanner = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 3500);
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    sounds.playClick();
    showBanner('Link berhasil disalin ke papan klip!');
    setTimeout(() => setCopySuccess(null), 2500);
  };

  // Import asset from library to active files
  const handleImportLibraryAsset = (asset: MediaFileItem) => {
    sounds.playClick();
    if (files.some(f => f.name === asset.name)) {
      showBanner('Berkas ini sudah ada di daftar unggahan Anda.');
      return;
    }
    const newFile: MediaFileItem = {
      ...asset,
      id: `FILE-${Date.now()}`,
      source: 'Integrated Library',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setFiles([newFile, ...files]);
    sounds.playSuccess();
    showBanner(`Berkas "${asset.name}" berhasil diimpor dari Library!`);
  };

  // Delete Handlers
  const handleDeletePage = (id: string) => {
    sounds.playClick();
    setPages(pages.filter(p => p.id !== id));
    showBanner('Halaman berhasil dihapus.');
  };

  const handleDeleteFile = (id: string) => {
    sounds.playClick();
    setFiles(files.filter(f => f.id !== id));
    showBanner('Berkas berhasil dihapus.');
  };

  const handleDeleteBlog = (id: string) => {
    sounds.playClick();
    setBlogs(blogs.filter(b => b.id !== id));
    showBanner('Artikel blog berhasil dihapus.');
  };

  const handleUpdateFormStatus = (id: string, newStatus: FormSubmission['status']) => {
    sounds.playClick();
    setFormSubmissions(formSubmissions.map(f => f.id === id ? { ...f, status: newStatus } : f));
    if (viewingForm && viewingForm.id === id) {
      setViewingForm({ ...viewingForm, status: newStatus });
    }
    showBanner(`Status formulir diperbarui menjadi ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="content-management-module">
      
      {/* Top Banner Notice if active */}
      {notificationBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button onClick={() => setNotificationBanner(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Main Header with Navigation Tabs */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Konten Terpadu (CMS)</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Konten & Formulir IslamiCity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Kelola seluruh halaman publik, berkas & perpustakaan visual syariah, artikel edukasi/blog, serta data formulir kemitraan dan ZISWAF yang masuk secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenWebsiteEditor && (
              <button
                id="cms-open-drag-drop-editor-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenWebsiteEditor();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <Layout className="w-4 h-4" />
                <span>Go to Editor (Drag & Drop)</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                showBanner('Data konten disinkronkan dengan CDN Edge Server.');
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#16161A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sinkron CDN</span>
            </button>
          </div>
        </div>

        {/* 4 Main Subtabs: Pages, Files, Blogs, Forms */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          
          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('pages');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              subTab === 'pages'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-white/[0.06]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pages (Halaman Website)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${subTab === 'pages' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}>
              {pages.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('subsites');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              subTab === 'subsites'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-white/[0.06]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Subsites (Promosi & Multi-Bahasa)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${subTab === 'subsites' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}>
              5
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('files');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              subTab === 'files'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-white/[0.06]'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Files & Galeri Visual</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${subTab === 'files' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}>
              {files.length + integratedLibraryAssets.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('blogs');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              subTab === 'blogs'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-white/[0.06]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blogs (Artikel & Fatwa)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${subTab === 'blogs' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}>
              {blogs.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('forms');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              subTab === 'forms'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-white/[0.06]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Forms (Data Masuk)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${subTab === 'forms' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}>
              {formSubmissions.length}
            </span>
            {formSubmissions.filter(f => f.status === 'BARU').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. PAGES TAB                                             */}
      {/* ======================================================== */}
      {subTab === 'pages' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Action Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121215] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul halaman atau rute slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] focus:outline-hidden focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onOpenWebsiteEditor && (
                <button
                  id="cms-pages-go-to-editor-btn"
                  onClick={() => {
                    sounds.playClick();
                    onOpenWebsiteEditor();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
                >
                  <Layout className="w-4 h-4" />
                  <span>Go to Editor (Beranda)</span>
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  const newP: PageItem = {
                    id: `PAGE-0${pages.length + 1}`,
                    title: 'Halaman Layanan Baru',
                    slug: `/layanan-${pages.length + 1}`,
                    status: 'DRAFT',
                    lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                    author: 'Admin Editor',
                    layout: 'Standard View',
                    description: 'Deskripsi singkat halaman baru untuk ekosistem syariah.',
                    views: 0,
                  };
                  setPages([...pages, newP]);
                  setEditingPage(newP);
                  sounds.playSuccess();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Halaman Baru</span>
              </button>
            </div>
          </div>

          {/* Pages Grid / Table */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4">Nama Halaman</th>
                    <th className="py-3 px-3">Rute URL / Slug</th>
                    <th className="py-3 px-3">Tata Letak</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Pengunjung</th>
                    <th className="py-3 px-3">Terakhir Diubah</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {pages
                    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          <div>{page.title}</div>
                          <div className="text-[11px] font-normal text-slate-400 line-clamp-1">{page.description}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {page.slug}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                            {page.layout}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            page.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {page.views.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-slate-400 font-mono">
                          {page.lastModified}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          {page.slug === '/' && onOpenWebsiteEditor && (
                            <button
                              onClick={() => {
                                sounds.playClick();
                                onOpenWebsiteEditor();
                              }}
                              title="Go to Drag-and-Drop Visual Editor"
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-extrabold inline-flex items-center gap-1 transition-colors mr-1"
                            >
                              <Layout className="w-3 h-3" />
                              <span>Go to Editor</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setEditingPage(page);
                            }}
                            title="Edit Halaman"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyLink(window.location.origin + page.slug)}
                            title="Salin Link Halaman"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            title="Hapus Halaman"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUBSITES (PROMOTION & MULTI-LINGUAL) TAB              */}
      {/* ======================================================== */}
      {subTab === 'subsites' && (
        <SubsitesManagement currentLang={currentLang} />
      )}

      {/* ======================================================== */}
      {/* 3. FILES & INTEGRATED IMAGE LIBRARY TAB                  */}
      {/* ======================================================== */}
      {subTab === 'files' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Upload Area & Integrated Library Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Quick Upload Dropzone */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-dashed border-slate-300 dark:border-white/[0.15] flex flex-col items-center justify-center text-center space-y-3 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Unggah Berkas atau Gambar Baru
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tarik & lepas berkas PDF, PNG, JPG, atau SVG (Maks. 25 MB)
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  const sampleFile: MediaFileItem = {
                    id: `FILE-${Date.now()}`,
                    name: `dokumen-akad-syariah-${Math.floor(Math.random() * 900 + 100)}.pdf`,
                    type: 'document',
                    size: '1.18 MB',
                    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
                    source: 'Local Upload',
                    category: 'Halal Certificates',
                  };
                  setFiles([sampleFile, ...files]);
                  sounds.playSuccess();
                  showBanner(`Berkas "${sampleFile.name}" berhasil diunggah!`);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-105"
              >
                Pilih Berkas dari Komputer
              </button>
            </div>

            {/* Integrated Image Library Showcase */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        Perpustakaan Visual & Aset Syariah Terintegrasi (Integrated Library)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Koleksi foto resolusi tinggi berlisensi resmi: arsitektur masjid, ibadah haji/umrah, pasar halal, dan ZISWAF
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    4 Kurasi Pilihan
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
                  {integratedLibraryAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08] aspect-4/3 bg-slate-900"
                    >
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[10px] font-bold truncate">{asset.name}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px] text-emerald-400 font-mono">{asset.size}</span>
                          <button
                            onClick={() => handleImportLibraryAsset(asset)}
                            title="Gunakan Aset Ini"
                            className="px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold"
                          >
                            + Pakai
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span>Format yang Didukung: WebP, PNG, JPG, SVG, PDF</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Bebas Hak Cipta Komersial</span>
              </div>
            </div>

          </div>

          {/* Files Filter & Gallery List */}
          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Daftar Berkas Terunggah:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                  {files.length} Berkas
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(['ALL', 'image', 'document', 'vector'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedFileFilter(filterType);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      selectedFileFilter === filterType
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {filterType === 'ALL' ? 'Semua Tipe' : filterType.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Files Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {files
                .filter(f => selectedFileFilter === 'ALL' || f.type === selectedFileFilter)
                .map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between space-y-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-[#202026] flex items-center justify-center shrink-0 overflow-hidden">
                        {file.thumbnailUrl ? (
                          <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
                        ) : file.type === 'document' ? (
                          <FileText className="w-5 h-5 text-rose-500" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate" title={file.name}>
                          {file.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.category}</span>
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                          {file.source}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => handleCopyLink(file.url)}
                        className="text-[11px] text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-semibold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin URL</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-blue-500"
                          title="Lihat Berkas"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500"
                          title="Hapus Berkas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. BLOGS TAB (ARTIKEL, EDUKASI & FATWA)                  */}
      {/* ======================================================== */}
      {subTab === 'blogs' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121215] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul artikel, topik akad, atau fatwa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] focus:outline-hidden focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                const newArticle: BlogPost = {
                  id: `BLOG-0${blogs.length + 1}`,
                  title: 'Judul Artikel Edukasi Syariah Baru',
                  slug: `artikel-syariah-baru-${blogs.length + 1}`,
                  category: 'Edukasi Syariah',
                  status: 'DRAFT',
                  publishedAt: new Date().toISOString().substring(0, 10),
                  author: 'Tim Riset Muamalah',
                  readTime: '4 min read',
                  views: 0,
                  excerpt: 'Tuliskan rangkuman ringkas tentang topik syariah atau keuangan Islam di sini...',
                  content: 'Isi lengkap artikel syariah dan panduan operasional...',
                  tags: ['Syariah', 'Inovasi', 'Voucher'],
                  coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
                };
                setBlogs([newArticle, ...blogs]);
                setEditingBlog(newArticle);
                sounds.playSuccess();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogs
              .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col justify-between shadow-sm hover:border-emerald-500/40 transition-all"
                >
                  <div className="aspect-16/9 w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-emerald-300 backdrop-blur-xs border border-white/10">
                      {post.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      {post.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                        {post.title}
                      </h4>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-mono">{post.views.toLocaleString('id-ID')} views</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setEditingBlog(post);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FORMS TAB (SUBMITTED FORM DATA & LEADS)               */}
      {/* ======================================================== */}
      {subTab === 'forms' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121215] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama pemohon, instansi, atau tipe formulir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] focus:outline-hidden focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Total Pengajuan:</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono border border-emerald-500/20">
                {formSubmissions.length} Data Masuk
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4">Tipe Formulir</th>
                    <th className="py-3 px-3">Nama Pemohon & Kontak</th>
                    <th className="py-3 px-3">Instansi / Lembaga</th>
                    <th className="py-3 px-3">Waktu Masuk</th>
                    <th className="py-3 px-3">Status Respon</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {formSubmissions
                    .filter(f => 
                      f.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      f.formType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (f.institution && f.institution.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{item.formType}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">{item.id}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-200">{item.senderName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{item.senderEmail}</span>
                            <span>•</span>
                            <span className="font-mono">{item.senderPhone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                          {item.institution || '-'}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                          {item.submittedAt}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'BARU'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                              : item.status === 'DITINJAU'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : item.status === 'DISETUJUI'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 border-slate-200 dark:border-white/[0.08]'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setViewingForm(item);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] transition-colors"
                          >
                            Buka Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PAGE                                         */}
      {/* ======================================================== */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121215] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Edit Pengaturan Halaman: {editingPage.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Judul Halaman</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Rute URL / Slug</label>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-emerald-600 dark:text-emerald-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Status Publikasi</label>
                  <select
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as PageItem['status'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="PUBLISHED">PUBLISHED (Aktif)</option>
                    <option value="DRAFT">DRAFT (Konsep)</option>
                    <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tipe Tata Letak</label>
                  <select
                    value={editingPage.layout}
                    onChange={(e) => setEditingPage({ ...editingPage, layout: e.target.value as PageItem['layout'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="Standard View">Standard View</option>
                    <option value="Ledger & Analytics">Ledger & Analytics</option>
                    <option value="Interactive Simulator">Interactive Simulator</option>
                    <option value="Docs / Compliance">Docs / Compliance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Deskripsi Ringkas SEO</label>
                <textarea
                  rows={3}
                  value={editingPage.description}
                  onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex items-center justify-between gap-2">
              <div>
                {onOpenWebsiteEditor && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setEditingPage(null);
                      onOpenWebsiteEditor();
                    }}
                    className="px-3.5 py-2 rounded-lg text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span>Buka Drag & Drop Editor</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.06]"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setPages(pages.map(p => p.id === editingPage.id ? editingPage : p));
                    setEditingPage(null);
                    sounds.playSuccess();
                    showBanner(`Perubahan halaman "${editingPage.title}" berhasil disimpan!`);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT BLOG POST                                    */}
      {/* ======================================================== */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121215] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Editor Artikel: {editingBlog.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Judul Artikel</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kategori Syariah</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as BlogPost['category'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="Edukasi Syariah">Edukasi Syariah</option>
                    <option value="Teknologi Finansial">Teknologi Finansial</option>
                    <option value="ZISWAF & Filantropi">ZISWAF & Filantropi</option>
                    <option value="Panduan Merchant">Panduan Merchant</option>
                    <option value="Regulasi DSN-MUI">Regulasi DSN-MUI</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as BlogPost['status'] })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                  >
                    <option value="PUBLISHED">PUBLISHED (Terbit)</option>
                    <option value="DRAFT">DRAFT (Konsep)</option>
                    <option value="SCHEDULED">SCHEDULED (Terjadwal)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">URL Gambar Sampul (Cover Image)</label>
                <input
                  type="text"
                  value={editingBlog.coverImage}
                  onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Rangkuman / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Konten Lengkap</label>
                <textarea
                  rows={6}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-serif leading-relaxed"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex justify-end gap-2">
              <button
                onClick={() => setEditingBlog(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.06]"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setBlogs(blogs.map(b => b.id === editingBlog.id ? editingBlog : b));
                  setEditingBlog(null);
                  sounds.playSuccess();
                  showBanner(`Artikel "${editingBlog.title}" berhasil diperbarui!`);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
              >
                Simpan & Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW FORM SUBMISSION DETAIL                       */}
      {/* ======================================================== */}
      {viewingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121215] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Detail Formulir: {viewingForm.formType}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">ID: {viewingForm.id} • {viewingForm.submittedAt}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingForm(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Sender info box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  Identitas Pengirim Formulir
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Lengkap:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{viewingForm.senderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lembaga / Instansi:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{viewingForm.institution || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email:</span>
                    <span className="text-slate-800 dark:text-slate-200">{viewingForm.senderEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nomor Telepon / WhatsApp:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{viewingForm.senderPhone}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Payload fields */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Data Jawaban Formulir:
                </h4>
                <div className="space-y-2 text-[11px]">
                  {Object.entries(viewingForm.payload).map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dark:border-white/[0.04]">
                      <span className="text-slate-400 font-medium">{k}:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300">
                  Ubah Status Tindak Lanjut:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['BARU', 'DITINJAU', 'DISETUJUI', 'SELESAI'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateFormStatus(viewingForm.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        viewingForm.status === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-[#16161A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex justify-end">
              <button
                onClick={() => setViewingForm(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
