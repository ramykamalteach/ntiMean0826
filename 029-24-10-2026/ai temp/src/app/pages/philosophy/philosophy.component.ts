import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-philosophy',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './philosophy.component.html',
  styleUrl: './philosophy.component.css'
})
export class PhilosophyComponent {
  testAmount = signal<number>(150);

  // MarketNest 90% direct to artisan
  artisanShare = computed(() => Math.round(this.testAmount() * 0.90));
  guildShare = computed(() => this.testAmount() - this.artisanShare());

  // Traditional retail comparison (artisan gets only ~18%)
  retailArtisanShare = computed(() => Math.round(this.testAmount() * 0.18));
  retailWholesaleShare = computed(() => Math.round(this.testAmount() * 0.40));
  retailOverheadShare = computed(() => this.testAmount() - this.retailArtisanShare() - this.retailWholesaleShare());

  updateAmount(val: number) {
    this.testAmount.set(val);
  }
}
