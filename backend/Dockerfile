# backend/Dockerfile — Build multi-etapa para la API backend.
#
# Etapas:
#   base    - Imagen base Node.js 20 Alpine.
#   deps    - Instala dependencias de producción (npm ci).
#   builder - Genera Prisma Client y compila TypeScript a JavaScript.
#   runner  - Imagen final minimalista con solo dist/, node_modules/,
#             package.json y prisma/. Ejecuta como usuario no root (appuser).
#
# Puerto expuesto: 3000.

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install Prisma dependencies
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER appuser

EXPOSE 3000

ENV PORT=3000

CMD ["node", "dist/index.js"]
