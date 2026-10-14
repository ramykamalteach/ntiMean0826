// public/app.js
// Interactive Engine for Redis Caching Tutorial

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        isBackendConnected: false,
        backendMode: 'Checking...',
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        currentTTL: 0,
        ttlInterval: null,
        activeInstance: 1,
        // In-memory simulation fallback if backend isn't reached
        simulatedRedisStore: new Map(),
        cachedProducts: null,
        simulatedNodeMemory: { products: null } // To demonstrate in-memory cache wipe on restart
    };

    // Elements
    const elements = {
        serverStatusBadge: document.getElementById('server-status-badge'),
        serverStatusText: document.getElementById('server-status-text'),
        btnFetch: document.getElementById('btn-fetch-products'),
        btnFlush: document.getElementById('btn-flush-cache'),
        btnExpireFast: document.getElementById('btn-expire-fast'),
        btnRestartNode: document.getElementById('btn-restart-node'),
        btnClearLogs: document.getElementById('btn-clear-logs'),
        instRadios: document.querySelectorAll('input[name="node-instance"]'),

        // TTL
        ttlNumber: document.getElementById('ttl-number'),
        ttlCircle: document.getElementById('ttl-circle'),
        ttlBadge: document.getElementById('ttl-status-badge'),
        ttlInfoText: document.getElementById('ttl-info-text'),

        // Stats
        statTotal: document.getElementById('stat-total-reqs'),
        statHits: document.getElementById('stat-hits'),
        statMisses: document.getElementById('stat-misses'),
        statHitRatio: document.getElementById('stat-hit-ratio'),
        latencyRedis: document.getElementById('latency-redis'),
        latencyMongo: document.getElementById('latency-mongo'),

        // Banner
        banner: document.getElementById('result-status-banner'),
        bannerIcon: document.getElementById('banner-icon'),
        bannerTitle: document.getElementById('banner-title'),
        bannerDesc: document.getElementById('banner-desc'),
        latencyBadgeTime: document.getElementById('badge-latency-time'),
        latencyBadgeSource: document.getElementById('badge-latency-source'),

        // Log stream
        logStream: document.getElementById('activity-log-stream'),

        // Inspectors
        productsRenderArea: document.getElementById('products-render-area'),
        rawJsonOutput: document.getElementById('raw-json-output'),
        headersOutput: document.getElementById('headers-output'),

        // Nodes & Arrows in Diagram
        nodeClient: document.getElementById('node-client'),
        nodeServer: document.getElementById('node-server'),
        nodeRedis: document.getElementById('node-redis'),
        nodeMongo: document.getElementById('node-mongo'),
        arrowClientNode: document.getElementById('arrow-client-node'),
        arrowNodeRedis: document.getElementById('arrow-node-redis'),
        arrowNodeMongo: document.getElementById('arrow-node-mongo'),
        redisStateTag: document.getElementById('redis-cache-state-tag')
    };

    // Check backend health on startup
    initBackendHealthCheck();

    // Setup Event Listeners
    setupEventListeners();

    // Setup Code Tabs & Copy Buttons
    setupCodeTabs();

    // Setup Quiz
    setupQuiz();

    // --------------------------------------------------------------------------
    // Backend Connectivity Check
    // --------------------------------------------------------------------------
    async function initBackendHealthCheck() {
        try {
            const res = await fetch('/api/products/status');
            if (res.ok) {
                const data = await res.json();
                state.isBackendConnected = true;
                state.backendMode = data.mode || 'Active Express Backend';
                elements.serverStatusText.textContent = `Connected: ${data.mode}`;
                elements.serverStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                addLog('Connected to Express Backend on Port 3000', 'log-system');

                if (data.isCached && data.ttl > 0) {
                    startTTLCountdown(data.ttl);
                }
            } else {
                setOfflineMode();
            }
        } catch (e) {
            setOfflineMode();
        }
    }

    function setOfflineMode() {
        state.isBackendConnected = false;
        elements.serverStatusText.textContent = 'Demo Mode (Client Simulator Active)';
        elements.serverStatusBadge.style.borderColor = 'rgba(6, 182, 212, 0.4)';
        addLog('Client-side Educational Simulator activated.', 'log-system');
    }

    // --------------------------------------------------------------------------
    // Event Listeners
    // --------------------------------------------------------------------------
    function setupEventListeners() {
        elements.btnFetch.addEventListener('click', handleFetchProducts);
        elements.btnFlush.addEventListener('click', handleFlushCache);
        elements.btnExpireFast.addEventListener('click', handleExpireTTL);
        elements.btnRestartNode.addEventListener('click', handleRestartNode);
        elements.btnClearLogs.addEventListener('click', () => {
            elements.logStream.innerHTML = '';
            addLog('Logs cleared.', 'log-system');
        });

        elements.instRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.activeInstance = Number(e.target.value);
                const port = state.activeInstance === 1 ? 3000 : 3001;
                addLog(`Switched request target to Node Instance #${state.activeInstance} (Port ${port}). Notice Redis cache is 100% shared!`, 'log-system');
            });
        });

        // Inspector View Tabs
        const inspectorTabs = document.querySelectorAll('.tab-btn');
        inspectorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                inspectorTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Request Handler: Fetch Products (The Cache-Aside Flow)
    // --------------------------------------------------------------------------
    async function handleFetchProducts() {
        elements.btnFetch.disabled = true;
        const reqStart = Date.now();
        const instanceId = state.activeInstance;
        const port = instanceId === 1 ? 3000 : 3001;

        // Step 1 in Diagram
        highlightStep(1);
        animateArrow(elements.arrowClientNode);
        elements.nodeClient.classList.add('active-node');
        addLog(`[Client] Sending HTTP GET http://localhost:${port}/api/products...`);

        await sleep(250);
        elements.nodeClient.classList.remove('active-node');
        elements.nodeServer.classList.add('active-node');
        highlightStep(2);
        animateArrow(elements.arrowNodeRedis);
        addLog(`[Node #${instanceId}] Checking Redis: await redisClient.get('products')...`);

        let responseData = null;

        if (state.isBackendConnected) {
            try {
                const res = await fetch('/api/products');
                responseData = await res.json();
            } catch (err) {
                console.warn('Backend fetch failed, falling back to simulator', err);
                responseData = simulateFetchProducts();
            }
        } else {
            responseData = await simulateFetchProducts();
        }

        const isHit = responseData.source === 'redis';
        state.totalRequests++;

        if (isHit) {
            state.cacheHits++;
            elements.nodeRedis.classList.add('hit-node');
            highlightStep(3);
            addLog(`[Redis] ✅ CACHE HIT! Key "products" found in memory. Returning cached string.`, 'log-hit');
            await sleep(200);
            elements.nodeRedis.classList.remove('hit-node');
        } else {
            state.cacheMisses++;
            highlightStep(4);
            elements.nodeRedis.classList.add('miss-node');
            addLog(`[Redis] ⚠️ CACHE MISS! Key "products" not found in Redis.`, 'log-miss');
            
            await sleep(200);
            elements.nodeRedis.classList.remove('miss-node');
            animateArrow(elements.arrowNodeMongo);
            elements.nodeMongo.classList.add('active-node');
            addLog(`[Node #${instanceId}] Querying MongoDB: Product.find().lean()... (Simulating disk I/O)`);

            await sleep(350);
            elements.nodeMongo.classList.remove('active-node');
            highlightStep(5);
            addLog(`[Node #${instanceId}] Storing in Redis with 60s TTL: await redisClient.set('products', ..., { EX: 60 })`);
        }

        elements.nodeServer.classList.remove('active-node');
        elements.btnFetch.disabled = false;

        // Update TTL
        const remainingTTL = isHit ? parseInt(responseData.ttl) || 58 : 60;
        startTTLCountdown(remainingTTL);

        // Update UI Results
        renderResults(responseData, isHit);
        updateStats();
    }

    // --------------------------------------------------------------------------
    // Simulated Backend Logic (Runs seamlessly if backend offline)
    // --------------------------------------------------------------------------
    const mockProductsCatalog = [
        {
            _id: "670cfa10e3b9a101a1b1c001",
            name: "MacBook Pro 16\" M3 Max",
            category: "Laptops",
            price: 3499.99,
            stock: 14,
            rating: 4.9,
            description: "Liquid Retina XDR display, 36GB unified memory, 1TB SSD storage."
        },
        {
            _id: "670cfa10e3b9a101a1b1c002",
            name: "Sony WH-1000XM5 Wireless Headphones",
            category: "Audio",
            price: 399.99,
            stock: 35,
            rating: 4.8,
            description: "Industry-leading noise cancellation, 30-hour battery life, crystal clear audio."
        },
        {
            _id: "670cfa10e3b9a101a1b1c003",
            name: "Samsung Odyssey Neo G9 Gaming Monitor",
            category: "Displays",
            price: 1799.99,
            stock: 8,
            rating: 4.7,
            description: "49-inch dual QHD curved screen, Mini-LED backlight, 240Hz refresh rate."
        },
        {
            _id: "670cfa10e3b9a101a1b1c004",
            name: "Keychron Q1 Pro Mechanical Keyboard",
            category: "Peripherals",
            price: 199.99,
            stock: 52,
            rating: 4.9,
            description: "Custom wireless mechanical keyboard, QMK/VIA programmable, hot-swappable."
        },
        {
            _id: "670cfa10e3b9a101a1b1c005",
            name: "Logitech MX Master 3S Mouse",
            category: "Peripherals",
            price: 99.99,
            stock: 80,
            rating: 4.9,
            description: "Quiet clicks, 8K DPI sensor for glass tracking, electromagnetic scroll."
        }
    ];

    async function simulateFetchProducts() {
        const cached = state.simulatedRedisStore.get('products');
        if (cached && cached.expiresAt > Date.now()) {
            const ttl = Math.ceil((cached.expiresAt - Date.now()) / 1000);
            return {
                source: 'redis',
                responseTime: '2ms',
                ttl: `${ttl}s`,
                timestamp: new Date().toISOString(),
                data: JSON.parse(cached.value)
            };
        }

        // Simulate MongoDB latency
        await sleep(300);
        const data = mockProductsCatalog;
        state.simulatedRedisStore.set('products', {
            value: JSON.stringify(data),
            expiresAt: Date.now() + 60000
        });

        // Also store in simulated node memory for demonstration
        state.simulatedNodeMemory.products = data;

        return {
            source: 'database',
            responseTime: '184ms',
            ttl: '60s',
            timestamp: new Date().toISOString(),
            data: data
        };
    }

    // --------------------------------------------------------------------------
    // Cache Operations
    // --------------------------------------------------------------------------
    async function handleFlushCache() {
        if (state.isBackendConnected) {
            try {
                await fetch('/api/products/cache', { method: 'DELETE' });
            } catch (e) {
                console.error(e);
            }
        }
        state.simulatedRedisStore.delete('products');
        stopTTLCountdown();
        elements.redisStateTag.textContent = 'Key: "products" [EMPTY]';
        addLog('🗑️ Cache key "products" deleted from Redis (Simulated Cache Invalidation / DEL).', 'log-system');

        elements.banner.className = 'result-banner banner-idle';
        elements.bannerIcon.textContent = '🗑️';
        elements.bannerTitle.textContent = 'Redis Cache Flushed';
        elements.bannerDesc.textContent = 'Key "products" was removed. Next request will be a CACHE MISS and query MongoDB.';
        elements.latencyBadgeTime.textContent = '--';
        elements.latencyBadgeSource.textContent = 'CACHE CLEARED';
    }

    function handleExpireTTL() {
        if (state.isBackendConnected) {
            fetch('/api/products/cache', { method: 'DELETE' });
        }
        state.simulatedRedisStore.delete('products');
        stopTTLCountdown();
        elements.ttlNumber.textContent = '0';
        elements.ttlBadge.textContent = 'EXPIRED (0s)';
        elements.ttlBadge.className = 'ttl-badge';
        elements.ttlCircle.style.background = 'conic-gradient(rgba(255, 255, 255, 0.08) 0deg, rgba(255, 255, 255, 0.08) 360deg)';
        addLog('⏱️ TTL expired! Redis actively evicted key "products" from memory.', 'log-miss');
    }

    function handleRestartNode() {
        // Demonstrate Pillar 3: Survives Node.js restarts!
        state.simulatedNodeMemory.products = null; // Node process wiped!
        const hasRedis = state.simulatedRedisStore.has('products') || state.currentTTL > 0;

        addLog('🔄 [SIMULATION] Restarting Node.js Express server process...', 'log-system');
        setTimeout(() => {
            if (hasRedis) {
                addLog('✅ Node.js restarted successfully! Notice: Redis cached data is STILL INTACT because Redis is an independent process!', 'log-hit');
                alert('💡 Pillar 3 Demonstration:\n\nNode.js was restarted and its local V8 heap was completely wiped!\n\nHowever, because Redis runs in an independent external process, the "products" cache is STILL SAFE and ready to serve traffic!');
            } else {
                addLog('✅ Node.js restarted. (Redis was already empty).', 'log-system');
            }
        }, 500);
    }

    // --------------------------------------------------------------------------
    // TTL Countdown Timer
    // --------------------------------------------------------------------------
    function startTTLCountdown(seconds) {
        stopTTLCountdown();
        state.currentTTL = seconds;
        updateTTLDisplay(state.currentTTL);

        elements.ttlBadge.textContent = 'Active in Redis';
        elements.ttlBadge.className = 'ttl-badge active-ttl';
        elements.ttlInfoText.textContent = `Expires automatically in ${seconds}s`;
        elements.redisStateTag.textContent = `Key: "products" [TTL: ${seconds}s]`;

        state.ttlInterval = setInterval(() => {
            state.currentTTL--;
            if (state.currentTTL <= 0) {
                handleExpireTTL();
            } else {
                updateTTLDisplay(state.currentTTL);
                elements.redisStateTag.textContent = `Key: "products" [TTL: ${state.currentTTL}s]`;
            }
        }, 1000);
    }

    function stopTTLCountdown() {
        if (state.ttlInterval) {
            clearInterval(state.ttlInterval);
            state.ttlInterval = null;
        }
        elements.ttlNumber.textContent = '0';
        elements.ttlBadge.textContent = 'Empty / Evicted';
        elements.ttlBadge.className = 'ttl-badge';
        elements.ttlCircle.style.background = 'conic-gradient(rgba(255, 255, 255, 0.08) 0deg, rgba(255, 255, 255, 0.08) 360deg)';
        elements.ttlInfoText.textContent = 'Click "Fetch Products" to populate cache';
    }

    function updateTTLDisplay(seconds) {
        elements.ttlNumber.textContent = seconds;
        const progressDegree = (seconds / 60) * 360;
        elements.ttlCircle.style.background = `conic-gradient(var(--redis-red-bright) ${progressDegree}deg, rgba(255, 255, 255, 0.08) ${progressDegree}deg 360deg)`;
    }

    // --------------------------------------------------------------------------
    // UI Renderers & Diagnostics
    // --------------------------------------------------------------------------
    function renderResults(payload, isHit) {
        // Banner
        elements.banner.className = `result-banner ${isHit ? 'banner-hit' : 'banner-miss'}`;
        elements.bannerIcon.textContent = isHit ? '⚡' : '🍃';
        elements.bannerTitle.textContent = isHit ? 'CACHE HIT: Served from Redis' : 'CACHE MISS: Queried MongoDB & Populated Redis';
        elements.bannerDesc.textContent = isHit
            ? `Retrieved directly from Redis memory in ${payload.responseTime}. MongoDB was NOT queried!`
            : `MongoDB queried in ${payload.responseTime}. Data cached in Redis with 60s TTL.`;
        elements.latencyBadgeTime.textContent = payload.responseTime;
        elements.latencyBadgeSource.textContent = isHit ? 'REDIS IN-MEMORY' : 'MONGODB DATABASE';

        // Products Grid
        if (payload.data && Array.isArray(payload.data)) {
            elements.productsRenderArea.innerHTML = payload.data.map(p => `
                <div class="product-item">
                    <div class="product-cat">${escapeHtml(p.category || 'General')}</div>
                    <div class="product-title">${escapeHtml(p.name)}</div>
                    <div class="product-desc">${escapeHtml(p.description || '')}</div>
                    <div class="product-footer">
                        <span class="product-price">$${Number(p.price).toFixed(2)}</span>
                        <span class="product-stock">Stock: ${p.stock} units</span>
                    </div>
                </div>
            `).join('');
        }

        // Raw JSON Output
        elements.rawJsonOutput.textContent = JSON.stringify(payload, null, 2);

        // HTTP Headers Mock
        elements.headersOutput.textContent = `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-Cache: ${isHit ? 'HIT (Redis 6379)' : 'MISS (MongoDB 27017)'}
X-Response-Time: ${payload.responseTime}
X-Cache-TTL: ${payload.ttl || '60s'}
X-Node-Instance: Node #${state.activeInstance} (PID: 300${state.activeInstance - 1})
Cache-Control: public, max-age=60`;
    }

    function updateStats() {
        elements.statTotal.textContent = state.totalRequests;
        elements.statHits.textContent = state.cacheHits;
        elements.statMisses.textContent = state.cacheMisses;
        const ratio = state.totalRequests > 0
            ? Math.round((state.cacheHits / state.totalRequests) * 100)
            : 0;
        elements.statHitRatio.textContent = `${ratio}%`;
    }

    function addLog(message, className = '') {
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry ${className}`;
        entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-text">${escapeHtml(message)}</span>`;
        elements.logStream.appendChild(entry);
        elements.logStream.scrollTop = elements.logStream.scrollHeight;
    }

    function animateArrow(arrowEl) {
        if (!arrowEl) return;
        const packet = arrowEl.querySelector('.packet');
        if (packet) {
            packet.classList.add('animate-travel');
            setTimeout(() => packet.classList.remove('animate-travel'), 600);
        }
    }

    function highlightStep(stepNum) {
        document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active-step'));
        const activeCard = document.getElementById(`step-card-${stepNum}`);
        if (activeCard) activeCard.classList.add('active-step');
    }

    // --------------------------------------------------------------------------
    // Code Tabs & Copy
    // --------------------------------------------------------------------------
    function setupCodeTabs() {
        const codeTabBtns = document.querySelectorAll('.code-tab-btn');
        codeTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                codeTabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const targetPanelId = `code-panel-${btn.getAttribute('data-code')}`;
                const panel = document.getElementById(targetPanelId);
                if (panel) panel.classList.add('active');
            });
        });

        // Copy Buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    navigator.clipboard.writeText(targetEl.innerText).then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Copied!';
                        btn.style.color = '#34D399';
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.color = '';
                        }, 2000);
                    });
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Quiz Setup
    // --------------------------------------------------------------------------
    function setupQuiz() {
        const quizCards = document.querySelectorAll('.quiz-card');
        quizCards.forEach(card => {
            const correctIndex = parseInt(card.getAttribute('data-correct'), 10);
            const options = card.querySelectorAll('.quiz-option');
            const feedback = card.querySelector('.quiz-feedback');

            options.forEach((opt, idx) => {
                opt.addEventListener('click', () => {
                    options.forEach(o => o.disabled = true);
                    if (idx === correctIndex) {
                        opt.classList.add('correct');
                        feedback.className = 'quiz-feedback success';
                        feedback.innerHTML = '<strong>✓ Correct!</strong> Great job. This is a foundational reason for using Redis in enterprise scale Node.js systems.';
                        feedback.style.display = 'block';
                    } else {
                        opt.classList.add('incorrect');
                        options[correctIndex].classList.add('correct');
                        feedback.className = 'quiz-feedback fail';
                        feedback.innerHTML = `<strong>✕ Incorrect.</strong> The correct answer is option <strong>${String.fromCharCode(65 + correctIndex)}</strong>.`;
                        feedback.style.display = 'block';
                    }
                });
            });
        });
    }

    // Helper functions
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
