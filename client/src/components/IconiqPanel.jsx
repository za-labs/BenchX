import React from 'react'
import { ICONIQ_LOGO, ICONIQ_CHURN, ARR_TO_ICONIQ } from '../data/benchmarks.js'

function getPeerLabel(yourVal, benchAvg) {
  if (yourVal === undefined || yourVal === null || yourVal === '') return null
  const diff = parseFloat(yourVal) - benchAvg
  const absDiff = Math.abs(diff)
  if (absDiff <= 1) return {
    label: 'In line with peers',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.12)',
  }
  if (diff > 0) return {
    label: 'Above peers',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
  }
  return {
    label: 'Below peers',
    color: '#378ADD',
    bg: 'rgba(55,138,221,0.12)',
  }
}

function IconiqInputPair({ primaryLabel, primaryDesc, derivedLabel, unit, value, onChange, primaryAvg, derivedAvg }) {
  const hasValue   = value !== undefined && value !== ''
  const derived    = hasValue ? Math.round((100 - parseFloat(value)) * 10) / 10 : null
  const primBadge  = getPeerLabel(value, primaryAvg)
  const derivBadge = derived !== null ? getPeerLabel(derived, derivedAvg) : null

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Primary input */}
      <div style={{
        background: 'var(--bg-3)',
        border: `1px solid ${hasValue ? 'var(--border-mid)' : 'var(--accent)'}`,
        borderRadius: 'var(--radius)',
        padding: '10px 12px',
        marginBottom: 6,
        transition: 'border-color .2s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)' }}>{primaryLabel}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 1 }}>{primaryDesc}</div>
          </div>
          {primBadge && (
            <span style={{
              fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
              background: primBadge.bg, color: primBadge.color, whiteSpace: 'nowrap', flexShrink: 0,
            }}>{primBadge.label}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Your value</span>
          <input
            type="number"
            value={value ?? ''}
            placeholder="—"
            min="0" max="100"
            onChange={e => onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
            style={{
              width: 80,
              background: hasValue ? 'var(--bg-4)' : 'var(--accent-dim)',
              border: `1px solid ${hasValue ? 'var(--border)' : 'var(--accent)'}`,
              borderRadius: 'var(--radius)',
              color: 'var(--text)', padding: '4px 8px',
              fontSize: '0.85rem', textAlign: 'right', outline: 'none',
              transition: 'background .2s, border-color .2s',
            }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{unit}</span>
          {primaryAvg !== null && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginLeft: 'auto' }}>
              peers avg: {primaryAvg}%
            </span>
          )}
        </div>
      </div>

      {/* Derived read-only */}
      <div style={{
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '10px 12px',
        opacity: hasValue ? 1 : 0.5,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)' }}>{derivedLabel}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 1 }}>
              Calculated as 100% minus {primaryLabel.toLowerCase()}
            </div>
          </div>
          {derivBadge && (
            <span style={{
              fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
              background: derivBadge.bg, color: derivBadge.color, whiteSpace: 'nowrap',
            }}>{derivBadge.label}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Derived value</span>
          <div style={{
            width: 80, background: 'var(--bg-4)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text-2)',
            padding: '4px 8px', fontSize: '0.85rem', textAlign: 'right',
          }}>
            {derived !== null ? derived : '—'}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{unit}</span>
          {derivedAvg !== null && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginLeft: 'auto' }}>
              peers avg: {derivedAvg}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function TableSection({ data, cols, arrBand }) {
  const icBand = ARR_TO_ICONIQ[arrBand] || '<$10M'
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginTop: 16 }}>
      <thead>
        <tr>
          {cols.map(c => (
            <th key={c.key} style={{
              textAlign: 'left', padding: '5px 8px', fontSize: '0.65rem',
              color: 'var(--text-3)', borderBottom: '1px solid var(--border)', fontWeight: 500,
            }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => {
          const isHi = row.band === icBand
          return (
            <tr key={row.band} style={{ background: isHi ? 'var(--bg-4)' : 'transparent' }}>
              {cols.map(c => (
                <td key={c.key} style={{
                  padding: '5px 8px', borderBottom: '1px solid var(--border)',
                  color: isHi ? 'var(--text)' : 'var(--text-2)',
                  fontWeight: isHi ? 500 : 400,
                }}>
                  {c.fmt ? c.fmt(row[c.key]) : row[c.key]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function IconiqPanel({ arrBand, iconiqVals, onIconiqChange }) {
  const icBand   = ARR_TO_ICONIQ[arrBand] || '<$10M'
  const logoRow  = ICONIQ_LOGO.find(r => r.band === icBand)  || ICONIQ_LOGO[0]
  const churnRow = ICONIQ_CHURN.find(r => r.band === icBand) || ICONIQ_CHURN[0]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
      }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)', fontWeight: 300 }}>
          New ARR mix
        </h3>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: 12 }}>
          As % of gross new ARR — your band: <span style={{ color: 'var(--text-2)' }}>{icBand}</span>
        </p>
        <IconiqInputPair
          primaryLabel="New logo ARR %"
          primaryDesc="New customer ARR as % of gross new ARR"
          derivedLabel="Expansion ARR %"
          unit="%"
          value={iconiqVals.newLogo}
          onChange={v => onIconiqChange('newLogo', v)}
          primaryAvg={logoRow.newLogo}
          derivedAvg={logoRow.expansion}
        />
        <TableSection
          data={ICONIQ_LOGO} arrBand={arrBand}
          cols={[
            { key: 'band',      label: 'ARR range' },
            { key: 'newLogo',   label: 'New logo %',  fmt: v => `${v}%` },
            { key: 'expansion', label: 'Expansion %', fmt: v => `${v}%` },
          ]}
        />
      </div>

      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
      }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)', fontWeight: 300 }}>
          Gross churn mix
        </h3>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: 12 }}>
          As % of gross churn ARR — your band: <span style={{ color: 'var(--text-2)' }}>{icBand}</span>
        </p>
        <IconiqInputPair
          primaryLabel="Logo churn ARR %"
          primaryDesc="Full logo churn as % of gross churn ARR"
          derivedLabel="Downsell ARR %"
          unit="%"
          value={iconiqVals.logoCh}
          onChange={v => onIconiqChange('logoCh', v)}
          primaryAvg={churnRow.logoCh}
          derivedAvg={churnRow.downsell}
        />
        <TableSection
          data={ICONIQ_CHURN} arrBand={arrBand}
          cols={[
            { key: 'band',     label: 'ARR range' },
            { key: 'logoCh',   label: 'Logo churn %', fmt: v => `${v}%` },
            { key: 'downsell', label: 'Downsell %',   fmt: v => `${v}%` },
          ]}
        />
      </div>
    </div>
  )
}
