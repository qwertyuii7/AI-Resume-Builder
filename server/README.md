# Backend (server) Documentation

Node.js + Express API for AI Resume Builder.

## Stack

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JWT auth
- OpenAI-compatible client (Gemini endpoint supported)
- ImageKit
- Nodemailer

## Project Entry

- Server entry: `server.js`
- Base API path prefix: `/api`
- Default port: `3000`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `server/.env`:

```env
PORT=3000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
JWT_SECRET=replace_with_secure_secret

GOOGLE_CLIENT_ID=your_google_client_id

OPEN_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPEN_AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_gemini_api_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# OTP sender (either pair works)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Contact + fallback sender
SMTP_SERVICE=gmail
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com
```

3. Run backend:

```bash
npm run server
```

Backend will run at http://localhost:3000.

## Scripts

- `npm run server`: Start with nodemon.
- `npm start`: Start with node.

## Authentication Contract

Protected routes use middleware that reads `req.headers.authorization` directly.

Important:

- Send raw JWT token in `Authorization` header.
- Do not prefix with `Bearer`.

Example:

```http
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## CORS

CORS origin is controlled by `CLIENT_URL` in `.env`.

If frontend runs on `http://localhost:5173`, set:

```env
CLIENT_URL=http://localhost:5173
```

## Data Model (Resume)

Main fields stored in MongoDB:

- `title`
- `public`
- `template`
- `accent_color`
- `professional_summary`
- `skills` (object)
- `personal_info` (name, profession, email, phone, links, image)
- `experience[]`
- `project[]`
- `education[]`
- `certificates` (object)
- `isDraft`

## API Reference With Request/Response Examples

Base URL in local development:

- `http://localhost:3000`

### Health

#### GET /

Response:

```text
Server is live...
```

### Users

#### POST /api/users/send-otp

Request:

```json
{ "email": "user@example.com" }
```

Success response:

```json
{ "message": "OTP sent successfully to your email" }
```

Error response:

```json
{ "message": "Email is required" }
```

#### POST /api/users/verify-otp

Request:

```json
{ "email": "user@example.com", "otp": "123456" }
```

Success response:

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

Error response:

```json
{ "message": "Invalid or expired OTP" }
```

#### POST /api/users/google-login

Request:

```json
{ "credential": "google_id_token" }
```

Success response:

```json
{
  "message": "Login successfully",
  "token": "jwt-token",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "..."
  }
}
```

#### GET /api/users/data (protected)

Success response:

```json
{
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "Member"
  }
}
```

#### GET /api/users/resumes (protected)

Returns only non-draft resumes.

Success response:

```json
{
  "resumes": [
    {
      "_id": "...",
      "title": "My Resume",
      "isDraft": false
    }
  ]
}
```

### Resumes

#### POST /api/resumes/create (protected)

Request:

```json
{ "title": "Software Engineer Resume" }
```

Success response:

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

#### PUT /api/resumes/update (protected, multipart/form-data)

Form-data fields:

- `resumeId` (string)
- `resumeData` (JSON string or object)
- `image` (file, optional)
- `removeBackground` (`yes` or `no`, optional)

Success response:

```json
{
  "message": "Saved successfully",
  "resume": {
    "_id": "resume-id",
    "isDraft": false
  }
}
```

Notes:

- If `image` exists, image is uploaded to ImageKit.
- If `removeBackground=yes`, ImageKit background-removal transformation is applied.

#### DELETE /api/resumes/delete/:resumeId (protected)

Success response:

```json
{ "message": "Resume deleted successfully" }
```

#### GET /api/resumes/get/:resumeId (protected)

Success response:

```json
{
  "_id": "resume-id",
  "title": "My Resume",
  "personal_info": {},
  "skills": {}
}
```

#### GET /api/resumes/public

Success response:

