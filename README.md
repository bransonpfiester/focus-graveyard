# Focus Graveyard ⏱️💀

Where broken focus sessions rest in peace. Start a timer, get distracted? Bury it in the graveyard.

## Live Demo
https://focus-graveyard.vercel.app

## Features

- ⏱️ **Focus Timer** - Set your intended focus time
- 💀 **Instant Burial** - Break early? Record what distracted you
- 📊 **Public Graveyard** - See everyone's broken focus sessions
- 👤 **User Profiles** - Track your distraction patterns
- 🎯 **Stats** - Total sessions buried, average duration

## Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Copy your project URL and anon key

2. **Run SQL Schema**
   - In Supabase dashboard, go to SQL Editor
   - Paste contents of `supabase-schema.sql`
   - Run the script

3. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials
   ```

4. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

## Deploy to Vercel

```bash
vercel
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tech Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Supabase (auth + database)
- Vercel deployment

## Coming Soon

- Streak tracking for successful sessions
- Personal graveyards by user
- Distraction leaderboards
- TikTok-friendly sharing
