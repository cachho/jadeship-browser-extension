#!/bin/sh

echo "> dist/chromium.zip"
echo "> dist/firefox.zip"
find "dist" -type f -exec stat -c"%s %n" {} \; | awk '{size_in_kb = $1 / 1024; printf("%-10.2f KB %s\n", size_in_kb, $2)}'
