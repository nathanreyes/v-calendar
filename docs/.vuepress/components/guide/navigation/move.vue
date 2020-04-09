<template>
  <div class="example">
    <div class="w-full mb-3">
      <div class="flex">
        <div class="flex-no-shrink">
          <div class="mb-2">
            <label class="block font-semibold text-gray-600 mb-1">Move</label>
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
            class="flex sm:inline-flex items-center font-semibold text-gray-600 mb-1"
            >Position:
            <div class="flex-grow relative">
              <select
                class="inline-block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ml-2"
                id="position"
                v-model="position"
              >
                <option
                  v-for="position in positionOptions"
                  :key="position"
                  :value="position"
                  >{{ position }}</option
                >
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  ></path>
                </svg>
              </div>
            </div>
          </label>
          <label
            for="transition"
            class="flex sm:inline-flex items-center font-semibold text-gray-600 mb-1 ml-0 sm:ml-4"
            >Transition:
            <div class="flex-grow relative">
              <select
                class="inline-block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ml-2"
                id="transition"
                v-model="transition"
              >
                <option v-for="to in transitionOptions" :key="to" :value="to">{{
                  to
                }}</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  ></path>
                </svg>
              </div>
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
    <div class="flex flex-col sm:flex-row w-full">
      <div class="w-64 flex sm:flex-col flex-wrap">
        <!--Move by number of months-->
        <template v-if="moveBy === 'numMonths'">
          <button
            v-for="step in steps"
            class="block px-4 py-1 bg-indigo-100 text-indigo-800 w-32 rounded mt-2"
            @click="() => onMove(step)"
          >
            Move {{ `${step > 0 ? '+' : ''}${step}` }}
          </button>
        </template>
        <!--Move to month-->
        <template v-if="moveBy === 'toMonth'">
          <button
            class="block px-4 py-1 bg-indigo-100 text-indigo-800 rounded w-48 mb-2"
            v-for="{ name, month: { month, year } } in months"
            :key="name"
            @click="() => onMove({ month, year })"
          >
            {{ name }}
          </button>
        </template>
        <!--Move to date-->
        <template v-if="moveBy === 'toDate'">
          <button
            class="block px-4 py-1 bg-indigo-100 text-indigo-800 rounded w-48 mb-2"
            v-for="date in dates"
            :key="date.toString()"
            @click="() => onMove(date)"
          >
            {{ date.toLocaleDateString() }}
          </button>
        </template>
        <!--Move to date and focus-->
        <template v-if="moveBy === 'toDateFocus'">
          <button
            class="block px-4 py-1 bg-indigo-100 text-indigo-800 rounded w-48 mb-2"
            v-for="date in dates"
            :key="date.toString()"
            @click="() => onMoveFocus(date)"
          >
            {{ date.toLocaleDateString() }}
          </button>
        </template>
      </div>
      <div>
        <v-calendar
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
      ],
      transition: 'slide-h',
      transitionOptions: ['slide-h', 'slide-v', 'fade', 'none'],
      position: 1,
      positionOptions: [1, 2],
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