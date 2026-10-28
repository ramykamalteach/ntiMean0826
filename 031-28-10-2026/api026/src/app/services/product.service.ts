import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../interfaces/product";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = "/api/v1.0/products";

  getMeals(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
