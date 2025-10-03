import Calendar from 'react-calendar'
import { getPriorityColor } from '../../utils/Colors'
import styles from './Calendar.module.css'
import { isSameDay } from '../../utils/dateFormat'
const CalendarMonthly = ({ chores, onDateChange }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayChores = chores.filter(chore => {
        const choreDateObj = new Date(chore.nextDueDate)
        return isSameDay(choreDateObj, date)
      })
      if (dayChores.length === 0) {
        return (
          <div className={styles.dotContainer}>
            <span className={styles.dotEmpty}></span>
          </div>
        )
      }
      if (dayChores.length > 3) {
        return (
          <div className={styles.dotContainer}>
            <span
              className={styles.dotWithLine}
              style={{
                backgroundColor: getPriorityColor(dayChores[0].priority),
              }}
            ></span>
          </div>
        )
      }

      return (
        <div className={styles.dotContainer}>
          {dayChores.map((chore, index) => {
            return (
              <span
                key={index}
                className={styles.dot}
                style={{
                  backgroundColor: getPriorityColor(chore.priority),
                }}
              ></span>
            )
          })}
        </div>
      )
    }
    return null
  }
  return (
    <div className={styles.reactCalendar}>
      <Calendar
        locale='pl'
        calendarType='ISO 8601'
        tileContent={tileContent}
        onChange={d => {
          onDateChange(new Date(d))
        }}
        formatShortWeekday={(_locale, date) => {
          // Polish two-letter weekday abbreviations starting Monday
            const labels = ['Pn','Wt','Śr','Cz','Pt','So','Nd']
            return labels[(date.getDay() + 6) % 7]
        }}
        formatMonth={(_locale, date) => {
          // Polish short month names
          const monthNames = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru']
          return monthNames[date.getMonth()]
        }}
      />
    </div>
  )
}

export default CalendarMonthly
