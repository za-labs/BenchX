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
  message: { error: 'Too many requests — please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

app.post('/api/analyze', async (req, res) => {
  const { metrics, arrBand, acvBand, pricingModel, fundingStage, benchmarks, additionalContext } = req.body

  if (!metrics || !arrBand) return res.status(400).json({ error: 'Missing required fields.' })

  const filledMetrics = Object.entries(metrics)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')

  if (!filledMetrics.length) return res.status(400).json({ error: 'No metrics provided.' })

  const benchmarkContext = benchmarks
    ? Object.entries(benchmarks).map(([metric, data]) => {
        const parts = []
        if (data.bi?.p25 != null)      parts.push(`BI P25: ${data.bi.p25}`)
        if (data.bi?.median != null)   parts.push(`BI Median: ${data.bi.median}`)
        if (data.bi?.p75 != null)      parts.push(`BI P75: ${data.bi.p75}`)
        if (data.ha?.p25 != null)      parts.push(`HA P25: ${data.ha.p25}`)
        if (data.ha?.median != null)   parts.push(`HA Median: ${data.ha.median}`)
        if (data.ha?.p75 != null)      parts.push(`HA P75: ${data.ha.p75}`)
        if (data.serena?.median != null) parts.push(`Serena Median: ${data.serena.median}`)
        return `  ${metric}: ${parts.join(', ')}`
      }).join('\n')
    : 'Not provided.'

  const systemPrompt = `You are an expert SaaS advisor. You help founders and operators understand their metrics relative to industry benchmarks. You speak plainly and directly, like a sharp investor in a board meeting. You give specific, actionable advice — not generic platitudes. You understand that metrics interact with each other. Use formal language — no contractions. Each section of your response has a distinct job — do not repeat observations or advice across sections. When recommending tools or processes, describe what they do — do not name specific products.`

  const userPrompt = `A SaaS company has submitted their metrics for benchmarking.

ARR Band: ${arrBand}
ACV Band: ${acvBand || 'Not specified'}
Pricing Model: ${pricingModel || 'Not specified'}
Funding Stage: ${fundingStage && fundingStage !== 'Not specified' ? fundingStage : 'Not specified'}
${additionalContext ? `\nAdditional context from the company:\n${additionalContext}\n` : ''}
Their metrics:
${filledMetrics}

Benchmarks for their ARR band (P25 / Median / P75 from Benchmark.it, High Alpha, and Serena):
${benchmarkContext}

Produce these sections in order. Each section does one job — do not repeat content across sections.

## Overall assessment
2-3 sentences. How is this company performing overall? Be direct, reference actual numbers.

## Strengths
Each metric above median gets its own subsection. State the metric name and their value, what it signals, and the business implication. Do not mention below-median metrics here.

## Areas to improve
Each metric below median gets its own subsection. One sentence on what it signals, then 2-3 specific levers to move it. Assume basic foundations are already in place — propose Level 2 and 3 actions only, not baseline hygiene. Do not repeat these levers in later sections.

## What to fix first — action plan
Open with one sentence naming the single most important issue and why it takes priority. Then present three levels:

Level 1 — Foundation: actions any company should have in place as a starting point.
Level 2 — Optimisation: actions that build on Level 1 and drive meaningful improvement.
Level 3 — Scale: sophisticated actions that only make sense once Level 1 and 2 are solid.

${fundingStage && fundingStage !== 'Not specified'
  ? `The company is at ${fundingStage} stage. Indicate which level they should realistically start at and why.`
  : 'Funding stage not provided. Present all three levels and let the reader self-select.'}

Do not re-diagnose issues from earlier sections. This is the most detailed section.

## Watch out for
Metric interactions and combinations only — things that emerge from how metrics relate to each other. Do not repeat single-metric observations from earlier.

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
    res.write(`data: ${JSON.stringify({ error: 'API error — please try again.' })}\n\n`)
    res.end()
  }
})

app.post('/api/chat', async (req, res) => {
  const { messages, metrics, arrBand, fundingStage } = req.body
  if (!messages?.length) return res.status(400).json({ error: 'No messages.' })

  const context = metrics
    ? `User's SaaS metrics (ARR band: ${arrBand}${fundingStage && fundingStage !== 'Not specified' ? `, Funding stage: ${fundingStage}` : ''}):\n` +
      Object.entries(metrics).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}: ${v}`).join(', ')
    : ''

  const systemPrompt = `You are an expert SaaS advisor. The user has already received a benchmarking analysis. Answer their follow-up questions using their metrics as context. Be specific and direct. Do not name specific tools — describe what they do. Formal language, no contractions.${context ? `\n\nUser context: ${context}` : ''}`

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
    res.write(`data: ${JSON.stringify({ error: 'API error — please try again.' })}\n\n`)
    res.end()
  }
})

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))

export default app
