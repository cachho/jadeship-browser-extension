#!/bin/sh

#######################################
# Run Mozilla's Firefox Addons-Linter
#######################################
echo "\n> Running Firefox Addons-Linter..."
npx addons-linter dist/firefox.zip --min-manifest-version 2 --max-manifest-version 3
