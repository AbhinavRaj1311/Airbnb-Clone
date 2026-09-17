import { Routes, Route } from 'react-router-dom'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import PhotoTourPage from './pages/PhotoTourPage'
import ProfilePage from './pages/ProfilePage'
import TripsPage from './pages/TripsPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/listing/:id/photos" element={<PhotoTourPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App
