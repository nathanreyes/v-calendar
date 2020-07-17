<template>
  <div class="section text-center">
    <h2 class="h2">Date Picker</h2>
    <p class="text-lg font-medium text-gray-600 mb-2">Single Dates</p>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker v-model="date" is-inline />
    </div>
    <p class="text-lg font-medium text-gray-600 mb-2">Date Ranges</p>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker mode="range" v-model="range" is-inline />
    </div>
    <p class="text-lg font-medium text-gray-600">Popover Mode</p>
    <div class="example-home mt-0">
      <div class="w-full max-w-sm">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <span class="block text-gray-700 text-sm text-left font-bold mb-2"
              >Select Range</span
            >
            <v-date-picker mode="range" v-model="range2">
              <template v-slot="{ inputValue, inputEvents }">
                <div class="flex w-full">
                  <input :value="inputValue.start" v-bind="inputEvents" />
                  <input :value="inputValue.start" v-bind="inputEvents" />
                </div>
              </template>
            </v-date-picker>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    return {
      date,
      date2: date,
      dates: [
        new Date(year, month, 3),
        new Date(year, month, 15),
        new Date(year, month, 25),
      ],
      range: {
        start: new Date(year, month, 6),
        end: new Date(year, month, 23),
      },
      range2: {
        start: new Date(year, month, 6),
        end: new Date(year, month, 23),
      },
    };
  },
};
</script>

