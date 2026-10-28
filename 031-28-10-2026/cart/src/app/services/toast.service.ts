import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration: number = 3200): void {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newToast: Toast = { id, message, type, duration };

    this.toasts.update(current => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  dismiss(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
