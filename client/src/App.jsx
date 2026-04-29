import React, { useState, useCallback } from 'react'
import MetricCard from './components/MetricCard.jsx'
import AnalysisPanel from './components/AnalysisPanel.jsx'
import IconiqPanel from './components/IconiqPanel.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import { METRICS, ARR_BANDS, ACV_BANDS, PRICING_MODELS, FUNDING_STAGES, GTM_SCOPES, PRODUCT_DOMAINS } from './data/benchmarks.js'

// Merge Growth + Profitability into one section
const CATEGORY_CONFIG = [
  { key: 'Growth & profitability', matches: ['Growth', 'Profitability'] },
  { key: 'Retention',              matches: ['Retention'] },
  { key: 'Efficiency',             matches: ['Efficiency'] },
  { key: 'Spend',                  matches: ['Spend'] },
]

function parseUrlState() {
  try {
    const params = new URLSearchParams(window.location.search)
    const state = params.get('s')
    if (!state) return null
    return JSON.parse(atob(state))
  } catch { return null }
}

function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '0.75rem 1rem',
          background: open ? 'var(--bg-3)' : 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: open ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
          cursor: 'pointer', fontFamily: 'var(--font-mono)',
          transition: 'background .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
        onMouseLeave={e => e.currentTarget.style.background = open ? 'var(--bg-3)' : 'var(--bg-2)'}
      >
        <span style={{
          fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-2)',
          minWidth: 16, textAlign: 'center',
        }}>{open ? '−' : '+'}</span>
        <span style={{
          fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-3)',
        }}>{title}</span>
      </button>
      {open && (
        <div style={{
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius) var(--radius)',
          padding: '1.5rem',
        }} className="fade-up">
          {children}
        </div>
      )}
    </section>
  )
}

function CopyEmailButton() {
  const [copied, setCopied] = React.useState(false)
  function copy() {
    navigator.clipboard.writeText('hello@mizab.io').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      style={{
        background: 'var(--accent)', border: 'none',
        borderRadius: 'var(--radius)', color: 'var(--accent-text)',
        padding: '9px 20px', fontSize: '0.78rem', fontWeight: 500,
        fontFamily: 'var(--font-mono)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'opacity .15s',
      }}
    >
      <span>hello@mizab.io</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--accent-text)', opacity: 0.7 }}>
        {copied ? '✓ Copied' : '⎘ Copy'}
      </span>
    </button>
  )
}

