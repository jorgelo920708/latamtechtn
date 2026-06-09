import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { LatamCopyService } from '../../shared/services/latam-copy.service';
import { LATAM_COPY_ID, LatamCopyModel } from '../../shared/models/copy/latam-copy.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private copy = inject(LatamCopyService);

  readonly t = toSignal(
    this.copy.getObservableSlice<LatamCopyModel>(LATAM_COPY_ID).pipe(map((c) => c?.admin)),
  );
  readonly lang = this.copy.currentLang;

  submitting = signal(false);
  error = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  toggleLang(): void {
    void this.copy.toggle();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(false);
    const { email, password } = this.form.getRawValue();
    this.adminService.login(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.submitting.set(false);
        this.error.set(true);
      },
    });
  }
}
