#!/bin/bash

echo "Creating test accounts..."

# Admin
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omtms.com","password":"admin123","name":"Admin User","role":"ADMIN"}'
echo ""

# Show Manager
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"showmanager@omtms.com","password":"show123","name":"Show Manager","role":"SHOWMANAGER"}'
echo ""

# Counter Staff
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"counter@omtms.com","password":"counter123","name":"Counter Staff","role":"COUNTER_STAFF"}'
echo ""

# Gate Staff
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"gate@omtms.com","password":"gate123","name":"Gate Staff","role":"GATESTAFF"}'
echo ""

# Customer
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@omtms.com","password":"customer123","name":"Test Customer","role":"CUSTOMER"}'
echo ""

echo "All test accounts created!"