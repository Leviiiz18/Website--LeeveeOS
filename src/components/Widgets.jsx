import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Widgets() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options).toUpperCase()
  }

  return (
    <motion.div 
      className="absolute top-6 right-6 pointer-events-none select-none"
      style={{ zIndex: 10, fontFamily: 'monospace' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      <div className="flex flex-col items-end">
        <div 
          className="text-4xl font-bold tracking-widest text-[#00d4ff]"
          style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
        >
          {formatTime(time)}
        </div>
        <div className="text-sm tracking-widest text-[#a78bfa] mt-1 uppercase">
          {formatDate(time)}
        </div>
        
        {/* Fake System Stats */}
        <div className="mt-4 flex flex-col items-end gap-1 text-[11px] text-[#4ade80] opacity-80">
          <div>CPU usage: {Math.floor(Math.random() * 5 + 15)}%</div>
          <div>MEM alloc: 2.1GB / 16.0GB</div>
          <div>NET tx/rx: 14Kbps</div>
          <div>ROOT: OK</div>
        </div>
      </div>
    </motion.div>
  )
}
