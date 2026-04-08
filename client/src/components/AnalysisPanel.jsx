import React, { useState, useRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { getBenchmarkSummary } from '../data/benchmarks.js'

const API = import.meta.env.PROD ? '' : 'http://localhost:3001'

// Post-process streamed markdown to fix common formatting issues
function cleanMarkdown(raw) {
  let s = raw
  // Replace Unicode bullets with markdown bullets
  s = s.replace(/•/g, '-')
  // Fix multiple bullets crammed on one line: "- item1 - item2" → separate lines
  s = s.replace(/([^\n])(\s*- )/g, '$1\n$2')
  // Ensure blank line before headings (## and ###)
  s = s.replace(/([^\n])\n(#{2,3} )/g, '$1\n\n$2')
  // Ensure blank line after headings
  s = s.replace(/(#{2,3} [^\n]+)\n([^\n#])/g, '$1\n\n$2')
  // Ensure blank line before bullet lists
  s = s.replace(/([^\n-])\n(- )/g, '$1\n\n$2')
  // Fix bold labels with text running on same line: "**Label** Text" → "**Label**\n\nText"
  s = s.replace(/(\*\*(?:Level \d|How to answer)[^*]*\*\*)\s*([A-Z])/g, '$1\n\n$2')
  return s
}

export default function AnalysisPanel({ userVals, arrBand, acvBand, pricingModel, fundingStage, metrics, additionalContext, buildShareUrl }) {
  const [analysis, setAnalysis]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput]       = useState('')
  const [chatLoading, setChatLoading]   = useState(false)
  const [showChat, setShowChat]         = useState(false)
  const [copyMsg, setCopyMsg]           = useState('')
  const [questionCount, setQuestionCount] = useState(0)
  const MAX_QUESTIONS = 5
  // No scroll refs needed — we never auto-scroll

  const filledCount = Object.values(userVals).filter(v => v !== undefined && v !== '').length

  async function runAnalysis() {
    setLoading(true)
    setAnalysis('')
    setShowChat(false)
    setChatMessages([])
    setQuestionCount(0)
    const benchmarks = getBenchmarkSummary(metrics, arrBand)
    try {
      const res = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: userVals, arrBand, acvBand, pricingModel, fundingStage, benchmarks, additionalContext }),
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text, error } = JSON.parse(data)
            if (error) { setAnalysis(prev => prev + `\n\n_Error: ${error}_`); break }
            if (text) setAnalysis(prev => prev + text)
          } catch {}
        }
      }
    } catch {
      setAnalysis('_Analysis is currently unavailable. This feature requires the API to be running — it works in the deployed version._')
    }
    setLoading(false)
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading || questionCount >= MAX_QUESTIONS) return
    const userMsg = { role: 'user', content: chatInput.trim() }
    const newMessages = [...chatMessages, userMsg]
    // Add user message + empty assistant placeholder — no scroll manipulation
    setChatMessages([...newMessages, { role: 'assistant', content: '' }])
    setChatInput('')
    setChatLoading(true)
    setQuestionCount(prev => prev + 1)
    let assistantText = ''
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, metrics: userVals, arrBand, fundingStage }),
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text } = JSON.parse(data)
            if (text) {
              assistantText += text
              setChatMessages([...newMessages, { role: 'assistant', content: assistantText }])
            }
          } catch {}
        }
      }
    } catch {
      setChatMessages([...newMessages, { role: 'assistant', content: '_Error connecting to server._' }])
    }
    setChatLoading(false)
  }

  function copyShareLink() {
    const url = buildShareUrl()
    navigator.clipboard.writeText(url).then(() => {
      setCopyMsg('Copied!')
      setTimeout(() => setCopyMsg(''), 2000)
    })
  }

  const btnBase = {
    fontFamily: 'var(--font-mono)', borderRadius: 'var(--radius)',
    fontSize: '0.78rem', cursor: 'pointer', transition: 'opacity .15s',
  }

  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.5rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-3)' }}>
          {filledCount === 0
            ? 'Enter at least one metric above to run analysis'
            : `${filledCount} metric${filledCount > 1 ? 's' : ''} ready for analysis`}
        </p>
        <button
          onClick={runAnalysis}
          disabled={loading || filledCount === 0}
          style={{
            ...btnBase,
            background: filledCount > 0 ? 'var(--accent)' : 'var(--bg-4)',
            color: filledCount > 0 ? 'var(--accent-text)' : 'var(--text-3)',
            border: 'none', padding: '9px 20px', fontWeight: 500,
            cursor: filledCount > 0 ? 'pointer' : 'not-allowed',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Analysing…' : analysis ? 'Re-run analysis' : 'Analyse my metrics →'}
        </button>
      </div>

      {/* Loading */}
      {loading && !analysis && (
        <div style={{ color: 'var(--text-3)', fontSize: '0.82rem' }} className="pulse">
          Analysing your metrics against benchmarks…
        </div>
      )}

      {/* Analysis output — fixed height, independent scroll */}
      {analysis && (
        <div
          id="analysis-output"
          style={{
            height: 600, overflowY: 'auto', overflowX: 'hidden',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '1rem 1.25rem', background: 'var(--bg-3)',
          }}
        >
          <div className="md-output fade-up">
            <ReactMarkdown>{cleanMarkdown(analysis)}</ReactMarkdown>
          </div>
          {loading && (
            <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }} className="pulse"> generating…</span>
          )}
        </div>
      )}

      {/* Empty state */}
      {!analysis && !loading && (
        <div style={{
          border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
          padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8rem',
        }}>
          Your analysis will appear here.
        </div>
      )}

      {/* Post-analysis actions */}
      {(analysis || loading) && (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Chat — only shown after analysis done */}
          {analysis && !loading && (
            !showChat ? (
              <button
                onClick={() => setShowChat(true)}
                style={{ ...btnBase, background: 'var(--bg-3)', border: '1px solid var(--border-mid)', color: 'var(--text)', padding: '8px 16px', alignSelf: 'flex-start' }}
              >
                Ask a follow-up question ↓
              </button>
            ) : (
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: 10 }}>
                  Ask anything about your metrics — has context on your numbers and ARR band.
                </div>
                {/* Chat messages — fixed height, user scrolls freely, no auto-scroll */}
                <div style={{
                  maxHeight: 400, overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  marginBottom: 10, paddingRight: 4,
                }}>
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '88%',
                      background: m.role === 'user' ? 'var(--accent-dim)' : 'var(--bg-3)',
                      border: `1px solid ${m.role === 'user' ? 'var(--accent-mid)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)', padding: '9px 13px',
                    }}>
                      {m.role === 'assistant'
                        ? <div className="md-output" style={{ fontSize: '0.82rem' }}><ReactMarkdown>{cleanMarkdown(m.content || '…')}</ReactMarkdown></div>
                        : <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{m.content}</span>
                      }
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: questionCount >= MAX_QUESTIONS ? 'var(--red, #f87171)' : 'var(--text-3)' }}>
                    {questionCount} / {MAX_QUESTIONS} questions used
                  </span>
                </div>
                {questionCount >= MAX_QUESTIONS && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontStyle: 'italic', marginBottom: 8 }}>
                    Question limit reached. Re-run the analysis to start a new session.
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                    disabled={questionCount >= MAX_QUESTIONS}
                    placeholder="e.g. How do I improve CAC payback without cutting headcount?"
                    style={{
                      flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border-mid)',
                      borderRadius: 'var(--radius)', color: 'var(--text)', padding: '8px 12px', fontSize: '0.82rem',
                    }}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading || questionCount >= MAX_QUESTIONS}
                    style={{
                      ...btnBase, background: 'var(--accent)', color: '#0c0f0e',
                      border: 'none', padding: '8px 16px', fontWeight: 500,
                      opacity: chatLoading || !chatInput.trim() || questionCount >= MAX_QUESTIONS ? 0.5 : 1,
                      cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {chatLoading ? '…' : 'Send'}
                  </button>
                </div>
              </div>
            )
          )}

          {/* Share + PDF */}
          {analysis && !loading && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={copyShareLink}
                style={{ ...btnBase, background: 'var(--bg-3)', border: '1px solid var(--border-mid)', color: 'var(--text)', padding: '7px 14px' }}
              >
                {copyMsg || '⎘ Copy shareable link'}
              </button>
              <button
                onClick={() => window.print()}
                style={{ ...btnBase, background: 'var(--bg-3)', border: '1px solid var(--border-mid)', color: 'var(--text)', padding: '7px 14px' }}
              >
                ↓ Save as PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* Privacy note */}
      <p style={{ fontSize: '0.63rem', color: 'var(--text-3)', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        Metrics are sent to Anthropic's API for analysis and are not stored.
        Anthropic does not use API data for model training on paid plans.{' '}
        <a href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-3)' }}>Privacy policy →</a>
      </p>
    </div>
  )
}
