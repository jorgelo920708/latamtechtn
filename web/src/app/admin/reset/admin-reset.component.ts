import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { LatamCopyService } from '../../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../shared/models/copy/latam-copy.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-reset',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './admin-reset.component.html',
  styleUrl: './admin-reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminResetComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private copy = inject(LatamCopyService);

  readonly t = toSignal(
    this.copy.getObservableSlice<LatamCopyModel>(LATAM_COPY_ID).pipe(map((c) => c?.admin)),
  );
  readonly lang = this.copy.currentLang;

  private readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  hasToken = signal(this.token.length > 0);

  submitting = signal(false);
  done = signal(false);
  error = signal(false);

  toggleLang(): void {
    void this.copy.toggle();
  }

  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(false);
    this.adminService.resetPassword(this.token, this.form.getRawValue().newPassword).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set(true);
      },
    });
  }
}
