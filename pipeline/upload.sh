#!/usr/bin/env bash
# Upload a file to the media host and print its public URL.
# usage: TOTEM_TOKEN=... bash pipeline/upload.sh <local-file> <remote-key> [content-type]
#   remote keys: reels/YYYY-MM-DD-slug.mp4, carousels/YYYY-MM-DD-slug/slide-N.jpg, private/state/history.json
set -euo pipefail
: "${TOTEM_TOKEN:?set TOTEM_TOKEN}"
f="$1"; key="$2"
type="${3:-}"
if [ -z "$type" ]; then
  case "$f" in
    *.mp4) type=video/mp4 ;; *.jpg|*.jpeg) type=image/jpeg ;; *.png) type=image/png ;;
    *.json) type=application/json ;; *.md|*.txt) type=text/plain ;; *.tgz) type=application/gzip ;; *.mp3) type=audio/mpeg ;;
    *) type=application/octet-stream ;;
  esac
fi
for i in 1 2 3; do
  out=$(curl -sS -m 300 -X PUT -H "Authorization: Bearer $TOTEM_TOKEN" -H "Content-Type: $type" --data-binary @"$f" "https://totem-media.totem-astro.workers.dev/$key") && \
    echo "$out" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])" && exit 0
  sleep 3
done
echo "upload failed: $key" >&2; exit 1
