<template>
  <div class="space-y-6">
    <div>
      <label class="block font-semibold mb-1">Move</label>
      <div class="ml-2">
        <label for="numMonths" class="flex items-center">
          <input
            type="radio"
            id="numMonths"
            value="numMonths"
            v-model="moveBy"
          /><span class="ml-1">By number of months</span></label
        >
        <label for="toMonth" class="flex items-center">
          <input
            type="radio"
            id="toMonth"
            value="toMonth"
            v-model="moveBy"
          /><span class="ml-1">To month</span></label
        >
        <label for="toDate" class="flex items-center">
          <input
            type="radio"
            id="toDate"
            value="toDate"
            v-model="moveBy"
          /><span class="ml-1">To date</span></label
        >
        <label for="toDateFocus" class="flex items-center">
          <input
            type="radio"
            id="toDateFocus"
            value="toDateFocus"
            v-model="moveBy"
          /><span class="ml-1">To date and focus</span></label
        >
      </div>
    </div>
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
      <label for="position" class="inline-flex items-center font-semibold"
        >Position:
        <div class="flex-grow relative">
          <BaseSelect v-model="position" :options="positionOptions" />
        </div>
      </label>
      <label
        for="transition"
        class="inline-flex items-center font-semibold mb-1 ml-0 sm:ml-4"
        >Transition:
        <div class="flex-grow relative">
          <BaseSelect v-model="transition" :options="transitionOptions" />
        </div>
        <span
          class="inline-block w-4 h-4 bg-green-400 rounded-full ml-4"
          v-if="transitioning"
        />
        <span
          class="inline-block w-4 h-4 bg-gray-300 rounded-full ml-4"
          v-else
        />
      </label>
    </div>
    <div
      class="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-start md:space-x-6"
    >
      <!--Buttons-->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-4 w-full items-center"
      >
        <!--Move by number of months-->
        <template v-if="moveBy === 'numMonths'">
          <BaseButton v-for="step in steps" @click="() => onMove(step)">
            Move {{ `${step > 0 ? '+' : ''}${step}` }}
          </BaseButton>
        </template>
        <!--Move to month-->
        <template v-if="moveBy === 'toMonth'">
          <BaseButton
            v-for="{ name, month: { month, year } } in months"
            :key="name"
            @click="() => onMove({ month, year })"
          >
            {{ name }}
          </BaseButton>
        </template>
        <!--Move to date-->
        <template v-if="moveBy === 'toDate'">
          <BaseButton
            v-for="date in dates"
            :key="date.toString()"
            @click="() => onMove(date)"
          >
            {{ date.toLocaleDateString() }}
          </BaseButton>
        </template>
        <!--Move to date and focus-->
        <template v-if="moveBy === 'toDateFocus'">
          <BaseButton
            v-for="date in dates"
            :key="date.toString()"
            @click="() => onMoveFocus(date)"
          >
            {{ date.toLocaleDateString() }}
          </BaseButton>
        </template>
      </div>
      <div class="flex justify-center">
        <VCalendar
          :rows="2"
          ref="calendar"
          :transition="transition"
          @transition-start="transitioning = true"
          @transition-end="transitioning = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const calendar = ref(null);
const year = new Date().getFullYear();
const moveBy = ref('numMonths');
const steps = ref([-5, -3, -1, 1, 3, 5]);
const months = ref([
  {
    name: 'January',
    month: { month: 1, year },
  },
  {
    name: 'February',
    month: { month: 2, year },
  },
  {
    name: 'March',
    month: { month: 3, year },
  },
  {
    name: 'April',
    month: { month: 4, year },
  },
  {
    name: 'May',
    month: { month: 5, year },
  },
  {
    name: 'June',
    month: { month: 6, year },
  },
  {
    name: 'July',
    month: { month: 7, year },
  },
  {
    name: 'August',
    month: { month: 8, year },
  },
  {
    name: 'September',
    month: { month: 9, year },
  },
  {
    name: 'October',
    month: { month: 10, year },
  },
  {
    name: 'November',
    month: { month: 11, year },
  },
  {
    name: 'December',
    month: { month: 12, year },
  },
]);
const dates = ref([
  new Date(1944, 5, 6),
  new Date(1955, 11, 1),
  new Date(1969, 6, 20),
  new Date(2001, 8, 11),
  new Date(),
]);
const transition = ref('slide-h');
const transitionOptions = ref([
  { value: 'slide-h' },
  { value: 'slide-v' },
  { value: 'fade' },
  { value: 'none' },
]);
const position = ref(1);
const positionOptions = ref([{ value: 1 }, { value: 2 }]);
const transitioning = ref(false);

function onMove(arg) {
  if (calendar.value == null) return;
  if (typeof arg === 'number') {
    calendar.value.moveBy(arg, {
      transition: transition.value,
      position: position.value,
    });
  } else {
    calendar.value.move(arg, {
      transition: transition.value,
      position: position.value,
    });
  }
}

function onMoveFocus(arg) {
  calendar.value.focusDate(arg, {
    transition: transition.value,
    position: position.value,
  });
}
</script>
