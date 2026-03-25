#!/bin/bash

echo "=========================================="
echo "OMTMS Phase 1 Demo Script"
echo "=========================================="

BASE_URL="http://localhost:8080"

echo ""
echo "=== Step 1: Admin Login ==="
echo ""

LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq .

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
echo "Token extracted: ${TOKEN:0:50}..."

echo ""
echo "=== Step 2: Get All Movies (Empty) ==="
echo ""

curl -s $BASE_URL/api/movies \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=== Step 3: Add Movie - Inception ==="
echo ""

curl -s -X POST $BASE_URL/api/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","genre":"Sci-Fi","duration":148,"rating":8.8}' | jq .

echo ""
echo "=== Step 4: Add Movie - Avatar ==="
echo ""

curl -s -X POST $BASE_URL/api/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Avatar","genre":"Action","duration":162,"rating":7.9}' | jq .

echo ""
echo "=== Step 5: Get All Theaters (Empty) ==="
echo ""

curl -s $BASE_URL/api/theaters \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=== Step 6: Add Theater - Screen 1 ==="
echo ""

curl -s -X POST $BASE_URL/api/theaters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Screen 1","location":"City Mall","capacity":100}' | jq .

echo ""
echo "=== Step 7: Add Theater - Premium Hall ==="
echo ""

curl -s -X POST $BASE_URL/api/theaters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Premium Hall","location":" Downtown","capacity":50}' | jq .

echo ""
echo "=== Step 8: List All Movies ==="
echo ""

curl -s $BASE_URL/api/movies \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=== Step 9: List All Theaters ==="
echo ""

curl -s $BASE_URL/api/theaters \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=========================================="
echo "Demo Complete!"
echo "=========================================="
