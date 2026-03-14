import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2500
    const intervalTime = 30
    const steps = duration / intervalTime
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newProgress = Math.min(100, (currentStep / steps) * 100)
      setProgress(newProgress)

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(onLoaded, 400) // slight delay before unmounting
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onLoaded])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050308] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.8, 0.1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Glowing Central Element */}
        <div className="relative mb-12">
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="w-24 h-24 rounded-full border-2 border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center relative z-10 relative">
             <span className="text-3xl">🚀</span>
          </div>
        </div>

        <h1 
          className="text-4xl font-bold tracking-[0.2em] mb-8"
          style={{
             background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             textTransform: 'uppercase'
          }}
        >
          LeveeOS
        </h1>

        {/* Progress Bar Container */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
           <motion.div 
             className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]"
             style={{ width: `${progress}%` }}
           />
        </div>
        
        <div className="mt-4 text-[10px] text-gray-500 tracking-widest uppercase flex items-center gap-2">
           <motion.div 
             animate={{ opacity: [1, 0.2, 1] }} 
             transition={{ duration: 1.5, repeat: Infinity }}
             className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
           />
           Initializing Environment
        </div>
      </motion.div>
    </motion.div>
  )
}
