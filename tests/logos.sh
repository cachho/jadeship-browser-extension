#!/bin/bash

# Test that public/agent_logos contains all agents mentioned in node_modules/cn-links/dist/models/Agent.js

# Path to the Agent.js file
AGENT_FILE="node_modules/cn-links/dist/models/Agent.js"
echo "Checking for missing logos..."

# Extract the list of agents from the Agent.js file
agents=$(grep -oP "(?<=')[^']+(?=')" "$AGENT_FILE" | tr '\n' ' ')

# Get the list of logo files in the public/agent_logos directory
logo_files=$(ls public/agent_logos | sed 's/_logo\.png//g' | tr '\n' ' ')

# Check if all agents have corresponding logo files
for agent in $agents; do
    # Skip agent "raw"
    if [ "$agent" == "raw" ]; then
        continue
    fi
    if [[ ! " $logo_files " =~ " $agent " ]]; then
        echo -e "\e[31mError: Missing logo for agent: $agent\e[0m"
        exit 1
    fi
done

echo -e "\e[32mAll agents have corresponding logos.\e[0m"
exit 0