import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminService,
  CandidateApplication,
  ContactRequest,
  TalentLead,
} from '../admin.service';
import { LatamCopyService } from '../../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../shared/models/copy/latam-copy.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

type Tab = 'overview' | 'leads' | 'candidates' | 'contacts' | 'account';
type DataTab = 'leads' | 'candidates' | 'contacts';

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
  imports: [ReactiveFormsModule, IconComponent],
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

  activeTab = signal<Tab>('overview');
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
      default:
        return t.titleAccount;
    }
  }

  kindLabel(kind: string): string {
    const t = this.t();
    if (!t) return '';
    return kind === 'lead' ? t.kindLead : kind === 'candidate' ? t.kindCandidate : t.kindContact;
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

  logout(): void {
    this.adminService.logout();
    void this.router.navigateByUrl('/admin/login');
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
