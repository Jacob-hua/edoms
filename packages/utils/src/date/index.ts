import dayjs, { ConfigType, OpUnitType } from 'dayjs'
import { DateRange, FormatDateRange, TimeRange } from './type'

export function stringToDate(date: string) {
  return dayjs(date).toDate()
}

export function stringToTimestamp(date: string) {
  return dayjs(date).valueOf()
}

export function formatDate(date: ConfigType, format: string): string {
  return dayjs(date).format(format)
}

export function timeRange(date: ConfigType, unitOfTime: OpUnitType): TimeRange {
  return {
    start: dayjs(date).startOf(unitOfTime),
    end: dayjs(date).endOf(unitOfTime),
  }
}

export function formatDateRange(date: ConfigType, unitOfTime: OpUnitType, format: string): FormatDateRange {
  const { start, end } = timeRange(date, unitOfTime)
  return {
    start: start.format(format),
    end: end.format(format),
  }
}

export function formatCurrentDateRange(unitOfTime: OpUnitType, format: string): FormatDateRange {
  return formatDateRange(new Date(), unitOfTime, format)
}

export function formatTodayRange(format: string): FormatDateRange {
  return formatCurrentDateRange('day', format)
}

export function formatThisMonthRange(format: string): FormatDateRange {
  return formatCurrentDateRange('month', format)
}

export function formatThisYearRange(format: string): FormatDateRange {
  return formatCurrentDateRange('year', format)
}

export function formatThisWeekRange(format: string): FormatDateRange {
  return formatCurrentDateRange('week', format)
}

export function dateRange(date: ConfigType, unitOfTime: OpUnitType, isTimestamp?: boolean): DateRange {
  const { start, end } = timeRange(date, unitOfTime)
  if (isTimestamp) {
    return {
      start: start.valueOf(),
      end: end.valueOf(),
      isTimestamp,
    }
  }
  return {
    start: start.toDate(),
    end: end.toDate(),
  }
}

export function currentDateRange(unitOfTime: OpUnitType, isTimestamp?: boolean): DateRange {
  return dateRange(new Date(), unitOfTime, isTimestamp)
}

export function todayRange(isTimestamp?: boolean): DateRange {
  return currentDateRange('day', isTimestamp)
}

export function thisMonthRange(isTimestamp?: boolean): DateRange {
  return currentDateRange('month', isTimestamp)
}

export function thisYearRange(isTimestamp?: boolean): DateRange {
  return currentDateRange('year', isTimestamp)
}

export function thisWeekRange(isTimestamp?: boolean): DateRange {
  return currentDateRange('week', isTimestamp)
}

export function daysInMonth(date: ConfigType) {
  return dayjs(date).daysInMonth()
}

export function daysInThisMonth() {
  return dayjs().daysInMonth()
}
