import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(express.json())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN || true
    : 'http://localhost:5173'
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '20'),
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

app.post('/api/analyze', async (req, res) => {
  const { metrics, arrBand, acvBand, pricingModel, fundingStage, gtmScope, productDomain, benchmarks, additionalContext } = req.body

  if (!metrics || !arrBand) return res.status(400).json({ error: 'Missing required fields.' })

  const filledMetrics = Object.entries(metrics)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')

  if (!filledMetrics.length) return res.status(400).json({ error: 'No metrics provided.' })

  const gtmContext    = gtmScope      && gtmScope      !== 'Not specified' ? gtmScope      : null
  const domainContext = productDomain && productDomain !== 'Not specified' ? productDomain : null
  const stageContext  = fundingStage  && fundingStage  !== 'Not specified' ? fundingStage  : null

  const benchmarkContext = benchmarks
    ? Object.entries(benchmarks).map(([metric, data]) => {
        const rows = []
        const biParts = []
        if (data.bi?.p25 != null)    biParts.push(`P25: ${data.bi.p25}`)
        if (data.bi?.median != null) biParts.push(`Median: ${data.bi.median}`)
        if (data.bi?.p75 != null)    biParts.push(`P75: ${data.bi.p75}`)
        if (biParts.length) rows.push(`    benchmarkit.ai (ARR cohort): ${biParts.join(', ')}`)
        const haParts = []
        if (data.ha?.p25 != null)    haParts.push(`P25: ${data.ha.p25}`)
        if (data.ha?.median != null) haParts.push(`Median: ${data.ha.median}`)
        if (data.ha?.p75 != null)    haParts.push(`P75: ${data.ha.p75}`)
        if (haParts.length) rows.push(`    High Alpha (ARR cohort): ${haParts.join(', ')}`)
        if (data.serena?.median != null) rows.push(`    Serena (ARR cohort): Median: ${data.serena.median}`)
        if (gtmContext) {
          const gtmParts = []
          if (data.gtm?.p25 != null)    gtmParts.push(`P25: ${data.gtm.p25}`)
          if (data.gtm?.median != null) gtmParts.push(`Median: ${data.gtm.median}`)
          if (data.gtm?.p75 != null)    gtmParts.push(`P75: ${data.gtm.p75}`)
          if (gtmParts.length) rows.push(`    benchmarkit.ai (${gtmContext} peers): ${gtmParts.join(', ')}`)
        }
        if (domainContext) {
          const domainParts = []
          if (data.domain?.p25 != null)    domainParts.push(`P25: ${data.domain.p25}`)
          if (data.domain?.median != null) domainParts.push(`Median: ${data.domain.median}`)
          if (data.domain?.p75 != null)    domainParts.push(`P75: ${data.domain.p75}`)
          if (domainParts.length) rows.push(`    benchmarkit.ai (${domainContext} peers): ${domainParts.join(', ')}`)
        }
        if (stageContext && data.serenaStage?.median != null) {
          rows.push(`    Serena (${stageContext} peers): Median: ${data.serenaStage.median}`)
        }
        return rows.length ? `  ${metric}:\n${rows.join('\n')}` : null
      }).filter(Boolean).join('\n')
    : 'Not provided.'

  const systemPrompt = `You are an expert SaaS advisor. You help founders and operators understand their metrics relative to industry benchmarks. You speak plainly and directly, like a sharp investor in a board meeting. You give specific, actionable advice, not generic platitudes. You understand that metrics interact with each other, and that go-to-market scope and product domain materially affect what good looks like for any given metric. Use formal language, no contractions. Each section of your response has a distinct job. Do not repeat observations or advice across sections. When recommending tools or processes, describe what they do. Do not name specific products.`

  const userPrompt = `A SaaS company has submitted their metrics for benchmarking.

ARR Band: ${arrBand}
ACV Band: ${acvBand || 'Not specified'}
Pricing Model: ${pricingModel || 'Not specified'}
Funding Stage: ${fundingStage && fundingStage !== 'Not specified' ? fundingStage : 'Not specified'}
Go-to-Market Scope: ${gtmContext || 'Not specified'}
Product Domain: ${domainContext || 'Not specified'}
${additionalContext ? `\nAdditional context from the company:\n${additionalContext}\n` : ''}
Their metrics:
${filledMetrics}

Benchmark data (each source is labelled with its exact cohort. ARR cohort = broad peer group for their ARR band; where optional segments were selected, those peers are listed separately):
${benchmarkContext}

Produce these sections in order. Each section does one job. Do not repeat content across sections.

## Overall assessment
2-3 sentences. How is this company performing overall? Be direct, reference actual numbers.

## Strengths
Each metric above the broad ARR cohort median gets its own subsection. State the metric name and their value, what it signals, and the business implication. If the metric looks strong vs the broad cohort but is closer to median or weaker vs the GTM scope or product domain peers, note this explicitly as a nuance. Do not mention below-median metrics here.

## Areas to improve
Each metric below the broad ARR cohort median gets its own subsection. One sentence on what it signals, then 2-3 specific levers to move it. Where domain or GTM scope peer data is available and shows a different picture (e.g. the metric is weak vs the broad cohort but in line with domain peers), acknowledge this context before giving advice. Assume basic foundations are already in place. Propose Level 2 and 3 actions only, not baseline hygiene. Do not repeat these levers in later sections.

## What to fix first — action plan
Open with one sentence naming the single most important issue and why it takes priority. Then present three levels:

Level 1 — Foundation: actions any company should have in place as a starting point.
Level 2 — Optimisation: actions that build on Level 1 and drive meaningful improvement.
Level 3 — Scale: sophisticated actions that only make sense once Level 1 and 2 are solid.

${fundingStage && fundingStage !== 'Not specified'
  ? `The company is at ${fundingStage} stage. Indicate which level they should realistically start at and why.`
  : 'Funding stage not provided. Present all three levels and let the reader self-select.'}
${gtmContext ? `The company operates as a ${gtmContext}. Factor this into the action plan. What works for a vertical app differs from a horizontal app or marketplace.` : ''}
${domainContext ? `The company operates in ${domainContext}. Factor in domain-specific dynamics. Buyer behaviour, sales cycles, and competitive intensity vary materially by domain.` : ''}

Do not re-diagnose issues from earlier sections. This is the most detailed section.

## Watch out for
Metric interactions and combinations only. These are things that emerge from how metrics relate to each other. Do not repeat single-metric observations from earlier.

## Questions the board may ask
3-4 sharp, uncomfortable questions an investor or board member would ask based on these exact numbers. For each question, include a coaching note on how to answer — what to acknowledge, how to frame it, and what actions would be credible to mention. 2-3 sentences per coaching note.

Guidelines:
- Be honest. If metrics are bad, say so.
- Be specific. Reference actual numbers, not vague statements.
- Do not name specific tools or products.
- Do not invent targets or timelines the user has not mentioned.
- Write like a sharp investor, not a consultant.`

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Anthropic error:', err)
    res.write(`data: ${JSON.stringify({ error: 'API error. Please try again.' })}\n\n`)
    res.end()
  }
})

