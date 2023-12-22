#!/bin/bash

# Alias for the json tool, ensure it points to the correct installation path
alias json=./node_modules/.bin/json

# File path to the manifest.json file
MANIFEST_FILE="manifest.json"

# Function to check the description length
check_description_length() {
    # Extracting the description field from the manifest.json file
    description=$(json description < "$MANIFEST_FILE")
    
    # Calculate the length of the description
    len=${#description}

    # Check if the description length is greater than 132 characters
    if [ "$len" -gt 132 ]; then
        echo $len characters
        echo -e "\e[31mError: The description field exceeds 132 characters.\e[0m"
        exit 1
    else
        echo "Description length is within the limit."
    fi
}

# Run the check
check_description_length
