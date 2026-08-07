
import './App.css';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Profile, Landing, ImageDetail, Create, Login, Register, Settings } from '@/pages'
import { Avatar, ProtectedRoute } from '@/components'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useRef, useState } from 'react';

const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05b802" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
)

function App() {
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    useAuthStore.getState().restoreSession()
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const navLinkClass = (path: string) =>
    `text-sm transition-colors ${location.pathname === path ? 'text-da-green' : 'text-da-subtle hover:text-da-text'}`

  return (
    <div className="bg-da-bg min-h-screen text-da-text">
      <nav className="sticky top-0 z-50 bg-da-bg border-b border-da-border px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <PencilIcon />
          <span className="text-da-green font-bold text-lg">OpenSketch</span>
        </Link>

        <div className="flex-1 mx-6">
          <input
            placeholder="Search art, artists..."
            className="w-full max-w-md bg-da-elevated border border-da-border rounded-full px-4 py-1.5 text-sm text-da-text placeholder-da-muted focus:outline-none focus:border-da-green transition-colors"
          />
        </div>

        <ul className="flex items-center gap-4">
          <li>
            <Link to="/" className={navLinkClass('/')}>Explore</Link>
          </li>

          {user && (
            <li>
              <Link to="/create" className={navLinkClass('/create')}>Create</Link>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="border border-da-border text-da-text text-sm px-3 py-1 rounded hover:border-da-green transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-da-green text-white text-sm px-3 py-1 rounded hover:bg-da-green-hover font-medium transition-colors"
                >
                  Join
                </Link>
              </li>
            </>
          ) : (
            <li>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center"
                >
                  <Avatar userName={user.userName} avatarUrl={user.avatarUrl} size="sm" />
                </button>

                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 bg-da-surface border border-da-border rounded-lg shadow-xl w-48 py-1 z-50">
                    <li>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-da-text hover:bg-da-elevated transition-colors"
                      >
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-da-text hover:bg-da-elevated transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path=":userName">
          <Route index element={<Profile />} />
          <Route path=":id" element={<ImageDetail />} />
        </Route>
      </Routes>

      <footer className="bg-da-surface border-t border-da-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-da-subtle">
          <span className="text-da-green font-semibold">OpenSketch</span>
          <span>&#169; 2026 OpenSketch. All rights reserved.</span>
          <div className="flex gap-4">
            <span>About</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
