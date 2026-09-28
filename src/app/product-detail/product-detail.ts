import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../services/product';
import { Config } from '../services/config';
import { AuthService } from '../services/auth-service';
import { AddressService } from '../services/address-service';
import { Order } from '../services/order';
import { Payment } from '../services/payment';
import {
  AlertService, Button, Card, Modal, Select, Spinner
} from '@ziadshalaby/ngx-zs-component';
import { Review } from '../services/review';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, Button, Card, Modal, Select, Spinner],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private productService = inject(Product);
  private config = inject(Config);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private orderService = inject(Order);
  private paymentService = inject(Payment);
  private alertService = inject(AlertService);

  // --- state ---
  product = signal<any>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  quantity = signal<number>(1);
  buyLoading = signal<boolean>(false);

  addressModalOpen = signal<boolean>(false);
  selectedAddressId = signal<number | null>(null);

  maxQty = 15;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProduct(+id);
  }

  incrementQty() {
    const p = this.product();
    if (!p) return;
    const max = Math.min(p.stock, this.maxQty);
    if (this.quantity() < max) this.quantity.update(q => q + 1);
  }

  decrementQty() {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  
  // ---------- Buy Now flow ----------
  buyNow() {
    if (!this.authService.isLoggedin()) {
      this.router.navigate(['/login']);
      return;
    }

    const p = this.product();
    if (!p || p.stock <= 0) return;

    this.buyLoading.set(true);

    this.orderService.buyNow({
      product_id: p.id,
      quantity: this.quantity(),
      shipping_address_id: 0,
      payment_method: 'EPAY',
    }).subscribe({
      next: (order: any) => {
        this.paymentService.createPayment(order.id).subscribe({
          next: (payRes: any) => {
            this.buyLoading.set(false);
            if (payRes?.payment_url) {
              window.location.href = payRes.payment_url;
            } else {
              this.alertService.addAlert({
                message: payRes?.message || 'Order created.',
                type: 'success'
              });
              this.router.navigate(['/orders']);
            }
          },
          error: (err: any) => {
            this.buyLoading.set(false);
            this.alertService.addAlert({
              message: err?.error?.message || err?.error?.detail || 'Payment failed.',
              type: 'danger'
            });
          }
        });
      },
      error: (err: any) => {
        this.buyLoading.set(false);
        console.error('BuyNow error:', err);
        this.alertService.addAlert({
          message: err?.error?.detail || JSON.stringify(err?.error) || 'Failed to create order.',
          type: 'danger'
        });
      }
    });
  }

  confirmAddress() {
    if (!this.selectedAddressId()) {
      this.alertService.addAlert({
        message: 'Please select an address.',
        type: 'danger'
      });
      return;
    }
    this.addressModalOpen.set(false);
    this.proceedToPayment();
  }

  private proceedToPayment() {
    const p = this.product();
    if (!p) return;

    this.buyLoading.set(true);

    this.orderService.buyNow({
      product_id: p.id,
      quantity: this.quantity(),
      shipping_address_id: this.selectedAddressId()!,
      payment_method: 'EPAY',
    }).subscribe({
      next: (order: any) => {
        // 3) create payment link
        this.paymentService.createPayment(order.id).subscribe({
          next: (payRes: any) => {
            this.buyLoading.set(false);

            if (payRes?.payment_url) {
              // 4) redirect to paymob
              window.location.href = payRes.payment_url;
            } else if (payRes?.message) {
              this.alertService.addAlert({
                message: payRes.message,
                type: 'success'
              });
              this.router.navigate(['/orders']);
            } else {
              this.alertService.addAlert({
                message: 'Could not get payment link.',
                type: 'danger'
              });
            }
          },
          error: (err: any) => {
            this.buyLoading.set(false);
            this.alertService.addAlert({
              message: err?.error?.message || err?.error?.detail || 'Failed to create payment.',
              type: 'danger'
            });
          }
        });
      },
      error: (err: any) => {
        this.buyLoading.set(false);
        this.alertService.addAlert({
          message: err?.error?.detail || err?.error?.message || 'Failed to create order.',
          type: 'danger'
        });
      }
    });
  }

  // ---------- helpers ----------
  addressLabel(addr: any): string {
    return `${addr.label} — ${addr.full_name}, ${addr.city}`;
  }

  get addressItems() {
    return this.addressService.addresses().map(a => ({
      id: a.id,
      name: this.addressLabel(a),
      ...a
    }));
  }

  get preselectedAddressIds(): (string | number)[] {
    const id = this.selectedAddressId();
    return id != null ? [id] : [];
  }

  activeImage = signal<string | null>(null);

  loadProduct(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductDetail(id).subscribe({
      next: (res: any) => {
        this.product.set(res);
        this.activeImage.set(this.imageUrl);
        this.loading.set(false);
        this.loadReviews(id);  
      },
      error: () => {
        this.error.set('Failed to load product');
        this.loading.set(false);
      }
    });
  }

  get imageUrl(): string {
    const p = this.product();
    if (!p?.image) return 'assets/placeholder.png';
    return this.config.apiUrl + p.image;
  }

  get subImageUrls(): string[] {
    const p = this.product();
    if (!p?.sub_images) return [];
    return p.sub_images.map((s: any) => this.config.apiUrl + s.image);
  }

  setActiveImage(url: string) {
    this.activeImage.set(url);
  }

  private reviewService = inject(Review);

  // state
  reviews = signal<any[]>([]);
  reviewsLoading = signal<boolean>(false);
  reviewsCount = signal<number>(0);

  loadReviews(productId: number) {
    this.reviewsLoading.set(true);

    this.reviewService.getProductReviews(productId).subscribe({
      next: (res: any) => {
        this.reviews.set(res.results ?? []);
        this.reviewsCount.set(res.count ?? 0);
        this.reviewsLoading.set(false);
      },
      error: (err) => {
        console.error('Reviews error:', err);
        this.reviewsLoading.set(false);
      }
    });
  }
}