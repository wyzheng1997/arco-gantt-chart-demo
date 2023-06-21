import { type TableColumnData } from '@arco-design/web-vue'

export const formatTime = (t: Date, format: string) => {
  const tf = (i: number) => (i < 10 ? `0${i}` : `${i}`)
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
      default:
        return ''
    }
  })
}

export interface IDate {
  ymd: string
  year: string
  month: string
  monthZh: string
  day: string
}
export interface IYearAllDate {
  [propName: string]: IDate[]
}

// 获取某年的所有日期
export const getYearAllDate = (year: number) => {
  const date = new Date(year, 0, 1)
  const result = {} as IYearAllDate
  const mZh = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ]
  while (date.getFullYear() === year) {
    const ymd = formatTime(date, 'yyyy-MM-dd')
    const ymdTemp = ymd.split('-')
    const monthZh = mZh[Number(ymdTemp[1]) - 1]
    if (!result[monthZh]) {
      result[monthZh] = []
    }
    result[monthZh].push({
      ymd,
      year: ymdTemp[0],
      month: ymdTemp[1],
      monthZh: mZh[Number(ymdTemp[1]) - 1],
      day: ymdTemp[2]
    })
    date.setDate(date.getDate() + 1)
  }
  return result
}

// 生成列配置
export const generateTableColumns = (allDays: IYearAllDate) => {
  const columns = [] as TableColumnData[]
  for (const key in allDays) {
    columns.push({
      title: key,
      align: 'center',
      children: allDays[key].map((item) => {
        const res: TableColumnData = {
          title: item.day,
          cellClass: 'min-cell',
          slotName: 'day-cell',
          dataIndex: item.ymd
        }
        return res
      })
    })
  }
  return columns
}
