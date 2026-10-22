// Frontend Controller for Node-Cache In-Memory Caching Explorer

// State
let lastDbLatency = null;
let currentProducts = [];
let ttlTimerInterval = null;
let currentTtl = 0;
let logCount = 0;

// DOM Elements
const btnFetch = document.getElementById('btnFetch');
const btnRapidBurst = document.getElementById('btnRapidBurst');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnFlushCache = document.getElementById('btnFlushCache');
const btnClearLogs = document.getElementById('btnClearLogs');

const metricSourceCard = document.getElementById('metricSourceCard');
const sourceBadge = document.getElementById('sourceBadge');
const sourceIcon = document.getElementById('sourceIcon');
const sourceValue = document.getElementById('sourceValue');
const sourceSubtext = document.getElementById('sourceSubtext');

const latencyNumber = document.getElementById('latencyNumber');
const latencyBar = document.getElementById('latencyBar');
const latencySubtext = document.getElementById('latencySubtext');
const speedupBadge = document.getElementById('speedupBadge');

const ttlStatusTag = document.getElementById('ttlStatusTag');
const ttlSeconds = document.getElementById('ttlSeconds');
const ttlProgressFill = document.getElementById('ttlProgressFill');

const statHits = document.getElementById('statHits');
const statMisses = document.getElementById('statMisses');
const statKeys = document.getElementById('statKeys');
const hitRatioBadge = document.getElementById('hitRatioBadge');

const productsGrid = document.getElementById('productsGrid');
const catalogMetaText = document.getElementById('catalogMetaText');
const searchInput = document.getElementById('searchInput');

const logTerminal = document.getElementById('logTerminal');
const logCountBadge = document.getElementById('logCountBadge');

// Modal Elements
const addModal = document.getElementById('addModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const addProductForm = document.getElementById('addProductForm');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModal();
    initEventListeners();
    fetchCacheStats();
});

// Tab Navigation
function initTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.dataset.tab;
            const content = document.getElementById(target);
            if (content) content.classList.add('active');
        });
    });
}

// Modal handling
function initModal() {
    btnOpenAddModal.addEventListener('click', () => {
        addModal.classList.remove('hidden');
        document.getElementById('prodName').focus();
    });

    const closeModal = () => addModal.classList.add('hidden');
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);
    addModal.addEventListener('click', (e) => {
        if (e.target === addModal) closeModal();
    });

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleAddProduct();
        closeModal();
    });
}

// Event Listeners
function initEventListeners() {
    btnFetch.addEventListener('click', () => fetchProducts());
    btnRapidBurst.addEventListener('click', () => executeRapidBurst());
    btnFlushCache.addEventListener('click', () => flushCache());
    btnClearLogs.addEventListener('click', () => {
        logTerminal.innerHTML = '';
        logCount = 0;
        updateLogCount();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = currentProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
        renderProducts(filtered);
    });
}

