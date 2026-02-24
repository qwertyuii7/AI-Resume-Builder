# Backend API Integration Guide

This document explains how to connect the frontend to the backend APIs in this project.

## Base URL and CORS

- Local backend default: `http://localhost:3000`
- API base path: `/api`
- Full local API base URL for frontend: `http://localhost:3000/api`

Current backend CORS allows only:
- `https://resumefy-pied.vercel.app`
- `http://localhost:5173`

If your frontend runs on another origin, update CORS in `server.js`.

## Frontend Axios Setup (already aligned)

`client/src/configs/api.js` uses:
- `baseURL: import.meta.env.VITE_BASE_URL`
- `Authorization` header with the raw token from `localStorage`

Important: backend expects **raw JWT token** in `Authorization` header (not `Bearer <token>`).

### Required frontend env

In frontend `.env`:

```env
VITE_BASE_URL=http://localhost:3000/api
```

---

## Backend Environment Variables

Create `server/.env` with these values:

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

# OTP mailer (used in configs/nodemailer.js)
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

# Contact mailer (used in contactController.js)
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin_receive_email_optional
```

Note: OTP and contact controller use different mail env key names. Keep both sets configured.

---

## Authentication Rules

- Protected routes require `Authorization: <jwt_token>`
- JWT is returned by:
  - `POST /api/users/verify-otp`
  - `POST /api/users/google-login`
- Store token in `localStorage` as `token` (already used in frontend interceptor).

---

## API Endpoints

## 1) User APIs (`/api/users`)

### `POST /send-otp`
Send OTP to email.

Body:
```json
{ "email": "user@example.com" }
```

Response:
```json
{ "message": "OTP sent successfully to your email" }
```

### `POST /verify-otp`
Verify OTP and login.

Body:
```json
{ "email": "user@example.com", "otp": "123456" }
```

Success response contains `token` and `user`.

### `POST /google-login`
Google login using frontend credential token.

Body:
```json
{ "credential": "google_id_token" }
```

Success response contains `token` and `user`.

### `GET /data` (Protected)
Get logged-in user details.

### `GET /resumes` (Protected)
Get user resumes (`isDraft: false` only).

### `POST /track-download` (Protected)
Increment user download count.

If limit reached:
```json
{ "message": "Download limit reached. Please upgrade your plan.", "limitReached": true }
```

---

## 2) Resume APIs (`/api/resumes`)

### `POST /create` (Protected)
Create draft resume.

Body:
```json
{ "title": "My Resume" }
```

### `PUT /update` (Protected, multipart/form-data)
Save/Update resume, optional profile image upload.

Form fields:
- `resumeId` (string)
- `resumeData` (JSON string or object)
- `removeBackground` (`yes` or not)
- `image` (file, optional)

`resumeData` supports keys like:
- `title`, `template`, `accent_color`, `public`
- `professional_summary`, `skills`, `personal_info`
- `experience`, `project`, `certificates`, `education`

### `DELETE /delete/:resumeId` (Protected)
Delete a resume.

### `GET /get/:resumeId` (Protected)
Get full resume by id (owned by logged-in user).

### `GET /public`
Get latest public resumes (up to 24).

### `GET /public/:resumeId`
Get one public resume by id.

### `POST /public/:resumeId/clone` (Protected)
Clone public resume into logged-in user drafts.

---

## 3) AI APIs (`/api/ai`) (All Protected)

### `POST /enhance-pro-sum`
Enhance professional summary.

Body:
```json
{ "userContent": "your summary text" }
```

Response field: `enhanceContent`

### `POST /enhance-job-desc`
Enhance experience/job description.

Body:
```json
{ "userContent": "your job description" }
```

Response field: `enhancedContent`

### `POST /upload-resume`
Extract resume data from pasted/uploaded resume text and create draft resume.

Body:
```json
{ "resumeText": "raw resume text", "title": "Imported Resume" }
```

Response:
```json
{ "resumeId": "..." }
```

---

## 4) Payment APIs (`/api/payments`) (Protected)

### `POST /create-order`
Create Razorpay order.

Body:
```json
{ "amount": 499 }
```

### `POST /verify-payment`
Verify Razorpay signature and activate subscription.

Body:
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```

On success, backend updates user:
- `isSubscribed = true`
- `resumeLimit = 10`

---

## 5) Contact API (`/api/contact`)

### `POST /send`
Public endpoint for contact form.

Body:
```json
{
  "name": "John",
  "email": "john@example.com",
  "subject": "Need help",
  "message": "Hello team"
}
```

Sends mail to admin + confirmation mail to user.

---

## 6) Admin APIs (`/api/admin`)

Admin access requires:
- Valid JWT
- Logged-in user email exactly: `aaftabansari034@gmail.com`

### `GET /users` (Protected + Admin)
Get all users.

### `DELETE /users/:id` (Protected + Admin)
Delete user.

### `POST /templates` (Protected + Admin, multipart/form-data)
Add a template.

Form fields:
- `image` (file, required)
- `link` (string)
- `templateType` (string)

### `DELETE /templates/:id` (Protected + Admin)
Delete template.

### `GET /templates` (Public)
Get all templates (used by home page).

---

## Frontend Usage Examples

## Auth request with Axios interceptor (already in project)

```js
import api from '../configs/api';

const { data } = await api.get('/users/data');
```

## Multipart update resume example

```js
const formData = new FormData();
formData.append('resumeId', resumeId);
formData.append('resumeData', JSON.stringify(resumeData));
formData.append('removeBackground', removeBackground ? 'yes' : 'no');
if (imageFile) formData.append('image', imageFile);

await api.put('/resumes/update', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Public resume clone example

```js
await api.post(`/resumes/public/${resumeId}/clone`);
```

---

## Recommended Connection Checklist

1. Start backend (`server`):
   ```bash
   npm install
   npm run server
   ```
2. Set frontend `VITE_BASE_URL` to backend `/api` base URL.
3. Login and verify token is stored in `localStorage` key `token`.
4. Verify protected call works: `GET /api/users/data`.
5. Test one endpoint from each module (users, resumes, ai, payments, contact).

---

## Common Integration Issues

- `401 Unauthorized`: token missing/invalid or sent as `Bearer <token>` instead of raw token.
- `CORS error`: frontend origin is not in allowed CORS list in backend.
- `500 on mail endpoints`: missing email env vars.
- `400 on resume update`: invalid `resumeData` JSON in multipart payload.
- AI endpoints failing: missing `OPEN_AI_BASE_URL`, `GEMINI_API_KEY`, or `OPEN_AI_MODEL`.

---

If you want, I can also add a matching `API.md` in the frontend directory with direct page-to-endpoint mapping (which page calls which API).