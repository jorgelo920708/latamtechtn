import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatamCopyService } from '../../services/latam-copy.service';
import { GeoService } from '../../services/geo.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../models/copy/latam-copy.model';
import { FormsCopy } from '../../models/copy/landing.model';
import { CandidateApplicationInput, TalentService } from '../../services/talent.service';
import { PHONE_CODES, formatPhoneNumber } from '../../constants/phone-codes';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { IconComponent } from '../icon/icon.component';

const MAX_CV_BYTES = 10 * 1024 * 1024;

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalShellComponent, IconComponent],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateFormComponent {
  @Output() dismiss = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private talentService = inject(TalentService);
  private copyService = inject(LatamCopyService);
  private geo = inject(GeoService);

  readonly lang = this.copyService.currentLang;
  states = signal<string[]>([]);
  cities = signal<string[]>([]);

  forms$: Observable<FormsCopy> = this.copyService
    .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
    .pipe(map((copy) => copy?.landing?.forms));

  submitting = signal(false);
  success = signal(false);
  errored = signal(false);

  otherRoles = signal<string[]>([]);
  mainStack = signal<string[]>([]);

  cvFileName = signal<string | null>(null);
  cvUploading = signal(false);
  cvError = signal(false);

  readonly phoneCodes = PHONE_CODES;

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneCode: ['+52'],
    phone: [''],
    country: ['', Validators.required],
    state: [''],
    city: [''],
    linkedinUrl: ['', Validators.required],
    cvUrl: ['', Validators.required],
    mainRole: ['', Validators.required],
    yearsExperience: ['', Validators.required],
    englishLevel: ['', Validators.required],
    workedInternational: ['', Validators.required],
    willingContractor: [''],
    jobSearchStatus: [''],
    desiredSalary: ['', Validators.required],
    minSalary: [''],
    availability: [''],
    message: [''],
    acceptTerms: [false, Validators.requiredTrue],
  });

  constructor() {
    this.form.get('country')!.valueChanges.subscribe(async (country) => {
      await this.geo.ensureLoaded();
      this.states.set(this.geo.states(country || ''));
      this.cities.set([]);
      this.form.patchValue({ state: '', city: '' }, { emitEvent: false });
    });
    this.form.get('state')!.valueChanges.subscribe(async (state) => {
      await this.geo.ensureLoaded();
      this.cities.set(this.geo.cities(this.form.get('country')!.value || '', state || ''));
    });
    const phoneCtrl = this.form.get('phone')!;
    phoneCtrl.valueChanges.subscribe((v) => {
      const f = formatPhoneNumber(v);
      if (f !== v) phoneCtrl.setValue(f, { emitEvent: false });
    });
  }

  invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  hasEmailError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError('email') && !control.hasError('required');
  }

  isOtherRole(role: string): boolean {
    return this.otherRoles().includes(role);
  }

  toggleOtherRole(role: string): void {
    this.otherRoles.update((list) =>
      list.includes(role) ? list.filter((r) => r !== role) : [...list, role],
    );
  }

  isStack(stack: string): boolean {
    return this.mainStack().includes(stack);
  }

  toggleStack(stack: string): void {
    this.mainStack.update((list) =>
      list.includes(stack) ? list.filter((s) => s !== stack) : [...list, stack],
    );
  }

  async onCvSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.cvError.set(false);
    if (file.type !== 'application/pdf' || file.size > MAX_CV_BYTES) {
      this.cvError.set(true);
      input.value = '';
      return;
    }
    this.cvUploading.set(true);
    try {
      const url = await this.talentService.uploadCv(file);
      this.form.controls.cvUrl.setValue(url);
      this.cvFileName.set(file.name);
    } catch {
      this.cvError.set(true);
      this.form.controls.cvUrl.setValue('');
      this.cvFileName.set(null);
    } finally {
      this.cvUploading.set(false);
      input.value = '';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errored.set(false);
    const raw = this.form.getRawValue();
    const location =
      [raw.city.trim(), raw.state.trim(), raw.country].filter(Boolean).join(', ') || raw.country;
    const input: CandidateApplicationInput = {
      fullName: raw.fullName.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim() ? `${raw.phoneCode} ${raw.phone.trim()}` : undefined,
      location,
      city: raw.city.trim() || undefined,
      linkedinUrl: raw.linkedinUrl.trim(),
      cvUrl: raw.cvUrl,
      mainRole: raw.mainRole,
      otherRoles: this.otherRoles().join(', ') || undefined,
      mainStack: this.mainStack().join(', ') || undefined,
      yearsExperience: raw.yearsExperience,
      englishLevel: raw.englishLevel,
      workedInternational: raw.workedInternational === 'true',
      willingContractor:
        raw.willingContractor === 'true'
          ? true
          : raw.willingContractor === 'false'
            ? false
            : undefined,
      jobSearchStatus: raw.jobSearchStatus || undefined,
      desiredSalary: Number(raw.desiredSalary) || 0,
      minSalary: `${raw.minSalary ?? ''}`.trim() ? Number(raw.minSalary) : undefined,
      availability: raw.availability || undefined,
      message: raw.message.trim() || undefined,
    };
    this.talentService.createCandidateApplication(input).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.errored.set(true);
      },
    });
  }

  sendAnother(): void {
    this.form.reset();
    this.otherRoles.set([]);
    this.mainStack.set([]);
    this.cvFileName.set(null);
    this.cvError.set(false);
    this.success.set(false);
    this.errored.set(false);
  }
}
