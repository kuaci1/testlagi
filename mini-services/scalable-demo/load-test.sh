#!/bin/bash

##############################################
# Load Testing Script untuk Scalable System
##############################################

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Load Testing - Scalable System${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# =====================
# Configuration
# =====================
BASE_URL="${1:-http://localhost:8080}"
HEALTH_URL="${BASE_URL}/health"
COUNTER_URL="${BASE_URL}/api/counter"
INCREMENT_URL="${BASE_URL}/api/counter/increment"
STATS_URL="${BASE_URL}/api/stats"
LOAD_URL="${BASE_URL}/api/load"

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Base URL: ${GREEN}$BASE_URL${NC}"
echo -e "  Health Check: ${GREEN}$HEALTH_URL${NC}"
echo ""

# =====================
# Helper Functions
# =====================

print_test_header() {
    echo -e "\n${BLUE}========== Test: $1 ==========${NC}\n"
}

wait_for_service() {
    echo -e "${YELLOW}Menunggu service siap...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf $HEALTH_URL > /dev/null; then
            echo -e "${GREEN}✓ Service siap!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}Menunggu... ($attempt/$max_attempts)${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗ Service tidak siap setelah $max_attempts percobaan${NC}"
    return 1
}

# =====================
# Test 1: Health Check
# =====================
print_test_header "Health Check"
wait_for_service

if [ $? -eq 1 ]; then
    echo -e "${RED}Error: Service tidak siap. Lanjutkan ke test lain? (y/n)${NC}"
    read -r response
    if [[ ! $response =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "\n${YELLOW}Response:${NC}"
curl -s $HEALTH_URL | jq '.' 2>/dev/null || curl -s $HEALTH_URL

# =====================
# Test 2: Basic Request (Single)
# =====================
print_test_header "Basic Request (Single)"

echo -e "${YELLOW}Mengirim GET request ke counter endpoint...${NC}"
START_TIME=$(date +%s.%N)
RESPONSE=$(curl -s -w "\n%{http_code}" $COUNTER_URL)
END_TIME=$(date +%s.%N)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

DURATION=$(echo "scale=3; $END_TIME - $START_TIME" | bc)

echo -e "  HTTP Status: ${GREEN}$HTTP_CODE${NC}"
echo -e "  Response Time: ${GREEN}${DURATION}ms${NC}"
echo -e "${YELLOW}Response:${NC}"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"

# =====================
# Test 3: Increment Counter (Multiple Requests)
# =====================
print_test_header "Concurrent Counter Increments"

echo -e "${YELLOW}Mengirim 20 concurrent increment requests...${NC}"

# Reset counter dulu
echo -e "  Resetting counter..."
curl -s -X POST $INCREMENT_URL/reset > /dev/null

INCREMENT_COUNT=20
echo -e "  Mengirim $INCREMENT_COUNT request..."

# Jalankan concurrent requests
for i in $(seq 1 $INCREMENT_COUNT); do
    curl -s -X POST $INCREMENT_URL &
done

# Tunggu semua background process selesai
wait

# Cek hasil
FINAL_COUNTER=$(curl -s $COUNTER_URL | jq -r '.counter')
echo -e "  ${GREEN}✓ Semua request selesai${NC}"
echo -e "  Final Counter Value: ${GREEN}$FINAL_COUNTER${NC}"

# =====================
# Test 4: Load Test dengan Apache Bench (ab)
# =====================
print_test_header "Load Test (Apache Bench)"

# Cek apakah ab terinstall
if ! command -v ab &> /dev/null; then
    echo -e "${YELLOW}Apache Bench tidak terinstall. Skip test ini.${NC}"
    echo -e "${YELLOW}Install dengan: apt-get install apache2-utils${NC}"
else
    echo -e "${YELLOW}Running Apache Bench...${NC}"
    echo -e "  Test: 10,000 total requests, 100 concurrent"
    
    echo ""
    echo -e "${BLUE}Test Results:${NC}"
    ab -n 10000 -c 100 $COUNTER_URL
    
    echo ""
    echo -e "${GREEN}✓ Apache Bench selesai${NC}"
fi

# =====================
# Test 5: Load Test dengan wrk (jika tersedia)
# =====================
print_test_header "Load Test (wrk)"

if ! command -v wrk &> /dev/null; then
    echo -e "${YELLOW}wrk tidak terinstall. Skip test ini.${NC}"
    echo -e "${YELLOW}Install dengan: apt-get install wrk${NC}"
else
    echo -e "${YELLOW}Running wrk...${NC}"
    echo -e "  Test: 10 threads, 100 connections, 10 seconds"
    
    echo ""
    echo -e "${BLUE}Test Results:${NC}"
    wrk -t10 -c100 -d10s $COUNTER_URL
    
    echo ""
    echo -e "${GREEN}✓ wrk selesai${NC}"
fi

# =====================
# Test 6: Heavy Load Simulation
# =====================
print_test_header "Heavy Load Simulation"

echo -e "${YELLOW}Mengirim request ke /api/load endpoint...${NC}"
echo -e "  Duration: 2000ms (2 seconds)"

START_TIME=$(date +%s.%N)
RESPONSE=$(curl -s -w "\n%{http_code}" "$LOAD_URL?duration=2000")
END_TIME=$(date +%s.%N)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

DURATION=$(echo "scale=3; $END_TIME - $START_TIME" | bc)

echo -e "  HTTP Status: ${GREEN}$HTTP_CODE${NC}"
echo -e "  Actual Duration: ${GREEN}${DURATION}ms${NC}"
echo -e "  Response:"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"

# =====================
# Test 7: Stress Test (Burst Traffic)
# =====================
print_test_header "Stress Test (Burst Traffic)"

echo -e "${YELLOW}Mengirim burst traffic (100 request rapid)...${NC}"
echo -e "  Mengirim 100 request secepat mungkin..."

START_TIME=$(date +%s.%N)

for i in $(seq 1 100); do
    curl -s $STATS_URL > /dev/null &
done

wait

END_TIME=$(date +%s.%N)
DURATION=$(echo "scale=3; $END_TIME - $START_TIME" | bc)

echo -e "  ${GREEN}✓ Burst selesai${NC}"
echo -e "  Total Time: ${GREEN}${DURATION}ms${NC}"
echo -e "  Average per Request: ${GREEN}$(echo "scale=2; $DURATION / 100" | bc)ms${NC}"

# =====================
# Test 8: Statistics Check
# =====================
print_test_header "System Statistics"

echo -e "${YELLOW}Mengambil statistik dari semua backend instances...${NC}"

# Request ke load balancer beberapa kali
for i in {1..3}; do
    echo ""
    echo -e "  Request #$i:"
    curl -s $STATS_URL | jq '.' 2>/dev/null || curl -s $STATS_URL
    sleep 1
done

# =====================
# Test 9: Continuous Load Test (Opsional)
# =====================
print_test_header "Continuous Load Test"

echo -e "${YELLOW}Jalankan continuous load test? (y/n)${NC}"
echo -e "${YELLOW}Ini akan mengirim request selama 30 detik.${NC}"
read -r response

if [[ $response =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Starting continuous load test (30s)...${NC}"
    echo -e "  Tekan Ctrl+C untuk stop${NC}"
    echo ""
    
    DURATION=30
    START_TIME=$(date +%s)
    TOTAL_REQUESTS=0
    FAILED_REQUESTS=0
    
    # Loop untuk 30 detik
    while [ $(($(date +%s) - START_TIME)) -lt $DURATION ]; do
        # Kirim 10 request per detik
        for i in {1..10}; do
            if curl -sf $STATS_URL > /dev/null; then
                TOTAL_REQUESTS=$((TOTAL_REQUESTS + 1))
            else
                FAILED_REQUESTS=$((FAILED_REQUESTS + 1))
            fi
        done
        
        # Tampilkan progress
        CURRENT_TIME=$(($(date +%s) - START_TIME))
        PROGRESS=$((CURRENT_TIME * 100 / DURATION))
        echo -ne "\r  Progress: ${PROGRESS}% | Requests: $TOTAL_REQUESTS | Failed: $FAILED_REQUESTS"
        sleep 1
    done
    
    echo ""
    echo -e "${GREEN}✓ Continuous load test selesai${NC}"
    echo -e "  Total Requests: ${GREEN}$TOTAL_REQUESTS${NC}"
    echo -e "  Failed Requests: ${RED}$FAILED_REQUESTS${NC}"
    echo -e "  Success Rate: ${GREEN}$(echo "scale=2; ($TOTAL_REQUESTS - $FAILED_REQUESTS) * 100 / $TOTAL_REQUESTS" | bc)%${NC}"
    echo -e "  Requests/Second: ${GREEN}$(echo "scale=2; $TOTAL_REQUESTS / $DURATION" | bc)${NC}"
fi

# =====================
# Test Summary
# =====================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All Tests Completed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Tips untuk testing lebih lanjut:${NC}"
echo -e "  1. Cek logs: ${GREEN}docker-compose logs -f${NC}"
echo -e "  2. Cek status: ${GREEN}docker-compose ps${NC}"
echo -e "  3. Scale backend: ${GREEN}docker-compose up --scale backend=5${NC}"
echo -e "  4. Monitor resources: ${GREEN}docker stats${NC}"
echo ""
