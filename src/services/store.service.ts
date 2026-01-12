import { Injectable, signal, computed, effect } from '@angular/core';

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface FeedbackItem {
  id: number;
  dateOfDelivery: string;
  customerName: string;
  phone: string;
  callDoneBy: string;
  comments: string;
  status: 'Pending' | 'Called' | 'Approved';
  isApproved: boolean;
}

export interface AppSettings {
  logoUrl: string;
  staffNames: string[];
  whatsappTemplate: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // State
  currentUser = signal<User | null>(null);
  
  settings = signal<AppSettings>({
    logoUrl: 'https://via.placeholder.com/150x50?text=LensBox',
    staffNames: ['Janarthan', 'Preethika', 'Sarah', 'Mike'],
    whatsappTemplate: 'Hello {name}, this is regarding your lens order from LensBox. How is your experience?'
  });

  feedbackList = signal<FeedbackItem[]>([
    { id: 1, dateOfDelivery: '2023-10-25', customerName: 'Rajesh Kumar', phone: '9876543210', callDoneBy: '', comments: '', status: 'Pending', isApproved: false },
    { id: 2, dateOfDelivery: '2023-10-26', customerName: 'Anita Singh', phone: '9123456789', callDoneBy: 'Janarthan', comments: 'Happy with the fit.', status: 'Called', isApproved: false },
    { id: 3, dateOfDelivery: '2023-10-24', customerName: 'John Doe', phone: '9988776655', callDoneBy: 'Sarah', comments: 'Needs adjustment.', status: 'Called', isApproved: true },
    { id: 4, dateOfDelivery: '2023-10-27', customerName: 'Priya M', phone: '8877665544', callDoneBy: '', comments: '', status: 'Pending', isApproved: false },
    { id: 5, dateOfDelivery: '2023-10-28', customerName: 'Ahmed Khan', phone: '7766554433', callDoneBy: '', comments: '', status: 'Pending', isApproved: false },
  ]);

  // Computed
  stats = computed(() => {
    const list = this.feedbackList();
    const total = list.length;
    const called = list.filter(i => i.status === 'Called' || i.status === 'Approved').length;
    const pending = total - called;
    const approved = list.filter(i => i.isApproved).length;
    return { total, called, pending, approved };
  });

  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    // Load from local storage if needed, skipping for this demo to ensure clean state
  }

  login(email: string) {
    if (email === 'preethikaeyecare@gmail.com') {
      this.currentUser.set({ email, name: 'Dr. Preethika Kunal', role: 'admin' });
    } else if (email === 'eyecarepreethika@gmail.com') {
      this.currentUser.set({ email, name: 'Staff Member', role: 'staff' });
    }
  }

  logout() {
    this.currentUser.set(null);
  }

  updateSettings(newSettings: AppSettings) {
    this.settings.set(newSettings);
  }

  updateFeedback(id: number, updates: Partial<FeedbackItem>) {
    this.feedbackList.update(list => 
      list.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  }

  addFeedback(item: Omit<FeedbackItem, 'id'>) {
    const newId = Math.max(...this.feedbackList().map(i => i.id), 0) + 1;
    this.feedbackList.update(list => [...list, { ...item, id: newId }]);
  }
}