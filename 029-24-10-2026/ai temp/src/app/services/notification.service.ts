import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', durationMs: number = 4000) {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type };

    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  dismiss(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
