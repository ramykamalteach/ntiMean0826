import { Component, inject, OnInit, signal } from "@angular/core";
import { Product } from "../../interfaces/product";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-products",
  imports: [],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getMeals().subscribe((data) => {
      this.products.set(data);
    });
  }
}
