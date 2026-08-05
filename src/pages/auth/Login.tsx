import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05b802" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await useAuthStore.getState().login(userName, password)
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-da-surface border border-da-border rounded-xl p-8 w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <PencilIcon />
            <span className="text-da-green font-bold text-lg">OpenSketch</span>
          </div>
          <h1 className="text-2xl font-bold text-da-text">Sign In</h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Your username"
              autoFocus
              required
              className="bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-da-green hover:bg-da-green-hover text-white font-semibold py-2 rounded w-full disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-da-subtle text-center">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-da-green hover:text-da-green-hover">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
