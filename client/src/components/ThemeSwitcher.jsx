import React, { useState, useEffect } from 'react'

const THEMES = [
  { id: 'theme-a', label: 'Light', mode: 'light' },
  { id: 'theme-e', label: 'Dark',  mode: 'dark'  },
]

const SunIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function ThemeSwitcher() {
  const [active, setActive] = useState(() => localStorage.getItem('theme') || 'theme-a')

  useEffect(() => {
    THEMES.forEach(t => document.body.classList.remove(t.id))
    document.body.classList.add(active)
    localStorage.setItem('theme', active)
  }, [active])

  const isDark = active === 'theme-e'

  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-3)',
      border: '1px solid var(--border-mid)',
      borderRadius: 999,
      padding: 3,
      gap: 2,
    }}>
      {THEMES.map(t => {
        const isActive = active === t.id
        const isLight = t.mode === 'light'
        return (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            title={t.label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 999,
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: isActive ? '1px solid var(--accent-mid)' : '1px solid transparent',
              cursor: 'pointer', outline: 'none', transition: 'all .15s',
              padding: 0,
            }}
          >
            {isLight
              ? <SunIcon size={14} color={isActive ? 'var(--accent)' : 'var(--text-3)'} />
              : <MoonIcon size={14} color={isActive ? 'var(--accent)' : 'var(--text-3)'} />
            }
          </button>
        )
      })}
    </div>
  )
}
