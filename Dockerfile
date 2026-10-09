# Step 1: Build phase
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Run phase
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed to run: build output, deps, static assets.
# (next.config.ts is included: headers/redirects are evaluated at runtime.)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Drop root: a compromised app process should not own the container.
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["npm", "start"]
