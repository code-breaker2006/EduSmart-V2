import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'
import Calendar from './Calendar'

export default function TimetableViewer() {
  const { state, setSelectedBatch } = useAppContext()
  const [view, setView] = useState('week')
  const [selectedBatch, setSelectedBatchLocal] = useState('CSE-3A')
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculty')
  const [selectedRoom, setSelectedRoom] = useState('All Rooms')
  const [colorBy, setColorBy] = useState('class')
  const [timetableData, setTimetableData] = useState(null)
  const [loading, setLoading] = useState(true)

  const batches = ['All Batches', 'CSE-3A', 'CSE-3B', 'ME-3A', 'ME-3B', 'EE-3A', 'EE-3B']
  const faculties = ['All Faculty', 'Jagat Gopal', 'Madhavi Kashyap', 'Rohan Tata', 'Dr. Smith']
  const rooms = ['All Rooms', 'LH-01', 'LH-02', 'LH-03', 'CSE-LAB-1', 'ME-LAB-1', 'EE-LAB-1']

  // Mock timetable data
  const mockEvents = [
    {
      id: '1',
      title: 'Calculus I',
      start: '2024-09-16T09:00:00',
      end: '2024-09-16T10:30:00',
      extendedProps: {
        course_name: 'Calculus I',
        faculty: 'Dr. Smith',
        room: 'LH-01',
        type: 'theory',
        batch: 'CSE-3A'
      },
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8'
    },
    {
      id: '2',
      title: 'Linear Algebra',
      start: '2024-09-16T14:00:00',
      end: '2024-09-16T15:30:00',
      extendedProps: {
        course_name: 'Linear Algebra',
        faculty: 'Prof. Johnson',
        room: 'LH-02',
        type: 'theory',
        batch: 'CSE-3A'
      },
      backgroundColor: '#10b981',
      borderColor: '#047857'
    },
    {
      id: '3',
      title: 'Operating Systems',
      start: '2024-09-17T11:00:00',
      end: '2024-09-17T12:30:00',
      extendedProps: {
        course_name: 'Operating Systems',
        faculty: 'Dr. Wilson',
        room: 'CSE-LAB-1',
        type: 'lab',
        batch: 'CSE-3A'
      },
      backgroundColor: '#f59e0b',
      borderColor: '#d97706'
    },
    {
      id: '4',
      title: 'Database Systems',
      start: '2024-09-18T09:00:00',
      end: '2024-09-18T10:30:00',
      extendedProps: {
        course_name: 'Database Systems',
        faculty: 'Dr. Brown',
        room: 'LH-03',
        type: 'theory',
        batch: 'CSE-3A'
      },
      backgroundColor: '#8b5cf6',
      borderColor: '#7c3aed'
    },
    {
      id: '5',
      title: 'Web Development',
      start: '2024-09-19T15:00:00',
      end: '2024-09-19T17:00:00',
      extendedProps: {
        course_name: 'Web Development',
        faculty: 'Prof. Davis',
        room: 'CSE-LAB-2',
        type: 'lab',
        batch: 'CSE-3A'
      },
      backgroundColor: '#ef4444',
      borderColor: '#dc2626'
    },
    {
      id: '6',
      title: 'Physics Lab',
      start: '2024-09-20T14:00:00',
      end: '2024-09-20T17:00:00',
      extendedProps: {
        course_name: 'Physics Lab',
        faculty: 'Dr. Wilson',
        room: 'PL-1',
        type: 'lab',
        batch: 'CSE-3A'
      },
      backgroundColor: '#06b6d4',
      borderColor: '#0891b2'
    },
    {
      id: '7',
      title: 'AI Ethics',
      start: '2024-09-21T08:00:00',
      end: '2024-09-21T09:30:00',
      extendedProps: {
        course_name: 'AI Ethics',
        faculty: 'Prof. Miller',
        room: 'LH-04',
        type: 'theory',
        batch: 'CSE-3A'
      },
      backgroundColor: '#84cc16',
      borderColor: '#65a30d'
    }
  ]

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      setTimetableData(mockEvents)
      setLoading(false)
    }, 1000)
  }, [selectedBatch, selectedFaculty, selectedRoom])

  const handleBatchChange = (batch: string) => {
    setSelectedBatchLocal(batch)
    setSelectedBatch(batch)
  }

  const filteredEvents = timetableData ? timetableData.filter((event: any) => {
    const batchMatch = selectedBatch === 'All Batches' || event.extendedProps.batch === selectedBatch
    const facultyMatch = selectedFaculty === 'All Faculty' || event.extendedProps.faculty === selectedFaculty
    const roomMatch = selectedRoom === 'All Rooms' || event.extendedProps.room === selectedRoom
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
            <h1 className="text-3xl font-bold text-white mb-2">Timetable Viewer</h1>
            <p className="text-white/80">View and manage academic schedules</p>
          </div>

          <div className="gradient-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Controls Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">View Options & Filters</h2>
              
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

                {/* Batch Filter */}
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

                {/* Faculty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty:</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {faculties.map(faculty => (
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
                    {rooms.map(room => (
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
            </div>

            {/* Calendar */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading timetable data...</p>
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

            {/* Summary Stats */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{filteredEvents.length}</p>
                  <p className="text-sm text-blue-800">Total Classes</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredEvents.filter((e: any) => e.extendedProps.type === 'theory').length}
                  </p>
                  <p className="text-sm text-green-800">Theory Classes</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredEvents.filter((e: any) => e.extendedProps.type === 'lab').length}
                  </p>
                  <p className="text-sm text-orange-800">Lab Sessions</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(filteredEvents.map((e: any) => e.extendedProps.faculty)).size}
                  </p>
                  <p className="text-sm text-purple-800">Faculty Involved</p>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Color Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
                    <span>Workshops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Seminars</span>
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