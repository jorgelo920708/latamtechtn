import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatamCopyService } from '../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../shared/models/copy/latam-copy.model';
import { LandingCopy, MetricCopy } from '../shared/models/copy/landing.model';
import { PublicStats, StatsService } from '../shared/services/stats.service';
import { AssetUrl, TALENT_AVATARS } from '../shared/enums/asset-url.enum';
import { CONTACT, isPlaceholderLink } from '../shared/constants/contact.constants';
import { IconComponent } from '../shared/components/icon/icon.component';
import { TalentRequestFormComponent } from '../shared/components/talent-request-form/talent-request-form.component';
import { CandidateFormComponent } from '../shared/components/candidate-form/candidate-form.component';

type ModalKind = 'company' | 'candidate' | null;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    IconComponent,
    TalentRequestFormComponent,
    CandidateFormComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  private copyService = inject(LatamCopyService);
  private statsService = inject(StatsService);

  readonly CONTACT = CONTACT;
  readonly AssetUrl = AssetUrl;

  copy$: Observable<LandingCopy> = this.copyService
    .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
    .pipe(map((copy) => copy?.landing));

  activeFilter = signal('software');
  modal = signal<ModalKind>(null);
  mobileNavOpen = signal(false);
  stats = signal<PublicStats | null>(null);

  ngOnInit(): void {
    this.statsService.getPublicStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => undefined,
    });
  }

  metricValue(metric: MetricCopy): string {
    const stats = this.stats();
    if (stats) {
      if (metric.icon === 'users') return `${stats.candidateCount}`;
      if (metric.icon === 'layers') return `${stats.specialtyCount}`;
    }
    return metric.value;
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
