// All benchmark data normalized from Benchmark.it (CY-24), High Alpha (2025), ICONIQ

export const METRICS = {
  'YoY Growth Rate': {
    unit: '%', lowerIsBetter: false, category: 'Growth', placeholder: '—',
    description: 'Year-over-year ARR growth rate',
    arr: {
      '<$1M':     { bi: [80, 100, 150], ha: [29, 100, 300] },
      '$1M-$5M':  { bi: [25, 45, 100],  ha: [24, 50, 100] },
      '$5M-$20M': { bi: [18, 27, 48],   ha: [15, 31, 72]  },
      '$20M-$50M':{ bi: [4,  15, 30],   ha: [16, 30, 41]  },
      '>$50M':    { bi: [8,  10, 22],   ha: [10, 16, 29]  },
    },
  },
  'Gross Revenue Retention': {
    unit: '%', lowerIsBetter: false, category: 'Retention', placeholder: '—',
    description: 'GRR — annual / rolling 12-month revenue retained from existing customers, excluding expansion',
    arr: {
      '<$1M':     { bi: [85, 90, 97], ha: [null, 92, 100] },
      '$1M-$5M':  { bi: [85, 90, 97], ha: [null, 92, 95]  },
      '$5M-$20M': { bi: [77, 88, 93], ha: [null, 88, 95]  },
      '$20M-$50M':{ bi: [75, 85, 89], ha: [null, 90, 95]  },
      '>$50M':    { bi: [86, 89, 93], ha: [null, 88, 90]  },
    },
    acv: {
      '<$1K':       [85, 90, 99],
      '$1K-$5K':    [75, 85, 91],
      '$5K-$10K':   [78, 85, 89],
      '$10K-$25K':  [82, 87, 95],
      '$25K-$50K':  [76, 88, 95],
      '$50K-$100K': [80, 90, 95],
      '>$250K':     [72, 95, 98],
    },
    pm: {
      Subscription: [80, 88, 94],
      'Usage-Based': [88, 92, 96],
      'Sub+Usage':   [78, 88, 93],
    },
  },
  'Net Revenue Retention': {
    unit: '%', lowerIsBetter: false, category: 'Retention', placeholder: '—',
    description: 'NRR — annual / rolling 12-month revenue retained including expansion, contraction and churn',
    arr: {
      '<$1M':     { bi: [95, 102, 110], ha: [78,  100, 116] },
      '$1M-$5M':  { bi: [93, 101, 111], ha: [91,  104, 110] },
      '$5M-$20M': { bi: [95, 101, 110], ha: [95,  103, 115] },
      '$20M-$50M':{ bi: [null, null, null], ha: [98, 103, 110] },
      '>$50M':    { bi: [null, null, null], ha: [97, 101, 108] },
    },
    acv: {
      '<$1K':       [90, 100, 102],
      '$1K-$5K':    [89, 99,  105],
      '$5K-$10K':   [90, 100, 108],
      '$10K-$25K':  [95, 101, 112],
      '$25K-$50K':  [89, 105, 112],
      '$50K-$100K': [96, 104, 116],
      '>$250K':     [96, 107, 115],
    },
    pm: {
      Subscription: [94, 101, 108],
      'Usage-Based': [99, 101, 110],
      'Sub+Usage':   [99, 110, 117],
    },
  },
  'Software Gross Margin': {
    unit: '%', lowerIsBetter: false, category: 'Profitability', placeholder: '—',
    description: 'Gross margin on software/subscription revenue',
    arr: {
      '<$1M':     { bi: [50, 70, 81], ha: [60, 74, 80] },
      '$1M-$5M':  { bi: [64, 74, 85], ha: [60, 77, 85] },
      '$5M-$20M': { bi: [70, 77, 81], ha: [70, 80, 86] },
      '$20M-$50M':{ bi: [71, 79, 85], ha: [71, 78, 84] },
      '>$50M':    { bi: [75, 81, 88], ha: [70, 79, 83] },
    },
  },
  'CAC Payback (months)': {
    unit: 'mo', lowerIsBetter: true, category: 'Efficiency', placeholder: '—',
    description: 'Months to recover customer acquisition cost from gross profit',
    arr: {
      '<$1M':     { bi: [null, null, null], ha: [2,  5,  8]  },
      '$1M-$5M':  { bi: [null, null, null], ha: [5,  8,  14] },
      '$5M-$20M': { bi: [null, null, null], ha: [8,  14, 22] },
      '$20M-$50M':{ bi: [null, null, null], ha: [11, 20, 27] },
      '>$50M':    { bi: [null, null, null], ha: [13, 17, 22] },
    },
    acv: {
      '<$1K':       [5,  8,  10],
      '$1K-$5K':    [6,  8,  12],
      '$5K-$10K':   [13, 14, 18],
      '$10K-$25K':  [15, 18, 22],
      '$25K-$50K':  [13, 22, 26],
      '$50K-$100K': [16, 24, 33],
      '>$250K':     [18, 18, 23],
    },
  },
  'S&M as % of Revenue': {
    unit: '%', lowerIsBetter: true, category: 'Spend', placeholder: '—',
    description: 'Sales & marketing spend as % of total revenue',
    arr: {
      '<$1M':     { bi: [35, 38, 150], ha: [20, 28, 50] },
      '$1M-$5M':  { bi: [20, 35, 60],  ha: [20, 30, 50] },
      '$5M-$20M': { bi: [26, 40, 60],  ha: [22, 30, 53] },
      '$20M-$50M':{ bi: [25, 35, 48],  ha: [24, 29, 34] },
      '>$50M':    { bi: [33, 37, 50],  ha: [20, 25, 40] },
    },
  },
  'R&D as % of Revenue': {
    unit: '%', lowerIsBetter: true, category: 'Spend', placeholder: '—',
    description: 'R&D / engineering spend as % of total revenue',
    arr: {
      '<$1M':     { bi: [null, null, null], ha: [23, 43, 76] },
      '$1M-$5M':  { bi: [null, null, null], ha: [24, 38, 50] },
      '$5M-$20M': { bi: [null, null, null], ha: [20, 31, 54] },
      '$20M-$50M':{ bi: [null, null, null], ha: [23, 32, 40] },
      '>$50M':    { bi: [null, null, null], ha: [25, 30, 40] },
    },
  },
  'Rule of 40': {
    unit: '%', lowerIsBetter: false, category: 'Efficiency', placeholder: '—',
    description: 'Growth rate + profit margin (FCF or EBITDA margin)',
    arr: {
      '<$1M':     { bi: [null, null, null], ha: [null, 46, null] },
      '$1M-$5M':  { bi: [-32, 2,  40],     ha: [10,   33, 80]   },
      '$5M-$20M': { bi: [-9,  18, 34],     ha: [-3,   20, 35]   },
      '$20M-$50M':{ bi: [8,   20, 39],     ha: [11,   24, 41]   },
      '>$50M':    { bi: [-3,  8,  23],     ha: [15,   30, 38]   },
    },
  },
  'ARR per Employee ($K)': {
    unit: '$K', lowerIsBetter: false, category: 'Efficiency', placeholder: '—',
    description: 'Annual recurring revenue divided by full-time employees',
    arr: {
      '<$1M':     { bi: [20,  57,  93],  ha: [42,  56,  100] },
      '$1M-$5M':  { bi: [50,  70,  114], ha: [86,  136, 200] },
      '$5M-$20M': { bi: [104, 130, 185], ha: [130, 167, 221] },
      '$20M-$50M':{ bi: [160, 182, 238], ha: [157, 268, 350] },
      '>$50M':    { bi: [210, 240, 307], ha: [148, 278, 397] },
    },
  },
  'Burn Multiple': {
    unit: 'x', lowerIsBetter: true, category: 'Efficiency', placeholder: '—',
    description: 'Net burn / net new ARR. Lower = more efficient growth.',
    arr: {
      '<$1M':     { bi: [0.7,  2.7, 4.5], ha: [null, null, null] },
      '$1M-$5M':  { bi: [0.3,  1.2, 2.6], ha: [null, null, null] },
      '$5M-$20M': { bi: [0.6,  1.5, 2.8], ha: [null, null, null] },
      '$20M-$50M':{ bi: [0,    1,   2],   ha: [null, null, null] },
      '>$50M':    { bi: [-0.7, 0.9, 2.7], ha: [null, null, null] },
    },
  },
  'CLTV:CAC Ratio': {
    unit: 'x', lowerIsBetter: false, category: 'Efficiency', placeholder: '—',
    description: 'Customer lifetime value divided by customer acquisition cost',
    arr: {
      '<$1M':     { bi: [3,   5,   9.5], ha: [null, null, null] },
      '$1M-$5M':  { bi: [2.9, 3.3, 6],  ha: [null, null, null] },
      '$5M-$20M': { bi: [3,   4,   6.5], ha: [null, null, null] },
      '$20M-$50M':{ bi: [2.2, 3.3, 5],  ha: [null, null, null] },
      '>$50M':    { bi: [2.5, 2.9, 5],  ha: [null, null, null] },
    },
  },
}

