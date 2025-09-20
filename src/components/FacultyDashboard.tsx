import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import { toast } from 'react-toastify'

export default function FacultyDashboard() {
  const { state, setCurrentView } = useAppContext()
  const [preferences, setPreferences] = useState({
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
    startTime: '09:00',
    endTime: '17:00',
    maxHoursPerDay: 6,
    subjects: ['CS301', 'CS401']
  })

  const teachingSchedule = [
    { time: '08:00-09:00', mon: 'Free', tue: 'CS301 Intro to Programming A-Hall-CS-101', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '09:00-10:00', mon: 'Free', tue: 'Free', wed: 'CS301 Quantum Physics A-Hall-CS-101', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '10:00-11:00', mon: 'CS301 Quantum Physics A-Hall-CS-101', tue: 'Free', wed: 'Free', thu: 'CS201 Calculus-II B-Hall-CS-203', fri: 'Free', sat: 'Free' },
    { time: '11:00-12:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '12:00-13:00', mon: 'LUNCH', tue: 'LUNCH', wed: 'LUNCH', thu: 'LUNCH', fri: 'LUNCH', sat: 'LUNCH' },
    { time: '13:00-14:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '14:00-15:00', mon: 'Free', tue: 'CS301 Intro to Programming A-Hall-CS-101', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '15:00-16:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '16:00-17:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' },
    { time: '17:00-18:00', mon: 'Free', tue: 'Free', wed: 'Free', thu: 'Free', fri: 'Free', sat: 'Free' }
  ]

  const notifications = [
    { id: 1, message: "Your extra class request for CS 25-27 submitted successfully.", time: "1 hour ago", type: "success" },
    { id: 2, message: "Leave request for Oct 25-27 submitted successfully.", time: "3 hours ago", type: "info" },
    { id: 3, message: "Reminder: Department meeting on Monday at 3 PM.", time: "5 hours ago", type: "reminder" },
    { id: 4, message: "New PH502 assigned for next semester.", time: "1 day ago", type: "assignment" }
  ]

  const quickActions = [
    { label: 'Preferences', icon: '⚙️', action: 'preferences' },
    { label: 'Leave', icon: '📅', action: 'leave' },
    { label: 'Extra Classes / Quiz', icon: '📝', action: 'extra' }
  ]

  const [showPreferences, setShowPreferences] = useState(false)
  const [showLeave, setShowLeave] = useState(false)
  const [showExtra, setShowExtra] = useState(false)

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  })

  const [extraForm, setExtraForm] = useState({
    subject: '',
    batch: '',
    date: '',
    time: '',
    type: 'class'
  })

  const handleAction = (action: string) => {
    setShowPreferences(action === 'preferences')
    setShowLeave(action === 'leave')
    setShowExtra(action === 'extra')
  }

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully!")
    setShowPreferences(false)
  }

  const handleSubmitLeave = () => {
    toast.success("Leave request submitted successfully!")
    setShowLeave(false)
    setLeaveForm({ startDate: '', endDate: '', reason: '' })
  }

  const handleSubmitExtra = () => {
    toast.success("Extra class request submitted successfully!")
    setShowExtra(false)
    setExtraForm({ subject: '', batch: '', date: '', time: '', type: 'class' })
  }

  const getClassColor = (subject: string) => {
    if (subject === 'Free') return 'bg-gray-100 text-gray-500'
    if (subject === 'LUNCH') return 'bg-orange-100 text-orange-600'
    if (subject.includes('CS301')) return 'bg-blue-100 text-blue-700'
    if (subject.includes('CS201')) return 'bg-purple-100 text-purple-700'
    if (subject.includes('CS401')) return 'bg-green-100 text-green-700'
    return 'bg-indigo-100 text-indigo-700'
  }

  if (showPreferences || showLeave || showExtra) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-2xl shadow-2xl p-8"
          >
            {/* Preferences Form */}
            {showPreferences && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Teaching Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Teaching Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={preferences.preferredDays.includes(day.toLowerCase())}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences(prev => ({
                                  ...prev,
                                  preferredDays: [...prev.preferredDays, day.toLowerCase()]
                                }))
                              } else {
                                setPreferences(prev => ({
                                  ...prev,
                                  preferredDays: prev.preferredDays.filter(d => d !== day.toLowerCase())
                                }))
                              }
                            }}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Time</label>
                      <select
                        value={preferences.startTime}
                        onChange={(e) => setPreferences(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="08:00">08:00 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred End Time</label>
                      <select
                        value={preferences.endTime}
                        onChange={(e) => setPreferences(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="15:00">15:00 PM</option>
                        <option value="16:00">16:00 PM</option>
                        <option value="17:00">17:00 PM</option>
                        <option value="18:00">18:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Hours/Day</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={preferences.maxHoursPerDay}
                      onChange={(e) => setPreferences(prev => ({ ...prev, maxHoursPerDay: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleSavePreferences}
                    className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Leave Form */}
            {showLeave && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Leave</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">START DATE</label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">END DATE</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Please provide reason for leave..."
                  />
                </div>
                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleSubmitLeave}
                    className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Submit Leave Request
                  </button>
                  <button
                    onClick={() => setShowLeave(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Extra Classes Form */}
            {showExtra && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Extra Classes / Quiz</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SUBJECT</label>
                    <input
                      type="text"
                      value={extraForm.subject}
                      onChange={(e) => setExtraForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter subject code or name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BATCH</label>
                    <select
                      value={extraForm.batch}
                      onChange={(e) => setExtraForm(prev => ({ ...prev, batch: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Batch</option>
                      <option value="CSE-3A">CSE-3A</option>
                      <option value="CSE-3B">CSE-3B</option>
                      <option value="ME-3A">ME-3A</option>
                      <option value="EE-3A">EE-3A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DATE</label>
                    <input
                      type="date"
                      value={extraForm.date}
                      onChange={(e) => setExtraForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TIME</label>
                    <input
                      type="time"
                      value={extraForm.time}
                      onChange={(e) => setExtraForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="class"
                        checked={extraForm.type === 'class'}
                        onChange={(e) => setExtraForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Extra Class</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="quiz"
                        checked={extraForm.type === 'quiz'}
                        onChange={(e) => setExtraForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Quiz</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleSubmitExtra}
                    className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowExtra(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-white mb-2">Hi, Professor {state.currentUser?.name?.split(' ')[1]} 👨‍🏫 Here's your Dashboard</h1>
              <p className="text-white/80">Your classes for the current week.</p>
            </div>
            <button
              onClick={() => setCurrentView('timetable')}
              className="mt-4 sm:mt-0 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              View Time Table
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(action.action)}
                      className="w-full text-left p-4 bg-white/50 hover:bg-white/70 rounded-xl transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <span className="font-medium text-gray-800">{action.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Teaching Preferences */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Teaching Preferences</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Set your preferred teaching days and hours.</p>
                  
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Preferred Teaching Days</p>
                    <div className="flex flex-wrap gap-1">
                      {preferences.preferredDays.map(day => (
                        <span key={day} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="font-medium text-gray-700">Preferred Start Time</p>
                      <p className="text-gray-600">{preferences.startTime}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Preferred End Time</p>
                      <p className="text-gray-600">{preferences.endTime}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction('preferences')}
                  className="w-full mt-4 bg-gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Save Preferences
                </motion.button>
              </div>
            </div>

            {/* Teaching Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Teaching Schedule</h2>
                <p className="text-gray-600 text-sm mb-6">Your classes for the current week.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Time</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Mon</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Tue</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Wed</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Thu</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Fri</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Sat</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Sun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachingSchedule.map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="py-3 px-2 font-medium text-gray-700">{row.time}</td>
                          {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat, 'Free'].map((subject, i) => (
                            <td key={i} className="py-3 px-2 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${getClassColor(subject)}`}>
                                {subject === 'Free' ? 'Free' : subject.length > 15 ? subject.substring(0, 15) + '...' : subject}
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

            {/* Notifications */}
            <div className="lg:col-span-1 space-y-6">
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
                <p className="text-gray-600 text-sm mb-4">Important updates and requests status.</p>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="notification-item rounded-lg p-3"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">
                          {notification.type === 'success' ? '✅' :
                           notification.type === 'info' ? '📅' :
                           notification.type === 'reminder' ? '⏰' : '📝'}
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}