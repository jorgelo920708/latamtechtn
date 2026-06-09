// Pure CSV -> candidate parser for the admin bulk-import button.
// Handles the real Google Form export format (radio-bullet "○" prefixes,
// salary ranges/units, the mislabeled "Modalidad Preferida" stack column,
// messy "País de residencia" values, etc.). No Angular deps -> unit-testable.

export interface CandidateCsvInput {
  fullName: string;
  email: string;
  location: string;
  city?: string;
  englishLevel: string;
  phone?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  mainRole?: string;
  otherRoles?: string;
  mainStack?: string;
  yearsExperience?: string;
  workedInternational?: boolean;
  willingContractor?: boolean;
  jobSearchStatus?: string;
  desiredSalary?: number;
  minSalary?: number;
  availability?: string;
  message?: string;
}

const ENGLISH_LEVELS: Record<string, string> = {
  A1: 'A1 – Principiante',
  A2: 'A2 – Básico',
  B1: 'B1 – Intermedio',
  B2: 'B2 – Intermedio Alto',
  C1: 'C1 – Avanzado',
  C2: 'C2 – Bilingüe / Fluido',
};

const AVAILABILITY = ['Inmediata', '15 días', '30 días', 'Más de 30 días'];
const JOB_SEARCH = [
  'Sí, estoy buscando activamente',
  'Escucho propuestas interesantes',
  'No estoy buscando actualmente',
];

// Values that belong to a "modality" question, not a tech stack. The Google
// Form column header says "Modalidad Preferida" but mostly carries the stack;
// these few rows carry an actual modality, which we drop from mainStack.
const MODALITY = new Set([
  'remoto',
  'hibrido',
  'presencial',
  'remote',
  'hybrid',
  'onsite',
  'indistinto',
  'flexible',
  'remoto/hibrido',
]);

const COUNTRIES: Record<string, string> = {
  argentina: 'Argentina',
  bolivia: 'Bolivia',
  brasil: 'Brasil',
  brazil: 'Brasil',
  chile: 'Chile',
  colombia: 'Colombia',
  'costa rica': 'Costa Rica',
  cuba: 'Cuba',
  ecuador: 'Ecuador',
  'el salvador': 'El Salvador',
  espana: 'España',
  spain: 'España',
  'estados unidos': 'Estados Unidos',
  usa: 'Estados Unidos',
  'united states': 'Estados Unidos',
  eeuu: 'Estados Unidos',
  guatemala: 'Guatemala',
  honduras: 'Honduras',
  mexico: 'México',
  nicaragua: 'Nicaragua',
  panama: 'Panamá',
  paraguay: 'Paraguay',
  peru: 'Perú',
  'puerto rico': 'Puerto Rico',
  'republica dominicana': 'República Dominicana',
  'dominican republic': 'República Dominicana',
  uruguay: 'Uruguay',
  venezuela: 'Venezuela',
  canada: 'Canadá',
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// Strip the leading "○ " radio bullet(s); for multi-select answers ("○ A, ○ B")
// keep the first option.
function debullet(v: string): string {
  if (!v) return '';
  const parts = v
    .split('○')
    .map((p) => p.trim().replace(/,+$/, '').trim())
    .filter(Boolean);
  return parts.length ? parts[0] : v.trim();
}

function englishLevel(v: string): string | undefined {
  const m = /[ABC][12]/.exec(v || '');
  if (m) return ENGLISH_LEVELS[m[0]];
  const d = debullet(v);
  return d || undefined;
}

function pickOption(v: string | undefined, options: string[]): string | undefined {
  if (!v) return undefined;
  const d = debullet(v);
  for (const o of options) if (norm(o) === norm(d)) return o;
  for (const o of options) if (norm(v).includes(norm(o))) return o;
  return d || undefined;
}

// First numeric group, ignoring currency/units and range upper bounds.
// "4000 USD/mes" -> 4000, "1800 - 2500" -> 1800, "Alrededor de 1500" -> 1500.
function firstNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const m = /\d[\d.,]*/.exec(v);
  if (!m) return undefined;
  const digits = m[0].replace(/[^\d]/g, '');
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isFinite(n) ? n : undefined;
}

function cleanStack(v: string | undefined): string | undefined {
  const s = (v || '').trim();
  if (!s) return undefined;
  if (MODALITY.has(norm(s))) return undefined;
  return s.slice(0, 300);
}

function parseBool(value: string | undefined): boolean | undefined {
  if (!value) return undefined;
  const n = norm(value);
  if (['si', 'yes', 'true', '1', 'x'].includes(n)) return true;
  if (['no', 'false', '0'].includes(n)) return false;
  return undefined;
}

function cleanPhone(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const c = v.replace(/[^\d+]/g, '');
  return c ? c.slice(0, 40) : undefined;
}

function cleanLinkedin(v: string | undefined): string | undefined {
  let s = (v || '').trim();
  if (!s) return undefined;
  if (!/^https?:\/\//i.test(s) && (s.toLowerCase().startsWith('www.') || s.toLowerCase().includes('linkedin.'))) {
    s = 'https://' + s.replace(/^\/+/, '');
  }
  return s.slice(0, 300);
}

