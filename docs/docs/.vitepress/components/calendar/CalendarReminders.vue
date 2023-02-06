<template>
  <div>
    <div class="w-full max-w-md">
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
      <div v-if="calendar" class="py-4 px-6 w-full">
        <div class="py-2 flex">
          <h2 class="font-semibold text-lg">Reminders</h2>
        </div>
        <template v-for="{ day, cells } in Object.values(dayCells)">
          <ul v-if="cells.length > 0" class="py-2 space-y-2">
            <li v-for="cell in cells">
              <div class="flex items-center space-x-4">
                <div class="flex-grow-0 flex-shrink-0">
                  <div
                    :class="`flex justify-center items-center w-10 h-10 rounded-lg ${cell.data.customData.iconClass}`"
                  >
                    <component :is="cell.data.customData.icon" />
                  </div>
                </div>
                <div class="flex-grow">
                  <p class="font-medium">
                    {{ cell.data.customData.summary }}
                  </p>
                  <div class="flex justify-between items-center">
                    <p
                      class="text-xs font-medium text-gray-400 dark:text-gray-400 leading-2"
                    >
                      {{ day.locale.formatDate(cell.startDate, 'WWWW') }}
                    </p>

                    <p
                      class="text-xs font-medium text-gray-400 dark:text-gray-400 leading-2"
                    >
                      {{ day.locale.formatDate(cell.startDate, 'H:mm a') }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>
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
    icon: 'BaseVideoCameraIcon',
    iconClass: 'bg-red-100 text-red-500 dark:bg-red-400 dark:text-white',
    notify: true,
  },
  {
    id: 2,
    summary: "Mia's birthday party",
    date: new Date(2023, 6, 8, 12),
    icon: 'BaseCakeIcon',
    iconClass:
      'bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:text-white',
    notify: true,
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