// Logging helper
function appendLog(message, type = 'system') {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${escapeHtml(message)}</span>`;
    logTerminal.appendChild(entry);
    logTerminal.scrollTop = logTerminal.scrollHeight;

    logCount++;
    updateLogCount();
}

function updateLogCount() {
    if (logCountBadge) logCountBadge.textContent = logCount;
}

// Fetch Products from Express API (Step 3 Test)
async function fetchProducts(isBurst = false) {
    const clientStartTime = performance.now();
    btnFetch.disabled = true;

    try {
        const response = await fetch('/api/products');
        const result = await response.json();
        const clientLatency = Math.round(performance.now() - clientStartTime);

        const source = result.source; // 'cache' | 'database' | 'database-fallback'
        const serverLatency = result.responseTimeMs !== undefined ? result.responseTimeMs : clientLatency;
        const products = result.data || [];
        currentProducts = products;

        // Render UI updates
        updateMetrics(source, serverLatency, result.ttlRemainingSeconds);
        renderProducts(products);
        updateTelemetryStats();

        if (source === 'cache') {
            appendLog(`[CACHE HIT] Loaded ${products.length} products in ${serverLatency}ms (node-cache key 'products').`, 'cache');
            if (!isBurst) showToast(`Loaded from memory cache in ${serverLatency}ms!`, 'info');
        } else {
            lastDbLatency = serverLatency;
            appendLog(`[CACHE MISS] Queried ${products.length} products from ${source.toUpperCase()} in ${serverLatency}ms, cached for 60s.`, 'db');
            if (!isBurst) showToast(`Fetched from database in ${serverLatency}ms and cached.`, 'success');
        }

        // Start TTL countdown
        startTtlCountdown(result.ttlRemainingSeconds || 60);

    } catch (err) {
        appendLog(`[ERROR] Failed to fetch /api/products: ${err.message}`, 'error');
        showToast(`Request failed: ${err.message}`, 'error');
    } finally {
        btnFetch.disabled = false;
    }
}

// Update UI Metric Cards
function updateMetrics(source, latency, remainingTtl) {
    // 1. Source Card
    if (source === 'cache') {
        sourceBadge.textContent = 'HIT';
        sourceBadge.className = 'metric-badge badge-cache';
        sourceIcon.textContent = '⚡';
        sourceValue.textContent = 'Memory Cache';
        sourceValue.style.color = '#34d399';
        sourceSubtext.textContent = 'Served instantly from RAM without DB query';
    } else {
        sourceBadge.textContent = 'MISS';
        sourceBadge.className = 'metric-badge badge-db';
        sourceIcon.textContent = '🗄️';
        sourceValue.textContent = 'MongoDB';
        sourceValue.style.color = '#fbbf24';
        sourceSubtext.textContent = 'Queried database and populated cache';
    }

    // 2. Latency & Speedup
    latencyNumber.textContent = latency;
    const barWidth = Math.min(100, Math.max(4, (latency / 150) * 100));
    latencyBar.style.width = `${barWidth}%`;

    if (source === 'cache') {
        if (lastDbLatency && lastDbLatency > latency) {
            const speedup = Math.round(lastDbLatency / Math.max(1, latency));
            speedupBadge.textContent = `⚡ ${speedup}x Faster!`;
            speedupBadge.classList.remove('hidden');
        } else {
            speedupBadge.textContent = `⚡ Lightning Fast`;
            speedupBadge.classList.remove('hidden');
        }
        latencySubtext.textContent = `Instant RAM lookup (~${latency}ms)`;
    } else {
        speedupBadge.classList.add('hidden');
        latencySubtext.textContent = `Network + MongoDB query time (~${latency}ms)`;
    }
}

// TTL Countdown Timer
function startTtlCountdown(seconds) {
    clearInterval(ttlTimerInterval);
    currentTtl = seconds;

    const updateDisplay = () => {
        ttlSeconds.textContent = currentTtl;
        const percent = Math.max(0, Math.min(100, (currentTtl / 60) * 100));
        ttlProgressFill.style.width = `${percent}%`;

        if (currentTtl > 0) {
            ttlStatusTag.textContent = 'ACTIVE';
            ttlStatusTag.className = 'ttl-status-tag active';
            ttlProgressFill.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
        } else {
            ttlStatusTag.textContent = 'EXPIRED';
            ttlStatusTag.className = 'ttl-status-tag';
            ttlProgressFill.style.background = 'rgba(255, 255, 255, 0.1)';
            clearInterval(ttlTimerInterval);
        }
    };

    updateDisplay();

    ttlTimerInterval = setInterval(() => {
        if (currentTtl > 0) {
            currentTtl--;
            updateDisplay();
        } else {
            clearInterval(ttlTimerInterval);
        }
    }, 1000);
}

// Fetch node-cache statistics endpoint
async function fetchCacheStats() {
    try {
        const res = await fetch('/api/products/cache/status');
        const data = await res.json();

        statHits.textContent = data.stats.hits || 0;
        statMisses.textContent = data.stats.misses || 0;
        statKeys.textContent = data.allKeys.length || 0;

        const totalReqs = data.stats.hits + data.stats.misses;
        const ratio = totalReqs > 0 ? Math.round((data.stats.hits / totalReqs) * 100) : 0;
        hitRatioBadge.textContent = `${ratio}% Hit Ratio`;

        if (data.hasProductsCached) {
            startTtlCountdown(data.ttlRemainingSeconds);
        }
    } catch (e) {
        console.warn('Could not read cache stats:', e.message);
    }
}

function updateTelemetryStats() {
    fetchCacheStats();
}

// Rapid 5x Burst Test
async function executeRapidBurst() {
    btnRapidBurst.disabled = true;
    appendLog('--- Starting 5x Rapid Burst Test ---', 'system');
    showToast('Executing 5 rapid sequential requests...', 'info');

    for (let i = 1; i <= 5; i++) {
        appendLog(`[Burst ${i}/5] Sending GET /api/products...`, 'system');
        await fetchProducts(true);
        await new Promise(r => setTimeout(r, 150));
    }

    appendLog('--- Rapid Burst Test Complete. Notice the cache hits! ---', 'system');
    btnRapidBurst.disabled = false;
}

// Flush Cache
async function flushCache() {
    try {
        const res = await fetch('/api/products/cache/flush', { method: 'POST' });
        const data = await res.json();

        appendLog(`[CACHE FLUSH] Invalidate all keys: cache.flushAll() executed.`, 'invalidate');
        showToast('Cache cleared! Next request will query database.', 'warn');

        startTtlCountdown(0);
        updateTelemetryStats();

        // Reset source badge
        sourceBadge.textContent = 'FLUSHED';
        sourceBadge.className = 'metric-badge';
        sourceIcon.textContent = '🧹';
        sourceValue.textContent = 'Cache Cleared';
        sourceValue.style.color = '#94a3b8';
        sourceSubtext.textContent = 'Next fetch will hit MongoDB again';
    } catch (err) {
        appendLog(`[ERROR] Cache flush failed: ${err.message}`, 'error');
    }
}

// Add Product & Demonstrate Cache Invalidation
async function handleAddProduct() {
    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const category = document.getElementById('prodCategory').value;
    const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;
    const description = document.getElementById('prodDesc').value.trim();

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, category, stock, description })
        });
        const data = await res.json();

        if (res.ok) {
            appendLog(`[POST /api/products] Created "${name}". CACHE INVALIDATED for key 'products'!`, 'invalidate');
            showToast(`Product added! Cache invalidated to prevent stale data.`, 'success');
            addProductForm.reset();

            // Refresh products so the user sees fresh DB data immediately
            fetchProducts();
        } else {
            showToast(`Error: ${data.message}`, 'error');
        }
    } catch (err) {
        showToast(`Add failed: ${err.message}`, 'error');
    }
}

// Delete Product & Invalidate Cache
async function deleteProduct(id, name) {
    if (!confirm(`Delete "${name}"? This will also invalidate the cache!`)) return;

    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            appendLog(`[DELETE /api/products/${id}] Deleted product. Cache invalidated.`, 'invalidate');
            showToast(`Deleted "${name}" and invalidated cache.`, 'warn');
            fetchProducts();
        } else {
            showToast(`Delete failed: ${data.message}`, 'error');
        }
    } catch (err) {
        showToast(`Delete error: ${err.message}`, 'error');
    }
}

// Render Products Grid
function renderProducts(products) {
    catalogMetaText.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;

    if (!products || products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h4>No Products Found</h4>
                <p>Click <strong>Fetch Products</strong> or <strong>Add Product</strong> to populate.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(prod => `
        <div class="product-card">
            <div>
                <span class="product-category-chip">${escapeHtml(prod.category || 'Product')}</span>
                <h4 class="product-title">${escapeHtml(prod.name)}</h4>
                <p class="product-desc">${escapeHtml(prod.description || 'Premium quality verified item.')}</p>
            </div>
            <div class="product-footer">
                <div>
                    <div class="product-price">$${Number(prod.price).toFixed(2)}</div>
                    <span class="product-stock">Stock: ${prod.stock ?? 10} units</span>
                </div>
                <button class="btn-delete-prod" title="Delete & Invalidate Cache" onclick="deleteProduct('${prod._id}', '${escapeHtml(prod.name)}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Toast System
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warn') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Utility: HTML Escaper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