export const ARR_BANDS = ['<$1M', '$1M-$5M', '$5M-$20M', '$20M-$50M', '>$50M']
export const ACV_BANDS = ['<$1K', '$1K-$5K', '$5K-$10K', '$10K-$25K', '$25K-$50K', '$50K-$100K', '>$250K']
export const PRICING_MODELS = ['Subscription', 'Usage-Based', 'Sub+Usage']

export const ICONIQ_LOGO = [
  { band: '<$10M',     newLogo: 76, expansion: 24, n: 365 },
  { band: '$10-$25M',  newLogo: 64, expansion: 36, n: 301 },
  { band: '$25-$50M',  newLogo: 58, expansion: 42, n: 250 },
  { band: '$50-$100M', newLogo: 57, expansion: 43, n: 192 },
  { band: '$100-$250M',newLogo: 50, expansion: 50, n: 300 },
  { band: '$250-$500M',newLogo: 36, expansion: 64, n: 129 },
  { band: '$500M+',    newLogo: 34, expansion: 66, n: 65  },
]

export const ICONIQ_CHURN = [
  { band: '<$10M',     logoCh: 55, downsell: 45, n: 206 },
  { band: '$10-$25M',  logoCh: 50, downsell: 50, n: 177 },
  { band: '$25-$50M',  logoCh: 59, downsell: 41, n: 121 },
  { band: '$50-$100M', logoCh: 54, downsell: 46, n: 108 },
  { band: '$100-$250M',logoCh: 56, downsell: 44, n: 180 },
  { band: '$250-$500M',logoCh: 48, downsell: 52, n: 57  },
  { band: '$500M+',    logoCh: 48, downsell: 52, n: 32  },
]

