const QTY_WORDS = { 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덜: 8, 여덟: 8, 아홉: 9, 열: 10 }
const FILLER_SUFFIXES = /(주세요|부탁드려요|부탁해요|할게요|해주세요|주문이요|주문할게요|주문|이요|요)$/

const ABBREVIATIONS = [
  { re: /아아/, name: '아메리카노', temp: 'ICE' },
  { re: /뜨아/, name: '아메리카노', temp: 'HOT' },
  { re: /아바/, name: '바닐라라떼', temp: 'ICE' },
  { re: /뜨바/, name: '바닐라라떼', temp: 'HOT' },
  { re: /아라떼/, name: '카페라떼', temp: 'ICE' },
  { re: /뜨라떼/, name: '카페라떼', temp: 'HOT' },
]

export function parseVoiceOrder(rawText, menus) {
  const text = (rawText || '').replace(/\s/g, '')
  const normMenus = menus.map((m) => ({ ...m, norm: m.name.replace(/\s/g, '') }))

  let temp = null
  if (/아이스|차갑|시원/.test(text)) temp = 'ICE'
  if (!temp && /핫|뜨겁|따뜻/.test(text)) temp = 'HOT'

  let foundMenu = null
  for (const abbr of ABBREVIATIONS) {
    if (abbr.re.test(text)) {
      foundMenu = normMenus.find((m) => m.norm === abbr.name)
      if (foundMenu && !temp) temp = abbr.temp
      if (foundMenu) break
    }
  }
  if (!foundMenu) {
    foundMenu = normMenus.find((m) => text.includes(m.norm))
  }
  if (!foundMenu) {
    const stripped = text.replace(FILLER_SUFFIXES, '')
    foundMenu = normMenus.find((m) => stripped.includes(m.norm) || m.norm.includes(stripped))
  }

  let qty = 1
  const qtyMatch = text.match(/(\d+|한|두|세|네|다섯|여섯|일곱|여덜|여덟|아홉|열)잔/)
  if (qtyMatch) {
    const token = qtyMatch[1]
    qty = QTY_WORDS[token] || parseInt(token, 10) || 1
  }

  if (!foundMenu) {
    return { matched: false, name: null, temp: temp || 'ICE', qty, price: 0 }
  }
  return { matched: true, name: foundMenu.name, temp: temp || 'ICE', qty, price: foundMenu.price }
}

const NAME_PARTICLES = /(은요|는요|이는|은|는|이|가|도)$/
const SEGMENT_SPLIT = /,|그리고|이랑|랑\s|하고\s/g
const KEYWORD_HINT = /아이스|차갑|시원|핫|뜨겁|따뜻|잔|아아|뜨아|아바|뜨바|아라떼|뜨라떼|한|두|세|네|다섯/

function splitVoiceSegments(rawText) {
  return (rawText || '')
    .split(SEGMENT_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean)
}

function extractName(segment, menus) {
  const words = segment.trim().split(/\s+/).filter(Boolean)
  if (words.length < 2) return { personName: null, rest: segment }
  const first = words[0]
  const firstFlat = first.replace(/\s/g, '')
  const isMenuLike = menus.some((m) => {
    const norm = m.name.replace(/\s/g, '')
    return norm.includes(firstFlat) || firstFlat.includes(norm)
  })
  if (isMenuLike || KEYWORD_HINT.test(firstFlat)) {
    return { personName: null, rest: segment }
  }
  const personName = firstFlat.replace(NAME_PARTICLES, '')
  return { personName: personName || null, rest: words.slice(1).join(' ') }
}

export function parseVoiceOrders(rawText, menus) {
  const segments = splitVoiceSegments(rawText)
  if (segments.length === 0) return []
  return segments.map((seg) => {
    const { personName, rest } = extractName(seg, menus)
    const parsed = parseVoiceOrder(rest, menus)
    return { ...parsed, personName, raw: seg }
  })
}
