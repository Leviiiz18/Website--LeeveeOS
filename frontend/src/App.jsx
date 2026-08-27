import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { SiFiverr } from 'react-icons/si';
import GradientWaves from './GradientWaves';
import StaggeredMenu from './StaggeredMenu';
import ContactGrid from './ContactGrid';
import CrazyFooter from './CrazyFooter';
import './index.css';

const projects = [
  {
    id: '01',
    title: 'Vidman Homey Huts',
    meta: 'Production Next.js // 2025',
    type: 'iframe',
    src: 'https://www.vidmanhomeyhuts.com/',
    desc: 'Production website with secure backend authentication and environment variable management.'
  },
  {
    id: '02',
    title: 'ECHO-5: AI Arena',
    meta: 'Python • RL // 2025',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop',
    desc: '5v5 multi-agent combat simulation where AI agents learn tactical team coordination autonomously.'
  },
  {
    id: '03',
    title: 'AetherMarket',
    meta: 'Agent-Based Modeling // 2024',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop',
    desc: 'AI-driven simulation where autonomous economic agents negotiate supply, demand, and pricing.'
  },
  {
    id: '04',
    title: 'Self-Driving AI Cars',
    meta: 'NEAT // 2024',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2940&auto=format&fit=crop',
    desc: 'Simulated autonomous vehicle navigation using NEAT. Cars iteratively learned obstacle avoidance without hard-coded rules.'
  },
  {
    id: '05',
    title: 'Evolving Pendulum',
    meta: 'Neural Evolution // 2024',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2940&auto=format&fit=crop',
    desc: 'Modeled chaotic double-pendulum dynamics and applied evolutionary algorithms to predict motion trajectories.'
  }
];

// Reusable animated list item component
const AnimatedListItem = ({ year, title, subtitle, desc, children }) => (
  <motion.div 
    className="list-item"
    initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="list-meta">{year}</div>
    <div className="list-content">
      <h4 className="serif">{title}</h4>
      <span>{subtitle}</span>
      <p>{desc}</p>
      {children}
    </div>
  </motion.div>
);

const contactBentoItems = [
  {
    id: 1,
    title: 'Email',
    icon: <FaEnvelope style={{ fontSize: '24px' }} />,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1000&auto=format&fit=crop',
    link: 'mailto:rudranarayanoff@gmail.com'
  },
  {
    id: 2,
    title: 'LinkedIn',
    icon: <FaLinkedin style={{ fontSize: '24px' }} />,
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1000&auto=format&fit=crop',
    link: 'https://www.linkedin.com/in/rudranarayan18/'
  },
  {
    id: 3,
    title: 'GitHub',
    icon: <FaGithub style={{ fontSize: '24px' }} />,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000&auto=format&fit=crop',
    link: 'https://github.com/Leviiiz18'
  },
  {
    id: 4,
    title: 'Fiverr',
    icon: <SiFiverr style={{ fontSize: '24px' }} />,
    image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1000&auto=format&fit=crop',
    link: 'https://www.fiverr.com/sellers/levizzz1989'
  }
];

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [showHackathon, setShowHackathon] = useState(false);
  const activeProject = projects[activeProjectIndex];

  return (
    <div>
      <div className="noise"></div>
      
      <StaggeredMenu 
        position="right"
        items={[
          { label: 'Projects', link: '#projects' },
          { label: 'Experience', link: '#experience' },
          { label: 'Education', link: '#education' },
          { label: 'Contact', link: '#contact' }
        ]}
        socialItems={[
          { label: 'LinkedIn', icon: <FaLinkedin size={28} />, link: 'https://www.linkedin.com/in/rudranarayan18/' },
          { label: 'GitHub', icon: <FaGithub size={28} />, link: 'https://github.com/Leviiiz18' },
          { label: 'Instagram', icon: <FaInstagram size={28} />, link: 'https://www.instagram.com/r.udra_13/' },
          { label: 'Fiverr', icon: <SiFiverr size={28} />, link: 'https://www.fiverr.com/sellers/levizzz1989' }
        ]}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#0a0a0a"
      />

      {/* Hero Section */}
      <section className="hero">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <GradientWaves 
            horizonColor="#0a0a0a"
            waveColor="#111111"
            crestColor="#d4af37"
            speed={0.3}
            amplitude={1.5}
            opacity={0.4}
            waveScale={0.8}
            grainIntensity={0.08}
          />
        </div>

        <motion.h1 
          className="hero-title serif"
          style={{ position: 'relative', zIndex: 10 }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Rudra<br />Narayan
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          style={{ position: 'relative', zIndex: 10 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          AI Research Engineer crafting <i>autonomous systems</i> and elegant digital experiences.
        </motion.p>

        <motion.a 
          href="#projects"
          className="scroll-indicator"
          style={{ textDecoration: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        >
          <span>Explore</span>
          <div className="scroll-line"></div>
        </motion.a>
      </section>

      {/* Projects Gallery */}
      <section id="projects" className="section section-dark">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title serif">Selected Works</h2>
        </motion.div>

        <div className="gallery-container">
          <motion.div 
            className="gallery-tabs"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {projects.map((proj, idx) => (
              <button 
                key={proj.id}
                className={`gallery-tab ${activeProjectIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveProjectIndex(idx)}
              >
                {proj.title}
              </button>
            ))}
          </motion.div>

          <motion.div 
            className="gallery-display"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeProject.id}
                className="gallery-media"
                initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                {activeProject.type === 'iframe' ? (
                  <iframe src={activeProject.src} title={activeProject.title} loading="lazy" />
                ) : (
                  <img src={activeProject.src} alt={activeProject.title} />
                )}
                
                <div className="gallery-info">
                  <motion.h3 
                    className="serif"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {activeProject.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {activeProject.desc}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title serif" style={{ textAlign: 'center' }}>Experience</h2>
        </motion.div>

        <div className="list-container">
          <AnimatedListItem 
            year="2025"
            title="AI/ML Intern"
            subtitle="NITK Surathkal (CSD)"
            desc="Developed CNN, ANN, and NEAT models through research-oriented virtual AI laboratory exercises. Benchmarked architectures using Python, TensorFlow, and PyTorch. Analyzed model performance across classification tasks and contributed to evaluation pipelines."
          />
        </div>
      </section>

      {/* Education */}
      <section id="education" className="section section-dark">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title serif" style={{ textAlign: 'center' }}>Education</h2>
        </motion.div>

        <div className="list-container">
          <AnimatedListItem 
            year="2023 - 2027"
            title="BCA-AI"
            subtitle="NITTE Institute of Professional Education"
            desc="Bachelor of Computer Applications — Artificial Intelligence."
          >
            <button className="hackathon-btn" onClick={() => setShowHackathon(!showHackathon)}>
              🏆 Hackathon Win
            </button>
            <AnimatePresence>
              {showHackathon && (
                <motion.div 
                  className="hackathon-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>Aethron 2K25 — 1st Place</strong>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Recognized for innovative application of AI/ML models in a time-constrained competitive environment.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedListItem>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '0', backgroundColor: 'var(--bg-primary)' }}>
        <ContactGrid centerText="Reach Out" bentoItems={contactBentoItems} />
      </section>

      <CrazyFooter />
    </div>
  );
}

export default App;
