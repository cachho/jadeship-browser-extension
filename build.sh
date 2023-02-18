#!/bin/bash

# Compile the TypeScript code
tsc

# Minify the JavaScript code
for file in dist/*.js; do
  # Minify
  ./node_modules/.bin/uglifyjs "$file" -o "$file"
done

# Copy the manifest file
cp manifest.json dist/manifest.json

# Copy assets
cp -r assets dist

# Replace all references of 'dist/' with './' in the copied manifest file
sed -i 's/dist\//.\//g' dist/manifest.json
# Replace all references of '../dist/popup.js' with '../popup.js' in the copied popup.html
sed -i 's/\.\.\/dist\/popup.js/\.\.\/popup.js/g' dist/assets/popup.html
# Replace local filesystem in manifest.json
sed -i 's/, "file:\/\/\*"/ /g' dist/manifest.json

# Build zip
rm dist/dist.zip
cd dist && zip -r ../dist.zip * && cd ..
mv dist.zip dist

# Report back
echo "\nBuild finished"
echo "> dist/"
echo "> dist/dist.zip"