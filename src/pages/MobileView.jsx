import { motion } from 'framer-motion'
import { PROJECTS } from '../constants/data'

/**
 * MobileView
 * Simplified fallback shown when viewport < 768px.
 * Displays project cards since the OS desktop requires a larger screen.
 */
export default function MobileView() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-5 py-12"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0d0a1f 0%, #070510 80%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1
          className="text-5xl font-bold tracking-tight mb-2"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LeveeOS
        </h1>
        <p className="text-xs tracking-[3px] text-green-400">PORTFOLIO v2.4.1</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10 leading-relaxed"
        style={{ color: '#64748b', fontSize: 13, maxWidth: 320 }}
      >
        This portfolio is best experienced on a desktop — a full OS-style interface awaits you there.
      </motion.p>

      {/* Project cards */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="flex gap-4 rounded-xl p-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span style={{ fontSize: 30, flexShrink: 0 }}>{p.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 14, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                {p.description.slice(0, 90)}…
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tech.slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(124,58,237,0.14)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    color: '#a78bfa',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center"
        style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}
      >
        <div>📧 alex@leveetech.dev</div>
        <div>🐙 github.com/alexlevee</div>
        <div>🐦 @alexlevee</div>
      </motion.div>
    </div>
  )
}
