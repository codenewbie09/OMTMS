# OMTMS - Online Movie Ticketing Management System

## Phase 1 Demo Guide

### Prerequisites
1. PostgreSQL running on Docker (port 5432)
2. Application running on port 8080

### Quick Start

```bash
# 1. Start PostgreSQL
docker start $(docker ps -aq --filter ancestor=postgres)

# 2. Start the application
cd ~/projects/OMTMS
./gradlew bootRun
```

---

## Demo Options

### Option 1: Shell Script (Recommended)
```bash
chmod +x demo.sh
./demo.sh
```
This runs all API tests automatically and shows formatted output.

### Option 2: Insomnia Collection
1. Open Insomnia
2. Import `OMTMS_Phase1_insomnia.json`
3. Click "1. Login" to get token
4. Copy token from response to environment variable
5. Run other requests in order

### Option 3: Manual Testing

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'

# Get Movies
curl http://localhost:8080/api/movies \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add Movie
curl -X POST http://localhost:8080/api/movies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","genre":"Sci-Fi","duration":155,"rating":8.5}'

# Get Theaters
curl http://localhost:8080/api/theaters \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add Theater
curl -X POST http://localhost:8080/api/theaters \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Screen 1","location":"Mall","capacity":100}'
```

---

## Phase 1 Features

| Feature | Status |
|---------|--------|
| PostgreSQL Database | ✅ 9 tables |
| JWT Authentication | ✅ |
| Movie CRUD | ✅ |
| Theater CRUD | ✅ |
| Role-based Security | ✅ |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/movies | List movies |
| POST | /api/movies | Add movie |
| PUT | /api/movies/{id} | Update movie |
| DELETE | /api/movies/{id} | Delete movie |
| GET | /api/theaters | List theaters |
| POST | /api/theaters | Add theater |
| PUT | /api/theaters/{id} | Update theater |
| DELETE | /api/theaters/{id} | Delete theater |

---

## Test Credentials
- Email: `admin@test.com`
- Password: `password`
- Role: `ADMIN`
