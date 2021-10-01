<template>
  <div class="py-6">
    <div class="flex space-x-2 mb-2">
      <button @click="movePrevWeek">Previous</button>
      <button @click="moveNextWeek">Next</button>
      <button @click="addEvent">Add Event</button>
    </div>
    <Calendar
      :attributes="attributes"
      :week="week"
      show-weeknumbers
      :rows="2"
      :columns="2"
      is-weekly
    >
      <template #week="props">
        <CalendarWeek v-bind="props" />
      </template>
    </Calendar>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CalendarWeek from '../../../../src/components/CalendarWeek/CalendarWeek.vue';

export default defineComponent({
  components: { CalendarWeek },
  setup() {
    const week = ref(4);
    const attributes = ref([]);
    return {
      week,
      attributes,
      moveNextWeek() {
        week.value = Math.min(week.value + 1, 5);
      },
      movePrevWeek() {
        week.value = Math.max(week.value - 1, 1);
      },
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
