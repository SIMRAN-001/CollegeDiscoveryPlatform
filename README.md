# 🎓 CollegeFind – College Discovery Platform

A college discovery and comparison platform built using Next.js, Express, and PostgreSQL.

## Features
- 🔍 College Listing with Search + Filters (state, course, fee range)
- 🏫 College Detail Page (ratings, placements, courses, top recruiters)
- ⚖️ College Compare Tool – side-by-side comparison with best-pick winner

---

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Deploy Frontend | Vercel (free) |
| Deploy Backend | Railway (free) |

---

## 🚀 Running Locally (Step by Step)

### Prerequisites
- Install **Node.js** from https://nodejs.org (choose LTS version)
- Install **PostgreSQL** from https://www.postgresql.org/download/

### Step 1 – Set up the Database
Open your terminal and run:
```bash
psql -U postgres
CREATE DATABASE college_discovery;
\q
```

### Step 2 – Start the Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env` and set:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_discovery
PORT=4000
NODE_ENV=development
```
Then run:
```bash
npm run dev
```
Backend starts on http://localhost:4000
(It will auto-create tables and seed 12 colleges on first run)

### Step 3 – Start the Frontend
Open a NEW terminal window:
```bash
cd frontend
npm install
cp .env.example .env
```
The `.env` file should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
Then run:
```bash
npm run dev
```
Frontend starts on http://localhost:3000 🎉

---

## ☁️ Deploying (Free – Required for Submission)

### Deploy Backend to Railway
1. Go to https://railway.app and sign up with GitHub
2. Click **New Project → Deploy from GitHub Repo**
3. Select this repo, choose the `backend` folder as root
4. Railway will auto-detect Node.js
5. Go to **Variables** tab → add:
   - `NODE_ENV` = `production`
6. Click **Add Plugin → PostgreSQL** — Railway adds DB automatically
7. Copy the `DATABASE_URL` from the PostgreSQL plugin into your backend variables
8. Deploy! Copy your Railway URL (e.g. `https://your-app.up.railway.app`)

### Deploy Frontend to Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click **New Project → Import Git Repository**
3. Select this repo, set **Root Directory** to `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (from above)
5. Click Deploy!

---

## 📁 Project Structure
```
college-discovery/
├── backend/
│   ├── src/
│   │   └── index.ts        ← All API routes + DB init + seeding
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           ← Home page
    │   │   ├── colleges/
    │   │   │   ├── page.tsx       ← College listing + search
    │   │   │   └── [id]/page.tsx  ← College detail
    │   │   └── compare/page.tsx   ← Compare colleges
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   └── CollegeCard.tsx
    │   └── lib/api.ts             ← API helper functions
    └── package.json
```

