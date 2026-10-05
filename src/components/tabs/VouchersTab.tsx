import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Ticket, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  DownloadCloud,
  CheckCircle2,
  Users,
  Eye,
  QrCode,
  Share2,
  SmartphoneNfc,
  Radio,
  CalendarClock,
  Repeat
} from 'lucide-react';
import { 
  Voucher, 
  VoucherCategory, 
  VoucherStatus, 
  Language, 
  RecurringVoucherSchedule 
} from '../../types';
import { translations } from '../../utils/translations';
import { VoucherCard } from '../VoucherCard';
import { VoucherQrShareModal } from '../VoucherQrShareModal';
import { RecurringVouchersView } from '../RecurringVouchersView';
import { ScheduleRecurringVoucherModal } from '../modals/ScheduleRecurringVoucherModal';
import { initialRecurringSchedules } from '../../utils/mockData';
import { sounds } from '../../utils/soundEffects';

interface VouchersTabProps {
  currentLang: Language;
  vouchers: Voucher[];
  recurringSchedules?: RecurringVoucherSchedule[];
  onOpenIssueModal: () => void;
  onViewDetails: (v: Voucher) => void;
  onQuickRedeem: (v: Voucher) => void;
  onOpenExportModal: () => void;
  onShowToast?: (message: string) => void;
  onSaveSchedule?: (schedule: RecurringVoucherSchedule, issueNow: boolean) => void;
  onToggleScheduleStatus?: (id: string) => void;
  onExecuteScheduleNow?: (schedule: RecurringVoucherSchedule) => void;
  onDeleteSchedule?: (id: string) => void;
}

