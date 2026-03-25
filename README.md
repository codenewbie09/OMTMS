# OMTMS - Online Movie Ticketing Management System

## Project Overview

OMTMS is a backend system for managing movie ticketing operations. The system allows administrators to manage movies and theaters, while customers can view shows and book tickets.

This project implements Phase 1 of the development plan, which focuses on core infrastructure and basic CRUD operations.

## Technology Stack

- **Backend Framework:** Spring Boot 3.2 (Java 17)
- **Build Tool:** Gradle
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Spring Security

## Project Structure

```
OMTMS/
├── src/main/java/com/omtms/
│   ├── config/          # Security configuration
│   ├── controller/      # REST API controllers
│   ├── service/         # Business logic layer
│   ├── repository/      # Data access layer
│   ├── entity/          # JPA entity classes
│   ├── dto/             # Data transfer objects
│   └── security/        # JWT authentication
├── src/main/resources/
│   └── application.yml
├── build.gradle
└── README.md
```

## Database Schema

The system uses 9 tables:

1. **users** - Base user table with authentication info
2. **customer** - Customer profile linked to users
3. **admin** - Admin profile linked to users
4. **movie** - Movie information (title, genre, duration, rating)
5. **theater** - Theater details (name, location, capacity)
6. **show** - Show timings linked to movie and theater
7. **seat** - Seats available in each theater
8. **booking** - Ticket bookings
9. **payment** - Payment records

## Implemented Features (Phase 1)

### Authentication
- User registration (Admin/Customer)
- Login with JWT token generation
- Role-based access control

### Movie Management (Admin only)
- Create new movies
- View all movies
- View single movie by ID
- Update movie details
- Delete movies

### Theater Management (Admin only)
- Create new theaters
- View all theaters
- View single theater by ID
- Update theater details
- Delete theaters

### Seat Management
- View seats for a specific theater

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

### Theaters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/theaters | List all theaters |
| GET | /api/theaters/{id} | Get theater by ID |
| POST | /api/theaters | Add new theater |
| PUT | /api/theaters/{id} | Update theater |
| DELETE | /api/theaters/{id} | Delete theater |
| GET | /api/theaters/{id}/seats | View theater seats |

## Running the Project

### Prerequisites
- Java 17 or higher
- PostgreSQL database
- Gradle

### Setup

1. Create a PostgreSQL database named `omtms`:
```sql
CREATE DATABASE omtms;
```

2. Update database credentials in `src/main/resources/application.yml` if needed.

3. Build and run the application:
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

### Testing the APIs

Use the demo script to test all endpoints:
```bash
./demo.sh
```

Or test manually:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'

# Get Movies (use token from login)
curl http://localhost:8080/api/movies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Credentials

- Email: admin@test.com
- Password: password
- Role: ADMIN

## Future Phases

- Phase 2: Show scheduling, seat selection, booking flow
- Phase 3: Payment processing, reports, notifications

## Documentation

Additional documentation files are included in the project:
- SRS_document.pdf - System Requirements Specification
- usecase_document.pdf - Use Case Documentation
- Class_Diagram_Group30.png - Class Diagram
- DFD_Group30/ - Data Flow Diagrams
- Seq_usecase*.png - Sequence Diagrams
