import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiBattery2Fill, RiWifiLine, RiSignalTowerFill } from 'react-icons/ri'

export default function StatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmtTime = (d) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-9 flex items-center justify-between px-6 select-none"
      style={{
        zIndex: 9999,
        background: 'rgba(6, 6, 16, 0.4)',
        backdropFilter: 'blur(20px)',
        fontSize: '12px',
        letterSpacing: '0.4px',
        fontWeight: '700',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <div className="flex items-center gap-1">
        <span>{fmtTime(time)}</span>
      </div>
      
      <div className="flex items-center gap-2.5">
        <RiSignalTowerFill size={14} className="text-slate-400" />
        <RiWifiLine size={14} className="text-slate-400" />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">85%</span>
          <RiBattery2Fill size={14} className="text-green-500" />
        </div>
      </div>
    </div>
  )
}
