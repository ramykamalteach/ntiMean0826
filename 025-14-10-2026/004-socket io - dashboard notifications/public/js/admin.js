/**
 * Admin Dashboard & Socket.IO Real-Time Notification Receiver
 * Demonstrates Step 4 & Step 5: Socket.IO delivers real-time notifications to admin
 * without page refresh.
 */

const AdminApp = {
  socket: null,
  orders: [],
  notifications: [],
  unreadCount: 0,
  filterStatus: 'ALL',

  init() {
    this.initSocket();
    this.fetchInitialData();
    this.bindEvents();
    this.updateSoundBtnState();
  },

  initSocket() {
    // Connect to Socket.IO server
    this.socket = io();

    const connectionPill = document.getElementById('connection-status');
    const liveIndicator = document.getElementById('live-indicator');
    const activeClientsEl = document.getElementById('stat-active-clients');

    this.socket.on('connect', () => {
      console.log('⚡ [Admin Socket.IO] Connected with socket ID:', this.socket.id);
      if (connectionPill) connectionPill.innerHTML = `<span class="live-dot"></span> Real-Time Connected`;
      if (liveIndicator) liveIndicator.textContent = 'Socket.IO Online';
      
      // Join admin channel
      this.socket.emit('join_admin');
    });

    this.socket.on('disconnect', () => {
      console.warn('⚠️ [Admin Socket.IO] Disconnected');
      if (connectionPill) connectionPill.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Disconnected`;
    });

    // Step 4 & 5: Listen for real-time new order broadcast!
    this.socket.on('new_order', (payload) => {
      console.log('🔔 [Admin Socket.IO] NEW_ORDER event received:', payload);
      this.handleNewOrderNotification(payload);
    });

    // Listen for order status updates
    this.socket.on('order_status_updated', (data) => {
      console.log('🔄 [Admin Socket.IO] Order status updated:', data);
      this.handleOrderStatusUpdated(data);
    });

    // Listen for real-time stats updates (e.g. connected users count)
    this.socket.on('stats_update', (stats) => {
      this.updateStatsDisplay(stats);
    });
  },

  async fetchInitialData() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        this.orders = data.orders || [];
        this.updateStatsDisplay(data.stats);
        this.renderOrdersTable();
      }
    } catch (err) {
      console.error('Failed to load initial orders:', err);
    }
  },

  // Core handler when Socket.IO fires 'new_order'
  handleNewOrderNotification(payload) {
    const { order, stats, message } = payload;

    // 1. Play synthesized chime sound
    if (window.soundManager) {
      window.soundManager.playChime();
    }

    // 2. Add to orders store
    this.orders.unshift(order);

    // 3. Prepend to orders table with highlight animation
    this.renderOrdersTable(order.id);

    // 4. Update Stats metrics
    if (stats) {
      this.updateStatsDisplay(stats);
    }

    // 5. Spawn floating Toast notification
    this.showToast({
      title: 'New Order Received!',
      message: `${order.customer.name} ordered ${order.items.length} item(s) for $${order.totalAmount.toLocaleString()}`,
      orderId: order.id,
      city: order.customer.city
    });

    // 6. Push to Notification Drawer & increment unread badge
    this.notifications.unshift({
      id: Date.now(),
      title: `Order #${order.id}`,
      text: `${order.customer.name} placed a $${order.totalAmount} order`,
      time: 'Just now',
      order: order
    });
    this.incrementBadge();
    this.renderNotificationsList();
  },

  handleOrderStatusUpdated(data) {
    const order = this.orders.find(o => o.id === data.orderId);
    if (order) {
      order.status = data.status;
      this.renderOrdersTable();
    }
    if (data.stats) {
      this.updateStatsDisplay(data.stats);
    }
  },

  updateStatsDisplay(stats) {
    if (!stats) return;

    const totalOrdersEl = document.getElementById('stat-total-orders');
    const totalRevEl = document.getElementById('stat-total-revenue');
    const pendingOrdersEl = document.getElementById('stat-pending-orders');
    const activeClientsEl = document.getElementById('stat-active-clients');

    if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders || 0;
    if (totalRevEl) totalRevEl.textContent = `$${(stats.totalRevenue || 0).toLocaleString()}`;
    if (pendingOrdersEl) pendingOrdersEl.textContent = stats.pendingOrders || 0;
    if (activeClientsEl) activeClientsEl.textContent = stats.activeConnections || 1;
  },

  renderOrdersTable(highlightId = null) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    const filtered = this.orders.filter(order => {
      if (this.filterStatus === 'ALL') return true;
      return order.status.toUpperCase() === this.filterStatus.toUpperCase();
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-dim);">
            No orders found matching the filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(order => {
      const isNew = highlightId && order.id === highlightId;
      const highlightClass = isNew ? 'new-order-highlight' : '';
      const formattedDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

      return `
        <tr class="${highlightClass}">
          <td>
            <span class="order-id">#${order.id}</span>
          </td>
          <td>
            <div class="customer-cell">
              <span class="customer-name">${order.customer.name}</span>
              <span class="customer-detail">${order.customer.city}</span>
            </div>
          </td>
          <td>
            <span class="items-tag" title="${itemsSummary}">
              ${order.items[0]?.icon || '📦'} ${order.items.length} item(s)
            </span>
          </td>
          <td>
            <strong style="color: #fff; font-size: 0.95rem;">$${order.totalAmount.toLocaleString()}</strong>
            <div style="font-size: 0.7rem; color: var(--text-dim);">${order.paymentMethod}</div>
          </td>
          <td>
            <span class="status-badge ${order.status.toLowerCase()}">
              ${order.status}
            </span>
          </td>
          <td>
            <select class="status-select" onchange="AdminApp.updateOrderStatus('${order.id}', this.value)">
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td style="color: var(--text-dim); font-size: 0.78rem;">
            ${formattedDate}
          </td>
        </tr>
      `;
    }).join('');
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating status: ' + err.message);
    }
  },

  showToast({ title, message, orderId, city }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">⚡</div>
      <div class="toast-body">
        <div class="toast-title">
          <span>${title}</span>
          <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
        </div>
        <div class="toast-msg">${message}</div>
        <div class="toast-meta">Location: ${city} • Order ID: ${orderId}</div>
      </div>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 350);
    }, 5000);
  },

  incrementBadge() {
    this.unreadCount += 1;
    const badge = document.getElementById('notif-badge');
    if (badge) {
      badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
      badge.style.display = 'flex';
      badge.classList.remove('bounce');
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('bounce');
    }
  },

  clearBadge() {
    this.unreadCount = 0;
    const badge = document.getElementById('notif-badge');
    if (badge) {
      badge.style.display = 'none';
      badge.textContent = '0';
    }
  },

  renderNotificationsList() {
    const list = document.getElementById('notif-items-list');
    if (!list) return;

    if (this.notifications.length === 0) {
      list.innerHTML = `<div class="notif-empty">No notifications yet</div>`;
      return;
    }

    list.innerHTML = this.notifications.map(n => `
      <div class="notif-item unread">
        <div class="notif-icon-box">📦</div>
        <div class="notif-content">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  },

  async triggerMockOrder() {
    const btn = document.getElementById('btn-simulate-order');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch('/api/orders/mock', { method: 'POST' });
      const data = await res.json();
      console.log('Mock order generated:', data);
    } catch (err) {
      console.error('Failed to trigger mock order:', err);
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  updateSoundBtnState() {
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (!soundBtn || !window.soundManager) return;
    const enabled = window.soundManager.isSoundEnabled();
    soundBtn.innerHTML = enabled ? '🔔' : '🔕';
    soundBtn.title = enabled ? 'Notification Sound: ON (click to mute)' : 'Notification Sound: OFF (click to unmute)';
    if (enabled) {
      soundBtn.classList.add('active');
    } else {
      soundBtn.classList.remove('active');
    }
  },

  bindEvents() {
    // Notification Drawer Toggle
    const bellBtn = document.getElementById('btn-bell');
    const dropdown = document.getElementById('notif-dropdown');
    if (bellBtn && dropdown) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');
        if (isOpen) {
          dropdown.classList.remove('show');
        } else {
          dropdown.classList.add('show');
          this.clearBadge();
        }
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== bellBtn) {
          dropdown.classList.remove('show');
        }
      });
    }

    // Clear notifications button
    const clearBtn = document.getElementById('btn-clear-notifs');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.notifications = [];
        this.renderNotificationsList();
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (window.soundManager) {
          window.soundManager.toggleSound();
          this.updateSoundBtnState();
        }
      });
    }

    // Simulate order button
    const simBtn = document.getElementById('btn-simulate-order');
    if (simBtn) {
      simBtn.addEventListener('click', () => this.triggerMockOrder());
    }

    // Status filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterStatus = btn.dataset.status;
        this.renderOrdersTable();
      });
    });
  }
};

// Initialize Admin App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
