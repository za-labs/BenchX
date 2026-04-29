import React from 'react'
import { SERENA_ARR, SERENA_STAGE, PRIMARY_SOLUTION } from '../data/benchmarks.js'

const COLORS = {
  bi:          '#378ADD',
  ha:          '#4ade80',
  acv:         '#a78bfa',
  pm:          '#fbbf24',
  serenaArr:   '#fb7185',
  serenaStage: '#fb7185',
  gtm:         '#06b6d4',
  domain:      '#f97316',
}

function fmt(v) {
  if (v === null || v === undefined) return '—'
  return Math.abs(v) < 10 ? +v.toFixed(1) : Math.round(v)
}

function Bar({ label, color, trio, yourVal, dashed }) {
  const [p25, med, p75] = trio
  if (med === null && p25 === null && p75 === null) return null

  const hasP25 = p25 !== null
  const hasP75 = p75 !== null
  const spread = hasP25 && hasP75 ? p75 - p25 : Math.max(Math.abs(med ?? 0) * 0.4, 10)
  const lo = hasP25 ? p25 : (med ?? 0) - spread * 0.6
  const hi = hasP75 ? p75 : (med ?? 0) + spread * 0.6
  const pad = Math.max((hi - lo) * 0.2, 3)
  const axLo = lo - pad, axHi = hi + pad, axRange = axHi - axLo

  const pct = v => Math.max(0, Math.min(100, ((v - axLo) / axRange) * 100))
  const fillL = hasP25 ? pct(p25) : pct(med) - 12
  const fillW = hasP25 && hasP75 ? pct(p75) - pct(p25) : 24
  const medPct = pct(med)
  const p25Pct = hasP25 ? pct(p25) : null
  const p75Pct = hasP75 ? pct(p75) : null
  const yPct   = yourVal !== undefined ? pct(yourVal) : null

  const fillStyle = {
    position: 'absolute', top: 0, height: '100%', borderRadius: 3,
    left: `${fillL.toFixed(1)}%`, width: `${Math.max(fillW, 0).toFixed(1)}%`,
    background: color, opacity: dashed ? 0.45 : 0.75,
    WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
      </div>
      <div style={{ position: 'relative', height: 14, background: 'var(--bg-4)', borderRadius: 3 }}>
        <div style={fillStyle} />
        <div style={{
          position: 'absolute', top: 0, width: 2, height: '100%',
          background: 'rgba(255,255,255,0.75)', left: `${medPct.toFixed(1)}%`,
        }} />
        {yPct !== null && yPct >= 0 && yPct <= 100 && (
          <div style={{
            position: 'absolute', top: -4, width: 3, height: 'calc(100% + 8px)',
            background: '#f87171', borderRadius: 1, zIndex: 3,
            left: `${yPct.toFixed(1)}%`,
          }} />
        )}
      </div>
      <div style={{ position: 'relative', height: 28, marginTop: 3 }}>
        {hasP25 && p25Pct !== null && (
          <div style={{ position: 'absolute', left: `${p25Pct.toFixed(1)}%`, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', fontWeight: 500 }}>{fmt(p25)}</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-3)' }}>P25</div>
          </div>
        )}
        <div style={{ position: 'absolute', left: `${medPct.toFixed(1)}%`, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text)', fontWeight: 500 }}>{fmt(med)}</div>
          <div style={{ fontSize: '0.58rem', color: 'var(--text-3)' }}>Med</div>
        </div>
        {hasP75 && p75Pct !== null && (
          <div style={{ position: 'absolute', left: `${p75Pct.toFixed(1)}%`, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', fontWeight: 500 }}>{fmt(p75)}</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-3)' }}>P75</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BenchmarkBar({ def, arrBand, acvBand, pricingModel, fundingStage, gtmScope, productDomain, yourVal }) {
  const d = def.arr[arrBand] || { bi: [null, null, null], ha: [null, null, null] }

  const serenaArrTrio = SERENA_ARR[def.name ?? '']?.[arrBand] ?? null
  const isSpend = def.category === 'Spend'
  const serenaStage = !isSpend && fundingStage && fundingStage !== 'Not specified'
    ? SERENA_STAGE[def.name ?? '']?.[fundingStage] ?? null
    : null

  const gtmTrio    = gtmScope && gtmScope !== 'Not specified'
    ? PRIMARY_SOLUTION[def.name ?? '']?.[gtmScope] ?? null
    : null
  const domainTrio = productDomain && productDomain !== 'Not specified'
    ? PRIMARY_SOLUTION[def.name ?? '']?.[productDomain] ?? null
    : null

  const bars = [
    { label: 'benchmarkit.ai (by ARR)', color: COLORS.bi,  trio: d.bi },
    { label: 'High Alpha (by ARR)',      color: COLORS.ha,  trio: d.ha },
    ...(def.acv?.[acvBand]     ? [{ label: `benchmarkit.ai (ACV: ${acvBand})`,   color: COLORS.acv, trio: def.acv[acvBand] }] : []),
    ...(def.pm?.[pricingModel] ? [{ label: `benchmarkit.ai (${pricingModel})`,   color: COLORS.pm,  trio: def.pm[pricingModel] }] : []),
    ...(serenaArrTrio           ? [{ label: 'Serena (by ARR)',   color: COLORS.serenaArr,   trio: serenaArrTrio,  dashed: true }] : []),
    ...(serenaStage             ? [{ label: `Serena (${fundingStage})`, color: COLORS.serenaStage, trio: serenaStage, dashed: false }] : []),
    ...(gtmTrio    ? [{ label: `benchmarkit.ai (${gtmScope})`,    color: COLORS.gtm,    trio: gtmTrio    }] : []),
    ...(domainTrio ? [{ label: `benchmarkit.ai (${productDomain})`, color: COLORS.domain, trio: domainTrio }] : []),
  ]

  return (
    <div>
      {bars.map(b => (
        <Bar key={b.label} label={b.label} color={b.color} trio={b.trio} yourVal={yourVal} dashed={b.dashed} />
      ))}
    </div>
  )
}
