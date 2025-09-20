import { useAppContext } from './hooks/useAppContext'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import FacultyDashboard from './components/FacultyDashboard'
import TimetableViewer from './components/TimetableViewer'
import DataUpload from './components/DataUpload'
import Navbar from './components/Navbar'

function App() {
  const { state } = useAppContext()

  const renderCurrentView = () => {
    if (!state.isLoggedIn) {
      return <Login />
    }

    // For students, always show the integrated dashboard (no separate timetable view)
    if (state.currentUser?.role === 'student') {
      return <StudentDashboard />
    }

    // For admin and faculty, allow navigation between views
    switch (state.currentView) {
      case 'dashboard':
        if (state.currentUser?.role === 'admin') {
          return <AdminDashboard />
        } else if (state.currentUser?.role === 'faculty') {
          return <FacultyDashboard />
        }
        break
      case 'timetable':
        // Only admin and faculty can access separate timetable view
        if (state.currentUser?.role === 'admin' || state.currentUser?.role === 'faculty') {
          return <TimetableViewer />
        }
        // If student somehow gets here, redirect to dashboard
        return <StudentDashboard />
      case 'upload':
        // Only admin can access upload
        if (state.currentUser?.role === 'admin') {
          return <DataUpload />
        }
        // Non-admin users get redirected to their dashboard
        if (state.currentUser?.role === 'faculty') {
          return <FacultyDashboard />
        }
        return <StudentDashboard />
      default:
        // Default views by role
        if (state.currentUser?.role === 'admin') {
          return <AdminDashboard />
        } else if (state.currentUser?.role === 'faculty') {
          return <FacultyDashboard />
        } else if (state.currentUser?.role === 'student') {
          return <StudentDashboard />
        }
        return <Login />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {state.isLoggedIn && <Navbar />}
      {renderCurrentView()}
    </div>
  )
}

export default App