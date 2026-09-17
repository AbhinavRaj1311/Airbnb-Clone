import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '60vh', fontSize: '14px', color: '#717171'
      }}>
        Loading…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/?login=true" replace />
  }

  return children
}

export default ProtectedRoute
