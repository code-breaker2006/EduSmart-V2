import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

interface TimetableGeneratorProps {
  onComplete: () => void
}

export default function TimetableGenerator({ onComplete }: TimetableGeneratorProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const steps = [
    "Analyzing student enrollments...",
    "Processing faculty preferences...", 
    "Optimizing room allocations...",
    "Resolving scheduling conflicts...",
    "Applying constraint satisfaction...",
    "Finalizing timetable structure...",
    "Validating against requirements...",
    "Generation complete!"
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isGenerating) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15
          
          if (newProgress >= 100) {
            setCurrentStep(steps.length - 1)
            setTimeout(() => {
              toast.success("Timetable generated successfully!")
              onComplete()
            }, 1500)
            return 100
          }
          
          setCurrentStep(Math.floor((newProgress / 100) * (steps.length - 1)))
          return newProgress
        })
      }, 400)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGenerating, onComplete, steps.length])

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-card rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Timetable Generator</h1>
          <p className="text-gray-600">Generate optimal schedules using advanced algorithms</p>
        </div>

        {!isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Generation Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Faculty:</span>
                  <span className="font-medium">35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Courses:</span>
                  <span className="font-medium">53</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Slots:</span>
                  <span className="font-medium">54/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Constraints:</span>
                  <span className="font-medium">24 rules</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">Optimization Goals</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Zero scheduling conflicts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Respect faculty preferences
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Optimal room utilization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Balanced workload distribution
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Generate Timetable Now
            </motion.button>

            <button
              onClick={onComplete}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"
              ></motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {steps[currentStep]}
              </h3>
              <p className="text-gray-600">This may take a few moments...</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-primary h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Process Steps</h4>
              <div className="space-y-2">
                {steps.slice(0, -1).map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index < currentStep ? 'bg-green-500' :
                      index === currentStep ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`}></div>
                    <span className={`${
                      index < currentStep ? 'text-green-700 line-through' :
                      index === currentStep ? 'text-yellow-700 font-medium' :
                      'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}