export const ARR_TO_ICONIQ = {
  '<$1M': '<$10M', '$1M-$5M': '<$10M', '$5M-$20M': '$10-$25M',
  '$20M-$50M': '$25-$50M', '>$50M': '$50-$100M',
}

// Build benchmark summary for API prompt
export function getBenchmarkSummary(metrics, arrBand) {
  const result = {}
  Object.entries(metrics).forEach(([name, def]) => {
    const d = def.arr[arrBand]
    if (!d) return
    const serenaArr = SERENA_ARR[name]?.[arrBand] ?? null
    result[name] = {
      bi:     { p25: d.bi[0], median: d.bi[1], p75: d.bi[2] },
      ha:     { p25: d.ha[0], median: d.ha[1], p75: d.ha[2] },
      serena: serenaArr ? { p25: serenaArr[0], median: serenaArr[1], p75: serenaArr[2] } : null,
    }
  })
  return result
}

export const FUNDING_STAGES = [
  'Not specified',
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
]

// Serena ARR bands map to our bands approximately
// Serena: <1M€, 1-5M€, 5-10M€, >10M€
// Ours:   <$1M, $1M-$5M, $5M-$20M, $20M-$50M, >$50M
// $5M-$20M maps to average of 5-10M€ and >10M€
// $20M-$50M and >$50M both map to >10M€

