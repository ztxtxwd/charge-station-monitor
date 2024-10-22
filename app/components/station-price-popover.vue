<template>
  <div class="p-4 flex flex-col gap-2">
    <div v-for="(priceInfo, index) in priceInfo" :key="index" class="flex justify-between text-sm items-center">
      <UBadge color="gray" class="mr-2"><UIcon name="i-heroicons-clock" class="mr-1" />{{ priceInfo.startTime }} - {{ priceInfo.endTime }}</UBadge>
      <span>{{ priceInfo.price }} 元/度</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  policies: {
    type: String,
    required: true
  }
})

const priceInfo = computed(() => {
  if (!props.policies) return []
  let policiesArray = JSON.parse(props.policies)
  console.log(policiesArray)
  policiesArray = policiesArray.map(item => ({
    startTime: item.startTime.slice(0, 5),
    endTime: item.endTime.slice(0, 5),
    price: Number(item.price).toFixed(2)
  }));
  return policiesArray
})

</script>
