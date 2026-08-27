import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imagesLoaded from 'imagesloaded';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiFiverr } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

export function ContactGrid({
  centerText = "Reach Out",
  bentoItems = [],
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const gridFullRef = useRef(null);
  const textRef = useRef(null);
  const [activeBento, setActiveBento] = useState(0);

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    const gridItems = document.querySelectorAll('.cg-item');
    if (gridItems.length > 0) {
      imagesLoaded(gridItems, { background: true }, handleLoad);
    } else {
      handleLoad();
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char');
      gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top bottom',
          end: 'center center-=25%',
          scrub: 1,
        }
      }).fromTo(chars, 
        { yPercent: 300, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: 'sine.out', stagger: { each: 0.05, from: 'center' } }
      );
    }

    if (gridFullRef.current) {
      const gridFullItems = gridFullRef.current.querySelectorAll('.cg-anim-item');
      const numColumns = 7;
      const middleColumnIndex = Math.floor(numColumns / 2);

      const columns = Array.from({ length: numColumns }, () => []);
      gridFullItems.forEach((item) => {
        const colAttr = item.getAttribute('data-col');
        const columnIndex = colAttr !== null ? parseInt(colAttr, 10) : 0;
        if (columns[columnIndex]) {
          columns[columnIndex].push(item);
        }
      });

      columns.forEach((columnItems, columnIndex) => {
        const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2;
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          }
        }).fromTo(columnItems,
          { yPercent: 450, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, delay: delayFactor, ease: 'sine.out' }
        );
      });

      const bentoContainer = gridFullRef.current.querySelector('.cg-bento-container');
      if (bentoContainer) {
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top top+=15%',
            end: 'bottom center',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }).to(bentoContainer, {
          y: window.innerHeight * 0.1,
          scale: 1.2,
          zIndex: 1000,
          ease: 'power2.out',
          duration: 1,
          force3D: true
        }, 0);
      }
    }
  }, [isLoaded]);

  const mixedGridItems = Array.from({ length: 21 }, (_, i) => `item-${i}`);
  mixedGridItems[16] = 'BENTO_GROUP';

  const icons = [FaGithub, FaLinkedin, FaEnvelope, SiFiverr];
  const labels = ["GitHub", "LinkedIn", "Email", "Fiverr"];
  const links = ["https://github.com/Leviiiz18", "https://www.linkedin.com/in/rudranarayan18/", "mailto:rudraanarayan0ff@gmail.com", "https://www.fiverr.com/sellers/levizzz1989"];

  return (
    <div className="cg-wrapper">
      <section className="cg-title-section">
        <div ref={textRef} className="cg-title serif">
          {splitText(centerText)}
        </div>
      </section>

      <section className="cg-grid-section">
        <div ref={gridFullRef} className="cg-grid">
          {mixedGridItems.map((item, i) => {
            if (item === 'BENTO_GROUP') {
              if (!bentoItems || bentoItems.length === 0) return null;
              return (
                <div key="bento-group" data-col={2} className="cg-anim-item cg-bento-container">
                  {bentoItems.map((bentoItem, index) => {
                    const isActive = activeBento === index;
                    return (
                      <a
                        href={bentoItem.link}
                        target="_blank"
                        rel="noreferrer"
                        key={bentoItem.id}
                        className={`cg-bento-item ${isActive ? 'active' : ''}`}
                        style={{ width: isActive ? "55%" : "15%", textDecoration: 'none' }}
                        onMouseEnter={() => setActiveBento(index)}
                      >
                        <div className="cg-bento-bg" style={{ backgroundImage: `url(${bentoItem.image})` }} />
                        <div className={`cg-bento-active-content ${isActive ? 'visible' : ''}`}>
                          <div className="cg-bento-info">
                            <h3>{bentoItem.title}</h3>
                            <div className="cg-bento-icon">{bentoItem.icon}</div>
                          </div>
                        </div>
                        <div className={`cg-bento-inactive-content ${isActive ? 'hidden' : ''}`}>
                          <div className="cg-bento-icon-large">{bentoItem.icon}</div>
                          <span>{bentoItem.title}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              );
            }

            if (i === 17 || i === 18) return null;

            const iconIndex = i % icons.length;
            const Icon = icons[iconIndex];
            const label = labels[iconIndex];
            const link = links[iconIndex];

            return (
              <a 
                href={link} 
                target="_blank" 
                rel="noreferrer"
                key={`img-${i}`} 
                data-col={i % 7} 
                className="cg-anim-item cg-item group"
              >
                <div className="cg-item-content">
                  <Icon className="cg-item-icon" />
                  <div className="cg-item-text">
                    <span className="cg-item-subtitle">Connect on</span>
                    <span className="cg-item-title">{label}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <style>{`
        .cg-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 15vh 0;
          background: transparent;
        }
        .cg-title-section {
          display: grid;
          place-items: center;
          width: 100%;
          margin-bottom: 5vh;
        }
        .cg-title {
          font-size: clamp(3rem, 12vw, 10rem);
          color: var(--text-primary);
          line-height: 0.8;
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .cg-grid-section {
          display: grid;
          place-items: center;
          width: 100%;
          position: relative;
        }
        .cg-grid {
          display: grid;
          width: 95%;
          max-width: 1400px;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 1rem;
          aspect-ratio: 2.5;
        }
        .cg-anim-item {
          will-change: transform, opacity;
        }
        .cg-item {
          position: relative;
          border-radius: 1rem;
          background: #0a0a0a;
          border: 1px solid #222;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s ease;
        }
        .cg-item:hover {
          transform: scale(1.05);
          background: #111;
          border-color: #d4af37;
          z-index: 10;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .cg-item-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 2;
        }
        .cg-item-icon {
          width: 2rem;
          height: 2rem;
          color: #555;
          transition: all 0.3s ease;
        }
        .cg-item:hover .cg-item-icon {
          color: #d4af37;
          transform: scale(1.1);
        }
        .cg-item-text {
          text-align: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        .cg-item:hover .cg-item-text {
          opacity: 1;
          transform: translateY(0);
        }
        .cg-item-subtitle {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          color: #888;
          letter-spacing: 1px;
        }
        .cg-item-title {
          display: block;
          font-size: 0.9rem;
          font-weight: bold;
          color: #fff;
        }
        .cg-bento-container {
          grid-column: span 3;
          display: flex;
          gap: 0.5rem;
          height: 100%;
          z-index: 20;
        }
        .cg-bento-item {
          position: relative;
          border-radius: 1rem;
          background: #050505;
          border: 1px solid #222;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .cg-bento-item.active {
          background: #111;
          border-color: #d4af37;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.1);
        }
        .cg-bento-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          transition: opacity 0.5s ease;
          filter: grayscale(100%);
        }
        .cg-bento-item.active .cg-bento-bg {
          opacity: 0.8;
          filter: grayscale(0%);
        }
        .cg-bento-active-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
          transition: all 0.5s ease;
          z-index: 2;
        }
        .cg-bento-active-content.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .cg-bento-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cg-bento-info h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #fff;
          font-family: 'Sora', sans-serif;
        }
        .cg-bento-icon {
          color: #d4af37;
          font-size: 1.5rem;
        }
        .cg-bento-inactive-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.5s ease;
          z-index: 2;
        }
        .cg-bento-inactive-content.hidden {
          opacity: 0;
          transform: scale(0.9);
          pointer-events: none;
        }
        .cg-bento-icon-large {
          font-size: 2rem;
          color: #666;
          transition: color 0.3s ease;
        }
        .cg-bento-item:hover .cg-bento-icon-large {
          color: #d4af37;
        }
        .cg-bento-inactive-content span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #888;
        }
        @media (max-width: 1024px) {
          .cg-grid { aspect-ratio: 1; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(5, 1fr); }
          .cg-bento-container { grid-column: span 4; }
        }
        @media (max-width: 640px) {
          .cg-grid { aspect-ratio: 0.5; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(10, 1fr); }
          .cg-bento-container { grid-column: span 2; flex-direction: column; height: 300px; }
          .cg-bento-item { width: 100% !important; height: 20%; }
          .cg-bento-item.active { height: 60%; }
        }
      `}</style>
    </div>
  );
}

export default ContactGrid;
