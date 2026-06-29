import { won } from './data'

export function personQty(person) {
  return person.items.reduce((sum, it) => sum + it.qty, 0)
}

export function computeTotals(people) {
  let totalQty = 0
  let totalPrice = 0
  for (const p of people) {
    for (const it of p.items) {
      totalQty += it.qty
      totalPrice += it.qty * it.price
    }
  }
  return { totalQty, totalPrice }
}

export function buildNamedFor(people) {
  const lines = people.map((p) => {
    const itemLines = p.items.map((it) => `  ${it.temp} ${it.name} ${it.qty}잔${it.note ? ` (${it.note})` : ''}`).join('\n')
    return `${p.name}:\n${itemLines}`
  })
  const { totalQty, totalPrice } = computeTotals(people)
  return `${lines.join('\n')}\n\n합계 ${totalQty}잔 · ${won(totalPrice)}`
}

export function buildPlainFor(people) {
  const agg = {}
  people.forEach((p) =>
    p.items.forEach((it) => {
      const key = `${it.temp} ${it.name}${it.note ? ` (${it.note})` : ''}`
      agg[key] = (agg[key] || 0) + it.qty
    }),
  )
  const lines = Object.keys(agg).map((key) => `${key} ${agg[key]}잔`)
  const { totalQty, totalPrice } = computeTotals(people)
  return `${lines.join('\n')}\n\n합계 ${totalQty}잔 · ${won(totalPrice)}`
}
