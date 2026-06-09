import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { LatamCopyService } from '../../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../shared/models/copy/latam-copy.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-forgot',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './admin-forgot.component.html',
  styleUrl: './admin-forgot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminForgotComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private copy = inject(LatamCopyService);

  readonly t = toSignal(
    this.copy.getObservableSlice<LatamCopyModel>(LATAM_COPY_ID).pipe(map((c) => c?.admin)),
  );
  readonly lang = this.copy.currentLang;

  submitting = signal(false);
  sent = signal(false);

  toggleLang(): void {
    void this.copy.toggle();
  }

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.adminService.requestPasswordReset(this.form.getRawValue().email).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
    });
  }
}
