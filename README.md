# Sadhana EM School Divili Website

Official school website for Sadhana EM School, Divili.

- Public website: https://sadhana-em-school-divili-client.vercel.app
- Backend service: https://sadhana-em-school-divili.onrender.com

This website is built for parents, students, and school staff. Parents can read school information, view official updates, and submit admission enquiries. School staff can securely update notices, events, faculty profiles, academic programs, contact details, gallery items, and enquiry follow-up without calling a developer for routine changes.

## How Parents Use The Website

Parents can use the public website to:

- Learn about Sadhana EM School, academics, facilities, admissions, events, and notices.
- View the latest published school announcements and events.
- See faculty and academic program information after the school office publishes it.
- Submit an admission enquiry from the enquiry form.
- Use the available contact options for phone, WhatsApp, email, campus address, and office timings after the school office fills them in.

The website does not show fake records. If the school has not published notices, events, faculty profiles, or programs yet, the website shows clean empty states until real information is added.

## How School Staff Use The Website

Staff can manage the website from the protected staff portal:

1. Open the public website.
2. Click `Staff Login` in the navigation, or open `/staff-login`.
3. Sign in with the private staff username and password configured in the deployment environment.
4. Use the dashboard tabs to manage the website.

Staff can update:

- Website text, school name, banner message, hero section, about section, admissions copy, gallery, contact details, and enquiry form options.
- Announcements and school notices.
- Events and calendar-style updates.
- Faculty and staff profiles.
- Academic programs.
- Admission enquiries, including status and staff notes.
- Images through Cloudinary upload fields where image support is available.

Published records appear on the public website automatically. Hidden or inactive records stay in the staff portal and are not shown to parents.

The staff portal opens as a separate page in the same browser tab. It is not part of the public homepage, so parents do not need to scroll past staff-only tools.

## Public Display Rules

- Recent notices are shown near the top of the home page.
- Recent events are shown in the events section.
- If more records are available, the website provides a parent-facing `View all` option.
- Notices appear in the school updates section.
- Faculty profiles appear in the faculty section when marked active.
- Academic programs appear in the academics section when published.
- Admission enquiries are stored privately for staff review and are not shown publicly.

## Staff Content Checklist

Before sharing the website widely with parents, the school office should add or verify:

- School phone number, WhatsApp link, email, campus address, and office hours.
- Real admission enquiry class options.
- At least one official announcement or notice, if available.
- Upcoming school events, if available.
- Faculty profiles approved by the school.
- Academic program details approved by the school.
- Real gallery images approved for public display.

Do not publish test content, placeholder phone numbers, or unverified school information on the live website.

## Current Deployment Setup

The live website is deployed as a split production setup:

- Frontend: Vercel
- Backend/API: Render
- Database: MongoDB Atlas
- Image uploads: Cloudinary

The Vercel frontend calls the Render backend through `VITE_API_BASE_URL`.

## Project Structure

```text
client/
  public/
  src/
    api/
    config/
    data/
    App.jsx
    main.jsx
    styles.css
  vercel.json

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

vercel.json
Dockerfile
package.json
```

The original static `index.html` is reference-only and should stay untouched. The production React app lives in `client/`.

## Local Setup For Development

Install dependencies:

```bash
npm install
```

Create environment files from the examples:

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Start the full stack app:

```bash
npm run dev
```

Development URLs:

- React frontend: http://127.0.0.1:5173
- API health check: http://localhost:5000/api/health

## Required Environment Variables

Backend production variables:

```text
NODE_ENV=production
PORT=5000
MONGODB_URI=
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_PASSWORD_HASH=
ADMIN_TOKEN_SECRET=
ADMIN_TOKEN_EXPIRES_IN_MINUTES=60
CORS_ORIGIN=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
INQUIRY_RATE_LIMIT_WINDOW_MS=3600000
INQUIRY_RATE_LIMIT_MAX=20
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=sadhana-school
CLOUDINARY_UPLOAD_MAX_BYTES=5242880
TRUST_PROXY=true
```

Frontend production variable:

```text
VITE_API_BASE_URL=https://sadhana-em-school-divili.onrender.com
```

Keep all real passwords, MongoDB URLs, token secrets, and Cloudinary secrets only in deployment platform environment variables. Do not commit them to GitHub.

## Production Commands

Check required production configuration:

```bash
npm run check:deploy
```

Build the React app:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Deploying The Frontend On Vercel

For the current Vercel frontend deployment:

- Framework preset: Vite
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://sadhana-em-school-divili.onrender.com`

If the Vercel project is imported from the repository root instead:

- Build command: `npm run build`
- Output directory: `client/dist`

The repository includes Vercel SPA fallback configuration in both the root and `client/` so direct links and refreshes do not show a 404 page.

## Deploying The Backend On Render

Render should be configured as a Node web service:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check path: `/api/health`

Set `CORS_ORIGIN` to the approved frontend domains, for example:

```text
https://sadhana-em-school-divili-client.vercel.app,https://sadhana-em-school-divili.onrender.com
```

After changing environment variables, redeploy the Render service.

## API Summary

Public endpoints used by the website:

```text
GET  /api/site-content
GET  /api/announcements
GET  /api/events
GET  /api/faculty
GET  /api/programs
POST /api/inquiries
```

Staff-only endpoints require a bearer token from staff login:

```text
POST   /api/auth/login
GET    /api/admin/announcements
GET    /api/admin/events
GET    /api/admin/faculty
GET    /api/admin/programs
GET    /api/admin/inquiries
POST   /api/announcements
PATCH  /api/announcements/:id
DELETE /api/announcements/:id
POST   /api/events
PATCH  /api/events/:id
DELETE /api/events/:id
POST   /api/faculty
PATCH  /api/faculty/:id
DELETE /api/faculty/:id
POST   /api/programs
PATCH  /api/programs/:id
DELETE /api/programs/:id
PUT    /api/site-content
POST   /api/uploads/image
DELETE /api/uploads/image
PATCH  /api/inquiries/:id/status
DELETE /api/inquiries/:id
```

## Security And Reliability Notes

- Staff login is protected by server-side credentials and signed tokens.
- API traffic is protected with CORS, Helmet, validation, rate limiting, centralized error handling, and production environment checks.
- Public enquiry submissions are validated before saving.
- Image uploads are handled through Cloudinary for production deployment.
- No seed or demo content is inserted automatically.
- The deployment check script validates required environment variables without printing secrets.
