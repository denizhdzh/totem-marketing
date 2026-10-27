#!/usr/bin/env bash
# Prepare this repo for a run. The code comes from the repo itself (attached to the
# cloud environment), so nothing executable is downloaded from the media host.
# usage (from the repo root):  bash pipeline/bootstrap.sh
# TOTEM_TOKEN must be set as an environment secret (used only to fetch state files).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ node modules"
npm ci --no-fund --no-audit --loglevel=error

echo "▸ headless chrome (Remotion's own installer)"
npx remotion browser ensure

echo "▸ python deps"
python3 -c "import numpy, PIL" 2>/dev/null || pip install --break-system-packages -q numpy pillow

echo "▸ state (data only)"
mkdir -p state
if [ -n "${TOTEM_TOKEN:-}" ]; then
  for f in history.json calendar.md; do
    curl -sSf -H "Authorization: Bearer $TOTEM_TOKEN" \
      "https://totem-media.totem-astro.workers.dev/private/state/$f" -o "state/$f" || echo "  ! could not fetch $f"
  done
else
  echo "  ! TOTEM_TOKEN not set: state files not fetched"
fi
echo "✓ ready in $(pwd)"
