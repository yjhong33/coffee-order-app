// Turn parsed chat messages into standardized coffee orders.
// Input:  [{ name, message, sourceImageIndex }]
// Output: { orders:  [{ name, menu, temp, qty, options, confidence }],
//           review:  [{ name, message, menu, temp, qty, options, reason }] }
//
// Rules (per spec): strip filler ("저는/저/나/하나/주세요/요/~"), standardize
// synonyms/typos, map 아아→아이스 아메리카노 / 뜨아·따아→따뜻한 아메리카노 /
// 라떼→카페라떼 / 카라멜 마끼아또→카라멜 마키아또, treat 안마셔요·패스·없어요·
// 괜찮아요 as no-order, keep the last clear order per person, and route
// ambiguous messages to a separate "확인 필요" review list.

const NO_ORDER_RE = /안\s*마시|안\s*마실|안\s*먹|안마실|안먹|패스|pass|없어요|없어|괜찮|스킵|skip|난\s*괜|전\s*괜|난\s*안|전\s*안/i

// abbreviations that imply both menu and temperature
const TEMP_ABBR = [
  { re: /뜨아|따아/, menu: '아메리카노', temp: 'HOT' },
  { re: /아아/, menu: '아메리카노', temp: 'ICE' },
]

// More specific menus must come before the generic 라떼 entry.
const MENU_DEFS = [
  { menu: '아메리카노', price: 4500, defaultTemp: 'ICE', syn: ['아메리카노', '아메리카', '아메리까노', '어메리카노', '아메'] },
  { menu: '카라멜 마키아또', price: 6300, defaultTemp: null, syn: ['카라멜마키아또', '카라멜마끼아또', '카라멜마키야또', '카라멜마키', '카라멜마끼', '카라멜', '마키아또', '마끼아또'] },
  { menu: '바닐라 라떼', price: 5500, defaultTemp: null, syn: ['바닐라라떼', '바닐라라테', '바닐라'] },
  { menu: '돌체 라떼', price: 6300, defaultTemp: null, syn: ['돌체라떼', '돌체라테', '돌체'] },
  { menu: '카푸치노', price: 5000, defaultTemp: null, syn: ['카푸치노', '카푸치', '카푸'] },
  { menu: '콜드브루', price: 4900, defaultTemp: 'ICE', syn: ['콜드브루', '콜드브류', '콜브루', '콜브'] },
  { menu: '자몽 허니 블랙티', price: 6300, defaultTemp: 'ICE', syn: ['자몽허니블랙티', '자몽블랙티', '자몽에이드', '자몽차', '자몽'] },
  { menu: '카페라떼', price: 5000, defaultTemp: null, syn: ['카페라떼', '카페라테', '카페라뗴', '라떼', '라테', '라뗴'] },
]

const OPTION_DEFS = [
  { re: /샷\s*추가|샷추가|샷\s*하나|샷\s*한|투샷|샷\s*두/, label: '샷 추가' },
  { re: /디카페인|디카페|decaf/i, label: '디카페인' },
  { re: /휘핑\s*추가|휘핑업/, label: '휘핑 추가' },
  { re: /휘핑\s*빼|휘핑\s*없|노\s*휘핑/, label: '휘핑 빼기' },
  { re: /연하게|연한/, label: '연하게' },
  { re: /시럽\s*추가/, label: '시럽 추가' },
  { re: /시럽\s*빼|시럽\s*없|덜\s*달|단\s*거\s*빼/, label: '시럽 빼기' },
]

const QTY_WORDS = { 한: 1, 하나: 1, 두: 2, 둘: 2, 세: 3, 셋: 3, 네: 4, 넷: 4, 다섯: 5, 여섯: 6 }

function detectTemp(msg) {
  if (/아이스|차갑|얼음|ice|아아/i.test(msg)) return 'ICE'
  if (/따뜻|뜨겁|뜨아|따아|핫|hot/i.test(msg)) return 'HOT'
  return null
}

