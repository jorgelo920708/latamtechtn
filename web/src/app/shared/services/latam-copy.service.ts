import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CopySource } from '../enums/copy-source.enum';
import { LATAM_COPY_ID } from '../models/copy/latam-copy.model';

export type Language = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class LatamCopyService {
  currentLang = signal<Language>('es');
  private copies = new Map<string, BehaviorSubject<any>>();

  async init(): Promise<void> {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'es') {
      await this.loadLanguage(saved);
      return;
    }
    await this.loadLanguage('es');
  }

  async loadLanguage(lang: Language): Promise<void> {
    const url = lang === 'en' ? CopySource.EN : CopySource.ES;
    const response = await fetch(url);
    const data = await response.json();

    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);

    if (!this.copies.has(LATAM_COPY_ID)) {
      this.copies.set(LATAM_COPY_ID, new BehaviorSubject<any>(data));
    } else {
      this.copies.get(LATAM_COPY_ID)!.next(data);
    }
  }

  getObservableSlice<T>(id: string): Observable<T> {
    if (!this.copies.has(id)) {
      this.copies.set(id, new BehaviorSubject<any>({}));
    }
    return this.copies.get(id)!.asObservable();
  }

  async toggle(): Promise<void> {
    const next = this.currentLang() === 'en' ? 'es' : 'en';
    await this.loadLanguage(next);
  }
}
