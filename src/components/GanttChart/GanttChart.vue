<template>
  <a-table
    :span-method="spanMethod"
    :pagination="false"
    :bordered="{ cell: true }"
    row-key="key"
    :data="tableData"
    :columns="tableColumns"
    ref="tableRef"
  >
    <template #day-cell="{ record, column }">
      <DayCell :row="record" :column="column"></DayCell>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import type { TableColumnData } from '@arco-design/web-vue'
import { getYearAllDate, generateTableColumns, IYearAllDate } from '@/components/GanttChart/tool'
import DayCell from './DayCell.vue'

// 表格ref
const tableRef = ref()

// 初始化表格配置
const InitTableColumn: TableColumnData[] = [
  {
    title: '施工阶段',
    dataIndex: 'stage',
    width: 150,
    fixed: 'left',
    align: 'center'
  },
  {
    title: '起始时间',
    dataIndex: 'time_range',
    width: 250,
    fixed: 'left'
  }
]
// 格式化之后数据
const tableData = ref([] as any[])
// 表格列
const tableColumns = ref([] as TableColumnData[])
// 所有天数
const allDate = ref({} as IYearAllDate)

// 合并单元格
const spanMethod = ({ columnIndex, rowIndex }) => {
  if (columnIndex === 0 && rowIndex % 2 === 0) {
    return {
      rowspan: 2,
      colspan: 1
    }
  }
}

// 格式化数据
const formatData = (apiData: any[]) => {
  tableData.value = []
  apiData.forEach((item) => {
    let temp = {
      stage: item.stage,
      estStart: item.estStart,
      estEnd: item.estEnd,
      actStart: item.actStart,
      actEnd: item.actEnd
    }
    tableData.value.push({
      key: 'est_' + item.id,
      time_range: `预计：${item.estStart} ~ ${item.estEnd}`,
      ...temp
    })
    tableData.value.push({
      key: 'act_' + item.id,
      time_range: `实际：${item.actStart} ~ ${item.actEnd}`,
      actLog: item.actLog,
      ...temp
    })
  })
}

// 初始化（重新渲染）
const init = (opt: any) => {
  // 格式化数据
  formatData(opt.apiData)
  // 获取日期
  allDate.value = getYearAllDate(opt.year)
  // 格式化表格列
  tableColumns.value = [...InitTableColumn, ...generateTableColumns(allDate.value)]
  nextTick(() => {
    openDay(opt.openDay)
  })
}

// 设置时候打开天数显示
const openDay = (flag: Boolean) => {
  try {
    if (tableRef.value) {
      const tr = tableRef.value.$el?.querySelector(
        '.arco-table-element thead>tr.arco-table-tr:nth-child(2)'
      )
      if (tr) {
        tr.style.display = flag ? 'table-row' : 'none'
      }
      if (flag) {
        tableRef.value.$el?.classList.remove('close-day-warp')
      } else {
        tableRef.value.$el?.classList.add('close-day-warp')
      }
    }
  } catch (e) {
    console.error(e)
  }
}

defineExpose({
  init,
  openDay
})
</script>

<style>
/*！！！！要定义全局样式！！！！*/

/*甘特图小单元格*/
.min-cell .arco-table-cell {
  padding: 8px !important;
  font-size: 10px !important;
}

/*通用高亮样式*/
.min-cell .day-cell-action {
  height: 20px;
  font-size: 0;
  cursor: pointer;
}
.min-cell:has(div.day-cell-action) {
  border-right: none !important;
}
.min-cell .arco-table-cell:has(div.day-cell-action) {
  padding: 0 !important;
}

/*每一段第一个单元格样式*/
.min-cell .arco-table-cell:has(div.day-cell-action.first-cell) {
  padding-left: 5px !important;
}
.min-cell div.day-cell-action.first-cell {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

/*每一段最后一个单元格样式*/
.min-cell .arco-table-cell:has(div.day-cell-action.last-cell) {
  padding-right: 5px !important;
}
.min-cell:has(div.day-cell-action.last-cell) {
  border-right: 1px solid #e8e8e8 !important;
}
.min-cell div.day-cell-action.last-cell {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

/*预计时间高亮样式*/
.min-cell .est-cell.day-cell-action {
  background-color: #6764ff;
  //transform: translateY(8px);
}

/*实际时间高亮样式*/
.min-cell .act-cell.day-cell-action {
  background-color: #ff9329;
  //transform: translateY(-8px);
}

/*打开日期时隐藏所有边框*/
.close-day-warp .min-cell {
  border-right: none !important;
  border-left: none !important;
}
.close-day-warp .min-cell:has(div.day-cell-action.last-cell) {
  border-right: none !important;
}
.close-day-warp .min-cell:has(div.month-last-day) {
  border-right: 1px solid #e7e7e7 !important;
}
</style>
