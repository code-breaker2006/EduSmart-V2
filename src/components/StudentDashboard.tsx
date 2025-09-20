import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import { toast } from 'react-toastify'

export default function StudentDashboard() {
  const { state, setCurrentView } = useAppContext()
  const [selectedBatch, setSelectedBatch] = useState('CSE-3A')
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 1, subject: 'Physics I', time: 'Today, 08:00 - 10:00 @ LH-101', type: 'theory' },
    { id: 2, subject: 'Calculus II', time: 'Today, 11:00 - 12:00 @ CR-203', type: 'theory' },
    { id: 3, subject: 'Intro to Programming', time: 'Today, 13:45 - 15:45 @ CSL-3', type: 'lab' },
    { id: 4, subject: 'Physics Lab', time: 'Today, 15:00 - 18:00 @ PL-1', type: 'lab' }
  ])

  const notifications = [
    { id: 1, message: "Tomorrow: Quiz in Physics Lab", time: "10 mins ago", type: "quiz" },
    { id: 2, message: "Assignment 2 for Intro to Programming is due end of week", time: "1 hour ago", type: "assignment" },
    { id: 3, message: "Physics 1 lecture rescheduled to LH-102 for next week", time: "2 hours ago", type: "schedule" }
  ]

  const weeklySchedule = [
    { time: '08:00', mon: 'Physics I', tue: 'Chemistry Basics', wed: 'Physics I', thu: 'Calculus II', fri: 'Free', sat: 'Free' },
    { time: '09:00', mon: 'Free', tue: 'Intro to Programming', wed: 'Free', thu: 'Free', fri: 'Calculus II', sat: 'Free' },
    { time: '10:00', mon: 'Calculus II', tue: 'Free', wed: 'Calculus II', thu: 'Intro to Programming', fri: 'Free', sat: 'Free' },
    { time: '11:00', mon: 'Free', tue: 'Physics I', wed: 'Free', thu: 'Free', fri: 'Chemistry Basics', sat: 'Free' },
    { time: '12:00', mon: 'LUNCH', tue: 'LUNCH', wed: 'LUNCH', thu: 'LUNCH', fri: 'LUNCH', sat: 'LUNCH' },
    { time: '13:00', mon: 'Free', tue: 'Free', wed: 'Chemistry Basics', thu: 'Free', fri: 'Physics Lab', sat: 'Free' },
    { time: '14:00', mon: 'Student Meeting', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Physics Lab', sat: 'Free' },
    { time: '15:00', mon: 'Free', tue: 'Physics Tutorial', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '16:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Calculus B', fri: 'Free', sat: 'Free' },
    { time: '17:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' }
  ]

  const batches = ['CSE-3A', 'CSE-3B', 'ME-3A', 'ME-3B', 'EE-3A', 'EE-3B']

  const handleLeaveRequest = () => {
    toast.success("Leave request submitted successfully!")
  }

  const handleViewFullTimetable = () => {
    setCurrentView('timetable')
  }

  const getSubjectColor = (subject: string) => {
    if (subject === 'Free') return 'bg-gray-100 text-gray-500'
    if (subject === 'LUNCH') return 'bg-orange-100 text-orange-600'
    if (subject.includes('Physics')) return 'bg-blue-100 text-blue-700'
    if (subject.includes('Chemistry')) return 'bg-green-100 text-green-700'
    if (subject.includes('Calculus')) return 'bg-purple-100 text-purple-700'
    if (subject.includes('Programming')) return 'bg-red-100 text-red-700'
    return 'bg-indigo-100 text-indigo-700'
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Hi, {state.currentUser?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-white/80">Here's your schedule for a productive week ahead.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaveRequest}
              className="mt-4 sm:mt-0 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              📋 Request Leave
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Timetable */}
            <div className="lg:col-span-2 space-y-6">
              {/* Batch Selector */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Weekly Timetable</h2>
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {batches.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleViewFullTimetable}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Full →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Time</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Monday</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Tuesday</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Wednesday</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Thursday</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Friday</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Saturday</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklySchedule.map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="py-3 px-2 font-medium text-gray-700">{row.time}</td>
                          {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((subject, i) => (
                            <td key={i} className="py-3 px-2 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${getSubjectColor(subject)}`}>
                                {subject}
                              </span>
                            </td>
                          ))}
                        </motion.tr>
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
                  {upcomingClasses.map((class_, index) => (
                    <motion.div
                      key={class_.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        class_.type === 'lab' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{class_.subject}</p>
                        <p className="text-xs text-gray-600">{class_.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="notification-item rounded-lg p-3"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">
                          {notification.type === 'quiz' ? '📝' : 
                           notification.type === 'assignment' ? '📚' : '📅'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Classes</span>
                    <span className="font-semibold text-gray-800">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lab Sessions</span>
                    <span className="font-semibold text-gray-800">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Free Periods</span>
                    <span className="font-semibold text-gray-800">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Assignments Due</span>
                    <span className="font-semibold text-red-600">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}