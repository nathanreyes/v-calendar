<template>
<calendar
  :dayContentHoverStyle='dayContentHoverStyle_'
  :attributes='attributes_'
  @daySelect='selectDay'
  @dayMouseEnter='enterDay'
  v-bind='$attrs'
  v-on='$listeners'>
</calendar> 
</template>

<script>
import Calendar from './Calendar';
import DateInfo from '../utils/dateInfo';
import defaults from '../utils/defaults';
import { rangeHasValue } from '../utils/pickerProfiles';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Object, default: () => {} },
    selectColor: { type: String, default: () => defaults.datePickerSelectColor },
    dragColor: { type: String, default: () => defaults.datePickerDragColor },
    dragAttribute: Object,
    selectAttribute: Object,
    disabledAttribute: Object,
    dayContentHoverStyle: Object,
    dateValidator: Function,
    attributes: Array,
  },
  data() {
    return {
      dragValue: null,
      dayContentHoverStyle_: this.dayContentHoverStyle,
    };
  },
  computed: {
    dragAttribute_() {
      const normValue = this.normalizeRange(this.dragValue);
      if (!normValue) return null;
      return {
        ...defaults.datePickerDragAttribute(this.dragColor),
        ...this.dragAttribute,
        dates: [this.dragValue],
      };
    },
    selectAttribute_() {
      const normValue = this.normalizeRange(this.value);
      if (!normValue) return null;
      return {
        ...defaults.datePickerSelectAttribute(this.selectColor),
        ...this.selectAttribute,
        dates: [normValue],
      };
    },
    attributes_() {
      const attributes = [...this.attributes];
      if (this.dragAttribute_) attributes.push(this.dragAttribute_);
      else if (this.selectAttribute_) attributes.push(this.selectAttribute_);
      if (this.disabledAttribute) attributes.push(this.disabledAttribute);
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
      // Done if date selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) return;
      // Start new drag selection if not dragging
      if (!this.dragValue) {
        // Make sure date selection is valid
        const date = new Date(day.dateTime);
        // Start new drag selection
        this.dragValue = { start: date, end: date };
      } else {
        // Construct new value
        const newValue = new DateInfo({
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(day.dateTime),
        });
        // Clear drag selection
        this.dragValue = null;
        // Signal new value selected
        this.$emit('input', newValue.toRange());
      }
    },
    enterDay(day) {
      // Make sure drag has been initialized
      if (this.dragValue) {
        // Make sure dragged value is valid
        if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) {
          // Assign disabled content hover style
          this.dayContentHoverStyle_ = this.disabledAttribute.contentHoverStyle;
        } else {
          // Update drag selection
          this.dragValue = {
            start: new Date(this.dragValue.start.getTime()),
            end: new Date(day.dateTime),
          };
          // Assign default content hover style
          this.dayContentHoverStyle_ = this.dayContentHoverStyle;
        }
      }
    },
    // Ranges can privately have end date earlier than start date
    // This function will correct the order before exposing it to to other components
    normalizeRange(range) {
      if (!rangeHasValue(range)) return null;
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
