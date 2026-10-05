import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer,
  Square,
  Plus,
  Trash2,
  Move,
  Eye,
  Smartphone,
  Tablet,
  Laptop,
  Save,
  Check,
  Undo2,
  Redo2,
  X,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Share2,
  CheckCircle2,
  Sparkle
} from 'lucide-react';
import { Language } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface VisualWebsiteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSaveToast?: (msg: string) => void;
}

export interface DragBlock {
  id: string;
  type: 'hero' | 'announcement' | 'features' | 'qris_banner' | 'stats_counter' | 'prayer_times' | 'halal_merchant_slider' | 'cta_button' | 'custom_html';
  name: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  bgType?: 'emerald' | 'gold' | 'dark' | 'gradient';
  customHtml?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string;
  imageUrl?: string;
  stats?: { label: string; value: string }[];
}

export const VisualWebsiteEditorModal: React.FC<VisualWebsiteEditorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSaveToast
}) => {
  // Device viewport mode
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewOnly, setPreviewOnly] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-hero');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'blocks' | 'settings' | 'ai_assistant'>('blocks');

  // Drag-and-drop / Reorder state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Active blocks on the website homepage
  const [homepageBlocks, setHomepageBlocks] = useState<DragBlock[]>([
    {
      id: 'block-hero',
      type: 'hero',
      name: 'Hero Banner Syariah Utama',
      badge: 'Solusi Terenkripsi End-to-End Fatwa DSN-MUI 116',
      title: 'Revolusi Finansial Halal & Ekosistem Voucher Terbuka',
      subtitle: 'Penerbitan kupon digital bebas Riba, Gharar, dan Maysir dengan perlindungan rekening Escrow Wadiah & integrasi SNAP-BI.',
      buttonText: 'Mulai Transaksi Halal',
      buttonLink: '/vouchers',
      bgType: 'gradient',
      align: 'center',
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'block-prayer',
      type: 'prayer_times',
      name: 'Widget Jadwal Shalat & Kalender Hijriyah',
      title: 'Waktu Shalat & Adzan Wilayah DKI Jakarta & Sekitarnya',
      subtitle: '12 Shafar 1448 H • Sinkronisasi Otomatis Kementerian Agama RI',
      bgType: 'dark'
    },
    {
      id: 'block-stats',
      type: 'stats_counter',
      name: 'Statistik Transparansi ZISWAF',
      title: 'Pertumbuhan Ekosistem Muamalah Real-time',
      bgType: 'emerald',
      stats: [
        { label: 'Voucher Beredar', value: 'Rp 48.9 Miliar' },
        { label: 'Merchant Halal', value: '3.420 Toko' },
        { label: 'Mustahik Terbantu', value: '142.500 Jiwa' },
        { label: 'Kepatuhan Syariah', value: '100% Lulus DSN-MUI' }
      ]
    },
    {
      id: 'block-features',
      type: 'features',
      name: 'Grid Fitur Keunggulan Ekosistem',
      title: 'Tiga Pilar Utama IslamiCityPay',
      subtitle: 'Dirancang khusus untuk keamanan nasabah, kepatuhan Dewan Syariah Nasional, dan efisiensi lembaga filantropi.',
      bgType: 'dark'
    },
    {
      id: 'block-qris',
      type: 'qris_banner',
      name: 'Banner QRIS Dinamis & POS Merchant',
      title: 'Terima Donasi & Pembayaran Sembako via QRIS Syariah',
      subtitle: 'Mendukung QRIS MPM & CPM dengan pencairan instan H+0 langsung ke rekening Bank Syariah Indonesia (BSI), Muamalat, dan Mega Syariah.',
      buttonText: 'Daftar Jadi Merchant Mitra',
      buttonLink: 'https://merchant.islamicitypay.id',
      bgType: 'gold'
    }
  ]);

  // Available block templates library to drag & add
  const availableComponentLibrary: Omit<DragBlock, 'id'>[] = [
    {
      type: 'announcement',
      name: 'Pemberitahuan / Banner Pengumuman Zakat',
      title: 'Pemberitahuan Khusus: Program Tebar Beras Berkah Ramadhan 1448 H',
      subtitle: 'Salurkan Zakat Maal & Fidyah Anda melalui voucher digital sembako binaan pondok pesantren.',
      buttonText: 'Salurkan Zakat Sekarang',
      bgType: 'emerald',
      align: 'center'
    },
    {
      type: 'halal_merchant_slider',
      name: 'Showcase Mitra Merchant Halal',
      title: 'Mitra Usaha & Koperasi Masjid Terverifikasi Halal',
      subtitle: 'Lebih dari 3.000 warung berkah, apotek halal, dan katering santri siap menerima voucher Anda.',
      bgType: 'dark'
    },
    {
      type: 'cta_button',
      name: 'Call To Action Box (Unduh Aplikasi)',
      title: 'Unduh Aplikasi Mobile Dompet Syariah',
      subtitle: 'Tersedia di Google Play Store & iOS App Store dengan fitur autentikasi biometrik sidik jari.',
      buttonText: 'Unduh Aplikasi APK / iOS',
      bgType: 'gradient',
      align: 'center'
    }
  ];

  if (!isOpen) return null;

  // Reorder Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...homepageBlocks];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(index, 0, item);
    setHomepageBlocks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    sounds.playClick();
  };

  const handleMoveBlock = (index: number, direction: 'UP' | 'DOWN') => {
    sounds.playClick();
    const updated = [...homepageBlocks];
    const target = direction === 'UP' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setHomepageBlocks(updated);
  };

  const handleDeleteBlock = (id: string) => {
    sounds.playClick();
    setHomepageBlocks(homepageBlocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleAddBlock = (template: Omit<DragBlock, 'id'>) => {
    sounds.playSuccess();
    const newBlock: DragBlock = {
      ...template,
      id: `block-${Date.now()}`
    };
    setHomepageBlocks([...homepageBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleSaveHomepage = () => {
    sounds.playSuccess();
    if (onSaveToast) {
      onSaveToast('Perubahan tata letak drag-and-drop Beranda Website berhasil dipublikasikan!');
    }
    onClose();
  };

  const selectedBlock = homepageBlocks.find(b => b.id === selectedBlockId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-fade-in select-none">
      
      {/* 1. TOP CONTROL BAR */}
      <div className="h-14 px-4 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">
                IslamiCity Drag & Drop Website Editor
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                LIVE HOMEPAGE (/)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ubah susunan blok visual halaman beranda utama dengan mudah.
            </p>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-white/[0.08]">
          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('desktop');
            }}
            title="Desktop View (100%)"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceMode === 'desktop' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('tablet');
            }}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceMode === 'tablet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('mobile');
            }}
            title="Mobile View (375px)"
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceMode === 'mobile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Preview & Save) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setPreviewOnly(!previewOnly);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              previewOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/[0.08]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewOnly ? 'Mode Edit' : 'Pratinjau'}</span>
          </button>

          <button
            onClick={handleSaveHomepage}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan & Publikasikan</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: BLOCKS LIBRARY & INSPECTOR */}
        {!previewOnly && (
          <div className="w-80 bg-slate-900 border-r border-white/[0.08] flex flex-col shrink-0">
            
            {/* Sidebar Tabs */}
            <div className="grid grid-cols-2 p-2 gap-1 border-b border-white/[0.08] bg-slate-950/50">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveSidebarTab('blocks');
                }}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeSidebarTab === 'blocks'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Blok & Komponen</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveSidebarTab('settings');
                }}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeSidebarTab === 'settings'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Properti Blok</span>
              </button>
            </div>

            {/* TAB CONTENT: AVAILABLE BLOCKS TO ADD */}
            {activeSidebarTab === 'blocks' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* Active Blocks Order List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Struktur Susunan Halaman ({homepageBlocks.length})
                    </span>
                    <span className="text-[10px] text-slate-500">Drag untuk urutkan</span>
                  </div>

                  <div className="space-y-1.5">
                    {homepageBlocks.map((block, idx) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedBlockId(block.id);
                          setActiveSidebarTab('settings');
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          selectedBlockId === block.id
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                            : dragOverIndex === idx
                            ? 'border-indigo-500 bg-indigo-500/10 text-white scale-[1.02]'
                            : 'bg-slate-800/60 border-white/[0.06] text-slate-300 hover:bg-slate-800 hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Move className="w-3.5 h-3.5 text-slate-500 cursor-grab shrink-0" />
                          <span className="text-xs font-bold truncate">
                            {idx + 1}. {block.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMoveBlock(idx, 'UP')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Pindah ke Atas"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveBlock(idx, 'DOWN')}
                            disabled={idx === homepageBlocks.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Pindah ke Bawah"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Hapus Blok"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Library of New Blocks */}
                <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tambah Blok Baru (+ Library)
                  </span>

                  <div className="space-y-2">
                    {availableComponentLibrary.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-800/40 border border-white/[0.06] hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <button
                            onClick={() => handleAddBlock(item)}
                            className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 px-2"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {item.subtitle || item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: BLOCK SETTINGS INSPECTOR */}
            {activeSidebarTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {selectedBlock ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold flex items-center justify-between">
                      <span>Mengedit: {selectedBlock.name}</span>
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        {selectedBlock.type}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Judul Utama Blok</label>
                      <input
                        type="text"
                        value={selectedBlock.title || ''}
                        onChange={(e) => {
                          setHomepageBlocks(homepageBlocks.map(b => b.id === selectedBlock.id ? { ...b, title: e.target.value } : b));
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-800 border border-white/[0.1] text-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Subjudul / Deskripsi</label>
                      <textarea
                        rows={3}
                        value={selectedBlock.subtitle || ''}
                        onChange={(e) => {
                          setHomepageBlocks(homepageBlocks.map(b => b.id === selectedBlock.id ? { ...b, subtitle: e.target.value } : b));
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-800 border border-white/[0.1] text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    {selectedBlock.buttonText !== undefined && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">Teks Tombol CTA</label>
                          <input
                            type="text"
                            value={selectedBlock.buttonText || ''}
                            onChange={(e) => {
                              setHomepageBlocks(homepageBlocks.map(b => b.id === selectedBlock.id ? { ...b, buttonText: e.target.value } : b));
                            }}
                            className="w-full p-2 rounded-lg bg-slate-800 border border-white/[0.1] text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">Tautan Tujuan</label>
                          <input
                            type="text"
                            value={selectedBlock.buttonLink || ''}
                            onChange={(e) => {
                              setHomepageBlocks(homepageBlocks.map(b => b.id === selectedBlock.id ? { ...b, buttonLink: e.target.value } : b));
                            }}
                            className="w-full p-2 rounded-lg bg-slate-800 border border-white/[0.1] text-emerald-400 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Gaya Latar Belakang (Theme Tone)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['gradient', 'emerald', 'gold', 'dark'] as const).map((bg) => (
                          <button
                            key={bg}
                            onClick={() => {
                              sounds.playClick();
                              setHomepageBlocks(homepageBlocks.map(b => b.id === selectedBlock.id ? { ...b, bgType: bg } : b));
                            }}
                            className={`p-2 rounded-lg border text-left font-bold capitalize transition-all ${
                              selectedBlock.bgType === bg
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-800 border-white/[0.08] text-slate-400 hover:text-white'
                            }`}
                          >
                            {bg}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteBlock(selectedBlock.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold text-xs flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Blok Ini</span>
                      </button>

                      <button
                        onClick={() => setActiveSidebarTab('blocks')}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Kembali ke Daftar
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Sliders className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Pilih salah satu blok pada kanvas atau daftar blok untuk mengedit propertinya.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* CENTER CANVAS: LIVE DRAG AND DROP PREVIEW */}
        <div className="flex-1 overflow-y-auto bg-slate-950/80 p-4 md:p-8 flex justify-center">
          
          <div
            className={`transition-all duration-300 bg-[#0d0d10] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
              deviceMode === 'desktop' ? 'w-full max-w-5xl' :
              deviceMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            
            {/* Mock Browser Header */}
            <div className="h-9 px-4 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="px-4 py-1 rounded-md bg-slate-950 text-[11px] font-mono text-slate-400 border border-white/[0.06] flex items-center gap-2 max-w-sm w-full justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">https://islamicitypay.id/</span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                {deviceMode.toUpperCase()}
              </div>
            </div>

            {/* Website Canvas Blocks Body */}
            <div className="p-6 md:p-10 space-y-8 flex-1">
              
              {homepageBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedBlockId(block.id);
                    setActiveSidebarTab('settings');
                  }}
                  className={`relative rounded-2xl transition-all group ${
                    !previewOnly ? 'cursor-pointer' : ''
                  } ${
                    selectedBlockId === block.id && !previewOnly
                      ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950'
                      : ''
                  }`}
                >
                  
                  {/* Hover Edit Toolbar Indicator */}
                  {!previewOnly && (
                    <div className="absolute -top-3 right-3 hidden group-hover:flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md z-10">
                      <Move className="w-3 h-3" />
                      <span>{block.name} (Klik untuk edit)</span>
                    </div>
                  )}

                  {/* 1. HERO BLOCK */}
                  {block.type === 'hero' && (
                    <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-black border border-emerald-500/20 text-center space-y-5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                      
                      {block.badge && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{block.badge}</span>
                        </div>
                      )}

                      <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
                        {block.title}
                      </h1>

                      <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                        {block.subtitle}
                      </p>

                      {block.buttonText && (
                        <div className="pt-2">
                          <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all">
                            {block.buttonText}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. PRAYER TIMES WIDGET */}
                  {block.type === 'prayer_times' && (
                    <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-sm text-white">{block.title}</h3>
                          <p className="text-[11px] text-emerald-400 font-medium">{block.subtitle}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                          Kemenag RI Certified
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                        {[
                          { name: 'Subuh', time: '04:42' },
                          { name: 'Terbit', time: '05:58' },
                          { name: 'Dzuhur', time: '12:02' },
                          { name: 'Ashar', time: '15:21' },
                          { name: 'Maghrib', time: '18:01' },
                          { name: 'Isya', time: '19:11' }
                        ].map((pr, pIdx) => (
                          <div key={pIdx} className="p-2.5 rounded-xl bg-slate-950 border border-white/[0.06]">
                            <div className="text-[10px] text-slate-400">{pr.name}</div>
                            <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">{pr.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. STATS COUNTER */}
                  {block.type === 'stats_counter' && (
                    <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-5">
                      <div className="text-center space-y-1">
                        <h3 className="font-extrabold text-base text-white">{block.title}</h3>
                        <p className="text-xs text-slate-400">Diaudit & Terverifikasi Dewan Pengawas Syariah</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(block.stats || []).map((st, sIdx) => (
                          <div key={sIdx} className="p-4 rounded-xl bg-slate-950 text-center border border-white/[0.06]">
                            <div className="text-base md:text-lg font-black text-emerald-400 font-mono">{st.value}</div>
                            <div className="text-[11px] text-slate-400 mt-1 font-medium">{st.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. FEATURES GRID */}
                  {block.type === 'features' && (
                    <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-white/[0.08] space-y-5">
                      <div className="text-center space-y-1">
                        <h3 className="font-extrabold text-base text-white">{block.title}</h3>
                        <p className="text-xs text-slate-400 max-w-lg mx-auto">{block.subtitle}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: '100% Bebas Riba & Gharar', desc: 'Setiap transaksi diverifikasi akad fikih muamalah secara ketat.' },
                          { title: 'Enkripsi AES-256-GCM', desc: 'Keamanan data dan saldo nasabah berstandar Bank Indonesia.' },
                          { title: 'Integrasi Open Banking', desc: 'Pencairan instan SNAP-BI langsung ke rekening Bank Syariah mitra.' }
                        ].map((ft, fIdx) => (
                          <div key={fIdx} className="p-4 rounded-xl bg-slate-950 border border-white/[0.06] space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                              0{fIdx + 1}
                            </div>
                            <h4 className="font-bold text-xs text-white">{ft.title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{ft.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. QRIS BANNER */}
                  {block.type === 'qris_banner' && (
                    <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-black border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center md:text-left">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          FITUR MERCHANT & POS
                        </span>
                        <h3 className="font-extrabold text-lg text-white">{block.title}</h3>
                        <p className="text-xs text-slate-300 max-w-md">{block.subtitle}</p>
                      </div>

                      {block.buttonText && (
                        <button className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-all shrink-0">
                          {block.buttonText}
                        </button>
                      )}
                    </div>
                  )}

                  {/* 6. ANNOUNCEMENT / OTHERS */}
                  {block.type === 'announcement' && (
                    <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-emerald-300">{block.title}</h4>
                        <p className="text-[11px] text-slate-300">{block.subtitle}</p>
                      </div>
                      {block.buttonText && (
                        <button className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shrink-0">
                          {block.buttonText}
                        </button>
                      )}
                    </div>
                  )}

                  {/* 7. SHOWCASE MITRA */}
                  {block.type === 'halal_merchant_slider' && (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-white/[0.08] space-y-3 text-center">
                      <h4 className="font-extrabold text-sm text-white">{block.title}</h4>
                      <p className="text-xs text-slate-400">{block.subtitle}</p>
                      <div className="flex items-center justify-center gap-4 pt-2 opacity-70">
                        <span className="font-mono text-xs font-bold text-slate-300">Koperasi Syariah Al-Falah</span>
                        <span>•</span>
                        <span className="font-mono text-xs font-bold text-slate-300">Halal Mart Sentra Ummah</span>
                        <span>•</span>
                        <span className="font-mono text-xs font-bold text-slate-300">Pondok Santripreneur</span>
                      </div>
                    </div>
                  )}

                  {/* 8. CTA BUTTON */}
                  {block.type === 'cta_button' && (
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-black border border-indigo-500/30 text-center space-y-3">
                      <h4 className="font-extrabold text-base text-white">{block.title}</h4>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">{block.subtitle}</p>
                      <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500">
                        {block.buttonText}
                      </button>
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
