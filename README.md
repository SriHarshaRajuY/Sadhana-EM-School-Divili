# Sadhana School MERN Website

This project converts the reference-only static `index.html` school website into a maintainable MERN application while preserving the finalized visual design.

The original `index.html` is intentionally ignored in git and should stay untouched. The React app uses the same CSS and page structure, then fetches dynamic school content from the Express API.

The school logo is served from `client/public/school-logo.jpeg` and is used in the header, footer, favicon, and social preview metadata.

## Stack

- React + Vite frontend in `client/`
- Express + Node API in `server/`
- MongoDB with Mongoose models
- RESTful routes for announcements, events, faculty, programs, and admission inquiries
- Helmet, CORS, rate limiting, validation, centralized errors, and environment configuration

## Project Structure

```text
client/
  src/
    api/
    config/
    data/
    App.jsx
    main.jsx
    styles.css
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    services/
    validators/
```

## Environment Setup

Copy the examples and fill values when available:

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Important variables:

```text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=school_staff_username
ADMIN_PASSWORD_HASH=scrypt_password_hash
ADMIN_TOKEN_SECRET=long_random_token_secret
ADMIN_TOKEN_EXPIRES_IN_MINUTES=60
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
VITE_API_BASE_URL=
VITE_SCHOOL_PHONE_DISPLAY=
VITE_SCHOOL_PHONE_TEL=
VITE_SCHOOL_WHATSAPP_URL=
VITE_SCHOOL_EMAIL=
VITE_SCHOOL_CAMPUS=
VITE_SCHOOL_OFFICE_HOURS=
```

The application does not ship seed/demo school records. If MongoDB is empty, public content APIs return empty arrays and the frontend shows neutral empty states until real school content is added.

In production, `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_TOKEN_SECRET` are required.

## Install and Run

```bash
npm install
npm run dev
```

Development URLs:

- React: `http://127.0.0.1:5173`
- API: `http://localhost:5000/api/health`

The Vite dev server proxies `/api` calls to Express.

## Admin Password Hash

Generate a password hash for the real staff password:

```bash
npm run hash:password -- "your strong staff password"
```

Put the generated value in `ADMIN_PASSWORD_HASH`. Do not store plaintext staff passwords in `.env`.

## Production Build

```bash
npm run build
npm run start
```

`npm run build` creates `client/dist`. The Express server serves that production React build when it exists, while keeping all API routes under `/api`.

## API Endpoints

Public reads and content management routes:

```text
POST   /api/auth/login

GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/:id
PATCH  /api/announcements/:id
DELETE /api/announcements/:id

GET    /api/events
POST   /api/events
GET    /api/events/:id
PATCH  /api/events/:id
DELETE /api/events/:id

GET    /api/faculty
POST   /api/faculty
GET    /api/faculty/:id
PATCH  /api/faculty/:id
DELETE /api/faculty/:id

GET    /api/programs
POST   /api/programs
GET    /api/programs/:id
PATCH  /api/programs/:id
DELETE /api/programs/:id

GET    /api/inquiries
POST   /api/inquiries
PATCH  /api/inquiries/:id/status
```

The current public UI consumes announcements, events, programs, faculty metadata, and the inquiry submission endpoint. Faculty data is supported in the API without adding a new public section, so the existing UI/UX remains unchanged.

Admin write routes and inquiry management routes require a bearer token from `POST /api/auth/login`:

```text
Authorization: Bearer <token>
```

Public parent-facing routes remain open:

- `GET` content endpoints for website display
- `POST /api/inquiries` for admission enquiries

## Deployment Notes

For a standard Node host:

1. Set `NODE_ENV=production`, `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOKEN_SECRET`, `PORT`, and `CORS_ORIGIN`.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npm run start`.

For Docker:

```bash
docker build -t sadhana-school-mern .
docker run -p 5000:5000 --env-file .env sadhana-school-mern
```

Use a managed MongoDB provider for production and restrict `CORS_ORIGIN` to the final frontend domain.
