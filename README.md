# CampusHub — Your campus, your community.

A web platform that helps university students find people for shared activities,
discover campus events and explore student clubs — all in one place.

## Features (MVP)

- **Find Your People** — browse, filter, create and join activities (lunch, study groups, cinema, sports…)
- **Events** — upcoming university and club events with registration and capacity
- **Clubs & Communities** — club directory with categories, follow/unfollow, club events
- **Club representatives** can publish events for their club
- **Profile** — my activities, my events, clubs I follow, editable profile
- Email + password authentication (JWT), responsive design for desktop and mobile

## Tech stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | Angular 21, TypeScript, SCSS, signals        |
| Backend  | NestJS 12, REST API, JWT auth, class-validator |
| Database | PostgreSQL 16 (Docker), Prisma 7 ORM         |

## Project structure

```
campushub/
  client/                 Angular app (http://localhost:4200)
    src/app/core/         API service, auth service, guards, models
    src/app/shared/       Reusable UI: cards, avatar, empty state
    src/app/layout/       App shell (top bar + mobile tab bar)
    src/app/pages/        One file per page
    src/styles.scss       Design system (colors, spacing, components)
  server/                 NestJS API (http://localhost:3001/api)
    prisma/schema.prisma  Database schema
    src/auth/             Register, login, JWT guard
    src/activities/       Find Your People
    src/events/           Events + registration
    src/clubs/            Clubs + follow
    src/users/            Profile
    src/seed/             Demo data (added automatically to an empty database)
  docker-compose.yml      PostgreSQL on port 5450
```

## How to run

1. Start the database (Docker Desktop must be open):
   ```bash
   docker compose up -d
   ```
2. Start the backend:
   ```bash
   cd server
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run start:dev
   ```
3. Start the frontend (in a second terminal):
   ```bash
   cd client
   npm install
   npm start
   ```
4. Open http://localhost:4200

## Demo accounts

All passwords: `password123`

| Email                  | Role                                          |
|------------------------|-----------------------------------------------|
| student@campushub.kz   | Student, representative of Art & Design Collective |
| aigerim@campushub.kz   | Representative of Code Society                |
| daniyar@campushub.kz   | Representative of Startup Hub, Campus Runners |
| admin@campushub.kz     | Administrator (can create any event)          |

## API overview

| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | /api/auth/register            | Create account                  |
| POST   | /api/auth/login               | Log in, returns JWT             |
| GET    | /api/auth/me                  | Current user                    |
| GET    | /api/activities?category=     | Upcoming activities             |
| POST   | /api/activities               | Create activity                 |
| GET    | /api/activities/:id           | Activity with participants      |
| POST / DELETE | /api/activities/:id/join | Join / leave                  |
| POST   | /api/activities/:id/cancel    | Cancel (creator only)           |
| GET    | /api/events                   | Upcoming events                 |
| POST   | /api/events                   | Create event (club rep / admin) |
| POST / DELETE | /api/events/:id/register | Register / cancel            |
| GET    | /api/clubs?category=          | Clubs                           |
| GET    | /api/clubs/:id                | Club with upcoming events       |
| POST / DELETE | /api/clubs/:id/follow   | Follow / unfollow              |
| GET / PATCH | /api/users/me            | My profile and plans            |

## Roadmap (after MVP)

Email verification, polls & voting, campus feed, image uploads, notifications,
club membership requests, admin moderation panel.
