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
      className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-4 select-none"
      style={{
        zIndex: 9999,
        background: 'rgba(6, 6, 16, 0.25)',
        backdropFilter: 'blur(12px)',
        fontSize: '11px',
        letterSpacing: '0.2px',
        fontWeight: '600',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-bold opacity-90">{fmtTime(time)}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <RiSignalTowerFill size={12} className="opacity-70" />
        <RiWifiLine size={13} className="opacity-70" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] opacity-60">85%</span>
          <RiBattery2Fill size={14} className="text-green-400 opacity-90" />
        </div>
      </div>
    </div>
  )
}
