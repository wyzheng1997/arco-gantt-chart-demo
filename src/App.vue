<script setup lang="ts">
import GanttChart from '@/components/GanttChart/GanttChart.vue'
import { onMounted, ref } from 'vue'
const mode = ref(false)
const GanttChartRef = ref()
// 初始化数据
const initData = (year: number) => {
  if (GanttChartRef.value) {
    // 当年份变化时需要重新调用init方法
    GanttChartRef.value.init({
      year: year,
      openDay: mode.value,
      apiData: [
        {
          id: 1,
          stage: '土建阶段',
          estStart: '2023-01-20',
          estEnd: '2023-10-01',
          actStart: '2023-02-01',
          actEnd: '',
          actLog: [
            '2023-02-01',
            '2023-02-02',
            '2023-02-03',
            '2023-02-11',
            '2023-02-12',
            '2023-02-13',
            '2023-02-16'
          ]
        },
        {
          id: 2,
          stage: '电器阶段',
          estStart: '2022-01-20',
          estEnd: '2023-01-25',
          actStart: '2022-01-05',
          actEnd: '',
          actLog: []
        },
        {
          id: 42,
          stage: '第一阶段',
          estStart: '2023-06-05',
          estEnd: '2023-07-03',
          actStart: '2023-06-03',
          actEnd: '2023-06-10',
          actLog: ['2023-06-10', '2023-06-03']
        }
      ]
    })
  }
}

// 变换模式
const changeMode = (openDay: Boolean) => {
  mode.value = openDay
  if (GanttChartRef.value) {
    // 只是打开或者关闭日的显示，调用openDay方法即可
    GanttChartRef.value.openDay(mode.value)
  }
}

onMounted(() => {
  initData(2023)
})
</script>

<template>
  <div>
    <a-space>
      <a-button :type="!mode ? 'primary' : 'outline'" @click="changeMode(false)">月</a-button>
      <a-button :type="mode ? 'primary' : 'outline'" @click="changeMode(true)">日</a-button>
    </a-space>
    <GanttChart ref="GanttChartRef"></GanttChart>
  </div>
</template>
