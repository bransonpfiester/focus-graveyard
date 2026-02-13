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

export default function SessionCard({ session }: { session: FocusSession }) {
  const actualMinutes = Math.floor(session.actual_seconds / 60)
  const actualSeconds = session.actual_seconds % 60
  const percentage = Math.round((session.actual_seconds / (session.intended_minutes * 60)) * 100)
  
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
      {/* Tombstone shape */}
      <div className="bg-gray-900 rounded-t-full rounded-b-lg p-6 mb-4 border-2 border-gray-600">
        <div className="text-center">
          <p className="text-4xl mb-2">💀</p>
          <p className="text-sm text-gray-400 mb-2">R.I.P.</p>
          <h3 className="text-xl font-bold text-orange-400 mb-2">
            {session.intended_minutes} Minute Focus
          </h3>
          <p className="text-lg font-semibold text-gray-300">
            Lasted {actualMinutes}m {actualSeconds}s
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {percentage}% complete
          </p>
        </div>
      </div>

      {/* Distraction */}
      {session.distraction && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 italic text-center">
            &quot;{session.distraction}&quot;
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        Buried by <span className="text-gray-400">@{session.profiles.username}</span>
      </div>
    </div>
  )
}
