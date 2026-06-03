#!/bin/bash
# verify-build.sh
#
# Downloads the published CRX from the Chrome Web Store and compares the
# SHA-256 hashes of its files against a local ZIP.
#
# Usage:   ./verify-build.sh [path/to/chromium.zip]
# Requires: curl, unzip, sha256sum, git

set -euo pipefail

EXTENSION_ID="gnpcmjhhhobmpeeekcfmficdfgnmncim"
DEFAULT_DIST_ZIP="dist/chromium.zip"

WORK_DIR=$(mktemp -d)
cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

CRX_FILE="$WORK_DIR/extension.crx"
EXTRACT_STORE="$WORK_DIR/from-store"
EXTRACT_LOCAL="$WORK_DIR/from-local"

echo "=== Build Verification ==="
echo ""
echo "This script compares the extension published on the Chrome Web Store"
echo "against a local ZIP. You can verify either:"
echo "  1. Your own build  — run 'npm run build' first, then use dist/chromium.zip"
echo "  2. A GitHub release — download chromium.zip from the Releases page and point to it"
echo ""
printf "Path to local ZIP \033[2m[default: %s]\033[0m: " "$DEFAULT_DIST_ZIP (presse enter)"
read -r input_path
DIST_ZIP="${input_path:-$DEFAULT_DIST_ZIP}"

echo ""
echo "Extension ID : $EXTENSION_ID"
echo "Local dist   : $DIST_ZIP"
echo ""
echo "NOTE: The following are intentionally excluded from the main comparison:"
echo "  - _metadata/  (added by Chrome after installation, not part of the build)"
echo "manifest.json is compared separately — the 'key' field added by the Chrome Web Store is expected."
echo ""

# ── 1. Check local dist exists ───────────────────────────────────────────────
if [ ! -f "$DIST_ZIP" ]; then
  echo "ERROR: '$DIST_ZIP' not found."
  exit 1
fi

# ── 2. Download CRX from Chrome Web Store ────────────────────────────────────
echo "> Downloading CRX from Chrome Web Store..."
curl -sL -A "Mozilla/5.0" -o "$CRX_FILE" \
  "https://clients2.google.com/service/update2/crx?response=redirect&prodversion=120.0.0.0&acceptformat=crx3&x=id%3D${EXTENSION_ID}%26installsource%3Dondemand%26uc"

if [ ! -s "$CRX_FILE" ]; then
  echo "ERROR: Downloaded CRX is empty. The extension may be unavailable or the ID is wrong."
  exit 1
fi

echo "  Downloaded $(wc -c < "$CRX_FILE") bytes"

# ── 3. Strip CRX header and extract ─────────────────────────────────────────
# CRX3 format: 4 bytes magic + 4 bytes version + 4 bytes header_size + <header_size> bytes proto
# The ZIP data starts at byte offset 12 + header_size.
echo "> Stripping CRX header..."
header_size=$(od -An -tu4 -j8 -N4 "$CRX_FILE" | tr -d ' \n')
zip_offset=$((12 + header_size))
dd if="$CRX_FILE" bs=1 skip="$zip_offset" of="$WORK_DIR/extension.zip" 2>/dev/null

echo "> Extracting files..."
mkdir -p "$EXTRACT_STORE" "$EXTRACT_LOCAL"
unzip -q "$WORK_DIR/extension.zip" -d "$EXTRACT_STORE"
unzip -q "$DIST_ZIP"               -d "$EXTRACT_LOCAL"

# ── 4. Hash all files in each directory (excluding manifest.json + _metadata) ─
echo "> Comparing file hashes..."
echo ""

declare -A STORE_HASHES
declare -A LOCAL_HASHES

