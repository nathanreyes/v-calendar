<template>
  <div class="example">
    <v-calendar :attributes="attributes">
      <template #day-popover="{ day, format, masks, dayTitle, attributes }">
        <div>
          <span v-if="step === 1">Using my own content now</span>
          <div
            class="text-xs text-gray-300 font-semibold text-center"
            v-else-if="step === 2"
          >
            {{ format(day.date, `${masks.dayPopover}`) }}
          </div>
          <div
            class="text-xs text-gray-300 font-semibold text-center"
            v-else-if="step >= 3"
          >
            {{ dayTitle }}
          </div>
          <ul v-if="step === 3">
            <li
              v-for="{ key, customData } in attributes"
              :key="key"
              class="text-gray-100"
            >
              {{ customData.description }}
            </li>
          </ul>
          <popover-row
            v-if="step === 4"
            v-for="attr in attributes"
            :key="attr.key"
            :attribute="attr"
            >{{ attr.customData.description }}
          </popover-row>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
import PopoverRow from '@/components/PopoverRow';

export default {
  components: {
    PopoverRow,
  },
  props: {
    visibility: { type: String, default: 'hover' },
    hideIndicators: Boolean,
    step: { type: Number, default: 1 },
  },
  data() {
    const todos = [
      {
        description: 'Take Noah to basketball practice.',
        isComplete: false,
        dates: { weekdays: 6 }, // Every Friday
        color: 'red',
      },
    ];
    return {
      incId: todos.length,
      todos,
    };
  },
  computed: {
    attributes() {
      return [
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-75' : '',
          },
          popover: {
            label: todo.description,
            visibility: this.visibility,
            hideIndicator: this.hideIndicators,
          },
          customData: todo,
        })),
      ];
    },
  },
};
</script>
