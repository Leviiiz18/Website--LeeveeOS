import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Window    from './Window'
import Icon      from './Icon'
import Taskbar   from './Taskbar'
import Terminal  from './Terminal'
import MusicPlayer from './MusicPlayer'
import { DESKTOP_ICONS, WINDOW_CONFIGS } from '../constants/data'
import Projects  from '../pages/Projects'
import Skills    from '../pages/Skills'
import Trash     from '../pages/Trash'
import Contacts   from '../pages/Contact'
import Achievements from '../pages/Achievements'
import Resume       from '../pages/Resume'
import Game         from '../pages/Game'
import SettingsApp  from '../pages/Settings'
import Explorer     from '../pages/Explorer'
import Experience   from '../pages/Experience'
import Widgets      from './Widgets'
import StatusBar from './StatusBar'
import { useTheme } from '../context/ThemeContext'

const PAGE_MAP = {
  projects: Projects,
  about:    Terminal,
  skills:   Skills,
  music:    MusicPlayer,
  achievements: Achievements,
  resume:       Resume,
  trash:    Trash,
  contact:  Contacts,
  game:     Game,
  settings: SettingsApp,
  explorer: Explorer,
  experience: Experience,
}

let zCounter = 100
const nextZ = () => ++zCounter

const CONTEXT_ITEMS = ['New Window', 'Change Wallpaper', 'About LeveeOS', 'Sleep']

