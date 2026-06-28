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
