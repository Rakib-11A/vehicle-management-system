## Project Name: Vehicle Rental System API

## Live URL: https://vehicle-rental-system-two-tau.vercel.app/

## Author: Md. Rakib Hasan

A robust RESTful API for managing vehicle rentals with role-based access control, built with Express.js and TypeScript.

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin & Customer)
- Secure password hashing with bcrypt
- Protected routes with middleware

### User Management

- User registration and login
- Profile management (update own profile)
- Admin can manage all users
- User deletion with active booking validation

### Vehicle Management

- CRUD operations for vehicles
- Vehicle availability tracking
- Vehicle type validation (car, bike, van, SUV)
- Vehicle deletion with active booking validation

### Booking Management

- Create bookings with automatic price calculation
- Role-based booking views (Admin sees all, Customer sees own)
- Booking status management (active, cancelled, returned)
- Automatic vehicle status updates
- Date validation and conflict prevention

### Business Rules

- Customers can only cancel bookings before start date
- Admins can mark bookings as returned
- Automatic vehicle availability updates
- Prevents deletion of users/vehicles with active bookings

##  Technology Stack

### Backend

- Runtime: Node.js
- Framework: Express.js 5.x
- Language: TypeScript 5.9
- Database: PostgreSQL
- ORM/Query: pg (node-postgres)

### Security & Authentication

- JWT: jsonwebtoken
- Password Hashing: bcrypt

### Development Tools

- TypeScript: Type-safe development
- Nodemon: Auto-reload during development
- ts-node: TypeScript execution
- dotenv: Environment variable management

### Architecture

- Pattern: MVC (Model-View-Controller)
- Error Handling: Centralized error middleware
- Async Handling: Custom async handler wrapper

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup & Installation

### 1. Clone the Repository
git clone <repository-url>
cd "Vehicle Rental System"


### 2. Install Dependencies
npm install


### 3. Environment Configuration

Create a .env file in the root directory:

env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d


### 4. Database Setup

The application automatically creates required tables on first run. Ensure PostgreSQL is running and the database exists:

CREATE DATABASE vehicle_rental_db;


### 5. Run the Application

Development Mode:
npm run dev

Production Mode:
npm run build
npm start


The server will start on http://localhost:5000 (or your configured PORT).

## API Endpoints

### Authentication

POST /api/v1/auth/signup - Register new user
POST /api/v1/auth/signin - User login

### Users

GET /api/v1/users - Get all users (Admin only)
GET /api/v1/users/:userId - Get user by ID
PUT /api/v1/users/:userId - Update user (Admin or Own)
DELETE /api/v1/users/:userId - Delete user (Admin only, no active bookings)

### Vehicles

POST /api/v1/vehicles - Create vehicle (Admin only)
GET /api/v1/vehicles - Get all vehicles
GET /api/v1/vehicles/:id - Get vehicle by ID
PUT /api/v1/vehicles/:id - Update vehicle (Admin only)
DELETE /api/v1/vehicles/:id - Delete vehicle (Admin only, no active bookings)

### Bookings

POST /api/v1/bookings - Create booking (Customer or Admin)
GET /api/v1/bookings - Get bookings (Role-based: Admin sees all, Customer sees own)
PUT /api/v1/bookings/:bookingId - Update booking status (Role-based)

##  Project Structure


src/
    config/          --> Configuration files (database, env, constants)
    controllers/     --> Request handlers
    interfaces/      --> TypeScript interfaces
    middlewares/     --> Custom middleware (auth, error, role)
    routes/          --> API route definitions
    services/        --> Business logic
    types/           --> Type definitions
    utils/           --> Utility functions (JWT, password, async handler)
    app.ts           --> Express app configuration
    server.ts        --> Server entry point


## Authentication

All protected endpoints require a JWT token in the Authorization header:

Authorization: Bearer <jwt_token>


## Example Requests

### Register User


POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}


### Create Booking


POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}


##  Scripts

npm run dev - Start development server with hot reload
npm run build - Build TypeScript to JavaScript
npm start - Start production server
npm run lint - Type check without emitting files
npm run clean - Remove build directory


### GitHub Repo: **https://github.com/Rakib-11A/vehicle-management-system**
### Live Deployment: **https://vehicle-rental-system-two-tau.vercel.app/**