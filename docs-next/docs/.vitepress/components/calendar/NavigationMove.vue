<template>
  <div class="w-full mb-3">
    <div class="flex">
      <div class="flex-no-shrink">
        <div class="mb-2">
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
        <label
          for="position"
          class="flex sm:inline-flex items-center font-semibold mb-1"
          >Position:
          <div class="flex-grow relative">
            <BaseSelect v-model="position" :options="positionOptions" />
          </div>
        </label>
        <label
          for="transition"
          class="flex sm:inline-flex items-center font-semibold mb-1 ml-0 sm:ml-4"
          >Transition:
          <div class="flex-grow relative">
            <BaseSelect v-model="transition" :options="transitionOptions" />
          </div>
          <span
            class="inline-block w-4 h-4 bg-green-400 rounded-full ml-4"
            v-if="transitioning"
          />
          <span
            class="inline-block w-4 h-4 bg-red-400 rounded-full ml-4"
            v-else
          />
        </label>
      </div>
    </div>
    <div class="mt-3"></div>
  </div>
  <div
    class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 w-full"
  >
    <div class="flex-col space-y-2">
      <!--Move by number of months-->
      <template v-if="moveBy === 'numMonths'">
        <BaseButton
          v-for="step in steps"
          class="w-32"
          @click="() => onMove(step)"
        >
          Move {{ `${step > 0 ? '+' : ''}${step}` }}
        </BaseButton>
      </template>
      <!--Move to month-->
      <template v-if="moveBy === 'toMonth'">
        <BaseButton
          v-for="{ name, month: { month, year } } in months"
          :key="name"
          class="w-32"
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
          class="w-32"
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
          class="w-32"
          @click="() => onMoveFocus(date)"
        >
          {{ date.toLocaleDateString() }}
        </BaseButton>
      </template>
    </div>
    <div class="flex-shrink-0">
      <Calendar
        :rows="2"
        ref="calendar"
        :transition="transition"
        @transition-start="transitioning = true"
        @transition-end="transitioning = false"
      />
    </div>
  </div>
</template>

<script>
const year = new Date().getFullYear();
export default {
  data() {
    return {
      moveBy: 'numMonths',
      steps: [-5, -3, -1, 1, 3, 5],
      months: [
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
      ],
      dates: [
        new Date(1944, 5, 6),
        new Date(1955, 11, 1),
        new Date(1969, 6, 20),
        new Date(2001, 8, 11),
        new Date(),
      ],
      transition: 'slide-h',
      transitionOptions: [
        { value: 'slide-h' },
        { value: 'slide-v' },
        { value: 'fade' },
        { value: 'none' },
      ],
      position: 1,
      positionOptions: [{ value: 1 }, { value: 2 }],
      transitioning: false,
    };
  },
  methods: {
    onMove(arg) {
      this.$refs.calendar.move(arg, {
        transition: this.transition,
        position: this.position,
      });
    },
    onMoveFocus(arg) {
      this.$refs.calendar.focusDate(arg, {
        transition: this.transition,
        position: this.position,
      });
    },
  },
};
</script>