app.post('/api/chat', async (req, res) => {
  const { messages, metrics, arrBand, acvBand, pricingModel, fundingStage, gtmScope, productDomain, benchmarks } = req.body
  if (!messages?.length) return res.status(400).json({ error: 'No messages.' })

  const gtmCtx    = gtmScope      && gtmScope      !== 'Not specified' ? gtmScope      : null
  const domainCtx = productDomain && productDomain !== 'Not specified' ? productDomain : null
  const stageCtx  = fundingStage  && fundingStage  !== 'Not specified' ? fundingStage  : null

  const metricLines = metrics
    ? Object.entries(metrics).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}: ${v}`).join(', ')
    : ''

  const benchmarkLines = benchmarks
    ? Object.entries(benchmarks).map(([metric, data]) => {
        const rows = []
        if (data.bi?.median != null)     rows.push(`benchmarkit.ai (ARR cohort) Median: ${data.bi.median}`)
        if (data.ha?.median != null)     rows.push(`High Alpha (ARR cohort) Median: ${data.ha.median}`)
        if (data.serena?.median != null) rows.push(`Serena (ARR cohort) Median: ${data.serena.median}`)
        if (gtmCtx && data.gtm?.median != null)       rows.push(`benchmarkit.ai (${gtmCtx} peers) Median: ${data.gtm.median}`)
        if (domainCtx && data.domain?.median != null) rows.push(`benchmarkit.ai (${domainCtx} peers) Median: ${data.domain.median}`)
        if (stageCtx && data.serenaStage?.median != null) rows.push(`Serena (${stageCtx} peers) Median: ${data.serenaStage.median}`)
        return rows.length ? `  ${metric}: ${rows.join(' | ')}` : null
      }).filter(Boolean).join('\n')
    : ''

  const contextHeader = `Company profile: ARR band ${arrBand}${stageCtx ? `, ${stageCtx} stage` : ''}${gtmCtx ? `, GTM scope: ${gtmCtx}` : ''}${domainCtx ? `, Product domain: ${domainCtx}` : ''}`

  const context = [
    contextHeader,
    metricLines ? `Metrics: ${metricLines}` : '',
    benchmarkLines ? `Benchmark medians for reference:\n${benchmarkLines}` : '',
  ].filter(Boolean).join('\n\n')

  const systemPrompt = 'You are an expert SaaS advisor. The user has already received a benchmarking analysis and may ask follow-up questions. Answer using their metrics and benchmark data as context. When comparing their value to benchmarks, reference the specific cohort by name (e.g. benchmarkit.ai ARR cohort, Cyber Security peers). Be specific and direct. Do not name specific tools. Describe what they do. Formal language, no contractions.'
    + (context ? '\n\nContext:\n' + context : '')

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: systemPrompt,
      messages,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Anthropic error:', err)
    res.write(`data: ${JSON.stringify({ error: 'API error. Please try again.' })}\n\n`)
    res.end()
  }
})

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))

export default app
