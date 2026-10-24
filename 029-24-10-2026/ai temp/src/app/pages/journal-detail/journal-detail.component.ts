import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { StoryArticle, Product } from '../../models/marketplace.model';

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './journal-detail.component.html',
  styleUrl: './journal-detail.component.css'
})
export class JournalDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly marketplaceService = inject(MarketplaceService);

  article = signal<StoryArticle | undefined>(undefined);
  featuredProduct = signal<Product | undefined>(undefined);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const art = this.marketplaceService.getArticleById(id);
        this.article.set(art);
        if (art?.featuredProductId) {
          const prod = this.marketplaceService.getProductById(art.featuredProductId);
          this.featuredProduct.set(prod);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
