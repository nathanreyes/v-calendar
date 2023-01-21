<template>
  <div class="vc-calendar-event-details">
    <template v-if="single">
      <div class="vc-field">
        <div class="vc-label">Title</div>
        <input v-model="single.summary" type="text" class="vc-input" />
      </div>
      <div class="vc-field">
        <div class="vc-label">Start</div>
        <VDatePicker v-model="startDate" mode="dateTime">
          <template #default="{ inputValue, inputEvents }">
            <input class="vc-input" :value="inputValue" v-on="inputEvents" />
          </template>
        </VDatePicker>
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
import { ref, computed, PropType } from 'vue';
import { Event } from '../../utils/calendar/event';
import DatePicker from '../DatePicker/DatePicker.vue';

const props = defineProps({
  events: { type: Array as PropType<Event[]>, required: true },
});

const single = computed(() => {
  if (!props.events.length || props.events.length > 1) return null;
  return props.events[0];
});
const startDate = ref(new Date());
</script>

<style>
.vc-calendar-cell-details {
  background: var(--vc-gray-100);
  border: solid 1px var(--vc-gray-300);
  min-width: 400px;
  padding: 1rem 1.5rem;
  margin: 2.5rem 0 1rem 1rem;
  border-radius: var(--vc-rounded-lg);

  .vc-field {
  }
  .vc-label {
    font-size: var(--vc-text-sm);
    color: var(--vc-gray-600);
    font-weight: var(--vc-font-medium);
    letter-spacing: var(--tracking-wide);
  }
  .vc-input {
    font-size: var(--vc-text-sm);
    display: block;
    margin-top: 0.25rem;
    shadow: var(--vc-shadow-sm);
    border: 1px solid var(--vc-gray-300);
    padding: 0.25rem 0.75rem;
    border-radius: var(--vc-rounded-md);
    width: 100%;
  }
}

/* focus:ring-indigo-500 focus:border-indigo-500  */
</style>
