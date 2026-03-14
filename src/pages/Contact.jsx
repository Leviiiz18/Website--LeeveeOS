import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONTACT_LINKS = [
  { icon: '📧', label: 'Email',    value: 'officialrudraos18@gmail.com',  href: 'mailto:officialrudraos18@gmail.com' },
  { icon: '🐙', label: 'GitHub',   value: 'github.com/Leviiiz18',         href: 'https://github.com/Leviiiz18' },
  { icon: '📷', label: 'Instagram',value: '@r.udra_13',                   href: 'https://www.instagram.com/r.udra_13?igsh=MWh2dWk0bzI4YnBydA%3D%3D&utm_source=qr' },
  { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/rudranarayan18', href: 'https://www.linkedin.com/in/rudranarayan18' },
]

const AMBER_THEME = '#fbbf24'

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'ERR: NAME_MISSING'
    if (!form.email.trim())   e.email   = 'ERR: ADDR_UNRESOLVED'
    if (!form.message.trim()) e.message = 'ERR: NULL_PACKET_BODY'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    
    setSubmitting(true)
    setTimeout(() => {
      setSent(true)
      setSubmitting(false)
    }, 1500)
  }

  return (
    <div style={{
      height: '100%', width: '100%', overflowX: 'hidden', overflowY: 'auto',
      background: '#0a0804', // Deep Obsidian-Amber
      color: AMBER_THEME,
      fontFamily: '"JetBrains Mono", monospace',
      position: 'relative',
    }} className="scrollbar-amber">
      
      {/* Background Decor */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-4xl mx-auto p-12 z-10">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-start mb-16 border-b border-amber-500/20 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
              <div className="text-[10px] text-white/30 uppercase tracking-[0.5em]">SECURE_COMMS_PROTOCOL_v4.1</div>
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              MESSAGE<span className="text-white/20">.</span>UPLINK
            </h1>
          </div>
          <div className="text-right text-[10px] space-y-2 opacity-30 tabular-nums">
             <div>ENCRYPTION: AES-256</div>
             <div>SIGNAL_STRENGTH: 98%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Directory */}
          <div className="space-y-8">
            <div className="text-[11px] font-black opacity-30 mb-8 tracking-[0.3em] uppercase">Known_Network_Nodes</div>
            <div className="space-y-4">
              {CONTACT_LINKS.map(c => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 p-4 border border-white/5 bg-white/[0.01] hover:bg-amber-500/5 hover:border-amber-500/30 transition-all duration-300 no-underline"
                >
                  <span className="text-3xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all">{c.icon}</span>
                  <div className="flex-grow">
                    <div className="text-[10px] opacity-40 mb-1 font-bold">{c.label.toUpperCase()}</div>
                    <div className="text-sm font-black text-white/60 group-hover:text-amber-400">{c.value}</div>
                  </div>
                  <div className="text-[10px] opacity-0 group-hover:opacity-40 font-black">LINK://{c.label.toUpperCase()}</div>
                </motion.a>
              ))}
            </div>
            <div className="p-6 border border-amber-500/10 bg-amber-500/[0.02] italic text-[11px] leading-relaxed opacity-40">
              "Establishing secure tunnel for data transmission. All packets routed through encrypted nodes. Responses typically processed within 24 standard cycles."
            </div>
          </div>

          {/* Right: Message Injection */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-12 border border-amber-500/30 bg-amber-500/5 text-center min-h-[400px]"
                >
                  <div className="text-6xl mb-6">🛰️</div>
                  <div className="text-xl font-black mb-2">UPLINK_ESTABLISHED</div>
                  <div className="text-[11px] opacity-60 mb-8 font-black tracking-widest uppercase italic">Data_Packet_Sent_Successfully</div>
                  <button 
                    onClick={() => setSent(false)}
                    className="px-6 py-2 border border-amber-500/40 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all"
                  >
                    RESET_COMM_CHANNEL
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-[11px] font-black opacity-30 tracking-[0.3em] uppercase mb-8">Data_Injection_Port</div>
                  
                  {/* Form Inputs */}
                  <div className="space-y-10">
                    <TerminalInput 
                      label="IDENT_TOKEN" 
                      placeholder="ENTER_SENDER_NAME" 
                      value={form.name}
                      error={errors.name}
                      onChange={v => setForm({...form, name: v})}
                    />
                    <TerminalInput 
                      label="RETURN_ADDR" 
                      placeholder="ENTER_SENDER_EMAIL" 
                      value={form.email}
                      error={errors.email}
                      onChange={v => setForm({...form, email: v})}
                    />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">PAYLOAD_BUFFER</span>
                        {errors.message && <span className="text-[10px] font-black text-red-500">{errors.message}</span>}
                      </div>
                      <textarea 
                        rows={6}
                        placeholder="ENTER_PAYLOAD_CONTENT..."
                        className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all resize-none"
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-5 bg-amber-500/10 border border-amber-500/40 text-amber-500 font-black text-sm hover:bg-amber-500 hover:text-black transition-all group disabled:opacity-50"
                  >
                    {submitting ? 'TRANSMITTING_PACKETS...' : 'EXECUTE_BROADCAST_UPLINK'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Audit */}
        <div className="mt-20 flex justify-between items-center text-[10px] border-t border-amber-500/10 pt-8 font-black opacity-20 uppercase tracking-[0.4em]">
          <div>Signal_Source: 127.0.0.1</div>
          <div className="animate-pulse">Active_Comms_Stream...</div>
          <div>© 2026 LEVEE_UPLINK</div>
        </div>
      </div>

      <style>{`
        .scrollbar-amber::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-amber::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .scrollbar-amber::-webkit-scrollbar-thumb {
          background: #fbbf2433;
        }
        .scrollbar-amber::-webkit-scrollbar-thumb:hover {
          background: #fbbf2455;
        }
      `}</style>
    </div>
  )
}

function TerminalInput({ label, placeholder, value, error, onChange }) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">{label}</label>
        {error && <span className="text-[10px] font-black text-red-500">{error}</span>}
      </div>
      <div className="flex items-center gap-4 bg-white/[0.02] border-b border-white/20 focus-within:border-amber-500 transition-all p-4">
        <span className="text-amber-500 opacity-50 font-black">{'>'}</span>
        <input 
          type="text"
          placeholder={placeholder}
          className="bg-transparent w-full text-sm text-white placeholder:text-white/10 outline-none font-bold"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
