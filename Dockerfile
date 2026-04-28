# syntax=docker/dockerfile:1.6

# ============================================================
# STAGE 1 — Build do frontend (Vite/React)
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Variável injetada em build-time pelo Vite (vite.config.ts)
ARG GEMINI_API_KEY=""
ENV GEMINI_API_KEY=$GEMINI_API_KEY

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ============================================================
# STAGE 2 — Servir os estáticos com nginx
# ============================================================
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