while IFS= read -r -d '' file; do
  rel="${file#"$EXTRACT_STORE"/}"
  # Skip _metadata/ and manifest.json (handled separately)
  [[ "$rel" == _metadata/* || "$rel" == "manifest.json" ]] && continue
  STORE_HASHES["$rel"]=$(sha256sum "$file" | awk '{print $1}')
done < <(find "$EXTRACT_STORE" -type f -print0 | sort -z)

while IFS= read -r -d '' file; do
  rel="${file#"$EXTRACT_LOCAL"/}"
  [[ "$rel" == _metadata/* || "$rel" == "manifest.json" ]] && continue
  LOCAL_HASHES["$rel"]=$(sha256sum "$file" | awk '{print $1}')
done < <(find "$EXTRACT_LOCAL" -type f -print0 | sort -z)

# ── 5. Compare ───────────────────────────────────────────────────────────────
PASS=0
FAIL=0
ONLY_STORE=0
ONLY_LOCAL=0
MISMATCHED_KEYS=()

ALL_KEYS=()
for k in "${!STORE_HASHES[@]}" "${!LOCAL_HASHES[@]}"; do
  ALL_KEYS+=("$k")
done
mapfile -t SORTED_KEYS < <(printf '%s\n' "${ALL_KEYS[@]}" | sort -u)

for key in "${SORTED_KEYS[@]}"; do
  store_hash="${STORE_HASHES[$key]:-}"
  local_hash="${LOCAL_HASHES[$key]:-}"

  if [ -z "$store_hash" ]; then
    printf "  %-12s %s\n" "ONLY_LOCAL" "$key"
    ONLY_LOCAL=$((ONLY_LOCAL + 1))
  elif [ -z "$local_hash" ]; then
    printf "  %-12s %s\n" "ONLY_STORE" "$key"
    ONLY_STORE=$((ONLY_STORE + 1))
  elif [ "$store_hash" = "$local_hash" ]; then
    printf "  %-12s %s\n" "OK" "$key"
    PASS=$((PASS + 1))
  else
    printf "  \033[31m%-12s\033[0m %s\n" "MISMATCH" "$key"
    MISMATCHED_KEYS+=("$key")
    FAIL=$((FAIL + 1))
  fi
done

# ── 6. Summary ───────────────────────────────────────────────────────────────
echo ""
echo "=== Summary ==="
printf "  %-14s %d\n" "Matching:"   "$PASS"
printf "  %-14s %d\n" "Mismatched:" "$FAIL"
printf "  %-14s %d\n" "Only store:" "$ONLY_STORE"
printf "  %-14s %d\n" "Only local:" "$ONLY_LOCAL"
echo ""

if [ "$FAIL" -gt 0 ] || [ "$ONLY_STORE" -gt 0 ] || [ "$ONLY_LOCAL" -gt 0 ]; then
  echo "RESULT: SUSPICIOUS — differences detected (see above)"
else
  echo "RESULT: OK — published extension matches local build"
fi

# ── 7. Offer to review diffs ─────────────────────────────────────────────────
if [ "${#MISMATCHED_KEYS[@]}" -gt 0 ]; then
  echo ""
  printf "Review diffs for the %d mismatched file(s)? \033[2m[Y/n]\033[0m: " "${#MISMATCHED_KEYS[@]}"
  read -r review
  review="${review:-y}"
  if [[ "$review" =~ ^[Yy] ]]; then
    echo ""
    printf "\033[33mNOTE: Each diff will open in your pager. Press 'q' to close it and move to the next.\033[0m\n"
    printf "Press Enter to start..."
    read -r _
    for key in "${MISMATCHED_KEYS[@]}"; do
      echo ""
      echo "--- $key ---"
      store_file="$EXTRACT_STORE/$key"
      local_file="$EXTRACT_LOCAL/$key"
      # For JS files: format with biome first so the diff is line-by-line and readable
      # instead of one huge minified line.
      if [[ "$key" == *.js ]] && [ -x "./node_modules/.bin/biome" ]; then
        fmt_store="$WORK_DIR/fmt_store"
        fmt_local="$WORK_DIR/fmt_local"
        ./node_modules/.bin/biome format --stdin-file-path="$key" < "$store_file" > "$fmt_store" 2>/dev/null || cp "$store_file" "$fmt_store"
        ./node_modules/.bin/biome format --stdin-file-path="$key" < "$local_file" > "$fmt_local" 2>/dev/null || cp "$local_file" "$fmt_local"
        printf "\033[2m(formatted with biome for readability)\033[0m\n"
        git diff --no-index -U3 -- "$fmt_store" "$fmt_local" || true
      else
        # Fallback: character-level word-diff highlights exactly what changed
        git diff --no-index --word-diff=color --word-diff-regex='[A-Za-z0-9_$]+|[^A-Za-z0-9_$[:space:]]' --unified=0 -- \
          "$store_file" "$local_file" || true
      fi
    done
  fi
fi

# ── 8. Offer to review manifest.json diff ────────────────────────────────────
if [ -f "$EXTRACT_STORE/manifest.json" ] && [ -f "$EXTRACT_LOCAL/manifest.json" ]; then
  echo ""
  printf "Review the manifest.json diff? \033[2m[Y/n]\033[0m: "
  read -r review_manifest
  review_manifest="${review_manifest:-y}"
  if [[ "$review_manifest" =~ ^[Yy] ]]; then
    echo ""
    printf "\033[33mNOTE: The diff will open in your pager. Press 'q' to close it.\033[0m\n"
    printf "\033[33mThe Chrome Web Store injects an 'update_url' field into manifest.json.\033[0m\n"
    printf "\033[33mThe release action updates the version number.\033[0m\n"
    printf "\033[33mThese differences are expected and not suspicious.\033[0m\n"
    printf "Press Enter to open the diff..."
    read -r _
    echo ""
    echo "--- manifest.json ---"
    git diff --no-index --word-diff=color -- \
      "$EXTRACT_STORE/manifest.json" "$EXTRACT_LOCAL/manifest.json" || true
  fi
fi

if [ "$FAIL" -gt 0 ] || [ "$ONLY_STORE" -gt 0 ] || [ "$ONLY_LOCAL" -gt 0 ]; then
  exit 1
fi
