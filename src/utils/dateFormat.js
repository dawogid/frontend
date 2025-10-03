import moment from 'moment'

// Centralized formatting helpers to enforce DD/MM/YYYY and 24h clock
export const fmtDate = d => moment(d).format('DD/MM/YYYY')
export const fmtTime = d => moment(d).format('HH:mm')
export const fmtDateTime = d => moment(d).format('DD/MM/YYYY HH:mm')
export const fmtDateTimeWithSeconds = d => moment(d).format('DD/MM/YYYY HH:mm:ss')
export const fmtRelative = d => moment(d).fromNow()

// Helper for comparing calendar days (local)
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
