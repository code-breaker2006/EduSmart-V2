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

    switch (state.currentView) {
      case 'dashboard':
        if (state.currentUser?.role === 'admin') {
          return <AdminDashboard />
        } else if (state.currentUser?.role === 'faculty') {
          return <FacultyDashboard />
        } else if (state.currentUser?.role === 'student') {
          return <StudentDashboard />
        }
        break
      case 'timetable':
        return <TimetableViewer />
      case 'upload':
        return <DataUpload />
      default:
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