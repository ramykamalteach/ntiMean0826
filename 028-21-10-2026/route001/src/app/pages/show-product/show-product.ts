import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.html',
  styleUrl: './show-product.css'
})
export class ShowProduct {
  private route = inject(ActivatedRoute);
  productId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
}