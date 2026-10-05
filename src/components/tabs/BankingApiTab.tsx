import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  Copy, 
  Check, 
  Terminal, 
  Key, 
  Globe, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  DownloadCloud,
  FileCode,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { BankIntegration, ApiEndpoint, Language } from '../../types';
import { translations } from '../../utils/translations';
import { integratedBanks, apiEndpoints } from '../../utils/mockData';
import { sounds } from '../../utils/soundEffects';

interface BankingApiTabProps {
  currentLang: Language;
}

export const BankingApiTab: React.FC<BankingApiTabProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState<string>(apiEndpoints[0].requestSample);
  const [responseBody, setResponseBody] = useState<string>(apiEndpoints[0].responseSample);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [responseTime, setResponseTime] = useState<number>(14);

  const [apiKey, setApiKey] = useState('icp_live_sharia_99a81b27c6ef01');
  const [hmacSecret, setHmacSecret] = useState('sec_hmac_sha256_dsnmui_2026_x89a');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.requestSample);
    setResponseBody(ep.responseSample);
    setResponseStatus(200);
    sounds.playClick();
  };

  const handleExecuteApi = () => {
    setIsLoadingApi(true);
    sounds.playClick();

    const start = Date.now();
    setTimeout(() => {
      setIsLoadingApi(false);
      setResponseTime(Date.now() - start + Math.floor(Math.random() * 15 + 8));
      setResponseStatus(200);
      setResponseBody(selectedEndpoint.responseSample);
      sounds.playSuccess();
    }, 450);
  };

  const handleCopy = (text: string, type: 'key' | 'response') => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleDownloadOpenApi = () => {
    sounds.playClick();
    const openApiSpec = {
      openapi: '3.0.3',
      info: {
        title: 'IslamiCityPay Digital Voucher & Sharia Open Banking Gateway API',
        version: '1.0.0',
        description: 'Standardized SNAP-BI & DSN-MUI compliant REST API for Islamic Digital Vouchers & E2EE Settlements',
      },
      servers: [{ url: 'https://api.islamicitypay.org/v1' }],
      paths: {
        '/vouchers/issue': {
          post: { summary: 'Issue new encrypted sharia voucher', responses: { '200': { description: 'Success' } } },
        },
        '/vouchers/redeem': {
          post: { summary: 'Redeem voucher with 2FA & POS routing', responses: { '200': { description: 'Success' } } },
        },
        '/banking/reconciliation': {
          get: { summary: 'Query daily sharia bank pool reconciliation', responses: { '200': { description: 'Success' } } },
        },
      },
    };

    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IslamiCityPay_OpenAPI_v3.json';
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="banking-api-tab-container">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gateway Perbankan Syariah & Open API Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Terhubung langsung dengan protokol Standar Nasional SNAP-BI, BI-FAST, dan ISO 20022 Syariah.
          </p>
        </div>

        <button
          onClick={handleDownloadOpenApi}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#16161A] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-colors flex items-center gap-1.5"
        >
          <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Unduh OpenAPI Spec (JSON)</span>
        </button>
      </div>

      {/* Integrated Sharia Banks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integratedBanks.map((bank) => (
          <div
            key={bank.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                  style={{ backgroundColor: bank.logoColor }}
                >
                  {bank.shortName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {bank.bankName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Kode Bank: {bank.bankCode}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                {bank.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <div>
                <span className="text-slate-400 block text-[10px]">Protokol:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{bank.protocol}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Latensi:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{bank.latencyMs} ms</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#16161A] text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate border border-slate-100 dark:border-white/[0.04]">
              {bank.endpointUrl}
            </div>
          </div>
        ))}
      </div>

      {/* API Key & HMAC Authentication Manager */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Kredensial API & Header Tanda Tangan HMAC-SHA256
            </h3>
          </div>
          <button
            onClick={() => {
              setApiKey(`icp_live_sharia_${Math.random().toString(36).substring(2, 12)}`);
              sounds.playSuccess();
            }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Generate New API Key</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-sans font-medium text-[11px] block">X-IslamiCity-API-Key:</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{apiKey}</span>
              <button onClick={() => handleCopy(apiKey, 'key')} className="text-slate-400 hover:text-slate-200 transition-colors">
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-sans font-medium text-[11px] block">X-Signature Secret (HMAC-SHA256):</span>
            <div className="flex items-center justify-between">
              <span className="text-amber-500 dark:text-amber-400 font-bold">{hmacSecret}</span>
              <span className="text-[10px] text-slate-400 font-sans">DSN-MUI Sealed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive REST API Sandbox */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Konsol Pengujian API Interaktif (Live Sandbox)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Status: HTTP {responseStatus} OK ({responseTime}ms)
          </span>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {apiEndpoints.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectEndpoint(ep)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                selectedEndpoint.path === ep.path
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-slate-100 dark:bg-[#16161A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#202026] border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                ep.method === 'POST' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {ep.method}
              </span>
              <span>{ep.path}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {selectedEndpoint.description}
        </p>

        {/* 2-Column Request / Response Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Request Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                JSON Request Body:
              </span>
              <button
                onClick={handleExecuteApi}
                disabled={isLoadingApi}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-50 hover:scale-[1.02]"
              >
                {isLoadingApi ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Kirim Request API</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={10}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-950 dark:bg-[#0A0A0B] text-emerald-400 rounded-xl border border-slate-800 dark:border-white/[0.08] focus:ring-2 focus:ring-emerald-500/40 outline-none"
            />
          </div>

          {/* Response Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                HTTP Response Payload:
              </span>
              <button
                onClick={() => handleCopy(responseBody, 'response')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                {copiedResponse ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResponse ? 'Tersalin' : 'Salin JSON'}</span>
              </button>
            </div>
            <pre className="w-full p-3 font-mono text-xs bg-slate-950 dark:bg-[#0A0A0B] text-amber-300 rounded-xl border border-slate-800 dark:border-white/[0.08] h-[222px] overflow-y-auto">
              {responseBody}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
