import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminLoginComponent } from './admin/login/admin-login.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
