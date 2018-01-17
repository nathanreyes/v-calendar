<template>
<calendar
  :attributes='attributes_'
  :theme-styles='themeStyles_'
  @dayselect='selectDay'
  @daymouseenter='enterDay'
  v-bind='$attrs'
  v-on='$listeners'>
</calendar> 
</template>

<script>
import Calendar from './Calendar';
import DateInfo from '../utils/dateInfo';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Object, default: () => {} },
    dragAttribute: Object,
    selectAttribute: Object,
    disabledAttribute: Object,
    themeStyles: Object,
    attributes: Array,
  },
  data() {
    return {
      dragValue: null,
      showDisabledContent: false,
    };
  },
  computed: {
    dragAttribute_() {
      return this.dragValue && {
        ...this.dragAttribute,
        dates: [this.dragValue],
      };
    },
    selectAttribute_() {
      return this.value && {
        ...this.selectAttribute,
        dates: [this.value],
      };
    },
    attributes_() {
      const attributes = [...(this.attributes || [])];
      if (this.dragAttribute_) attributes.push(this.dragAttribute_);
      else if (this.selectAttribute_) attributes.push(this.selectAttribute_);
      if (this.disabledAttribute) attributes.push(this.disabledAttribute);
      return attributes;
    },
    themeStyles_() {
      return {
        ...this.themeStyles,
        ...(this.showDisabledContent && this.disabledAttribute && {
          dayContentHover: this.disabledAttribute.contentHoverStyle,
        }),
      };
    },
  },
  watch: {
    dragValue(val) {
      this.$emit('drag', this.simplifyDate(DateInfo(val)));
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
    selectDay(day) {
      // Start new drag selection if not dragging
      if (!this.dragValue) {
        // Update drag value if it is valid
        const newDragValue = { start: new Date(day.dateTime), end: new Date(day.dateTime) };
        if (this.dateIsValid(newDragValue)) {
          this.dragValue = newDragValue;
        }
      } else {
        // Update selected value if it is valid
        const newValue = new DateInfo({
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(day.dateTime),
        });
        if (this.dateIsValid(newValue)) {
          // Clear drag selection
          this.dragValue = null;
          // Signal new value selected
          this.$emit('input', this.simplifyDate(newValue));
        }
      }
    },
    enterDay(day) {
      // Make sure drag has been initialized
      if (this.dragValue) {
        // Calculate the new dragged value
        const newDragValue = {
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(day.dateTime),
        };
        // Check if dragged value is valid
        if (this.dateIsValid(newDragValue)) {
          // Update drag selection
          this.dragValue = newDragValue;
          // Show enabled content hover style
          this.showDisabledContent = false;
        } else {
          // Show disabled content hover style
          this.showDisabledContent = true;
        }
      }
    },
    dateIsValid(date) {
      return !(this.disabledAttribute && this.disabledAttribute.intersectsDate(date));
    },
    simplifyDate(date) {
      return date && { start: date.start, end: date.end };
    },
  },
};
</script>
