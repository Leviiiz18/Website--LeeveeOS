import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILL_TREE } from '../constants/data'

// Terminal Colors for Categories
const CATEGORY_COLORS = {
  core: '#00ffcc', // Cyan
  ai: '#7c3aed',   // Purple
  adv: '#ff0055',  // Rose
  game: '#00ff00', // Green
  default: '#ffffff'
}

export default function Skills() {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [scrolled, setScrolled] = useState(0)
  const containerRef = useRef(null)

  // Map nodes to a linear list for the "Console Data Feed"
  const skillModules = useMemo(() => {
    return SKILL_TREE.nodes.map((node, i) => {
      let category = 'core'
      if (['ai', 'ml', 'dl', 'tensorflow', 'pytorch'].includes(node.id)) category = 'ai'
      if (['neural-networks', 'vision', 'neat', 'evolutionary'].includes(node.id)) category = 'adv'
      if (['unity', 'unreal'].includes(node.id)) category = 'game'
      
      return {
        ...node,
        category,
        color: CATEGORY_COLORS[category],
        hexAddr: `0x${(i * 128 + 4096).toString(16).toUpperCase()}`,
        status: node.level > 90 ? 'OPTIMIZED' : node.level > 80 ? 'STABLE' : 'INTEGRATING'
      }
    })
  }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    setScrolled((scrollTop / (scrollHeight - clientHeight)) * 100 || 0)
  }

  return (
    <div style={{
      height: '100%', width: '100%', overflow: 'hidden',
      background: '#0a0a0c', // Obsidian
      position: 'relative',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      
      {/* Background Matrix-like Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* OS Dashboard Frame */}
      <div className="relative w-full h-full flex flex-col p-8 z-10">
        
        {/* Hacking Console Header */}
        <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="text-[10px] text-white/30 uppercase tracking-[0.5em]">SYSTEM_MODULE_LOADER_v6.5</div>
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              SKILL<span className="text-white/20">.</span>DUMP
            </h1>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex gap-4 items-center justify-end">
              {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
                  <span className="text-[9px] uppercase font-bold text-white/20">{cat}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-cyan-400 font-bold tabular-nums">
              MEMORY_OFFSET: 0x0000FF {scrolled.toFixed(1)}% SCROLLED
            </div>
          </div>
        </div>

        {/* Scrollable Data Feed */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto space-y-6 pr-6 scrollbar-custom"
        >
          {skillModules.map((skill, idx) => (
            <SkillModuleRow 
              key={skill.id}
              skill={skill}
              isHovered={hoveredIdx === idx}
              onEnter={() => setHoveredIdx(idx)}
              onLeave={() => setHoveredIdx(null)}
            />
          ))}
          <div className="h-20" /> {/* Bottom padding for scroll */}
        </div>

        {/* Console Footer */}
        <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30 border-t border-white/5 pt-6">
          <div className="flex gap-10">
            <span>PACKETS: 72/s</span>
            <span>OS_STATUS: ROOT_VERIFIED</span>
          </div>
          <div className="text-cyan-500">READY_FOR_DATA_INJECTION</div>
          <div>© 2026 LEVEEOS_KERNEL</div>
        </div>
      </div>

      <style>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #00ffcc33;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #00ffcc55;
        }
      `}</style>
    </div>
  )
}

function SkillModuleRow({ skill, isHovered, onEnter, onLeave }) {
  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        borderLeft: `4px solid ${isHovered ? skill.color : 'rgba(255,255,255,0.05)'}`,
      }}
      className="group relative bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Hex Offset & Icon */}
        <div className="flex items-center gap-6 min-w-[140px]">
          <span className="text-[10px] text-white/20 tabular-nums font-bold">{skill.hexAddr}</span>
          <div className={`text-4xl transition-transform duration-500 ${isHovered ? 'scale-125 rotate-12' : 'grayscale opacity-30'}`}>
            {skill.icon}
          </div>
        </div>

        {/* Skill Name & Status */}
        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-3">
            <h3 className={`text-2xl font-black tracking-tighter uppercase transition-colors ${isHovered ? 'text-white' : 'text-white/40'}`}>
              {skill.name}
            </h3>
            <span className="text-[9px] px-2 py-0.5 border border-white/10 rounded-sm text-white/30 font-bold whitespace-nowrap">
              {skill.status}
            </span>
          </div>

          {/* Sync Bar */}
          <div className="relative h-2 w-full max-w-sm bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              className="h-full"
              style={{ backgroundColor: skill.color, boxShadow: `0 0 15px ${skill.color}55` }}
            />
          </div>
        </div>

        {/* Metadata Scans */}
        <div className="flex gap-10 text-[10px] items-center">
          <div className="text-right">
            <div className="text-white/20 font-bold mb-1">MODULE_SYNC</div>
            <div className="font-black italic" style={{ color: skill.color }}>{skill.level}%</div>
          </div>
          <div className="hidden lg:block w-32">
            <div className="text-white/20 font-bold mb-1">CATEGORY</div>
            <div className="font-black text-white/60 tracking-widest uppercase">{skill.category}</div>
          </div>
        </div>

        {/* Interactive "Decrypt" Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div 
                className="px-4 py-2 border font-black text-[10px] cursor-pointer hover:bg-white hover:text-black transition-colors"
                style={{ borderColor: skill.color, color: skill.color }}
              >
                OPEN_MODULE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Scanline Effect */}
      {isHovered && (
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 50 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 h-[1px] bg-white/10 pointer-events-none"
        />
      )}
    </motion.div>
  )
}
