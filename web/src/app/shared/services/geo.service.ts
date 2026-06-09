import { Injectable } from '@angular/core';

type GeoData = Record<string, Record<string, string[]>>;

// Maps the Spanish country option labels used in the forms to ISO2 codes,
// which key the lazy-loaded /assets/latam-geo.json (states -> cities).
const COUNTRY_ISO: Record<string, string> = {
  Argentina: 'AR',
  Bolivia: 'BO',
  Brasil: 'BR',
  Chile: 'CL',
  Colombia: 'CO',
  'Costa Rica': 'CR',
  Cuba: 'CU',
  Ecuador: 'EC',
  'El Salvador': 'SV',
  España: 'ES',
  'Estados Unidos': 'US',
  Guatemala: 'GT',
  Honduras: 'HN',
  México: 'MX',
  Nicaragua: 'NI',
  Panamá: 'PA',
  Paraguay: 'PY',
  Perú: 'PE',
  'Puerto Rico': 'PR',
  'República Dominicana': 'DO',
  Uruguay: 'UY',
  Venezuela: 'VE',
  Canadá: 'CA',
};

@Injectable({ providedIn: 'root' })
export class GeoService {
  private data: GeoData | null = null;
  private loading: Promise<void> | null = null;

  /** Lazy-fetch the LATAM geo dataset once (~240 KB gzipped). */
  async ensureLoaded(): Promise<void> {
    if (this.data) return;
    if (!this.loading) {
      this.loading = fetch('/assets/latam-geo.json')
        .then((r) => (r.ok ? r.json() : {}))
        .then((d: GeoData) => {
          this.data = d;
        })
        .catch(() => {
          this.data = {};
        });
    }
    await this.loading;
  }

  /** States/provinces for a country label (empty until loaded or if unknown). */
  states(countryLabel: string): string[] {
    const iso = COUNTRY_ISO[countryLabel];
    if (!iso || !this.data) return [];
    return Object.keys(this.data[iso] ?? {});
  }

  /** Cities for a country+state (empty until loaded or if unknown). */
  cities(countryLabel: string, stateLabel: string): string[] {
    const iso = COUNTRY_ISO[countryLabel];
    if (!iso || !this.data || !stateLabel) return [];
    return this.data[iso]?.[stateLabel] ?? [];
  }
}
