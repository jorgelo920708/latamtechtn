export interface PhoneCode {
  code: string;
  label: string;
}

export const PHONE_CODES: PhoneCode[] = [
  { code: '+52', label: '🇲🇽 +52' },
  { code: '+54', label: '🇦🇷 +54' },
  { code: '+55', label: '🇧🇷 +55' },
  { code: '+56', label: '🇨🇱 +56' },
  { code: '+57', label: '🇨🇴 +57' },
  { code: '+51', label: '🇵🇪 +51' },
  { code: '+598', label: '🇺🇾 +598' },
  { code: '+593', label: '🇪🇨 +593' },
  { code: '+591', label: '🇧🇴 +591' },
  { code: '+595', label: '🇵🇾 +595' },
  { code: '+58', label: '🇻🇪 +58' },
  { code: '+507', label: '🇵🇦 +507' },
  { code: '+506', label: '🇨🇷 +506' },
  { code: '+502', label: '🇬🇹 +502' },
  { code: '+503', label: '🇸🇻 +503' },
  { code: '+504', label: '🇭🇳 +504' },
  { code: '+505', label: '🇳🇮 +505' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+34', label: '🇪🇸 +34' },
];

/** Formats a local phone number's digits as 000-000-0000 (groups of 3-3-4). */
export function formatPhoneNumber(value: string | null | undefined): string {
  const d = (value ?? '').replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}-${d.slice(10)}`;
}
