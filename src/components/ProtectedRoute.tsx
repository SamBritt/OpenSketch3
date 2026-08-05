import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Loading…
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <>{children}</>
}
