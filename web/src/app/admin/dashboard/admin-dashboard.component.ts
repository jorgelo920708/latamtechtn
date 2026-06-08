import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminService,
  CandidateApplication,
  ContactRequest,
  TalentLead,
} from '../admin.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

type Tab = 'leads' | 'candidates' | 'contacts' | 'account';
type DataTab = 'leads' | 'candidates' | 'contacts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly email = this.adminService.email;

  readonly titles: Record<Tab, string> = {
    leads: 'Solicitudes de talento',
    candidates: 'Candidatos',
    contacts: 'Contactos',
    account: 'Mi cuenta',
  };

  activeTab = signal<Tab>('leads');
  loadError = signal(false);

  leads = signal<TalentLead[]>([]);
  candidates = signal<CandidateApplication[]>([]);
  contacts = signal<ContactRequest[]>([]);
  loaded = signal({ leads: false, candidates: false, contacts: false });

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
        c.specialty,
        c.englishLevel,
        c.mainStack,
        c.message,
      ]),
    );
  });

  filteredContacts = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.contacts();
    return this.contacts().filter((c) => this.match(q, [c.name, c.email, c.message]));
  });

  pwSubmitting = signal(false);
  pwSuccess = signal(false);
  pwError = signal<string | null>(null);

  pwForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.loadLeads();
    this.loadCandidates();
    this.loadContacts();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.search.set('');
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
  }

  isTabLoading(): boolean {
    const tab = this.activeTab();
    if (tab === 'account') return false;
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
        this.pwError.set(
          msg.includes('actual')
            ? 'La contraseña actual es incorrecta.'
            : 'No se pudo cambiar la contraseña.',
        );
      },
    });
  }

  logout(): void {
    this.adminService.logout();
    void this.router.navigateByUrl('/admin/login');
  }

  initials(): string {
    const mail = this.email() ?? '';
    return mail.slice(0, 2).toUpperCase() || 'AD';
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
