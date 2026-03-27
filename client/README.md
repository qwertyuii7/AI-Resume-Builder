# Frontend (client) Documentation

React + Vite app for authentication, resume creation, AI enhancements, ATS analysis, preview, and admin operations.

## Stack

- React 19
- Vite 7
- Redux Toolkit
- Axios
- Tailwind CSS
- React Router

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_ENABLE_GOOGLE_LOCALHOST=false
```

3. Run frontend:

```bash
npm run dev
```

Frontend runs at http://localhost:5173.

## Scripts

- `npm run dev`: Start dev server on port 5173.
- `npm run build`: Build production bundle.
- `npm run preview`: Preview production build.
- `npm run lint`: Run ESLint.

## How Frontend Connects to Backend

Axios instance lives in `src/configs/api.js`.

- `baseURL` comes from `VITE_BASE_URL`.
- Client sends raw JWT token in `Authorization` header.
- Backend expects raw token string, not `Bearer <token>`.

Example of what frontend sends automatically after login:

```http
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints Used by Frontend

Frontend calls these routes using the configured base URL:

- `POST /api/users/send-otp`
- `POST /api/users/verify-otp`
- `POST /api/users/google-login`
- `GET /api/users/data`
- `GET /api/users/resumes`
- `POST /api/resumes/create`
- `PUT /api/resumes/update` (multipart form-data)
- `DELETE /api/resumes/delete/:resumeId`
- `GET /api/resumes/get/:resumeId`
- `GET /api/resumes/public`
- `GET /api/resumes/public/:resumeId`
- `POST /api/resumes/public/:resumeId/clone`
- `POST /api/ai/enhance-pro-sum`
- `POST /api/ai/enhance-job-desc`
- `POST /api/ai/upload-resume`
- `POST /api/ai/analyze-ats`
- `POST /api/contact/send`
- `GET /api/admin/templates` (public)
- `GET /api/admin/users` (admin)
- `POST /api/admin/templates` (admin)

## Typical Frontend Flows With Responses

### 1) OTP login

Request:

```http
POST /api/users/send-otp
Content-Type: application/json

{ "email": "user@example.com" }
```

Response:

```json
{ "message": "OTP sent successfully to your email" }
```

Verify OTP:

```http
POST /api/users/verify-otp
Content-Type: application/json

{ "email": "user@example.com", "otp": "123456" }
```

Response:

```json
{
	"message": "Login successfully",
	"token": "jwt-token",
	"user": {
		"_id": "...",
		"name": "user",
		"email": "user@example.com"
	}
}
```

Store `token` in `localStorage` under key `token`.

### 2) Create and save a resume

Create draft:

```http
POST /api/resumes/create
Authorization: <token>
Content-Type: application/json

{ "title": "Software Engineer Resume" }
```

Response:

```json
{
	"message": "Resume created successfully",
	"resume": {
		"_id": "resume-id",
		"title": "Software Engineer Resume",
		"isDraft": true
	}
}
```

Save full resume (with optional image):

```http
PUT /api/resumes/update
Authorization: <token>
Content-Type: multipart/form-data
```

Form fields:

- `resumeId`: string
- `resumeData`: JSON string/object
- `removeBackground`: `yes` or `no` (optional)
- `image`: file (optional)

Response:

```json
{
	"message": "Saved successfully",
	"resume": {
		"_id": "resume-id",
		"isDraft": false
	}
}
```

### 3) ATS analysis

Request:

```http
POST /api/ai/analyze-ats
Authorization: <token>
Content-Type: application/json

{
	"resumeText": "...",
	"jobDescription": "..."
}
```

Response:

```json
{
	"ats_score": 78,
	"summary": "Moderate ATS compatibility...",
	"matched_keywords": ["react", "node"],
	"missing_keywords": ["docker"],
	"strengths": ["..."],
	"weaknesses": ["..."],
	"suggestions": ["..."],
	"score_breakdown": {
		"keyword_match": 75,
		"skills_match": 80,
		"experience_relevance": 70,
		"resume_structure_formatting": 85,
		"education_certifications": 65
	}
}
```

## Local Full-Stack Run

From project root, run both apps in separate terminals.

Terminal 1:

```bash
cd server
npm install
npm run server
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

## Common Errors

- 401 Unauthorized: token missing/expired, or token sent with `Bearer ` prefix.
- CORS blocked: ensure backend `CLIENT_URL` matches frontend origin.
- Google login fails: ensure frontend `VITE_GOOGLE_CLIENT_ID` equals backend `GOOGLE_CLIENT_ID`.
- Resume save fails: ensure `resumeData` is valid JSON in multipart request.

For backend endpoint details, read `../server/README.md`.
