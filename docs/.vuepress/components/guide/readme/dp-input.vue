<template>
  <div class="example">
    <div class="w-full max-w-xs">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="date">Select Date</label>
        <v-date-picker :input-props="inputProps" v-model="date"></v-date-picker>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
      inputProps: {
        id: 'date',
        class:
          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700',
      },
    };
  },
};
</script>