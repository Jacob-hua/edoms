import { describe, beforeEach, test, expect } from 'vitest'
import { formatDate, formatDateRange, stringToDate, stringToTimestamp } from '../date'

interface Sample {
  current: Date
  strDate: string
  date: Date
}

interface LocalContext {
  sample: Sample
}

describe('date', () => {
  beforeEach<LocalContext>(async (context) => {
    context.sample = {
      current: new Date(),
      strDate: '2022/9/1 13:00:00',
      date: new Date('2022/9/1 13:00:00'),
    }
  })

  test<LocalContext>('stringToDate', ({ sample }) => {
    const date = stringToDate(sample.strDate)

    expect(date).toEqual(new Date('2022/9/1 13:00:00'))
  })

  test<LocalContext>('stringToTimestamp', ({ sample }) => {
    const timestamp = stringToTimestamp(sample.strDate)

    expect(timestamp).toEqual(1662008400000)
  })

  test<LocalContext>('formatDate', ({ sample }) => {
    const formatStr = formatDate(sample.date, 'YYYY-MM-DD HH:mm:ss')

    expect(formatStr).toEqual('2022-09-01 13:00:00')
  })

  test<LocalContext>('formatDateRange', ({ sample }) => {
    const todayRange = formatDateRange(sample.date, 'day', 'YYYY-MM-DD HH:mm:ss')
    expect(todayRange).toEqual({
      start: '2022-09-01 00:00:00',
      end: '2022-09-01 23:59:59',
    })
  })
})
