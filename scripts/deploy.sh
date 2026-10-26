
#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:?Usage: deploy.sh momentum:<image-tag>}"
APP="momentum-demo"
HOST_IP="${MOMENTUM_HOST_IP:-10.176.234.135}"
PORT="8081"
PREVIOUS_IMAGE=""

# Make sure the new Docker image exists.
docker image inspect "$IMAGE" >/dev/null

# Remember the currently deployed image.
if docker container inspect "$APP" >/dev/null 2>&1; then
    PREVIOUS_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$APP")"
fi

health_check() {
    for attempt in {1..10}; do
        if curl -fsS --max-time 3 -o /dev/null "http://${HOST_IP}:${PORT}/" &&
           curl -fsS --max-time 3 -o /dev/null "http://${HOST_IP}:${PORT}/quote"; then
            return 0
        fi
        sleep 2
    done
    return 1
}

start_app() {
    docker run -d \
        --name "$APP" \
        --restart unless-stopped \
        -p "${HOST_IP}:${PORT}:80" \
        "$1"
}

echo "Deploying $IMAGE"
echo "Previous image: ${PREVIOUS_IMAGE:-none}"

# Stop and replace only the Momentum container.
docker rm -f "$APP" >/dev/null 2>&1 || true

if start_app "$IMAGE"; then
    if [[ "${SIMULATE_FAILURE:-false}" != "true" ]] && health_check; then
        echo "Deployment healthy: $IMAGE"
        exit 0
    fi
fi

# Deployment failed: restore the previous image.
echo "Deployment failed. Starting rollback..."
docker rm -f "$APP" >/dev/null 2>&1 || true

if [[ -n "$PREVIOUS_IMAGE" ]]; then
    if start_app "$PREVIOUS_IMAGE" && health_check; then
        echo "Rollback successful: $PREVIOUS_IMAGE"
    else
        echo "URGENT: Rollback failed. Check Docker logs." >&2
    fi
else
    echo "No previous image available for rollback." >&2
fi

exit 1
