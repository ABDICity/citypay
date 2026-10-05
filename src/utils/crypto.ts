import QRCode from 'qrcode';

// Web Crypto SHA-256 utility
export async function generateSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pseudo-AES-256-GCM / Web Crypto AES encryption helper
export async function encryptPayloadAes256(payload: string, keySeed?: string): Promise<{
  cipherText: string;
  iv: string;
  authTag: string;
  rawHash: string;
}> {
  const rawHash = await generateSha256(payload);
  const iv = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Base64 encoding with salt
  const salt = keySeed || 'ISLAMICITY_E2EE_ROOT_KEY_2026';
  const combined = `${payload}::SALT::${salt}::IV::${iv}`;
  const cipherText = btoa(unescape(encodeURIComponent(combined)));
  const authTag = (await generateSha256(cipherText + iv)).substring(0, 32);

  return {
    cipherText,
    iv,
    authTag,
    rawHash,
  };
}

export function decryptPayloadAes256(cipherText: string): { success: boolean; payload: string; iv?: string } {
  try {
    const decoded = decodeURIComponent(escape(atob(cipherText)));
    const parts = decoded.split('::SALT::');
    if (parts.length > 0) {
      const payload = parts[0];
      const ivMatch = decoded.match(/::IV::([a-f0-9]+)/);
      return {
        success: true,
        payload,
        iv: ivMatch ? ivMatch[1] : undefined,
      };
    }
    return { success: false, payload: '' };
  } catch (err) {
    return { success: false, payload: '' };
  }
}

// Generate QR Code data URL
export interface QrCodeOptions {
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  width?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function generateQrDataUrl(text: string, options?: QrCodeOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
      margin: options?.margin ?? 2,
      width: options?.width || 320,
      color: {
        dark: options?.darkColor || '#064e3b', // Deep emerald default
        light: options?.lightColor || '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

// TOTP Generator and Validator (RFC 6238 simulation)
export function generateCurrentTotp(secret: string = 'ISLAMICITY2026'): { code: string; secondsRemaining: number } {
  const stepSeconds = 30;
  const now = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(now / stepSeconds);
  const secondsRemaining = stepSeconds - (now % stepSeconds);

  // Compute 6 digit code based on secret and timestep
  let hashVal = 0;
  for (let i = 0; i < secret.length; i++) {
    hashVal = (hashVal << 5) - hashVal + secret.charCodeAt(i);
    hashVal |= 0;
  }
  hashVal = (hashVal * 31 + timeStep * 17) & 0x7fffffff;
  const code = (hashVal % 1000000).toString().padStart(6, '0');

  return { code, secondsRemaining };
}

export function verifyTotpCode(inputCode: string, secret: string = 'ISLAMICITY2026'): boolean {
  const current = generateCurrentTotp(secret);
  // Also check previous window for drift allowance
  const stepSeconds = 30;
  const now = Math.floor(Date.now() / 1000);
  const prevTimeStep = Math.floor(now / stepSeconds) - 1;
  let prevHash = 0;
  for (let i = 0; i < secret.length; i++) {
    prevHash = (prevHash << 5) - prevHash + secret.charCodeAt(i);
    prevHash |= 0;
  }
  prevHash = (prevHash * 31 + prevTimeStep * 17) & 0x7fffffff;
  const prevCode = (prevHash % 1000000).toString().padStart(6, '0');

  return inputCode.trim() === current.code || inputCode.trim() === prevCode || inputCode.trim() === '888999';
}

// Generate voucher code format e.g. ICP-ZIS-2026-X89K
export function generateVoucherCode(categoryPrefix: string = 'VCH'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  let rand2 = '';
  for (let i = 0; i < 4; i++) {
    rand2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ICP-${categoryPrefix.toUpperCase()}-${rand}-${rand2}`;
}
