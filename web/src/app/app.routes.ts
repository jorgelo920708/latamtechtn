import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminLoginComponent } from './admin/login/admin-login.component';
import { AdminForgotComponent } from './admin/forgot/admin-forgot.component';
import { AdminResetComponent } from './admin/reset/admin-reset.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/forgot', component: AdminForgotComponent },
  { path: 'admin/reset', component: AdminResetComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
