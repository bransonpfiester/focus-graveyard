import { createClient } from '@/lib/supabase/server'
import SessionCard from '@/components/SessionCard'
import Link from 'next/link'

interface FocusSession {
  id: string
  intended_minutes: number
  actual_seconds: number
  distraction: string | null
  created_at: string
  profiles: {
    username: string
  }
}

export default async function Home() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">⏱️ Focus Graveyard</h1>
          <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
          <p className="text-gray-400 mb-6">
            This app needs a Supabase database to work. Add these environment variables to Vercel:
          </p>
          <div className="bg-gray-800 p-6 rounded-lg text-left mb-6">
            <p className="font-mono text-sm text-gray-300">NEXT_PUBLIC_SUPABASE_URL=your-project-url</p>
            <p className="font-mono text-sm text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          </div>
          <p className="text-sm text-gray-500">
            See README.md for full setup instructions
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select(`
      *,
      profiles (username)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate stats
  const totalSessions = sessions?.length || 0
  const avgDuration = sessions?.length 
    ? Math.round(sessions.reduce((acc, s) => acc + s.actual_seconds, 0) / sessions.length / 60)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">⏱️ Focus Graveyard</h1>
            <p className="text-gray-400 text-sm mt-1">Where broken focus sessions rest in peace</p>
          </div>
          <nav className="flex gap-4">
            <Link 
              href="/timer" 
              className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Start Timer
            </Link>
            <Link 
              href="/auth/login" 
              className="border border-gray-700 hover:border-gray-600 px-6 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Every distraction tells a story
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Start a focus session. Break it early? Bury it in the graveyard.<br />
          Track your distractions. Share your failures. Build focus over time.
        </p>
        <div className="flex gap-4 justify-center">
          <div className="bg-gray-800 px-6 py-4 rounded-lg">
            <p className="text-3xl font-bold text-orange-500">{totalSessions}</p>
            <p className="text-sm text-gray-400">Sessions Buried</p>
          </div>
          <div className="bg-gray-800 px-6 py-4 rounded-lg">
            <p className="text-3xl font-bold text-orange-500">{avgDuration}m</p>
            <p className="text-sm text-gray-400">Avg Duration</p>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="container mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">The Graveyard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
        
        {!sessions || sessions.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">The graveyard is empty...</p>
            <p className="mt-2">Be the first to bury a broken focus session</p>
          </div>
        )}
      </section>
    </div>
  )
}
