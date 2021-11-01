<template>
  <div class="py-6">
    <div class="flex space-x-2 mb-2">
      <!-- <button @click="movePrevWeek">Previous</button>
      <button @click="moveNextWeek">Next</button> -->
      <button @click="addEvent">Add Event</button>
    </div>
    <div class="flex space-x-3 mb-">
      <div class="flex items-center space-x-1">
        <input type="radio" id="daily" value="daily" v-model="view" />
        <label for="daily">Daily</label>
      </div>
      <div class="flex items-center space-x-1">
        <input type="radio" id="weekly" value="weekly" v-model="view" />
        <label for="weekly">Weekly</label>
      </div>
      <div class="flex items-center space-x-1">
        <input type="radio" id="monthly" value="monthly" v-model="view" />
        <label for="monthly">Monthly</label>
      </div>
    </div>
    <Calendar :attributes="attributes" show-weeknumbers :view="view">
      <template #default="props">
        <CalendarGrid v-bind="props" />
      </template>
    </Calendar>
    <!-- <Calendar :attributes="attributes" :view="view" show-weeknumbers /> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CalendarGrid from '../../../../src/components/CalendarGrid/CalendarGrid.vue';

export default defineComponent({
  components: { CalendarGrid },
  setup() {
    const week = ref(2);
    const view = ref('weekly');
    const attributes = ref([]);
    return {
      week,
      view,
      attributes,
      // moveNextWeek() {
      //   week.value = Math.min(week.value + 1, 5);
      // },
      // movePrevWeek() {
      //   week.value = Math.max(week.value - 1, 1);
      // },
      addEvent() {
        this.attributes.push({
          dates: new Date(),
        });
      },
    };
  },
});
</script>

<style scoped lang="postcss"></style>

<style>
.vc-container {
  border: none !important;
}
</style>