function detectQty(msg) {
  const num = msg.match(/(\d+)\s*(잔|개)?/)
  if (num) return Math.max(1, parseInt(num[1], 10) || 1)
  for (const [w, n] of Object.entries(QTY_WORDS)) {
    if (w !== '하나' && msg.includes(w + '잔')) return n
  }
  return 1
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = Math.min(dp[i] + 1, dp[i - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[m]
}

function matchMenu(flat) {
  for (const def of MENU_DEFS) {
    if (def.syn.some((s) => flat.includes(s))) return { def, fuzzy: false }
  }
  // typo tolerance: a synonym within edit distance 1 of any same-length window
  for (const def of MENU_DEFS) {
    for (const s of def.syn) {
      if (s.length < 3) continue
      for (let i = 0; i + s.length <= flat.length + 1; i++) {
        const win = flat.slice(i, i + s.length)
        if (win.length >= 3 && levenshtein(win, s) <= 1) return { def, fuzzy: true }
      }
    }
  }
  return null
}

function analyzeMessage(message) {
  const msg = (message || '').replace(/\s+/g, ' ').trim()
  if (!msg) return { kind: 'none' }
  if (NO_ORDER_RE.test(msg)) return { kind: 'none' }

  const flat = msg.replace(/\s/g, '')
  let temp = detectTemp(msg)
  let menu = null
  let price = 4500
  let fuzzy = false

  const abbr = TEMP_ABBR.find((a) => a.re.test(flat))
  if (abbr) {
    menu = abbr.menu
    if (!temp) temp = abbr.temp
    const d = MENU_DEFS.find((x) => x.menu === menu)
    if (d) price = d.price
  }

  if (!menu) {
    const m = matchMenu(flat)
    if (m) {
      menu = m.def.menu
      price = m.def.price
      fuzzy = m.fuzzy
      if (!temp && m.def.defaultTemp) temp = m.def.defaultTemp
    }
  }

  const qty = detectQty(msg)
  const options = OPTION_DEFS.filter((o) => o.re.test(msg)).map((o) => o.label)

  if (!menu) {
    // looks beverage-ish but unrecognized → needs human confirmation
    if (/커피|음료|마실|마셔|아메|라떼|에이드|모카|콜드|브루|스무디|프라푸/i.test(msg)) {
      return { kind: 'review', menu: null, temp, qty, options, reason: '메뉴를 알 수 없어요' }
    }
    return { kind: 'none' }
  }

  const confidence = fuzzy ? 0.55 : 0.95
  if (confidence < 0.6) {
    return { kind: 'review', menu, temp, qty, options, price, confidence, reason: '오타일 수 있어요' }
  }
  return { kind: 'order', menu, temp, qty, options, price, confidence }
}

export function analyzeOrders(messages) {
  const orderByName = new Map() // last clear order wins per person
  const review = []

  for (const { name, message } of messages || []) {
    const res = analyzeMessage(message)
    if (res.kind === 'none') {
      // explicit opt-out overrides any earlier order from the same person
      if (NO_ORDER_RE.test((message || '').replace(/\s+/g, ' '))) orderByName.delete(name)
      continue
    }
    if (res.kind === 'order') {
      orderByName.set(name, { name, menu: res.menu, temp: res.temp, qty: res.qty, options: res.options, price: res.price, confidence: res.confidence })
    } else {
      review.push({ name, message, menu: res.menu, temp: res.temp, qty: res.qty, options: res.options, price: res.price || 4500, reason: res.reason })
    }
  }

  return { orders: [...orderByName.values()], review }
}

export function tempLabel(temp) {
  return temp === 'HOT' ? '따뜻한' : temp === 'ICE' ? '아이스' : ''
}

export function menuDisplay(order) {
  const t = tempLabel(order.temp)
  return t ? `${t} ${order.menu}` : order.menu
}

// Aggregate confirmed orders by temperature + menu, summing quantities.
export function aggregateOrders(orders) {
  const map = new Map()
  for (const o of orders) {
    const label = menuDisplay(o)
    map.set(label, (map.get(label) || 0) + o.qty)
  }
  return [...map.entries()].map(([label, qty]) => ({ label, qty }))
}
