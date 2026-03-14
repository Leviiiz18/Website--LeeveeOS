import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Draggable from 'react-draggable'

export default function Window({
  id, title, icon, children,
  zIndex, isFocused, onFocus, onClose, onMinimize, onSnapZone,
  isFullscreen = false, isMinimized = false,
}) {
  const prefersReduced = useReducedMotion()
  const nodeRef = useRef(null)
  const [dragRotate, setDragRotate] = useState(0)
  const [isDragging,  setIsDragging] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const lastX = useRef(null)

  // 200ms skeleton delay before content
  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(t)
  }, [])

  const onDragStart = useCallback(() => {
    setIsDragging(true)
    lastX.current = null
    onFocus?.()
  }, [onFocus])

  const onDrag = useCallback((e, data) => {
    if (lastX.current !== null) {
      const vel = data.x - lastX.current
      setDragRotate(Math.max(-1.5, Math.min(1.5, vel * 0.18)))
    }
    lastX.current = data.x
    // Snap zone detection
    if (data.x < 30) onSnapZone?.('left')
    else if (data.x > window.innerWidth - 700) onSnapZone?.('right')
    else onSnapZone?.(null)
  }, [onSnapZone])

  const onDragStop = useCallback(() => {
    setIsDragging(false)
    setDragRotate(0)
    onSnapZone?.(null)
  }, [onSnapZone])

  const borderColor = isFocused ? 'rgba(0,212,255,0.22)' : 'rgba(255,255,255,0.07)'
  const glowShadow  = isFocused
    ? '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,212,255,0.15), 0 0 0 0.5px rgba(255,255,255,0.04)'
    : '0 24px 60px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.04)'

  const windowContent = (
    <motion.div
      ref={nodeRef}
      className={`${isFullscreen ? 'fixed' : 'absolute'} flex flex-col overflow-hidden`}
      style={{
        display: isMinimized ? 'none' : 'flex',
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        right: isFullscreen ? 0 : undefined,
        bottom: isFullscreen ? 56 : undefined,
        width: (isFullscreen || window.innerWidth < 768) ? '100%' : (680),
        height: (isFullscreen || window.innerWidth < 768) ? 'calc(100vh - 56px)' : (480),
        zIndex,
        borderRadius: isFullscreen ? 0 : 14,
        background: isFullscreen ? 'rgba(10,10,22,0.92)' : 'rgba(10,10,22,0.84)',
        backdropFilter: 'blur(32px)',
        border: isFullscreen ? 'none' : `1px solid ${borderColor}`,
        boxShadow: isFullscreen ? 'none' : glowShadow,
        filter: isFocused ? 'brightness(1.0)' : 'brightness(0.78) saturate(0.8)',
        transition: 'border-color 0.2s, box-shadow 0.2s, filter 0.2s ease',
        willChange: 'transform',
      }}
      onMouseDown={onFocus}
      initial={prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, scale: 0.95 }
      }
      animate={{
        opacity: 1, scale: 1,
        rotate: isDragging ? dragRotate : 0,
      }}
      exit={prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, scale: 0.98, y: 10 }
      }
      transition={{
        opacity: { duration: 0.16 },
        scale: { type: 'spring', stiffness: 280, damping: 25 },
        rotate: isDragging
          ? { duration: 0.05 }
          : { type: 'spring', stiffness: 200, damping: 20 },
      }}
      whileTap={isDragging ? { scale: 1.005 } : {}}
    >
      {/* Inner glow (only for non-fullscreen) */}
      {!isFullscreen && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14, pointerEvents: 'none',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
          zIndex: 1,
        }} />
      )}

      {/* ── Title bar ── */}
      <div
        className={`window-titlebar flex items-center px-4 flex-shrink-0 select-none ${isFullscreen ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        style={{
          height: 48, zIndex: 2,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundClip: 'padding-box',
        }}
      >
        {/* Traffic lights */}
        <div className="flex gap-2.5 mr-6" style={{ zIndex: 3 }}>
          <TrafficLight color="#ff5f57" symbol="×" onClick={onClose}    isFocused={isFocused} />
          <TrafficLight color="#febc2e" symbol="–" onClick={onMinimize} isFocused={isFocused} />
          {!isFullscreen && <TrafficLight color="#28c840" symbol="+" onClick={() => {}}   isFocused={isFocused} />}
        </div>

        <span className="text-[13px] text-slate-200 font-semibold tracking-[0.4px] flex items-center gap-2" style={{ zIndex: 3 }}>
          <span style={{ fontSize: 16 }}>{icon}</span> {title}
        </span>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-auto" style={{ position: 'relative' }}>
        <AnimatePresence>
          {!showContent ? (
            <SkeletonLoader key="skeleton" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{ height: '100%' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  if (isFullscreen) return windowContent

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-titlebar"
      defaultPosition={{ x: 80, y: 60 }}
      bounds="parent"
      onStart={onDragStart}
      onDrag={onDrag}
      onStop={onDragStop}
    >
      {windowContent}
    </Draggable>
  )
}

// ─── Traffic light button ─────────────────────────────────────────────────────
function TrafficLight({ color, symbol, onClick, isFocused }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        boxShadow: isFocused ? `0 0 8px ${color}88` : 'none',
      }}
      transition={{ duration: 0.3 }}
      style={{
        width: 13, height: 13, borderRadius: '50%',
        border: 'none', background: color,
        cursor: 'pointer', padding: 0, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, color: 'rgba(0,0,0,0.65)', fontWeight: 700,
      }}
    >
      {hovered ? symbol : ''}
    </motion.button>
  )
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: 24 }}
    >
      {[80, 60, 90, 55, 70].map((w, i) => (
        <div key={i} className="skeleton-bar" style={{
          height: 12, width: `${w}%`, borderRadius: 6,
          marginBottom: 14,
          background: 'rgba(255,255,255,0.05)',
        }} />
      ))}
    </motion.div>
  )
}
