import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  searchPlaceholder: string;
  nav: {
    dashboard: string;
    content: string;
    vouchers: string;
    security: string;
    bankingApi: string;
    auditLog: string;
    reports: string;
    mobileWallet: string;
    aiAdvisor: string;
    masjidPay: string;
    settings: string;
  };
  metrics: {
    activeVouchers: string;
    totalCirculation: string;
    redemptionVelocity: string;
    shariaRevenue: string;
    ziswafDisbursed: string;
    shariaComplianceRate: string;
    e2eeIntegrity: string;
    todayTransactions: string;
  };
  actions: {
    issueVoucher: string;
    redeemVoucher: string;
    exportReport: string;
    enable2fa: string;
    disable2fa: string;
    verify2fa: string;
    encryptPayload: string;
    testApi: string;
    refreshData: string;
    viewDetails: string;
    filter: string;
    search: string;
    copyCode: string;
    copied: string;
    downloadPdf: string;
    downloadExcel: string;
    cancel: string;
    save: string;
    confirm: string;
    close: string;
    scanQr: string;
    clearAll: string;
    markAsRead: string;
    generateApiKey: string;
    regenerateKeys: string;
  };
  voucherCategories: {
    ziswaf: string;
    umrah_hajj: string;
    halal_mart: string;
    islamic_education: string;
    masjid_community: string;
    qurban_aqiqah: string;
  };
  status: {
    active: string;
    redeemed: string;
    expired: string;
    frozen: string;
    allocated: string;
    success: string;
    pending: string;
    blocked: string;
    flagged: string;
    connected: string;
    syncing: string;
    maintenance: string;
  };
  security: {
    e2eeStatus: string;
    e2eeDesc: string;
    twoFactorTitle: string;
    twoFactorDesc: string;
    shariaSeal: string;
    cipherEngine: string;
    integrityVerified: string;
    tamperProofCount: string;
    activeEncryption: string;
  };
  banking: {
    title: string;
    subtitle: string;
    bankEcosystem: string;
    apiSandbox: string;
    protocols: string;
    latency: string;
    shariaContractNo: string;
  };
  audit: {
    title: string;
    subtitle: string;
    dsnMuiCertified: string;
    ojkCompliant: string;
    exportAuditTrail: string;
    actor: string;
    action: string;
    hashSignature: string;
    timestamp: string;
    severity: string;
  };
  wallet: {
    title: string;
    subtitle: string;
    scanToPay: string;
    myVouchers: string;
    recentActivities: string;
    availableBalance: string;
  };
  ai: {
    title: string;
    subtitle: string;
    askPlaceholder: string;
    shariaComplianceChecker: string;
    anomalyDetected: string;
  };
  notifications: {
    title: string;
    noNotifications: string;
    pushEnabled: string;
    pushDisabled: string;
    togglePush: string;
  };
  export: {
    title: string;
    subtitle: string;
    selectType: string;
    dateRange: string;
    includeAudit: string;
    includeShariaSeals: string;
    exportPdf: string;
    exportExcel: string;
    exportCsv: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    appName: 'IslamiCityPay',
    appSubtitle: 'Infrastruktur Cerdas Voucher Digital & Gateway Perbankan Syariah',
    tagline: 'Platform Pengelolaan Voucher Halal Terenkripsi End-to-End dengan Analitik Real-Time',
    searchPlaceholder: 'Cari kode voucher, transaksi, audit hash, atau merchant...',
    nav: {
      dashboard: 'Analitik Real-Time',
      content: 'Konten & Formulir (CMS)',
      vouchers: 'Kelola Voucher',
      security: 'Keamanan & Enkripsi',
      bankingApi: 'Gateway API Syariah',
      auditLog: 'Audit Log & Regulasi',
      reports: 'Pelaporan Otomatis',
      mobileWallet: 'Dompet Digital Mobile',
      aiAdvisor: 'AI Sharia & Anomali',
      masjidPay: 'Smart MasjidPay',
      settings: 'Pengaturan & Kustomisasi',
    },
    metrics: {
      activeVouchers: 'Voucher Aktif Beredar',
      totalCirculation: 'Total Nilai Likuiditas',
      redemptionVelocity: 'Kecepatan Penukaran',
      shariaRevenue: 'Pendapatan Ujrah Syariah',
      ziswafDisbursed: 'Penyaluran ZISWAF',
      shariaComplianceRate: 'Kepatuhan Syariah DSN-MUI',
      e2eeIntegrity: 'Integritas Enkripsi E2EE',
      todayTransactions: 'Transaksi Hari Ini',
    },
    actions: {
      issueVoucher: 'Terbitkan Voucher Baru',
      redeemVoucher: 'Tukar / Redeem Voucher',
      exportReport: 'Ekspor Laporan (PDF/Excel)',
      enable2fa: 'Aktifkan 2FA',
      disable2fa: 'Nonaktifkan 2FA',
      verify2fa: 'Verifikasi Kode 2FA',
      encryptPayload: 'Enkripsi Payload AES-256',
      testApi: 'Uji Endpoint API',
      refreshData: 'Perbarui Data',
      viewDetails: 'Lihat Detail',
      filter: 'Filter',
      search: 'Cari',
      copyCode: 'Salin Kode',
      copied: 'Tersalin!',
      downloadPdf: 'Unduh Dokumen PDF Resmi',
      downloadExcel: 'Unduh Lembar Kerja Excel',
      cancel: 'Batal',
      save: 'Simpan',
      confirm: 'Konfirmasi Transaksi',
      close: 'Tutup',
      scanQr: 'Pindai QR Voucher',
      clearAll: 'Bersihkan Semua',
      markAsRead: 'Tandai Sudah Dibaca',
      generateApiKey: 'Buat API Key Baru',
      regenerateKeys: 'Rotasi Kunci Kriptografi',
    },
    voucherCategories: {
      ziswaf: 'Zakat, Infaq & Wakaf (ZISWAF)',
      umrah_hajj: 'Paket Umrah & Haji Halal',
      halal_mart: 'Halal Mart & UMKM Syariah',
      islamic_education: 'Pendidikan & Pesantren',
      masjid_community: 'Kemakmuran Masjid & Dakwah',
      qurban_aqiqah: 'Qurban & Aqiqah Berkah',
    },
    status: {
      active: 'AKTIF',
      redeemed: 'TERTUKAR',
      expired: 'KEDALUWARSA',
      frozen: 'DIBEKUKAN',
      allocated: 'TERALOKASI',
      success: 'BERHASIL',
      pending: 'MEMPROSES',
      blocked: 'DIBLOKIR',
      flagged: 'DITANDAI',
      connected: 'TERHUBUNG',
      syncing: 'SINKRONISASI',
      maintenance: 'PEMELIHARAAN',
    },
    security: {
      e2eeStatus: 'Enkripsi Ujung-ke-Ujung (E2EE) Aktif',
      e2eeDesc: 'Setiap voucher dilindungi algoritma AES-256-GCM dengan verifikasi tanda tangan digital SHA-256 anti-tamper.',
      twoFactorTitle: 'Autentikasi Dua Faktor (2FA)',
      twoFactorDesc: 'Perlindungan ganda dengan Time-based One-Time Password (TOTP) untuk setiap transaksi dan akses admin.',
      shariaSeal: 'Segel Kriptografis Kepatuhan Syariah',
      cipherEngine: 'Mesin Enkripsi AES-256-GCM / HMAC-SHA256',
      integrityVerified: '100% Integritas Data Terverifikasi',
      tamperProofCount: 'Segel Anti-Manipulasi Terbit',
      activeEncryption: 'Enkripsi Aktif 256-bit',
    },
    banking: {
      title: 'Gateway Integrasi Perbankan Syariah & Open API',
      subtitle: 'Konektivitas langsung ke perbankan syariah nasional via SNAP-BI, BI-FAST, dan ISO 20022 Syariah',
      bankEcosystem: 'Ekosistem Bank Syariah Terintegrasi',
      apiSandbox: 'Konsol Uji API & Dokumentasi Interaktif',
      protocols: 'Protokol Finansial',
      latency: 'Latensi Respon',
      shariaContractNo: 'No. Akad Kerjasama',
    },
    audit: {
      title: 'Modul Audit Log & Kepatuhan Regulasi',
      subtitle: 'Jejak audit finansial tak terhapuskan (immutable log) sesuai standar OJK, Bank Indonesia & DSN-MUI',
      dsnMuiCertified: 'Sertifikasi DSN-MUI Terpenuhi',
      ojkCompliant: 'Standar Kepatuhan OJK & BI-FAST',
      exportAuditTrail: 'Ekspor Jejak Audit Lengkap',
      actor: 'Pelaku / User',
      action: 'Aktivitas',
      hashSignature: 'Hash Verifikasi SHA-256',
      timestamp: 'Waktu Transaksi',
      severity: 'Tingkat Keparahan',
    },
    wallet: {
      title: 'Dompet Voucher Digital IslamiCityPay',
      subtitle: 'Antarmuka responsif pengguna & simulasi POS Kasir Merchant Syariah',
      scanToPay: 'Pindai QR Voucher / Bayar',
      myVouchers: 'Koleksi Voucher Saya',
      recentActivities: 'Aktivitas Transaksi Terkini',
      availableBalance: 'Saldo Tersedia',
    },
    ai: {
      title: 'Asisten AI Syariah & Deteksi Anomali',
      subtitle: 'Analisis cerdas pola transaksi real-time, rekomendasi alokasi ZISWAF, dan audit otomatis',
      askPlaceholder: 'Tanyakan mengenai kepatuhan akad, pola penukaran voucher, atau anomali transaksi...',
      shariaComplianceChecker: 'Pemeriksa Otomatis Kepatuhan Akad',
      anomalyDetected: 'Deteksi Anomali Penipuan / Duplikasi',
    },
    notifications: {
      title: 'Pemberitahuan Sistem & Transaksi',
      noNotifications: 'Tidak ada pemberitahuan baru',
      pushEnabled: 'Notifikasi Push Instan Aktif',
      pushDisabled: 'Notifikasi Push Dinonaktifkan',
      togglePush: 'Ubah Pengaturan Notifikasi Push',
    },
    export: {
      title: 'Ekspor Laporan & Sertifikat Audit',
      subtitle: 'Hasilkan laporan resmi berstempel kriptografis untuk audit perbankan dan internal',
      selectType: 'Pilih Jenis Laporan',
      dateRange: 'Rentang Periode',
      includeAudit: 'Sertakan Hash Audit Log Lengkap',
      includeShariaSeals: 'Sertakan Sertifikat Kepatuhan Syariah DSN-MUI',
      exportPdf: 'Hasilkan Dokumen PDF',
      exportExcel: 'Ekspor ke Excel (XLSX)',
      exportCsv: 'Ekspor ke Format CSV',
    },
  },
  en: {
    appName: 'IslamiCityPay',
    appSubtitle: 'Intelligent Digital Voucher Infrastructure & Sharia Banking Gateway',
    tagline: 'End-to-End Encrypted Halal Digital Voucher Lifecycle Platform with Real-Time Analytics',
    searchPlaceholder: 'Search voucher code, transaction, audit hash, or merchant...',
    nav: {
      dashboard: 'Real-Time Analytics',
      content: 'Content & Forms (CMS)',
      vouchers: 'Voucher Management',
      security: 'Security & E2EE',
      bankingApi: 'Sharia Banking APIs',
      auditLog: 'Audit Logs & Regs',
      reports: 'Automated Reports',
      mobileWallet: 'Mobile Voucher Wallet',
      aiAdvisor: 'AI Sharia & Anomaly',
      masjidPay: 'Smart MasjidPay',
      settings: 'Settings & Config',
    },
    metrics: {
      activeVouchers: 'Active Circulating Vouchers',
      totalCirculation: 'Total Liquidity Value',
      redemptionVelocity: 'Redemption Velocity',
      shariaRevenue: 'Sharia Ujrah Revenue',
      ziswafDisbursed: 'ZISWAF Disbursed',
      shariaComplianceRate: 'DSN-MUI Sharia Compliance',
      e2eeIntegrity: 'E2EE Cryptographic Integrity',
      todayTransactions: 'Transactions Today',
    },
    actions: {
      issueVoucher: 'Issue New Voucher',
      redeemVoucher: 'Redeem Voucher',
      exportReport: 'Export Reports (PDF/Excel)',
      enable2fa: 'Enable 2FA',
      disable2fa: 'Disable 2FA',
      verify2fa: 'Verify 2FA Code',
      encryptPayload: 'Encrypt AES-256 Payload',
      testApi: 'Test API Endpoint',
      refreshData: 'Refresh Data',
      viewDetails: 'View Details',
      filter: 'Filter',
      search: 'Search',
      copyCode: 'Copy Code',
      copied: 'Copied!',
      downloadPdf: 'Download Official PDF Report',
      downloadExcel: 'Download Excel Worksheet',
      cancel: 'Cancel',
      save: 'Save',
      confirm: 'Confirm Transaction',
      close: 'Close',
      scanQr: 'Scan Voucher QR',
      clearAll: 'Clear All',
      markAsRead: 'Mark as Read',
      generateApiKey: 'Generate New API Key',
      regenerateKeys: 'Rotate Cryptographic Keys',
    },
    voucherCategories: {
      ziswaf: 'Zakat, Infaq & Waqf (ZISWAF)',
      umrah_hajj: 'Umrah & Hajj Packages',
      halal_mart: 'Halal Mart & Sharia MSMEs',
      islamic_education: 'Islamic Education & Boarding',
      masjid_community: 'Masjid Welfare & Dakwah',
      qurban_aqiqah: 'Qurban & Aqiqah Blessings',
    },
    status: {
      active: 'ACTIVE',
      redeemed: 'REDEEMED',
      expired: 'EXPIRED',
      frozen: 'FROZEN',
      allocated: 'ALLOCATED',
      success: 'SUCCESS',
      pending: 'PROCESSING',
      blocked: 'BLOCKED',
      flagged: 'FLAGGED',
      connected: 'CONNECTED',
      syncing: 'SYNCING',
      maintenance: 'MAINTENANCE',
    },
    security: {
      e2eeStatus: 'End-to-End Encryption (E2EE) Active',
      e2eeDesc: 'Every voucher is sealed with AES-256-GCM cipher and anti-tamper SHA-256 digital signatures.',
      twoFactorTitle: 'Two-Factor Authentication (2FA)',
      twoFactorDesc: 'Dual-layer protection with Time-based One-Time Password (TOTP) for high-value operations.',
      shariaSeal: 'Cryptographic Sharia Compliance Seal',
      cipherEngine: 'AES-256-GCM / HMAC-SHA256 Security Engine',
      integrityVerified: '100% Cryptographic Data Integrity Verified',
      tamperProofCount: 'Anti-Tamper Seals Issued',
      activeEncryption: 'Active 256-bit Cipher',
    },
    banking: {
      title: 'Sharia Open Banking & API Gateway',
      subtitle: 'Direct connectivity to Islamic banking networks via SNAP-BI, BI-FAST, and ISO-20022 Syariah',
      bankEcosystem: 'Integrated Islamic Banking Ecosystem',
      apiSandbox: 'Interactive API Sandbox & Documentation',
      protocols: 'Financial Protocols',
      latency: 'Response Latency',
      shariaContractNo: 'Sharia Agreement Ref',
    },
    audit: {
      title: 'Audit Trail & Financial Regulatory Compliance',
      subtitle: 'Immutable, tamper-evident audit ledger compliant with OJK, Central Bank, and DSN-MUI regulations',
      dsnMuiCertified: 'DSN-MUI Sharia Board Certified',
      ojkCompliant: 'Financial Regulatory & BI-FAST Compliant',
      exportAuditTrail: 'Export Comprehensive Audit Trail',
      actor: 'Actor / User',
      action: 'Activity',
      hashSignature: 'SHA-256 Verification Hash',
      timestamp: 'Timestamp',
      severity: 'Severity Level',
    },
    wallet: {
      title: 'IslamiCityPay Digital Voucher Wallet',
      subtitle: 'Responsive user mobile view & Islamic Merchant POS terminal simulator',
      scanToPay: 'Scan QR Voucher / Pay',
      myVouchers: 'My Voucher Vault',
      recentActivities: 'Recent Transactions',
      availableBalance: 'Available Balance',
    },
    ai: {
      title: 'AI Sharia Advisor & Anomaly Detection',
      subtitle: 'Intelligent real-time transaction monitoring, ZISWAF allocation optimizer, and auto-auditor',
      askPlaceholder: 'Ask regarding Sharia contract validity, voucher redemption velocity, or fraud anomaly...',
      shariaComplianceChecker: 'Automated Sharia Contract Auditor',
      anomalyDetected: 'Fraud & Duplicate Redemption Detector',
    },
    notifications: {
      title: 'System & Transaction Notifications',
      noNotifications: 'No unread notifications',
      pushEnabled: 'Instant Push Alerts Enabled',
      pushDisabled: 'Push Alerts Muted',
      togglePush: 'Toggle Push Notification Settings',
    },
    export: {
      title: 'Export Audit Reports & Certificates',
      subtitle: 'Generate legally verifiable, cryptographically sealed reports for internal and banking audits',
      selectType: 'Select Report Type',
      dateRange: 'Time Period',
      includeAudit: 'Include Full Cryptographic Audit Hashes',
      includeShariaSeals: 'Include DSN-MUI Sharia Board Compliance Seal',
      exportPdf: 'Generate PDF Document',
      exportExcel: 'Export to Excel (XLSX)',
      exportCsv: 'Export to CSV Spreadsheet',
    },
  },
  ar: {
    appName: 'إسلامي سيتي باي',
    appSubtitle: 'البنية التحتية الذكية للقسائم الرقمية وبوابة الصيرفة الإسلامية',
    tagline: 'منصة إدارة القسائم الرقمية المتوافقة مع الشريعة والمشفرة بتشفير تام من طرف إلى طرف',
    searchPlaceholder: 'ابحث عن رمز القسيمة، المعاملة، رمز التجزئة، أو التاجر...',
    nav: {
      dashboard: 'التحليلات اللحظية',
      content: 'المحتوى والنماذج (CMS)',
      vouchers: 'إدارة القسائم',
      security: 'الأمان والتشفير',
      bankingApi: 'بوابة الصيرفة الإسلامية',
      auditLog: 'سجلات التدقيق والامتثال',
      reports: 'التقارير الآلية',
      mobileWallet: 'محفظة الجوال',
      aiAdvisor: 'المستشار الشرعي الذكي',
      masjidPay: 'سمارت مسجد باي',
      settings: 'الإعدادات والتهيئة',
    },
    metrics: {
      activeVouchers: 'القسائم النشطة المتداولة',
      totalCirculation: 'إجمالي قيمة السيولة',
      redemptionVelocity: 'سرعة الاسترداد',
      shariaRevenue: 'عائدات الأجرة الشرعية',
      ziswafDisbursed: 'أموال الزكاة والوقف المصروفة',
      shariaComplianceRate: 'نسبة الامتثال الشرعي',
      e2eeIntegrity: 'سلامة التشفير التام E2EE',
      todayTransactions: 'معاملات اليوم',
    },
    actions: {
      issueVoucher: 'إصدار قسيمة جديدة',
      redeemVoucher: 'استرداد / صرف القسيمة',
      exportReport: 'تصدير التقارير (PDF/Excel)',
      enable2fa: 'تفعيل المصادقة الثنائية',
      disable2fa: 'تعطيل المصادقة الثنائية',
      verify2fa: 'التحقق من رمز 2FA',
      encryptPayload: 'تشفير البيانات AES-256',
      testApi: 'اختبار واجهة البرمجة API',
      refreshData: 'تحديث البيانات',
      viewDetails: 'عرض التفاصيل',
      filter: 'تصفية',
      search: 'بحث',
      copyCode: 'نسخ الرمز',
      copied: 'تم النسخ!',
      downloadPdf: 'تحميل تقرير PDF رسمي',
      downloadExcel: 'تحميل ملف Excel',
      cancel: 'إلغاء',
      save: 'حفظ',
      confirm: 'تأكيد المعاملة',
      close: 'إغلاق',
      scanQr: 'مسح رمز QR للقسيمة',
      clearAll: 'مسح الكل',
      markAsRead: 'تحديد كمقروء',
      generateApiKey: 'إنشاء مفتاح API جديد',
      regenerateKeys: 'تدوير مفاتيح التشفير',
    },
    voucherCategories: {
      ziswaf: 'الزكاة والإنفاق والوقف (زكاة/وقف)',
      umrah_hajj: 'باقات العمرة والحج المباركة',
      halal_mart: 'المتاجر الحلال والمشاريع المتوافقة',
      islamic_education: 'التعليم الإسلامي والمدارس الشرعية',
      masjid_community: 'عمارة المساجد والدعوة',
      qurban_aqiqah: 'الأضاحي والعقيقة المباركة',
    },
    status: {
      active: 'نشط',
      redeemed: 'تم الصرف',
      expired: 'منتهي الصلاحية',
      frozen: 'مجمد',
      allocated: 'مخصص',
      success: 'ناجحة',
      pending: 'قيد المعالجة',
      blocked: 'محظورة',
      flagged: 'مشبوهة',
      connected: 'متصل',
      syncing: 'مزامنة',
      maintenance: 'صيانة',
    },
    security: {
      e2eeStatus: 'التشفير من طرف إلى طرف (E2EE) مفعل',
      e2eeDesc: 'كل قسيمة محمية بخوارزمية AES-256-GCM وتوقيعات رقمية SHA-256 تمنع أي تلاعب.',
      twoFactorTitle: 'المصادقة الثنائية (2FA)',
      twoFactorDesc: 'حماية مزدوجة باستخدام كلمات المرور المؤقتة (TOTP) للعمليات المالية الحساسة.',
      shariaSeal: 'الختم الرقمي للامتثال الشرعي',
      cipherEngine: 'محرك التشفير المتقدم AES-256-GCM',
      integrityVerified: '١٠٠٪ سلامة البيانات الرقمية مؤكدة',
      tamperProofCount: 'الأختام غير القابلة للتلاعب',
      activeEncryption: 'تشفير نشط ٢٥٦ بت',
    },
    banking: {
      title: 'بوابة الصيرفة الإسلامية وواجهات API المفتوحة',
      subtitle: 'اتصال مباشر مع البنوك الإسلامية عبر SNAP-BI و BI-FAST و ISO-20022 الشرعية',
      bankEcosystem: 'منظومة المصارف الإسلامية المتصلة',
      apiSandbox: 'بيئة اختبار وتوثيق API التفاعلية',
      protocols: 'البروتوكولات المالية',
      latency: 'سرعة الاستجابة',
      shariaContractNo: 'رقم العقد الشرعي',
    },
    audit: {
      title: 'سجل التدقيق والامتثال التنظيمي المالي',
      subtitle: 'سجل تدقيق مالي غير قابل للتعديل يتوافق مع معايير هيئة الرقابة الشرعية والبنك المركزي',
      dsnMuiCertified: 'معتمد من هيئة الرقابة الشرعية',
      ojkCompliant: 'متوافق مع المعايير المصرفية الرسمية',
      exportAuditTrail: 'تصدير مسار التدقيق الشامل',
      actor: 'المستخدم / النظام',
      action: 'النشاط',
      hashSignature: 'توقيع التحقق SHA-256',
      timestamp: 'الوقت والتاريخ',
      severity: 'مستوى الأهمية',
    },
    wallet: {
      title: 'محفظة قسائم إسلامي سيتي الرقمية',
      subtitle: 'واجهة المستخدم المتجاوبة ومحاكي نقاط البيع للمتاجر المعتمدة',
      scanToPay: 'مسح رمز QR للدفع',
      myVouchers: 'قسائمي المتاحة',
      recentActivities: 'المعاملات الأخيرة',
      availableBalance: 'الرصيد المتاح',
    },
    ai: {
      title: 'المستشار الشرعي بالذكاء الاصطناعي وكشف الاحتيال',
      subtitle: 'مراقبة فورية لأنماط المعاملات وتحسين توزيع أموال الزكاة والتدقيق التلقائي',
      askPlaceholder: 'اسأل عن صحة العقود الشرعية، سرعة التداول، أو اكتشاف الأنماط المشبوهة...',
      shariaComplianceChecker: 'التدقيق التلقائي للعقود الشرعية',
      anomalyDetected: 'كاشف الازدواجية والاحتيال',
    },
    notifications: {
      title: 'إشعارات النظام والمعاملات',
      noNotifications: 'لا توجد إشعارات غير مقروءة',
      pushEnabled: 'الإشعارات الفورية مفعلة',
      pushDisabled: 'تم كتم الإشعارات الفورية',
      togglePush: 'تعديل إعدادات الإشعارات',
    },
    export: {
      title: 'تصدير تقارير وشهادات التدقيق',
      subtitle: 'توليد تقارير رسمية مختومة رقمياً للتدقيق المحاسبي والشرعي الداخلي والمصرفي',
      selectType: 'اختر نوع التقرير',
      dateRange: 'الفترة الزمنية',
      includeAudit: 'تضمين بصمات التدقيق المشفرة كاملة',
      includeShariaSeals: 'تضمين ختم هيئة الرقابة الشرعية',
      exportPdf: 'توليد مستند PDF',
      exportExcel: 'تصدير إلى جدول Excel',
      exportCsv: 'تصدير بتنسيق CSV',
    },
  },
};
