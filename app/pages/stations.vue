<script setup>
definePageMeta({
  middleware: 'auth'
})
const loading = ref(false)
const newStation = ref('')
const newStationInput = ref(null)
const isOpen = ref(false)
const stationId = ref(0)

const toast = useToast()
const { user, clear } = useUserSession()
const { data: stations, refresh } = await useFetch('/api/stations')

async function addStation() {
  if (!newStation.value.trim()) return

  loading.value = true

  try {
    const station = await $fetch('/api/stations', {
      method: 'POST',
      body: {
        stationCode: newStation.value
      }
    })
    stations.value.push(station)
    await refresh()
    toast.add({ title: `Station "${station.stationCode}" created.` })
    newStation.value = ''
    nextTick(() => {
      newStationInput.value?.input?.focus()
    })
  }
  catch (err) {
    if (err.data?.data?.issues) {
      const title = err.data.data.issues.map(issue => issue.message).join('\n')
      toast.add({ title, color: 'red' })
    }
  }
  loading.value = false
}

async function toggleStation(station) {
  station.completed = Number(!station.completed)
  await $fetch(`/api/stations/${station.id}`, {
    method: 'PATCH',
    body: {
      completed: station.completed
    }
  })
  await refresh()
}

async function deleteStation(station) {
  await $fetch(`/api/stations/${station.id}`, { method: 'DELETE' })
  stations.value = stations.value.filter(s => s.id !== station.id)
  await refresh()
  toast.add({ title: `Station "${station.stationCode}" deleted.` })
}

const items = [[{
  label: 'Logout',
  icon: 'i-heroicons-arrow-left-on-rectangle',
  click: clear
}]]
</script>

<template>
  <UCard @submit.prevent="addStation">
    <template #header>
      <h3 class="text-lg font-semibold leading-6">
        <NuxtLink to="/">
          Station List
        </NuxtLink>
      </h3>

      <UDropdown
        v-if="user"
        :items="items"
      >
        <UButton
          color="white"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        >
          <UAvatar
            :src="`https://github.com/${user.login}.png`"
            :alt="user.login"
            size="3xs"
          />
          {{ user.login }}
        </UButton>
      </UDropdown>
    </template>

    <div class="flex items-center gap-2">
      <UInput
        ref="newStationInput"
        v-model="newStation"
        name="station"
        :disabled="loading"
        class="flex-1"
        placeholder="Make a Nuxt demo"
        autocomplete="off"
        autofocus
        :ui="{ wrapper: 'flex-1' }"
      />

      <UButton
        type="submit"
        icon="i-heroicons-plus-20-solid"
        :loading="loading"
        :disabled="newStation.trim().length === 0"
      />
    </div>

    <ul class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="station of stations"
        :key="station.id"
        class="flex items-center gap-4 py-2 cursor-pointer"
        label="Open"
        @click="stationId = station.id; isOpen = true"
      >
        <span
          class="font-medium flex-1"
        >{{ station.name }}<UBadge color="gray" class="ml-2">{{ station.total}}</UBadge></span>

        <!-- <UToggle
          :model-value="Boolean(station.completed)"
          @update:model-value="toggleStation(station)"
        /> -->
        <div class="flex items-center gap-2">
          <UPopover :popper="{ placement: 'right-start' }" mode="hover">
            <UButton
              color="gray"
              variant="soft"
              size="2xs"
              icon="i-heroicons-currency-dollar-20-solid"
            />

            <template #panel>
              <StationPricePopover :policies="station.policies" />
            </template>
          </UPopover>

          <!-- <UButton
            color="red"
            variant="soft"
            size="2xs"
            icon="i-heroicons-x-mark-20-solid"
            @click="deleteStation(station)"
          /> -->
        </div>
      </li>
    </ul>
  </UCard>
  <StationStatsModal v-if="stationId > 0" :station-id="stationId" v-model="isOpen" />
</template>