// Tidy a free-form "País de residencia" + optional Ciudad into a display
// "City, Country" string plus the separated city (sub-national part).
// "Argentina - Tucumán" -> { location: "Tucumán, Argentina", city: "Tucumán" }.
function normalizeLocation(
  country: string | undefined,
  city: string | undefined,
): { location: string; city: string | undefined } {
  const raw = (country || '').replace(/ - /g, ', ').replace(/\//g, ', ');
  const tokens = raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  let detected: string | undefined;
  const others: string[] = [];
  for (const t of tokens) {
    const c = COUNTRIES[norm(t)];
    if (c && !detected) detected = c;
    else others.push(t);
  }
  if (city && city.trim() && !others.some((o) => norm(o) === norm(city))) {
    others.unshift(city.trim());
  }
  let location: string;
  if (detected) location = others.length ? [...others, detected].join(', ') : detected;
  else if (tokens.length) location = tokens.join(', ');
  else location = city ? city.trim() : '';
  const cityOut = others.join(', ').trim();
  return { location: location.slice(0, 160), city: cityOut ? cityOut.slice(0, 120) : undefined };
}

function yearsExperience(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const t = v.split(',')[0].trim();
  return t ? t.slice(0, 20) : undefined;
}

function mapHeader(header: string): string | null {
  const n = norm(header);
  if (!n) return null;
  if (n.includes('nombre') || n.includes('full name')) return 'fullName';
  if (n.includes('email') || n.includes('correo') || n === 'e-mail') return 'email';
  if (n.includes('telefono') || n.includes('phone') || n.includes('celular')) return 'phone';
  if ((n.includes('pais') || n.includes('residencia')) && n.includes('ciudad')) return 'location';
  if (n.includes('ciudad') || n === 'city') return 'city';
  if (n.includes('pais') || n.includes('residencia') || n.includes('country')) return 'country';
  if (n.includes('linkedin')) return 'linkedinUrl';
  if (n.includes('cv') || n.includes('curriculum') || n.includes('resume')) return 'cvUrl';
  // Check the free-text "anything else" column early: its long question text mentions
  // "experiencia"/"disponibilidad", which would otherwise be misread as those fields.
  if (
    n.includes('algo mas') ||
    n.includes('comentario') ||
    n.includes('mensaje') ||
    n.includes('message') ||
    n.includes('anything else')
  )
    return 'message';
  if (n.includes('otros roles') || n.includes('other roles')) return 'otherRoles';
  if (n.includes('rol principal') || n === 'rol' || n === 'role' || n.includes('primary role'))
    return 'mainRole';
  // "Modalidad Preferida" actually carries the tech stack in this form; "stalk" is a typo of stack.
  // The "stalk" column is a secondary fallback used only when the primary stack is empty/modality.
  if (n.includes('stalk')) return 'mainStackAlt';
  if (n.includes('stack') || n.includes('modalidad')) return 'mainStack';
  if (n.includes('experiencia') || n.includes('experience') || n.includes('anos'))
    return 'yearsExperience';
  if (n.includes('ingles') || n.includes('english')) return 'englishLevel';
  // contractor must be checked before "internacional" (its text contains "internacionales").
  if (n.includes('contractor')) return 'willingContractor';
  if (n.includes('internacional')) return 'workedInternational';
  if (n.includes('buscando') || n.includes('activamente') || n.includes('searching'))
    return 'jobSearchStatus';
  if (n.includes('salario') && (n.includes('deseado') || n.includes('desired')))
    return 'desiredSalary';
  if (n.includes('salario') && (n.includes('minimo') || n.includes('minimum') || n.includes('aceptable')))
    return 'minSalary';
  if (n.includes('disponibilidad') || n.includes('availability')) return 'availability';
  return null;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      continue;
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function parseCandidatesCsv(text: string): CandidateCsvInput[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => mapHeader(h));
  const seen = new Set<string>();
  const out: CandidateCsvInput[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.every((c) => !c.trim())) continue;
    const v: Record<string, string> = {};
    headers.forEach((key, idx) => {
      // keep the first non-empty value for a mapped key (handles duplicate columns)
      if (key && !v[key]) v[key] = (row[idx] ?? '').trim();
    });
    const fullName = v['fullName'];
    const email = (v['email'] || '').trim();
    if (!fullName || !EMAIL_RE.test(email)) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const resolved = normalizeLocation(v['country'] || v['location'], v['city']);
    out.push({
      fullName: fullName.slice(0, 120),
      email,
      location: resolved.location || '—',
      city: resolved.city,
      englishLevel: englishLevel(v['englishLevel']) || '—',
      phone: cleanPhone(v['phone']),
      linkedinUrl: cleanLinkedin(v['linkedinUrl']),
      cvUrl: v['cvUrl'] ? v['cvUrl'].slice(0, 500) : undefined,
      mainRole: v['mainRole'] ? v['mainRole'].slice(0, 120) : undefined,
      otherRoles: v['otherRoles'] ? v['otherRoles'].slice(0, 500) : undefined,
      mainStack:
        cleanStack(v['mainStack']) ?? (v['mainStackAlt'] ? v['mainStackAlt'].slice(0, 300) : undefined),
      yearsExperience: yearsExperience(v['yearsExperience']),
      availability: pickOption(v['availability'], AVAILABILITY),
      jobSearchStatus: pickOption(v['jobSearchStatus'], JOB_SEARCH),
      message: v['message'] ? v['message'].slice(0, 2000) : undefined,
      desiredSalary: firstNumber(v['desiredSalary']),
      minSalary: firstNumber(v['minSalary']),
      workedInternational: parseBool(v['workedInternational']),
      willingContractor: parseBool(v['willingContractor']),
    });
  }
  return out;
}
