# ---- Stage 1a: build the customer website ----
FROM node:22-alpine AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build

# ---- Stage 1b: build the admin website ----
FROM node:22-alpine AS admin
WORKDIR /admin
COPY admin/package.json admin/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY admin/ ./
RUN npm run build

# ---- Stage 2: the server ----
FROM node:22-alpine

# Prisma's query engine needs OpenSSL.
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first so Docker can cache this layer.
# (postinstall runs `prisma generate`, which needs the schema.)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY scripts ./scripts
COPY --from=web /web/dist ./web/dist
COPY --from=admin /admin/dist ./admin/dist

# 5023 = tracker TCP port, 3000 = HTTP API + web app
EXPOSE 5023 3000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1

# Apply pending database migrations, then start the server.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && exec node src/index.js"]
