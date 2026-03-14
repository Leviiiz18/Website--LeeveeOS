import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS } from '../constants/data'

const PURPLE_THEME = '#a78bfa'

export default function Achievements() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div style={{
      height: '100%', width: '100%', overflowX: 'hidden', overflowY: 'auto',
      background: '#08060a', // Deep Obsidian-Purple
      color: PURPLE_THEME,
      fontFamily: '"JetBrains Mono", monospace',
      position: 'relative',
    }} className="scrollbar-purple">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(167, 139, 250, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(167, 139, 250, 0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="relative w-full max-w-4xl mx-auto p-12 z-10">
        {/* Decryption Header */}
        <div className="flex justify-between items-end mb-16 border-b border-purple-500/20 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 bg-purple-500 animate-pulse rounded-full" />
              <div className="text-[10px] text-white/30 uppercase tracking-[0.6em]">DECRYPTION_CONSOLE_v7.2</div>
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              HALL<span className="text-white/20">.</span>OF<span className="text-white/20">.</span>FAME
            </h1>
          </div>
          <div className="text-right text-[10px] space-y-2 opacity-30 tabular-nums">
            <div>TARGET_STATUS: DECRYPTED</div>
            <div>AUTH_KEY: 0x{Math.floor(Math.random() * 65535).toString(16).toUpperCase()}</div>
          </div>
        </div>

        {/* Vertical Feed of Certificates */}
        <div className="space-y-12">
          {ACHIEVEMENTS.map((item, idx) => (
            <AchievementNode 
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onEnter={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
              index={idx}
            />
          ))}
        </div>

        {/* Footer Logs */}
        <div className="mt-20 flex justify-between items-center text-[10px] border-t border-purple-500/10 pt-8 font-black opacity-20 uppercase tracking-[0.3em]">
          <div>Sector_0xDA // Verified</div>
          <div className="animate-pulse">Intercepting Hardware Proofs...</div>
          <div>© 2026 LEVEE_OS</div>
        </div>
      </div>

      <style>{`
        .scrollbar-purple::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-purple::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .scrollbar-purple::-webkit-scrollbar-thumb {
          background: #a78bfa33;
        }
        .scrollbar-purple::-webkit-scrollbar-thumb:hover {
          background: #a78bfa55;
        }
      `}</style>
    </div>
  )
}

function AchievementNode({ item, isHovered, onEnter, onLeave, index }) {
  const hexSignature = useMemo(() => {
    return `SIG_${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`
  }, [])

  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`group relative border transition-all duration-500 ${
        isHovered ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/[0.02] border-white/5'
      } p-8 overflow-hidden`}
    >
      {/* Glitch Overlay on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #a78bfa 0px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 3px'
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
        {/* Certificate Metadata */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4 border-r border-white/5 pr-10">
          <div className={`text-6xl transition-all duration-700 ${isHovered ? 'scale-110 rotate-3 filter-none' : 'grayscale opacity-20 scale-90'}`}>
            {item.icon}
          </div>
          <div className="text-[10px] font-black tabular-nums opacity-30 tracking-widest">{item.date}</div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[9px] px-2 py-0.5 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest bg-purple-500/5">
              {item.type}
            </span>
            <span className="text-[10px] opacity-20 font-mono italic">{hexSignature}</span>
          </div>
          
          <h3 className={`text-3xl font-black italic tracking-tighter uppercase mb-4 transition-colors ${isHovered ? 'text-white' : 'text-white/40'}`}>
            {item.title}
          </h3>

          <div className="flex gap-4 items-center">
             <div className="text-xl font-black text-purple-400 opacity-80">{item.result}</div>
             <div className="h-[2px] w-20 bg-white/5" />
             <p className="text-xs text-white/40 leading-relaxed max-w-sm italic">
               "{item.subtitle}"
             </p>
          </div>

          {/* Mobile Image Layer */}
          {item.image && (
            <div className="mt-6 block lg:hidden w-full aspect-video border border-white/10 overflow-hidden rounded-sm relative bg-black/40">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-full h-full object-contain transition-all duration-700 ${isHovered ? 'grayscale-0 opacity-100 scale-105' : 'grayscale opacity-60 scale-100'}`}
                />
                <div className={`absolute inset-0 bg-purple-500/20 mix-blend-overlay pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
            </div>
          )}
        </div>

        {/* Verification Status & Desktop Image */}
        <div className="text-right hidden lg:flex flex-col items-end gap-3">
           <div>
             <div className="text-[10px] font-bold opacity-30 mb-2">VALID_PROOF</div>
             <div className="flex justify-end gap-1">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className={`w-1 h-3 ${isHovered ? 'bg-purple-500' : 'bg-white/10'} transition-colors`} />
               ))}
             </div>
           </div>

           {item.image && (
             <div className="relative w-32 h-44 border border-white/10 overflow-hidden rounded-sm mt-2 bg-black/40">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'grayscale-0 opacity-100 scale-110' : 'grayscale opacity-60 scale-100'}`}
                />
                <div className={`absolute inset-0 bg-purple-500/20 mix-blend-overlay pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
             </div>
           )}
        </div>
      </div>

      {/* Interactive Corner HUD */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 text-[9px] font-black bg-purple-500 text-black px-2 py-1 rotate-3"
          >
            VERIFIED_ASSET
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
