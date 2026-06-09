import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminCandidateInput,
  AdminCompanyInput,
  AdminContactInput,
  AdminLeadInput,
  AdminService,
  CandidateApplication,
  Company,
  ContactRequest,
  TalentLead,
} from '../admin.service';
import { LatamCopyService } from '../../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../shared/models/copy/latam-copy.model';
import { PHONE_CODES } from '../../shared/constants/phone-codes';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalShellComponent } from '../../shared/components/modal-shell/modal-shell.component';
import { parseCandidatesCsv } from './candidate-csv';
import { firstValueFrom, Observable } from 'rxjs';

type Tab = 'overview' | 'leads' | 'candidates' | 'contacts' | 'companies' | 'account';
type DataTab = 'leads' | 'candidates' | 'contacts' | 'companies';
type ModalEntity = 'lead' | 'candidate' | 'contact' | 'company';

interface ActivityItem {
  kind: string;
  icon: string;
  title: string;
  subtitle: string;
  date: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, ModalShellComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private copy = inject(LatamCopyService);

  readonly email = this.adminService.email;
  readonly adminName = 'Elba Caseres';

  readonly t = toSignal(
    this.copy
      .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
      .pipe(map((c) => c?.admin?.dashboard)),
  );
  readonly r = computed(() => this.t()?.records);
  readonly lang = this.copy.currentLang;
  readonly formsCopy = toSignal(
    this.copy
      .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
      .pipe(map((c) => c?.landing?.forms?.candidate)),
  );

  activeTab = signal<Tab>('overview');
  loadError = signal(false);

  leads = signal<TalentLead[]>([]);
  candidates = signal<CandidateApplication[]>([]);
  contacts = signal<ContactRequest[]>([]);
  companies = signal<Company[]>([]);
  loaded = signal({ leads: false, candidates: false, contacts: false, companies: false });

  readonly companyNames = computed(() => this.companies().map((c) => c.name));

  search = signal('');

