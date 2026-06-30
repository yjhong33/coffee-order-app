// Line-based "stream of consciousness" memo parser.
// Each line is one drink: menu + optional quantity + optional temperature.
// Understands common Korean cafe shorthand (아아, 따아, 아샷추 …) and flags
// items whose temperature wasn't specified so the UI can ask for it.

const QTY_WORDS = { 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 여덜: 8, 아홉: 9, 열: 10 }

// Shorthand → { canonical name, implied temperature }. `fixed` means the drink
// is always served at that temperature (no HOT/ICE choice).
const MEMO_ABBR = [
  { re: /아샷추/, name: '아이스티 샷추가', temp: 'ICE', fixed: true },
  { re: /아바라|아바/, name: '바닐라 라떼', temp: 'ICE' },
  { re: /따바|뜨바/, name: '바닐라 라떼', temp: 'HOT' },
  { re: /아라떼/, name: '카페 라떼', temp: 'ICE' },
  { re: /따라떼|뜨라떼/, name: '카페 라떼', temp: 'HOT' },
  { re: /아아/, name: '아메리카노', temp: 'ICE' },
  { re: /따아|뜨아/, name: '아메리카노', temp: 'HOT' },
]

// Drinks that only come iced — no temperature choice needed.
const FIXED_ICE_HINT = /에이드|아이스티|스무디|프라푸치노|블렌디드|빙수|쉐이크|콜드브루|프라페/

function detectTemp(text) {
  if (/아이스|ice|차갑|차가운|시원/i.test(text)) return 'ICE'
  if (/핫|hot|뜨겁|뜨거운|따뜻/i.test(text)) return 'HOT'
  return null
}

function extractQty(text) {
  const num = text.match(/(\d+)\s*(잔|개)?/)
  if (num) return Math.max(1, parseInt(num[1], 10) || 1)
  const word = text.match(/(한|두|세|네|다섯|여섯|일곱|여덟|여덜|아홉|열)\s*(잔|개)/)
  if (word) return QTY_WORDS[word[1]] || 1
  return 1
}

function cleanName(text) {
  return text
    .replace(/\([^)]*\)?/g, ' ') // (아이스) or unclosed (아이스
    .replace(/\d+\s*(잔|개)?/g, ' ')
    .replace(/(한|두|세|네|다섯|여섯|일곱|여덟|여덜|아홉|열)\s*(잔|개)/g, ' ')
    .replace(/아이스|ice|핫|hot|뜨거운|뜨겁게|따뜻한|따뜻하게|차가운|시원하게|차갑게/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseMemoLines(rawText, menus) {
  const lines = (rawText || '')
    .split(/[\n,]+/)
    .map((l) => l.trim())
    .filter(Boolean)
  const normMenus = menus.map((m) => ({ ...m, norm: m.name.replace(/\s/g, '') }))

  return lines.map((line) => {
    const flat = line.replace(/\s/g, '')
    const qty = extractQty(line)
    let temp = detectTemp(line)
    let name = null
    let fixedTemp = false

    const abbr = MEMO_ABBR.find((a) => a.re.test(flat))
    if (abbr) {
      name = abbr.name
      if (abbr.fixed) {
        temp = abbr.temp
        fixedTemp = true
      } else if (!temp) {
        temp = abbr.temp
      }
    }

    if (!name) {
      const cleaned = cleanName(line)
      const cFlat = cleaned.replace(/\s/g, '')
      const match = cFlat && normMenus.find((m) => m.norm.includes(cFlat) || cFlat.includes(m.norm))
      name = match ? match.name : cleaned || line
    }

    // price from catalog when recognizable, otherwise a neutral default
    const cn = name.replace(/\s/g, '')
    const priced = normMenus.find((m) => m.norm === cn || m.norm.includes(cn) || cn.includes(m.norm))
    const price = priced ? priced.price : 4500

    if (!fixedTemp && FIXED_ICE_HINT.test(name)) {
      temp = 'ICE'
      fixedTemp = true
    }

    const needsOption = !fixedTemp && !temp

    return { name, temp: temp || null, qty, price, needsOption, fixedTemp, raw: line }
  })
}
