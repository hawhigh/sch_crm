# ── Stage 1: Build frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install only production server deps
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm install --omit=dev --prefer-offline

# Copy compiled Prisma client
COPY --from=frontend-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=frontend-builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Copy server source
COPY server ./server
COPY tsconfig*.json ./

# Install tsx for runtime TS execution
RUN npm install --save-dev tsx

EXPOSE 3033

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3033/api/health || exit 1

CMD ["npx", "tsx", "server/index.ts"]