// Serena data by ARR band [P25, Median, P75]
// Note: values in €, treated as approximately equivalent to $
export const SERENA_ARR = {
  'YoY Growth Rate': {
    '<$1M':     [80,  130, 160],
    '$1M-$5M':  [30,  50,  100],
    '$5M-$20M': [20,  33,  90],   // avg of 5-10M and >10M bands
    '$20M-$50M':[15,  25,  80],   // >10M band
    '>$50M':    [15,  25,  80],
  },
  'Gross Revenue Retention': {
    '<$1M':     [75,  90,  95],
    '$1M-$5M':  [88,  93,  100],
    '$5M-$20M': [73,  89,  94],   // avg of 5-10M and >10M
    '$20M-$50M':[82,  89,  93],   // >10M
    '>$50M':    [82,  89,  93],
  },
  'Net Revenue Retention': {
    '<$1M':     [80,  92,  110],
    '$1M-$5M':  [85,  100, 115],
    '$5M-$20M': [92,  109, 117],  // avg of 5-10M and >10M
    '$20M-$50M':[95,  110, 115],  // >10M
    '>$50M':    [95,  110, 115],
  },
  'Software Gross Margin': {
    '<$1M':     [68,  78,  90],
    '$1M-$5M':  [72,  78,  87],
    '$5M-$20M': [73,  78,  87],
    '$20M-$50M':[73,  78,  87],
    '>$50M':    [73,  78,  87],
  },
  'CAC Payback (months)': {
    '<$1M':     [5,   7,   17],
    '$1M-$5M':  [8,   14,  18],
    '$5M-$20M': [11,  15,  23],   // avg of 5-10M and >10M
    '$20M-$50M':[12,  14,  22],   // >10M
    '>$50M':    [12,  14,  22],
  },
  'Burn Multiple': {
    '<$1M':     [1.7, 3.0, 5.0],
    '$1M-$5M':  [1.3, 3.3, 4.5],
    '$5M-$20M': [0.9, 1.85, 2.75], // avg of 5-10M and >10M
    '$20M-$50M':[2.0, 2.3, 3.5],  // >10M
    '>$50M':    [2.0, 2.3, 3.5],
  },
  'Rule of 40': {
    '<$1M':     [null, null, null], // not relevant per Serena
    '$1M-$5M':  [-75, 0,   45],
    '$5M-$20M': [-5,  17,  30],    // avg of 5-10M and >10M
    '$20M-$50M':[10,  20,  35],    // >10M
    '>$50M':    [10,  20,  35],
  },
  'S&M as % of Revenue': {
    '<$1M':     [null, 30, null],   // median only from overview table
    '$1M-$5M':  [null, 25, null],
    '$5M-$20M': [null, 24, null],   // avg of 5-10M and >10M
    '$20M-$50M':[null, 30, null],   // >10M
    '>$50M':    [null, 30, null],
  },
  'R&D as % of Revenue': {
    '<$1M':     [null, 31, null],   // Tech spend from overview table
    '$1M-$5M':  [null, 25, null],
    '$5M-$20M': [null, 22, null],
    '$20M-$50M':[null, 20, null],
    '>$50M':    [null, 20, null],
  },
}

// Serena data by funding stage [P25, Median, P75]
// Only metrics with stage data available
export const SERENA_STAGE = {
  'YoY Growth Rate': {
    'Pre-seed': [null, 200, null],
    'Seed':     [null, 91,  null],
    'Series A': [null, 45,  null],
    'Series B': [null, 39,  null],
    'Series C+': [null, 26, null],
  },
  'CAC Payback (months)': {
    'Pre-seed': [null, 7.5, null],
    'Seed':     [null, 9,   null],
    'Series A': [null, 14,  null],
    'Series B': [null, 18,  null],
    'Series C+': [null, 20, null],
  },
  'ARR per Employee ($K)': {
    'Pre-seed': [null, 50,  null],
    'Seed':     [null, 41,  null],
    'Series A': [null, 80,  null],
    'Series B': [null, 83,  null],
    'Series C+': [null, 149, null],
  },
  'S&M as % of Revenue': {
    'Pre-seed': [null, 30,  null],
    'Seed':     [null, 30,  null],
    'Series A': [null, 6,   null],
    'Series B': [null, 8,   null],
    'Series C+': [null, 12, null],
  },
  'R&D as % of Revenue': {
    'Pre-seed': [null, 40,  null],
    'Seed':     [null, 33,  null],
    'Series A': [null, null, null],
    'Series B': [null, null, null],
    'Series C+': [null, null, null],
  },
  'Burn Multiple': {
    'Pre-seed': [null, 3.0, null],
    'Seed':     [null, 3.3, null],
    'Series A': [null, 1.4, null],
    'Series B': [null, 2.3, null],
    'Series C+': [null, 2.3, null],
  },
}
