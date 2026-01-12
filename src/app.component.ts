import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from './services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex flex-col h-screen w-screen bg-slate-50 relative font-sans overflow-hidden">
      @if (store.currentUser()) {
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-emerald-100 z-20 flex-none h-16">
          <div class="container mx-auto px-4 h-full flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Logo Area -->
              <div class="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-emerald-200">
                L
              </div>
              <h1 class="text-xl font-bold text-slate-800 hidden md:block tracking-tight">LensBox <span class="text-emerald-600">Manager</span></h1>
            </div>

            <!-- Nav -->
            <nav class="flex items-center gap-1 md:gap-2 bg-slate-50 p-1 rounded-full border border-slate-100">
              <a routerLink="/dashboard" routerLinkActive="bg-white text-emerald-700 shadow-sm ring-1 ring-black/5" class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:text-emerald-600 transition-all">Dashboard</a>
              <a routerLink="/feedback" routerLinkActive="bg-white text-emerald-700 shadow-sm ring-1 ring-black/5" class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:text-emerald-600 transition-all">Feedback</a>
              @if (store.isAdmin()) {
                <a routerLink="/settings" routerLinkActive="bg-white text-emerald-700 shadow-sm ring-1 ring-black/5" class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:text-emerald-600 transition-all">Settings</a>
              }
            </nav>

            <!-- User Profile -->
            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-slate-800 leading-tight">{{ store.currentUser()?.name }}</p>
                <p class="text-[10px] uppercase tracking-wider font-bold text-emerald-600">{{ store.currentUser()?.role === 'admin' ? 'Administrator' : 'Staff' }}</p>
              </div>
              <button (click)="logout()" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      }

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative z-10 scroll-smooth">
        <router-outlet></router-outlet>
      </main>

      <!-- Watermark Footer (Fixed) -->
      <div class="fixed bottom-2 right-4 pointer-events-none z-50 opacity-40 hover:opacity-100 transition-opacity">
        <p class="text-[10px] text-slate-500 font-medium bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-slate-100 shadow-sm">
          Presented from Focuslinks.in by Janarthan veeramani
        </p>
      </div>
    </div>
  `
})
export class AppComponent {
  store = inject(StoreService);

  logout() {
    this.store.logout();
    window.location.reload(); 
  }
}