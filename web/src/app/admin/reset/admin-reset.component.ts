import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
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

  private readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  hasToken = signal(this.token.length > 0);

  submitting = signal(false);
  done = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.adminService.resetPassword(this.token, this.form.getRawValue().newPassword).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('El enlace es inválido o expiró. Pedí uno nuevo.');
      },
    });
  }
}
