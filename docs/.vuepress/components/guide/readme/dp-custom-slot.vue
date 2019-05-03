<template>
  <div class="example">
    <div class="w-full max-w-sm">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="date">Select Date Range</label>
        <div class="flex w-full">
          <v-date-picker mode="range" v-model="date" class="flex-grow">
            <input
              id="date"
              slot-scope="{ inputProps, inputEvents, isDragging }"
              :class="[`shadow appearance-none border rounded-l w-full py-2 px-3 ${ isDragging ? 'text-gray-400' : 'text-gray-700' }`, { 'border-red-600': errorMessage }]"
              v-bind="inputProps"
              v-on="inputEvents"
            >
          </v-date-picker>
          <button
            type="button"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-r"
            @click="date = null"
          >Clear</button>
        </div>
        <p class="text-red-600 text-xs italic mt-1" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="text-blue-500 text-xs font-bold mt-1" v-else>We got it. Thanks!</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
  computed: {
    errorMessage() {
      if (!this.date) return 'Date is required.';
      return '';
    },
  },
};
</script>