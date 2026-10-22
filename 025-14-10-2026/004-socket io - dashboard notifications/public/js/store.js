/**
 * Customer Storefront & Order Placement Logic
 * Interacts with the Express server via REST API (POST /api/orders)
 */

const StoreApp = {
  products: [
    { id: 1, name: 'Apple iPhone 15 Pro', price: 999, icon: '📱', desc: 'Titanium design, A17 Pro chip' },
    { id: 2, name: 'Sony WH-1000XM5', price: 399, icon: '🎧', desc: 'Industry-leading noise cancellation' },
    { id: 3, name: 'MacBook Air M3 15"', price: 1299, icon: '💻', desc: 'Strikingly thin, up to 18 hrs battery' },
    { id: 4, name: 'Keychron Q1 Pro Wireless', price: 199, icon: '⌨️', desc: 'Custom mechanical keyboard' },
    { id: 5, name: 'Apple Watch Ultra 2', price: 799, icon: '⌚', desc: 'Rugged GPS + Cellular titanium' },
    { id: 6, name: 'Anker Prime 200W Power Bank', price: 129, icon: '🔋', desc: 'Ultra-fast multi-device charging' }
  ],

  cart: [
    { id: 1, name: 'Apple iPhone 15 Pro', price: 999, quantity: 1, icon: '📱' }
  ],

  init() {
    this.renderProducts();
    this.renderCart();
    this.bindEvents();
  },

  renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = this.products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-icon">${product.icon}</div>
        <div class="product-info">
          <h4 title="${product.name}">${product.name}</h4>
          <div style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 6px;">${product.desc}</div>
          <div class="product-price">$${product.price}</div>
        </div>
        <div class="product-action">
          <button class="btn-add-cart" onclick="StoreApp.addToCart(${product.id})">
            + Add to Order
          </button>
        </div>
      </div>
    `).join('');
  },

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        icon: product.icon
      });
    }

    this.renderCart();
  },

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.id !== productId);
    }
    this.renderCart();
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    this.renderCart();
  },

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  renderCart() {
    const listEl = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-amount');
    const countBadge = document.getElementById('cart-count');
    
    if (!listEl) return;

    const total = this.getCartTotal();
    const count = this.cart.reduce((sum, i) => sum + i.quantity, 0);

    if (countBadge) countBadge.textContent = count;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;

    if (this.cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-dim); font-size: 0.8rem;">
          Your cart is empty. Pick items from above!
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-title">
          <span>${item.icon}</span>
          <div>
            <strong>${item.name}</strong>
            <div style="color: var(--text-dim); font-size: 0.72rem;">$${item.price} each</div>
          </div>
        </div>
        <div class="cart-item-actions">
          <button type="button" class="qty-btn" onclick="StoreApp.updateQuantity(${item.id}, -1)">-</button>
          <span style="font-weight: 600; min-width: 16px; text-align: center;">${item.quantity}</span>
          <button type="button" class="qty-btn" onclick="StoreApp.updateQuantity(${item.id}, 1)">+</button>
          <span style="min-width: 50px; text-align: right; font-weight: 600; color: #a5b4fc;">
            $${item.price * item.quantity}
          </span>
        </div>
      </div>
    `).join('');
  },

  fillRandomDemoCustomer() {
    const names = [
      { name: 'Sophia Chen', email: 'sophia.c@nexus.ai', city: 'San Francisco, CA', phone: '+1 (555) 234-5678' },
      { name: 'Liam Gallagher', email: 'liam.g@audioforge.io', city: 'Manchester, UK', phone: '+44 20 7946 0912' },
      { name: 'Amara Okafor', email: 'amara.o@fintech.co', city: 'Toronto, Canada', phone: '+1 (555) 890-1234' },
      { name: 'Tariq Al-Mansoor', email: 'tariq.m@venture.ae', city: 'Dubai, UAE', phone: '+971 4 312 8899' },
      { name: 'Emma Watson', email: 'emma.w@oxford.ac.uk', city: 'London, UK', phone: '+44 20 7123 4567' }
    ];
    const pick = names[Math.floor(Math.random() * names.length)];
    
    const nameInput = document.getElementById('cust-name');
    const emailInput = document.getElementById('cust-email');
    const phoneInput = document.getElementById('cust-phone');
    const cityInput = document.getElementById('cust-city');

    if (nameInput) nameInput.value = pick.name;
    if (emailInput) emailInput.value = pick.email;
    if (phoneInput) phoneInput.value = pick.phone;
    if (cityInput) cityInput.value = pick.city;
  },

  bindEvents() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => this.handleSubmitOrder(e));
    }

    const autofillBtn = document.getElementById('btn-autofill');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => this.fillRandomDemoCustomer());
    }

    const closeModalBtn = document.getElementById('btn-close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        const modal = document.getElementById('order-success-modal');
        if (modal) modal.classList.remove('show');
      });
    }
  },

  // Step 1: Customer submits an order -> Step 2: Express receives through REST API
  async handleSubmitOrder(e) {
    e.preventDefault();

    if (this.cart.length === 0) {
      alert('Please add at least one item to your cart before ordering.');
      return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const payment = document.getElementById('cust-payment').value;

    const submitBtn = document.getElementById('btn-submit-order');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳ Submitting to Express REST API...</span>`;

    const orderPayload = {
      customer: { name, email, phone, city },
      items: this.cart,
      paymentMethod: payment
    };

    try {
      // Step 2: Call the Express REST API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      console.log('✅ Order placed via REST API:', data.order);

      // Show receipt modal to customer
      this.showReceiptModal(data.order);

      // Reset cart and generate new random demo customer for convenience
      this.cart = [];
      this.renderCart();
      this.fillRandomDemoCustomer();

    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Error placing order: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  },

  showReceiptModal(order) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;

    document.getElementById('receipt-order-id').textContent = order.id;
    document.getElementById('receipt-customer').textContent = order.customer.name;
    document.getElementById('receipt-payment').textContent = order.paymentMethod;
    document.getElementById('receipt-total').textContent = `$${order.totalAmount.toLocaleString()}`;
    document.getElementById('receipt-status').textContent = order.status;

    modal.classList.add('show');
  }
};

// Initialize storefront when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  StoreApp.init();
});
