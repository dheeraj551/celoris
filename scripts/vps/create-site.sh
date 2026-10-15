#!/usr/bin/env bash

echo "=== Attempting to create site ananyajairath ==="
docker exec celoris-wordpress wp site create --slug="ananyajairath" --title="Ananya Jairath" --allow-root --debug

echo ""
echo "=== Current Site List ==="
docker exec celoris-wordpress wp site list --allow-root
