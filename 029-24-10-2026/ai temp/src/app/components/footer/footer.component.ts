import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly notificationService = inject(NotificationService);
  newsletterEmail = '';

  onSubscribe() {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      this.notificationService.show('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    this.notificationService.show(
      'Subscribed to MarketNest Dispatch',
      `You will receive our weekly artisan spotlight and studio stories.`,
      'success'
    );
    this.newsletterEmail = '';
  }
}
