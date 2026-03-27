import React, { useState, useEffect } from 'react'

const THEMES = [
  { id: 'theme-current', label: 'Default',   mode: 'dark',  swatch: '#4ade80' },
  { id: 'theme-e',       label: 'Navy',       mode: 'dark',  swatch: '#38bdf8' },
  { id: 'theme-a',       label: 'Studio',     mode: 'light', swatch: '#1a56db' },
  { id: 'theme-d',       label: 'Editorial',  mode: 'light', swatch: '#b84a2e' },
]

export default function ThemeSwitcher() {
  const [active,  setActive]  = useState(() => localStorage.getItem('theme') || 'theme-a')
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    THEMES.forEach(t => document.body.classList.remove(t.id))
    document.body.classList.add(active)
    localStorage.setItem('theme', active)
  }, [active])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {THEMES.map(t => (
        <div key={t.id} style={{ position: 'relative' }}>
          <button
            onClick={() => setActive(t.id)}
            onMouseEnter={() => setTooltip(t.id)}
            onMouseLeave={() => setTooltip(null)}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: t.swatch, padding: 0, cursor: 'pointer', outline: 'none',
              border: active === t.id ? '2px solid var(--text)' : '2px solid transparent',
              transition: 'transform .15s, border-color .15s',
              transform: active === t.id ? 'scale(1.3)' : 'scale(1)',
              flexShrink: 0,
            }}
          />
          {tooltip === t.id && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
              transform: 'translateX(-50%)', background: 'var(--bg-4)',
              border: '1px solid var(--border-mid)', borderRadius: 'var(--radius)',
              padding: '3px 8px', fontSize: '0.65rem', color: 'var(--text-2)',
              whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100,
            }}>
              {t.label} · {t.mode}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
