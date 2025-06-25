# Step 1: Build phase
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Run phase
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "start"]
