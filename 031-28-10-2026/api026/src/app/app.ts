import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Products } from './components/products/products';

@Component({
  imports: [Products, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('api026');
}
