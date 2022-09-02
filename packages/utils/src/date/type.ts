import { Dayjs } from 'dayjs'

export interface TimeRange {
  start: Dayjs
  end: Dayjs
}

export interface FormatDateRange {
  start: string
  end: string
}

export interface DateRange {
  start: Date | number
  end: Date | number
  isTimestamp?: boolean
}
