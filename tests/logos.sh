#!/bin/bash

# Test that public/agent_logos contains all agents listed in src/lib/cn-links/agents.ts

# Path to the internal agents source file
AGENT_FILE="src/lib/cn-links/agents.ts"
echo "Checking for missing logos..."

# Extract the list of agents from the agents array only (exclude agentsWithRaw)
agents=$(sed -n '/export const agents = \[/,/\] as const;/p' "$AGENT_FILE" | grep -oP '"[^"]+"' | tr -d '"' | tr '\n' ' ')
echo "Agents found in $AGENT_FILE: $agents"

# Get the list of logo files in the public/agent_logos directory
logo_files=$(ls public/agent_logos | sed -E 's/_logo\.(png)$//g' | tr '\n' ' ')

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