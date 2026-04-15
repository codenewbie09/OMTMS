# OMTMS - Online Movie Ticket Booking and Multiplex Management System

A full-stack web application for managing movie ticketing operations in multiplex cinemas. Supports online booking, counter-based ticketing, seat management, QR code tickets, and comprehensive reporting.

## Project Overview

OMTMS automates the complete movie ticket booking workflow:
- Customers can browse movies, view showtimes, select seats, and book tickets online
- Counter staff can issue tickets for walk-in customers
- Show managers can schedule movies and manage pricing
- Administrators can manage movies, theaters, shows, and view reports

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0 (Java 21)
- **Build Tool:** Gradle
- **Database:** PostgreSQL (Docker container)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Spring Security 6.2

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Build Tool:** Vite

## Project Structure

```
OMTMS/
├── src/main/java/com/omtms/
│   ├── config/          # Security, CORS configuration
│   ├── controller/      # REST API controllers
│   ├── service/         # Business logic
│   ├── repository/      # Data access (JPA)
│   ├── entity/          # Database entities
│   ├── dto/             # Data transfer objects
│   ├── security/        # JWT authentication
│   └── exception/       # Exception handling
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Dashboard pages
│   │   ├── services/   # API service layer
│   │   ├── context/    # Auth context
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Features Implemented (SRS Compliant)

### FR-1: Movie and Show Management
- Add/manage cinema halls with seat categories (Balcony, Premium, Ordinary)
- Define capacity and pricing per category
- Schedule movies with show timings
- Modify or cancel scheduled shows

### FR-2: Seat Booking (Online and Counter)
- Search available movies and shows
- Graphical seat map (available, booked, blocked)
- Select seats and proceed to booking
- Generate unique Booking ID
- Real-time seat synchronization

### FR-3: Ticket Generation and Verification
- Electronic tickets with Booking ID, Movie Name, Show Time, Hall, Seats
- QR Code generation for each ticket
- Gate staff ticket verification via QR scan

### FR-4: Booking Cancellation and Refund
- Cancel bookings before show time
- Time-based refund policy:
  - >24 hours before: 80% refund
  - 4-24 hours: 50% refund
  - <4 hours: 0% refund

### FR-5: Discounts and Pricing
- Category-based pricing (Balcony, Premium, Ordinary)
- Bulk discount: 10% off for 5+ tickets
- Loyalty program with tiers:
  - Silver (100+ points): 5% discount
  - Gold (200+ points): 10% discount
  - Platinum (500+ points): 15% discount

### FR-6: Reporting
- Daily/weekly occupancy reports
- Revenue reports by movie, hall, seat type
- Customer purchase history for loyalty analysis
- Summary dashboard

### FR-7: Administration
- Block specific seats (VIP, maintenance)
- Role-based access control (5 roles)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/movies | List all movies |
| GET | /api/movies/{id} | Get movie by ID |
| POST | /api/movies | Add new movie |
| PUT | /api/movies/{id} | Update movie |
| DELETE | /api/movies/{id} | Delete movie |

### Halls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/halls | List all halls |
| GET | /api/halls/{id} | Get hall by ID |
| POST | /api/halls | Add new hall |
| PUT | /api/halls/{id} | Update hall |
| DELETE | /api/halls/{id} | Delete hall |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/shows | List all shows |
| GET | /api/shows/{id} | Get show by ID |
| GET | /api/shows/movie/{id} | Shows by movie |
| GET | /api/shows/hall/{id} | Shows by hall |
| GET | /api/shows/{id}/seats | Get seat availability |
| POST | /api/shows | Create new show |
| PUT | /api/shows/{id} | Update show |
| DELETE | /api/shows/{id} | Delete show |

### Bookings (Note: endpoint is /api/booking)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/booking | List all bookings |
| GET | /api/booking/{id} | Get booking by ID |
| GET | /api/booking/customer/{id} | Customer bookings |
| POST | /api/booking | Create booking |
| PUT | /api/booking/{id}/status | Update status |
| POST | /api/booking/verify/{code} | Verify ticket |
| POST | /api/booking/cancel/{id} | Cancel booking |
| POST | /api/booking/refund/{id} | Process refund |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/summary | Summary report |
| GET | /api/reports/bookings | Booking report |
| GET | /api/reports/movies | Movie report |
| GET | /api/reports/theaters | Theater report |
| GET | /api/reports/shows | Show report |

### Customer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/customers/{id}/loyalty | Loyalty info |

## Running the Project

### Prerequisites
- Java 21
- PostgreSQL (Docker)
- Node.js 18+
- Gradle 8.5

### Quick Start

1. **Start PostgreSQL (Docker)**
```bash
docker run -d --name omtms-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=omtms -p 5432:5432 postgres
```

2. **Start Backend**
```bash
./gradlew build
java -jar build/libs/omtms-1.0.0.jar
```
Backend runs on `http://localhost:8080`

3. **Start Frontend**
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@omtms.com | admin123 |
| Show Manager | showmanager@omtms.com | admin123 |
| Counter Staff | counter@omtms.com | admin123 |
| Gate Staff | gate@omtms.com | admin123 |
| Customer | customer@omtms.com | admin123 |

## User Roles & Permissions

### ADMIN
- Manage movies, theaters, shows
- View all reports
- System configuration

### SHOWMANAGER
- Schedule movies
- Manage shows and pricing
- Verify tickets
- View reports

### COUNTER_STAFF
- Over-the-counter booking
- Search movies/shows

### GATESTAFF
- Verify tickets at entrance
- Scan QR codes

### CUSTOMER
- Browse movies and showtimes
- Book tickets online
- View booking history
- Cancel bookings
- Earn loyalty points

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                 │
│              (Vite + Tailwind CSS)               │
│         http://localhost:5173                   │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────┐
│              Spring Boot Backend                │
│               (Tomcat Server)                   │
│         http://localhost:8080                  │
│  ┌─────────────────────────────────────────┐   │
│  │  JWT Authentication + Role-Based Access  │   │
│  └─────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────┘
                     │ JPA/Hibernate
                     ▼
┌─────────────────────────────────────────────────┐
│              PostgreSQL Database                │
│             (Docker Container)                  │
└─────────────────────────────────────────────────┘
```

## SRS Compliance

All functional requirements from the SRS document have been implemented:

- ✅ FR-1.1 to FR-1.4: Movie and Show Management
- ✅ FR-2.1 to FR-2.6: Seat Booking
- ✅ FR-3.1 to FR-3.3: Ticket Generation and Verification
- ✅ FR-4.1 to FR-4.3: Cancellation and Refund
- ✅ FR-5.1 to FR-5.3: Discounts and Pricing
- ✅ FR-6.1 to FR-6.3: Reporting
- ✅ FR-7.1 to FR-7.2: Administration and RBAC

## Demo Flow

1. **Customer**: Login → Browse movies → Select show → Pick seats → Payment → View QR code
2. **Gate Staff**: Login → Enter ticket code → Verify ticket
3. **Admin**: Add movie → Add theater → Schedule show → View reports

## License

This project is developed as part of Software Engineering Lab assignment.
