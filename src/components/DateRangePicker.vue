<template>
<calendar
  :attributes='attributes_'
  @daySelect='selectDay'
  @dayMouseEnter='enterDay'
  v-bind='$attrs'
  v-on='$listeners'>
</calendar> 
</template>

<script>
import Calendar from './Calendar';
import DateRangeAttribute from './DateRangeAttribute';
import DateInfo from '../utils/dateInfo';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Object, default: () => {} },
    dragAttribute: { type: Object, required: true },
    selectAttribute: { type: Object, required: true },
    disabledAttribute: { type: Object, required: true },
    dateValidator: Function,
    attributes: Array,
  },
  data() {
    return {
      dragValue: null,
    };
  },
  computed: {
    valueIsValid() {
      return this.value && this.value.start && this.value.end;
    },
    normalizedValue() {
      return this.normalizeRange(this.value);
    },
    dragValueInfo() {
      return new DateInfo(this.dragValue);
    },
    dragAttribute_() {
      return { ...this.dragAttribute, dates: [this.dragValueInfo] };
    },
    selectAttribute_() {
      return { ...this.selectAttribute, dates: [this.normalizedValue] };
    },
    rangeAttribute() {
      return (this.dragValue) ? {
        key: 'drag',
        popover: {
          label: 'This is a test label.',
          component: DateRangeAttribute,
        },
        dates: [this.dragValue],
      } : null;
    },
    attributes_() {
      const attributes = this.attributes ? [...this.attributes] : [];
      if (this.dragValue) attributes.push(this.dragAttribute_);
      else if (this.valueIsValid) attributes.push(this.selectAttribute_);
      if (this.rangeAttribute) attributes.push(this.rangeAttribute);
      return attributes;
    },
  },
  watch: {
    dragValue(val) {
      this.$emit('drag', this.normalizeRange(val));
    },
  },
  created() {
    // Clear drag on escape keydown
    document.addEventListener('keydown', (e) => {
      if (this.dragValue && e.keyCode === 27) {
        this.dragValue = null;
      }
    });
  },
  methods: {
    touchStartDay(day) {
      this.selectDay(day);
      this.$emit('dayTouchStart', day);
    },
    selectDay(day) {
      // Start new drag selection if not dragging
      if (!this.dragValue) {
        // Make sure date selection is valid
        const date = new Date(day.date.getTime());
        if (this.dateValidator(date, 'selectDisabled')) {
          // Start new drag selection
          this.dragValue = { start: date, end: date };
        }
      } else {
        // Construct new value
        const newValue = new DateInfo({
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(day.date.getTime()),
        });
        // Make sure new value is valid
        if (this.dateValidator(newValue, 'selectDisabled')) {
          // Clear drag selection
          this.dragValue = null;
          // Signal new value selected
          this.$emit('input', newValue.toRange());
        }
      }
    },
    enterDay(day) {
      // Make sure drag has been initialized
      if (this.dragValue) {
        // Construct new drag value
        const newDragValue = {
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(day.date.getTime()),
        };
        // Make sure dragged value is valid
        if (this.dateValidator(newDragValue, 'dragDisabled')) {
          // Update drag selection
          this.dragValue = newDragValue;
        }
      }
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
