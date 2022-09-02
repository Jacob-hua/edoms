import dayjs from 'dayjs'
import { describe, beforeEach, test, expect } from 'vitest'
import {
  dateRange,
  formatCurrentDateRange,
  formatDate,
  formatDateRange,
  formatThisMonthRange,
  formatThisWeekRange,
  formatThisYearRange,
  formatTodayRange,
  stringToDate,
  stringToTimestamp,
} from '../date'

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
    const timestampResult = dateRange(sample.date, 'minute', true)

    const timestampTarget = {
      start: 1662008400000,
      end: 1662008459999,
      isTimestamp: true,
    }

    expect(timestampResult).toEqual(timestampTarget)

    const dateResult = dateRange(sample.date, 'minute')

    const dateTarget = {
      start: dayjs(sample.date).startOf('minute').toDate(),
      end: dayjs(sample.date).endOf('minute').toDate(),
    }

    expect(dateResult).toEqual(dateTarget)
  })
})
