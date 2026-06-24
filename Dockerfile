# ── Stage 1: Build the React client ──
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package.json client/yarn.lock* client/package-lock.json* ./
RUN npm install --prefer-offline
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ──
FROM node:20-alpine

WORKDIR /app

# Install server deps
COPY server/package.json server/package-lock.json* server/yarn.lock* ./
RUN npm install --omit=dev --prefer-offline

# Copy server source
COPY server/ ./

# Copy the built client from stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Create uploads directory (persistent via docker-compose volume)
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8080

ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads
ENV PORT=8080

CMD ["npm", "start"]
