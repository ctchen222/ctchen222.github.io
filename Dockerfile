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

# ---- Runtime stage: serve out/ with nginx ----
FROM nginx:1.27-alpine AS runner
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
