import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { AddRecipeModalComponent } from './components/add-recipe-modal/add-recipe-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent, AddRecipeModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly showAddModal = signal(false);

  openModal(): void {
    this.showAddModal.set(true);
  }

  closeModal(): void {
    this.showAddModal.set(false);
  }
}