export default function Desktop({ isMobile }) {
  const [openWindows, setOpenWindows] = useState([])
  const [minimized,   setMinimized]   = useState([])
  const [zMap,        setZMap]        = useState({})
  const [contextMenu, setContextMenu] = useState(null) // { x, y }
  const [toasts,      setToasts]      = useState([])
  const [snapZone,    setSnapZone]    = useState(null)  // 'left' | 'right'
  const [audioAnalyser, setAudioAnalyser] = useState(null)
  const { background, accentColor } = useTheme()
  const toastId = useRef(0)
  const audioContextRef = useRef(null)

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current.analyser
    
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    
    audioContextRef.current = { ctx, analyser }
    setAudioAnalyser(analyser)
    return analyser
  }, [])

  const focusWindow = useCallback(id => {
    setZMap(z => ({ ...z, [id]: nextZ() }))
  }, [])

  const openWindow = useCallback(key => {
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === key)
      if (exists) {
        setMinimized(m => m.filter(id => id !== key))
        focusWindow(key)
        return prev
      }
      return [...prev, { id: key, ...WINDOW_CONFIGS[key] }]
    })
    focusWindow(key)
  }, [focusWindow])

  const closeWindow    = useCallback(id => {
    setOpenWindows(p => p.filter(w => w.id !== id))
    setMinimized(m => m.filter(mid => mid !== id))
  }, [])

  const toggleMinimize = useCallback(id => {
    setMinimized(m => m.includes(id) ? m.filter(mid => mid !== id) : [...m, id])
  }, [])

  const onTaskClick = useCallback(id => {
    setMinimized(m => m.filter(mid => mid !== id))
    focusWindow(id)
  }, [focusWindow])

  // Welcome toast
  useEffect(() => {
    const t = setTimeout(() => {
      pushToast('Welcome back. 4 projects loaded.')
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  const pushToast = (msg) => {
    const id = ++toastId.current
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }

  const onContextMenu = useCallback(e => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const closeContext = useCallback(() => setContextMenu(null), [])

  return (
    <motion.div
      className="relative w-screen overflow-hidden"
      style={{ height: '100vh' }}
      onContextMenu={onContextMenu}
      onClick={closeContext}
      initial={{ scale: 0.2, opacity: 0, filter: 'blur(20px) brightness(10)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px) brightness(1)' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1,
        filter: { type: 'tween', duration: 0.6 } // Forced tween to prevent negative blur
      }}
    >
      <DigitalParticles color={accentColor} />
      {/* ── Animated Canvas Background ── */}
      {background === 'pixel' && <CanvasBackground analyser={audioAnalyser} />}
      {background === 'matrix' && <DesktopMatrixRain analyser={audioAnalyser} />}
      {background === 'black' && <AudioReactiveBlack analyser={audioAnalyser} />}

      {/* ── Scanline overlay ── */}
      <div className="scanline-overlay pointer-events-none absolute inset-0" style={{ zIndex: 1 }} />

      {/* ── Ambient glow orbs ── */}
      <AmbientOrbs />

      {/* ── Mobile Status Bar ── */}
      {isMobile && <StatusBar />}

      {/* ── Desktop Widgets ── */}
      {!isMobile && <Widgets />}

      {/* ── Desktop icons ── */}
      <motion.div
        className="absolute w-full grid p-6"
        style={{ 
          zIndex: 10,
          top: isMobile ? 48 : 6,
          left: 0,
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(90px, 1fr))' : 'repeat(auto-fill, 90px)',
          gridAutoFlow: isMobile ? 'row' : 'column',
          gridAutoRows: 'min-content',
          maxHeight: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 120px)',
          justifyContent: isMobile ? 'center' : 'start',
          gap: isMobile ? '16px' : '4px'
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
        }}
      >
        {DESKTOP_ICONS.map(ic => (
          <Icon
            key={ic.key}
            icon={ic.icon}
            label={ic.label}
            glowColor={WINDOW_CONFIGS[ic.key]?.glowColor}
            onClick={() => openWindow(ic.key)}
          />
        ))}
      </motion.div>

      {/* ── Snap zone overlay ── */}
      <AnimatePresence>
        {snapZone && (
          <motion.div
            key={snapZone}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, bottom: 56,
              width: '50%',
              left: snapZone === 'left' ? 0 : '50%',
              background: `rgba(${hexToRgb(accentColor)}, 0.06)`,
              border: `2px solid rgba(${hexToRgb(accentColor)}, 0.25)`,
              borderRadius: 12,
              zIndex: 90,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Open windows ── */}
      <AnimatePresence>
        {openWindows.map(w => {
          const isMinimized = minimized.includes(w.id)
          const PageComp = PAGE_MAP[w.id]
          return (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              icon={w.icon}
              zIndex={zMap[w.id] || 100}
              isFocused={(zMap[w.id] || 0) === Math.max(...Object.values(zMap))}
              onFocus={() => focusWindow(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => toggleMinimize(w.id)}
              onSnapZone={setSnapZone}
              isFullscreen={true}
              isMinimized={isMinimized}
            >
              {w.id === 'music' ? (
                <PageComp onInitAudio={initAudio} analyser={audioAnalyser} onOpenApp={openWindow} />
              ) : (
                <PageComp onOpenApp={openWindow} />
              )}
            </Window>
          )
        })}
      </AnimatePresence>

      {/* ── Taskbar ── */}
      <Taskbar
        openWindows={openWindows}
        minimized={minimized}
        onTaskClick={onTaskClick}
        activeId={Object.entries(zMap).sort((a, b) => b[1] - a[1])[0]?.[0]}
      />

      {/* ── Context menu ── */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContext} />
        )}
      </AnimatePresence>

      {/* ── Toast stack ── */}
      <div style={{
        position: 'fixed', bottom: 72, right: 20,
        display: 'flex', flexDirection: 'column', gap: 8,
        zIndex: 9000, pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} msg={t.msg} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Audio Reactive Pixel Fireworks Visualizer ─────────────────────────────────
function CanvasBackground({ analyser }) {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Optional: Make canvas lower resolution to get natural "pixelation"
    // but we can also just draw thick blocks
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 0)
    let lastT = performance.now()
    
    // Generate static city skyline (pixelated)
    const generateSkyline = () => {
      const buildings = []
      const numBuildings = Math.max(10, Math.floor(window.innerWidth / 40))
      let x = 0
      while (x < window.innerWidth) {
        const w = 30 + Math.random() * 60
        const h = 50 + Math.random() * 200
        buildings.push({ x, w, h })
        x += w
      }
      return buildings
    }
    
    let skyline = generateSkyline()
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { skyline = generateSkyline() }, 100)
    })

    const draw = (now) => {
      const dt = (now - lastT) / 1000
      lastT = now

      let bass = 0
      let mid  = 0
      let high = 0
      
      if (analyser) {
        analyser.getByteFrequencyData(dataArray)
        for (let i = 0; i < 5; i++) bass += dataArray[i]
        for (let i = 20; i < 60; i++) mid += dataArray[i]
        for (let i = 100; i < 150; i++) high += dataArray[i]
        bass = bass / (5 * 255)
        mid  = mid / (40 * 255)
        high = high / (50 * 255)
      }

      // Dynamic audio-reactive sky background
      // Base dark sky color
      let skyAlpha = 0.2
      let skyColor = '5, 5, 12'
      
      if (bass > 0.4) {
         // Flash sky with neon colors on beat
         const cycleHue = Math.floor(now * 0.1) % 360
         ctx.fillStyle = `hsla(${cycleHue}, 100%, 65%, ${bass * 0.6})`
         ctx.fillRect(0, 0, canvas.width, canvas.height)
         // Slightly bright residual to add motion blur over time
         skyAlpha = 0.8
      } else if (bass > 0.2) {
         // Subtle purple glow for lower bass
         ctx.fillStyle = `rgba(124, 58, 237, ${bass})`
         ctx.fillRect(0, 0, canvas.width, canvas.height)
         skyAlpha = 0.4
      }

      ctx.fillStyle = `rgba(${skyColor}, ${skyAlpha})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Stars that twinkle with high frequencies
      ctx.fillStyle = `rgba(255,255,255,${0.2 + high * 0.8})`
      for (let i = 0; i < 40; i++) {
         const sx = (now * 0.005 + i * 99) % canvas.width
         const sy = (i * 123) % (canvas.height / 2)
         // Make them jitter slightly with high frequencies
         const jt = high > 0.3 ? (Math.random() - 0.5) * 4 : 0
         ctx.fillRect(sx + jt, sy + jt, 2, 2)
      }

      // Draw City Skyline (Pixelated blocks)
      // The buildings themselves pulse slightly to mids
      const buildingGlow = Math.min(255, Math.floor(mid * 80))
      ctx.fillStyle = `rgb(${8 + buildingGlow}, ${6 + buildingGlow}, ${10 + buildingGlow})`
      for (const b of skyline) {
        ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h)
        // Add random "windows"
        ctx.fillStyle = `rgba(255, 230, 100, ${0.1 + mid * 0.5})`
        for (let wy = canvas.height - b.h + 10; wy < canvas.height - 20; wy += 20) {
           for (let wx = b.x + 10; wx < b.x + b.w - 10; wx += 15) {
             if (Math.sin(wx * wy) > 0.5) {
               ctx.fillRect(wx, wy, 4, 6)
             }
           }
        }
        ctx.fillStyle = '#08060a'
      }

      // Draw tiny pixelated people watching the sky
      for (let i = 0; i < 20; i++) {
         const px = canvas.width * 0.05 + i * (canvas.width * 0.9 / 20)
         const py = canvas.height - 12
         // In black silhouette
         ctx.fillStyle = '#050308'
         ctx.fillRect(px, py, 6, 12)
         // Head looking up
         ctx.fillRect(px + 1, py - 6, 4, 4)
         
         // Sometimes they raise hands when bass drops 
         if (bass > 0.6 && Math.random() > 0.5) {
           ctx.fillRect(px - 4, py + 2, 4, 2) // left arm
           ctx.fillRect(px + 6, py + 2, 4, 2) // right arm
         }
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      clearTimeout(resizeTimer)
    }
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  )
}

// ─── Ambient breathing orbs ───────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      <motion.div
        style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          top: -200, left: -100,
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          bottom: 0, right: -100,
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,56,202,0.07) 0%, transparent 70%)',
          top: '40%', left: '45%',
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.10, 1] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 4 }}
      />
    </div>
  )
}

// ─── Context menu ─────────────────────────────────────────────────────────────
function ContextMenu({ x, y, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{
        position: 'fixed', left: x, top: y, zIndex: 9000,
        background: 'rgba(12,12,24,0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '6px 0', minWidth: 180,
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
      onClick={e => e.stopPropagation()}
    >
      {CONTEXT_ITEMS.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          onClick={onClose}
          style={{
            padding: '8px 16px', fontSize: 13, color: '#e2e8f0',
            cursor: 'pointer',
          }}
          whileHover={{ background: 'rgba(0,212,255,0.1)', x: 2 }}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        padding: '12px 16px', borderRadius: 10,
        background: 'rgba(12,12,24,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: '3px solid #00d4ff',
        color: '#e2e8f0', fontSize: 13,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        pointerEvents: 'auto',
      }}
    >
      {msg}
    </motion.div>
  )
}

// ─── Digital Glitch Particles for Entry ──────────────────────────────────────
function DigitalParticles() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    width: 20 + Math.random() * 100,
    height: 1 + Math.random() * 2,
    delay: Math.random() * 0.5
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1000 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scaleX: 0, x: '-20%' }}
          animate={{ 
            opacity: [0, 1, 0], 
            scaleX: [0, 1.2, 0.5],
            x: ['-20%', '10%', '30%']
          }}
          transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.width, height: p.height,
            background: Math.random() > 0.5 ? '#00d4ff' : '#7c3aed',
            boxShadow: '0 0 15px currentColor',
            transformOrigin: 'left center'
          }}
        />
      ))}
    </div>
  )
}
// ─── Desktop Matrix Overlay ─────────────────────────────────────────
function DesktopMatrixRain({ analyser }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('')
    const fontSize = 16
    const columns = Math.ceil(canvas.width / fontSize)
    const drops = Array.from({ length: columns }).fill(1)
    
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 0)

    const draw = () => {
      let bass = 0
      if (analyser) {
        analyser.getByteFrequencyData(dataArray)
        // Check bass frequencies
        for (let i = 0; i < 5; i++) bass += dataArray[i]
        bass = bass / (5 * 255)
      }

      // Fade out previous frame (darker flash if heavy bass)
      ctx.fillStyle = bass > 0.5 ? 'rgba(0, 50, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Color shifts towards white/cyan purely on beat drops
      ctx.fillStyle = bass > 0.6 ? '#fff' : '#0F0'
      
      // Scale font size slightly on heavy bass
      const currentFontSize = bass > 0.7 ? fontSize * 1.2 : fontSize
      ctx.font = currentFontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        // Speed up drop resets if bass is hitting
        if (drops[i] * fontSize > canvas.height && Math.random() > (bass > 0.5 ? 0.8 : 0.975)) {
          drops[i] = 0
        }
        
        // Drops fall faster on beat
        drops[i] += bass > 0.4 ? 2 : 1
      }
    }

    const interval = setInterval(draw, 33)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3 }}
    />
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#00d4ff');
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 212, 255';
}

function AudioReactiveBlack({ analyser }) {
  const [glow, setGlow] = useState(0)

  useEffect(() => {
    if (!analyser) return
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    let animationId

    const checkBeat = () => {
      analyser.getByteFrequencyData(dataArray)
      let bass = 0
      for (let i = 0; i < 5; i++) bass += dataArray[i]
      bass = bass / (5 * 255)

      // Only glow on heavy beats
      if (bass > 0.6) {
        setGlow(bass)
      } else {
        setGlow(prev => Math.max(0, prev - 0.05)) // Decay
      }
      animationId = requestAnimationFrame(checkBeat)
    }

    checkBeat()
    return () => cancelAnimationFrame(animationId)
  }, [analyser])

  return (
    <div 
      className="absolute inset-0 bg-[#020202] transition-colors duration-75" 
      style={{ 
        zIndex: 0,
        backgroundColor: `rgba(20, 20, 25, ${glow * 0.5})`, // Subtle grey/white flash on beat
        boxShadow: `inset 0 0 ${glow * 150}px rgba(255,255,255,${glow * 0.1})`
      }} 
    />
  )
}

