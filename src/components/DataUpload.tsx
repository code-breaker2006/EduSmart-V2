import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAppContext } from '../hooks/useAppContext'

export default function DataUpload() {
  const { setCurrentView } = useAppContext()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [selectedFileType, setSelectedFileType] = useState('students')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileTypes = [
    { value: 'students', label: 'Students', icon: '👥', description: 'Student enrollment data' },
    { value: 'faculty', label: 'Faculty', icon: '👨‍🏫', description: 'Faculty and staff information' },
    { value: 'courses', label: 'Courses', icon: '📚', description: 'Course catalog and details' },
    { value: 'rooms', label: 'Rooms', icon: '🏫', description: 'Classroom and facility data' },
    { value: 'enrollments', label: 'Enrollments', icon: '📝', description: 'Student-course enrollments' },
    { value: 'assignments', label: 'Teaching Assignments', icon: '📋', description: 'Faculty-course assignments' }
  ]

  const expectedFormats = {
    students: ['student_id', 'first_name', 'last_name', 'email', 'branch', 'year', 'batch', 'roll_no'],
    faculty: ['faculty_id', 'first_name', 'last_name', 'email', 'department', 'specialization'],
    courses: ['course_id', 'course_code', 'course_name', 'credits', 'branch', 'year', 'type'],
    rooms: ['room_id', 'room_code', 'room_type', 'capacity', 'branch'],
    enrollments: ['student_id', 'course_id', 'academic_term_id'],
    assignments: ['faculty_id', 'course_id', 'academic_term_id']
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setUploading(true)

    // Simulate file processing
    setTimeout(() => {
      const mockValidation = {
        fileName: file.name,
        fileType: selectedFileType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        recordCount: Math.floor(Math.random() * 500) + 50,
        validRecords: Math.floor(Math.random() * 500) + 50,
        errors: Math.floor(Math.random() * 5),
        uploadedAt: new Date().toLocaleString(),
        status: 'success'
      }

      setUploadedFiles(prev => [mockValidation, ...prev])
      setUploading(false)
      
      if (mockValidation.errors === 0) {
        toast.success(`${mockValidation.recordCount} records uploaded successfully!`)
      } else {
        toast.warning(`Upload completed with ${mockValidation.errors} errors. Please review.`)
      }
    }, 2000)
  }

  const handleManualInput = () => {
    fileInputRef.current?.click()
  }

  const downloadTemplate = (type: string) => {
    // Create mock CSV content
    const headers = expectedFormats[type as keyof typeof expectedFormats]
    const csvContent = headers.join(',') + '\n' + 
      headers.map(() => 'sample_data').join(',')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}_template.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`${type} template downloaded!`)
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Data Upload Manager</h1>
              <p className="text-white/80">Import your institutional data efficiently</p>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Type Selector */}
            <div className="lg:col-span-1 space-y-6">
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Data Type</h3>
                <div className="space-y-2">
                  {fileTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedFileType(type.value)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedFileType === type.value
                          ? 'bg-gradient-primary text-white shadow-md'
                          : 'bg-white/50 hover:bg-white/70 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{type.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{type.label}</p>
                          <p className={`text-xs ${
                            selectedFileType === type.value ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Download */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Template</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get the correct CSV format for {fileTypes.find(t => t.value === selectedFileType)?.label} data.
                </p>
                <button
                  onClick={() => downloadTemplate(selectedFileType)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all"
                >
                  📥 Download Template
                </button>
                
                <div className="mt-4 text-xs text-gray-600">
                  <p className="font-medium mb-2">Expected columns:</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {expectedFormats[selectedFileType as keyof typeof expectedFormats].map((col, index) => (
                      <span key={col} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Zone */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload {fileTypes.find(t => t.value === selectedFileType)?.label} Data
                </h3>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {uploading ? (
                    <div className="py-8">
                      <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Processing your file...</p>
                      <p className="text-sm text-gray-500 mt-2">Validating data format and checking for errors</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-800 mb-2">
                        Drag & drop your CSV file here
                      </p>
                      <p className="text-gray-600 mb-4">or click to browse</p>
                      <button
                        onClick={handleManualInput}
                        className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Upload History */}
              <div className="gradient-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload History</h3>
                
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No files uploaded yet</p>
                    <p className="text-sm">Upload your first CSV file to see the history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">
                                {fileTypes.find(t => t.value === file.fileType)?.icon}
                              </span>
                              <h4 className="font-medium text-gray-800">{file.fileName}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                file.errors === 0 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {file.errors === 0 ? 'Success' : `${file.errors} errors`}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Records:</span> {file.recordCount}
                              </div>
                              <div>
                                <span className="font-medium">Valid:</span> {file.validRecords}
                              </div>
                              <div>
                                <span className="font-medium">Size:</span> {file.size}
                              </div>
                              <div>
                                <span className="font-medium">Uploaded:</span> {file.uploadedAt}
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}