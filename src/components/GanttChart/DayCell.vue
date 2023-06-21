<template>
  <a-tooltip v-if="classList['day-cell-action']">
    <template #content>
      <div v-for="(msg, index) in content" :key="index">{{ msg }}</div>
    </template>
    <div :class="classList" @click="clickCell"></div>
  </a-tooltip>
  <div v-else-if="classList['month-last-day']" :class="classList"></div>
</template>
<script lang="ts" setup>
import { formatTime } from '@/components/GanttChart/tool'
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
  row: any
  column: any
}>()

const classList = ref({} as any)
const content = ref([] as string[])

// 点击单元格
const clickCell = () => {
  Message.info('点击了单元格' + props.column.dataIndex)
}

// 获取当前日期的状态
const getDayCelClass = (row: any, ymd: string) => {
  const [year, month, day] = ymd.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const isLastDay = new Date(year, month, 0).getDate() === day
  content.value = [
    `${row.stage}(${ymd})`,
    `预计：${row.estStart} ~ ${row.estEnd}`,
    `实际：${row.actStart} ~ ${row.actEnd}`
  ]
  if (row.key.startsWith('est_')) {
    const ymdData = +ymd.replace(/-/g, '')
    const estStartData = +row.estStart.replace(/-/g, '')
    const estEndData = +row.estEnd.replace(/-/g, '')
    return {
      'est-cell': true,
      'day-cell-action': estStartData <= ymdData && ymdData <= estEndData,
      'first-cell': ymdData === estStartData,
      'last-cell': ymdData === estEndData,
      'month-last-day': isLastDay
    }
  } else {
    const prevDay = formatTime(new Date(date.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    const nextDay = formatTime(new Date(date.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    // 实际
    const action = row.actLog.includes(ymd)
    return {
      'act-cell': true,
      'day-cell-action': action,
      'first-cell': action && !row.actLog.includes(prevDay),
      'last-cell': action && !row.actLog.includes(nextDay),
      'month-last-day': isLastDay
    }
  }
}

watch(
  props,
  () => {
    if (props.row && props.column && props.column.dataIndex) {
      classList.value = getDayCelClass(props.row, props.column.dataIndex)
    } else {
      classList.value = {}
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
