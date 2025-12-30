# Dockerfile untuk Scalable Backend Service

# Base image - Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY backend/ .

# Expose port (akan di-override di docker-compose)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "index.js"]

# Labels untuk metadata
LABEL maintainer="Software Engineer"
LABEL version="1.0.0"
LABEL description="Scalable backend service dengan Redis cache"
