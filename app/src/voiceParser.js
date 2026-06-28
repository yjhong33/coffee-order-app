const QTY_WORDS = { 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5 }

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

  let qty = 1
  const qtyMatch = text.match(/(\d+|한|두|세|네|다섯)잔/)
  if (qtyMatch) {
    const token = qtyMatch[1]
    qty = QTY_WORDS[token] || parseInt(token, 10) || 1
  }

  if (!foundMenu) {
    return { matched: false, name: null, temp: temp || 'ICE', qty, price: 0 }
  }
  return { matched: true, name: foundMenu.name, temp: temp || 'ICE', qty, price: foundMenu.price }
}
