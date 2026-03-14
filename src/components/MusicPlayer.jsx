import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SONGS = [
  { title: 'Nanchaku', artist: 'Seedhe Maut ft. MC STAN', duration: '3:58', url: '/music/Seedhe Maut - Nanchaku ft. MC STAN.mp3' },
  { title: 'Push My Luck', artist: 'The Chainsmokers', duration: '3:01', url: '/music/The Chainsmokers - Push My Luck (Lyrics).mp3' },
  { title: 'FUNK UNIVERSO', artist: 'Slowed', duration: '2:45', url: '/music/FUNK UNIVERSO (Slowed).mp3' },
  { title: 'DtMF', artist: 'Bad Bunny', duration: '3:42', url: '/music/DtMF (lyricsletra) - Bad Bunny.mp3' },
]

const CRIMSON_THEME = '#ef4444'

export default function MusicPlayer({ onInitAudio, analyser }) {
  const [playing, setPlaying] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const [elapsed, setElapsed]   = useState(0)
  const [logs, setLogs] = useState(["BOOTING_AUD_ENGINE...", "READY_FOR_INTERCEPTION"])
  
  const audioRef  = useRef(new Audio(SONGS[0].url))
  const sourceRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(null)

  const song = SONGS[trackIdx]
  const [mm, ss] = song.duration.split(':').map(Number)
  const totalSecs = mm * 60 + ss
  const pct = Math.min((elapsed / totalSecs) * 100, 100)
  const fmtSecs = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // Audio Events
  useEffect(() => {
    const audio = audioRef.current
    const onTimeUpdate = () => setElapsed(Math.floor(audio.currentTime))
    const onEnded = () => nextTrack()
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [trackIdx])

  // Cleanup audio on player exit
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Oscilloscope Visualization
  useEffect(() => {
    if (!analyser || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = CRIMSON_THEME

      ctx.beginPath()
      const sliceWidth = canvas.width / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      
      // Randomly inject logs during playback
      if (playing && Math.random() > 0.98) {
        setLogs(prev => [...prev.slice(-4), `FREQ_SPIKE_${Math.floor(Math.random()*999)}Hz_DETECTED`])
      }

      frameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [analyser, playing])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!playing) {
      const node = onInitAudio?.()
      if (node && !sourceRef.current) {
        try {
          const ctx = node.context
          const source = ctx.createMediaElementSource(audio)
          source.connect(node)
          node.connect(ctx.destination)
          sourceRef.current = source
        } catch (e) { console.warn("Audio Context Collision", e) }
      }
      audio.play().catch(e => console.error("ERR: PLAYBACK_REJECTED", e))
      setLogs(prev => [...prev.slice(-4), "STREAM_CONNECTED"])
    } else {
      audio.pause()
      setLogs(prev => [...prev.slice(-4), "STREAM_INTERRUPTED"])
    }
    setPlaying(!playing)
  }, [playing, onInitAudio])

  const nextTrack = () => selectTrack((trackIdx + 1) % SONGS.length)
  const prevTrack = () => selectTrack((trackIdx - 1 + SONGS.length) % SONGS.length)
  
  const selectTrack = i => {
    const wasPlaying = playing
    audioRef.current.pause()
    setTrackIdx(i)
    setElapsed(0)
    audioRef.current.src = SONGS[i].url
    if (wasPlaying) audioRef.current.play()
    setLogs(prev => [...prev.slice(-4), `NEW_SIGNAL_LOCKED:_${SONGS[i].title.toUpperCase()}`])
  }

  return (
    <div style={{
      height: '100%', width: '100%', overflowX: 'hidden', overflowY: 'auto',
      background: '#0d0404', // Obsidian-Crimson
      color: CRIMSON_THEME,
      fontFamily: '"JetBrains Mono", monospace',
      display: 'flex', flexDirection: 'column', padding: '24px',
    }} className="scrollbar-red">

      {/* Frequency Header */}
      <div className="flex justify-between items-end mb-8 border-b border-red-500/20 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
            <div className="text-[10px] text-white/30 tracking-[0.4em]">SIGNAL_MONITOR_v9.0</div>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">FREQ.INTERCEPT</h2>
        </div>
        <div className="text-right text-[10px] opacity-30 font-bold tabular-nums">
           DB_LVL: {playing ? '-12.4' : 'N/A'}<br/>
           WAV_FORM: ANALOG_INTERCEPT
        </div>
      </div>

      {/* Oscilloscope Plot */}
      <div className="relative w-full h-40 bg-zinc-950 border border-red-500/10 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={400} height={160} />
      </div>

      {/* Track HUD */}
      <div className="flex-grow flex flex-col items-center justify-center py-6 text-center">
        <AnimatePresence mode="wait">
           <motion.div key={trackIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
             <div className="text-[10px] font-black opacity-30 mb-2 tracking-widest">CURRENT_STREAMING_DATA</div>
             <h3 className="text-2xl font-black italic text-white mb-2">{song.title.toUpperCase()}</h3>
             <div className="text-xs font-black opacity-60 italic">{song.artist.toUpperCase()}</div>
           </motion.div>
        </AnimatePresence>

        {/* Binary Progress */}
        <div className="w-full max-w-sm mt-8">
           <div className="h-1 bg-white/5 relative mb-2">
             <motion.div 
               className="h-full bg-red-600"
               style={{ width: `${pct}%`, boxShadow: '0 0 10px #ef4444' }}
               animate={{ opacity: playing ? [1, 0.5, 1] : 1 }}
               transition={{ duration: 1, repeat: Infinity }}
             />
           </div>
           <div className="flex justify-between text-[10px] font-bold opacity-30 tabular-nums">
             <span>{fmtSecs(elapsed)}</span>
             <span>{song.duration}</span>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="flex items-center justify-center gap-12 py-8 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
         <CommandBtn label="PREV" onClick={prevTrack} />
         <CommandBtn label={playing ? "HALT" : "LOAD"} onClick={togglePlay} large active={playing} />
         <CommandBtn label="NEXT" onClick={nextTrack} />
      </div>

      {/* Terminal Logs Footer */}
      <div className="mt-auto pt-4 border-t border-red-500/10">
        <div className="text-[10px] font-black opacity-30 mb-4 tracking-widest">KERNEL_LOGS</div>
        <div className="bg-black/40 p-4 font-mono text-[10px] space-y-1 h-24 overflow-hidden">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4">
              <span className="opacity-20">[{Math.floor(Date.now()/1000) - (logs.length - i)}]</span>
              <span className={log.includes('SPIKE') ? 'text-red-500' : 'text-white/40'}>{log}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-red::-webkit-scrollbar { width: 3px; }
        .scrollbar-red::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-red::-webkit-scrollbar-thumb { background: #ef444455; }
      `}</style>
    </div>
  )
}

function CommandBtn({ label, onClick, large = false, active = false }) {
  return (
    <button 
      onClick={onClick}
      className={`font-black flex flex-col items-center transition-all ${large ? 'scale-110' : 'scale-90'} ${active ? 'text-white' : 'text-red-500/60 hover:text-red-400'}`}
    >
      <div className={`border-2 mb-2 ${large ? 'w-14 h-14' : 'w-10 h-10'} flex items-center justify-center ${active ? 'bg-red-500 border-red-500' : 'border-red-500/30'}`}>
        <span className={active ? 'text-black' : ''}>{large ? (active ? '■' : '▶') : (label === 'PREV' ? '«' : '»')}</span>
      </div>
      <span className="text-[9px] tracking-widest uppercase">{label}</span>
    </button>
  )
}
