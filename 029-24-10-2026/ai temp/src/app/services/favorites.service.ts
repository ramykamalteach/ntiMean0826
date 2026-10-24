import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'marketnest_favorites';

  readonly favoriteIds = signal<string[]>(this.loadFavorites());
  readonly isFavoritesDrawerOpen = signal<boolean>(false);

  readonly count = computed(() => this.favoriteIds().length);

  toggleFavorite(productId: string): boolean {
    let isNowFav = false;
    this.favoriteIds.update(ids => {
      if (ids.includes(productId)) {
        const next = ids.filter(id => id !== productId);
        this.saveFavorites(next);
        isNowFav = false;
        return next;
      } else {
        const next = [...ids, productId];
        this.saveFavorites(next);
        isNowFav = true;
        return next;
      }
    });
    return isNowFav;
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds().includes(productId);
  }

  toggleDrawer() {
    this.isFavoritesDrawerOpen.update(v => !v);
  }

  openDrawer() {
    this.isFavoritesDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isFavoritesDrawerOpen.set(false);
  }

  private loadFavorites(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  }

  private saveFavorites(ids: string[]) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }
}