export default function App() {
  const urlState = parseUrlState()

  const [arrBand,           setArrBand]          = useState(urlState?.arrBand      || '$1M-$5M')
  const [acvBand,           setAcvBand]           = useState(urlState?.acvBand      || '$5K-$10K')
  const [pricingModel,      setPricingModel]      = useState(urlState?.pricingModel || 'Subscription')
  const [userVals,          setUserVals]          = useState(urlState?.userVals     || {})
  const [iconiqVals,        setIconiqVals]        = useState(urlState?.iconiqVals   || { newLogo: undefined, logoCh: undefined })
  const [additionalContext, setAdditionalContext] = useState(urlState?.additionalContext || '')
  const [fundingStage,      setFundingStage]      = useState(urlState?.fundingStage || 'Not specified')
  const [gtmScope,          setGtmScope]          = useState(urlState?.gtmScope       || 'Not specified')
  const [productDomain,     setProductDomain]     = useState(urlState?.productDomain  || 'Not specified')


  const setVal    = useCallback((name, val) => setUserVals(prev => ({ ...prev, [name]: val })), [])
  const setIconiq = useCallback((name, val) => setIconiqVals(prev => ({ ...prev, [name]: val })), [])

  const totalMetrics = Object.keys(METRICS).length
  const filledCount  = Object.values(userVals).filter(v => v !== undefined && v !== '').length
  const charCount    = additionalContext.length

  function buildShareUrl() {
    const state = btoa(JSON.stringify({ arrBand, acvBand, pricingModel, fundingStage, gtmScope, productDomain, userVals, iconiqVals, additionalContext }))
    return `${window.location.origin}${window.location.pathname}?s=${state}`
  }

  function selStyle() {
    return {
      background: 'var(--accent-dim)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--radius)', color: 'var(--text)',
      padding: '7px 10px', fontSize: '0.8rem', width: '100%',
    }
  }

  const labelStyle = { fontSize: '0.72rem', color: 'var(--text-3)', display: 'block', marginBottom: 5 }
  const sectionHdr = {
    fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)',
    marginBottom: '1rem', paddingBottom: 6, borderBottom: '1px solid var(--border)',
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem 4rem' }}>

      {/* Header */}
      <header style={{ padding: '3rem 0 2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontFamily: 'var(--font-display)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
                  <span style={{ color: 'var(--text)' }}>Bench</span><span style={{ color: '#2dd4bf' }}>X</span>
                </h1>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2dd4bf', opacity: 0.85 }}>SaaS Benchmarks</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
                Built by <a href="https://mizab.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)', textDecoration: 'underline' }} onMouseEnter={e => e.target.style.color='var(--accent)'} onMouseLeave={e => e.target.style.color='var(--text-3)'}>mizab.io</a>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', maxWidth: 520, lineHeight: 1.7 }}>
              Every investor has these numbers. Most founders don't. See exactly where your metrics stand against hundreds of SaaS companies, and what to prioritize to close the gap.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
            <ThemeSwitcher />
            <div style={{ display: 'flex', gap: 24, fontSize: '0.75rem', color: 'var(--text-3)' }}>
              {[['4','sources'],['11','metrics']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--text)', fontWeight: 300 }}>{n}</div>
                  <div>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* How to use */}
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          How to use this tool
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { step: '01', title: 'Select your peer group', desc: 'Choose your ARR band, ACV band, and pricing model. This sets which benchmark cohort you\'re compared against.' },
            { step: '02', title: 'Enter your metrics', desc: 'Type your values into the highlighted input fields on each metric card. Enter as many or as few as you have.' },
            { step: '03', title: 'Get your personalised analysis', desc: 'Scroll down and run your analysis for a detailed, actionable breakdown on what\'s working, what to fix, and how.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 500, minWidth: 20, paddingTop: 2 }}>{step}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-3)' }}>
          Your metrics are not stored and not used to train any models.
        </div>
      </div>

      {/* Peer group */}
      <section style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem',
      }}>
        <h2 style={{ ...sectionHdr }}>Your peer group</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>ARR band</label>
            <select value={arrBand} onChange={e => setArrBand(e.target.value)} style={selStyle()}>
              {ARR_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>ACV band</label>
            <select value={acvBand} onChange={e => setAcvBand(e.target.value)} style={selStyle()}>
              {ACV_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Pricing model</label>
            <select value={pricingModel} onChange={e => setPricingModel(e.target.value)} style={selStyle()}>
              {PRICING_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Funding stage <span style={{ opacity: 0.6 }}>(optional)</span></label>
            <select value={fundingStage} onChange={e => setFundingStage(e.target.value)} style={selStyle()}>
              {FUNDING_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Go-to-Market Scope <span style={{ opacity: 0.6 }}>(optional)</span></label>
            <select value={gtmScope} onChange={e => setGtmScope(e.target.value)} style={selStyle()}>
              {GTM_SCOPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Product Domain <span style={{ opacity: 0.6 }}>(optional)</span></label>
            <select value={productDomain} onChange={e => setProductDomain(e.target.value)} style={selStyle()}>
              {PRODUCT_DOMAINS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>
      </section>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.72rem', color: 'var(--text-3)', alignItems: 'center' }}>
        {[
          { color: '#378ADD', label: 'benchmarkit.ai (ARR)' },
          { color: '#4ade80', label: 'High Alpha (ARR)' },
          { color: '#a78bfa', label: 'benchmarkit.ai (ACV)' },
          { color: '#fbbf24', label: 'benchmarkit.ai (pricing)' },
          { color: '#fb7185', label: 'Serena (ARR or Stage)' },
          { color: '#06b6d4', label: 'benchmarkit.ai (GTM scope)' },
          { color: '#f97316', label: 'benchmarkit.ai (Product domain)' },
          { color: '#f87171', label: 'Your value', isLine: true },
        ].map(({ color, label, isLine }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: isLine ? 3 : 10, height: isLine ? 14 : 10, background: color, borderRadius: isLine ? 1 : 2, flexShrink: 0 }} />
            {label}
          </span>
        ))}
        {/* Live accent swatch for highlighted border hint */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'transparent', border: '2px solid var(--accent)', flexShrink: 0 }} />
          highlighted border = needs your input
        </span>
        <span style={{ marginLeft: 'auto', fontStyle: 'italic', fontSize: '0.68rem' }}>
          Shaded bar = P25 → P75 · white line = median
        </span>
      </div>

      {/* Metric cards — merged categories */}
      {CATEGORY_CONFIG.map(({ key, matches }) => {
        const entries = Object.entries(METRICS).filter(([, def]) => matches.includes(def.category))
        if (!entries.length) return null
        return (
          <section key={key} style={{ marginBottom: '2rem' }}>
            <h2 style={sectionHdr}>{key}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
              {entries.map(([name, def]) => (
                <MetricCard
                  key={name} name={name} def={def}
                  arrBand={arrBand} acvBand={acvBand} pricingModel={pricingModel}
                  fundingStage={fundingStage} gtmScope={gtmScope} productDomain={productDomain}
                  yourVal={userVals[name]}
                  onValueChange={val => setVal(name, val)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* ICONIQ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionHdr}>ICONIQ ARR mix</h2>
        <IconiqPanel arrBand={arrBand} iconiqVals={iconiqVals} onIconiqChange={setIconiq} />
      </section>

      {/* Additional context */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionHdr}>Additional context</h2>
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>
            Any additional information on your company, metrics or strategy?
          </label>
          <textarea
            value={additionalContext}
            onChange={e => { if (e.target.value.length <= 800) setAdditionalContext(e.target.value) }}
            placeholder="e.g. We recently raised a Series A and are investing heavily in sales headcount. Our Q3 churn spike was driven by one large customer leaving…"
            rows={4}
            style={{
              width: '100%', background: 'var(--bg-3)',
              border: `1px solid ${additionalContext ? 'var(--border-mid)' : 'var(--accent)'}`,
              borderRadius: 'var(--radius)', color: 'var(--text)',
              padding: '10px 12px', fontSize: '0.82rem', lineHeight: 1.6,
              resize: 'vertical', outline: 'none', transition: 'border-color .2s',
            }}
          />
          <div style={{ fontSize: '0.68rem', color: charCount > 700 ? 'var(--amber)' : 'var(--text-3)', textAlign: 'right', marginTop: 4 }}>
            {charCount} / 800
          </div>
        </div>
      </section>

      {/* Analysis */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionHdr}>Analysis &amp; recommendations</h2>
        <AnalysisPanel
          userVals={userVals} arrBand={arrBand} acvBand={acvBand}
          pricingModel={pricingModel} fundingStage={fundingStage} metrics={METRICS}
          gtmScope={gtmScope} productDomain={productDomain}
          additionalContext={additionalContext}
          buildShareUrl={buildShareUrl}
        />
      </section>

      {/* Feedback — collapsible */}
      <CollapsibleSection title="Feedback" defaultOpen={true}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Built by <a href="https://mizab.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>mizab.io</a>.
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Feedback, comments or suggestions? Get in touch:
        </p>
        <CopyEmailButton />
      </CollapsibleSection>

      {/* Methodology — collapsible */}
      <CollapsibleSection title="Methodology &amp; data sources">
        <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          This tool benchmarks your SaaS metrics using data from four independent research reports.
          Benchmarks are presented as P25 / Median / P75 across respondent companies, segmented by ARR band.
          Where two sources cover the same metric, both are shown side by side so you can triangulate.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { name: 'benchmarkit.ai — 2024 SaaS Benchmarks', detail: 'Based on 583 participant companies. Covers CY-24 data. Provides P25/Median/P75 segmented by ARR band, ACV band, and pricing model. See the report for more information on samples per metric.', url: 'https://www.benchmarkit.ai/2025benchmarks' },
            { name: 'High Alpha — 2025 SaaS Benchmarks', detail: 'Based on 800+ SaaS companies. Covers 2025 data with year-over-year deltas vs 2024. Provides P25/Median/P75 segmented by ARR band.', url: 'https://www.highalpha.com/saas-benchmarks' },
            { name: 'ICONIQ Growth — 2025 State of Software', detail: "Based on quarterly financial and operating data from a select dataset of public SaaS companies and ICONIQ's private venture and growth portfolio companies from 2013 – Q2 2025. Averages only (no quartiles). See ICONIQ's report for more information.", url: 'https://www.iconiq.com/growth/reports/2025-state-of-software' },
            { name: 'Serena — European SaaS Benchmark', detail: 'European SaaS benchmark data providing P25/Median/P75 segmented by ARR band and funding stage. Covers key growth, retention, and efficiency metrics for European SaaS companies.', url: 'https://www.europeansaasbenchmark.com/' },
          ].map(({ name, detail, url }) => (
            <div key={name} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{name}</div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 10 }}>{detail}</p>
              <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent)', textDecoration: 'none' }}>View report →</a>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>How ratings work</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.72rem', color: 'var(--text-3)' }}>
            {[
              { label: 'Top quartile',    color: '#22c55e', desc: '≥ P75' },
              { label: 'Above median',    color: '#3b82f6', desc: '≥ Median, < P75' },
              { label: 'Below median',    color: '#f59e0b', desc: '< Median, ≥ P25' },
              { label: 'Bottom quartile', color: '#ef4444', desc: '< P25' },
            ].map(({ label, color, desc }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                <strong style={{ color: 'var(--text-2)' }}>{label}</strong> — {desc}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 8, lineHeight: 1.5 }}>
            For lower-is-better metrics (CAC Payback, Burn Multiple, S&amp;M, R&amp;D spend), the scale is inverted — a lower % is treated as better.
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 6, lineHeight: 1.5 }}>
            The flag on each card is a consensus rating, not a single-source result. Every applicable source casts a vote (benchmarkit.ai by ARR, High Alpha, Serena by ARR, and where selected, Serena by funding stage, benchmarkit.ai by ACV, by pricing model, by Go-to-Market Scope, and by Product Domain). Votes are averaged numerically and snapped to the nearest quartile. Sources with only a median datapoint and no P25/P75 are excluded from voting.
          </p>
        </div>
      </CollapsibleSection>

      <footer style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.68rem', color: 'var(--text-3)', lineHeight: 1.7 }}>
        <p>Data: benchmarkit.ai 2024 · High Alpha 2025 · ICONIQ Growth 2025 · Serena 2026</p>
        <p>Metrics sent to Anthropic's API are not stored and not used for training. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-3)' }}>Privacy policy →</a></p>
      </footer>
    </div>
  )
}
