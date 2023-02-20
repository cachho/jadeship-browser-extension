#!/bin/bash

# Compile the TypeScript code
tsc

# Minify the JavaScript code
for file in build/*.js; do
  # Minify
  ./node_modules/.bin/uglifyjs "$file" -o "$file"
done

# Copy the manifest file
cp manifest.json build/manifest.json

# Copy assets
cp -r assets build

# Replace all references of 'build/' with './' in the copied manifest file
sed -i 's/build\//.\//g' build/manifest.json
# Replace all references of '../build/popup.js' with '../popup.js' in the copied popup.html
sed -i 's/\.\.\/build\/popup.js/\.\.\/popup.js/g' build/assets/popup.html
# Replace local filesystem in manifest.json
sed -i 's/, "file:\/\/\*"/ /g' build/manifest.json

# Build zip
mkdir -p dist
rm -f dist/chromium.zip dist/firefox.zip
## For Chromium
cd build && zip -r ../dist.zip * && cd ..
mv dist.zip dist/chromium.zip
echo "> Built chromium package at 'build/chromium.zip'"
## For Firefox
### Needs to replace 'service_worker' with 'scripts'.
sed -i 's/\"service_worker\": \".\/background.js\"/\"scripts\": [\".\/background.js\"]/g' build/manifest.json
cd build && zip -r ../dist.zip * && cd ..
mv dist.zip dist/firefox.zip
echo "> Built firefox package at 'build/chromium.zip'"
### Replace back
# sed -i 's/scripts/service_workers/g' build/manifest.json

# Run Mozilla's Firefox Addons-Linter
./node_modules/.bin/addons-linter dist/firefox.zip --min-manifest-version 3 --max-manifest-version 3

# Report back
echo "\nBuild finished"
echo "> build/"
echo "> dist/chromium.zip"
echo "> ddist/firefox.zip"
# TODO: Validate build
