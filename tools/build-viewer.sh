#!/usr/bin/env bash
# Bundles src/viewer.js (which imports three) into assets/3d/viewer.js.
# The SITE has no build step: this runs by hand when viewer.js changes, and the
# bundled output is committed. Nothing at serve time depends on node.
set -euo pipefail
cd "$(dirname "$0")/.."
npx --yes esbuild src/viewer.js \
  --bundle --format=esm --minify --target=es2020 \
  --outfile=assets/3d/viewer.js --log-level=warning
printf 'viewer.js  raw %s  gz %s\n' \
  "$(wc -c < assets/3d/viewer.js)" "$(gzip -9 -c assets/3d/viewer.js | wc -c)"
