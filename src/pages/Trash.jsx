import { TRASH_PROJECTS } from '../constants/data'

/**
 * Trash
 * Archived / deprecated projects shown as deleted files.
 */
export default function Trash() {
  return (
    <div className="p-6 overflow-y-auto h-full" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ fontSize: 10, color: '#475569', letterSpacing: '1.5px', marginBottom: 18 }}>
        DELETED ITEMS — {TRASH_PROJECTS.length} objects
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {TRASH_PROJECTS.map(p => (
          <div
            key={p.id}
            className="rounded-xl"
            style={{
              padding: '16px 18px', opacity: 0.6,
              background: 'rgba(255,255,255,0.025)',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>{p.icon}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, marginBottom: 5 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>{p.note}</div>
          </div>
        ))}
      </div>

      <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', lineHeight: 1.7 }}>
        🗑️ These projects have been permanently archived.<br />They served their purpose.
      </p>
    </div>
  )
}
