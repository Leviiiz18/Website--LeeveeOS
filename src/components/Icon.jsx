import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const itemVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

export default function DesktopIcon({ icon, label, onClick, glowColor = '#00d4ff' }) {
  const prefersReduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [ripple, setRipple]   = useState(null)
  const ref = useRef(null)

  // Random float phase per icon (stable per mount)
  const phase = useRef(Math.random() * Math.PI * 2)
  const bobY  = useRef(0)
  const frameRef = useRef(null)
  const [floatY, setFloatY] = useState(0)

  useEffect(() => {
    if (prefersReduced || hovered) return
    let start = null
    const animate = (ts) => {
      if (!start) start = ts
      const t = (ts - start) / 1000
      setFloatY(Math.sin(t * 1.2 + phase.current) * 3)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [prefersReduced, hovered])

  const handleClick = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const rx = e.clientX - rect.left
      const ry = e.clientY - rect.top
      setRipple({ x: rx, y: ry, id: Date.now() })
      setTimeout(() => setRipple(null), 600)
    }
    onClick?.()
  }

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onClick={handleClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.88, transition: { duration: 0.08 } }}
      animate={prefersReduced ? {} : {
        y: hovered ? -8 : floatY,
        scale: hovered ? 1.12 : 1,
      }}
      transition={hovered ? { type: 'spring', stiffness: 300, damping: 18 } : { duration: 0 }}
      className="flex flex-col items-center gap-2 cursor-pointer select-none"
      style={{
        width: 80, padding: window.innerWidth < 768 ? '16px 4px' : '12px 8px',
        position: 'relative', borderRadius: 18,
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        backdropFilter: hovered ? 'blur(12px)' : 'none',
        border: hovered ? `1px solid ${glowColor}33` : '1px solid transparent',
        boxShadow: hovered ? `0 0 16px ${glowColor}22` : 'none',
        transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
        willChange: 'transform',
      }}
    >
      <span
        style={{
          fontSize: 38, lineHeight: 1,
          filter: hovered
            ? `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor}88)`
            : 'none',
          transition: 'filter 0.2s',
          willChange: 'filter',
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 11.5, textAlign: 'center', fontWeight: 500,
          color: hovered ? '#fff' : '#e2e8f0',
          textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          letterSpacing: 0.2, lineHeight: 1.3,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          transition: 'color 0.15s',
        }}
      >
        {label}
      </span>

      {/* Ripple */}
      {ripple && (
        <motion.span
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 100, height: 100, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x - 0, top: ripple.y - 0,
            borderRadius: '50%',
            background: glowColor,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  )
}
