# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ curl
WORKDIR /app

# Copy library package files
COPY library/package*.json ./library/

# Install dependencies with optimizations
RUN cd library && npm ci --production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++
COPY library/package*.json ./library/
RUN cd library && npm ci
COPY . .

# Build the library
RUN cd library && npm run build

# Production stage for serving built library
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 library

# Copy built library and designs
COPY --from=builder --chown=library:nodejs /app/library/dist ./library/dist
COPY --from=builder --chown=library:nodejs /app/library/package.json ./library/package.json
COPY --from=builder --chown=library:nodejs /app/mahati-designs ./mahati-designs

USER library

# Default command - you can override this when running the container
CMD ["node", "-e", "console.log('UI Components library and designs built successfully'); process.exit(0)"]