import moment from 'moment'

// NOTE: If timezone-specific formatting (other than local) is required in the
// future, consider adding moment-timezone and wrapping here. For now all
// formatting is local 24h / ISO week start.

// Centralized formatting helpers to enforce DD.MM.YYYY, 24h clock, Monday week start (ISO 8601)
export const DATE_FORMAT = 'DD.MM.YYYY'
export const DATE_SHORT_FORMAT = 'DD.MM'
export const TIME_FORMAT = 'HH:mm'
export const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm'
export const DATE_TIME_SECONDS_FORMAT = 'DD.MM.YYYY HH:mm:ss'

export const fmtDate = d => moment(d).format(DATE_FORMAT)
export const fmtShortDate = d => moment(d).format(DATE_SHORT_FORMAT)
export const fmtTime = d => moment(d).format(TIME_FORMAT)
export const fmtDateTime = d => moment(d).format(DATE_TIME_FORMAT)
export const fmtDateTimeWithSeconds = d => moment(d).format(DATE_TIME_SECONDS_FORMAT)
export const fmtRelative = d => moment(d).fromNow()

// Extended helpers (avoid using toLocale* anywhere else in the app):
export const fmtWeekdayShort = d => moment(d).format('ddd')            // Mon
export const fmtWeekdayLong = d => moment(d).format('dddd')            // Monday
export const fmtDay = d => moment(d).format('D')                      // 1..31
export const fmtMonthShort = d => moment(d).format('MMM')             // Jan
export const fmtMonthYear = d => moment(d).format('MMMM YYYY')        // January 2025
export const fmtYear = d => moment(d).format('YYYY')                  // 2025
export const fmtDateLong = d => moment(d).format('dddd DD.MM.YYYY')   // Monday 13.01.2025

// Standard comparator string (timezone agnostic day id)
export const dayKey = d => moment(d).format('YYYY-MM-DD')

// Helper for comparing calendar days (local)
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
