import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import { toast } from 'react-toastify'
import Calendar from './Calendar'

export default function StudentDashboard() {
  const { state } = useAppContext()
  const [view, setView] = useState('week')
  const [timetableData, setTimetableData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [weeklyStats, setWeeklyStats] = useState({
    totalClasses: 0,
    labSessions: 0,
    freePeriods: 0,
    assignmentsDue: 2
  })

  const notifications = [
    { id: 1, message: "Tomorrow: Quiz in Physics Lab", time: "10 mins ago", type: "quiz" },
    { id: 2, message: "Assignment 2 for Intro to Programming is due end of week", time: "1 hour ago", type: "assignment" },
    { id: 3, message: "Physics 1 lecture rescheduled to LH-102", time: "1 hour ago", type: "schedule" }
  ]

  // Helper functions for event coloring
  const getEventColor = (type: string) => {
    const colors = {
      theory: '#3b82f6',
      lab: '#10b981', 
      practical: '#f59e0b',
      seminar: '#8b5cf6',
      workshop: '#ef4444',
      default: '#6b7280'
    }
    return colors[type as keyof typeof colors] || colors.default
  }

  const getEventBorderColor = (type: string) => {
    const colors = {
      theory: '#1d4ed8',
      lab: '#047857',
      practical: '#d97706',
      seminar: '#7c3aed', 
      workshop: '#dc2626',
      default: '#4b5563'
    }
    return colors[type as keyof typeof colors] || colors.default
  }

  // Fix date from 2024 to 2025
  const updateEventDates = (events: any[]) => {
    return events.map(event => ({
      ...event,
      start: event.start.replace('2024-', '2025-'),
      end: event.end.replace('2024-', '2025-')
    }))
  }

  // Load student timetable data
  useEffect(() => {
    const loadStudentTimetable = async () => {
      setLoading(true)
      
      try {
        console.log('🔄 Loading student timetable data...')
        
        // Load student-specific schedule
        const response = await fetch('/data/timetable_student_sample.json')
        if (!response.ok) throw new Error('Student data not found')
        
        const data = await response.json()
        const events = data.events || []
        console.log(`✅ Loaded ${events.length} events for student: ${data.student_name}`)
        
        // Fix dates and process events
        const eventsWithFixedDates = updateEventDates(events)
        
        // Add colors to events
        const processedEvents = eventsWithFixedDates.map((event: any) => ({
          ...event,
          backgroundColor: getEventColor(event.extendedProps?.type || 'theory'),
          borderColor: getEventBorderColor(event.extendedProps?.type || 'theory')
        }))
        
        setTimetableData(processedEvents)
        
        // Extract upcoming classes (next 4 classes)
        const today = new Date()
        const upcoming = processedEvents
          .filter((event: any) => new Date(event.start) >= today)
          .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 4)
          .map((event: any) => ({
            id: event.id,
            subject: event.extendedProps?.course_name || event.title,
            time: formatEventTime(event),
            type: event.extendedProps?.type || 'theory',
            room: event.extendedProps?.room,
            faculty: event.extendedProps?.faculty
          }))
        
        setUpcomingClasses(upcoming)
        
        // Calculate weekly stats
        const stats = calculateWeeklyStats(processedEvents)
        setWeeklyStats(stats)
        
        console.log('🎉 Student dashboard data loaded successfully')
        
      } catch (error) {
        console.error('❌ Error loading student data:', error)
        
        // Fallback data
        const fallbackData = [
          {
            id: '1',
            title: 'CS301 - Database Management',
            start: '2025-09-23T09:00:00',
            end: '2025-09-23T10:00:00',
            extendedProps: {
              course_name: 'Database Management',
              faculty: 'Madhavi Kashyap',
              room: 'LH-05',
              type: 'theory'
            },
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8'
          }
        ]
        setTimetableData(fallbackData)
        setUpcomingClasses([{
          id: '1',
          subject: 'Database Management',
          time: 'Today, 09:00 - 10:00 @ LH-05',
          type: 'theory',
          room: 'LH-05',
          faculty: 'Madhavi Kashyap'
        }])
      }
      
      setLoading(false)
    }

    loadStudentTimetable()
  }, [])

  const formatEventTime = (event: any) => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const today = new Date()
    
    let dayLabel = 'Today'
    if (start.toDateString() === new Date(today.getTime() + 86400000).toDateString()) {
      dayLabel = 'Tomorrow'
    } else if (start.toDateString() !== today.toDateString()) {
      dayLabel = start.toLocaleDateString('en-US', { weekday: 'short' })
    }
    
    const startTime = start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
    const endTime = end.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
    
    return `${dayLabel}, ${startTime} - ${endTime} @ ${event.extendedProps?.room}`
  }

  const calculateWeeklyStats = (events: any[]) => {
    const thisWeekStart = new Date()
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
    
    const thisWeekEnd = new Date(thisWeekStart)
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6)
    
    const thisWeekEvents = events.filter((event: any) => {
      const eventDate = new Date(event.start)
      return eventDate >= thisWeekStart && eventDate <= thisWeekEnd
    })
    
    const totalClasses = thisWeekEvents.length
    const labSessions = thisWeekEvents.filter((event: any) => 
      event.extendedProps?.type === 'lab'
    ).length
    
    // Calculate free periods (rough estimate)
    const freePeriods = Math.max(0, (6 * 10) - totalClasses) // 6 days, 10 slots per day
    
    return {
      totalClasses,
      labSessions,
      freePeriods,
      assignmentsDue: 2 // Keep static for now
    }
  }

  const handleLeaveRequest = () => {
    toast.success("Leave request submitted successfully!")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab': return 'bg-green-100 text-green-700'
      case 'theory': return 'bg-blue-100 text-blue-700'
      case 'practical': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Hi, {state.currentUser?.name?.split(' ')[0]}! 👋
              </h1>
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
              {/* Timetable View Controls */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">My Timetable</h2>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {['Day', 'Week', 'Month'].map((viewType) => (
                      <button
                        key={viewType}
                        onClick={() => setView(viewType.toLowerCase())}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                          view === viewType.toLowerCase()
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {viewType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar Component */}
                <div className="calendar-container">
                  {loading ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your schedule...</p>
                      </div>
                    </div>
                  ) : (
                    <Calendar 
                      events={timetableData || []}
                      view={view}
                      height="500px"
                    />
                  )}
                </div>

                {/* Data Status */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    📊 <strong>Status:</strong> 
                    {timetableData ? `✅ Loaded ${timetableData.length} classes` : 'Loading...'} 
                    | 👨‍🎓 Personal Schedule
                    | 📅 Your classes only
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Classes</h3>
                <div className="space-y-3">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : upcomingClasses.length > 0 ? (
                    upcomingClasses.map((class_, index) => (
                      <motion.div
                        key={class_.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${
                            class_.type === 'lab' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{class_.subject}</p>
                            <p className="text-xs text-gray-600">{class_.time}</p>
                            {class_.faculty && (
                              <p className="text-xs text-gray-500">👨‍🏫 {class_.faculty}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getTypeColor(class_.type)}`}>
                            {class_.type}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming classes today</p>
                  )}
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

              {/* Weekly Stats */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Classes</span>
                    <span className="font-semibold text-gray-800">{weeklyStats.totalClasses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lab Sessions</span>
                    <span className="font-semibold text-gray-800">{weeklyStats.labSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Theory Classes</span>
                    <span className="font-semibold text-gray-800">
                      {weeklyStats.totalClasses - weeklyStats.labSessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Assignments Due</span>
                    <span className="font-semibold text-red-600">{weeklyStats.assignmentsDue}</span>
                  </div>
                </div>
              </div>

              {/* Color Legend */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">Theory Classes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Lab Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm text-gray-600">Practical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-sm text-gray-600">Seminars</span>
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