<template>
  <div class="w-80">
    <!--Header-->
    <div class="flex items-center justify-between py-1 px-2 space-x-3">
      <!--Label-->
      <input
        v-if="event.editing"
        v-model="event.summary"
        v-focus
        placeholder="Add event label"
        class="color-white placeholder-gray-300 bg-gray-600 px-2 py-1 rounded border border-gray-500"
      />
      <h3 v-else class="font-bold">{{ event.summary }}</h3>
      <!--Buttons-->
      <div class="flex justify-end items-center space-x-3">
        <!--Edit button-->
        <button
          v-if="!event.editing"
          class="w-5 h-5 text-blue-500 hover:opacity-50"
          type="button"
          @click="onToggleEditing()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <!--Remove button-->
        <button
          class="w-5 h-5 text-red-500 hover:opacity-50"
          type="button"
          @click="onRemove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        <!--Close button-->
        <button
          class="w-5 h-5 hover:opacity-50"
          type="button"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="event.editing">
      <div class="flex justify-end items-center space-x-2 mt-3 mb-1">
        <!--Save button-->
        <button
          class="flex justify-center items-center bg-blue-200 text-sm text-blue-800 hover:bg-blue-300 px-2 py-1 rounded"
          type="button"
          @click="onSave"
        >
          Save
        </button>
        <!--Cancel button-->
        <button
          class="flex justify-center items-center text-sm px-2 py-1 rounded hover:bg-gray-500"
          type="button"
          @click="onCancel"
        >
          Cancel
        </button>
      </div>
    </div>
    <div v-else class="py-2 px-3 space-y-2">
      <!--Date-->
      <div class="flex items-center">
        <!--Date icon-->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 current-color"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <!--Date label-->
        <div class="ml-2 text-gray-200 font-medium">
          {{ event.formatDate(event.startDate, 'WWWW, MMMM D') }}
        </div>
      </div>
      <!--Time-->
      <div class="flex items-center">
        <!--Time icon-->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 current-color"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <!--Time label-->
        <div class="ml-2 text-gray-200 font-medium">
          <span v-if="event.allDay"> All Day </span>
          <span v-else-if="event.isMultiDay"
            >{{ event.startTimeLabel }}-{{ event.endTimeLabel }}</span
          >
          <span v-else
            >{{ event.startTimeLabel }}-{{ event.endTimeLabel }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, toRefs } from 'vue';
import { useCalendarGrid } from '../../use/calendarGrid';
import { Event } from '../../utils/calendar/event';

export default defineComponent({
  name: 'CalendarEventEdit',
  emits: ['close'],
  props: {
    event: { type: Object as PropType<Event>, required: true },
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      },
    },
  },
  setup(props) {
    const { removeEvent } = useCalendarGrid();

    const state = reactive({
      // editing: false,
    });
    return {
      ...toRefs(state),
      onRemove() {
        removeEvent(props.event);
      },
      onToggleEditing() {
        props.event.editing = !props.event.editing;
      },
      onSave() {
        props.event.editing = false;
      },
      onCancel() {
        props.event.editing = false;
      },
    };
  },
});
</script>
