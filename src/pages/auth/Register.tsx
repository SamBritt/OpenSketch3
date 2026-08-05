import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05b802" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
)

export default function Register() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await useAuthStore.getState().register(userName, firstName, lastName, password)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Registration failed. Please try again.')
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
          <h1 className="text-2xl font-bold text-da-text">Create Account</h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Choose a username"
              autoFocus
              required
              className="bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Last name"
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
              placeholder="Choose a password"
              required
              className="bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-da-muted uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-da-subtle text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-da-green hover:text-da-green-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
