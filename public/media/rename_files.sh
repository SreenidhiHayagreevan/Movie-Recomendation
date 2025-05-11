#!/bin/bash

# Loop through all the image files in the current directory
for file in *.jpg; do
  # Remove the year in parentheses, convert to lowercase and replace underscores with spaces
  new_name=$(echo "$file" | sed -E 's/\([0-9]{4}\)//g' | tr '[:upper:]' '[:lower:]' |  tr -d ' ')
  mv "$file" "$new_name"
done

