<script>
import Calendar from './Calendar';
import {
  multipleHasValue,
  singleValuesAreEqual,
  multipleNormalizer,
} from '../utils/pickerProfiles';

export default {
  render(h) {
    return h(Calendar, {
      attrs: {
        ...this.$attrs,
        attributes: this.attributes_,
      },
      on: {
        ...this.$listeners,
        dayclick: this.onDayClick,
      },
      slots: this.$slots,
      scopedSlots: this.$scopedSlots,
    });
  },
  props: {
    initialValue: { type: Array, default: () => [] },
    isRequired: Boolean,
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
  },
  data() {
    return {
      value: this.initialValue,
    };
  },
  computed: {
    selectAttribute_() {
      if (!multipleHasValue(this.value)) return null;
      return {
        ...this.selectAttribute,
        dates: this.value,
      };
    },
    attributes_() {
      const attributes = [...(this.attributes || [])];
      if (this.selectAttribute_) attributes.push(this.selectAttribute_);
      if (this.disabledAttribute) attributes.push(this.disabledAttribute);
      return attributes;
    },
  },
  watch: {
    value() {
      this.$emit('input', this.value);
    },
  },
  methods: {
    onDayClick(day) {
      // Done if date selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day))
        return;
      // Check if no values exist
      if (!multipleHasValue(this.value)) {
        this.value = [day.date];
        // Check if value contains the selected date
      } else if (this.value.find(d => d.getTime() === day.dateTime)) {
        // Calculate the new dates array
        const value = this.value.filter(
          v => !singleValuesAreEqual(v, day.date),
        );
        if (value.length) {
          this.value = value;
        } else if (!this.isRequired) {
          this.value = null;
        }
      } else {
        // Append selected date
        this.value = multipleNormalizer([...this.value, day.date]);
      }
      // Re-emit event
      this.$emit('dayclick', day);
    },
  },
};
</script>
