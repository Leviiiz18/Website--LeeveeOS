import { createContext, useState, useContext, useEffect } from 'react'

export const THEME_COLORS = {
  cyan:   { name: 'Neon Cyan',   value: '#00d4ff', hex: '#00d4ff' },
  green:  { name: 'Hacker Green',value: '#4ade80', hex: '#4ade80' },
  amber:  { name: 'Amber CRT',   value: '#fbbf24', hex: '#fbbf24' },
  pink:   { name: 'Synth Pink',  value: '#f472b6', hex: '#f472b6' },
  purple: { name: 'Deep Indigo', value: '#8b5cf6', hex: '#8b5cf6' },
}

export const BACKGROUNDS = {
  pixel:  { id: 'pixel',  name: '8-Bit Skyline' },
  matrix: { id: 'matrix', name: 'Matrix Rain' },
  black:  { id: 'black',  name: 'Pitch Black' },
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Try to load from localStorage, default to pixel & cyan
  const [bgData, setBgData] = useState(() => localStorage.getItem('leveeos_bg') || 'pixel')
  const [accentId, setAccentId] = useState(() => localStorage.getItem('leveeos_accent') || 'cyan')

  useEffect(() => {
    localStorage.setItem('leveeos_bg', bgData)
    localStorage.setItem('leveeos_accent', accentId)
  }, [bgData, accentId])

  const accentColor = THEME_COLORS[accentId]?.value || THEME_COLORS.cyan.value

  // We can pass the accent color down to the CSS variables for easy global styling
  useEffect(() => {
    document.documentElement.style.setProperty('--os-accent', accentColor)
  }, [accentColor])

  return (
    <ThemeContext.Provider value={{
      background: bgData,
      setBackground: setBgData,
      accentId,
      setAccentId,
      accentColor
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
