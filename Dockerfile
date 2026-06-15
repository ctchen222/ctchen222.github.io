# syntax=docker/dockerfile:1

# ---- Build stage: produce the static export in out/ ----
FROM node:20-slim AS builder
WORKDIR /app

# Pin pnpm to match CI (pnpm/action-setup v4 version 10)
RUN npm install -g pnpm@10

# Install deps first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build the static site (next build + RSS generation -> out/)
COPY . .
RUN pnpm build

# ---- Runtime stage: serve out/ with Caddy (auto-HTTPS, ~40MB) ----
FROM caddy:2-alpine AS runner
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/out /srv
EXPOSE 80 443
