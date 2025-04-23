# EventHub Backend

EventHub is a comprehensive event management platform built with Nest.js, featuring ticketing, offline validation, auctions, and gamification.

## Features

- User Management (Authentication, Profiles, Levels)
- Event Management (Create, Update, Delete Events)
- Ticketing System (Purchase, Transfer, Validation)
- Auction System (Ticket Auctions)
- Gamification (Quests, XP, Levels)
- File Storage (MinIO for Images)
- Caching (Redis)

## Tech Stack

- Nest.js - Backend Framework
- TypeORM - Database ORM
- PostgreSQL - Primary Database
- Redis - Caching & Session Management
- MinIO - File Storage
- JWT - Authentication
- Swagger - API Documentation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Redis
- MinIO

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/eventhub-backend.git
cd eventhub-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file in the root directory:
\`\`\`env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=eventhub

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=eventhub
\`\`\`

4. Start the development server:
\`\`\`bash
npm run start:dev
\`\`\`

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
\`http://localhost:3000/api\`

### Core Endpoints

#### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login
- POST /auth/refresh - Refresh access token

#### Events
- GET /events - List events
- POST /events - Create event
- GET /events/:id - Get event details
- PUT /events/:id - Update event
- DELETE /events/:id - Delete event
- POST /events/:id/coordinators - Add event coordinator

#### Tickets
- POST /tickets - Purchase ticket
- GET /tickets - List user tickets
- GET /tickets/:id - Get ticket details
- POST /tickets/:id/transfer - Transfer ticket
- GET /tickets/:id/encrypted - Get encrypted ticket data

#### Auctions
- POST /auctions - Create auction
- GET /auctions - List auctions
- GET /auctions/:id - Get auction details
- POST /auctions/:id/bids - Place bid
- POST /auctions/:id/buy - Instant buy

#### Quests
- GET /quests - List available quests
- POST /quests/:id/progress - Update quest progress
- GET /quests/:id/status - Get quest status

## Development

### Database Migrations

Generate a new migration:
\`\`\`bash
npm run typeorm:migration:generate -- -n MigrationName
\`\`\`

Run migrations:
\`\`\`bash
npm run typeorm:migration:run
\`\`\`

### Testing

Run unit tests:
\`\`\`bash
npm run test
\`\`\`

Run e2e tests:
\`\`\`bash
npm run test:e2e
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 