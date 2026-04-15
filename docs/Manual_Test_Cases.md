# OMTMS - Manual Test Cases

## 1. Authentication Tests

### TC-01: User Login - Valid Credentials
- **Description**: Test successful login with valid credentials
- **Precondition**: User exists in database
- **Test Data**: Email: admin@omtms.com, Password: admin123
- **Expected Result**: Login successful, redirect to dashboard
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-02: User Login - Invalid Credentials
- **Description**: Test login with wrong password
- **Test Data**: Email: admin@omtms.com, Password: wrongpass
- **Expected Result**: Error message "Invalid credentials"
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-03: User Registration - New User
- **Description**: Test registration with new email
- **Test Data**: Email: newuser@test.com, Password: test123, Name: Test User
- **Expected Result**: Registration successful, auto-login
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-04: User Registration - Duplicate Email
- **Description**: Test registration with existing email
- **Test Data**: Email: admin@omtms.com, Password: test123
- **Expected Result**: Error message "Email already exists"
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 2. Movie Management Tests (Admin)

### TC-05: View All Movies
- **Description**: Test viewing movie list
- **Expected Result**: Display all movies in database
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-06: Add New Movie
- **Description**: Test adding new movie
- **Test Data**: Title: Test Movie, Genre: Action, Duration: 120
- **Expected Result**: Movie added successfully
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-07: Update Movie
- **Description**: Test updating existing movie
- **Expected Result**: Movie details updated
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-08: Delete Movie
- **Description**: Test deleting a movie
- **Expected Result**: Movie removed from database
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 3. Theater Management Tests (Admin)

### TC-09: View All Theaters
- **Description**: Test viewing theater list
- **Expected Result**: Display all theaters
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-10: Add New Theater
- **Description**: Test adding new theater
- **Test Data**: Name: Test Theater, Location: Downtown, Capacity: 100
- **Expected Result**: Theater added successfully
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 4. Show Management Tests

### TC-11: View All Shows
- **Description**: Test viewing show list
- **Expected Result**: Display all shows
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-12: Create New Show (Admin/Show Manager)
- **Description**: Test scheduling a new show
- **Test Data**: Movie, Theater, Time, Price
- **Expected Result**: Show created successfully
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-13: Get Seat Availability
- **Description**: Test viewing available seats for a show
- **Expected Result**: Display seat map with availability
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 5. Booking Tests (Customer)

### TC-14: Browse Movies
- **Description**: Test browsing movie catalog
- **Expected Result**: Display available movies
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-15: Select Show and Seats
- **Description**: Test seat selection
- **Expected Result**: Seats selectable, price calculated
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-16: Complete Booking
- **Description**: Test booking confirmation
- **Expected Result**: Booking created, QR code generated
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-17: View My Bookings
- **Description**: Test viewing user's bookings
- **Expected Result**: Display all user's bookings
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-18: Cancel Booking (>24 hours)
- **Description**: Test cancellation with 80% refund
- **Expected Result**: Booking cancelled, refund processed
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-19: Cancel Booking (4-24 hours)
- **Description**: Test cancellation with 50% refund
- **Expected Result**: 50% refund applied
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-20: Cancel Booking (<4 hours)
- **Description**: Test cancellation with 0% refund
- **Expected Result**: No refund, booking cancelled
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 6. Loyalty Program Tests

### TC-21: View Loyalty Points
- **Description**: Test viewing loyalty information
- **Expected Result**: Display points, tier, benefits
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-22: Apply Tier Discount
- **Description**: Test automatic discount application
- **Test Data**: Customer with 200+ points booking
- **Expected Result**: 10% discount applied
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-23: Apply Bulk Discount
- **Description**: Test bulk booking discount
- **Test Data**: 5+ seats selected
- **Expected Result**: 10% bulk discount applied
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 7. Ticket Verification Tests (Gate Staff)

### TC-24: Verify Valid Ticket
- **Description**: Test ticket verification with valid code
- **Test Data**: Valid ticket code
- **Expected Result**: Ticket verified successfully
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-25: Verify Invalid Ticket
- **Description**: Test ticket verification with invalid code
- **Test Data**: Invalid ticket code
- **Expected Result**: Error message displayed
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 8. Report Tests (Admin/Show Manager)

### TC-26: View Summary Report
- **Description**: Test viewing summary dashboard
- **Expected Result**: Display summary statistics
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-27: View Booking Report
- **Description**: Test viewing booking details
- **Expected Result**: Display booking statistics
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-28: View Movie Report
- **Description**: Test viewing movie performance
- **Expected Result**: Display movie statistics
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

## 9. Role-Based Access Control Tests

### TC-29: Admin Access
- **Description**: Test admin has full access
- **Expected Result**: All features accessible
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-30: Customer Access
- **Description**: Test customer has limited access
- **Expected Result**: Only customer features accessible
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

### TC-31: Gate Staff Access
- **Description**: Test gate staff access
- **Expected Result**: Only ticket verification accessible
- **Status**: ☐ Not Tested ☐ Pass ☐ Fail

---

## Test Execution Summary

| Category | Total | Passed | Failed | Not Tested |
|----------|-------|--------|--------|------------|
| Authentication | 4 | | | 4 |
| Movie Management | 4 | | | 4 |
| Theater Management | 2 | | | 2 |
| Show Management | 3 | | | 3 |
| Booking | 7 | | | 7 |
| Loyalty Program | 3 | | | 3 |
| Ticket Verification | 2 | | | 2 |
| Reports | 3 | | | 3 |
| RBAC | 3 | | | 3 |
| **Total** | **31** | | | **31** |

## Sign-Off

- **Tester Name**: 
- **Date**: 
- **Signature**: