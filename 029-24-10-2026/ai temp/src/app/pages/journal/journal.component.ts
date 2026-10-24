import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent {
  readonly marketplaceService = inject(MarketplaceService);
  readonly articles = this.marketplaceService.getAllArticles();
}
