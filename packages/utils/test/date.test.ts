import dayjs from 'dayjs'
import { describe, beforeEach, test, expect } from 'vitest'
import {
  currentDateRange,
  dateRange,
  daysInMonth,
  formatCurrentDateRange,
  formatDate,
  formatDateRange,
  formatThisMonthRange,
  formatThisWeekRange,
  formatThisYearRange,
  formatTodayRange,
  stringToDate,
  stringToTimestamp,
  thisMonthRange,
  thisWeekRange,
  thisYearRange,
  todayRange,
} from '../src/date'

interface Sample {
  current: Date
  strDate: string
  date: Date
  format: string
}

interface LocalContext {
  sample: Sample
}

describe('date', () => {
  beforeEach<LocalContext>(async (context) => {
    context.sample = {
      current: new Date(),
      strDate: '2022-09-01 13:00:00',
      date: new Date('2022-09-01 13:00:00'),
      format: 'YYYY-MM-DD HH:mm:ss',
    }
  })

  test<LocalContext>('stringToDate', ({ sample }) => {
    const result = stringToDate(sample.strDate)

    expect(result).toEqual(new Date('2022-09-01 13:00:00'))
  })

  test<LocalContext>('stringToTimestamp', ({ sample }) => {
    const result = stringToTimestamp(sample.strDate)

    expect(result).toEqual(1662008400000)
  })

  test<LocalContext>('formatDate', ({ sample }) => {
    const result = formatDate(sample.date, sample.format)

    expect(result).toEqual('2022-09-01 13:00:00')
  })

  test<LocalContext>('formatDateRange', ({ sample }) => {
    const minuteResult = formatDateRange(sample.date, 'minute', sample.format)

    expect(minuteResult).toEqual({
      start: '2022-09-01 13:00:00',
      end: '2022-09-01 13:00:59',
    })

    const hourResult = formatDateRange(sample.date, 'hour', sample.format)

    expect(hourResult).toEqual({
      start: '2022-09-01 13:00:00',
      end: '2022-09-01 13:59:59',
    })

    const dayResult = formatDateRange(sample.date, 'day', sample.format)

    expect(dayResult).toEqual({
      start: '2022-09-01 00:00:00',
      end: '2022-09-01 23:59:59',
    })

    const monthResult = formatDateRange(sample.date, 'month', sample.format)

    expect(monthResult).toEqual({
      start: '2022-09-01 00:00:00',
      end: '2022-09-30 23:59:59',
    })

    const weekResult = formatDateRange(sample.date, 'week', sample.format)

    expect(weekResult).toEqual({
      start: '2022-08-28 00:00:00',
      end: '2022-09-03 23:59:59',
    })

    const yearResult = formatDateRange(sample.date, 'year', sample.format)

    expect(yearResult).toEqual({
      start: '2022-01-01 00:00:00',
      end: '2022-12-31 23:59:59',
    })
  })

  test<LocalContext>('formatCurrentDateRange', ({ sample }) => {
    const minuteResult = formatCurrentDateRange('minute', sample.format)

    const minuteTarget = {
      start: dayjs().startOf('minute').format(sample.format),
      end: dayjs().endOf('minute').format(sample.format),
    }

    expect(minuteResult).toEqual(minuteTarget)

    const hourResult = formatCurrentDateRange('hour', sample.format)

    const hourTarget = {
      start: dayjs().startOf('hour').format(sample.format),
      end: dayjs().endOf('hour').format(sample.format),
    }

    expect(hourResult).toEqual(hourTarget)

    const dayResult = formatCurrentDateRange('day', sample.format)

    const dayTarget = {
      start: dayjs().startOf('day').format(sample.format),
      end: dayjs().endOf('day').format(sample.format),
    }

    expect(dayResult).toEqual(dayTarget)

    const monthResult = formatCurrentDateRange('month', sample.format)

    const monthTarget = {
      start: dayjs().startOf('month').format(sample.format),
      end: dayjs().endOf('month').format(sample.format),
    }

    expect(monthResult).toEqual(monthTarget)

    const weekResult = formatCurrentDateRange('week', sample.format)

    const weekTarget = {
      start: dayjs().startOf('week').format(sample.format),
      end: dayjs().endOf('week').format(sample.format),
    }

    expect(weekResult).toEqual(weekTarget)

    const yearResult = formatCurrentDateRange('year', sample.format)

    const yearTarget = {
      start: dayjs().startOf('year').format(sample.format),
      end: dayjs().endOf('year').format(sample.format),
    }

    expect(yearResult).toEqual(yearTarget)
  })

  test<LocalContext>('formatTodayRange', ({ sample }) => {
    const result = formatTodayRange(sample.format)

    const target = {
      start: dayjs().startOf('day').format(sample.format),
      end: dayjs().endOf('day').format(sample.format),
    }

    expect(result).toEqual(target)
  })

  test<LocalContext>('formatThisMonthRange', ({ sample }) => {
    const result = formatThisMonthRange(sample.format)

    const target = {
      start: dayjs().startOf('month').format(sample.format),
      end: dayjs().endOf('month').format(sample.format),
    }

    expect(result).toEqual(target)
  })

  test<LocalContext>('formatThisYearRange', ({ sample }) => {
    const result = formatThisYearRange(sample.format)

    const target = {
      start: dayjs().startOf('year').format(sample.format),
      end: dayjs().endOf('year').format(sample.format),
    }

    expect(result).toEqual(target)
  })

  test<LocalContext>('formatThisWeekRange', ({ sample }) => {
    const result = formatThisWeekRange(sample.format)

    const target = {
      start: dayjs().startOf('week').format(sample.format),
      end: dayjs().endOf('week').format(sample.format),
    }

    expect(result).toEqual(target)
  })

  test<LocalContext>('dateRange', ({ sample }) => {
    const minuteResult = dateRange(sample.date, 'minute', true)

    const minuteTarget = {
      start: 1662008400000,
      end: 1662008459999,
      isTimestamp: true,
    }

    expect(minuteResult).toEqual(minuteTarget)

    const minuteDateResult = dateRange(sample.date, 'minute')

    const minuteDateTarget = {
      start: new Date('2022-09-01 13:00:00'),
      end: new Date('2022-09-01 13:00:59.999'),
    }

    expect(minuteDateResult).toEqual(minuteDateTarget)

    const hourResult = dateRange(sample.date, 'hour', true)

    const hourTarget = {
      start: 1662008400000,
      end: 1662011999999,
      isTimestamp: true,
    }

    expect(hourResult).toEqual(hourTarget)

    const hourDateResult = dateRange(sample.date, 'hour')

    const hourDateTarget = {
      start: new Date('2022-09-01 13:00:00'),
      end: new Date('2022-09-01 13:59:59.999'),
    }

    expect(hourDateResult).toEqual(hourDateTarget)

    const dayResult = dateRange(sample.date, 'day', true)

    const dayTarget = {
      start: 1661961600000,
      end: 1662047999999,
      isTimestamp: true,
    }

    expect(dayResult).toEqual(dayTarget)

    const dayDateResult = dateRange(sample.date, 'day')

    const dayDateTarget = {
      start: new Date('2022-09-01 00:00:00'),
      end: new Date('2022-09-01 23:59:59.999'),
    }

    expect(dayDateResult).toEqual(dayDateTarget)

    const monthResult = dateRange(sample.date, 'month', true)

    const monthTarget = {
      start: 1661961600000,
      end: 1664553599999,
      isTimestamp: true,
    }

    expect(monthResult).toEqual(monthTarget)

    const monthDateResult = dateRange(sample.date, 'month')

    const monthDateTarget = {
      start: new Date('2022-09-01 00:00:00'),
      end: new Date('2022-09-30 23:59:59.999'),
    }

    expect(monthDateResult).toEqual(monthDateTarget)

    const weekResult = dateRange(sample.date, 'week', true)

    const weekTarget = {
      start: 1661616000000,
      end: 1662220799999,
      isTimestamp: true,
    }

    expect(weekResult).toEqual(weekTarget)

    const weekDateResult = dateRange(sample.date, 'week')

    const weekDateTarget = {
      start: new Date('2022-08-28 00:00:00'),
      end: new Date('2022-09-03 23:59:59.999'),
    }

    expect(weekDateResult).toEqual(weekDateTarget)

    const yearResult = dateRange(sample.date, 'year', true)

    const yearTarget = {
      start: 1640966400000,
      end: 1672502399999,
      isTimestamp: true,
    }

    expect(yearResult).toEqual(yearTarget)

    const yearDateResult = dateRange(sample.date, 'year')

    const yearDateTarget = {
      start: new Date('2022-01-01 00:00:00'),
      end: new Date('2022-12-31 23:59:59.999'),
    }

    expect(yearDateResult).toEqual(yearDateTarget)
  })

  test<LocalContext>('currentDateRange', () => {
    const minuteResult = currentDateRange('minute', true)

    const minuteTarget = {
      start: dayjs().startOf('minute').valueOf(),
      end: dayjs().endOf('minute').valueOf(),
      isTimestamp: true,
    }

    expect(minuteResult).toEqual(minuteTarget)

    const minuteDateResult = currentDateRange('minute')

    const minuteDateTarget = {
      start: dayjs().startOf('minute').toDate(),
      end: dayjs().endOf('minute').toDate(),
    }

    expect(minuteDateResult).toEqual(minuteDateTarget)

    const hourResult = currentDateRange('hour', true)

    const hourTarget = {
      start: dayjs().startOf('hour').valueOf(),
      end: dayjs().endOf('hour').valueOf(),
      isTimestamp: true,
    }

    expect(hourResult).toEqual(hourTarget)

    const hourDateResult = currentDateRange('hour')

    const hourDateTarget = {
      start: dayjs().startOf('hour').toDate(),
      end: dayjs().endOf('hour').toDate(),
    }

    expect(hourDateResult).toEqual(hourDateTarget)

    const dayResult = currentDateRange('day', true)

    const dayTarget = {
      start: dayjs().startOf('day').valueOf(),
      end: dayjs().endOf('day').valueOf(),
      isTimestamp: true,
    }

    expect(dayResult).toEqual(dayTarget)

    const dayDateResult = currentDateRange('day')

    const dayDateTarget = {
      start: dayjs().startOf('day').toDate(),
      end: dayjs().endOf('day').toDate(),
    }

    expect(dayDateResult).toEqual(dayDateTarget)

    const monthResult = currentDateRange('month', true)

    const monthTarget = {
      start: dayjs().startOf('month').valueOf(),
      end: dayjs().endOf('month').valueOf(),
      isTimestamp: true,
    }

    expect(monthResult).toEqual(monthTarget)

    const monthDateResult = currentDateRange('month')

    const monthDateTarget = {
      start: dayjs().startOf('month').toDate(),
      end: dayjs().endOf('month').toDate(),
    }

    expect(monthDateResult).toEqual(monthDateTarget)

    const weekResult = currentDateRange('week', true)

    const weekTarget = {
      start: dayjs().startOf('week').valueOf(),
      end: dayjs().endOf('week').valueOf(),
      isTimestamp: true,
    }

    expect(weekResult).toEqual(weekTarget)

    const weekDateResult = currentDateRange('week')

    const weekDateTarget = {
      start: dayjs().startOf('week').toDate(),
      end: dayjs().endOf('week').toDate(),
    }

    expect(weekDateResult).toEqual(weekDateTarget)

    const yearResult = currentDateRange('year', true)

    const yearTarget = {
      start: dayjs().startOf('year').valueOf(),
      end: dayjs().endOf('year').valueOf(),
      isTimestamp: true,
    }

    expect(yearResult).toEqual(yearTarget)

    const yearDateResult = currentDateRange('year')

    const yearDateTarget = {
      start: dayjs().startOf('year').toDate(),
      end: dayjs().endOf('year').toDate(),
    }

    expect(yearDateResult).toEqual(yearDateTarget)
  })

  test<LocalContext>('todayRange', () => {
    const dayResult = todayRange(true)

    const dayTarget = {
      start: dayjs().startOf('day').valueOf(),
      end: dayjs().endOf('day').valueOf(),
      isTimestamp: true,
    }

    expect(dayResult).toEqual(dayTarget)

    const dayDateResult = todayRange()

    const dayDateTarget = {
      start: dayjs().startOf('day').toDate(),
      end: dayjs().endOf('day').toDate(),
    }

    expect(dayDateResult).toEqual(dayDateTarget)
  })

  test<LocalContext>('thisMonthRange', () => {
    const monthResult = thisMonthRange(true)

    const monthTarget = {
      start: dayjs().startOf('month').valueOf(),
      end: dayjs().endOf('month').valueOf(),
      isTimestamp: true,
    }

    expect(monthResult).toEqual(monthTarget)

    const monthDateResult = thisMonthRange()

    const monthDateTarget = {
      start: dayjs().startOf('month').toDate(),
      end: dayjs().endOf('month').toDate(),
    }

    expect(monthDateResult).toEqual(monthDateTarget)
  })

  test<LocalContext>('thisYearRange', () => {
    const yearResult = thisYearRange(true)

    const yearTarget = {
      start: dayjs().startOf('year').valueOf(),
      end: dayjs().endOf('year').valueOf(),
      isTimestamp: true,
    }

    expect(yearResult).toEqual(yearTarget)

    const yearDateResult = thisYearRange()

    const yearDateTarget = {
      start: dayjs().startOf('year').toDate(),
      end: dayjs().endOf('year').toDate(),
    }

    expect(yearDateResult).toEqual(yearDateTarget)
  })

  test<LocalContext>('thisWeekRange', () => {
    const weekResult = thisWeekRange(true)

    const weekTarget = {
      start: dayjs().startOf('week').valueOf(),
      end: dayjs().endOf('week').valueOf(),
      isTimestamp: true,
    }

    expect(weekResult).toEqual(weekTarget)

    const weekDateResult = thisWeekRange()

    const weekDateTarget = {
      start: dayjs().startOf('week').toDate(),
      end: dayjs().endOf('week').toDate(),
    }

    expect(weekDateResult).toEqual(weekDateTarget)
  })

  test<LocalContext>('daysInMonth', ({ sample }) => {
    const result = daysInMonth(sample.date)

    expect(result).toBe(30)
  })
})
