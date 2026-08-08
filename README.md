# CodeFlow

Duolingo-style touch typing practice for developers. Learn proper finger placement, build speed and accuracy through a 7-stage progressive curriculum, and track your streak — all while typing real code instead of random words.

**Live app:** https://codeflow-jet.vercel.app

## Why CodeFlow

Most typing tools measure speed. CodeFlow teaches the skill: a keyboard overlay shows which finger to use for every keystroke, in real time, while you type. Lessons progress from home-row drills to real JavaScript and Python snippets, so the muscle memory you build actually transfers to writing code, not just prose.

## Features

- **Finger-placement guidance** — an on-screen keyboard and hand guide highlight the correct finger for the next keystroke as you type
- **7-stage curriculum, 56 lessons** — home row → full alphabet → numbers → symbols → real code snippets, unlocked in sequence
- **Real-time stats** — live WPM and accuracy tracking during practice
- **Streaks** — daily practice streak tracked server-side to keep you consistent
- **Progress dashboard** — completion by stage, average WPM/accuracy, streak history
- **GitHub OAuth** — sign in and pick up where you left off, on any device

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS
- **3D:** React Three Fiber / Three.js (landing page hero)
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment:** Vercel

## Architecture notes

- All user data access is enforced through Postgres Row Level Security policies — users can only read/write their own progress and streak data, verified at the database level, not just the client.
- Streak calculation runs as a database-level function on progress insert, so it can't be bypassed or duplicated by client-side manipulation.

## Running locally

```bash
git clone https://github.com/chaitanyagit25/codeflow.git
cd codeflow
npm install
```

Create a `.env` file with your own Supabase project credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

## Roadmap

- [ ] More advanced code snippets (additional languages)
- [ ] Leaderboards
- [ ] Mobile-responsive practice mode
