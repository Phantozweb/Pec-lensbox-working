import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService, FeedbackItem } from '../services/store.service.ts';
import { GeminiService } from '../services/gemini.service.ts';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-[98%] mx-auto h-full flex flex-col">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Feedback Calls</h2>
          <p class="text-slate-500 text-sm">Manage customer feedback and approvals</p>
        </div>
        
        <!-- Search and Filters -->
        <div class="flex gap-2 w-full md:w-auto">
           <input 
            type="text" 
            placeholder="Search customer..." 
            class="flex-1 md:w-64 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            (input)="searchTerm.set($any($event.target).value)"
           >
           <button class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200" (click)="openAddModal()">
             + Add
           </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th class="px-6 py-4 w-12">#</th>
                <th class="px-6 py-4 w-32">Date</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4 w-32">Phone</th>
                <th class="px-6 py-4 w-32">Caller</th>
                <th class="px-6 py-4 min-w-[250px]">Feedback</th>
                <th class="px-6 py-4 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (item of filteredList(); track item.id; let i = $index) {
                <tr class="hover:bg-emerald-50/30 transition-colors group">
                  <td class="px-6 py-4 text-xs text-slate-400">{{ i + 1 }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ item.dateOfDelivery }}</td>
                  <td class="px-6 py-4 font-semibold text-slate-800">{{ item.customerName }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-500">{{ item.phone }}</span>
                      <!-- WhatsApp Button -->
                      <button (click)="prepareWhatsapp(item)" class="text-emerald-500 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-emerald-100 rounded" title="Send WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    @if (editingId() === item.id) {
                      <select class="w-full p-1.5 border border-emerald-200 rounded text-sm bg-white focus:ring-1 focus:ring-emerald-500" [(ngModel)]="tempCallBy">
                        <option value="">Select Staff</option>
                        @for(staff of store.settings().staffNames; track staff) {
                          <option [value]="staff">{{ staff }}</option>
                        }
                      </select>
                    } @else {
                      <span [class.text-slate-300]="!item.callDoneBy" [class.text-slate-600]="item.callDoneBy">{{ item.callDoneBy || '—' }}</span>
                    }
                  </td>
                  <td class="px-6 py-4">
                     @if (editingId() === item.id) {
                      <textarea rows="2" class="w-full p-2 border border-emerald-200 rounded text-sm mb-1 focus:ring-1 focus:ring-emerald-500" [(ngModel)]="tempComments" placeholder="Enter feedback..."></textarea>
                    } @else {
                      <div class="flex items-start justify-between gap-2">
                         <span class="truncate block max-w-[200px]" [title]="item.comments">{{ item.comments || '—' }}</span>
                         @if (item.comments) {
                            <button (click)="analyze(item.comments)" class="text-[10px] text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 transition-colors flex items-center gap-1">
                              ✨ AI
                            </button>
                         }
                      </div>
                    }
                  </td>
                  <td class="px-6 py-4 text-center">
                    @if (editingId() === item.id) {
                      <div class="flex justify-center gap-2">
                        <button (click)="saveEdit(item.id)" class="text-emerald-600 hover:text-emerald-700 bg-emerald-50 p-1 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                        <button (click)="cancelEdit()" class="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    } @else {
                      @if (item.status === 'Pending') {
                        <button (click)="startEdit(item)" class="text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 bg-emerald-50 px-3 py-1 rounded-full shadow-sm">
                          Call Now
                        </button>
                      } @else if (item.status === 'Called') {
                        @if (store.isAdmin()) {
                          <button (click)="approve(item.id)" class="text-teal-600 hover:text-teal-800 font-medium text-xs border border-teal-200 bg-teal-50 px-3 py-1 rounded-full shadow-sm">
                            Approve
                          </button>
                        } @else {
                           <div class="flex flex-col items-center">
                             <span class="text-[10px] text-orange-500 font-bold uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded">Wait Approval</span>
                             <button (click)="startEdit(item)" class="text-[10px] text-slate-400 hover:text-slate-600 mt-1 underline">Edit Details</button>
                           </div>
                        }
                      } @else {
                        <span class="text-xs text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-full flex items-center justify-center gap-1 border border-teal-100">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          Done
                        </span>
                      }
                    }
                  </td>
                </tr>
              } @empty {
                 <tr>
                  <td colspan="7" class="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    No feedback records found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- WhatsApp Modal -->
    @if (showWaModal()) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/20">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span class="text-green-500 text-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>
               </span>
               Send WhatsApp
            </h3>
            <button (click)="showWaModal.set(false)" class="text-slate-400 hover:text-slate-600">&times;</button>
          </div>

          <p class="text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded border border-slate-100">
            To: <span class="font-semibold text-slate-700">{{ selectedItem()?.customerName }}</span> 
            <span class="text-xs ml-1">({{ selectedItem()?.phone }})</span>
          </p>
          
          <div class="mb-4">
             <label class="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Message Content</label>
             <textarea 
               [(ngModel)]="waMessage" 
               class="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-slate-50 focus:bg-white transition-colors"
             ></textarea>
             <div class="flex gap-2 mt-2">
                <button (click)="generateAiMessage()" [disabled]="loadingAi()" class="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1 font-medium">
                   @if(loadingAi()){ 
                     <span class="animate-spin h-3 w-3 border-2 border-purple-700 border-t-transparent rounded-full"></span> 
                   } @else { 
                     ✨ AI Rewrite 
                   }
                </button>
                <button (click)="resetTemplate()" class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                   Reset Template
                </button>
             </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button (click)="showWaModal.set(false)" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button (click)="sendWhatsapp()" class="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md flex items-center gap-2 font-medium">
              <span>Open WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- AI Analysis Modal -->
     @if (showAnalysisModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
           <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
           <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
             <span class="text-xl">✨</span> AI Insight
           </h3>
           <div class="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed mb-6 shadow-inner">
             {{ analysisText() }}
           </div>
           <div class="flex justify-end">
             <button (click)="showAnalysisModal.set(false)" class="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Dismiss</button>
           </div>
        </div>
      </div>
    }
  `
})
export class FeedbackListComponent {
  store = inject(StoreService);
  gemini = inject(GeminiService);

  // Search/Filter State
  searchTerm = signal('');
  
  // Editing State
  editingId = signal<number | null>(null);
  tempCallBy = '';
  tempComments = '';

  // WhatsApp State
  showWaModal = signal(false);
  selectedItem = signal<FeedbackItem | null>(null);
  waMessage = '';
  loadingAi = signal(false);

  // Analysis State
  showAnalysisModal = signal(false);
  analysisText = signal('');

  // Derived filtered list
  filteredList =  this.store.feedbackList; 

  startEdit(item: FeedbackItem) {
    this.editingId.set(item.id);
    this.tempCallBy = item.callDoneBy || this.store.currentUser()?.name || '';
    this.tempComments = item.comments;
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit(id: number) {
    this.store.updateFeedback(id, {
      callDoneBy: this.tempCallBy,
      comments: this.tempComments,
      status: 'Called'
    });
    this.editingId.set(null);
  }

  approve(id: number) {
    this.store.updateFeedback(id, {
      status: 'Approved',
      isApproved: true
    });
  }

  // --- WhatsApp Logic ---
  prepareWhatsapp(item: FeedbackItem) {
    this.selectedItem.set(item);
    this.resetTemplate();
    this.showWaModal.set(true);
  }

  resetTemplate() {
    const item = this.selectedItem();
    if (!item) return;
    let tpl = this.store.settings().whatsappTemplate;
    tpl = tpl.replace('{name}', item.customerName);
    this.waMessage = tpl;
  }

  async generateAiMessage() {
    const item = this.selectedItem();
    if (!item) return;
    this.loadingAi.set(true);
    const issue = item.comments || 'general feedback follow up';
    const msg = await this.gemini.generateWhatsappMessage(item.customerName, issue);
    this.waMessage = msg;
    this.loadingAi.set(false);
  }

  sendWhatsapp() {
    const phone = this.selectedItem()?.phone;
    if (phone) {
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(this.waMessage)}`;
      window.open(url, '_blank');
      this.showWaModal.set(false);
    }
  }

  // --- Analysis Logic ---
  async analyze(comments: string) {
    this.analysisText.set('Analyzing...');
    this.showAnalysisModal.set(true);
    const result = await this.gemini.getHelpfulAnalysis(comments);
    this.analysisText.set(result);
  }

  openAddModal() {
    const name = prompt('Customer Name:');
    if(name) {
       this.store.addFeedback({
         dateOfDelivery: new Date().toISOString().split('T')[0],
         customerName: name,
         phone: '9999999999',
         callDoneBy: '',
         comments: '',
         status: 'Pending',
         isApproved: false
       });
    }
  }
}