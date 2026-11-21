#!/usr/bin/env bash
# Gestione dello stack di sviluppo BiblioStack interamente in Docker.
# Requisito unico sull'host: Docker con il plugin "docker compose".
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT/docker/compose.dev.yml"
ENV_FILE="$ROOT/docker/.env.dev"

compose() {
    local args=(-f "$COMPOSE_FILE")
    [[ -f "$ENV_FILE" ]] && args+=(--env-file "$ENV_FILE")
    docker compose "${args[@]}" "$@"
}

# Legge una variabile da docker/.env.dev con fallback al default
env_or_default() {
    local name="$1" default="$2" value=""
    [[ -f "$ENV_FILE" ]] && value="$(grep -E "^${name}=" "$ENV_FILE" | tail -n1 | cut -d= -f2- || true)"
    echo "${value:-$default}"
}

usage() {
    cat <<EOF
Uso: ./bibliostack.sh <comando> [argomenti]

Avvio e arresto
  up              Costruisce le immagini e avvia tutto in background
  down            Ferma e rimuove i container (i dati del DB restano)
  restart [svc]   Riavvia tutti i servizi o solo quello indicato
  ps              Stato dei container
  logs [svc]      Segue i log (es. logs backend)

Dati
  seed            Carica i dati di esempio (solo su database vuoto)
  reset           CANCELLA il database, lo ricrea dagli script SQL e ricarica il seed

Strumenti
  smoke           Esegue uno smoke test delle API (login admin, catalogo, ruoli...)
  lint            ESLint sul frontend
  build           Build di produzione del frontend (verifica che compili)
  psql            Shell SQL sul database
  redis           redis-cli autenticato
  sh <svc>        Shell dentro un container (backend|frontend|db|redis)
  npm <svc> ...   Esegue npm nel container (es. npm backend install pino)

Dopo "up":  frontend http://localhost:$(env_or_default FRONTEND_HOST_PORT 5173)
            backend  http://localhost:$(env_or_default BACKEND_HOST_PORT 5001)
EOF
}

wait_backend() {
    echo "⏳ Attendo che il backend risponda..."
    for _ in $(seq 1 60); do
        if compose exec -T backend node -e "fetch('http://localhost:5001/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
            echo "✅ Backend pronto"
            return 0
        fi
        sleep 2
    done
    echo "❌ Il backend non risponde: controlla './bibliostack.sh logs backend'" >&2
    return 1
}

cmd="${1:-help}"
shift || true

case "$cmd" in
    up)
        # -V ricrea i volumi anonimi di node_modules, così riflettono sempre le dipendenze dell'immagine
        compose up -d --build -V "$@"
        wait_backend
        echo
        echo "Frontend: http://localhost:$(env_or_default FRONTEND_HOST_PORT 5173)"
        echo "Backend:  http://localhost:$(env_or_default BACKEND_HOST_PORT 5001)"
        echo "Primo avvio? Esegui './bibliostack.sh seed' per i dati di esempio."
        ;;
    down)     compose down "$@" ;;
    restart)  compose restart "$@" ;;
    ps)       compose ps "$@" ;;
    logs)     compose logs -f --tail=200 "$@" ;;
    seed)
        compose exec -T backend node src/db/seed.js
        ;;
    reset)
        read -r -p "⚠️  Il database e Redis verranno cancellati. Continuare? [s/N] " answer
        [[ "$answer" =~ ^[sSyY]$ ]] || { echo "Annullato."; exit 0; }
        compose down -v
        compose up -d --build -V
        wait_backend
        compose exec -T backend node src/db/seed.js
        ;;
    smoke)
        compose exec -T backend node scripts/smoke-test.mjs
        ;;
    lint)     compose exec -T frontend npm run lint ;;
    build)    compose exec -T frontend npm run build ;;
    psql)
        compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
        ;;
    redis)    compose exec redis redis-cli ;;
    sh)
        svc="${1:?Specificare il servizio: backend|frontend|db|redis}"
        compose exec "$svc" sh
        ;;
    npm)
        svc="${1:?Specificare il servizio: backend|frontend}"; shift
        compose exec "$svc" npm "$@"
        ;;
    help|-h|--help) usage ;;
    *)
        echo "Comando sconosciuto: $cmd" >&2
        usage
        exit 1
        ;;
esac
