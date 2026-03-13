# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package*.json ./

# Update npm to latest version and clear cache  
RUN npm install -g npm@latest && npm cache clean --force

# Try npm ci first, fallback to npm install if lockfile issues
RUN npm ci --verbose || (echo "npm ci failed, falling back to npm install" && rm -f package-lock.json && npm install)

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the library
RUN npm run build

# Production stage for serving built library
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 library

# Copy built library
COPY --from=builder --chown=library:nodejs /app/dist ./dist
COPY --from=builder --chown=library:nodejs /app/package.json ./package.json

USER library

# Default command - you can override this when running the container
CMD ["node", "-e", "console.log('UI Components library built successfully'); process.exit(0)"]