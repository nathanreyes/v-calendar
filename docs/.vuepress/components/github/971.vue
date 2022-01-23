<template>
  <div class="w-full">
    <v-date-picker
      v-model="date"
      mode="dateTime"
      :valid-hours="props[activeProp]"
      :minute-increment="5"
    />
    <div class="flex space-x-2 mt-2">
      <button
        v-for="prop in ['array', 'object', 'fn']"
        :key="prop"
        class="px-2 py-1 rounded"
        :class="{ 'bg-indigo-500 text-white': prop === activeProp }"
        @click="activeProp = prop"
      >
        {{ prop }}
      </button>
    </div>
    <div>
      <div class="font-semibold">Date</div>
      {{ date }}
    </div>
    <div>
      <div class="font-semibold">Arg</div>
      {{ props[activeProp] }}
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: 'Add valid hours prop',
  data() {
    return {
      date: new Date(),
      activeProp: 'array',
      props: {
        array: [1, 3, 5, 7, 9, 11, 12, 14, 18, 20, 23],
        object: { min: 10, max: 14 },
        // Limit hours from 8 to 12 AM only on weekends
        fn: function (hour, { weekday }) {
          return ![1, 7].includes(weekday) || (hour >= 8 && hour <= 12);
        },
      },
    };
  },
};
</script>
