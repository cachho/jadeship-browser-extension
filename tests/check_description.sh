#!/bin/bash

# File path to the manifest.json file
MANIFEST_FILE="manifest.json"

# Function to check the description length
check_description_length() {
    # Extracting the description field from the manifest.json file using npx
    description=$(npx json description < "$MANIFEST_FILE")
    
    # Calculate the length of the description
    len=${#description}

    # Check if the description length is greater than 132 characters
    if [ "$len" -gt 132 ]; then
        echo $len characters
        echo -e "\e[31mError: The description field exceeds 132 characters.\e[0m"
        exit 1
    fi
}

# Run the check
check_description_length

echo -e "\e[32mThe description length is within the character limit.\e[0m"
exit 0