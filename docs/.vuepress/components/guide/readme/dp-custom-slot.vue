<template>
  <div class="example">
    <div class="w-full max-w-sm">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
        <label class="block text-gray-600 text-sm font-bold mb-2" for="date"
          >Select Date</label
        >
        <div class="flex w-full">
          <v-date-picker v-model="date" class="flex-grow">
            <template v-slot="{ inputValue, inputEvents }">
              <span>
                <input
                  id="date"
                  class="bg-white text-gray-700 w-full py-2 px-3 appearance-none border rounded-l focus:outline-none focus:border-blue-500"
                  :class="{ 'border-red-600': errorMessage }"
                  :value="inputValue"
                  v-on="inputEvents"
                />
              </span>
            </template>
          </v-date-picker>
          <button
            type="button"
            class="text-white font-bold py-2 px-4 rounded-r user-select-none focus:outline-none"
            :class="date ? 'bg-red-500' : 'bg-red-300'"
            :disabled="!date"
            @click="date = null"
          >
            Clear
          </button>
        </div>
        <p class="text-red-600 text-xs italic mt-1" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        <p class="text-blue-500 text-xs font-bold mt-1" v-else>
          We got it. Thanks!
        </p>
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
