# Deployment: Netlify + Railway

## Backend on Railway

1. Push this repository to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Set the service root directory to `backend`.
4. Railway should use:
   - Build: Nixpacks
   - Start command: `npm start`
5. Add environment variables from `backend/.env.example`.
6. After deploy, copy the Railway public URL.

Required backend variables:

```txt
MONGO_URI=your MongoDB Atlas connection string
JWT_SECRET=a long random secret
CLIENT_URL=https://your-netlify-site.netlify.app
```

Add at least one AI provider key for question generation/evaluation:

```txt
GEMINI_API_KEY=...
```

## Frontend on Netlify

1. In Netlify, create a new site from the same GitHub repo.
2. Set the base directory to `frontend/ai_interview_prep`.
3. Netlify reads `netlify.toml`, but these are the values:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add this environment variable:

```txt
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app/api/v1
```

5. Deploy the frontend.
6. Copy the Netlify URL and set it as `CLIENT_URL` in Railway.
7. Redeploy/restart the Railway backend after changing `CLIENT_URL`.

## MongoDB Atlas

Make sure Railway can connect:

- Database user/password are correct.
- Network access allows Railway. For a demo project, `0.0.0.0/0` is the simplest setting.

## Local Development

Frontend:

```bash
cd frontend/ai_interview_prep
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```
