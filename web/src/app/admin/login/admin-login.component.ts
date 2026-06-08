import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
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

  submitting = signal(false);
  error = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

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
