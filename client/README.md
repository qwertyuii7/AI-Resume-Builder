# Client (Frontend) - AI Resume Builder

React + Vite frontend for building, editing, importing, and previewing resumes.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Required Environment Variables

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Install and Run

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173` by default.

## Backend Connection

Axios is configured in `src/configs/api.js`:
- Uses `VITE_BASE_URL` as API base
- Automatically sends `Authorization` header from `localStorage.getItem('token')`

Important: backend expects raw token in `Authorization` header (not `Bearer <token>`).

## Main API Groups Used by Frontend

- `/users` - OTP login, Google login, current user, user resumes, download tracking
- `/resumes` - create, update, delete, get by id, public resumes, clone public resume
- `/ai` - enhance summary, enhance job description, upload/import resume text
- `/payments` - create order and verify payment
- `/contact` - send contact form message
- `/admin` - user and template management (admin only)

For complete endpoint payloads and responses, see `../server/README.md`.

## Local Full-Stack Run

From project root, run both apps in separate terminals:

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

## Troubleshooting

- `Network Error` / CORS: ensure backend is running and CORS allows `http://localhost:5173`.
- `401 Unauthorized`: login first and verify `token` exists in `localStorage`.
- Google login issues: verify `VITE_GOOGLE_CLIENT_ID` matches backend `GOOGLE_CLIENT_ID`.
- Payment issues: verify `VITE_RAZORPAY_KEY_ID` and backend Razorpay keys are configured.
