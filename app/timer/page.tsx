'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TimerPage() {
  const router = useRouter()
  const [minutes, setMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  function startTimer() {
    setTimeLeft(minutes * 60)
    setIsRunning(true)
    setStartTime(Date.now())
  }

  async function giveUp() {
    if (!startTime) return

    const actualSeconds = Math.floor((Date.now() - startTime) / 1000)
    const distraction = prompt('What distracted you?')
    
    if (distraction === null) return // User cancelled

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirect=/timer')
        return
      }

      await supabase.from('focus_sessions').insert({
        user_id: user.id,
        intended_minutes: minutes,
        actual_seconds: actualSeconds,
        distraction: distraction || null
      })

      router.push('/')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Failed to save session')
    }
  }

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <h1 className="text-3xl font-bold text-orange-500">⏱️ Focus Graveyard</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        {!isRunning ? (
          <>
            <h2 className="text-4xl font-bold mb-8">Start Focus Session</h2>
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-4">
                How long do you want to focus?
              </label>
              <input
                type="number"
                min="1"
                max="240"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center text-2xl focus:outline-none focus:border-orange-500"
              />
              <span className="text-2xl ml-2">minutes</span>
            </div>
            <button
              onClick={startTimer}
              className="bg-orange-600 hover:bg-orange-700 px-12 py-4 rounded-lg font-bold text-xl transition-colors"
            >
              Start Timer
            </button>
          </>
        ) : (
          <>
            <div className="text-8xl font-bold mb-12 text-orange-500">
              {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
            </div>
            <p className="text-xl text-gray-400 mb-8">
              {minutes} minute session in progress
            </p>
            <button
              onClick={giveUp}
              className="bg-red-600 hover:bg-red-700 px-12 py-4 rounded-lg font-bold text-xl transition-colors"
            >
              I Got Distracted 💀
            </button>
          </>
        )}
      </div>
    </div>
  )
}
