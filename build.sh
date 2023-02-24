#!/bin/bash

# Compile the TypeScript code
tsc

# Minify the JavaScript code
for file in build/*.js; do
  # Minify
  ./node_modules/.bin/uglifyjs "$file" -o "$file"
done

# Copy the manifest file
cp manifest.json temp-manifest.json

# Copy assets
cp -r assets build

# Replace all references of '../build/popup.js' with '../popup.js' in the copied popup.html
sed -i 's/\.\.\/build\/popup.js/\.\.\/popup.js/g' build/assets/popup.html

# Modify Manifest
alias json=./node_modules/.bin/json
## Replace all references of 'build/' with './' in the copied manifest file
json -I -f temp-manifest.json -e 'function replace(obj) { 
    for (var prop in obj) {
        if (typeof obj[prop] === "string") {
            obj[prop] = obj[prop].replace(/build\//g, "./");
        } else if (typeof obj[prop] === "object") {
            replace(obj[prop]);
        }
    }
}; replace(this);'
## Replace local filesystem
json -I -f temp-manifest.json -e 'this.host_permissions = this.host_permissions.filter(p => p !== "file://*")'
## Create a modifyable copy for each browser
cp temp-manifest.json temp-manifest-chromium.json
cp temp-manifest.json temp-manifest-firefox.json
# For Chromium exclusively
## Delete browser specific settings
json -I -f temp-manifest-chromium.json -e 'delete this.browser_specific_settings;'
# For Firefox exclusively
## Needs to replace 'service_worker' with 'scripts'.
json -I -f temp-manifest-firefox.json -e 'this.scripts = ["./background.js"]; delete this.service_worker;'
json -I -f temp-manifest-firefox.json -e 'delete this.background;'


# Build zip
mkdir -p dist
rm -f dist/chromium.zip dist/firefox.zip
## For Chromium
cp temp-manifest-chromium.json build/manifest.json
cd build && zip -r ../dist.zip * && cd ..
mv dist.zip dist/chromium.zip
echo "> Built chromium package at 'dist/chromium.zip'"
## For Firefox
cp temp-manifest-firefox.json build/manifest.json
cd build && zip -r ../dist.zip * && cd ..
mv dist.zip dist/firefox.zip
echo "> Built firefox package at 'dist/firefox.zip'"

# Revert build directory to Chrome
# Since only Chrome can run live anyways
cp temp-manifest-chromium.json build/manifest.json

# Cleanup
rm -f temp-manifest.json temp-manifest-chromium.json temp-manifest-firefox.json

# Run Mozilla's Firefox Addons-Linter
echo "\n> Running Firefox Addons-Linter..."
./node_modules/.bin/addons-linter dist/firefox.zip --min-manifest-version 3 --max-manifest-version 3

# Report back
echo "\nBuild finished"
echo "> build/"
echo "> dist/chromium.zip"
echo "> dist/firefox.zip"
# TODO: Validate build
