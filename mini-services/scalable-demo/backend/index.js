/**
 * Scalable Backend Service
 * Sederhana REST API dengan Redis caching untuk demo scalability
 */

const express = require('express');
const redis = require('redis');
const os = require('os');

// Inisialisasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Inisialisasi Redis Client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server tidak dapat diakses');
    }
    return new Error('Redis error tidak dikenal');
  }
});

let redisConnected = false;

redisClient.on('connect', () => {
  console.log(`✓ Redis terhubung pada ${redisClient.host}:${redisClient.port}`);
  redisConnected = true;
});

redisClient.on('error', (err) => {
  console.error('✗ Redis error:', err.message);
  redisConnected = false;
});

// Counter in-memory untuk demo
let counter = 0;

/**
 * Helper: Get instance info
 */
function getInstanceInfo() {
  return {
    hostname: os.hostname(),
    pid: process.pid,
    uptime: process.uptime(),
    port: PORT,
    memory: process.memoryUsage()
  };
}

/**
 * Helper: Cache TTL settings
 */
const CACHE_TTL = {
  SHORT: 60,    // 1 menit
  MEDIUM: 300,  // 5 menit
  LONG: 3600    // 1 jam
};

// =====================
// API Routes
// =====================

/**
 * GET /health
 * Health check endpoint untuk load balancer
 */
app.get('/health', (req, res) => {
  const info = getInstanceInfo();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    redis: redisConnected ? 'connected' : 'disconnected',
    ...info
  });
});

/**
 * GET /
 * Welcome endpoint dengan info sistem
 */
app.get('/', (req, res) => {
  const info = getInstanceInfo();
  
  res.json({
    message: 'Selamat datang di Scalable Backend Service',
    version: '1.0.0',
    documentation: '/api/docs',
    instance: info
  });
});

/**
 * GET /api/counter
 * GET counter value (dengan cache)
 */
app.get('/api/counter', async (req, res) => {
  try {
    const cacheKey = 'counter:main';
    
    // Cek cache dulu
    const cachedValue = await getFromCache(cacheKey);
    
    if (cachedValue !== null) {
      console.log(`[CACHE HIT] Mengambil counter dari cache`);
      return res.json({
        counter: parseInt(cachedValue),
        cached: true,
        instance: getInstanceInfo()
      });
    }
    
    // Cache miss, ambil dari memory
    console.log(`[CACHE MISS] Mengambil counter dari memory`);
    
    // Simpan ke cache
    await setToCache(cacheKey, counter.toString(), CACHE_TTL.SHORT);
    
    res.json({
      counter: counter,
      cached: false,
      instance: getInstanceInfo()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/counter/increment
 * Increment counter value
 */
app.post('/api/counter/increment', async (req, res) => {
  try {
    counter++;
    
    // Invalidate cache
    const cacheKey = 'counter:main';
    await deleteFromCache(cacheKey);
    console.log(`[INVALIDATE] Cache dihapus untuk key: ${cacheKey}`);
    
    // Simpan nilai baru ke cache
    await setToCache(cacheKey, counter.toString(), CACHE_TTL.SHORT);
    
    console.log(`[INCREMENT] Counter sekarang: ${counter}`);
    
    res.json({
      counter: counter,
      cached: true,
      instance: getInstanceInfo()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/counter/reset
 * Reset counter ke 0
 */
app.post('/api/counter/reset', async (req, res) => {
  try {
    counter = 0;
    
    // Invalidate dan update cache
    const cacheKey = 'counter:main';
    await deleteFromCache(cacheKey);
    await setToCache(cacheKey, '0', CACHE_TTL.SHORT);
    
    console.log(`[RESET] Counter di-reset ke 0`);
    
    res.json({
      message: 'Counter berhasil di-reset',
      counter: 0,
      instance: getInstanceInfo()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats
 * Statistics endpoint
 */
app.get('/api/stats', async (req, res) => {
  try {
    const info = getInstanceInfo();
    
    // Hitung uptime dalam format yang mudah dibaca
    const uptimeSeconds = process.uptime();
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);
    
    res.json({
      instance: info,
      uptime: {
        seconds: uptimeSeconds,
        minutes: uptimeMinutes,
        hours: uptimeHours,
        days: uptimeDays,
        formatted: `${uptimeDays} hari, ${uptimeHours % 24} jam, ${uptimeMinutes % 60} menit`
      },
      redis: {
        connected: redisConnected,
        host: redisClient.host,
        port: redisClient.port
      },
      memory: {
        used: `${Math.round(info.memory.heapUsed / 1024 / 1024)} MB`,
        total: `${Math.round(info.memory.heapTotal / 1024 / 1024)} MB`,
        percentage: `${((info.memory.heapUsed / info.memory.heapTotal) * 100).toFixed(2)}%`
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/load
 * Simulasi heavy load (untuk testing)
 */
app.get('/api/load', async (req, res) => {
  try {
    const duration = parseInt(req.query.duration) || 1000; // Default 1 detik
    
    // Simulasi heavy computation
    const start = Date.now();
    let sum = 0;
    
    while (Date.now() - start < duration) {
      // Heavy computation loop
      for (let i = 0; i < 1000; i++) {
        sum += Math.sqrt(i);
      }
    }
    
    res.json({
      message: 'Heavy load simulation selesai',
      duration: `${duration}ms`,
      result: sum % 1000,
      instance: getInstanceInfo()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================
// Redis Helper Functions
// =====================

function getFromCache(key) {
  return new Promise((resolve, reject) => {
    if (!redisConnected) {
      return resolve(null);
    }
    
    redisClient.get(key, (err, value) => {
      if (err) {
        console.error('Redis GET error:', err);
        return resolve(null);
      }
      resolve(value);
    });
  });
}

function setToCache(key, value, ttl) {
  return new Promise((resolve, reject) => {
    if (!redisConnected) {
      return resolve();
    }
    
    redisClient.setex(key, ttl, value, (err, reply) => {
      if (err) {
        console.error('Redis SET error:', err);
        return reject(err);
      }
      resolve(reply);
    });
  });
}

function deleteFromCache(key) {
  return new Promise((resolve, reject) => {
    if (!redisConnected) {
      return resolve();
    }
    
    redisClient.del(key, (err, reply) => {
      if (err) {
        console.error('Redis DEL error:', err);
        return reject(err);
      }
      resolve(reply);
    });
  });
}

// =====================
// Start Server
// =====================

app.listen(PORT, '0.0.0.0', () => {
  const info = getInstanceInfo();
  console.log('========================================');
  console.log('🚀 Scalable Backend Service Started!');
  console.log('========================================');
  console.log(`Instance: ${info.hostname}:${PORT}`);
  console.log(`PID: ${info.pid}`);
  console.log(`Redis: ${redisConnected ? '✓ Connected' : '✗ Disconnected'}`);
  console.log(`Uptime: ${Math.floor(info.uptime)} seconds`);
  console.log('========================================');
  console.log('Available Endpoints:');
  console.log(`  GET  /health              - Health check`);
  console.log(`  GET  /                   - Welcome & info`);
  console.log(`  GET  /api/counter         - Get counter value`);
  console.log(`  POST /api/counter/increment - Increment counter`);
  console.log(`  POST /api/counter/reset    - Reset counter`);
  console.log(`  GET  /api/stats            - System statistics`);
  console.log(`  GET  /api/load             - Simulasi heavy load`);
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  redisClient.quit();
  process.exit(0);
});
