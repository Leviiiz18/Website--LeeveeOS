import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Desktop    from './components/Desktop'
import MobileView from './pages/MobileView'
import BootScreen from './components/BootScreen'

export default function App() {
  const [booted, setBooted]     = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Custom cursor logic
  useEffect(() => {
    if (isMobile) return
    const el = cursorRef.current
    if (!el) return

    const onMove = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top  = e.clientY + 'px'
    }

    const onDown = () => {
      el.classList.add('clicking')
      setTimeout(() => el.classList.remove('clicking'), 150)
    }

    const onOver = (e) => {
      const interactive = e.target.closest(
        'button, a, [role="button"], input, textarea, [onclick], .cursor-pointer'
      )
      el.classList.toggle('expanded', !!interactive)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseover', onOver)
    }
  }, [isMobile])

  if (isMobile) return <MobileView />

  return (
    <>
      {/* Custom cursor */}
      <div id="levee-cursor" ref={cursorRef} />

      <AnimatePresence>
        {!booted ? (
          <BootScreen key="boot" onComplete={() => setBooted(true)} />
        ) : (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>
    </>
  )
}
