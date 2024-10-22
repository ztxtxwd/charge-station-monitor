<template>
  <UModal v-model="isOpen" @close="close" :ui="{
    width: 'w-full sm:max-w-5xl',
  }">
    <div class="h-[800px] w-[1000px]">
      <VChart :option="option" />
    </div>
  </UModal>
</template>

<script setup>
const props = defineProps({
  stationId: {
    type: Number,
    required: true
  }
})

const stationStatuses = ref([])
const option = ref(null)

import { ref, watchEffect } from 'vue'

watchEffect(async() => {
  const { data: stationStatuses } = await useFetch(`/api/stationStatus/${props.stationId}`)
  const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const filteredData = stationStatuses.value.filter(status => new Date(status.createdAt) >= sevenDaysAgo);

    const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六','星期日'];
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        hours.push(
      (hour < 10 ? '0' + hour : hour) + ':' +
          (minute < 10 ? '0' + minute : minute)
        );
      }
    }

    const data = filteredData.map(status => {
      const date = new Date(status.createdAt);
      const hourIndex = date.getHours() * 12 + Math.floor(date.getMinutes() / 5);
      const dayIndex = (date.getDay() + 6) % 7; // 将星期日(0)转换为6,其他天数减1
      return [
        dayIndex,
        hourIndex,
        status.idle
      ];
    });

    const maxValue = Math.max(...data.map(item => item[2]));

    option.value = {
      polar: {},
      tooltip: {},
      visualMap: {
        type: 'continuous',
        min: 0,
        max: maxValue,
        top: 'middle',
        dimension: 2,
        calculable: true,
        inRange: {
          color: ['#ff0000', '#ffff00', '#00c800']  // 红、黄、绿
        }
      },
      angleAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
            type: 'solid',
            width: 2
          }
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          interval: 11,  // 每小时显示一个标签
          formatter: function(value, index) {
            return value.split(':')[0] + ':00';  // 只显示整点
          }
        }
      },
      radiusAxis: {
        type: 'category',
        data: days,
        z: 100
      },
      series: [
        {
          name: '空闲车位',
          type: 'custom',
          coordinateSystem: 'polar',
          itemStyle: {
            color: '#d14a61'
          },
          renderItem: function (params, api) {
            var values = [api.value(0), api.value(1)];
            var coord = api.coord(values);
            var size = api.size([1, 1], values);
            return {
              type: 'sector',
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r0: coord[2] - size[0] / 2,
                r: coord[2] + size[0] / 2,
                startAngle: -(coord[3] + size[1] / 2),
                endAngle: -(coord[3] - size[1] / 2)
              },
              style: api.style({
                fill: (function() {
                  const value = api.value(2);
                  const maxValue = Math.max(...data.map(item => item[2]));
                  const ratio = value / maxValue;
                  if (ratio === 0) return '#ff0000';  // 红色
                  if (ratio <= 0.5) return `rgb(255, ${Math.floor(255 * ratio * 2)}, 0)`;  // 红到黄
                  return `rgb(${Math.floor(255 * (2 - ratio * 2))}, 200, 0)`;  // 黄到深绿
                })()
              })
            };
          },
          data: data
        }
      ]
    };
});

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  stationStatuses.value = []
}

defineExpose({
  open,
  close
})
</script>
