import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { MakersComponent } from './pages/makers/makers.component';
import { JournalComponent } from './pages/journal/journal.component';
import { JournalDetailComponent } from './pages/journal-detail/journal-detail.component';
import { PhilosophyComponent } from './pages/philosophy/philosophy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MarketNest — Handcrafted Goods & Artisan Marketplace' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'Artisan Story & Craft — MarketNest' },
  { path: 'makers', component: MakersComponent, title: 'Artisans & Independent Studios — MarketNest' },
  { path: 'journal', component: JournalComponent, title: 'The Craft Journal — MarketNest' },
  { path: 'journal/:id', component: JournalDetailComponent, title: 'Craft Essay — MarketNest' },
  { path: 'philosophy', component: PhilosophyComponent, title: 'Our Design & Ethical Creed — MarketNest' },
  { path: '**', redirectTo: '' }
];
