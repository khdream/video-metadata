export const getCurrentDate = (): number => {
  return Math.floor(Date.now() / 1000)
}

export const unixTimestampToDate = (timestamp: number): Date => {
  const date = new Date(timestamp * 1000)

  return date
}

export const unixTimestampToDateString = (timestamp: number): string => {
  const date = unixTimestampToDate(timestamp)

  return date.toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' })
}

export function dateStringToTimestamp(dateString: string): number {
  const [year, month, day] = dateString.split('-').map(Number)

  const date = new Date(year, month - 1, day)

  return Math.floor(date.getTime() / 1000)
}

export function abbreviatedDateStringToTimestamp(dateString: string): number {
  if (dateString === 'N/A') return 0

  const monthAbbreviations: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
  }

  const [day, monthStr, year] = dateString.split(' ')

  const month = monthAbbreviations[monthStr]

  const date = new Date(Number.parseInt(year), month, Number.parseInt(day))

  return Math.floor(date.getTime() / 1000)
}
