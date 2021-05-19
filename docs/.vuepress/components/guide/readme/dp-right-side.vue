<template>
  <div class="example">
    <v-date-picker is-range v-model="dateRange">
      <template v-slot:right-side>
        <div class="bg-gray-100 w-40 text-center p-2 border-t rounded-b-lg">
          <button
            @click="selectToday"
            class="bg-blue-500 w-32 m-2 text-white font-medium px-2 py-1 rounded hover:bg-blue-600"
          >
            Today
          </button>
          <button
            @click="selectYesterday"
            class="bg-blue-500 w-32 m-2 text-white font-medium px-2 py-1 rounded hover:bg-blue-600"
          >
            Yesterday
          </button>
          <button
            @click="selectWeek"
            class="bg-blue-500 w-32 m-2 text-white font-medium px-2 py-1 rounded hover:bg-blue-600"
          >
            Week
          </button>
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
import subWeeks from 'date-fns/subWeeks';
import subDays from 'date-fns/subDays';

export default {
  data() {
    return {
      dateRange: null,
    };
  },
  methods: {
    selectToday() {
      this.dateRange = {
        start: new Date(),
        end: new Date(),
      };
    },
    selectYesterday() {
      this.dateRange = {
        start: subDays(new Date(), 1),
        end: subDays(new Date(), 1),
      };
    },
    selectWeek() {
      this.dateRange = {
        start: new Date(),
        end: subWeeks(new Date(), 1),
      };
    },
  },
};
</script>
