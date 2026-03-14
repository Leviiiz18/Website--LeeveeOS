import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ─── Data ────────────────────────────────────────────────────────────────────
const BIOS_LINES = [
  'LeveeOS UEFI Firmware v2.4.1  — Copyright (C) 2024',
  'CPU: LeveeCore X9 @ 4.8GHz  |  Cores: 16  |  Threads: 32',
  'Checking RAM................. 32768MB OK',
  'Checking NVMe SSD............ 2048GB OK',
  'Checking GPU................. LeveeGPU 24GB OK',
  'Initializing ACPI tables..... Done',
  'Loading UEFI drivers......... Done',
]

const BOOT_LINES = [
  { text: 'Loading kernel image...', type: 'ok' },
  { text: 'Initializing memory management unit...', type: 'ok' },
  { text: 'Mounting root filesystem...', type: 'ok' },
  { text: 'Starting system services...', type: 'loading' },
  { text: 'Legacy shader module detected — using fallback', type: 'warn' },
  { text: 'Loading hardware abstraction layer...', type: 'ok' },
  { text: 'Mounting virtual filesystem (VFS)...', type: 'ok' },
  { text: 'Starting network stack...', type: 'ok' },
  { text: 'Loading portfolio modules...', type: 'loading' },
  { text: 'Applying glassmorphism shaders...', type: 'ok' },
  { text: 'Launching graphical interface...', type: 'ok' },
]

const LOGO_CHARS = 'LeveeOS'.split('')

const STATUS_MSGS = [
  'Loading kernel...', 'Mounting drives...', 'Starting GPU driver...',
  'Initializing audio...', 'Loading portfolio data...', 'Starting GUI...',
]

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?'

