import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import CustomerHome from './pages/customer/Home'
import Explore from './pages/customer/Explore'
import OrgProfile from './pages/customer/OrgProfile'
import ServiceDetail from './pages/customer/ServiceDetail'
import BookFlow from './pages/customer/BookFlow'
import Appointments from './pages/customer/Appointments'
import AppointmentDetail from './pages/customer/AppointmentDetail'
import Queue from './pages/customer/Queue'
import Profile from './pages/customer/Profile'
import Notifications from './pages/customer/Notifications'
import Reviews from './pages/customer/Reviews'

import WorkerDashboard from './pages/worker/Dashboard'
import OrgDashboard from './pages/organization/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Landing />
  const dest = {
    customer: '/customer',
    worker: '/worker',
    organization: '/organization',
    admin: '/admin',
  }[role] || '/'
  return <Navigate to={dest} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerHome /></ProtectedRoute>} />
          <Route path="/customer/explore" element={<ProtectedRoute roles={['customer']}><Explore /></ProtectedRoute>} />
          <Route path="/customer/org/:orgId" element={<ProtectedRoute roles={['customer']}><OrgProfile /></ProtectedRoute>} />
          <Route path="/customer/org/:orgId/service/:serviceId" element={<ProtectedRoute roles={['customer']}><ServiceDetail /></ProtectedRoute>} />
          <Route path="/customer/org/:orgId/book" element={<ProtectedRoute roles={['customer']}><BookFlow /></ProtectedRoute>} />
          <Route path="/customer/org/:orgId/reviews" element={<ProtectedRoute roles={['customer']}><Reviews /></ProtectedRoute>} />
          <Route path="/customer/appointments" element={<ProtectedRoute roles={['customer']}><Appointments /></ProtectedRoute>} />
          <Route path="/customer/appointments/:id" element={<ProtectedRoute roles={['customer']}><AppointmentDetail /></ProtectedRoute>} />
          <Route path="/customer/queue" element={<ProtectedRoute roles={['customer']}><Queue /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
          <Route path="/customer/notifications" element={<ProtectedRoute roles={['customer']}><Notifications /></ProtectedRoute>} />
          <Route path="/customer/settings" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
          <Route path="/customer/reviews" element={<ProtectedRoute roles={['customer']}><Reviews /></ProtectedRoute>} />
          <Route path="/customer/favourites" element={<ProtectedRoute roles={['customer']}><Explore /></ProtectedRoute>} />
          <Route path="/customer/help" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute roles={['customer']}><Explore /></ProtectedRoute>} />

          <Route path="/worker" element={<ProtectedRoute roles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/*" element={<ProtectedRoute roles={['worker']}><WorkerDashboard /></ProtectedRoute>} />

          <Route path="/organization" element={<ProtectedRoute roles={['organization']}><OrgDashboard /></ProtectedRoute>} />
          <Route path="/organization/*" element={<ProtectedRoute roles={['organization']}><OrgDashboard /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
