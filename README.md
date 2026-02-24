# AI Resume Builder

Full-stack AI Resume Builder with:
- `client/` (React + Vite frontend)
- `server/` (Node.js + Express backend)

This README covers whole-project setup and how to run client and backend together.

## Project Structure

```
AI Resume Builder/
├─ client/
└─ server/
```

Detailed docs:
- Frontend: `client/README.md`
- Backend API + integration: `server/README.md`

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Axios, Tailwind CSS
- Backend: Express, MongoDB (Mongoose), JWT auth
- Integrations: OpenAI-compatible API, Google OAuth, Razorpay, ImageKit, Nodemailer

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string

## 1) Backend Setup (`server`)

Create `server/.env` (see full list in `server/README.md`) and include at least:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
OPEN_AI_MODEL=your_model_name
OPEN_AI_BASE_URL=your_openai_compatible_base_url
GEMINI_API_KEY=your_api_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=your_admin_email
```

Install and run:

```bash
cd server
npm install
npm run server
```

Backend runs on `http://localhost:3000`.

## 2) Frontend Setup (`client`)

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Install and run:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Authentication Notes

- Login returns JWT from backend.
- Frontend stores token in `localStorage` key `token`.
- Backend expects raw token in `Authorization` header (no `Bearer ` prefix).

## Quick Start (Run Both)

Open two terminals from project root:

Terminal 1:
```bash
cd server
npm run server
```

Terminal 2:
```bash
cd client
npm run dev
```

## API Reference

All backend endpoints and payloads are documented in `server/README.md`.

## Common Issues

- `401 Unauthorized`: missing token or token sent with `Bearer` prefix.
- CORS errors: frontend origin not allowed in backend `server.js` CORS list.
- Payment/AI/email failures: corresponding env keys missing.
- Resume update failures: malformed multipart `resumeData` JSON.
