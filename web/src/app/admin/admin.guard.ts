import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

export const adminGuard: CanActivateFn = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  return adminService.isAuthenticated() ? true : router.createUrlTree(['/admin/login']);
};
