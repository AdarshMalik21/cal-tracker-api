// returns "2026-W20" from a Date object
export function getWeekLabel(date = new Date()) {
  const d    = new Date(date)
  const day  = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const year = d.getUTCFullYear()
  const week = Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

// returns start and end date strings for a given week label
export function getWeekRange(weekLabel) {
  const [year, week] = weekLabel.split('-W').map(Number)
  const jan4         = new Date(Date.UTC(year, 0, 4))
  const startOfWeek  = new Date(jan4)
  startOfWeek.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (week - 1) * 7)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6)

  const fmt = d => d.toISOString().split('T')[0]
  return { start: fmt(startOfWeek), end: fmt(endOfWeek) }
}