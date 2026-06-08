import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
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

  submitting = signal(false);
  sent = signal(false);

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
