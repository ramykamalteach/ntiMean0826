import { afterNextRender, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('temp2026Dashboard');
  protected readonly spinnerVisible = signal(true);
  protected readonly userMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => this.spinnerVisible.set(false));
  }

  protected toggleUserMenu(event: MouseEvent): void {
    event.preventDefault();
    this.userMenuOpen.update((isOpen) => !isOpen);
  }
}
