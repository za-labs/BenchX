# BenchX

**Compare your company metrics against hundreds of SaaS businesses.**

BenchX is a free benchmarking dashboard for SaaS founders, CEOs, and finance teams. Enter your key metrics, select your peer group, and instantly see how you stack up against hundreds of real SaaS companies — plus get AI-powered analysis and recommendations tailored to your profile.

🔗 **Live tool: [mizab.io](https://mizab.io)**

---

## What It Does

- **Benchmark your metrics** across growth, retention, efficiency, and spend categories
- **Filter by peer group** — ARR band, ACV band, pricing model, and funding stage
- **See where you stand** — P25 / Median / P75 ranges from real SaaS data
- **Get AI analysis** — personalized insights and recommendations based on your inputs
- **Ask follow-up questions** — a built-in chat lets you dig deeper into your results

---

## Data Sources

BenchX aggregates benchmark data from four industry reports:

| Source | Coverage |
|---|---|
| [Benchmark.it — 2024 SaaS Benchmarks](https://www.benchmarkit.ai/2025benchmarks) | 583 companies, CY-24, P25/Median/P75 by ARR band, ACV band, pricing model |
| [High Alpha — 2025 SaaS Benchmarks](https://www.highalpha.com/saas-benchmarks) | 800+ companies, 2025 data with YoY deltas, P25/Median/P75 by ARR band |
| [ICONIQ Growth](https://iconiqcapital.com) | ARR mix and growth benchmarks |
| [Serena — European SaaS Benchmark](https://www.europeansaasbenchmark.com/) | European SaaS, P25/Median/P75 by ARR band and funding stage |

---

## Using the Hosted Version

No setup required. Just visit **[mizab.io](https://mizab.io)** and:

1. Select your peer group (ARR band, ACV band, pricing model, funding stage)
2. Enter your metrics in the relevant fields
3. Add any additional context if useful
4. Click **Analyze** to get your AI-powered assessment

Your data is never stored or shared. All inputs stay in your browser session.

---

## Running Locally

If you want to run BenchX on your own machine:

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/benchx.git
cd benchx

# Install all dependencies (root + client)
npm run install:all
```

### Environment Variables

Create a `.env` file in the root directory:

```
ANTHROPIC_API_KEY=your_api_key_here
```

> Your API key is only used server-side and is never exposed to the browser.

### Run in Development

```bash
npm run dev
```

This starts both the API server and the React frontend concurrently. Open your browser at `http://localhost:5173` (or whichever port Vite assigns).

### Build for Production

```bash
npm run build
```

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express.js
- **AI:** Anthropic Claude API (streaming)
- **Deployment:** Vercel

---

## About

BenchX is built by [Mizab](https://mizab.io) to help SaaS operators make better decisions with the right context.

For questions or feedback, visit [mizab.io](https://mizab.io).