```json
{
  "resumes": [
    {
      "_id": "...",
      "title": "Public Resume",
      "template": "classic",
      "accent_color": "#3B82F6",
      "personal_info": {},
      "professional_summary": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### GET /api/resumes/public/:resumeId

Success response:

```json
{
  "_id": "...",
  "public": true,
  "title": "Public Resume"
}
```

#### POST /api/resumes/public/:resumeId/clone (protected)

Success response:

```json
{
  "message": "Resume copied successfully",
  "resume": {
    "_id": "new-id",
    "title": "Copy of Public Resume",
    "public": false,
    "isDraft": true
  }
}
```

### AI

#### POST /api/ai/enhance-pro-sum (protected)

Request:

```json
{ "userContent": "I build scalable APIs and UI apps." }
```

Success response:

```json
{
  "message": "Successfully enhanced summary.",
  "enhanceContent": "Results-driven engineer with experience..."
}
```

Fallback success response:

```json
{
  "message": "Enhanced summary generated with fallback.",
  "enhanceContent": "...",
  "fallback": true
}
```

#### POST /api/ai/enhance-job-desc (protected)

Request:

```json
{
  "position": "Frontend Developer",
  "company": "Acme",
  "location": "Remote",
  "userContent": "Built reusable UI components"
}
```

Success response:

```json
{
  "message": "Successfully enhanced the job description.",
  "enhancedContent": "Led development of reusable UI components..."
}
```

#### POST /api/ai/upload-resume (protected)

Request:

```json
{
  "title": "Imported Resume",
  "resumeText": "extracted text from PDF"
}
```

Success response:

```json
{ "resumeId": "new-resume-id" }
```

#### POST /api/ai/analyze-ats (protected)

Request:

```json
{
  "resumeText": "...",
  "jobDescription": "..."
}
```

Success response:

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
  },
  "detailed_review": {
    "what_is_good": ["..."],
    "what_is_not_good": ["..."],
    "fresher_guidance": ["..."],
    "recruiter_view": "..."
  }
}
```

### Contact

#### POST /api/contact/send

Request:

```json
{
  "name": "Aman",
  "email": "aman@example.com",
  "subject": "Help",
  "message": "Need support"
}
```

Success response:

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

Error response:

```json
{
  "success": false,
  "message": "All fields are required"
}
```

### Admin

Note: admin access currently allows only the hardcoded email `aaftabansari034@gmail.com`.

#### GET /api/admin/users (protected + admin)

Success response:

```json
[
  {
    "_id": "...",
    "name": "...",
    "email": "..."
  }
]
```

#### DELETE /api/admin/users/:id (protected + admin)

Success response:

```json
{ "message": "User deleted successfully" }
```

#### GET /api/admin/templates (public)

Success response:

```json
[
  {
    "_id": "...",
    "image": "https://...",
    "link": "/resume/preview/...",
    "templateType": "modern"
  }
]
```

#### POST /api/admin/templates (protected + admin, multipart/form-data)

Form-data fields:

- `image` (required)
- `link`
- `templateType`

Success response:

```json
{
  "_id": "...",
  "image": "https://...",
  "link": "/resume/preview/...",
  "templateType": "modern"
}
```

#### DELETE /api/admin/templates/:id (protected + admin)

Success response:

```json
{ "message": "Template deleted successfully" }
```

## How Frontend Should Connect

Use these frontend environment values:

```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=<same value as server GOOGLE_CLIENT_ID>
```

Then frontend can call API paths exactly as coded, for example:

- `/api/users/send-otp`
- `/api/resumes/create`
- `/api/ai/analyze-ats`

## Troubleshooting

- 401 Unauthorized: missing token or token sent with `Bearer` prefix.
- CORS errors: `CLIENT_URL` does not match frontend origin.
- Google login errors: `GOOGLE_CLIENT_ID` mismatch between frontend/backend.
- OTP email failure: SMTP credentials missing or invalid app password.
- AI failures: invalid `OPEN_AI_BASE_URL`, `GEMINI_API_KEY`, or model name.
- Image upload failures: invalid `IMAGEKIT_PRIVATE_KEY`.
