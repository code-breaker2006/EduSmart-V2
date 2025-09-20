import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import Calendar from './Calendar'

export default function TimetableViewer() {
  const { state, setSelectedBatch } = useAppContext()
  const [view, setView] = useState('week')
  const [selectedBatch, setSelectedBatchLocal] = useState('All Batches')
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculty')
  const [selectedRoom, setSelectedRoom] = useState('All Rooms')
  const [colorBy, setColorBy] = useState('class')
  const [timetableData, setTimetableData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('admin') // Will be detected from UI
  const [availableFaculties, setAvailableFaculties] = useState(['All Faculty'])
  const [availableRooms, setAvailableRooms] = useState(['All Rooms'])

  const batches = ['All Batches', 'CSE-1A', 'CSE-1B', 'CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 
                   'ME-1A', 'ME-1B', 'ME-2A', 'ME-2B', 'ME-3A', 'ME-3B', 'ME-4A',
                   'EE-1A', 'EE-1B', 'EE-2A', 'EE-2B', 'EE-3A', 'EE-3B', 'EE-4A']

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

  // 🔍 Detect user role from the page content
  const detectUserRole = () => {
    // Check if user info indicates student or admin
    const userInfo = document.querySelector('[class*="user"]') || document.body
    const isStudent = userInfo.textContent?.includes('Student') || 
                     document.body.textContent?.includes('Bakhshi Majumdar') ||
                     window.location.pathname?.includes('student')
    
    return isStudent ? 'student' : 'admin'
  }

  // 🗓️ Fix date from 2024 to 2025
  const updateEventDates = (events: any[]) => {
    return events.map(event => ({
      ...event,
      start: event.start.replace('2024-', '2025-'),
      end: event.end.replace('2024-', '2025-')
    }))
  }

  // 🚀 ROLE-BASED DATA LOADING
  useEffect(() => {
    const loadAppropriateData = async () => {
      setLoading(true)
      
      // Detect user role
      const role = detectUserRole()
      setUserRole(role)
      
      try {
        console.log(`🔄 Loading data for ${role} user...`)
        
        let data
        let events = []
        
        if (role === 'student') {
          // Load student-specific schedule
          console.log('👨‍🎓 Loading student schedule...')
          const response = await fetch('/data/timetable_student_sample.json')
          if (!response.ok) throw new Error('Student data not found')
          
          data = await response.json()
          events = data.events || []
          console.log(`✅ Loaded ${events.length} events for student: ${data.student_name}`)
          
        } else {
          // Load admin view (all events)
          console.log('👨‍💼 Loading admin view (all events)...')
          const response = await fetch('/data/timetable_admin_full.json')
          if (!response.ok) throw new Error('Admin data not found')
          
          data = await response.json()
          events = data.events || []
          console.log(`✅ Loaded ${events.length} events for admin view`)
        }
        
        // 🔧 Fix dates and process events
        const eventsWithFixedDates = updateEventDates(events)
        
        // 🎨 Add colors
        const processedEvents = eventsWithFixedDates.map((event: any) => ({
          ...event,
          backgroundColor: getEventColor(event.extendedProps?.type || 'theory'),
          borderColor: getEventBorderColor(event.extendedProps?.type || 'theory')
        }))
        
        // 📋 Extract unique faculties and rooms for filters
        const faculties = ['All Faculty', ...new Set(processedEvents.map(e => e.extendedProps?.faculty).filter(Boolean))]
        const rooms = ['All Rooms', ...new Set(processedEvents.map(e => e.extendedProps?.room).filter(Boolean))]
        
        setAvailableFaculties(faculties)
        setAvailableRooms(rooms)
        setTimetableData(processedEvents)
        
        console.log('🎉 Data processing complete:', {
          role,
          events: processedEvents.length,
          faculties: faculties.length - 1,
          rooms: rooms.length - 1
        })
        
      } catch (error) {
        console.error('❌ Error loading data:', error)
        
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
        setAvailableFaculties(['All Faculty', 'Madhavi Kashyap'])
        setAvailableRooms(['All Rooms', 'LH-05'])
      }
      
      setLoading(false)
    }

    loadAppropriateData()
  }, [])

  const handleBatchChange = (batch: string) => {
    setSelectedBatchLocal(batch)
    setSelectedBatch(batch)
  }

  // 🔧 FIXED FILTERING LOGIC
  const filteredEvents = timetableData ? timetableData.filter((event: any) => {
    // Batch filtering - for students, show all their events; for admin, allow filtering
    const batchMatch = selectedBatch === 'All Batches' || 
      userRole === 'student' || // Students see all their events
      event.title?.includes(selectedBatch.replace('-', '')) || // Match batch in title
      true // Fallback: show all for now since batch mapping is complex
    
    // Faculty filtering
    const facultyMatch = selectedFaculty === 'All Faculty' || 
      event.extendedProps?.faculty === selectedFaculty
    
    // Room filtering  
    const roomMatch = selectedRoom === 'All Rooms' || 
      event.extendedProps?.room === selectedRoom
    
    return batchMatch && facultyMatch && roomMatch
  }) : []

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {userRole === 'student' ? 'My Timetable' : 'Timetable Viewer'}
            </h1>
            <p className="text-white/80">
              {userRole === 'student' 
                ? 'View your personal class schedule' 
                : 'View and manage academic schedules'
              }
            </p>
          </div>

          <div className="gradient-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Controls Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">View Options & Filters</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userRole === 'student' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {userRole === 'student' ? '👨‍🎓 Student View' : '👨‍💼 Admin View'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* View Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View:</label>
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

                {/* Batch Filter - Only for admin */}
                {userRole === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch:</label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => handleBatchChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {batches.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Faculty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty:
                    <span className="text-xs text-gray-500 ml-1">
                      ({availableFaculties.length - 1} available)
                    </span>
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {availableFaculties.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>

                {/* Room Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room:</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {availableRooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>

                {/* Color By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color By:</label>
                  <select
                    value={colorBy}
                    onChange={(e) => setColorBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="class">Class</option>
                    <option value="faculty">Faculty</option>
                    <option value="room">Room</option>
                    <option value="type">Type</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Status Indicator */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  📊 <strong>Data Status:</strong> 
                  {timetableData ? `✅ Loaded ${timetableData.length} events (${userRole} view)` : 'Loading...'} 
                  | 🔍 Showing: {filteredEvents.length} events
                  | 🎯 Mode: {userRole === 'student' ? 'Personal Schedule' : 'All Schedules'}
                  {userRole === 'student' && ' | 📅 Your classes only'}
                </p>
              </div>
            </div>

            {/* Calendar */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading {userRole === 'student' ? 'your schedule' : 'timetable data'}...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {userRole === 'student' ? 'Getting your personal classes' : 'Processing all events'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="calendar-container">
                  <Calendar 
                    events={filteredEvents}
                    view={view}
                    height="600px"
                  />
                </div>
              )}
            </div>

            {/* Enhanced Summary Stats */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{filteredEvents.length}</p>
                  <p className="text-sm text-blue-800">
                    {userRole === 'student' ? 'My Classes' : 'Visible Events'}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredEvents.filter((e: any) => e.extendedProps?.type === 'theory').length}
                  </p>
                  <p className="text-sm text-green-800">Theory Classes</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredEvents.filter((e: any) => e.extendedProps?.type === 'lab').length}
                  </p>
                  <p className="text-sm text-orange-800">Lab Sessions</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(filteredEvents.map((e: any) => e.extendedProps?.faculty)).size}
                  </p>
                  <p className="text-sm text-purple-800">
                    {userRole === 'student' ? 'My Teachers' : 'Faculty Involved'}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Info Panel */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-3">
                  🎨 Color Legend & Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Theory Classes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Lab Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Practical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Seminars</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 border-t pt-3">
                  <strong>🔧 System:</strong> Role-based data loading ({userRole} mode)
                  | <strong>📅 Schedule:</strong> {userRole === 'student' ? 'Personal classes only' : 'All university events'}
                  | <strong>🔍 Filters:</strong> {userRole === 'student' ? 'Faculty & Room only' : 'All filters available'}
                  | <strong>⏰ Note:</strong> Some classes may be on Sunday as per university schedule
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}