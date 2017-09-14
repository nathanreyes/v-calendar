<template>
<calendar
  :highlights='highlights_'
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
      dragValue_: this.dragValue,
    };
  },
  props: {
    value: { type: Object, default: () => { } },
    dragValue: { type: Object, default: () => { } },
    dragHighlight: { type: Object, required: true },
    selectHighlight: { type: Object, required: true },
    highlights: Array,
  },
  computed: {
    valueIsValid() {
      return this.value && this.value.start && this.value.end;
    },
    normalizedValue() {
      return this.normalizeRange(this.value);
    },
    normalizedDragValue() {
      return this.normalizeRange(this.dragValue_);
    },
    dragHighlight_() {
      return { ...this.dragHighlight, dates: [this.normalizedDragValue] };
    },
    selectHighlight_() {
      return { ...this.selectHighlight, dates: [this.normalizedValue] };
    },
    highlights_() {
      if (this.dragValue_) {
        return this.highlights ? [...this.highlights, this.dragHighlight_] : [this.dragHighlight_];
      }
      if (this.valueIsValid) {
        return this.highlights ? [...this.highlights, this.selectHighlight_] : [this.selectHighlight_];
      }
      return this.highlights;
    },
  },
  watch: {
    dragValue(value) {
      this.dragValue_ = value;
    },
    dragValue_(value) {
      this.$emit('update:dragValue', value);
      this.$emit('drag', value);
    },
  },
  created() {
    // Clear drag on escape keydown
    document.addEventListener('keydown', (e) => {
      if (this.dragValue_ && e.keyCode === 27) {
        this.dragValue_ = null;
      }
    });
  },
  methods: {
    selectDay(day) {
      // Start new drag selection if not dragging
      if (!this.dragValue_) {
        const date = new Date(day.date.getTime());
        this.dragValue_ = { start: date, end: date };
      // Complete drag selection
      } else {
        const { start, end } = this.normalizedDragValue;
        // Clear drag selection
        this.dragValue_ = null;
        // Signal new value selected on drag complete
        this.$emit('input', { start, end });
      }
      // Forward the event
      this.$emit('dayClick', day);
    },
    enterDay(day) {
      if (!this.dragValue_) return;
      // Update drag selection
      this.dragValue_ = {
        start: new Date(this.dragValue_.start.getTime()),
        end: new Date(day.date.getTime()),
      };
      // Forward the event
      this.$emit('dayEnter', day);
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
    rangesMatch(aRange, bRange) {
      if (!aRange && !bRange) return true;
      if (aRange && bRange) {
        const aStart = aRange.start.getTime();
        const aEnd = aRange.end.getTime();
        const bStart = bRange.start.getTime();
        const bEnd = bRange.end.getTime();
        if (aStart === bStart && aEnd === bEnd) return true;
        if (aStart === bEnd && aEnd === bStart) return true;
      }
      return false;
    },
  },
};
</script>
