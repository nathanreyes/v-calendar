<template>
<calendar
  :attributes='attributes_'
  v-bind='$attrs'
  v-on='$listeners'
  @dayClick='selectDay'
  @dayEnter='enterDay'>
</calendar> 
</template>

<script>
import Calendar from './Calendar';
import { DateInfo } from './utils';

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
    dragAttribute: { type: Object, required: true },
    selectAttribute: { type: Object, required: true },
    dateValidator: Function,
    attributes: Array,
  },
  computed: {
    valueIsValid() {
      return this.value && this.value.start && this.value.end;
    },
    normalizedValue() {
      return this.normalizeRange(this.value);
    },
    dragValueInfo() {
      return new DateInfo(this.dragValue_);
    },
    dragAttribute_() {
      return { ...this.dragAttribute, dates: [this.dragValueInfo] };
    },
    selectAttribute_() {
      return { ...this.selectAttribute, dates: [this.normalizedValue] };
    },
    attributes_() {
      if (this.dragValue_) {
        return this.attributes ? [...this.attributes, this.dragAttribute_] : [this.dragAttribute_];
      }
      if (this.valueIsValid) {
        return this.attributes ? [...this.attributes, this.selectAttribute_] : [this.selectAttribute_];
      }
      return this.attributes;
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
      // Make sure date selection is valid
        const date = new Date(day.date.getTime());
        if (this.dateValidator(date, 'selectDisabled')) {
          // Start new drag selection
          this.dragValue_ = { start: date, end: date };
        }
      } else {
        // Construct new value
        const newValue = new DateInfo({
          start: new Date(this.dragValue_.start.getTime()),
          end: new Date(day.date.getTime()),
        });
        // Make sure new value is valid
        if (this.dateValidator(newValue, 'selectDisabled')) {
          // Clear drag selection
          this.dragValue_ = null;
          // Signal new value selected
          this.$emit('input', newValue.toRange());
        }
      }
      // Forward the event
      this.$emit('dayClick', day);
    },
    enterDay(day) {
      // Make sure drag has been initialized
      if (this.dragValue_) {
        // Construct new drag value
        const newDragValue = {
          start: new Date(this.dragValue_.start.getTime()),
          end: new Date(day.date.getTime()),
        };
        // Make sure dragged value is valid
        if (this.dateValidator(newDragValue, 'dragDisabled')) {
          // Update drag selection
          this.dragValue_ = newDragValue;
        }
      }
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
  },
};
</script>
