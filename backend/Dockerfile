# Immagine del backend BiblioStack.
#   target "dev"  -> usato da docker/compose.dev.yml (nodemon + sorgenti montati)
#   target "prod" -> immagine autonoma con le sole dipendenze di produzione
FROM node:22-bookworm-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---------- sviluppo ----------
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci
# I sorgenti vengono montati come volume dal compose; questa copia serve solo se l'immagine viene avviata da sola
COPY . .
EXPOSE 5001
# -L (legacy watch / polling) rende affidabile il reload anche su Docker Desktop per macOS/Windows
CMD ["npx", "nodemon", "-L", "src/index.js"]

# ---------- produzione ----------
FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
USER node
EXPOSE 5001
CMD ["node", "src/index.js"]
