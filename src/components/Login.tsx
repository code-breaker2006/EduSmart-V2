import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import { toast } from 'react-toastify'

const demoUsers = {
  'admin@bitc.edu.in': {
    username: 'admin@bitc.edu.in',
    password: 'admin123',
    role: 'admin' as const,
    name: 'System Administrator'
  },
  'cse.faculty1@bitc.edu.in': {
    username: 'cse.faculty1@bitc.edu.in',
    password: 'faculty123',
    role: 'faculty' as const,
    name: 'Jagat Gopal'
  },
  'student1@bitc.edu.in': {
    username: 'student1@bitc.edu.in',
    password: 'student123',
    role: 'student' as const,
    name: 'Bakhshi Majumdar'
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'faculty' | 'student'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAppContext()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = demoUsers[email as keyof typeof demoUsers]
    
    if (user && user.password === password && user.role === role) {
      login(user)
      toast.success(`Welcome back, ${user.name}!`)
    } else {
      toast.error('Invalid credentials. Please check your email, password, and role.')
    }
    
    setIsLoading(false)
  }

  const handleQuickLogin = (userType: 'admin' | 'faculty' | 'student') => {
    const userMap = {
      admin: 'admin@bitc.edu.in',
      faculty: 'cse.faculty1@bitc.edu.in',
      student: 'student1@bitc.edu.in'
    }
    
    const email = userMap[userType]
    const user = demoUsers[email as keyof typeof demoUsers]
    
    setEmail(email)
    setPassword(user.password)
    setRole(userType)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="gradient-card rounded-2xl shadow-2xl p-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">College Timetable Scheduler</h1>
            <p className="text-gray-600">Login to view your schedule.</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.edu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'faculty' | 'student')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Quick Demo Access:</p>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'faculty', 'student'] as const).map((userType) => (
                <button
                  key={userType}
                  onClick={() => handleQuickLogin(userType)}
                  className="text-xs py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors capitalize"
                >
                  {userType}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}