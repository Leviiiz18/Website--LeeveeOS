import { useTheme, THEME_COLORS, BACKGROUNDS } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function Settings() {
  const { background, setBackground, accentId, setAccentId, accentColor } = useTheme()

  return (
    <div className="h-full bg-[#0a0f18] text-[#e2e8f0] p-6 font-mono overflow-y-auto">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 border-b border-white/10 pb-4" style={{ color: accentColor }}>
          System Configuration
        </h2>

        {/* Wallpaper Setting */}
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-gray-300">Desktop Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(BACKGROUNDS).map(bg => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`p-4 text-left rounded border transition-all ${
                  background === bg.id 
                  ? 'bg-black/40 shadow-inner' 
                  : 'bg-black/20 border-white/5 hover:border-white/20'
                }`}
                style={{ 
                  borderColor: background === bg.id ? accentColor : undefined 
                }}
              >
                <div className="flex items-center gap-3 p-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ background: background === bg.id ? accentColor : '#333' }}
                  />
                  <span className="font-bold">{bg.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color Setting */}
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-gray-300">System Accent Color</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(THEME_COLORS).map(([id, theme]) => (
              <button
                key={id}
                onClick={() => setAccentId(id)}
                className="group relative flex flex-col items-center gap-2"
              >
                <div 
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    accentId === id ? 'scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: theme.hex,
                    borderColor: accentId === id ? 'white' : 'transparent',
                    boxShadow: accentId === id ? `0 0 20px ${theme.hex}80` : 'none'
                  }}
                />
                <span className={`text-xs transition-colors ${accentId === id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {theme.name}
                </span>
                
                {accentId === id && (
                  <motion.div 
                    layoutId="activeColor"
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-12 pt-8 border-t border-red-500/20">
           <h3 className="text-sm font-bold text-red-400 mb-2">DEBUG MODE</h3>
           <p className="text-xs text-gray-500 mb-4">Warning: Advanced system parameters.</p>
           <button 
             className="px-4 py-2 border border-red-500/50 text-red-400 text-xs rounded hover:bg-red-500 hover:text-white transition-colors"
             onClick={() => window.location.reload()}
           >
             Trigger Hard Reboot
           </button>
        </section>

      </div>
    </div>
  )
}
