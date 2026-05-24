#!/bin/bash

# Maximum Chrome extension description length
MAX_DESCRIPTION_LENGTH=132

# Manifest files to validate
MANIFEST_FILES="manifest.json manifest-v2.json"

# Function to check the description length
check_description_length() {
    for manifest_file in $MANIFEST_FILES; do
        # Extracting the description field from the manifest file using npx
        description=$(npx json description < "$manifest_file")

        # Calculate the length of the description
        len=${#description}

        # Check if the description length is greater than the Chrome limit
        if [ "$len" -gt "$MAX_DESCRIPTION_LENGTH" ]; then
            echo "$manifest_file: $len characters"
            echo -e "\e[31mError: The description field exceeds $MAX_DESCRIPTION_LENGTH characters.\e[0m"
            exit 1
        fi
    done
}

# Run the check
check_description_length

echo -e "\e[32mThe description length is within the character limit.\e[0m"
exit 0