<template>
<calendar
  :highlights='highlights'
  v-bind='$attrs'
  v-on='$listeners'
  @dayClick='selectDay'
  @dayEnter='enterDay'>
</calendar> 
</template>

<script>
import Calendar from './Calendar';

export default {
  components: {
    Calendar,
  },
  data() {
    return {
      dragRange: null,
    };
  },
  props: {
    value: { type: Object, default: { } },
  },
  computed: {
    valueIsValid() {
      return this.value && this.value.start && this.value.end;
    },
    normalizedValue() {
      return this.normalizeRange(this.value);
    },
    normalizedDragRange() {
      return this.normalizeRange(this.dragRange);
    },
    highlights() {
      if (this.dragRange) {
        return [
          {
            dates: [this.normalizedDragRange],
            backgroundColor: '#c1c1be',
            color: '#103456',
            height: '27px',
          },
        ];
      }
      if (this.valueIsValid) {
        return [
          {
            dates: [this.value],
            backgroundColor: '#9b9b97',
            borderWidth: '2px',
            borderColor: '#8f8f8a',
            color: '#fafafa',
          },
        ];
      }
      return null;
    },
  },
  watch: {
    normalizedDragRange(value) {
      // Any time drag changes, normalize it and emit 'drag' event
      this.$emit('drag', value ? { start: value.start, end: value.end } : null);
    },
  },
  created() {
    // Clear drag on escape keydown
    document.addEventListener('keydown', (e) => {
      if (this.dragRange && e.keyCode === 27) {
        this.dragRange = null;
      }
    });
  },
  methods: {
    selectDay(day) {
      // Start new drag selection if not dragging
      if (!this.dragRange) {
        const date = new Date(day.date.getTime());
        this.dragRange = {
          start: date,
          end: date,
        };
      // Complete drag selection
      } else {
        const { start, end } = this.normalizedDragRange;
        // Clear drag selection
        this.dragRange = null;
        // Signal new value selected on drag complete
        this.$emit('input', { start, end });
      }
    },
    enterDay(day) {
      if (!this.dragRange) return;
      // Update drag selection
      this.dragRange = {
        start: new Date(this.dragRange.start.getTime()),
        end: new Date(day.date.getTime()),
      };
    },
    // Ranges can privately have end date earlier than start date
    // This function will correct the order before exposing it to to other components
    normalizeRange(range) {
      if (!range) return null;
      const { start, end } = range;
      const startTime = start.getTime();
      const endTime = end.getTime();
      const isNormal = start < end;
      return {
        start: isNormal ? start : end,
        startTime: isNormal ? startTime : endTime,
        end: isNormal ? end : start,
        endTime: isNormal ? endTime : startTime,
      };
    },
  },
};
</script>