// ─── Phases ──────────────────────────────────────────────────────────────────
// 0: BIOS  →  1: Logo reveal  →  2: Boot log  →  3: Desktop (wipe)
const PHASE_BIOS     = 0
const PHASE_LOGO     = 1
const PHASE_BOOTLOG  = 2
const PHASE_HYPERZOOM = 3

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useInterval(fn, delay) {
  const savedFn = useRef(fn)
  useEffect(() => { savedFn.current = fn }, [fn])
  useEffect(() => {
    if (delay == null) return
    const id = setInterval(() => savedFn.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function BootScreen({ onComplete }) {
  const prefersReduced = useReducedMotion()

  // BIOS state
  const [biosLine, setBiosLine] = useState(0)

  // Logo state
  const [glitch, setGlitch] = useState(false)
  const [subtitle, setSubtitle] = useState('')
  const subtitleFull = 'PORTFOLIO SYSTEM v2.4.1'

  // Boot log state
  const [visibleLines, setVisibleLines] = useState([])
  const [segments, setSegments] = useState(Array(20).fill(false))
  const [segIdx, setSegIdx] = useState(0)
  const [statusMsg, setStatusMsg] = useState(STATUS_MSGS[0])

  // Phase
  const [phase, setPhase] = useState(prefersReduced ? PHASE_LOGO : PHASE_BIOS)
  const [glitchActive, setGlitchActive] = useState(false)

  // ── Phase 0: BIOS flicker ────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReduced) { setPhase(PHASE_LOGO); return }
    const delays = BIOS_LINES.map((_, i) => 60 + i * 80)
    const timers = delays.map((d, i) => setTimeout(() => setBiosLine(i + 1), d))
    const total = delays[delays.length - 1] + 300
    const done = setTimeout(() => setPhase(PHASE_LOGO), total)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [prefersReduced])

  // ── Phase 1: Subtitle typewriter ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE_LOGO) return
    let i = 0
    const tid = setInterval(() => {
      if (i >= subtitleFull.length) { clearInterval(tid); return }
      setSubtitle(subtitleFull.slice(0, i + 1))
      i++
    }, 30)
    return () => clearInterval(tid)
  }, [phase])

  // ── Phase 1: Glitch ticker ───────────────────────────────────────────────
  useInterval(useCallback(() => {
    if (phase !== PHASE_LOGO) return
    setGlitch(true)
    setTimeout(() => setGlitch(false), 120)
  }, [phase]), prefersReduced ? null : 400)

  // ── Start boot log after logo phase ─────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE_LOGO) return
    const t = setTimeout(() => setPhase(PHASE_BOOTLOG), 1400)
    return () => clearTimeout(t)
  }, [phase])

  // ── Phase 2: Boot log lines stagger ─────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE_BOOTLOG) return
    BOOT_LINES.forEach((line, i) => {
      const delay = 120 + i * (80 + Math.random() * 120)
      setTimeout(() => setVisibleLines(v => [...v, line]), delay)
    })
  }, [phase])

  // ── Phase 2: Progress segments fill ─────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE_BOOTLOG) return
    const id = setInterval(() => {
      setSegIdx(s => {
        if (s >= 19) {
          clearInterval(id)
          // Initiate hyper-zoom sequence
          setTimeout(() => {
            setGlitchActive(true)
            setPhase(PHASE_HYPERZOOM)
            // No delayed onComplete, go straight to splash overlap
            setTimeout(onComplete, 1200) 
          }, 400)
          return 19
        }
        return s + 1
      })
    }, 90)
    return () => clearInterval(id)
  }, [phase, onComplete])

  useEffect(() => {
    setSegments(prev => prev.map((_, i) => i <= segIdx))
  }, [segIdx])

  // ── Status text cycle ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE_BOOTLOG) return
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % STATUS_MSGS.length
      setStatusMsg(STATUS_MSGS[i])
    }, 300)
    return () => clearInterval(id)
  }, [phase])

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: '#000', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* BIOS Phase */}
      <AnimatePresence>
        {phase === PHASE_BIOS && (
          <motion.div
            key="bios"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 p-8"
          >
            <div className="text-xs text-white leading-relaxed">
              {BIOS_LINES.slice(0, biosLine).map((l, i) => (
                <div key={i} className="mb-0.5">{l}</div>
              ))}
            </div>
            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 py-2 px-4 text-xs text-gray-400"
              style={{ background: '#1a1a1a', borderTop: '1px solid #333' }}>
              Press DEL to enter setup &nbsp;|&nbsp; F12 Boot Menu
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo + Boot Log Phase */}
      <AnimatePresence>
        {(phase === PHASE_LOGO || phase === PHASE_BOOTLOG) && (
          <motion.div
            key="logo-phase"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo Container */}
            <div className="relative mb-12 flex flex-col items-center">
              {/* HUD Brackets */}
              <motion.div 
                className="absolute -inset-y-6 pointer-events-none opacity-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ 
                  left: window.innerWidth < 768 ? '-10%' : -48,
                  right: window.innerWidth < 768 ? '-10%' : -48,
                  borderLeft: '2px solid #00d4ff', 
                  borderRight: '2px solid #7c3aed',
                  background: 'linear-gradient(90deg, rgba(0,212,255,0.05) 0%, transparent 50%, rgba(124,58,237,0.05) 100%)'
                }}
              />

              <div className="flex justify-center mb-4 relative z-10">
                {LOGO_CHARS.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      filter: 'blur(0px)',
                      x: glitch ? [0, -3, 3, 0] : 0,
                      y: glitch ? [0, 2, -2, 0] : 0,
                    }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 20, 
                      delay: 0.1 * i,
                      x: { repeat: Infinity, duration: 0.1 },
                      y: { repeat: Infinity, duration: 0.1 },
                      filter: { type: 'tween', duration: 0.3 } // Prevent negative blur
                    }}
                    style={{
                      fontSize: window.innerWidth < 768 ? 42 : 84,
                      fontWeight: 900,
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: glitch
                        ? '4px 0 rgba(255,0,85,0.8), -4px 0 rgba(0,255,255,0.8)'
                        : '0 0 50px rgba(0,212,255,0.4)',
                      letterSpacing: '-4px',
                      willChange: 'transform, filter',
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ fontSize: 11, letterSpacing: '5px', color: '#4ade80' }}
              >
                {subtitle}
                <span className="caret-blink" style={{ color: '#4ade80' }}>█</span>
              </motion.p>
            </div>

            {/* Boot log panel */}
            <AnimatePresence>
              {phase === PHASE_BOOTLOG && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: window.innerWidth < 768 ? '90vw' : 520,
                    minHeight: 200,
                    background: 'rgba(0,212,255,0.03)',
                    border: '1px solid rgba(0,212,255,0.1)',
                    borderRadius: 8,
                    padding: '16px 20px',
                    marginBottom: 28,
                  }}
                >
                  {visibleLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 12 }}
                    >
                      {line.type === 'ok' && (
                        <span style={{ color: '#4ade80', flexShrink: 0 }}>[OK]</span>
                      )}
                      {line.type === 'loading' && (
                        <span style={{ color: '#00d4ff', flexShrink: 0 }}>[••]</span>
                      )}
                      {line.type === 'warn' && (
                        <span style={{ color: '#f59e0b', flexShrink: 0 }}>[WARN]</span>
                      )}
                      <span style={{
                        color: i === visibleLines.length - 1 ? '#e2e8f0' : '#475569',
                      }}>
                        {line.text}
                      </span>
                    </motion.div>
                  ))}
                  {segIdx < 19 && (
                    <span className="caret-blink" style={{ color: '#00d4ff', fontSize: 12 }}>█</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Segmented progress bar */}
            <AnimatePresence>
              {phase === PHASE_BOOTLOG && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: window.innerWidth < 768 ? '90vw' : 520 }}
                >
                  <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                    {segments.map((active, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0.2 }}
                        animate={{
                          opacity: active ? 1 : 0.15,
                          backgroundColor: active ? '#00d4ff' : '#1e293b',
                        }}
                        style={{
                          flex: 1, height: 6, borderRadius: 2,
                          boxShadow: active ? '0 0 8px rgba(0,212,255,0.8)' : 'none',
                          transition: 'all 0.12s ease',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, color: '#475569',
                  }}>
                    <span style={{ color: '#00d4ff' }}>{statusMsg}</span>
                    <span>{Math.round((segIdx / 19) * 100)}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Splash Screen (v3 - Final) */}
      <AnimatePresence>
        {phase === PHASE_HYPERZOOM && (
          <motion.div
            key="final-splash"
            className="absolute inset-0 z-[100] flex items-center justify-center bg-[#07050f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative flex flex-col items-center">
              {/* Orbital Ring */}
              <motion.div 
                className="absolute -inset-10 border border-[#00d4ff22] rounded-full"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 4, ease: 'linear' }, scale: { repeat: Infinity, duration: 2 } }}
              />
              <motion.div 
                className="absolute -inset-14 border border-[#7c3aed11] rounded-full"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center z-10"
              >
                <div className="text-[10px] tracking-[0.5em] text-[#00d4ff88] mb-4 uppercase font-bold">System Loading</div>
                <h1 className="text-6xl font-black tracking-tighter text-white">
                  LEVEE<span className="text-[#00d4ff]">OS</span>
                </h1>
                <div className="mt-6 flex gap-1 justify-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extreme Glitch Overlay during Zoom */}
      {glitchActive && (
        <motion.div 
          animate={{ 
            opacity: [0, 0.4, 0.1, 0.6, 0],
            backgroundColor: ['#00d4ff', '#ff0055', '#7c3aed', '#000']
          }}
          transition={{ duration: 0.2, repeat: 4 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none', mixBlendMode: 'screen' }}
        />
      )}
    </motion.div>
  )
}
