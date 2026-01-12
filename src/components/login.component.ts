import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service.ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-full w-full flex items-center justify-center p-4 h-full relative overflow-hidden bg-slate-50">
      
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         <!-- Gradient Orbs -->
         <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px] animate-float-slow mix-blend-multiply"></div>
         <div class="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-[120px] animate-float-medium mix-blend-multiply" style="animation-delay: -2s;"></div>
         <div class="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-100/50 rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply"></div>
         
         <!-- Grid Pattern Overlay -->
         <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <!-- Main Card -->
      <div class="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 relative z-10 p-8 sm:p-10 animate-fade-in-up">
        
        <!-- Header Section -->
        <div class="text-center mb-10">
          <div class="relative mx-auto w-20 h-20 mb-6 group cursor-default">
            <!-- Icon Background with Glow -->
            <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 transform rotate-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-105"></div>
            <!-- Icon Container -->
            <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center transform -rotate-3 transition-all duration-500 group-hover:rotate-0 z-10 border border-white/10">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white drop-shadow-md transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight animate-slide-up opacity-0" style="animation-delay: 100ms; animation-fill-mode: forwards;">
            Welcome Back
          </h2>
          <p class="mt-2 text-slate-500 font-medium animate-slide-up opacity-0" style="animation-delay: 200ms; animation-fill-mode: forwards;">
            Enter your credentials to access LensBox
          </p>
        </div>

        <!-- Login Form -->
        <form class="space-y-6" (ngSubmit)="onSubmit()">
          
          <!-- Email Input -->
          <div class="group relative animate-slide-up opacity-0" style="animation-delay: 300ms; animation-fill-mode: forwards;">
            <label for="email" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-emerald-600">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300">
                <svg class="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                [(ngModel)]="email"
                required 
                class="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-[3px] focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white transition-all duration-300 sm:text-sm font-medium shadow-sm" 
                placeholder="name@example.com"
              >
            </div>
          </div>

          <!-- Password Input -->
          <div class="group relative animate-slide-up opacity-0" style="animation-delay: 400ms; animation-fill-mode: forwards;">
            <div class="flex items-center justify-between mb-1.5 ml-1">
               <label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-wider transition-colors group-focus-within:text-emerald-600">Password</label>
            </div>
            <div class="relative">
               <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300">
                <svg class="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                [(ngModel)]="password"
                required 
                class="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-[3px] focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white transition-all duration-300 sm:text-sm font-medium shadow-sm" 
                placeholder="••••••••"
              >
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 animate-slide-up opacity-0" style="animation-delay: 500ms; animation-fill-mode: forwards;">
            <button 
              type="submit" 
              [disabled]="!email || !password"
              class="relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none overflow-hidden group"
            >
              <span class="relative z-10 flex items-center gap-2">
                Sign In Securely
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <!-- Shine Effect -->
              <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(2deg); }
      66% { transform: translateY(10px) rotate(-1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
    .animate-float-slow {
      animation: float 10s ease-in-out infinite;
    }
    .animate-float-medium {
      animation: float 8s ease-in-out infinite reverse;
    }
    .animate-pulse-slow {
      animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slide-up {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class LoginComponent {
  store = inject(StoreService);
  router = inject(Router);
  email = '';
  password = '';

  onSubmit() {
    if (this.email) {
      this.store.login(this.email);
      this.router.navigate(['/dashboard']);
    }
  }
}