import { Routes, Router } from '@angular/router';
import { LoginComponent } from './components/login.component.ts';
import { DashboardComponent } from './components/dashboard.component.ts';
import { FeedbackListComponent } from './components/feedback-list.component.ts';
import { SettingsComponent } from './components/settings.component.ts';
import { inject } from '@angular/core';
import { StoreService } from './services/store.service.ts';

const authGuard = () => {
  const store = inject(StoreService);
  const router = inject(Router);
  if (store.currentUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'feedback', component: FeedbackListComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  }
];