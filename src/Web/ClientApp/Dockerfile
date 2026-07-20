# Multi-stage Dockerfile for React 19 + Vite Frontend (Bun runtime)
# Context: src/Web/ClientApp

# Stage 1: Build React static assets with Bun
FROM oven/bun:1-alpine AS build
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Serve with Nginx Alpine
FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
