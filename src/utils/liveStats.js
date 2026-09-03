const MS_PER_DAY = 1000 * 60 * 60 * 24
const MS_PER_YEAR = MS_PER_DAY * 365.25
const MS_PER_MONTH = MS_PER_YEAR / 12

const UNIT_SCALES = {
  K: 1e3,
  M: 1e6,
  B: 1e9,
  T: 1e12,
}

export const parseLocalDate = (value) => {
  const [year, month, day] = String(value)
    .split('-')
    .map((part) => Number(part))
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const parseScaledNumber = (value) => {
  const match = String(value || '')
    .trim()
    .match(/^([\d.]+)\s*([kmbt])?$/i)
  if (!match) return 0
  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return 0
  const unit = (match[2] || '').toUpperCase()
  return amount * (UNIT_SCALES[unit] || 1)
}

export const formatScaledNumber = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`
  return Math.round(value).toString()
}

export const formatExactCount = (value) =>
  Math.max(0, Math.floor(value)).toLocaleString('en-US')

const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`

export const formatTenureYears = (start, now) => {
  if (!start) return '8.3'
  const years = Math.max(0, (now.getTime() - start.getTime()) / MS_PER_YEAR)
  return years.toFixed(1)
}

export const formatTenureExact = (start, now) => {
  if (!start) return ''

  const later = new Date(now.getTime())
  const earlier = new Date(start.getTime())

  let seconds = later.getSeconds() - earlier.getSeconds()
  let minutes = later.getMinutes() - earlier.getMinutes()
  let hours = later.getHours() - earlier.getHours()
  let days = later.getDate() - earlier.getDate()
  let months = later.getMonth() - earlier.getMonth()
  let years = later.getFullYear() - earlier.getFullYear()

  if (seconds < 0) {
    seconds += 60
    minutes -= 1
  }
  if (minutes < 0) {
    minutes += 60
    hours -= 1
  }
  if (hours < 0) {
    hours += 24
    days -= 1
  }
  if (days < 0) {
    const daysInPreviousMonth = new Date(
      later.getFullYear(),
      later.getMonth(),
      0,
    ).getDate()
    days += daysInPreviousMonth
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }

  return [
    plural(years, 'year'),
    plural(months, 'month'),
    plural(days, 'day'),
    plural(hours, 'hour'),
    plural(minutes, 'minute'),
    plural(seconds, 'second'),
  ].join(', ')
}

export const liveTokenTotal = (stats, now) => {
  const scaleStart = Date.parse(`${stats?.aiIdeScaleStart || '2024-12-01'}T00:00:00Z`)
  const rateSwitch = Date.parse(`${stats?.aiIdeRateSwitch || '2026-07-02'}T00:00:00Z`)
  const legacyPace = parseScaledNumber(stats?.aiIdeLegacyMonthlyPace || '1.9B')
  const currentPace = parseScaledNumber(stats?.aiIdeMonthlyPace || '3.8B')
  const nowMs = now.getTime()
  const legacyMs = Math.max(0, Math.min(nowMs, rateSwitch) - scaleStart)
  const currentMs = Math.max(0, nowMs - rateSwitch)

  return legacyPace * (legacyMs / MS_PER_MONTH) + currentPace * (currentMs / MS_PER_MONTH)
}
