# Multi-stage build for Next.js 16 + Prisma 7 (native driver adapter) + sharp (native).
# No secrets are declared as ARG/ENV anywhere in this file — every value the app
# needs (DATABASE_URL, NEXTAUTH_SECRET, CLOUDINARY_*, CLOUDFLARE_*, etc.) is a
# plain server-side var read from process.env at runtime, not at build time, so
# it must be set in the hosting platform's runtime environment panel instead.
FROM node:24-slim AS base
WORKDIR /app
# openssl is required by Prisma's query engine on Debian-based images.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# fontconfig + a real font: sharp/librsvg needs these to rasterize any SVG
# text, and node:24-slim has neither ("Fontconfig error: Cannot load default
# config file: File not found" in the logs — the watermark composite step
# was silently drawing zero glyphs because of this, not failing outright).
# Kept even though the watermark itself has moved to a pre-rendered PNG tile
# (see app/lib/watermark.ts) — cheap insurance for any other place sharp
# might rasterize text/SVG later, and this is the actual root cause the logs
# pointed at, so it stays fixed regardless of the watermark approach.
RUN apt-get update -y && apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
