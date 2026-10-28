import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card toast-{{ toast.type }} animate-fade">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <span class="material-symbols-outlined">check_circle</span>
              }
              @case ('danger') {
                <span class="material-symbols-outlined">error</span>
              }
              @case ('warning') {
                <span class="material-symbols-outlined">warning</span>
              }
              @default {
                <span class="material-symbols-outlined">info</span>
              }
            }
          </div>
          <span class="toast-text">{{ toast.message }}</span>
          <button class="toast-dismiss" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss toast">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-radius: var(--radius-button);
      background: #FFFFFF;
      color: var(--color-text-primary);
      box-shadow: var(--shadow-dropdown);
      border: 1px solid var(--color-border);
      border-left: 5px solid var(--color-primary);
    }

    .toast-success {
      border-left-color: var(--color-success);
      .toast-icon { color: var(--color-success); }
    }

    .toast-danger {
      border-left-color: #FF3B30;
      .toast-icon { color: #FF3B30; }
    }

    .toast-warning {
      border-left-color: #FF9500;
      .toast-icon { color: #FF9500; }
    }

    .toast-info {
      border-left-color: var(--color-primary);
      .toast-icon { color: var(--color-primary); }
    }

    .toast-text {
      font-size: 13.5px;
      font-weight: 600;
      flex: 1;
    }

    .toast-dismiss {
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border-radius: 4px;
    }

    .toast-dismiss:hover {
      color: var(--color-text-primary);
    }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
