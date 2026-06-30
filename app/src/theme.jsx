import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

// Theme is applied through a `data-theme` attribute on <html>, which flips the
// CSS custom-property tokens defined in index.css. The rest of the app never
// re-renders on a theme change — only CSS recalculates — so switching is cheap
// and animates smoothly via the global color transition.

const STORAGE_KEY = 'callcoffee_theme'
const MODES = ['system', 'light', 'dark']

const ThemeContext = createContext({
  mode: 'system', // 'system' | 'light' | 'dark' (user preference)
  resolved: 'light', // 'light' | 'dark' (actually applied)
  setMode: () => {},
  toggle: () => {},
})

function readStoredMode() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (MODES.includes(v)) return v
  } catch {
    // storage unavailable — fall back to system
  }
  return 'system'
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(resolved) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved)
    document.documentElement.style.colorScheme = resolved
  }
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredMode)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const firstRun = useRef(true)

  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  // Apply synchronously on first render so there is no flash, then enable the
  // animated transition only afterwards (avoids a transition on initial paint).
  if (firstRun.current && typeof document !== 'undefined') {
    applyTheme(resolved)
    firstRun.current = false
  }

  useEffect(() => {
    applyTheme(resolved)
    // turn on the cross-fade after the first committed paint
    const id = requestAnimationFrame(() => document.documentElement.classList.add('theme-anim'))
    return () => cancelAnimationFrame(id)
  }, [resolved])

  // follow the OS setting while in "system" mode
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore persistence failure
    }
  }, [])

  // Toggle gives a simple Light <-> Dark switch (sets an explicit preference,
  // leaving room for the 3-way system/light/dark selector to use setMode).
  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setMode])

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
