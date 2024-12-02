#!/bin/sh

#######################################
# Compile to TypeScript Code
#######################################
echo "> Running Webpack (production)..."
npx webpack --config webpack.prod.js
echo ""

#######################################
# Copy public & modify public
#######################################
cp -r public build

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
npx json -I -f temp-manifest.json -e 'function replace(obj) { 
    for (var prop in obj) {
        if (typeof obj[prop] === "string") {
            obj[prop] = obj[prop].replace(/build\//g, "./");
        } else if (typeof obj[prop] === "object") {
            replace(obj[prop]);
        }
    }
}; replace(this);'

# Manifest V2
npx json -I -f temp-manifest-v2.json -e 'function replace(obj) { 
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
npx json -I -f temp-manifest-chromium.json -e 'delete this.browser_specific_settings;'

#######################################
# For Firefox exclusively
#######################################
# Replace 'service_worker' with 'scripts'.
npx json -I -f temp-manifest-firefox.json -e 'this.background.scripts = ["./js/background.js"]; delete this.service_worker;'
npx json -I -f temp-manifest-firefox.json -e 'delete this.background.service_worker;'

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
# Report back
#######################################
echo "\nBuild finished"
