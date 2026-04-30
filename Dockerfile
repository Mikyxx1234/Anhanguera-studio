# syntax=docker/dockerfile:1.6

# ============================================================
# STAGE 1 — Build do frontend (Vite/React)
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Variáveis injetadas em build-time pelo Vite.
# Tudo que tem prefixo VITE_ é embutido no bundle final via import.meta.env.
# GEMINI_API_KEY é injetada via define() no vite.config.ts (process.env).
ARG GEMINI_API_KEY=""
ARG VITE_SITE_URL=""
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""

ENV GEMINI_API_KEY=$GEMINI_API_KEY \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

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
