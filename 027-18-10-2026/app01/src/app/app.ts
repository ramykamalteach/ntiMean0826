import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ItemCard } from './components/item-card/item-card';
import { Cart } from './components/cart/cart';

@Component({
  imports: [RouterOutlet, FormsModule, Header, Footer, ItemCard, Cart],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = "My first app";
  userName = "Waled Gamal";

  /* dItemName = "iphone 18";
  dItemPrice = 3333; */

  items = [
    {
      itemName: "iphone 18",
      itemPrice: 3333
    },
    {
      itemName: "iphone 22",
      itemPrice: 10000
    },
    {
      itemName: "iphone 11",
      itemPrice: 222
    },
    {
      itemName: "iphone 21",
      itemPrice: 331
    },
    {
      itemName: "iphone 14",
      itemPrice: 444
    }
  ]

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.userName = inputElement.value;
  }


  childMessage = '';

  receiveMessage(msg: string) {
    this.childMessage = msg;
  }

}
