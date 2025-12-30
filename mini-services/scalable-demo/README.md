# 🚀 Sistem Web Scalable

Sistem web sederhana yang menunjukkan konsep scalability dengan load balancing dan caching.

## 📋 Tabel Konten

- [Arsitektur Sistem](#1-arsitektur-sistem)
- [Quick Start](#2-quick-start)
- [API Documentation](#3-api-documentation)
- [Testing & Performance](#4-testing--performance)
- [Troubleshooting](#5-troubleshooting)
- [FAQ](#6-faq)

---

## 1. Arsitektur Sistem

### Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER / CLIENT                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │     Nginx Load Balancer   │  ← Distribute traffic
        │      (Port 8080)           │
        └─────┬──────┬──────┬─────┘
              │      │      │
        ┌─────▼────┐ ┌─▼────┐ ┌─▼────┐
        │ Backend   │ │Backend │ │Backend │
        │ Instance 1│ │Instance│ │Instance│
        │ (Port 3000)│ │(3000) │ │(3000) │
        └───────────┘ └───────┘ └───────┘
              │            │          │
              └─────┬──────┴──────┘
                    │
                    ▼
        ┌─────────────────────────┐
        │   Redis Cache         │  ← Fast data access
        │   (Port 6379)         │
        └─────────────────────────┘
```

### Komponen

| Komponen | Teknologi | Port | Fungsi |
|----------|-----------|------|---------|
| **Load Balancer** | Nginx Alpine | 8080 | Distribusi traffic ke backend |
| **Backend Service** | Node.js + Express | 3000 | REST API service |
| **Redis Cache** | Redis 7 Alpine | 6379 | In-memory caching |

---

## 2. Quick Start

### Prasyarat

- Docker dan Docker Compose terinstall
- Port 8080, 6379 tidak digunakan
- (Opsional) Apache Bench untuk load testing

### Langkah 1: Start Semua Services

```bash
cd /home/z/my-project/mini-services/scalable-demo

# Start dengan 3 backend instances
docker-compose up --scale backend=3
```

Output yang diharapkan:
```
Creating network "scalable-scalable-net"
Creating volume "scalable_redis_data"
Creating volume "scalable_nginx_logs"
Creating scalable-redis ...
Creating scalable-backend_1 ...
Creating scalable-backend_2 ...
Creating scalable-backend_3 ...
Creating scalable-nginx ...
```

### Langkah 2: Verifikasi Services Berjalan

```bash
# Cek status containers
docker-compose ps
```

Output yang diharapkan:
```
NAME                  STATUS    PORTS
scalable-nginx       Up        0.0.0.0:8080->80/tcp
scalable-redis       Up        0.0.0.0:6379->6379/tcp
scalable-backend_1   Up
scalable-backend_2   Up
scalable-backend_3   Up
```

### Langkah 3: Test Health Check

```bash
# Test health endpoint
curl http://localhost:8080/health
```

Response yang diharapkan:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "redis": "connected",
  "hostname": "backend_1",
  "pid": 1,
  "port": 3000,
  "uptime": 5.123
}
```

---

## 3. API Documentation

### Endpoints

#### GET `/`
Welcome endpoint dengan informasi sistem.

**Response:**
```json
{
  "message": "Selamat datang di Scalable Backend Service",
  "version": "1.0.0",
  "documentation": "/api/docs",
  "instance": {
    "hostname": "backend_1",
    "pid": 1,
    "port": 3000,
    "uptime": 10.5
  }
}
```

---

#### GET `/health`
Health check endpoint untuk monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "redis": "connected",
  "hostname": "backend_1",
  "pid": 1
}
```

---

#### GET `/api/counter`
Ambil nilai counter saat ini.

**Response (Cache Hit):**
```json
{
  "counter": 42,
  "cached": true,
  "instance": {
    "hostname": "backend_2"
  }
}
```

**Response (Cache Miss):**
```json
{
  "counter": 42,
  "cached": false,
  "instance": {
    "hostname": "backend_1"
  }
}
```

---

#### POST `/api/counter/increment`
Increment nilai counter.

**Request:**
```bash
curl -X POST http://localhost:8080/api/counter/increment
```

**Response:**
```json
{
  "counter": 43,
  "cached": true,
  "instance": {
    "hostname": "backend_3"
  }
}
```

---

#### POST `/api/counter/reset`
Reset counter ke 0.

**Response:**
```json
{
  "message": "Counter berhasil di-reset",
  "counter": 0,
  "instance": {
    "hostname": "backend_1"
  }
}
```

---

#### GET `/api/stats`
Statistik sistem yang detail.

**Response:**
```json
{
  "instance": {
    "hostname": "backend_2",
    "pid": 2,
    "port": 3000
  },
  "uptime": {
    "seconds": 1234,
    "minutes": 20,
    "hours": 0,
    "days": 0,
    "formatted": "0 hari, 0 jam, 20 menit"
  },
  "redis": {
    "connected": true,
    "host": "redis",
    "port": 6379
  },
  "memory": {
    "used": "45.2 MB",
    "total": "64.0 MB",
    "percentage": "70.63%"
  }
}
```

---

#### GET `/api/load?duration=2000`
Simulasi heavy load (untuk testing).

**Parameter:**
- `duration`: Durasi dalam milidetik (default: 1000)

**Response:**
```json
{
  "message": "Heavy load simulation selesai",
  "duration": "2000ms",
  "result": 42,
  "instance": {
    "hostname": "backend_1"
  }
}
```

---

## 4. Testing & Performance

### Jalankan Load Test Lengkap

```bash
cd /home/z/my-project/mini-services/scalable-demo

# Jalankan script test
./load-test.sh
```

Script akan menjalankan:
1. Health check verification
2. Basic single request
3. Concurrent increment test (20 requests)
4. Apache Bench test (10,000 requests, 100 concurrent)
5. wrk test (10 threads, 100 connections, 10 seconds)
6. Heavy load simulation
7. Burst traffic test (100 rapid requests)
8. Statistics check
9. Optional continuous load test (30 seconds)

### Manual Testing

#### Test dengan Apache Bench

```bash
# Install (jika belum terinstall)
sudo apt-get install apache2-utils

# Test basic
ab -n 1000 -c 10 http://localhost:8080/api/counter

# Test heavy load
ab -n 10000 -c 100 http://localhost:8080/api/counter

# Hasil yang dicek:
# - Requests per second
# - Time per request (mean, median, max)
# - Failed requests percentage
```

#### Test dengan curl

```bash
# Basic health check
curl -w "\nTime: %{time_total}s\n" http://localhost:8080/health

# Concurrent requests
for i in {1..20}; do
  curl http://localhost:8080/api/stats &
done
wait
```

#### Test dengan wrk

```bash
# Install (jika belum terinstall)
sudo apt-get install wrk

# Load test 10 seconds
wrk -t4 -c50 -d10s http://localhost:8080/api/counter

# Hasil yang dicek:
# - Latency (mean, stdev, min, max)
# - Requests/second
# - Transfer/second
```

### Metrik yang Harus Dicapai

| Metrik | Target | Cara Mengukur |
|--------|--------|--------------|
| **Requests/second** | > 100 RPS | Apache Bench / wrk |
| **Mean response time** | < 100ms | Apache Bench / wrk |
| **Failed requests** | < 1% | Apache Bench / wrk |
| **Cache hit rate** | > 80% | Backend logs |

---

## 5. Troubleshooting

### Problem: Backend instance tidak start

**Gejala:**
```
Creating scalable-backend_1 ... error
```

**Solusi:**
```bash
# Cek logs
docker-compose logs backend

# Cek port conflict
netstat -tuln | grep 3000

# Restart services
docker-compose down
docker-compose up --scale backend=3
```

---

### Problem: Redis connection failed

**Gejala:**
```
✗ Redis error: Redis server tidak dapat diakses
```

**Solusi:**
```bash
# Cek redis container
docker-compose ps redis

# Cek redis logs
docker-compose logs redis

# Test redis connection
docker-compose exec redis redis-cli ping
# Response: PONG

# Restart redis
docker-compose restart redis
```

---

### Problem: Nginx tidak distribute traffic

**Gejala:**
- Semua request masuk ke satu backend instance saja

**Solusi:**
```bash
# Cek nginx configuration
docker-compose exec nginx nginx -t

# Cek nginx logs
docker-compose logs nginx

# Reload nginx
docker-compose reload nginx

# Check upstream status
curl http://localhost:8080/nginx_status
```

---

### Problem: High memory usage

**Gejala:**
- Container mati karena OOM (Out of Memory)

**Solusi:**
```bash
# Cek resource usage
docker stats

# Kurangi number of instances
docker-compose up --scale backend=2

# Atau increase memory limit di docker-compose.yml
```

---

## 6. FAQ

### Q: Berapa banyak backend instance yang ideal?

**A:** Tergantung beban:
- **Light traffic**: 2-3 instances
- **Moderate traffic**: 3-5 instances
- **Heavy traffic**: 5+ instances

Mulai dengan 3, lalu scale berdasarkan monitoring.

---

### Q: Bagaimana cara scaling secara otomatis?

**A:** Untuk production, gunakan:
- **Kubernetes**: Auto-scaling berdasarkan CPU/memory
- **Cloud provider auto-scaling groups** (AWS, GCP, Azure)
- **Container orchestration** dengan monitoring

---

### Q: Apakah perlu database?

**A:** Untuk demo ini, tidak. Tapi untuk production:
- Gunakan PostgreSQL / MySQL untuk persistent data
- Gunakan Redis untuk caching layer
- Pertimbangkan database read-replicas untuk scaling

---

### Q: Bagaimana cara monitoring production?

**A:** Gunakan tools:
- **Prometheus + Grafana**: Metrics collection & visualization
- **ELK Stack**: Logging
- **Datadog / New Relic**: APM monitoring
- **Health check dashboard**: Untuk availability monitoring

---

### Q: Bagaimana handle failed instances?

**A:** Nginx akan otomatis:
- Stop routing ke failed instance (max_fails)
- Reroute traffic ke healthy instance
- Retry jika instance kembali online

---

### Q: Apa bedanya horizontal vs vertical scaling?

**A:**

| Aspek | Horizontal | Vertical |
|--------|------------|----------|
| **Cara** | Tambah instances | Upgrade resource |
| **Biaya** | Lebih fleksibel | Lebih mahal |
| **Fault Tolerance** | Tinggi | Rendah |
| **Downtime** | Minimal | Ada saat upgrade |

---

## Advanced Usage

### Scale Backend Instances

```bash
# Scale ke 5 instances
docker-compose up --scale backend=5

# Scale ke 10 instances
docker-compose up --scale backend=10

# Scale turun ke 2 instances
docker-compose up --scale backend=2
```

### Monitor Real-time

```bash
# Stream logs dari semua services
docker-compose logs -f

# Hanya logs backend
docker-compose logs -f backend

# Hanya logs nginx
docker-compose logs -f nginx

# Hanya logs redis
docker-compose logs -f redis
```

### Test dengan Different Load Patterns

```bash
# 1. Burst test (100 rapid requests)
for i in {1..100}; do curl http://localhost:8080/api/stats & done; wait

# 2. Sustained load (10 RPS selama 60 detik)
for i in {1..600}; do curl http://localhost:8080/api/counter & sleep 0.1; done

# 3. Spike test (1000 concurrent)
ab -n 10000 -c 1000 http://localhost:8080/api/counter
```

---

## Summary

Sistem ini mendemonstrasikan:

✅ **Horizontal Scaling**: Multiple backend instances dengan load balancer
✅ **High Availability**: No single point of failure
✅ **Performance**: Redis caching untuk response yang lebih cepat
✅ **Containerization**: Docker untuk portability dan deployment yang mudah
✅ **Observability**: Health checks dan stats endpoints
✅ **Testing**: Load test tools untuk validasi performance

Untuk pertanyaan lebih lanjut, cek dokumentasi lengkap di `ARCHITECTURE.md`
