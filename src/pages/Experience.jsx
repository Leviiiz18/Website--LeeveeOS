import { motion } from 'framer-motion'
import { RESUME_DATA } from '../constants/data'

export default function Experience() {
  const experiences = RESUME_DATA.experience

  return (
    <div className="experience-container h-full overflow-y-auto bg-[#0a0a0f] text-[#4ade80] font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-widest uppercase mb-2"
          >
            [ WORK_HISTORY dossier ]
          </motion.h1>
          <div className="h-1 w-24 bg-[#4ade80] mx-auto opacity-50" />
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-[#4ade80/30] ml-4 md:ml-6 space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-9px] top-1 w-4 h-4 bg-[#0a0a0f] border-2 border-[#4ade80] rounded-full z-10 shadow-[0_0_8px_#4ade80]" />
              
              <div className="bg-[#12121a] border border-[#4ade80/20] p-6 rounded-sm shadow-xl hover:border-[#4ade80/50] transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-white transition-colors">
                      {exp.title}
                    </h2>
                    {exp.company && (
                      <div className="text-sm text-[#4ade80/80] font-bold">
                        {exp.company}
                      </div>
                    )}
                  </div>
                  <div className="text-xs bg-[#4ade80/10] px-3 py-1 rounded-full border border-[#4ade80/20] text-right whitespace-nowrap">
                    {exp.date}
                  </div>
                </div>

                <div className="text-xs text-[#4ade80/60] mb-4 flex items-center gap-2">
                  <span className="opacity-50">LOCATION:</span> {exp.location}
                </div>

                <ul className="space-y-3 mb-6">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#4ade80/90] leading-relaxed">
                      <span className="text-[#4ade80] opacity-50 select-none">{">"}</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#4ade80/10]">
                  <div className="text-[10px] uppercase opacity-40 mb-2 tracking-widest">Utilized Technolgies:</div>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.split(',').map((t, i) => (
                      <span key={i} className="text-[11px] border border-[#4ade80/30] px-2 py-0.5 rounded-sm hover:bg-[#4ade80/10] cursor-default">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center opacity-30 text-[10px] tracking-[0.2em] uppercase">
          End of Log — System Secure
        </div>
      </div>
    </div>
  )
}
