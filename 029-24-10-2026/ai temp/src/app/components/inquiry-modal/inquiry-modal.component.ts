import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '../../services/inquiry.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-inquiry-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inquiry-modal.component.html',
  styleUrl: './inquiry-modal.component.css'
})
export class InquiryModalComponent {
  readonly inquiryService = inject(InquiryService);
  private readonly notificationService = inject(NotificationService);

  senderName = '';
  senderEmail = '';
  inquiryType = 'custom';
  messageText = '';
  subscribeToStudio = true;

  onSubmit() {
    if (!this.senderName || !this.senderEmail || !this.messageText) {
      this.notificationService.show('Incomplete Message', 'Please complete all required fields.', 'warning');
      return;
    }

    const artisanName = this.inquiryService.activeArtisan()?.name || 'the artisan';
    this.notificationService.show(
      'Message Dispatched to Studio',
      `Your message has been sent directly to ${artisanName}. They typically reply within 24–48 hours.`,
      'success',
      5000
    );

    this.inquiryService.closeInquiry();
    this.senderName = '';
    this.senderEmail = '';
    this.messageText = '';
  }
}
