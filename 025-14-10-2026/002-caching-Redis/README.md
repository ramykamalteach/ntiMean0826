# 🚀 Redis Caching in Node.js & Express — Tutorial & Interactive Lab

An educational web application and reference implementation demonstrating **why Redis outperforms in-memory caching** for production applications, implementing the **Cache-Aside (Lazy Loading)** pattern with Express 5, Redis 4+, and MongoDB.

---

## 🌟 Why Redis for Larger Applications?

| In-Memory Caching (Node.js Heap) | Redis External Cache Service |
| :--- | :--- |
| **Bound to Node.js Process:** Cache shares V8 memory with app logic, risking Garbage Collection spikes & OOM crashes. | **Separate Process:** Runs independently in its own C-optimized engine; zero footprint on Node's event loop. |
| **Isolated per Instance:** When scaling horizontally across multiple cores/containers, caches become desynchronized. | **Shared Across Instances:** Centralized cache; all Node.js instances read & write the exact same keys. |
| **Data Loss on Reboot:** Server restarts, crashes, or CI/CD deployments completely wipe in-memory variables. | **Survives App Restarts:** Can persist data to disk via RDB snapshots and AOF logs. |
| **Manual Expiration:** Requires custom intervals or memory leak-prone timers. | **Native TTL:** Built-in second & millisecond key expiration (`{ EX: 60 }`). |
| **Basic Data Types:** JavaScript Objects and Maps only. | **Rich Data Structures:** Strings, Hashes, Lists, Sets, Sorted Sets (ZSET), Streams, Bitmaps. |

---

## 📂 Project Structure

```text
002-caching-Redis/
├── config/
│   └── redis.js          # Redis client setup (createClient, connectRedis, fallback)
├── models/
│   └── Product.js        # Product model simulating MongoDB Mongoose .find().lean()
├── routes/
│   └── products.js       # Route implementing the Cache-Aside pattern
├── public/
│   ├── index.html        # Interactive tutorial UI & visual simulation lab
│   ├── style.css         # Modern dark glassmorphism design system
│   └── app.js            # Frontend Cache-Aside visualizer & quiz logic
├── app.js                # Express entrypoint; connects Redis then listens
└── package.json          # Dependencies: express, redis, cors
```

---

## 🛠️ Step-by-Step Code Walkthrough

### 1. Install Redis Client
```bash
npm install redis
```

### 2. Configure Redis (`config/redis.js`)
```javascript
const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

async function connectRedis() {
    await redisClient.connect();
    console.log('Redis connected successfully');
}

module.exports = { redisClient, connectRedis };
```

### 3. Connect Redis in `app.js`
```javascript
const express = require('express');
const { connectRedis } = require('./config/redis');
const app = express();

async function startServer() {
    await connectRedis();
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

startServer();
```

### 4. Cache-Aside in `routes/products.js`
```javascript
const express = require('express');
const router = express.Router();
const { redisClient } = require('../config/redis');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        // 1. Check Redis
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            return res.json({ source: 'redis', data: JSON.parse(cachedProducts) });
        }

        // 2. Query MongoDB
        const products = await Product.find().lean();

        // 3. Store in Redis for 60 seconds
        await redisClient.set('products', JSON.stringify(products), { EX: 60 });

        res.json({ source: 'database', data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
```

---

## 🚀 Running the Tutorial App

1. **Start the application:**
   ```bash
   node app.js
   ```

2. **Open in your browser:**
   - **Interactive Tutorial Web App:** [http://localhost:3000](http://localhost:3000)
   - **Products API Endpoint:** [http://localhost:3000/api/products](http://localhost:3000/api/products)
   - **Cache Status:** [http://localhost:3000/api/products/status](http://localhost:3000/api/products/status)

3. **Interactive Features in Web App:**
   - **Live Simulator:** Trigger requests to see **CACHE MISS** (~180ms) vs **CACHE HIT** (~2ms).
   - **Real-Time TTL Ring Gauge:** Watch the 60-second countdown in real time.
   - **Node.js Restart Simulator:** Demonstrates how cached data survives server restarts.
   - **Multi-Instance Toggle:** Switch between Node Instance 1 & 2 to verify shared caching.
   - **Interactive Quiz:** Test understanding of Redis architecture with instant feedback.
