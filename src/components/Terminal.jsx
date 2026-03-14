import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { TERMINAL_COMMANDS } from '../constants/data'

const WELCOME = [
  { type: 'system', text: 'LeveeOS Terminal  v2.4.1  —  Type \'help\' for commands.' },
  { type: 'system', text: '─'.repeat(54) },
]

const ALL_CMDS = Object.keys(TERMINAL_COMMANDS).concat(['clear', 'whoami', 'matrix', 'weather', 'sudo'])
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!?'

function glitchReveal(target, setText) {
  let cycles = 0
  const maxCycles = target.length * 3
  const id = setInterval(() => {
    if (cycles >= maxCycles) {
      setText(target)
      clearInterval(id)
      return
    }
    const revealed = Math.floor(cycles / 3)
    const scrambled = target.slice(0, revealed) +
      Array.from({ length: target.length - revealed },
        () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      ).join('')
    setText(scrambled)
    cycles++
  }, 30)
}

export default function Terminal() {
  const prefersReduced = useReducedMotion()
  const [history, setHistory] = useState([])
  const [input, setInput]     = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [cmdIdx, setCmdIdx]   = useState(-1)
  const [ghost, setGhost]     = useState('')
  const [scanActive, setScanActive] = useState(true)
  const [matrixMode, setMatrixMode] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Type-out queue for outputs
  const queue = useRef([])
  const typing = useRef(false)

  const processQueue = useCallback(() => {
    if (typing.current || queue.current.length === 0) return
    typing.current = true
    const item = queue.current.shift()

    if (item.type === 'error') {
      // Matrix glitch reveal
      setHistory(h => [...h, { type: 'error', text: '', _glitch: true, _key: Date.now() }])
      glitchReveal(item.text, (t) => {
        setHistory(h => {
          const next = [...h]
          const idx = next.findIndex(x => x._glitch)
          if (idx !== -1) next[idx] = { type: 'error', text: t, _key: next[idx]._key }
          return next
        })
      })
      setTimeout(() => { typing.current = false; processQueue() }, item.text.length * 30 * 4)
    } else {
      // Typewriter effect
      const full = item.text
      let i = 0
      setHistory(h => [...h, { type: item.type, text: '', _live: true, _key: Date.now() }])
      const tid = setInterval(() => {
        i++
        setHistory(h => {
          const next = [...h]
          const idx = next.findLastIndex(x => x._live)
          if (idx !== -1) next[idx] = { ...next[idx], text: full.slice(0, i) }
          return next
        })
        if (i >= full.length) {
          clearInterval(tid)
          setHistory(h => {
            const next = [...h]
            const idx = next.findLastIndex(x => x._live)
            if (idx !== -1) next[idx] = { ...next[idx], _live: false }
            return next
          })
          typing.current = false
          processQueue()
        }
      }, 18)
    }
  }, [])

  const enqueue = useCallback((items) => {
    queue.current.push(...items)
    processQueue()
  }, [processQueue])

  // Boot welcome message types out
  useEffect(() => {
    if (prefersReduced) { setHistory(WELCOME); return }
    WELCOME.forEach((line, i) => {
      setTimeout(() => {
        queue.current.push(line)
        processQueue()
      }, i * 120)
    })
  }, [prefersReduced, processQueue])

  // Scan effect on mount
  useEffect(() => {
    if (prefersReduced) { setScanActive(false); return }
    const t = setTimeout(() => setScanActive(false), 700)
    return () => clearTimeout(t)
  }, [prefersReduced])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Ghost autocomplete
  useEffect(() => {
    if (!input) { setGhost(''); return }
    const match = ALL_CMDS.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase())
    setGhost(match ? match.slice(input.length) : '')
  }, [input])

  const run = useCallback(() => {
    const raw = input.trim()
    if (!raw) return
    const cmd = raw.toLowerCase()
    setCmdHistory(h => [raw, ...h])
    setCmdIdx(-1)

    const promptEntry = { type: 'input', text: `guest@levee-os ~ $ ${raw}` }

    if (cmd === 'clear') {
      queue.current = []
      typing.current = false
      setHistory(WELCOME)
      setMatrixMode(false)
    } else if (cmd === 'matrix') {
      setMatrixMode(true)
      enqueue([promptEntry, { type: 'system', text: 'Wake up, Neo...\nThe Matrix has you.\n(Matrix protocol initiated)' }])
    } else if (cmd === 'weather') {
      enqueue([promptEntry, { type: 'output', text: 'Fetching tropospheric data...\n[OK] Location: Mangalore\nConditions: 28°C, Thunderstorms expected. Perfect weather for coding.' }])
    } else if (cmd.startsWith('sudo')) {
      if (cmd.includes('rm -rf')) {
        enqueue([promptEntry, { type: 'error', text: 'CRITICAL FAILURE: Attempting to delete root filesystem...\nAccess Denied. This incident has been logged.' }])
      } else {
        enqueue([promptEntry, { type: 'error', text: 'guest is not in the sudoers file. This incident will be reported.' }])
      }
    } else if (TERMINAL_COMMANDS[cmd]) {
      enqueue([promptEntry, { type: 'output', text: TERMINAL_COMMANDS[cmd] }])
    } else {
      const errText = `Command not found: ${cmd}\nType 'help' for available commands.`
      enqueue([promptEntry, { type: 'error', text: errText }])
    }
    setInput('')
  }, [input, enqueue])

  const onKeyDown = useCallback(e => {
    if (e.key === 'Enter') { run(); return }
    if (e.key === 'Tab') {
      e.preventDefault()
      if (ghost) setInput(prev => prev + ghost)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1)
      setCmdIdx(next)
      setInput(cmdHistory[next] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIdx - 1, -1)
      setCmdIdx(next)
      setInput(next === -1 ? '' : (cmdHistory[next] ?? ''))
    }
  }, [run, cmdIdx, cmdHistory, ghost])

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full overflow-y-auto cursor-text relative"
      style={{
        background: 'rgba(0,0,0,0.6)',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13, padding: '20px',
      }}
    >
      {/* Matrix Rain Overlay */}
      {matrixMode && <MatrixRain />}

      {/* Scan effect */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            key="scan"
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0,
              height: 2, background: 'rgba(255,255,255,0.35)',
              pointerEvents: 'none', zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* History */}
      {history.map((h, i) => (
        <div
          key={h._key || i}
          className="mb-1 whitespace-pre-wrap leading-relaxed"
          style={{
            color: h.type === 'input'  ? '#00d4ff'
                 : h.type === 'error'  ? '#f87171'
                 : h.type === 'system' ? '#475569'
                 : '#94a3b8',
          }}
        >
          {h.text}
          {h._live && <span className="caret-blink" style={{ color: '#00d4ff' }}>█</span>}
        </div>
      ))}

      {/* Active prompt */}
      <div className="flex items-center gap-2 mt-2" style={{ position: 'relative' }}>
        <span style={{ color: '#4ade80', flexShrink: 0 }}>guest@levee-os ~ $</span>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none',
              color: '#e2e8f0', fontFamily: 'inherit', fontSize: 13,
              caretColor: '#00d4ff', position: 'relative', zIndex: 1,
            }}
          />
          {/* Ghost text */}
          {ghost && (
            <span style={{
              position: 'absolute', left: `${input.length}ch`,
              top: 0, color: '#e2e8f0', opacity: 0.3,
              fontFamily: 'inherit', fontSize: 13,
              pointerEvents: 'none', zIndex: 0,
            }}>
              {ghost}
            </span>
          )}
        </div>
        <span className="caret-blink" style={{ color: '#00d4ff' }}>█</span>
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('')
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array.from({ length: columns }).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0F0'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
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
      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{ zIndex: 0 }}
    />
  )
}
