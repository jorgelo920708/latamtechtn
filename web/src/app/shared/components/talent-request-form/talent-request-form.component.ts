import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatamCopyService } from '../../services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../models/copy/latam-copy.model';
import { FormsCopy } from '../../models/copy/landing.model';
import { TalentService } from '../../services/talent.service';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-talent-request-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalShellComponent, IconComponent],
  templateUrl: './talent-request-form.component.html',
  styleUrl: './talent-request-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentRequestFormComponent {
  @Output() dismiss = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private talentService = inject(TalentService);
  private copyService = inject(LatamCopyService);

  forms$: Observable<FormsCopy> = this.copyService
    .getObservableSlice<LatamCopyModel>(LATAM_COPY_ID)
    .pipe(map((copy) => copy?.landing?.forms));

  readonly lang = this.copyService.currentLang;

  submitting = signal(false);
  success = signal(false);
  errored = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    specialty: ['', Validators.required],
    message: [''],
    acceptTerms: [false, Validators.requiredTrue],
  });

  invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  hasEmailError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError('email') && !control.hasError('required');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errored.set(false);
    const raw = this.form.getRawValue();
    this.talentService
      .createTalentLead({
        name: raw.name,
        company: raw.company,
        email: raw.email,
        role: raw.role,
        specialty: raw.specialty,
        message: raw.message,
      })
      .subscribe({
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
    this.success.set(false);
    this.errored.set(false);
  }
}
