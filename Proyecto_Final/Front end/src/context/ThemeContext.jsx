import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const LS_THEME_KEY = 'app_theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(LS_THEME_KEY) ?? 'claro'
  })

  useEffect(() => {
    localStorage.setItem(LS_THEME_KEY, theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'claro' ? 'oscuro' : 'claro'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
