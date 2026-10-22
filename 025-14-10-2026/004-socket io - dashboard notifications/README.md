# Real-Time E-Commerce Notification System
### Built with Node.js, Express, and Socket.IO (Pure Vanilla HTML, CSS & JavaScript)

This project demonstrates an end-to-end real-time notification architecture for an e-commerce platform without using any frontend frameworks (no Angular, React, or Vue).

---

## 📌 Project Scenario & Flow

```
[Customer Storefront]
        │
        │ 1. Submits Order (Checkout Form)
        ▼
[Express REST API]  ──> POST /api/orders
        │
        │ 2. Server Processes Order & Computes Totals
        ▼
[Socket.IO Server]
        │
        │ 3. Emits 'new_order' Event in Real-Time
        ▼
[Admin Dashboard]
        │
        │ 4. Plays Harmonic Audio Chime (Web Audio API)
        │ 5. Pops Up Floating Toast Alert
        │ 6. Increments Notification Bell Badge
        │ 7. Prepends Order to Live Feed Table (No Page Refresh!)
```

---

## 🚀 Running the Project

The server is currently running on **port 3000**.

If you ever need to start it manually:
```bash
npm start
# or: node server.js
```

### URLs to Access in Your Browser:
- **🔀 Split-Screen Interactive Demo Hub**: [http://localhost:3000/](http://localhost:3000/)  
  *(Customer checkout on the left, live admin dashboard on the right — perfect for seeing instant push updates side-by-side!)*
- **🛍️ Dedicated Customer Storefront**: [http://localhost:3000/store](http://localhost:3000/store)
- **📊 Dedicated Admin Operations Hub**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js | Server execution environment |
| **HTTP Framework** | Express.js | Serving static files & handling REST APIs (`POST /api/orders`, `PATCH /api/orders/:id/status`) |
| **WebSockets** | Socket.IO | Full-duplex real-time event broadcasting (`io.emit('new_order')`) |
| **Frontend** | Vanilla HTML5, CSS3 & JS | Fast, lightweight UI without framework overhead |
| **Audio** | Web Audio API | Synthesizes an arpeggiated 3-tone chime (C5-E5-G5) directly in browser without audio file dependencies |

---

## 📦 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Retrieves all orders and real-time dashboard metrics |
| `POST` | `/api/orders` | Customer places an order; server saves it and emits `new_order` event via Socket.IO |
| `PATCH` | `/api/orders/:id/status` | Admin updates order status (Pending → Processing → Delivered); emits `order_status_updated` |
| `POST` | `/api/orders/mock` | Simulates an instant random order for testing without manual typing |

---

## 🧪 How to Test the Real-Time Notification

1. Open [http://localhost:3000/](http://localhost:3000/) in your browser.
2. Under **Customer Checkout** (left side):
   - Click **"+ Add to Order"** on any product (e.g. *MacBook Air M3* or *Sony WH-1000XM5*).
   - Click **"Place Order (POST /api/orders)"**.
3. Watch the **Admin Operations Hub** (right side):
   - 🔔 **Chime**: A crisp notification sound plays.
   - ⚡ **Toast Alert**: A glowing toast notification slides in at the bottom right.
   - 🔴 **Badge Counter**: The bell badge bounces and increments.
   - 📋 **Order Stream**: The new order card/row is highlighted and prepended to the top of the table without refreshing the page!
