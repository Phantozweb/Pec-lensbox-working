import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service.ts';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-8 border-b border-emerald-100 pb-4">Application Settings</h2>
      
      <!-- Branding -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
           <span class="p-1 bg-emerald-100 rounded text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </span>
           Branding
        </h3>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label class="block text-sm font-medium text-slate-700 mb-2">Logo URL</label>
          <div class="flex gap-4">
            <input 
              type="text" 
              [(ngModel)]="tempSettings.logoUrl" 
              class="flex-1 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
            <div class="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden shadow-sm">
               <img [src]="tempSettings.logoUrl" alt="Prev" class="max-w-full max-h-full">
            </div>
          </div>
        </div>
      </section>

      <!-- Staff Management -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
           <span class="p-1 bg-emerald-100 rounded text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           </span>
           Staff Members
        </h3>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div class="flex gap-2 mb-4">
             <input #staffInput type="text" placeholder="Add new staff name" class="flex-1 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" (keyup.enter)="addStaff(staffInput)">
             <button (click)="addStaff(staffInput)" class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Add Staff</button>
           </div>
           
           <div class="flex flex-wrap gap-2">
             @for(staff of tempSettings.staffNames; track staff) {
               <span class="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-slate-200 shadow-sm group hover:border-emerald-200">
                 {{ staff }}
                 <button (click)="removeStaff(staff)" class="text-slate-400 group-hover:text-red-500 font-bold transition-colors">&times;</button>
               </span>
             }
           </div>
        </div>
      </section>

      <!-- WhatsApp Template -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
           <span class="p-1 bg-emerald-100 rounded text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
           </span>
           WhatsApp Template
        </h3>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-xs text-slate-500 mb-2">Use <code class="bg-slate-100 px-1 rounded text-emerald-600 font-mono">{name}</code> as a placeholder for the customer's name.</p>
          <textarea 
            [(ngModel)]="tempSettings.whatsappTemplate"
            rows="4" 
            class="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          ></textarea>
        </div>
      </section>

      <div class="flex justify-end gap-4">
        <button class="px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5" (click)="save()">
          Save Changes
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  store = inject(StoreService);
  
  // Local clone of settings
  tempSettings = { ...this.store.settings() };

  addStaff(input: HTMLInputElement) {
    const val = input.value.trim();
    if (val && !this.tempSettings.staffNames.includes(val)) {
      this.tempSettings.staffNames = [...this.tempSettings.staffNames, val];
      input.value = '';
    }
  }

  removeStaff(name: string) {
    this.tempSettings.staffNames = this.tempSettings.staffNames.filter(s => s !== name);
  }

  save() {
    this.store.updateSettings(this.tempSettings);
    alert('Settings saved successfully!');
  }
}