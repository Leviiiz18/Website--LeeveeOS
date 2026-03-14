import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '../constants/data'

const TERMINAL_CYAN = '#00d4ff'

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const [isKernelLoading, setIsKernelLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobileWidth = window.innerWidth < 768
      const hasTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
      setIsMobile(mobileWidth || hasTouch)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSelect = (p) => {
    setIsKernelLoading(true)
    setTimeout(() => {
      setSelected(p)
      setIsKernelLoading(false)
    }, 400)
  }

  if (isMobile) {
    return (
      <div style={{
        height: '100%', width: '100%', overflow: 'hidden',
        background: '#040608',
        color: TERMINAL_CYAN,
        fontFamily: '"JetBrains Mono", monospace',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-grow p-6 overflow-y-auto"
            >
              <div className="text-[10px] font-black opacity-30 mb-6 tracking-[0.4em]">SYSTEM://APPS_GALLERY</div>
              <div className="grid grid-cols-1 gap-4">
                {PROJECTS.map((p, i) => (
                  <motion.div
                    key={p.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(p)}
                    className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-center gap-5"
                  >
                    <span className="text-4xl">{p.icon}</span>
                    <div className="flex-grow">
                      <div className="text-sm font-black text-white">{p.name}</div>
                      <div className="text-[10px] opacity-40">{p.type}</div>
                    </div>
                    <div className="text-cyan-500/40 text-xs">→</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-grow flex flex-col p-6 overflow-y-auto"
            >
              {/* Fake status bar for context */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setSelected(null)}
                  className="text-xs font-black bg-cyan-500/10 px-4 py-2 border border-cyan-500/30 rounded-lg"
                >
                  ← GALLERY
                </button>
                <div className="text-[9px] opacity-20 tabular-nums">ID: {selected.id}</div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{selected.icon}</span>
                <div>
                  <h2 className="text-3xl font-black italic text-white uppercase leading-none mb-2">
                    {selected.name}
                  </h2>
                  <div className="text-[9px] bg-cyan-500/20 px-2 py-0.5 inline-block font-black tracking-widest">
                    {selected.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="p-6 border border-cyan-500/10 bg-white/[0.02] mb-8 rounded-xl">
                <p className="text-xs leading-relaxed text-cyan-100/70">
                  {selected.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-[9px] font-black opacity-30 mb-4 tracking-[0.2em]">TECH_STACK</div>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map(t => (
                    <span key={t} className="text-[10px] px-3 py-1.5 border border-white/5 bg-white/[0.03] rounded-md text-cyan-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <a 
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-black text-xs rounded-xl"
                >
                  📂 CLONE_REPO
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isKernelLoading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
               className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
             />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      height: '100%', width: '100%', overflow: 'hidden',
      background: '#040608',
      color: TERMINAL_CYAN,
      fontFamily: '"JetBrains Mono", monospace',
      display: 'flex',
      flexDirection: 'row',
    }}>
      {/* Sidebar / Directory: Repository Directory */}
      <div className="w-72 border-r border-cyan-500/20 flex flex-col p-6 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-black opacity-30 mb-8 tracking-[0.4em]">DIRECTORY_ROOT://REPO</div>
        
        <div className="space-y-1">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`group flex items-center gap-4 p-3 cursor-pointer border border-transparent transition-all duration-200 ${
                selected?.id === p.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] opacity-20 tabular-nums">0x{(0x1000 + i * 16).toString(16).toUpperCase()}</span>
              <div className="flex-grow">
                <div className={`text-xs font-bold ${selected?.id === p.id ? 'text-white' : 'text-cyan-500/60 group-hover:text-cyan-400'}`}>
                  {p.name.toUpperCase().replace(/\s/g, '_')}
                </div>
                <div className="text-[9px] opacity-30">{p.type}</div>
              </div>
              {selected?.id === p.id && (
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00d4ff]" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-cyan-500/10 text-[9px] opacity-20 leading-loose">
          SYSTEM_ACCESS: RW<br/>
          CLUSTERS: {PROJECTS.length}<br/>
          STATUS: ONLINE
        </div>
      </div>

      {/* Main Preview: Repository Content */}
      <div className="flex-grow relative flex flex-col p-12 overflow-y-auto scrollbar-custom">
        <AnimatePresence mode="wait">
          {isKernelLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-xs font-black"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 h-3 bg-cyan-500"
                    />
                  ))}
                </div>
                <div>READING_SECTOR...</div>
              </div>
            </motion.div>
          ) : selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{selected.icon}</span>
                    <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase leading-none">
                      {selected.name}
                    </h2>
                  </div>
                  <div className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 inline-block font-black tracking-widest text-cyan-400">
                    STATUS: {selected.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-right tabular-nums opacity-30 text-[10px]">
                  TIMESTAMP: {new Date().getTime().toString(16).toUpperCase()}<br/>
                  PERMISSION: 0777
                </div>
              </div>

              {/* Description Block */}
              <div className="relative p-8 border border-cyan-500/10 bg-white/[0.02] mb-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[8px] opacity-20">README.MD</div>
                <p className="text-sm leading-relaxed text-cyan-100/70 font-medium">
                  {selected.description}
                </p>
                {/* ASCII corner embellishment */}
                <div className="absolute bottom-2 right-2 text-[10px] opacity-10">
                  +---+<br/>| {selected.id} |<br/>+---+
                </div>
              </div>

              {/* Tech Stack Feed */}
              <div className="mb-12">
                <div className="text-[10px] font-black opacity-30 mb-6 tracking-[0.3em]">INSTALLED_DEPENDENCIES</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selected.tech.map((t, idx) => (
                    <div key={t} className="flex items-center gap-3 p-3 border border-white/5 bg-white/[0.01] group hover:border-cyan-500/30 transition-colors">
                      <span className="text-[9px] opacity-20">[{idx.toString().padStart(2, '0')}]</span>
                      <span className="text-xs font-bold text-white/60 group-hover:text-cyan-400">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6">
                <a 
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-black text-xs hover:bg-cyan-500 hover:text-black transition-all group"
                >
                  <span className="group-hover:animate-pulse">📂</span> CLONE_REPOSITORY
                </a>
                <div className="px-8 py-4 border border-white/10 text-white/30 font-black text-xs cursor-not-allowed italic">
                  DECODE_METRICS
                </div>
              </div>

              <div className="mt-20 opacity-10 text-[8px] leading-relaxed select-none">
                {Array(5).fill("0101 0110 1101 0010 1111 1010 0110 1101 1011 0010").join(" ")}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20 text-xs tracking-widest">
              SELECT_A_CLUSTER_TO_PREVIEW
            </div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #00d4ff33;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #00d4ff55;
        }
      `}</style>
    </div>
  )
}
