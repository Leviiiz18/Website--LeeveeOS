import { motion } from 'framer-motion'
import { RESUME_DATA } from '../constants/data'

export default function Resume() {
  const d = RESUME_DATA

  return (
    <div className="resume-terminal relative h-full overflow-y-auto" style={{
      background: '#0c0c0c',
      color: '#00ff00',
      fontFamily: "'JetBrains Mono', monospace",
      padding: '40px',
      fontSize: '14px',
      lineHeight: '1.5',
      textShadow: '0 0 5px rgba(0, 255, 0, 0.4)'
    }}>
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        background: 'repeating-linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%'
      }} />

      {/* Header */}
      <header className="mb-12 border-b border-[#00ff0033] pb-8 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[#00ff0088] mb-1 font-bold">C:\USERS\RUDHRA_NARAYAN\PROFILE{">"}</div>
            <h1 className="text-4xl font-black tracking-tighter animate-pulse uppercase" style={{ filter: 'drop-shadow(0 0 10px #00ff00)' }}>
              {d.name.replace(' ', '_')}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[#00ff00cc]">
              <span>[ LOC: {d.contact.location.toUpperCase()} ]</span>
              <span>[ TEL: {d.contact.phone} ]</span>
              <span>[ WEB: {d.contact.email} ]</span>
            </div>
          </div>
          <motion.a 
            whileHover={{ scale: 1.05, background: '#00ff00', color: '#000' }}
            whileTap={{ scale: 0.95 }}
            href="/RUDRANARAYAN_Resume.pdf" 
            download 
            className="border-2 border-[#00ff00] text-[#00ff00] px-6 py-3 font-bold flex items-center gap-3 tracking-widest uppercase"
            style={{ boxShadow: '0 0 20px rgba(0,255,0,0.2)' }}
          >
            <span className="animate-bounce">▼</span> EXPORT_PDF
          </motion.a>
        </div>
      </header>

      {/* Summary Section */}
      <section className="mb-10 relative z-10">
        <div className="text-xl font-bold mb-4 flex items-center gap-3">
          <span className="bg-[#00ff00] text-black px-2">{">"} SUMMARY</span>
          <div className="flex-1 h-[1px] bg-[#00ff0033]" />
        </div>
        <p className="max-w-4xl text-[#00ff00ee] leading-relaxed">
          {d.summary}
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-10 relative z-10">
        <div className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="bg-[#00ff00] text-black px-2">{">"} EXPERIENCE</span>
          <div className="flex-1 h-[1px] bg-[#00ff0033]" />
        </div>
        {d.experience.map((exp, i) => (
          <div key={i} className="mb-8 border-l-2 border-[#00ff0022] pl-6 ml-2">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-lg font-bold text-[#00ff00] underline decoration-[#00ff0044]">{exp.title}</h3>
              <span className="text-sm opacity-60">[{exp.date.toUpperCase()}]</span>
            </div>
            <div className="text-xs opacity-50 mb-3 uppercase tracking-widest">SUBDIR: {exp.location}</div>
            <ul className="space-y-2 mb-4">
              {exp.bullets.map((b, j) => (
                <li key={j} className="flex gap-3">
                  <span className="text-[#00ff0088]">-</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs">
              <span className="bg-[#00ff0033] px-2 py-0.5 mr-2">TECHSET:</span>
              <span className="opacity-80 italic">{exp.tech}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Responsive Grid for other sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Projects */}
        <section>
          <div className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-[#00ff00] text-black px-2">{">"} PROJECTS</span>
            <div className="flex-1 h-[1px] bg-[#00ff0033]" />
          </div>
          <div className="space-y-4">
            {d.projects.map((p, i) => (
              <div key={i} className="border border-[#00ff0033] p-4 bg-[#00ff0005] hover:bg-[#00ff0011] transition-colors">
                <div className="font-bold text-[#00ff00] mb-2">RUN ./{p.name.replace(/\s+/g, '_').toLowerCase()}.sh</div>
                <p className="text-sm opacity-70 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-12">
          {/* Skills */}
          <section>
            <div className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-[#00ff00] text-black px-2">{">"} SKILLSET</span>
              <div className="flex-1 h-[1px] bg-[#00ff0033]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {d.skills.map((s, i) => (
                <span key={i} className="border border-[#00ff00] px-3 py-1 text-xs hover:bg-[#00ff00] hover:text-black transition-colors">
                  {s.toUpperCase()}
                </span>
              ))}
            </div>
          </section>

          {/* Education & Certs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <div className="font-bold mb-4 opacity-100 flex items-center gap-2">
                <span className="text-[#00ff00]">#</span> ACADEMIC_LOG
              </div>
              {d.academic.map((edu, i) => (
                <div key={i} className="text-sm space-y-1 border-b border-[#00ff0011] pb-2 mb-2">
                  <div className="font-bold opacity-100">{edu.degree}</div>
                  <div className="opacity-60 text-xs italic">{edu.spec}</div>
                  <div className="opacity-80">{edu.school}</div>
                </div>
              ))}
            </section>
            <section>
              <div className="font-bold mb-4 opacity-100 flex items-center gap-2">
                <span className="text-[#00ff00]">#</span> CERTIFICATIONS
              </div>
              {d.certifications.map((c, i) => (
                <div key={i} className="text-xs mb-3 flex gap-2">
                  <span className="text-[#00ff00]">[OK]</span>
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="opacity-50">{c.issuer}</div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      {/* Footer Cursor */}
      <div className="mt-12 flex items-center gap-2 opacity-50 relative z-10">
        <span>C:\USERS\RUDHRA_NARAYAN{'>'}</span>
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-[#00ff00]" 
        />
      </div>
    </div>
  )
}
