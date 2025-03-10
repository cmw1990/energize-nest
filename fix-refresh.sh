#!/bin/bash

# Function to process a single file
process_file() {
  local file="$1"
  echo "Processing $file"
  
  # Create a temporary file
  local temp_file=$(mktemp)
  
  # Check if the file contains react-refresh imports and remove them if found
  if grep -q "react-refresh/runtime" "$file"; then
    grep -v "react-refresh/runtime" "$file" > "$temp_file"
    mv "$temp_file" "$file"
    echo "  Fixed react-refresh import in $file"
  else
    rm "$temp_file"
    echo "  No react-refresh import found in $file"
  fi
}

# Process all JavaScript and TypeScript files in both projects
echo "Scanning care-connector..."
find micro-frontends/care-connector/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read file; do
  process_file "$file"
done

echo "Scanning mission-fresh..."
find micro-frontends/mission-fresh/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read file; do
  process_file "$file"
done

echo "All files processed." 