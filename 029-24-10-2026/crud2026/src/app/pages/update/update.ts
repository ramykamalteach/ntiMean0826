import { ProductService } from "./../../services/product-service";
import { Product } from "./../../interfaces/product";
import { Component, OnInit, signal } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-update",
  imports: [CommonModule, FormsModule],
  templateUrl: "./update.html",
  styleUrl: "./update.css",
})
export class Update implements OnInit {
  isLoading = signal(false);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  product = signal<Product>({
    _id: "",
    productName: "",
    weight: 0,
    photo: "",
    __v: 0,
    userId: "68c2c64c2ef72cf059cc8b5e",
  });

  productId: string = "";

  constructor(
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get("id") || "";

    if (this.productId) {
      this.loadProduct();
    } else {
      this.router.navigate(["/"]);
    }
  }

  loadProduct() {
    this.isLoading.set(true);

    this.productService.getProduct(this.productId).subscribe({
      next: (data: any) => {
        const product = Array.isArray(data) ? data[0] : data;

        if (product) {
          this.product.set({
            _id: product._id || "",
            productName: product.productName || "",
            weight: product.weight || 0,
            photo: product.photo || "",
            __v: product.__v || 0,
            userId: product.userId || "68c2c64c2ef72cf059cc8b5e",
          });

          const photo = this.product().photo;
          if (photo) {
            this.previewUrl.set(
              photo.startsWith("http")
                ? photo
                : `http://localhost:3001/img/uploades/${photo}`
            );
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(["/"]);
      },
    });
  }

  update() {
    const current = this.product();
    if (!current._id) return;

    const formData = new FormData();
    formData.append("id", current._id);
    formData.append("productName", current.productName);
    formData.append("weight", current.weight.toString());
    formData.append("userId", current.userId);

    const file = this.selectedFile();
    if (file) {
      formData.append("photo", file);
    }

    this.productService.updateProduct(formData).subscribe({
      next: () => this.router.navigate(["/"]),
      error: (error) => console.error("Update failed", error),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // free the previous blob URL to avoid a memory leak
      const old = this.previewUrl();
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);

      this.selectedFile.set(file);
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  goBack() {
    history.back();
  }
}