  filteredLeads = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.leads();
    return this.leads().filter((l) =>
      this.match(q, [l.name, l.company, l.email, l.role, l.specialty, l.message]),
    );
  });

  filteredCandidates = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.candidates();
    return this.candidates().filter((c) =>
      this.match(q, [
        c.fullName,
        c.email,
        c.location,
        c.mainRole,
        c.otherRoles,
        c.englishLevel,
        c.mainStack,
        c.availability,
        c.message,
      ]),
    );
  });

  filteredContacts = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.contacts();
    return this.contacts().filter((c) => this.match(q, [c.name, c.email, c.message]));
  });

  filteredCompanies = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.companies();
    return this.companies().filter((c) => this.match(q, [c.name, c.website, c.notes]));
  });

  allLoaded = computed(
    () => this.loaded().leads && this.loaded().candidates && this.loaded().contacts,
  );

  totalRecords = computed(
    () => this.leads().length + this.candidates().length + this.contacts().length,
  );

  recentActivity = computed<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    for (const lead of this.leads()) {
      items.push({
        kind: 'lead',
        icon: 'briefcase',
        title: lead.name,
        subtitle: `${lead.company} · ${lead.role}`,
        date: lead.createdAt,
      });
    }
    for (const candidate of this.candidates()) {
      items.push({
        kind: 'candidate',
        icon: 'users',
        title: candidate.fullName,
        subtitle: `${candidate.mainRole} · ${candidate.location}`,
        date: candidate.createdAt,
      });
    }
    for (const contact of this.contacts()) {
      items.push({
        kind: 'contact',
        icon: 'chat',
        title: contact.name,
        subtitle: contact.email,
        date: contact.createdAt,
      });
    }
    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  });

  pwSubmitting = signal(false);
  pwSuccess = signal(false);
  pwError = signal<string | null>(null);
  resetSending = signal(false);
  resetSent = signal(false);

  pwForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly phoneCodes = PHONE_CODES;
  modalEntity = signal<ModalEntity | null>(null);
  editingId = signal<string | null>(null);
  modalSubmitting = signal(false);
  modalError = signal(false);

  importing = signal(false);
  importProgress = signal(0);
  importTotal = signal(0);
  importResult = signal<string | null>(null);

  leadForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    specialty: ['', Validators.required],
    message: [''],
  });

  candidateForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    country: ['', Validators.required],
    city: [''],
    englishLevel: ['', Validators.required],
    phoneCode: ['+52'],
    phone: [''],
    linkedinUrl: [''],
    mainRole: [''],
    mainStack: [''],
    yearsExperience: [''],
    desiredSalary: [''],
    minSalary: [''],
    availability: [''],
    message: [''],
  });

  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  companyForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    website: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadLeads();
    this.loadCandidates();
    this.loadContacts();
    this.loadCompanies();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.search.set('');
  }

  toggleLang(): void {
    void this.copy.toggle();
  }

  title(): string {
    const t = this.t();
    if (!t) return '';
    switch (this.activeTab()) {
      case 'overview':
        return t.titleOverview;
      case 'leads':
        return t.titleLeads;
      case 'candidates':
        return t.titleCandidates;
      case 'contacts':
        return t.titleContacts;
      case 'companies':
        return t.titleCompanies;
      default:
        return t.titleAccount;
    }
  }

  kindLabel(kind: string): string {
    const t = this.t();
    if (!t) return '';
    return kind === 'lead' ? t.kindLead : kind === 'candidate' ? t.kindCandidate : t.kindContact;
  }

  waLink(phone: string | null | undefined): string {
    const digits = (phone ?? '').replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }

  ctrlInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  openCreate(entity: ModalEntity): void {
    this.editingId.set(null);
    this.modalError.set(false);
    if (entity === 'lead') this.leadForm.reset();
    else if (entity === 'candidate') this.candidateForm.reset({ phoneCode: '+52' });
    else if (entity === 'contact') this.contactForm.reset();
    else this.companyForm.reset();
    this.modalEntity.set(entity);
  }

  editLead(lead: TalentLead): void {
    this.editingId.set(lead.id);
    this.modalError.set(false);
    this.leadForm.setValue({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      role: lead.role,
      specialty: lead.specialty,
      message: lead.message ?? '',
    });
    this.modalEntity.set('lead');
  }

  editCandidate(c: CandidateApplication): void {
    this.editingId.set(c.id);
    this.modalError.set(false);
    const phone = this.splitPhone(c.phone);
    const loc = this.splitLocation(c.location);
    this.candidateForm.setValue({
      fullName: c.fullName,
      email: c.email,
      country: loc.country,
      city: loc.city,
      englishLevel: c.englishLevel,
      phoneCode: phone.code,
      phone: phone.number,
      linkedinUrl: c.linkedinUrl ?? '',
      mainRole: c.mainRole ?? '',
      mainStack: c.mainStack ?? '',
      yearsExperience: c.yearsExperience ?? '',
      desiredSalary: c.desiredSalary != null ? String(c.desiredSalary) : '',
      minSalary: c.minSalary != null ? String(c.minSalary) : '',
      availability: c.availability ?? '',
      message: c.message ?? '',
    });
    this.modalEntity.set('candidate');
  }

  editContact(ct: ContactRequest): void {
    this.editingId.set(ct.id);
    this.modalError.set(false);
    this.contactForm.setValue({
      name: ct.name,
      email: ct.email,
      message: ct.message,
    });
    this.modalEntity.set('contact');
  }

  closeModal(): void {
    this.modalEntity.set(null);
  }

  modalTitle(): string {
    const t = this.t();
    if (!t) return '';
    const action = this.editingId() ? t.editItem : t.newItem;
    const section =
      this.modalEntity() === 'lead'
        ? t.navLeads
        : this.modalEntity() === 'candidate'
          ? t.navCandidates
          : this.modalEntity() === 'contact'
            ? t.navContacts
            : t.navCompanies;
    return `${action} · ${section}`;
  }

  saveLead(): void {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }
    const raw = this.leadForm.getRawValue();
    const input: AdminLeadInput = {
      name: raw.name.trim(),
      company: raw.company.trim(),
      email: raw.email.trim(),
      role: raw.role.trim(),
      specialty: raw.specialty.trim(),
      message: raw.message.trim() || undefined,
    };
    const id = this.editingId();
    this.persist(
      id ? this.adminService.updateLead(id, input) : this.adminService.createLead(input),
      () => this.loadLeads(),
    );
  }

  saveCandidate(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }
    const raw = this.candidateForm.getRawValue();
    const input: AdminCandidateInput = {
      fullName: raw.fullName.trim(),
      email: raw.email.trim(),
      location: raw.city.trim() ? `${raw.city.trim()}, ${raw.country}` : raw.country,
      englishLevel: raw.englishLevel.trim(),
      phone: raw.phone.trim() ? `${raw.phoneCode} ${raw.phone.trim()}` : undefined,
      linkedinUrl: raw.linkedinUrl.trim() || undefined,
      mainRole: raw.mainRole.trim() || undefined,
      mainStack: raw.mainStack.trim() || undefined,
      yearsExperience: raw.yearsExperience.trim() || undefined,
      desiredSalary: this.num(raw.desiredSalary),
      minSalary: this.num(raw.minSalary),
      availability: raw.availability.trim() || undefined,
      message: raw.message.trim() || undefined,
    };
    const id = this.editingId();
    this.persist(
      id ? this.adminService.updateCandidate(id, input) : this.adminService.createCandidate(input),
      () => this.loadCandidates(),
    );
  }

  saveContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const raw = this.contactForm.getRawValue();
    const input: AdminContactInput = {
      name: raw.name.trim(),
      email: raw.email.trim(),
      message: raw.message.trim(),
    };
    const id = this.editingId();
    this.persist(
      id ? this.adminService.updateContact(id, input) : this.adminService.createContact(input),
      () => this.loadContacts(),
    );
  }

  deleteLead(id: string): void {
    if (!this.confirmDelete()) return;
    this.adminService.deleteLead(id).subscribe({
      next: () => this.loadLeads(),
      error: (err) => this.handleError(err),
    });
  }

  deleteCandidate(id: string): void {
    if (!this.confirmDelete()) return;
    this.adminService.deleteCandidate(id).subscribe({
      next: () => this.loadCandidates(),
      error: (err) => this.handleError(err),
    });
  }

  deleteContact(id: string): void {
    if (!this.confirmDelete()) return;
    this.adminService.deleteContact(id).subscribe({
      next: () => this.loadContacts(),
      error: (err) => this.handleError(err),
    });
  }

  editCompany(company: Company): void {
    this.editingId.set(company.id);
    this.modalError.set(false);
    this.companyForm.setValue({
      name: company.name,
      website: company.website ?? '',
      notes: company.notes ?? '',
    });
    this.modalEntity.set('company');
  }

  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const raw = this.companyForm.getRawValue();
    const input: AdminCompanyInput = {
      name: raw.name.trim(),
      website: raw.website.trim() || undefined,
      notes: raw.notes.trim() || undefined,
    };
    const id = this.editingId();
    this.persist(
      id ? this.adminService.updateCompany(id, input) : this.adminService.createCompany(input),
      () => this.loadCompanies(),
    );
  }

  deleteCompany(id: string): void {
    if (!this.confirmDelete()) return;
    this.adminService.deleteCompany(id).subscribe({
      next: () => this.loadCompanies(),
      error: (err) => this.handleError(err),
    });
  }

  private confirmDelete(): boolean {
    return window.confirm(this.t()?.deleteConfirm ?? '¿Eliminar este registro?');
  }

  private persist(obs: Observable<unknown>, reload: () => void): void {
    this.modalSubmitting.set(true);
    this.modalError.set(false);
    obs.subscribe({
      next: () => {
        this.modalSubmitting.set(false);
        this.closeModal();
        reload();
      },
      error: () => {
        this.modalSubmitting.set(false);
        this.modalError.set(true);
      },
    });
  }

  private num(value: string): number | undefined {
    const v = `${value ?? ''}`.replace(/[^\d.]/g, '');
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

  async onImportCsv(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.importResult.set(null);
    let text: string;
    try {
      text = await file.text();
    } catch {
      return;
    }
    const inputs = parseCandidatesCsv(text);
    if (inputs.length === 0) {
      this.importResult.set(
        this.lang() === 'es'
          ? 'No se encontraron filas válidas. Cada fila necesita Nombre y Email.'
          : 'No valid rows found. Each row needs Name and Email.',
      );
      return;
    }
    this.importing.set(true);
    this.importTotal.set(inputs.length);
    this.importProgress.set(0);
    let ok = 0;
    let fail = 0;
    for (const candidate of inputs) {
      try {
        await firstValueFrom(this.adminService.createCandidate(candidate));
        ok++;
      } catch {
        fail++;
      }
      this.importProgress.set(ok + fail);
    }
    this.importing.set(false);
    this.loadCandidates();
    this.importResult.set(
      this.lang() === 'es'
        ? `${ok} candidato(s) importado(s)${fail ? `, ${fail} con error` : ''}.`
        : `${ok} candidate(s) imported${fail ? `, ${fail} failed` : ''}.`,
    );
  }

  private splitPhone(phone: string | null | undefined): { code: string; number: string } {
    if (!phone) return { code: '+52', number: '' };
    const match = phone.match(/^(\+\d+)\s*(.*)$/);
    if (match && this.phoneCodes.some((p) => p.code === match[1])) {
      return { code: match[1], number: match[2] };
    }
    return { code: '+52', number: phone };
  }

  private splitLocation(loc: string | null | undefined): { country: string; city: string } {
    if (!loc) return { country: '', city: '' };
    const countries = this.formsCopy()?.country?.options ?? [];
    const idx = loc.lastIndexOf(', ');
    if (idx > -1) {
      return { city: loc.slice(0, idx).trim(), country: loc.slice(idx + 2).trim() };
    }
    return countries.includes(loc) ? { country: loc, city: '' } : { country: '', city: loc };
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  private match(query: string, fields: (string | null | undefined)[]): boolean {
    return fields.some((value) => (value ?? '').toLowerCase().includes(query));
  }

  reload(): void {
    const tab = this.activeTab();
    if (tab === 'leads') this.loadLeads();
    else if (tab === 'candidates') this.loadCandidates();
    else if (tab === 'contacts') this.loadContacts();
    else if (tab === 'companies') this.loadCompanies();
  }

  isTabLoading(): boolean {
    const tab = this.activeTab();
    if (tab === 'account') return false;
    if (tab === 'overview') return !this.allLoaded() && !this.loadError();
    return !this.loaded()[tab] && !this.loadError();
  }

  loadLeads(): void {
    this.loadError.set(false);
    this.adminService.getTalentLeads().subscribe({
      next: (data) => {
        this.leads.set(data);
        this.markLoaded('leads');
      },
      error: (err) => this.handleError(err),
    });
  }

  loadCandidates(): void {
    this.adminService.getCandidateApplications().subscribe({
      next: (data) => {
        this.candidates.set(data);
        this.markLoaded('candidates');
      },
      error: (err) => this.handleError(err),
    });
  }

  loadContacts(): void {
    this.adminService.getContactRequests().subscribe({
      next: (data) => {
        this.contacts.set(data);
        this.markLoaded('contacts');
      },
      error: (err) => this.handleError(err),
    });
  }

  loadCompanies(): void {
    this.adminService.getCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.markLoaded('companies');
      },
      error: (err) => this.handleError(err),
    });
  }

  changePassword(): void {
    if (this.pwForm.invalid) {
      this.pwForm.markAllAsTouched();
      return;
    }
    this.pwSubmitting.set(true);
    this.pwError.set(null);
    this.pwSuccess.set(false);
    const { currentPassword, newPassword } = this.pwForm.getRawValue();
    this.adminService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.pwSubmitting.set(false);
        this.pwSuccess.set(true);
        this.pwForm.reset();
      },
      error: (err: unknown) => {
        this.pwSubmitting.set(false);
        const msg = String((err as { message?: string })?.message ?? '');
        const copy = this.t();
        this.pwError.set(
          msg.includes('actual')
            ? (copy?.errorCurrent ?? '')
            : (copy?.errorGeneric ?? ''),
        );
      },
    });
  }

  sendResetLink(): void {
    const email = this.email();
    if (!email) return;
    this.resetSending.set(true);
    this.resetSent.set(false);
    this.adminService.requestPasswordReset(email).subscribe({
      next: () => {
        this.resetSending.set(false);
        this.resetSent.set(true);
      },
      error: () => {
        this.resetSending.set(false);
        this.resetSent.set(true);
      },
    });
  }

  logout(): void {
    this.adminService.logout();
    void this.router.navigateByUrl('/');
  }

  initials(): string {
    return this.adminName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    );
  }

  private markLoaded(key: DataTab): void {
    this.loaded.update((state) => ({ ...state, [key]: true }));
  }

  private handleError(err: unknown): void {
    const msg = String((err as { message?: string })?.message ?? '');
    if (msg.includes('Unauthorized') || msg.includes('UNAUTHENTICATED')) {
      this.logout();
      return;
    }
    this.loadError.set(true);
  }
}
