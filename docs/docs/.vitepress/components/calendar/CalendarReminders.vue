<template>
  <VCalendar
    view="weekly"
    :attributes="attrs"
    ref="calendar"
    title-position="left"
    :masks="masks"
    :bordered="false"
    transparent
    borderless
    expanded
  />
  <div v-if="calendar" class="py-4 px-6 w-full h-[18rem]">
    <div class="py-4 flex justify-between items-center">
      <h2 class="font-semibold text-lg">Reminders</h2>
      <IconBell class="text-gray-400 dark:text-gray-500" />
    </div>
    <template v-for="{ day, cells } in Object.values(dayCells)">
      <ul v-if="cells.length > 0" class="py-2 space-y-2">
        <li v-for="cell in cells">
          <div class="flex items-center space-x-4">
            <!--Icon-->
            <div class="flex-grow-0 flex-shrink-0">
              <div
                :class="`flex justify-center items-center w-10 h-10 rounded-lg ${cell.data.customData.iconClass}`"
              >
                <component :is="cell.data.customData.icon" />
              </div>
            </div>
            <div class="flex-grow flex justify-between items-center">
              <div>
                <p class="font-medium">
                  {{ cell.data.customData.summary }}
                </p>
                <p
                  class="text-xs font-medium text-gray-400 dark:text-gray-400 leading-2"
                >
                  {{ day.locale.formatDate(cell.startDate, 'WWWW, H:mm a') }}
                </p>
              </div>
              <BaseSwitch v-model="cell.data.customData.notify" />
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const masks = ref({
  weekdays: 'WWW',
});

const reminders = ref([
  {
    id: 1,
    summary: 'Meeting with Jonas Stark',
    date: new Date(2023, 6, 4, 9, 30),
    icon: 'IconVideoCamera',
    iconClass: 'bg-red-100 text-red-500 dark:bg-red-400 dark:text-white',
    notify: true,
  },
  {
    id: 2,
    summary: "Mia's birthday party",
    date: new Date(2023, 6, 8, 12),
    icon: 'IconCake',
    iconClass:
      'bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:text-white',
    notify: true,
  },
  {
    id: 3,
    summary: "Mom and dad's anniversary",
    date: new Date(2023, 6, 2, 3),
    icon: 'IconHeart',
    iconClass: 'bg-blue-100 text-blue-500 dark:bg-blue-400 dark:text-white',
    notify: false,
  },
]);

const attrs = reminders.value.map(r => ({
  key: r.id,
  dot: true,
  dates: r.date,
  customData: r,
}));

const calendar = ref(null);

const dayCells = computed(() => {
  if (!calendar.value) return [];
  return calendar.value.dayCells;
});
</script>
