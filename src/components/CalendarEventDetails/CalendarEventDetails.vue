<template>
  <div class="vc-calendar-event-details">
    <template v-if="single">
      <div class="vc-field">
        <div class="vc-label">Title</div>
        <input v-model="single.label" type="text" class="vc-input" />
      </div>
      <div class="vc-field">
        <div class="vc-label">Start</div>
        <DatePicker v-model="startDate" mode="dateTime">
          <template #default="{ inputValue, inputEvents }">
            <input class="vc-input" :value="inputValue" v-on="inputEvents" />
          </template>
        </DatePicker>
      </div>
    </template>
    <div v-else-if="events.length">
      <div class="vc-label">{{ events.length }} events selected</div>
    </div>
    <div v-else>
      <div class="vc-label">No event selected</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DatePicker from '../DatePicker/DatePicker.vue';

const props = defineProps({
  events: { type: Array, required: true },
});

const single = computed(() => {
  if (!props.events.length || props.events.length > 1) return null;
  return props.events[0];
});
const startDate = ref(new Date());
</script>

<style lang="css">
@import './calendar-event-details.css';
</style>
