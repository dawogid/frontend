import { useCallback, useMemo } from 'react'
import { Input } from '@mui/joy'
import PropTypes from 'prop-types'
import moment from 'moment'

// Simple wrapper around a native datetime-local input using Joy UI styling.
// Expects value in 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DDTHH:mm:00' / 'YYYY-MM-DDTHH:00:00'.
// Emits the same string format (seconds precision) to parent on change.
const DateTimePicker = ({
	value,
	onChange,
	disabled = false,
	min,
	max,
	autoFocus = false,
	sx,
}) => {
	const normalizedValue = useMemo(() => {
		if (!value) return ''
		// Accept values with or without seconds; ensure seconds present for consistent round‑trip.
		const m = moment(
			value,
			[moment.ISO_8601, 'YYYY-MM-DDTHH:mm', 'YYYY-MM-DDTHH:mm:ss'],
			true,
		)
		if (!m.isValid()) return ''
		return m.format('YYYY-MM-DDTHH:mm') // native input ignores seconds
	}, [value])

	const handleChange = useCallback(
		e => {
			const raw = e.target.value // 'YYYY-MM-DDTHH:mm'
			if (!raw) {
				if (onChange) onChange(null)
				return
			}
			// Add ':00' seconds to maintain previous expectation for downstream code.
			const withSeconds = raw.length === 16 ? raw + ':00' : raw
			if (onChange) onChange(withSeconds)
		},
		[onChange],
	)

	return (
		<Input
			type='datetime-local'
			size='sm'
			value={normalizedValue}
			onChange={handleChange}
			disabled={disabled}
			slotProps={{ input: { min, max } }}
			autoFocus={autoFocus}
			sx={sx}
		/>
	)
}

DateTimePicker.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	min: PropTypes.string,
	max: PropTypes.string,
	autoFocus: PropTypes.bool,
	sx: PropTypes.object,
}

export default DateTimePicker
