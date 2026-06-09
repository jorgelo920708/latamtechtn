import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatamCopyService } from '../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../shared/models/copy/latam-copy.model';
import { LandingCopy, MetricCopy, TalentCardCopy } from '../shared/models/copy/landing.model';
import { PublicStats, StatsService } from '../shared/services/stats.service';
import { FeaturedCandidate, TalentService } from '../shared/services/talent.service';
import { AssetUrl, TALENT_AVATARS } from '../shared/enums/asset-url.enum';
import { CONTACT, isPlaceholderLink } from '../shared/constants/contact.constants';
import { IconComponent } from '../shared/components/icon/icon.component';
import { TalentRequestFormComponent } from '../shared/components/talent-request-form/talent-request-form.component';
import { CandidateFormComponent } from '../shared/components/candidate-form/candidate-form.component';
import { CountUpDirective } from '../shared/directives/count-up.directive';

type ModalKind = 'company' | 'candidate' | null;

const ROLE_TO_CATEGORY: Record<string, string> = {
  // software
  'Full Stack': 'software',
  Frontend: 'software',
  Backend: 'software',
  Mobile: 'software',
  'Backend Engineer': 'software',
  'Frontend Engineer': 'software',
  'Full Stack Engineer': 'software',
  'Mobile Developer': 'software',
  'Solutions Architect': 'software',
  'React Developer': 'software',
  'Angular Developer': 'software',
  'Node.js Developer': 'software',
  'Python Developer': 'software',
  '.NET Developer': 'software',
  'Ruby on Rails Developer': 'software',
  // data & AI
  'Data Engineer': 'data',
  'Data Analyst': 'data',
  'Data Scientist': 'data',
  'AI Engineer': 'data',
  'Machine Learning Engineer': 'data',
  'Data Architect': 'data',
  'Power BI Developer': 'data',
  // cloud / devops / infra
  DevOps: 'cloud',
  Cloud: 'cloud',
  Infrastructure: 'cloud',
  Networking: 'cloud',
  'Technical Support': 'cloud',
  'DevOps Engineer': 'cloud',
  'Site Reliability Engineer (SRE)': 'cloud',
  // security
  Cybersecurity: 'security',
  // qa
  'QA Manual': 'qa',
  'QA Automation': 'qa',
  // product & PM
  'Product Manager': 'product',
  'Product Owner': 'product',
  'Project Manager': 'product',
  'Scrum Master': 'product',
  'Business Analyst': 'product',
  'Functional Analyst': 'product',
  'UX/UI Designer': 'product',
  // salesforce
  'Salesforce Developer': 'salesforce',
  'Salesforce Admin': 'salesforce',
  'Salesforce Consultant': 'salesforce',
  // marketing & SEO
  'Digital Marketing': 'marketing',
  SEO: 'marketing',
  'Local SEO': 'marketing',
  'Link Building': 'marketing',
  Content: 'marketing',
  // sales & account management
  SDR: 'sales',
  BDR: 'sales',
  'Account Manager': 'sales',
  'Sales Manager': 'sales',
  'Customer Success Manager': 'sales',
  // finance & admin
  Accounting: 'finance',
  CPA: 'finance',
  'Financial Analyst': 'finance',
  'Finance Manager': 'finance',
  'Finance & Accounting Lead': 'finance',
  'Executive Assistant': 'finance',
  // HR & recruiting
  Recruiter: 'hr',
  'IT Recruiter': 'hr',
  'Talent Acquisition': 'hr',
  HRBP: 'hr',
  'People Partner': 'hr',
};

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    IconComponent,
    TalentRequestFormComponent,
    CandidateFormComponent,
    CountUpDirective,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  private copyService = inject(LatamCopyService);
  private statsService = inject(StatsService);
  private talentService = inject(TalentService);

  readonly CONTACT = CONTACT;
  readonly AssetUrl = AssetUrl;
  readonly lang = this.copyService.currentLang;

  toggleLang(): void {
    void this.copyService.toggle();
  }

  copy$: Observable<LandingCopy> = this.copyService
    .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
    .pipe(map((copy) => copy?.landing));

  activeFilter = signal('software');
  modal = signal<ModalKind>(null);
  mobileNavOpen = signal(false);
  stats = signal<PublicStats | null>(null);
  statsError = signal(false);
  featured = signal<FeaturedCandidate[]>([]);

  ngOnInit(): void {
    this.statsService.getPublicStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.statsError.set(true),
    });
    this.talentService.getFeaturedCandidates().subscribe({
      next: (list) => this.featured.set(list),
      error: () => undefined,
    });
    // Real-time: update the counters live when the server pushes changes.
    this.statsService.statsChanged().subscribe({
      next: (snap) => {
        if (snap) {
          this.stats.set({
            candidateCount: snap.candidateCount,
            specialtyCount: snap.specialtyCount,
          });
        }
      },
      error: () => undefined,
    });
  }

  talentCards(copy: LandingCopy, key: string): TalentCardCopy[] {
    const real = this.featured().filter((c) => ROLE_TO_CATEGORY[c.mainRole] === key);
    if (real.length === 0) {
      return (copy.talent.categories[key] ?? []).slice(0, 5);
    }
    const action = copy.talent.categories[key]?.[0]?.action ?? '';
    return real.slice(0, 5).map((candidate, index) => ({
      code: `Candidato #${String(index + 1).padStart(2, '0')}`,
      topRank: false,
      topRankLabel: '',
      role: candidate.mainRole,
      location: candidate.location,
      english: candidate.englishLevel,
      stack: this.splitStack(candidate.mainStack),
      action,
    }));
  }

  private splitStack(stack?: string | null): string[] {
    if (!stack) {
      return [];
    }
    return stack
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  metricValue(metric: MetricCopy): string {
    const isDynamic = metric.icon === 'users' || metric.icon === 'layers';
    if (!isDynamic) return metric.value;
    const stats = this.stats();
    // While stats load, show a neutral placeholder instead of flashing the
    // static "500+" fallback and then snapping to the real number. Only fall
    // back to the copy value if the request actually failed.
    if (!stats) return this.statsError() ? metric.value : '…';
    const plus = metric.value.trim().endsWith('+') ? '+' : '';
    const count = metric.icon === 'users' ? stats.candidateCount : stats.specialtyCount;
    return `${count}${plus}`;
  }

  isDynamicMetric(metric: MetricCopy): boolean {
    return metric.icon === 'users' || metric.icon === 'layers';
  }

  metricCount(metric: MetricCopy): number {
    const stats = this.stats();
    if (!stats) return 0;
    return metric.icon === 'users' ? stats.candidateCount : stats.specialtyCount;
  }

  metricPlus(metric: MetricCopy): string {
    return metric.value.trim().endsWith('+') ? '+' : '';
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
  }

  openCompany(): void {
    this.mobileNavOpen.set(false);
    this.modal.set('company');
  }

  openCandidate(): void {
    this.mobileNavOpen.set(false);
    this.modal.set('candidate');
  }

  closeModal(): void {
    this.modal.set(null);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  avatarFor(code: string): string {
    const match = code.match(/(\d+)/);
    const index = match ? parseInt(match[1], 10) - 1 : 0;
    return TALENT_AVATARS[index % TALENT_AVATARS.length];
  }

  onPhotoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src.endsWith(AssetUrl.ELBA_PHOTO_PLACEHOLDER)) {
      return;
    }
    img.src = AssetUrl.ELBA_PHOTO_PLACEHOLDER;
  }

  externalLink(url: string): string | null {
    return isPlaceholderLink(url) ? null : url;
  }
}
