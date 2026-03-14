import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function Taskbar({ openWindows, minimized, onTaskClick, activeId }) {
  const prefersReduced = useReducedMotion()
  const [now, setNow]           = useState(new Date())
  const [prevSec, setPrevSec]   = useState(now.getSeconds())
  const [secOpacity, setSecOpacity] = useState(1)
  const [showDate, setShowDate] = useState(false)
  const [orbHovered, setOrbHovered] = useState(false)
  const [orbMenu, setOrbMenu]   = useState(false)
  const [mouseX, setMouseX]     = useState(null)
  const buttonRefs = useRef({})

  useEffect(() => {
    const t = setInterval(() => {
      setNow(d => {
        const n = new Date()
        if (n.getSeconds() !== d.getSeconds()) {
          setSecOpacity(0)
          setTimeout(() => setSecOpacity(1), 180)
        }
        return n
      })
    }, 500)
    return () => clearInterval(t)
  }, [])

  const fmtTime = d => {
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    const s = d.getSeconds().toString().padStart(2, '0')
    return { hm: `${h}:${m}`, s }
  }
  const fmtDate = d => d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

  const { hm, s } = fmtTime(now)

  const onMouseMove = useCallback(e => setMouseX(e.clientX), [])
  const onMouseLeave = useCallback(() => setMouseX(null), [])

  const getButtonScale = useCallback((id) => {
    if (mouseX === null || prefersReduced) return 1
    const el = buttonRefs.current[id]
    if (!el) return 1
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const dist = Math.abs(mouseX - center)
    if (dist > 120) return 1
    return 1 + (1 - dist / 120) * 0.3
  }, [mouseX, prefersReduced])

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 flex items-center gap-2 px-4"
      style={{
        height: 56, zIndex: 5000,
        background: 'rgba(6,6,16,0.75)',
        backdropFilter: 'blur(32px) saturate(180%)',
        borderTop: '1px solid transparent',
        backgroundImage: 'linear-gradient(rgba(6,6,16,0.75), rgba(6,6,16,0.75))',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Top gradient border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, #7c3aed, #00d4ff, #7c3aed)',
        opacity: 0.6,
      }} />

      {/* Start orb */}
      <motion.div
        animate={{ rotate: orbHovered ? 360 : 0 }}
        transition={{ duration: orbHovered ? 2 : 12, ease: 'linear', repeat: Infinity }}
        onHoverStart={() => setOrbHovered(true)}
        onHoverEnd={() => setOrbHovered(false)}
        onClick={() => setOrbMenu(m => !m)}
        style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
          boxShadow: orbHovered
            ? '0 0 28px rgba(0,212,255,0.7), 0 0 8px rgba(124,58,237,0.9)'
            : '0 0 18px rgba(124,58,237,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, cursor: 'pointer',
          transition: 'box-shadow 0.3s',
          marginRight: 8, willChange: 'transform',
        }}
      >
        ⚡
      </motion.div>

      {/* Orb menu */}
      <AnimatePresence>
        {orbMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              position: 'absolute', bottom: '110%', left: 8,
              background: 'rgba(10,10,22,0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '6px 0', minWidth: 160,
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              zIndex: 5001,
            }}
            onClick={() => setOrbMenu(false)}
          >
            {['Recent', 'About LeveeOS', 'Restart'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ padding: '8px 16px', fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}
                whileHover={{ background: 'rgba(0,212,255,0.1)' }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Window buttons */}
      <div className="flex gap-1.5 flex-1 overflow-x-auto">
        <AnimatePresence>
          {openWindows.map(w => {
            const isMin    = minimized.includes(w.id)
            const isActive = w.id === activeId
            const scale    = getButtonScale(w.id)
            return (
              <motion.div
                key={w.id}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                style={{ position: 'relative', flexShrink: 0 }}
              >
                <motion.button
                  ref={el => buttonRefs.current[w.id] = el}
                  onClick={() => onTaskClick(w.id)}
                  animate={{ scale }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  style={{
                    height: 36, padding: '0 14px',
                    border: 'none',
                    background: isMin ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.11)',
                    color: isMin ? '#475569' : '#e2e8f0',
                    fontSize: 12, cursor: 'pointer',
                    borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    opacity: isMin ? 0.55 : 1,
                  }}
                >
                  <span>{w.icon}</span>
                  <span>{w.title}</span>
                </motion.button>
                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive && !isMin && (
                    <motion.div
                      key="dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.4, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22, times: [0, 0.5, 1] }}
                      style={{
                        position: 'absolute', bottom: -4, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#00d4ff',
                        boxShadow: '0 0 6px #00d4ff',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Clock */}
      <div
        style={{ position: 'relative', textAlign: 'right', flexShrink: 0, cursor: 'default' }}
        onMouseEnter={() => setShowDate(true)}
        onMouseLeave={() => setShowDate(false)}
      >
        <div style={{
          fontSize: 13, color: '#e2e8f0', fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {hm}:<motion.span
            key={s}
            animate={{ opacity: secOpacity }}
            transition={{ duration: 0.18 }}
          >{s}</motion.span>
        </div>
        <div style={{ fontSize: 10, color: '#475569', fontFamily: '-apple-system, sans-serif' }}>
          {fmtDate(now)}
        </div>
        <AnimatePresence>
          {showDate && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', bottom: '100%', right: 0,
                marginBottom: 8, padding: '6px 12px',
                background: 'rgba(10,10,22,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, fontSize: 12, color: '#e2e8f0',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                fontFamily: '-apple-system, sans-serif',
              }}
            >
              {now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
