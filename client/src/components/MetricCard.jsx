import React from 'react'
import BenchmarkBar from './BenchmarkBar.jsx'

export function getRating(val, def, arrBand) {
  if (val === undefined || val === null || val === '') return 'empty'
  const d = def.arr[arrBand]
  if (!d) return 'empty'
  const p25 = d.bi[0] !== null ? d.bi[0] : d.ha[0]
  const med  = d.bi[1] !== null ? d.bi[1] : d.ha[1]
  const p75  = d.bi[2] !== null ? d.bi[2] : d.ha[2]
  if (med === null) return 'empty'
  const v = parseFloat(val)
  if (!def.lowerIsBetter) {
    if (p75 !== null && v >= p75) return 'top'
    if (v >= med)                  return 'above'
    if (p25 !== null && v >= p25)  return 'below'
    return 'bottom'
  } else {
    if (p25 !== null && v <= p25) return 'top'
    if (v <= med)                  return 'above'
    if (p75 !== null && v <= p75)  return 'below'
    return 'bottom'
  }
}

const BADGE = {
  top:    { label: 'Top quartile',    bg: 'rgba(34,197,94,0.15)',   color: '#16a34a' },
  above:  { label: 'Above median',    bg: 'rgba(59,130,246,0.15)',  color: '#2563eb' },
  below:  { label: 'Below median',    bg: 'rgba(245,158,11,0.15)',  color: '#b45309' },
  bottom: { label: 'Bottom quartile', bg: 'rgba(239,68,68,0.15)',   color: '#dc2626' },
  empty:  { label: 'Enter a value',   bg: 'rgba(128,128,128,0.12)', color: '#6b7280' },
}

export default function MetricCard({ name, def, arrBand, acvBand, pricingModel, fundingStage, yourVal, onValueChange }) {
  const rating  = getRating(yourVal, def, arrBand)
  const badge   = BADGE[rating]
  const numVal  = yourVal !== undefined && yourVal !== '' ? parseFloat(yourVal) : undefined
  const dispVal = numVal !== undefined
    ? (Math.abs(numVal) < 10 ? +numVal.toFixed(1) : Math.round(numVal))
    : null

  // Pass name down so BenchmarkBar can look up Serena data by metric name
  const defWithName = { ...def, name }

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.25rem',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', lineHeight: 1.4 }}>{def.description}</div>
        </div>
        <span style={{
          fontSize: '0.68rem', padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap',
          background: badge.bg, color: badge.color, flexShrink: 0,
        }}>{badge.label}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'var(--font-body)' }}>Your value</span>
        <input
          type="number"
          value={yourVal ?? ''}
          placeholder="—"
          onChange={e => onValueChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
          style={{
            width: 90,
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)', color: 'var(--text)',
            padding: '5px 8px', fontSize: '0.9rem', textAlign: 'right', outline: 'none',
          }}
        />
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{def.unit}</span>
        {dispVal !== null && (
          <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: badge.color, marginLeft: 'auto' }}>
            {dispVal}
          </span>
        )}
      </div>

      <BenchmarkBar
        def={defWithName}
        arrBand={arrBand} acvBand={acvBand}
        pricingModel={pricingModel} fundingStage={fundingStage}
        yourVal={numVal}
      />
    </div>
  )
}
