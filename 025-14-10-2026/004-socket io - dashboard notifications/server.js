const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database for Orders
let orders = [
  {
    id: 'ORD-1001',
    customer: {
      name: 'Sarah Connor',
      email: 'sarah.c@cyberdyne.io',
      phone: '+1 (555) 382-9901',
      city: 'Los Angeles, CA'
    },
    items: [
      { name: 'Apple iPhone 15 Pro Max', price: 1199, quantity: 1, icon: '📱' },
      { name: 'MagSafe Leather Case', price: 59, quantity: 1, icon: '🛡️' }
    ],
    totalAmount: 1258,
    paymentMethod: 'Apple Pay',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
  },
  {
    id: 'ORD-1002',
    customer: {
      name: 'Michael Scott',
      email: 'mscott@dundermifflin.com',
      phone: '+1 (555) 723-4412',
      city: 'Scranton, PA'
    },
    items: [
      { name: 'Sony WH-1000XM5 Wireless Headphones', price: 399, quantity: 1, icon: '🎧' },
      { name: 'World\'s Best Boss Mug', price: 15, quantity: 2, icon: '☕' }
    ],
    totalAmount: 429,
    paymentMethod: 'Credit Card',
    status: 'Processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() // 18 mins ago
  },
  {
    id: 'ORD-1003',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@designlab.co',
      phone: '+1 (555) 910-3329',
      city: 'Seattle, WA'
    },
    items: [
      { name: 'Keychron Q1 Pro Mechanical Keyboard', price: 199, quantity: 1, icon: '⌨️' }
    ],
    totalAmount: 199,
    paymentMethod: 'PayPal',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  }
];

// Helper to compute system metrics
function getSystemStats() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    activeConnections: io.engine.clientsCount || 0
  };
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Get all orders & stats
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    stats: getSystemStats(),
    orders: orders.slice().reverse() // Newest first
  });
});

// 2. Submit a new order (Step 1 & 2 in the project scenario)
app.post('/api/orders', (req, res) => {
  const { customer, items, paymentMethod } = req.body;

  // Validation
  if (!customer || !customer.name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order payload. Customer name and at least one item are required.'
    });
  }

  // Calculate total
  const calculatedTotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return sum + (price * qty);
  }, 0);

  // Step 3: Server processes the order
  const orderNumber = 1000 + orders.length + 1;
  const newOrder = {
    id: `ORD-${orderNumber}`,
    customer: {
      name: customer.name.trim(),
      email: (customer.email || 'customer@example.com').trim(),
      phone: (customer.phone || '+1 (555) 000-0000').trim(),
      city: (customer.city || 'San Francisco, CA').trim()
    },
    items: items.map(item => ({
      name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      icon: item.icon || '📦'
    })),
    totalAmount: calculatedTotal,
    paymentMethod: paymentMethod || 'Credit Card',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  // Save order to store
  orders.push(newOrder);

  console.log(`[Express API] ✅ New order received & processed: ${newOrder.id} for $${newOrder.totalAmount} by ${newOrder.customer.name}`);

  // Step 4: Socket.IO sends real-time notification to admin dashboard
  const notificationPayload = {
    type: 'NEW_ORDER',
    title: '🔔 New Order Received!',
    message: `${newOrder.customer.name} just placed order #${newOrder.id} ($${newOrder.totalAmount})`,
    order: newOrder,
    stats: getSystemStats(),
    timestamp: new Date().toISOString()
  };

  // Broadcast to all connected clients (especially the admin dashboard)
  io.emit('new_order', notificationPayload);

  // Step 5: Respond to customer REST request
  return res.status(201).json({
    success: true,
    message: 'Order created successfully and broadcasted in real time!',
    order: newOrder,
    stats: getSystemStats()
  });
});

// 3. Update order status (Admin action: Pending -> Processing -> Delivered)
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;

  // Real-time broadcast status change
  io.emit('order_status_updated', {
    orderId: id,
    status: status,
    stats: getSystemStats()
  });

  res.json({
    success: true,
    message: `Order ${id} updated to ${status}`,
    order,
    stats: getSystemStats()
  });
});

// 4. Quick Demo Mock Order Generator (useful for testing single-click order creation)
app.post('/api/orders/mock', (req, res) => {
  const sampleNames = ['Alex Mercer', 'David Rossi', 'Chloe Bennet', 'Marcus Vance', 'Amina Idris', 'Lucas Silva'];
  const sampleCities = ['New York, NY', 'Austin, TX', 'Chicago, IL', 'London, UK', 'Tokyo, JP', 'Berlin, DE'];
  const sampleProducts = [
    { name: 'Sony WH-1000XM5 Headphones', price: 399, icon: '🎧' },
    { name: 'Apple Watch Ultra 2', price: 799, icon: '⌚' },
    { name: 'Logitech MX Master 3S', price: 99, icon: '🖱️' },
    { name: 'Dell UltraSharp 32" 4K Monitor', price: 849, icon: '🖥️' },
    { name: 'Anker Prime 200W Power Bank', price: 129, icon: '🔋' },
    { name: 'Kindle Paperwhite Signature', price: 189, icon: '📖' }
  ];
  const paymentMethods = ['Apple Pay', 'Credit Card', 'Google Pay', 'PayPal'];

  const randomCustomer = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
  const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
  const randomQty = Math.floor(Math.random() * 2) + 1;
  const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  const orderNumber = 1000 + orders.length + 1;
  const newOrder = {
    id: `ORD-${orderNumber}`,
    customer: {
      name: randomCustomer,
      email: `${randomCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      city: randomCity
    },
    items: [
      {
        name: randomProduct.name,
        price: randomProduct.price,
        quantity: randomQty,
        icon: randomProduct.icon
      }
    ],
    totalAmount: randomProduct.price * randomQty,
    paymentMethod: randomPayment,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  const notificationPayload = {
    type: 'NEW_ORDER',
    title: '🔔 New Order Received!',
    message: `${newOrder.customer.name} just placed order #${newOrder.id} ($${newOrder.totalAmount})`,
    order: newOrder,
    stats: getSystemStats(),
    timestamp: new Date().toISOString()
  };

  io.emit('new_order', notificationPayload);

  res.status(201).json({
    success: true,
    message: 'Random mock order generated and emitted!',
    order: newOrder,
    stats: getSystemStats()
  });
});

// HTML page routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'store.html'));
});

// ==========================================
// SOCKET.IO REAL-TIME CONNECTION
// ==========================================
io.on('connection', (socket) => {
  console.log(`[Socket.IO] 🔌 Client connected: ${socket.id}`);

  // Broadcast updated client count to all connections
  io.emit('stats_update', getSystemStats());

  // Handle client joining admin room (optional separation)
  socket.on('join_admin', () => {
    socket.join('admin_channel');
    console.log(`[Socket.IO] 👑 Client ${socket.id} joined admin_channel`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] ❌ Client disconnected: ${socket.id}`);
    io.emit('stats_update', getSystemStats());
  });
});

// Start the HTTP & Socket.IO server
server.listen(PORT, () => {
  console.log(`
=====================================================
🚀 Real-Time Notification Server is running!
📡 URL: http://localhost:${PORT}
🛍️ Customer Store: http://localhost:${PORT}/store
📊 Admin Dashboard: http://localhost:${PORT}/admin
🔀 Split Demo View: http://localhost:${PORT}/
=====================================================
  `);
});
