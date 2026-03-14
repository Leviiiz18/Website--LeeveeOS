import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const FILE_SYSTEM = [
  {
    name: 'Root',
    type: 'folder',
    children: [
      {
        name: 'Projects',
        type: 'folder',
        children: [
          { name: 'Memory_NPC.exe', type: 'app', appId: 'projects' },
          { name: 'Self_Driving.exe', type: 'app', appId: 'projects' }
        ]
      },
      {
        name: 'Documents',
        type: 'folder',
        children: [
          { name: 'Resume.pdf', type: 'app', appId: 'resume' },
          { name: 'Contact_Info.txt', type: 'app', appId: 'contact' },
          { name: 'My_Skills.md', type: 'app', appId: 'skills' },
          { name: 'Trophies.dat', type: 'app', appId: 'achievements' }
        ]
      },
      {
        name: 'System',
        type: 'folder',
        children: [
          { name: 'Settings.ini', type: 'app', appId: 'settings' },
          { name: 'Terminal.sh', type: 'app', appId: 'about' }
        ]
      },
      {
        name: 'Games',
        type: 'folder',
        children: [
          { name: 'Snake.exe', type: 'app', appId: 'game' }
        ]
      },
      {
        name: 'Media',
        type: 'folder',
        children: [
          { name: 'Audio_Player.exe', type: 'app', appId: 'music' }
        ]
      },
      {
        name: 'Recycle_Bin',
        type: 'folder',
        children: [
          { name: 'CryptoPortfolio_v1', type: 'app', appId: 'trash' },
          { name: 'SocialMediaClone.js', type: 'app', appId: 'trash' }
        ]
      }
    ]
  }
]

export default function Explorer({ onOpenApp }) {
  const { accentColor } = useTheme()
  const [currentPath, setCurrentPath] = useState([FILE_SYSTEM[0]])

  const currentFolder = currentPath[currentPath.length - 1]

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1))
    }
  }

  const navigateTo = (folder) => {
    setCurrentPath(prev => [...prev, folder])
  }

  const handleDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateTo(item)
    } else if (item.type === 'app' && onOpenApp) {
      onOpenApp(item.appId)
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-gray-200 font-mono text-sm selection:bg-white/20">
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-black/40 border-b border-white/10">
        <button 
          onClick={goBack}
          disabled={currentPath.length === 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span style={{ color: accentColor }}>C:</span>
          {currentPath.map((folder, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-gray-500">/</span>
              <span>{folder.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-4 content-start">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {currentFolder.children.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                onClick={(e) => {
                   // Optional single click selection logic here
                }}
                onDoubleClick={() => handleDoubleClick(item)}
                className="group flex flex-col items-center gap-2 p-3 rounded border border-transparent hover:bg-white/5 hover:border-white/10 cursor-pointer text-center"
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded bg-black/40 shadow-inner"
                  style={{ color: item.type === 'folder' ? accentColor : '#94a3b8' }}
                >
                  {item.type === 'folder' ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  ) : item.name.endsWith('.exe') ? (
                    <span className="text-2xl">⚙️</span>
                  ) : item.name.endsWith('.pdf') ? (
                    <span className="text-2xl">📄</span>
                  ) : item.name.endsWith('.mp3') ? (
                    <span className="text-2xl">🎵</span>
                  ) : (
                    <span className="text-2xl">📝</span>
                  )}
                </div>
                <span className="truncate w-full text-xs group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {currentFolder.children.length === 0 && (
            <div className="col-span-full h-32 flex items-center justify-center text-gray-500 italic">
              This folder is empty.
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-2 px-4 bg-black/40 border-t border-white/10 text-xs text-gray-500 flex justify-between">
        <span>{currentFolder.children.length} item(s)</span>
        <span>Storage: 4018 / 2441800 blocks</span>
      </div>
    </div>
  )
}