export const VouchersTab: React.FC<VouchersTabProps> = ({
  currentLang,
  vouchers,
  recurringSchedules: propRecurringSchedules,
  onOpenIssueModal,
  onViewDetails,
  onQuickRedeem,
  onOpenExportModal,
  onShowToast,
  onSaveSchedule,
  onToggleScheduleStatus,
  onExecuteScheduleNow,
  onDeleteSchedule,
}) => {
  const t = translations[currentLang];

  // Sub-tab: Catalog vs Recurring Schedules
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'recurring'>('catalog');

  // Internal Fallback Recurring Schedules State if not passed
  const [internalSchedules, setInternalSchedules] = useState<RecurringVoucherSchedule[]>(initialRecurringSchedules);
  const activeSchedules = propRecurringSchedules || internalSchedules;

  // Recurring Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // QR Code Generation Modal State
  const [selectedVoucherForQr, setSelectedVoucherForQr] = useState<Voucher | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchCat = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchStat = selectedStatus === 'ALL' || v.status === selectedStatus;
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        !searchQuery ||
        v.code.toLowerCase().includes(query) ||
        v.title.toLowerCase().includes(query) ||
        v.beneficiaryName.toLowerCase().includes(query) ||
        v.shariaContract.toLowerCase().includes(query);

      return matchCat && matchStat && matchSearch;
    });
  }, [vouchers, selectedCategory, selectedStatus, searchQuery]);

  const handleOpenQrModal = (v?: Voucher) => {
    sounds.playClick();
    const target = v || (filteredVouchers.length > 0 ? filteredVouchers[0] : vouchers[0]) || null;
    setSelectedVoucherForQr(target);
    setIsQrModalOpen(true);
  };

  const handleInternalSaveSchedule = (schedule: RecurringVoucherSchedule, issueNow: boolean) => {
    if (onSaveSchedule) {
      onSaveSchedule(schedule, issueNow);
    } else {
      setInternalSchedules(prev => [schedule, ...prev]);
      if (onShowToast) {
        onShowToast(`Jadwal penyaluran "${schedule.programTitle}" berhasil diaktifkan!`);
      }
    }
  };

  const handleInternalToggleStatus = (id: string) => {
    if (onToggleScheduleStatus) {
      onToggleScheduleStatus(id);
    } else {
      sounds.playToggle();
      setInternalSchedules(prev => prev.map(s => {
        if (s.id === id) {
          const next = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...s, status: next };
        }
        return s;
      }));
    }
  };

  const handleInternalExecuteNow = (schedule: RecurringVoucherSchedule) => {
    if (onExecuteScheduleNow) {
      onExecuteScheduleNow(schedule);
    } else {
      sounds.playSuccess();
      setInternalSchedules(prev => prev.map(s => {
        if (s.id === schedule.id) {
          return {
            ...s,
            cyclesCompleted: s.cyclesCompleted + 1,
            totalDisbursed: s.totalDisbursed + s.amountPerVoucher * s.recipientCount,
            lastExecutedDate: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      }));
      if (onShowToast) {
        onShowToast(`Siklus "${schedule.programTitle}" berhasil dieksekusi!`);
      }
    }
  };

  const handleInternalDeleteSchedule = (id: string) => {
    if (onDeleteSchedule) {
      onDeleteSchedule(id);
    } else {
      sounds.playAlert();
      setInternalSchedules(prev => prev.filter(s => s.id !== id));
      if (onShowToast) {
        onShowToast('Jadwal voucher berhasil dihapus.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="vouchers-tab-container">
      
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Katalog & Manajemen Voucher Digital IslamiCityPay
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {vouchers.length} voucher terenkripsi E2EE tersimpan dalam buku besar syariah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Quick QR Code Generator Button */}
          <button
            id="vouchers-generate-qr-btn"
            onClick={() => handleOpenQrModal()}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
            title="Generate QR Code untuk Penebusan Contactless"
          >
            <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Generate QR Code</span>
          </button>

          {/* Quick Schedule Recurring Voucher Button */}
          <button
            id="vouchers-schedule-recurring-btn"
            onClick={() => {
              sounds.playClick();
              setIsScheduleModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30 rounded-xl transition-all flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
            title="Jadwalkan Penerbitan Voucher Berkala"
          >
            <CalendarClock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Jadwal Berulang</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenExportModal();
            }}
            className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-[#16161A] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <DownloadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ekspor Data</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenIssueModal();
            }}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Voucher Baru</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Tab Switcher: Catalog vs Recurring Schedules */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] w-fit">
        <button
          id="tab-btn-catalog"
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('catalog');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'catalog'
              ? 'bg-white dark:bg-[#202026] text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Katalog Voucher Aktif</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            {vouchers.length}
          </span>
        </button>

        <button
          id="tab-btn-recurring"
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveSubTab('recurring');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'recurring'
              ? 'bg-white dark:bg-[#202026] text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          <span>Jadwal Penyaluran Berulang (Recurring)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
            {activeSchedules.length}
          </span>
        </button>
      </div>

      {/* Sub-view conditional render */}
      {activeSubTab === 'recurring' ? (
        <RecurringVouchersView
          schedules={activeSchedules}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
          onToggleScheduleStatus={handleInternalToggleStatus}
          onExecuteScheduleNow={handleInternalExecuteNow}
          onDeleteSchedule={handleInternalDeleteSchedule}
        />
      ) : (
        <>
          {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode, nama penerima, judul..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Filter Selectors & View Mode Switch */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kategori Syariah</option>
              <option value="ziswaf">ZISWAF Berkah</option>
              <option value="umrah_hajj">Umrah & Haji</option>
              <option value="halal_mart">Halal Mart</option>
              <option value="islamic_education">Pendidikan Islami</option>
              <option value="masjid_community">Kemakmuran Masjid</option>
              <option value="qurban_aqiqah">Qurban & Aqiqah</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif (Bisa Ditebus)</option>
              <option value="REDEEMED">Tertukar Penuh</option>
              <option value="ALLOCATED">Teralokasi</option>
              <option value="EXPIRED">Kedaluwarsa</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-[#16161A] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('grid');
                }}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#222228] shadow-xs text-emerald-500' : 'text-slate-400'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('table');
                }}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#222228] shadow-xs text-emerald-500' : 'text-slate-400'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {filteredVouchers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Tidak ada voucher yang sesuai filter
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter status untuk melihat voucher lainnya.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVouchers.map((v) => (
            <VoucherCard
              key={v.id}
              voucher={v}
              currentLang={currentLang}
              onViewDetails={onViewDetails}
              onQuickRedeem={onQuickRedeem}
              onGenerateQr={(voucherToQr) => {
                setSelectedVoucherForQr(voucherToQr);
                setIsQrModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
              <tr>
                <th className="py-3 px-3">Kode Voucher</th>
                <th className="py-3 px-3">Judul Program</th>
                <th className="py-3 px-3">Akad Fikih</th>
                <th className="py-3 px-3">Penerima Manfaat</th>
                <th className="py-3 px-3">Saldo Tersisa</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Kedaluwarsa</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {filteredVouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {v.code}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                    {v.title}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {v.shariaContract}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {v.beneficiaryName}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    Rp {v.remainingBalance.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-200 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {v.expiryDate}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {/* Direct QR Generator Action */}
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedVoucherForQr(v);
                        setIsQrModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 dark:text-emerald-400 transition-colors"
                      title="Generate & Bagikan QR Code Contactless"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onViewDetails(v)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
                      title="Lihat Detail Voucher"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {v.status === 'ACTIVE' && (
                      <button
                        onClick={() => onQuickRedeem(v)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-xs"
                      >
                        Tukar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </>
      )}

      {/* Shareable QR Code Generator & Contactless Pay Modal */}
      <VoucherQrShareModal
        voucher={selectedVoucherForQr}
        allVouchers={vouchers}
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setSelectedVoucherForQr(null);
        }}
        currentLang={currentLang}
        onRedeem={(v) => {
          setIsQrModalOpen(false);
          setSelectedVoucherForQr(null);
          onQuickRedeem(v);
        }}
        onShowToast={onShowToast}
      />

      {/* Schedule Recurring Voucher Modal */}
      <ScheduleRecurringVoucherModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSaveSchedule={handleInternalSaveSchedule}
      />

    </div>
  );
};

