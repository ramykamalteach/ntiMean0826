// config/redis.js
const { createClient } = require('redis');

// In-memory educational fallback store if local Redis server is not running
const fallbackStore = new Map();
let isConnectedToRealRedis = false;

// Initialize native Redis client
const nativeRedisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        connectTimeout: 2000,
        reconnectStrategy: (retries) => {
            if (retries > 1) {
                // Don't spam retries if Redis isn't installed locally
                return false;
            }
            return 500;
        }
    }
});

nativeRedisClient.on('error', (err) => {
    // Only log once to avoid terminal flooding
    if (!isConnectedToRealRedis) {
        // Handled in connectRedis
    } else {
        console.error('Redis Error:', err.message);
    }
});

// Proxy / Wrapper to allow both real Redis and zero-config educational mode
const redisClient = {
    get: async function(key) {
        if (isConnectedToRealRedis && nativeRedisClient.isOpen) {
            return await nativeRedisClient.get(key);
        }
        
        // Educational fallback implementation
        const item = fallbackStore.get(key);
        if (!item) return null;
        
        // Check TTL expiration
        if (item.expiresAt && Date.now() > item.expiresAt) {
            fallbackStore.delete(key);
            return null;
        }
        return item.value;
    },

    set: async function(key, value, options = {}) {
        if (isConnectedToRealRedis && nativeRedisClient.isOpen) {
            return await nativeRedisClient.set(key, value, options);
        }
        
        // Educational fallback implementation
        let expiresAt = null;
        if (options && options.EX) {
            expiresAt = Date.now() + (options.EX * 1000);
        }
        fallbackStore.set(key, { value, expiresAt, setAt: Date.now(), exSeconds: options ? options.EX : null });
        return 'OK';
    },

    del: async function(key) {
        if (isConnectedToRealRedis && nativeRedisClient.isOpen) {
            return await nativeRedisClient.del(key);
        }
        const existed = fallbackStore.has(key);
        fallbackStore.delete(key);
        return existed ? 1 : 0;
    },

    ttl: async function(key) {
        if (isConnectedToRealRedis && nativeRedisClient.isOpen) {
            return await nativeRedisClient.ttl(key);
        }
        const item = fallbackStore.get(key);
        if (!item) return -2; // Key does not exist in Redis convention
        if (!item.expiresAt) return -1; // Exists with no TTL
        const remainingMs = item.expiresAt - Date.now();
        if (remainingMs <= 0) {
            fallbackStore.delete(key);
            return -2;
        }
        return Math.ceil(remainingMs / 1000);
    },

    flushAll: async function() {
        if (isConnectedToRealRedis && nativeRedisClient.isOpen) {
            return await nativeRedisClient.flushAll();
        }
        fallbackStore.clear();
        return 'OK';
    },

    getStatus: function() {
        return {
            connected: isConnectedToRealRedis,
            mode: isConnectedToRealRedis ? 'Production Redis (port 6379)' : 'Educational Redis Simulator (In-Memory)',
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        };
    }
};

async function connectRedis() {
    try {
        await nativeRedisClient.connect();
        isConnectedToRealRedis = true;
        console.log('✅ Redis connected successfully to redis://localhost:6379');
    } catch (err) {
        isConnectedToRealRedis = false;
        console.warn('⚠️  Notice: Local Redis server not detected on port 6379.');
        console.warn('   Running in Educational Simulator Mode so the tutorial and API work out-of-the-box!');
        console.warn('   (To use real Redis, start Redis server on port 6379 and restart this app).');
    }
}

module.exports = { redisClient, connectRedis };
