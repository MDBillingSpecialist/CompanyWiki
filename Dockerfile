FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install additional dependencies needed for building
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files and install dependencies with verbose logging
COPY package.json package-lock.json ./
RUN npm ci --verbose

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data - disable it
ENV NEXT_TELEMETRY_DISABLED=1
# Increase memory available for Node.js during build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application with verbose output
RUN echo "Building application..." && \
    npm run build && \
    echo "Build complete!"

# Verify the build output
RUN ls -la .next/ && \
    echo "Checking for standalone directory..." && \
    ls -la .next/standalone || echo "No standalone directory found, using full .next directory"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Optimize for AWS environment
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Install utilities for debugging and healthcheck
RUN apk add --no-cache wget curl jq

# Create a non-root user and give them ownership
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create required directories with proper structure
# Important: Create ALL directories and set permissions BEFORE switching to non-root user
RUN mkdir -p /app/public /app/.next/static /app/content /app/logs /tmp/logs && \
    chown -R nextjs:nodejs /app /tmp/logs

# First copy package.json and install production dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --verbose

# Switch to non-root user for security
USER nextjs

# Copy server.js - critical for custom server implementation
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

# Health check - use both our custom health endpoint and the main page as fallback
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || \
        wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app with proper logging
CMD ["node", "server.js"]