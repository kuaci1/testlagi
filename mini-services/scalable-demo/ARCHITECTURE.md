# Sistem Web Scalable - Arsitektur & Implementasi

## 1. Desain Arsitektur Sistem

### Konsep Utama
Sistem ini dirancang dengan pendekatan **microservices** yang memiliki kemampuan scaling horizontal.

### Komponen Utama

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER / CLIENT                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │     Nginx Load Balancer   │  ← Distribute traffic secara merata
        │      (Port 80/443)        │
        └─────┬──────┬──────┬─────┘
              │      │      │
        ┌─────▼────┐ ┌─▼────┐ ┌─▼────┐
        │ Backend   │ │Backend │ │Backend │  ← Multiple instances
        │ Instance 1│ │Instance│ │Instance│     untuk scaling
        │ (Port 3001)│ │(3002) │ │(3003) │
        └───────────┘ └───────┘ └───────┘
              │            │          │
              └─────┬──────┴──────┘
                    │
                    ▼
        ┌─────────────────────────┐
        │   Redis Cache         │  ← Cache untuk performance
        │   (Port 6379)         │
        └─────────────────────────┘
```

### Alasan Pemilihan Arsitektur

#### 1. **Horizontal Scaling**
- **Kenapa**: Lebih fleksibel daripada vertical scaling
- **Cara kerja**: Menambah lebih banyak instance backend
- **Keuntungan**: Biaya lebih efisien, fault tolerance lebih baik

#### 2. **Load Balancer (Nginx)**
- **Kenapa**: Mencegah single point of failure, distribute traffic
- **Cara kerja**: Menggunakan algoritma round-robin
- **Keuntungan**: Health check otomatis, reroute jika instance gagal

#### 3. **Redis Cache**
- **Kenapa**: Mengurangi beban database, response lebih cepat
- **Cara kerja**: Menyimpan data yang sering diakses di memory
- **Keuntungan**: Response time berkurang drastis

### Flow Request

```
1. User Request → Load Balancer
                    ↓
2. Load Balancer → Pilih Backend Instance (Round Robin)
                    ↓
3. Backend Instance → Check Redis Cache
                    ↓
4. Cache Hit? → Ya: Return dari cache
                ↓ Tidak: Proses request, simpan ke cache
                    ↓
5. Return Response → User
```

---

## 2. Implementasi Sistem

### Struktur Folder
```
scalable-demo/
├── backend/
│   ├── index.js          # Main application code
│   ├── Dockerfile         # Container configuration
│   └── package.json      # Dependencies
├── nginx/
│   └── nginx.conf        # Load balancer configuration
├── docker-compose.yml    # Orchestration semua services
├── load-test.sh        # Script pengujian beban
└── README.md           # Dokumentasi lengkap
```

### 2.1 Backend Service (Node.js + Express)

**Fitur**:
- REST API sederhana (Counter API)
- Health check endpoint
- Redis integration untuk caching
- Support untuk multiple instance dengan port berbeda

**Teknologi**:
- Node.js (Runtime JavaScript yang efisien)
- Express (Web framework yang ringan dan cepat)
- Redis (In-memory data store untuk caching)

### 2.2 Load Balancer (Nginx)

**Fitur**:
- Round-robin load balancing
- Health check otomatis ke backend instances
- Retry otomatis jika instance gagal
- Static file serving (opsional)

**Konfigurasi**:
- Upstream blocks untuk setiap backend instance
- Health check interval dan timeout
- Load balancing method (least_conn atau round_robin)

### 2.3 Docker Containerization

**Manfaat Docker**:
- **Portability**: Aplikasi berjalan sama di semua environment
- **Scalability**: Spin up instance baru dalam detik
- **Isolation**: Tidak ada dependency conflict
- **Reproducibility**: Environment yang sama untuk development & production

**Docker Compose**:
- Orchestrate semua services dalam satu file
- Network automation
- Volume management
- Easy deployment

---

## 3. Pengujian Implementasi

### Metode Pengujian

#### 1. **Load Testing dengan Apache Bench (ab)**
```bash
# Test dengan 10,000 total request, 100 concurrent
ab -n 10000 -c 100 http://localhost/

# Result yang dicek:
# - Requests per second (RPS)
# - Time per request (mean, median, max)
# - Failed requests percentage
```

#### 2. **Load Testing dengan wrk**
```bash
# Test dengan 10 threads, 100 connections, 10 seconds
wrk -t10 -c100 -d10s http://localhost/

# Result yang dicek:
# - Latency distribution
# - Request/sec
# - Transfer/sec
```

#### 3. **Simulasi Request Bertubi-tubi**
```bash
# Script untuk mengirim request terus-menerus
while true; do
  curl http://localhost/api/counter &
done
```

### Kriteria Keberhasilan

1. **Scalability**:
   - ✅ Sistem dapat menangani 100+ request/second
   - ✅ Waktu response < 100ms (mean)
   - ✅ Failed requests < 1%

2. **Reliability**:
   - ✅ Tidak ada single point of failure
   - ✅ Load balancer reroute traffic otomatis
   - ✅ Instance yang gagal tidak mempengaruhi overall system

3. **Performance**:
   - ✅ Cache hit rate > 80%
   - ✅ Database load terkontrol
   - ✅ Resource utilization efisien (< 70%)

---

## Quick Start

### 1. Start Semua Services
```bash
cd /home/z/my-project/mini-services/scalable-demo
docker-compose up --scale backend=3
```

### 2. Tes Health Check
```bash
curl http://localhost/health
```

### 3. Jalankan Load Test
```bash
./load-test.sh
```

### 4. Monitoring
```bash
# Cek logs backend
docker-compose logs backend

# Cek logs nginx
docker-compose logs nginx
```

---

## Tambahan

### Scaling Vertikal (Opsional)
Jika perlu, scaling vertikal dapat dilakukan dengan:
- Menambah CPU resources
- Menambah memory allocation
- Menggunakan SSD storage

### Scaling Otomatis
Untuk production, pertimbangkan:
- Kubernetes untuk auto-scaling
- Container orchestration
- Auto-scaling groups di cloud providers

### Security Best Practices
- Rate limiting per IP
- HTTPS/TLS encryption
- Input validation
- Environment variables untuk secrets
- Network isolation

---

## Troubleshooting

### Backend Instance Not Responding
```bash
# Cek instance yang berjalan
docker ps

# Restart instance tertentu
docker-compose restart backend_1
```

### Load Balancer Not Distributing
```bash
# Cek nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose reload nginx
```

### Redis Connection Issues
```bash
# Cek redis logs
docker-compose logs redis

# Test redis connection
docker-compose exec redis redis-cli ping
```
