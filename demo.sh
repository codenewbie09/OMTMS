#!/bin/bash

echo "=========================================="
echo "OMTMS Demo Script - Full Feature Walkthrough"
echo "=========================================="

BASE_URL="http://localhost:8080"

echo ""
echo "=========================================="
echo "STEP 1: Admin Login"
echo "=========================================="

ADMIN_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omtms.com","password":"admin123"}')

echo "Admin login response:"
echo "$ADMIN_LOGIN" | jq '{token: .token, role: .role, userId: .userId}' 2>/dev/null || echo "$ADMIN_LOGIN"

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.token')

echo ""
echo "=========================================="
echo "STEP 2: Movie Management (FR-1.1)"
echo "=========================================="

echo "Get all movies:"
curl -s $BASE_URL/api/movies -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo ""
echo "Add new movie:"
curl -s -X POST $BASE_URL/api/movies \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Interstellar","genre":"Sci-Fi","duration":169,"releaseDate":"2024-11-06","rating":8.7}' | jq '.'

echo ""
echo "=========================================="
echo "STEP 3: Theater Management (FR-1.1)"
echo "=========================================="

echo "Get all theaters:"
curl -s $BASE_URL/api/theaters -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo ""
echo "Add new theater:"
curl -s -X POST $BASE_URL/api/theaters \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"IMAX Hall","balconyCapacity":20,"premiumCapacity":30,"ordinaryCapacity":50,"balconyPrice":600,"premiumPrice":400,"ordinaryPrice":250}' | jq '.'

echo ""
echo "=========================================="
echo "STEP 4: Show Scheduling (FR-1.3)"
echo "=========================================="

echo "Create a show:"
curl -s -X POST $BASE_URL/api/shows \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":1,"theaterId":1,"price":200,"startTime":"15:00"}' | jq '.'

echo ""
echo "Get all shows:"
curl -s $BASE_URL/api/shows -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo ""
echo "=========================================="
echo "STEP 5: Customer Login & Booking (FR-2)"
echo "=========================================="

CUST_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@omtms.com","password":"customer123"}')

echo "Customer login:"
echo "$CUST_LOGIN" | jq '{token: .token, role: .role, customerId: .customerId}' 2>/dev/null

CUST_TOKEN=$(echo "$CUST_LOGIN" | jq -r '.token')
CUST_ID=$(echo "$CUST_LOGIN" | jq -r '.customerId')

echo ""
echo "Get available seats for show 1:"
curl -s $BASE_URL/api/shows/1/seats -H "Authorization: Bearer $CUST_TOKEN" | jq '.[:5]'

echo ""
echo "Book 2 seats (FR-2.3):"
curl -s -X POST $BASE_URL/api/booking \
  -H "Authorization: Bearer $CUST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"customerId\":$CUST_ID,\"showId\":1,\"seatIds\":[7,8],\"paymentMethod\":\"CARD\",\"paymentStatus\":\"SUCCESS\"}" | jq '{bookingId, ticketCode, totalAmount, status}'

echo ""
echo "=========================================="
echo "STEP 6: Bulk Discount Test (FR-5.2)"
echo "=========================================="

echo "Book 5 seats (should get 10% bulk discount):"
curl -s -X POST $BASE_URL/api/booking \
  -H "Authorization: Bearer $CUST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"customerId\":$CUST_ID,\"showId\":1,\"seatIds\":[11,12,13,14,15],\"paymentMethod\":\"CARD\",\"paymentStatus\":\"SUCCESS\"}" | jq '{bookingId, totalAmount, discountAmount, status}'

echo ""
echo "=========================================="
echo "STEP 7: Ticket Verification (FR-3.3)"
echo "=========================================="

echo "Verify ticket at gate:"
curl -s -X POST $BASE_URL/api/booking/verify/TKT-63AAEB98 \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '{bookingId, status, ticketCode}'

echo ""
echo "=========================================="
echo "STEP 8: Cancellation & Refund (FR-4)"
echo "=========================================="

echo "Cancel booking (booking ID 8):"
curl -s -X POST $BASE_URL/api/booking/cancel/8 \
  -H "Authorization: Bearer $CUST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Customer requested cancellation"}' | jq '{bookingId, status, refundAmount}'

echo ""
echo "=========================================="
echo "STEP 9: Reports (FR-6)"
echo "=========================================="

echo "Summary Report:"
curl -s $BASE_URL/api/reports/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo ""
echo "Booking Report:"
curl -s $BASE_URL/api/reports/bookings \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data.totalBookings, .data.totalRevenue'

echo ""
echo "=========================================="
echo "STEP 10: Loyalty Program (FR-5.3)"
echo "=========================================="

echo "Get customer loyalty info:"
curl -s $BASE_URL/api/customers/$CUST_ID/loyalty \
  -H "Authorization: Bearer $CUST_TOKEN" | jq '{loyaltyPoints, purchaseCount, loyaltyTier, isLoyaltyMember}'

echo ""
echo "=========================================="
echo "DEMO COMPLETE!"
echo "=========================================="
echo ""
echo "Test Credentials:"
echo "  Admin:        admin@omtms.com / admin123"
echo "  Show Manager: showmanager@omtms.com / show123"
echo "  Counter:      counter@omtms.com / counter123"
echo "  Gate Staff:   gate@omtms.com / gate123"
echo "  Customer:     customer@omtms.com / customer123"
echo ""
echo "Frontend: http://localhost:5173"
echo ""
