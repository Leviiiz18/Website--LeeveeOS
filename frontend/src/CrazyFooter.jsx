import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { SiFiverr } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const CrazyFooter = () => {
  const footerRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Parallax text effect
    gsap.fromTo(textRef.current,
      { y: '50%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          end: 'bottom bottom',
          scrub: 1,
        }
      }
    );

    // Mouse tracking glow effect
    const handleMouseMove = (e) => {
      if (cursorRef.current && footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(cursorRef.current, {
          x: x,
          y: y,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    const footerElement = footerRef.current;
    footerElement.addEventListener('mousemove', handleMouseMove);
    footerElement.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      footerElement.removeEventListener('mousemove', handleMouseMove);
      footerElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const socials = [
    { icon: <FaLinkedin size={18} />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/rudranarayan18/' },
    { icon: <FaGithub size={18} />, label: 'GitHub', url: 'https://github.com/Leviiiz18' },
    { icon: <FaInstagram size={18} />, label: 'Instagram', url: 'https://www.instagram.com/r.udra_13/' },
    { icon: <SiFiverr size={18} />, label: 'Fiverr', url: 'https://www.fiverr.com/sellers/levizzz1989' },
    { icon: <FaEnvelope size={18} />, label: 'Email', url: 'mailto:rudranarayanoff@gmail.com' }
  ];

  return (
    <footer ref={footerRef} className="cool-footer">
      <div ref={cursorRef} className="footer-glow"></div>
      
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-branding">
            <h3>Let's build something<br/><i>extraordinary.</i></h3>
            <p>Open for opportunities & collaborations.</p>
          </div>
          <div className="footer-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="social-pill" aria-label={s.label}>
                <span className="social-icon">{s.icon}</span>
                <span className="social-label">{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="massive-text-container">
            <h1 ref={textRef} className="massive-text">RUDRANARAYAN</h1>
          </div>
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
            <span>CRAFTED BY RUDHRA NARAYAN</span>
          </div>
        </div>
      </div>

      <style>{`
        .cool-footer {
          position: relative;
          min-height: 80vh;
          background-color: #050505;
          color: #fff;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 4rem 2rem;
          font-family: 'Sora', sans-serif;
          z-index: 10;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 0;
          mix-blend-mode: screen;
          opacity: 0;
        }

        .footer-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .footer-top {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 4rem;
        }

        @media (min-width: 1024px) {
          .footer-top {
            flex-direction: row;
            align-items: flex-end;
          }
        }

        .footer-branding h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-weight: 400;
          color: #fff;
        }
        
        .footer-branding h3 i {
          color: #d4af37;
        }

        .footer-branding p {
          color: #888;
          font-size: 1.1rem;
          letter-spacing: 1px;
        }

        .footer-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 600px;
        }

        .social-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          color: #ccc;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }

        .social-pill:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
          color: #fff;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 20px rgba(212, 175, 55, 0.15);
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
        }
        
        .social-pill:hover .social-icon {
          color: #fff;
        }

        .social-label {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .massive-text-container {
          overflow: hidden;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 1rem;
          display: flex;
          justify-content: center;
        }

        .massive-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 9vw, 11rem);
          font-weight: 700;
          line-height: 0.8;
          margin: 0;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
          text-align: center;
          letter-spacing: -0.02em;
          transition: all 0.5s ease;
          cursor: default;
        }
        
        .massive-text:hover {
          -webkit-text-stroke: 1px rgba(212, 175, 55, 0.8);
          color: rgba(212, 175, 55, 0.05);
          text-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
        }

        .footer-copyright {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          color: #666;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @media (min-width: 768px) {
          .footer-copyright {
            flex-direction: row;
          }
        }
      `}</style>
    </footer>
  );
};

export default CrazyFooter;
