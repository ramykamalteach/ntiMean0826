import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-item-card',
  styleUrl: './item-card.css',
  templateUrl: './item-card.html',
})
export class ItemCard {
  @Input() itemName!: string;
  @Input() itemPrice!: number;
}
