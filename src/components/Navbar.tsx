import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'

export default function Navbar() {
  const { state, logout, setCurrentView } = useAppContext()

  const getMenuItems = () => {
    const role = state.currentUser?.role
    const baseItems = [
      { label: 'Dashboard', view: 'dashboard' as const, icon: '🏠' }
    ]

    if (role === 'admin') {
      return [
        ...baseItems,
        { label: 'Timetables', view: 'timetable' as const, icon: '📅' },
        { label: 'Upload Data', view: 'upload' as const, icon: '📤' }
      ]
    } else if (role === 'faculty') {
      return [
        ...baseItems,
        { label: 'My Schedule', view: 'timetable' as const, icon: '📅' }
      ]
    } else {
      // Students only see Dashboard (which now includes their integrated timetable)
      return baseItems
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-gray-800 hidden sm:block">EduSmart</span>
            </div>

            <div className="hidden md:flex space-x-1">
              {getMenuItems().map((item) => (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    state.currentView === item.view
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">{state.currentUser?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{state.currentUser?.role}</p>
            </div>
            
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {state.currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>

            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200 bg-white/95">
        <div className="px-4 py-2 space-y-1">
          {getMenuItems().map((item) => (
            <button
              key={item.label}
              onClick={() => setCurrentView(item.view)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                state.currentView === item.view
                  ? 'bg-gradient-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}