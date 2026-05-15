# Requires PowerShell 5+ and Node.js installed
# Run with: powershell -ExecutionPolicy Bypass -File build.ps1

#######################################
# Compile to TypeScript Code
#######################################
Write-Host "> Running Webpack (production)..."
npx webpack --config webpack.prod.js
Write-Host ""

#######################################
# Copy public & modify public
#######################################
Copy-Item -Recurse -Force "public" "build"

#######################################
# Copy the manifest file
#######################################
Copy-Item "manifest.json" "temp-manifest.json"
Copy-Item "manifest-v2.json" "temp-manifest-v2.json"

#######################################
# Modify Manifest
#######################################
# Replace all 'build/' with './' in both manifest files
npx json -I -f temp-manifest-firefox.json -e 'this.background.scripts=["./js/background.js"]; delete this.service_worker;'
npx json -I -f temp-manifest-firefox.json -e 'delete this.background.service_worker;'

#######################################
# Create a modifiable manifest copy
#######################################
Copy-Item "temp-manifest.json" "temp-manifest-chromium.json"
Copy-Item "temp-manifest-v2.json" "temp-manifest-firefox.json"

#######################################
# For Chromium exclusively
#######################################
npx json -I -f temp-manifest-chromium.json -e 'delete this.browser_specific_settings;'

#######################################
# For Firefox exclusively
#######################################
npx json -I -f temp-manifest-firefox.json -e 'this.background.scripts = ["./js/background.js"]; delete this.service_worker;'
npx json -I -f temp-manifest-firefox.json -e 'delete this.background.service_worker;'

#######################################
# Build package .zip
#######################################
New-Item -ItemType Directory -Force -Path "dist" | Out-Null
Remove-Item -Force "dist/chromium.zip","dist/firefox.zip" -ErrorAction SilentlyContinue

# For Chromium
Copy-Item "temp-manifest-chromium.json" "build/manifest.json"
Push-Location "build"
Compress-Archive -Path * -DestinationPath "../dist.zip" -Force
Pop-Location
Move-Item "dist.zip" "dist/chromium.zip" -Force
Write-Host "> Built chromium package at 'dist/chromium.zip'"

# For Firefox
Copy-Item "temp-manifest-firefox.json" "build/manifest.json"
Push-Location "build"
Compress-Archive -Path * -DestinationPath "../dist.zip" -Force
Pop-Location
Move-Item "dist.zip" "dist/firefox.zip" -Force
Write-Host "> Built firefox package at 'dist/firefox.zip'"

#######################################
# Revert build directory to Chrome
#######################################
Copy-Item "temp-manifest-chromium.json" "build/manifest.json" -Force

#######################################
# Cleanup
#######################################
Remove-Item -Force "temp-manifest.json","temp-manifest-v2.json","temp-manifest-chromium.json","temp-manifest-firefox.json"

#######################################
# Report back
#######################################
Write-Host "`nBuild finished"
