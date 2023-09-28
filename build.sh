#!/bin/bash
#
# Build script for building the packages
# for Firefox and Chromium

#######################################
# General configuration
#######################################
alias json=./node_modules/.bin/json
alias addons-linter=./node_modules/.bin/addons-linter

#######################################
# Compile to TypeScript Code
#######################################
echo "> Running Webpack (production)..."
webpack --config webpack.prod.js
echo ""

#######################################
# Copy assets & modify assets
#######################################
cp -r assets build

# Replace all references of '../build/popup.js' with '../popup.js' in the copied popup.html
sed -i 's/\.\.\/build\/popup.js/\.\.\/popup.js/g' build/assets/popup.html

#######################################
# Copy the manifest file
# TODO: Manifest V2 is a firefox
# workaround 
# https://github.com/cachho/reparchive-browser-extension/issues/32
#######################################
cp manifest.json temp-manifest.json
cp manifest-v2.json temp-manifest-v2.json


#######################################
# Modify Manifest
#######################################

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

# Manifest V2
json -I -f temp-manifest-v2.json -e 'function replace(obj) { 
    for (var prop in obj) {
        if (typeof obj[prop] === "string") {
            obj[prop] = obj[prop].replace(/build\//g, "./");
        } else if (typeof obj[prop] === "object") {
            replace(obj[prop]);
        }
    }
}; replace(this);'

#######################################
# Create a modifyable manifest copy
# for each browser
#######################################
cp temp-manifest.json temp-manifest-chromium.json
cp temp-manifest-v2.json temp-manifest-firefox.json

#######################################
# For Chromium exclusively
#######################################
# Delete browser specific settings
json -I -f temp-manifest-chromium.json -e 'delete this.browser_specific_settings;'

#######################################
# For Firefox exclusively
#######################################
# Replace 'service_worker' with 'scripts'.
json -I -f temp-manifest-firefox.json -e 'this.background.scripts = ["./js/background.js"]; delete this.service_worker;'
json -I -f temp-manifest-firefox.json -e 'delete this.background.service_worker;'


#######################################
# Build package .zip
#######################################
# Create target dir
mkdir -p dist
# Cleanup
rm -f dist/chromium.zip dist/firefox.zip

# For Chromium
## Copy browser specific manifest
cp temp-manifest-chromium.json build/manifest.json
## Build zip
cd build && zip -r ../dist.zip * && cd ..
## Move temporary zip to distribution folder
mv dist.zip dist/chromium.zip
echo "> Built chromium package at 'dist/chromium.zip'"

# For Firefox
## Copy browser specific manifest
cp temp-manifest-firefox.json build/manifest.json
## Build zip
cd build && zip -r ../dist.zip * && cd ..
## Move temporary zip to distribution folder
mv dist.zip dist/firefox.zip
echo "> Built firefox package at 'dist/firefox.zip'"

#######################################
# Revert build directory to Chrome
# Since only Chrome can run live anyways
#######################################
cp temp-manifest-chromium.json build/manifest.json

#######################################
# Cleanup
#######################################
rm -f temp-manifest.json temp-manifest-v2.json 
rm -f  temp-manifest-chromium.json temp-manifest-firefox.json

#######################################
# Run Mozilla's Firefox Addons-Linter
#######################################
echo "\n> Running Firefox Addons-Linter..."
addons-linter dist/firefox.zip --min-manifest-version 2 --max-manifest-version 3

#######################################
# Report back
#######################################
echo "\nBuild finished"
echo "> build/"
echo "> dist/chromium.zip"
echo "> dist/firefox.zip"
find "dist" -type f -exec stat -c"%s %n" {} \; | awk '{size_in_kb = $1 / 1024; printf("%-10.2f KB %s\n", size_in_kb, $2)}'

# TODO: Validate build
