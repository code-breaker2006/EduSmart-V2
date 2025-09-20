import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import { toast } from 'react-toastify'
import TimetableGenerator from './TimetableGenerator'

export default function AdminDashboard() {
  const { setCurrentView } = useAppContext()
  const [stats, setStats] = useState({
    totalCourses: 120,
    totalFaculty: 45,
    totalRooms: 60,
    conflictsResolved: 5
  })
  const [showGenerator, setShowGenerator] = useState(false)

  const upcomingTasks = [
    { id: 1, task: "Tomorrow: Quiz in Physics Lab", time: "10 mins ago" },
    { id: 2, task: "Assignment 2 for Intro to Programming is due end of week", time: "1 hour ago" },
    { id: 3, task: "Physics 1 lecture rescheduled to LH-102 for next week", time: "2 hours ago" }
  ]

  const handleGenerateTimetable = () => {
    setShowGenerator(true)
  }

  const handleUploadData = () => {
    setCurrentView('upload')
  }

  const handleViewTimetables = () => {
    setCurrentView('timetable')
  }

  if (showGenerator) {
    return <TimetableGenerator onComplete={() => setShowGenerator(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, Admin!</h1>
            <p className="text-white/80">Manage your institution's timetabling system</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload & Generate Section */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUploadData}
                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">Upload Course & Faculty Data</h3>
                      <p className="text-sm text-gray-600">Effortlessly import all necessary data for timetable generation.</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateTimetable}
                    className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">Generate Timetable</h3>
                      <p className="text-sm text-gray-600">Initiate the AI-powered timetable optimization process.</p>
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          Optimization typically takes 2-5 minutes
                        </span>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '📚', label: 'Total Courses', value: stats.totalCourses, color: 'bg-blue-500' },
                  { icon: '👨‍🏫', label: 'Total Faculty', value: stats.totalFaculty, color: 'bg-green-500' },
                  { icon: '🏫', label: 'Total Rooms', value: stats.totalRooms, color: 'bg-orange-500' },
                  { icon: '✅', label: 'Conflicts Resolved', value: stats.conflictsResolved, color: 'bg-purple-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="stat-card rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mini Timetable Preview */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mini Timetable Preview</h3>
                  <button
                    onClick={handleViewTimetables}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Full Timetable →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-600">Time</th>
                        <th className="text-left py-2 text-gray-600">Mon</th>
                        <th className="text-left py-2 text-gray-600">Tue</th>
                        <th className="text-left py-2 text-gray-600">Wed</th>
                        <th className="text-left py-2 text-gray-600">Thu</th>
                        <th className="text-left py-2 text-gray-600">Fri</th>
                        <th className="text-left py-2 text-gray-600">Sat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'
                      ].map((time, index) => (
                        <tr key={time} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-2 font-medium text-gray-700">{time}</td>
                          {['CS101-AM', 'Physics I', 'Chemistry Basics', 'CS201', 'Free', 'Weekend'].map((subject, i) => (
                            <td key={i} className="py-2">
                              {i < 5 && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  subject === 'Free' ? 'bg-gray-100 text-gray-500' : 
                                  subject.includes('CS') ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {subject}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Classes</h3>
                <div className="space-y-3">
                  {[
                    { subject: 'Physics I', time: 'Today, 08:00 - 10:00 @ LH-101', status: 'scheduled' },
                    { subject: 'Calculus II', time: 'Today, 11:00 - 12:00 @ CR-203', status: 'scheduled' },
                    { subject: 'Intro to Programming', time: 'Today, 13:45 - 15:45 @ CSL-3', status: 'lab' },
                    { subject: 'Physics Lab', time: 'Today, 15:00 - 18:00 @ PL-1', status: 'lab' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        item.status === 'lab' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.subject}</p>
                        <p className="text-xs text-gray-600">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                <div className="space-y-3">
                  {upcomingTasks.map((notification) => (
                    <div key={notification.id} className="notification-item rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800 mb-1">{notification.task}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}