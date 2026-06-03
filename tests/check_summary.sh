#!/bin/bash

# Maximum Firefox extension summary length
MAX_SUMMARY_LENGTH=250

# Manifest files to validate
MANIFEST_FILES="manifest.json manifest-v2.json"

# Function to check the summary (description) length
check_summary_length() {
    for manifest_file in $MANIFEST_FILES; do
        # Extracting the description field from the manifest file using npx
        description=$(npx json description < "$manifest_file")

        # Calculate the length of the description
        len=${#description}

        # Check if the description length is greater than the Firefox summary limit
        if [ "$len" -gt "$MAX_SUMMARY_LENGTH" ]; then
            echo "$manifest_file: $len characters"
            echo -e "\e[31mError: The description field exceeds $MAX_SUMMARY_LENGTH characters (Firefox summary limit).\e[0m"
            exit 1
        fi
    done
}

# Run the check
check_summary_length

echo -e "\e[32mThe summary length is within the character limit.\e[0m"
exit 0
