#!/bin/bash
set -x

folder=$1
output_zip=$2

mkdir -p $(dirname "$output_zip")
output_zip=$(realpath "$output_zip")

cd "$folder"
zip -r $(basename "$output_zip") . -x "*.DS_Store" -x "__MACOSX/*"
mv $(basename "$output_zip") "$output_zip"
