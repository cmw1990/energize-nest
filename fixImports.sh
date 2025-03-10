#!/bin/bash

echo "Fixing files in care-connector..."
find micro-frontends/care-connector/src -name "*.tsx" -type f | while read file; do
  echo "Processing $file"
  # Create a temp file
  tmp_file=$(mktemp)
  # Remove react-refresh import line
  grep -v "react-refresh/runtime" "$file" > "$tmp_file"
  # Replace the original file
  mv "$tmp_file" "$file"
done

echo "Fixing files in mission-fresh..."
find micro-frontends/mission-fresh/src -name "*.tsx" -type f | while read file; do
  echo "Processing $file"
  # Create a temp file
  tmp_file=$(mktemp)
  # Remove react-refresh import line
  grep -v "react-refresh/runtime" "$file" > "$tmp_file"
  # Replace the original file
  mv "$tmp_file" "$file"
done

echo "All files fixed! Now restart the servers." 