import React from 'react'
import BenchmarkBar from './BenchmarkBar.jsx'
import { SERENA_ARR, SERENA_STAGE, PRIMARY_SOLUTION } from '../data/benchmarks.js'

// Score a single [p25, median, p75] triplet against a value
// Returns 'top'|'above'|'below'|'bottom'|null
function scoreSource(val, triplet, lowerIsBetter) {
  if (!triplet) return null
  const [p25, median, p75] = triplet
  if (median === null) return null
  const v = parseFloat(val)
  if (!lowerIsBetter) {
    if (p75 !== null && v >= p75) return 'top'
    if (v >= median)               return 'above'
    if (p25 !== null && v >= p25)  return 'below'
    return 'bottom'
  } else {
    if (p25 !== null && v <= p25) return 'top'
    if (v <= median)               return 'above'
    if (p75 !== null && v <= p75)  return 'below'
    return 'bottom'
  }
}

const QUARTILE_SCORE = { top: 4, above: 3, below: 2, bottom: 1 }
const SCORE_QUARTILE = { 4: 'top', 3: 'above', 2: 'below', 1: 'bottom' }

export function getRating(val, def, arrBand, acvBand, pricingModel, fundingStage, name, gtmScope, productDomain) {
  if (val === undefined || val === null || val === '') return 'empty'
  const votes = []

  // 1. benchmarkit.ai ARR
  const d = def.arr?.[arrBand]
  if (d) {
    const biTriplet = d.bi?.some(x => x !== null) ? d.bi : null
    const haTriplet = d.ha?.some(x => x !== null) ? d.ha : null
    const bi = scoreSource(val, biTriplet, def.lowerIsBetter)
    if (bi) votes.push(bi)
    const ha = scoreSource(val, haTriplet, def.lowerIsBetter)
    if (ha) votes.push(ha)
  }

  // 2. Serena ARR — skip if P25 and P75 are both null (median-only)
  if (name) {
    const serenaArr = SERENA_ARR[name]?.[arrBand]
    if (serenaArr && !(serenaArr[0] === null && serenaArr[2] === null)) {
      const s = scoreSource(val, serenaArr, def.lowerIsBetter)
      if (s) votes.push(s)
    }

    // 3. Serena funding stage — skip if median-only
    if (fundingStage && fundingStage !== 'Not specified') {
      const serenaSt = SERENA_STAGE[name]?.[fundingStage]
      if (serenaSt && !(serenaSt[0] === null && serenaSt[2] === null)) {
        const s = scoreSource(val, serenaSt, def.lowerIsBetter)
        if (s) votes.push(s)
      }
    }
  }

  // 4. benchmarkit.ai ACV
  if (acvBand && def.acv?.[acvBand]) {
    const s = scoreSource(val, def.acv[acvBand], def.lowerIsBetter)
    if (s) votes.push(s)
  }

  // 5. benchmarkit.ai pricing model
  if (pricingModel && def.pm?.[pricingModel]) {
    const s = scoreSource(val, def.pm[pricingModel], def.lowerIsBetter)
    if (s) votes.push(s)
  }

  // 6. benchmarkit.ai GTM scope
  if (name && gtmScope && gtmScope !== 'Not specified') {
    const gtmTrio = PRIMARY_SOLUTION[name]?.[gtmScope]
    if (gtmTrio && !(gtmTrio[0] === null && gtmTrio[2] === null)) {
      const s = scoreSource(val, gtmTrio, def.lowerIsBetter)
      if (s) votes.push(s)
    }
  }

  // 7. benchmarkit.ai Product Domain
  if (name && productDomain && productDomain !== 'Not specified') {
    const domainTrio = PRIMARY_SOLUTION[name]?.[productDomain]
    if (domainTrio && !(domainTrio[0] === null && domainTrio[2] === null)) {
      const s = scoreSource(val, domainTrio, def.lowerIsBetter)
      if (s) votes.push(s)
    }
  }

  if (votes.length === 0) return 'empty'

  // Average numeric scores and snap to nearest quartile
  const avg = votes.reduce((sum, v) => sum + QUARTILE_SCORE[v], 0) / votes.length
  const snapped = Math.round(avg)
  return SCORE_QUARTILE[Math.max(1, Math.min(4, snapped))]
}

const BADGE = {
  top:    { label: 'Top quartile',    bg: 'rgba(34,197,94,0.15)',   color: '#16a34a' },
  above:  { label: 'Above median',    bg: 'rgba(59,130,246,0.15)',  color: '#2563eb' },
  below:  { label: 'Below median',    bg: 'rgba(245,158,11,0.15)',  color: '#b45309' },
  bottom: { label: 'Bottom quartile', bg: 'rgba(239,68,68,0.15)',   color: '#dc2626' },
  empty:  { label: 'Enter a value',   bg: 'rgba(128,128,128,0.12)', color: '#6b7280' },
}

export default function MetricCard({ name, def, arrBand, acvBand, pricingModel, fundingStage, gtmScope, productDomain, yourVal, onValueChange }) {
  const rating  = getRating(yourVal, def, arrBand, acvBand, pricingModel, fundingStage, name, gtmScope, productDomain)
  const badge   = BADGE[rating]
  const numVal  = yourVal !== undefined && yourVal !== '' ? parseFloat(yourVal) : undefined
  const dispVal = numVal !== undefined
    ? (Math.abs(numVal) < 10 ? +numVal.toFixed(1) : Math.round(numVal))
    : null

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
        gtmScope={gtmScope} productDomain={productDomain}
        yourVal={numVal}
      />
    </div>
  )
}
