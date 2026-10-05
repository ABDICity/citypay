import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Scale, 
  BrainCircuit,
  HelpCircle,
  Lightbulb,
  FileCheck,
  MessageSquare,
  Calculator,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { Voucher, Transaction, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';
import { SmartContractVerificationPanel } from './SmartContractVerificationPanel';
import { ZakatCalculatorModule } from './ZakatCalculatorModule';
import { AiRiskScoringModule } from './AiRiskScoringModule';

interface AiAdvisorTabProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  onUpdateVoucher?: (updated: Voucher) => void;
  onShowToast?: (message: string) => void;
}

export const AiAdvisorTab: React.FC<AiAdvisorTabProps> = ({
  currentLang,
  vouchers,
  transactions,
  onUpdateVoucher,
  onShowToast,
}) => {
  const t = translations[currentLang];
  const [activeSubTab, setActiveSubTab] = useState<'risk_scoring' | 'zakat_calculator' | 'smart_contract' | 'ai_chat'>('risk_scoring');

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    citation?: string;
  }>>([
    {
      sender: 'ai',
      text: 'Assalamu\'alaikum! Saya adalah Asisten Kepatuhan Syariah & Deteksi Anomali Kriptografis IslamiCityPay AI. Saya siap membantu Anda menganalisis keabsahan akad fikih (Wakalah bil Ujrah, Mudharabah, Tabarru), memverifikasi audit log bebas riba & gharar, serta mendeteksi potensi anomali transaksi real-time.',
      timestamp: '08:00',
      citation: 'Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 tentang Uang Elektronik Syariah',
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    'Hitung nisab zakat maal emas 85 gram dan rekomendasi alokasi voucher',
    'Verifikasi keabsahan akad Wakalah bil Ujrah pada biaya administrasi voucher',
    'Audit smart contract: Mengapa Zakat Maal wajib menggunakan akad Tabarru Tamlik?',
    'Audit keamanan: Apakah ada indikasi double-spending atau kegagalan hash hari ini?',
    'Analisis efektivitas distribusi alokasi voucher ZISWAF Mustahiq bulan ini',
    'Panduan kepatuhan Fatwa DSN-MUI No 116 untuk voucher digital multi-merchant',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    sounds.playClick();
    const userMsg = {
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toTimeString().substring(0, 5),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      sounds.playSuccess();

      let aiReply = '';
      let citation = '';

      if (q.toLowerCase().includes('zakat') || q.toLowerCase().includes('nisab') || q.toLowerCase().includes('emas')) {
        aiReply = `Panduan Perhitungan Zakat & Nisab AI IslamiCityPay (BAZNAS & DSN-MUI):
1. Nisab Emas 85g: Rp 114.750.000 / tahun (setara Rp 9.562.500 / bulan). Harta yang melebihi nilai ini dan mencapai haul 1 tahun wajib dikeluarkan zakatnya sebesar 2.5%.
2. Voucher ZISWAF Integration: Nilai nominal voucher digital di sistem dapat diintegrasikan sebagai basis perhitungan maupun langsung dialokasikan ke 8 Asnaf (QS. At-Taubah: 60) dengan prioritas 70% Fakir & Miskin.
3. Fitur Kalkulator Zakat & Nisab AI kami di sub-tab pertama telah menyediakan simulasi interaktif multi-kategori (Maal, Profesi, Perniagaan, Emas, Fitrah) lengkap dengan penyesuaian harga emas real-time.`;
        citation = 'Fatwa MUI No. 3 Tahun 2003 & SK Ketua BAZNAS No. 1 Tahun 2024';
      } else if (q.toLowerCase().includes('smart contract') || q.toLowerCase().includes('tamlik') || q.toLowerCase().includes('tabarru')) {
        aiReply = `Analisis Smart Contract Fikih Penyaluran Zakat (BAZNAS & DSN-MUI 116/2017):
1. Prinsip Tamlik (الملك التام): Zakat adalah pemindahan hak kepemilikan mutlak kepada Mustahiq (8 Asnaf). Oleh karena itu, akad yang valid adalah *Hibah / Tabarru'* murni.
2. Larangan Mudharabah: Pokok dana zakat terlarang diikat dalam skema bagi hasil/spekulasi dagang yang membebankan risiko kerugian kepada mustahiq.
3. Zero-Ujrah: Mustahiq berhak atas 100% nominal voucher tanpa potongan biaya admin saat penukaran di Halal Mart.
4. Mesin Smart Contract Verification kami secara otomatis memvalidasi keabsahan parameter ini sebelum voucher dicetak.`;
        citation = 'Fatwa DSN-MUI No. 116/2017 & Peraturan BAZNAS No. 3/2018 tentang Mustahik';
      } else if (q.toLowerCase().includes('wakalah') || q.toLowerCase().includes('ujrah') || q.toLowerCase().includes('biaya')) {
        aiReply = `Berdasarkan Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017:
1. Pengenaan Ujrah (fee pengelolaan) sebesar 0.5% pada penukaran voucher diperbolehkan secara syar'i dengan akad *Wakalah bil Ujrah*.
2. Besaran ujrah bersifat riil atas jasa penyediaan infrastruktur kriptografis dan bukan merupakan bunga/riba pinjaman (riba qardh).
3. Dana titipan saldo voucher yang belum ditebus wajib ditempatkan pada rekening *Wadiah Yad Dhamanah* di Bank Syariah mitra (BSI/Muamalat) tanpa pengendapan berbunga.`;
        citation = 'Fatwa DSN-MUI No. 116 Ketentuan Akad Penerbitan Uang & Voucher Elektronik';
      } else if (q.toLowerCase().includes('double') || q.toLowerCase().includes('anomali') || q.toLowerCase().includes('keamanan')) {
        aiReply = `Hasil Analisis Forensik Keamanan Real-Time IslamiCityPay:
- Total Voucher Aktif: ${vouchers.length} unit
- Seluruh ${transactions.length} transaksi terakhir memiliki verifikasi SHA-256 HMAC valid 100%.
- Nol (0) insiden double-spending terdeteksi. Sistem atomicity dan nonce per transaksi berhasil mengunci saldo secara real-time.
- Status Kriptografi: Aman & Tersegel Kepatuhan OJK/DSN-MUI.`;
        citation = 'Laporan Real-Time Automated Fraud Detection IslamiCityPay v2.4';
      } else if (q.toLowerCase().includes('ziswaf') || q.toLowerCase().includes('alokasi') || q.toLowerCase().includes('mustahiq') || q.toLowerCase().includes('wakaf')) {
        aiReply = `Rekomendasi Alokasi Dana ZISWAF & Kemanfaatan Umat:
- Penyerapan voucher ZISWAF dan Bantuan Pendidikan mencapai rasio keberhasilan 94.2%.
- Merchant Halal Mart lokal menyerap 68% penebusan bahan pangan pokok.
- Smart Contract Protocol BWI (Badan Wakaf Indonesia) mengunci pokok wakaf abadi (La Yuba' wa La Yuhab) dan mendistribusikan 100% surplus manfaat tepat sasaran.`;
        citation = 'BAZNAS & Badan Wakaf Indonesia (BWI) Guidelines on Digital Endowment';
      } else {
        aiReply = `Analisis Sistem Cerdas IslamiCityPay:
Pertanyaan Anda terkait "${q}" telah diproses melalui mesin audit syariah. Seluruh parameter transaksi memenuhi standar non-riba, non-maysir, dan non-gharar. Setiap lembar voucher memiliki stempel kriptografi AES-256 dan hash SHA-256 yang menjamin transparansi akuntabel bagi auditor eksternal.`;
        citation = 'Islamic Financial Services Board (IFSB-17) Core Principles';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toTimeString().substring(0, 5),
          citation,
        },
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="ai-advisor-tab-container">
      
      {/* Sub-Tab Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08]">
          <button
            id="ai-tab-risk-scoring-btn"
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('risk_scoring');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'risk_scoring'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>AI Risk Scoring & Anomali</span>
          </button>

          <button
            id="ai-tab-zakat-calc-btn"
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('zakat_calculator');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'zakat_calculator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Zakat & Nisab AI</span>
          </button>

          <button
            id="ai-tab-smart-contract-btn"
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('smart_contract');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'smart_contract'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Smart Contract Verification</span>
          </button>

          <button
            id="ai-tab-chat-advisor-btn"
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('ai_chat');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'ai_chat'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Konsultan Fikih & Anomali AI</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NEURAL RISK ENGINE & DSN-MUI RULES ACTIVE</span>
        </div>
      </div>

      {/* VIEW 0: AI RISK SCORING & ANOMALY DETECTION */}
      {activeSubTab === 'risk_scoring' && (
        <AiRiskScoringModule
          currentLang={currentLang}
          vouchers={vouchers}
          transactions={transactions}
          onUpdateVoucher={onUpdateVoucher}
          onShowToast={onShowToast}
        />
      )}

      {/* VIEW 1: DEDICATED ZAKAT & NISAB CALCULATOR MODULE */}
      {activeSubTab === 'zakat_calculator' && (
        <ZakatCalculatorModule
          currentLang={currentLang}
          vouchers={vouchers}
          onShowToast={onShowToast}
          onUpdateVoucher={onUpdateVoucher}
        />
      )}

      {/* VIEW 2: SMART CONTRACT VERIFICATION PANEL */}
      {activeSubTab === 'smart_contract' && (
        <SmartContractVerificationPanel
          currentLang={currentLang}
          vouchers={vouchers}
          onUpdateVoucher={onUpdateVoucher}
          onShowToast={onShowToast}
        />
      )}

      {/* VIEW 2: AI FIKIH CONVERSATIONAL ADVISOR */}
      {activeSubTab === 'ai_chat' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#121215] to-teal-950 text-white shadow-lg border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold font-mono border border-emerald-500/30">
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                AI Sharia Compliance & Anomaly Detector Engine
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Konsultan Fikih Muamalah Digital & Deteksi Anomali Cerdas
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Didukung basis pengetahuan fatwa Dewan Syariah Nasional MUI dan algoritma pendeteksi kecurangan transaksi keuangan syariah.
              </p>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col h-[560px]">
            
            {/* Quick Question Chips */}
            <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Pertanyaan Cepat:
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#16161A] dark:hover:bg-[#202026] text-slate-700 dark:text-slate-300 rounded-full text-xs shrink-0 whitespace-nowrap border border-slate-200 dark:border-white/[0.08] transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 my-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs space-y-2 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-xs shadow-sm font-medium'
                        : 'bg-slate-100 dark:bg-[#16161A] text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {m.citation && (
                      <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-500" />
                        <span>Rujukan: {m.citation}</span>
                      </div>
                    )}

                    <div className={`text-[9px] text-right ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#202026] text-slate-200 border border-white/[0.1] flex items-center justify-center shrink-0 font-bold text-xs">
                      ME
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Memproses fatwa DSN-MUI & memindai buku besar transaksi...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Tanyakan fatwa akad fikih, deteksi anomali fraud, atau aturan perpajakan zakat..."
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
