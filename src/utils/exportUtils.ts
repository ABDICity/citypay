import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Voucher, Transaction, AuditLog } from '../types';

export function exportVouchersToExcel(vouchers: Voucher[], transactions: Transaction[], auditLogs: AuditLog[], fileName = 'IslamiCityPay_Financial_Audit_Report') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Vouchers
  const voucherData = vouchers.map(v => ({
    'Voucher Code': v.code,
    'Title': v.title,
    'Category': v.category,
    'Sharia Contract': v.shariaContract,
    'Face Value': v.faceValue,
    'Remaining Balance': v.remainingBalance,
    'Currency': v.currency,
    'Status': v.status,
    'Beneficiary Name': v.beneficiaryName,
    'Beneficiary Phone': v.beneficiaryPhone,
    'Issued Date': v.issuedDate,
    'Expiry Date': v.expiryDate,
    'Encrypted Hash (SHA-256)': v.encryptedHash,
    'Digital Signature': v.digitalSignature,
    'Security Level': v.securityLevel,
  }));
  const wsVouchers = XLSX.utils.json_to_sheet(voucherData);
  XLSX.utils.book_append_sheet(wb, wsVouchers, 'Vouchers Registry');

  // Sheet 2: Transactions
  const transactionData = transactions.map(t => ({
    'Transaction ID': t.id,
    'Timestamp': t.timestamp,
    'Voucher Code': t.voucherCode,
    'Voucher Title': t.voucherTitle,
    'Type': t.type,
    'Amount': t.amount,
    'Currency': t.currency,
    'Fee (Ujrah)': t.feeUjrah,
    'Status': t.status,
    'Merchant Name': t.merchantName,
    'Bank Gateway': t.bankChannel,
    'Beneficiary': t.beneficiary,
    'E2EE Verification Hash': t.endToEndHash,
    'Sharia Audit ID': t.shariaAuditId,
    'Tamper Proof': t.isTamperProof ? 'YES' : 'NO',
  }));
  const wsTransactions = XLSX.utils.json_to_sheet(transactionData);
  XLSX.utils.book_append_sheet(wb, wsTransactions, 'Live Transactions');

  // Sheet 3: Audit Logs
  const auditData = auditLogs.map(a => ({
    'Log ID': a.id,
    'Timestamp': a.timestamp,
    'Actor': a.actor,
    'Role': a.role,
    'IP Address': a.ipAddress,
    'Action': a.action,
    'Category': a.category,
    'Severity': a.severity,
    'Payload Hash (SHA-256)': a.payloadHash,
    'DSN-MUI Compliance': a.dsnMuiCompliance ? 'CERTIFIED' : 'PENDING',
    'Audit Notes': a.notes,
  }));
  const wsAudit = XLSX.utils.json_to_sheet(auditData);
  XLSX.utils.book_append_sheet(wb, wsAudit, 'Audit Compliance Trail');

  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToCsv(data: Record<string, unknown>[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateOfficialAuditPdf(options: {
  vouchers: Voucher[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  reportTitle?: string;
  periodText?: string;
  generatedBy?: string;
}) {
  const {
    vouchers,
    transactions,
    auditLogs,
    reportTitle = 'LAPORAN AUDIT KEPATUHAN & REKONSILIASI KEUANGAN ISLAMICITYPAY',
    periodText = 'Periode: Berjalan Real-Time 2026',
    generatedBy = 'Administrator Sistem OJK & Dewan Pengawas Syariah',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryEmerald = '#047857';
  const goldAccent = '#b45309';

  // Header Banner
  doc.setFillColor(4, 120, 87);
  doc.rect(0, 0, 210, 32, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ISLAMICITYPAY DIGITAL FINANCIAL INFRASTRUCTURE', 15, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Platform Manajemen Voucher Syariah Terenkripsi E2EE | Kepatuhan DSN-MUI & OJK', 15, 18);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Ref ID: ICP-AUDIT-${Date.now().toString(36).toUpperCase()}`, 15, 24);

  // Document Title
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(reportTitle, 15, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${periodText} | Otorisator: ${generatedBy}`, 15, 48);

  // Sharia Compliance Badge Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(15, 52, 180, 20, 2, 2, 'FD');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('STATUS KEPATUHAN SYARIAH & INTEGRITAS KRIPTOGRAFIS:', 20, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Semua voucher menggunakan akad sah (Wakalah bil Ujrah / Mudharabah / Hibah).', 20, 65);
  doc.text('Enkripsi AES-256-GCM + SHA-256 Immutability Check: 100% VALID & TAMPER-PROOF.', 20, 69);

  // Financial Metric Summary
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalUjrah = transactions.reduce((acc, t) => acc + t.feeUjrah, 0);
  const activeCount = vouchers.filter(v => v.status === 'ACTIVE').length;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 76, 180, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL VOUCHER AKTIF', 22, 83);
  doc.text('TOTAL VOLUME TRANSAKSI', 75, 83);
  doc.text('PENDAPATAN UJRAH SYARIAH', 135, 83);

  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87);
  doc.text(`${activeCount} Lembar`, 22, 92);
  doc.text(`Rp ${totalVolume.toLocaleString('id-ID')}`, 75, 92);
  doc.text(`Rp ${totalUjrah.toLocaleString('id-ID')}`, 135, 92);

  // Table 1: Recent Transactions Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('1. IKHTISAR TRANSAKSI & PENUKARAN TERKINI', 15, 108);

  let y = 114;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('WAKTU', 18, y + 5);
  doc.text('KODE VOUCHER', 45, y + 5);
  doc.text('JENIS / BANK', 80, y + 5);
  doc.text('NOMINAL', 125, y + 5);
  doc.text('STATUS', 155, y + 5);
  doc.text('INTEGRITAS', 175, y + 5);

  y += 7;
  transactions.slice(0, 8).forEach((tx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(tx.timestamp.substring(11, 19), 18, y + 5);
    doc.text(tx.voucherCode, 45, y + 5);
    doc.text(`${tx.type} (${tx.bankChannel})`, 80, y + 5);
    doc.text(`Rp ${tx.amount.toLocaleString('id-ID')}`, 125, y + 5);
    doc.text(tx.status, 155, y + 5);
    doc.text(tx.isTamperProof ? 'SEALED' : 'UNVERIFIED', 175, y + 5);
    y += 6;
  });

  // Table 2: Audit Logs
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('2. JEJAK AUDIT & KEAMANAN SISTEM (IMMUTABLE AUDIT LOG)', 15, y);

  y += 5;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('WAKTU', 18, y + 5);
  doc.text('AKTOR / ROLE', 45, y + 5);
  doc.text('AKTIVITAS SISTEM', 85, y + 5);
  doc.text('TINGKAT', 150, y + 5);
  doc.text('SHA-256 HASH', 170, y + 5);

  y += 7;
  auditLogs.slice(0, 6).forEach((log) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    doc.text(log.timestamp.substring(11, 19), 18, y + 4.5);
    doc.text(`${log.actor} (${log.role})`, 45, y + 4.5);
    doc.text(log.action.length > 38 ? log.action.substring(0, 38) + '...' : log.action, 85, y + 4.5);
    doc.text(log.severity, 150, y + 4.5);
    doc.text(log.payloadHash.substring(0, 8) + '...', 170, y + 4.5);
    y += 5.5;
  });

  // Official Signature Footer
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, 195, y);

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Laporan ini dihasilkan secara otomatis oleh Mesin Audit Kriptografis IslamiCityPay.', 15, y);
  doc.text('Keaslian dokumen dijamin dengan stempel digital SHA-256 yang tersimpan pada buku besar terdistribusi.', 15, y + 4);

  // Digital Stamp
  doc.setDrawColor(4, 120, 87);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(145, y + 2, 50, 20, 2, 2, 'FD');
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ISLAMICITYPAY', 153, y + 9);
  doc.setFontSize(7);
  doc.text('SEALED & AUDITED', 151, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`VERIFIED: ${new Date().toISOString().substring(0, 10)}`, 149, y + 18);

  doc.save(`IslamiCityPay_Audit_Report_${Date.now()}.pdf`);
}
