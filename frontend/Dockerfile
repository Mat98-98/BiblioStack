# Immagine del frontend BiblioStack.
#   target "dev" -> server di sviluppo Vite (usato da docker/compose.dev.yml)
FROM node:22-bookworm-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---------- sviluppo ----------
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 5173
# --host 0.0.0.0 è necessario perché Vite sia raggiungibile dall'esterno del container
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
