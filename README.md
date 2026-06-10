# Sadhana School MERN Website

This project converts the reference-only static `index.html` school website into a maintainable MERN application while preserving the finalized visual design.

The original `index.html` is intentionally ignored in git and should stay untouched. The React app uses the same CSS and page structure, then fetches dynamic school content from the Express API.

The school logo is served from `client/public/school-logo.jpeg` and is used in the header, footer, favicon, and social preview metadata.

## Stack

- React + Vite frontend in `client/`
- Express + Node API in `server/`
- MongoDB with Mongoose models
- Cloudinary-backed image uploads for admin-managed media
- RESTful routes for announcements, events, faculty, programs, and admission inquiries
- Helmet, CORS, public/API rate limiting, separate login throttling, validation, centralized errors, and environment configuration
- Protected staff dashboard for managing live school content, website page copy, contact details, gallery items, and enquiry follow-up

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
ADMIN_PASSWORD=school_staff_password
ADMIN_PASSWORD_HASH=scrypt_password_hash
ADMIN_TOKEN_SECRET=long_random_token_secret
ADMIN_TOKEN_EXPIRES_IN_MINUTES=60
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
INQUIRY_RATE_LIMIT_WINDOW_MS=3600000
INQUIRY_RATE_LIMIT_MAX=20
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=sadhana-school
CLOUDINARY_UPLOAD_MAX_BYTES=5242880
VITE_API_BASE_URL=
VITE_SCHOOL_PHONE_DISPLAY=
VITE_SCHOOL_PHONE_TEL=
VITE_SCHOOL_WHATSAPP_URL=
VITE_SCHOOL_EMAIL=
VITE_SCHOOL_CAMPUS=
VITE_SCHOOL_OFFICE_HOURS=
```

The application does not ship seed/demo school records. If MongoDB is connected but empty, public content APIs return empty arrays and the frontend shows neutral empty states until real school content is added. If MongoDB is unavailable, database-backed APIs return a clear service-unavailable error instead of pretending a parent enquiry or staff update succeeded.

In production, `MONGODB_URI`, `ADMIN_USERNAME`, either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`, `ADMIN_TOKEN_SECRET`, and the Cloudinary credentials are required.

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

You can use either a plain environment password or a password hash. For the strongest production setup, generate a password hash for the real staff password:

```bash
npm run hash:password -- "your strong staff password"
```

Put the generated value in `ADMIN_PASSWORD_HASH`. If you choose the simpler setup, set `ADMIN_PASSWORD` directly in the deployment platform environment variables.

The public page includes a protected `#admin` dashboard. Staff can sign in with the configured admin credentials to update the public website shell, contact details, hero/about/admissions/facility/gallery copy, upload Cloudinary images, create/edit/publish/hide/delete announcements, events, faculty profiles, and academic programs, and manage admission enquiry status, notes, and deletion.

## Production Build

```bash
npm run check:deploy
npm run build
npm run start
```

`npm run check:deploy` validates required production environment variables without printing secrets. `npm run build` creates `client/dist`. The Express server serves that production React build when it exists, while keeping all API routes under `/api`.

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

GET    /api/site-content
PUT    /api/site-content

POST   /api/uploads/image
DELETE /api/uploads/image

GET    /api/inquiries
POST   /api/inquiries
PATCH  /api/inquiries/:id/status
DELETE /api/inquiries/:id

GET    /api/admin/announcements
GET    /api/admin/events
GET    /api/admin/faculty
GET    /api/admin/programs
GET    /api/admin/inquiries
```

The current public UI consumes the site-content singleton, announcements, events, programs, faculty metadata, and the inquiry submission endpoint. Faculty data is supported in the API and in the admin dashboard without forcing a public redesign.

Admin write routes, image upload routes, and inquiry management routes require a bearer token from `POST /api/auth/login`:

```text
Authorization: Bearer <token>
```

Public parent-facing routes remain open:

- `GET` content endpoints for website display
- `POST /api/inquiries` for admission enquiries

## Deployment Notes

For a standard Node host:

1. Set `NODE_ENV=production`, `MONGODB_URI`, `ADMIN_USERNAME`, either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`, `ADMIN_TOKEN_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT`, and `CORS_ORIGIN`.
2. Run `npm install`.
3. Run `npm run check:deploy`.
4. Run `npm run build`.
5. Run `npm run start`.

For Docker:

```bash
docker build -t sadhana-school-mern .
docker run -p 5000:5000 --env-file .env sadhana-school-mern
```

Use a managed MongoDB provider for production and restrict `CORS_ORIGIN` to the final frontend domain.
