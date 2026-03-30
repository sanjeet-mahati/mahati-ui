# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ curl
WORKDIR /app

# Copy package manifests for both the library and the deployable Next.js app
COPY library/package*.json ./library/
COPY testbed/package*.json ./testbed/

# Install dependencies required to build the app and transpile sibling library sources
RUN cd library && (npm ci || npm install)
RUN cd testbed && (npm ci || npm install)

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY --from=deps /app/library/node_modules ./library/node_modules
COPY --from=deps /app/testbed/node_modules ./testbed/node_modules
COPY library ./library
COPY testbed ./testbed

WORKDIR /app/testbed
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the standalone Next.js output for the testbed application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app/testbed

RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/testbed/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/testbed/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/testbed/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/testbed/package.json ./package.json

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
	CMD curl -f http://localhost:3000/api/ui-components-info || curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]