<script>
import Calendar from './Calendar';
import { multipleHasValue, singleValuesAreEqual, multipleNormalizer } from '../utils/pickerProfiles';
import { mergeListeners } from '@/mixins';

export default {
  mixins: [mergeListeners],
  render(h) {
    return h(Calendar, {
      attrs: {
        ...this.$attrs,
        attributes: this.attributes_,
      },
      on: this.mergeListeners({
        dayclick: this.clickDay,
      }),
      slots: this.$slots,
      scopedSlots: this.$scopedSlots,
    });
  },
  components: {
    Calendar,
  },
  props: {
    value: { type: Array, default: () => [] },
    isRequired: Boolean,
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
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
  methods: {
    clickDay(day) {
      // Done if date selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) return;
      // Check if no values exist
      if (!multipleHasValue(this.value)) {
        this.$emit('input', [day.date]);
      // Check if value contains the selected date
      } else if (this.value.find(d => d.getTime() === day.dateTime)) {
        // Calculate the new dates array
        const value = this.value.filter(v => !singleValuesAreEqual(v, day.date));
        if (value.length) this.$emit('input', value);
        else if (!this.isRequired) this.$emit('input', null);
      // Append selected date
      } else {
        this.$emit('input', multipleNormalizer([...this.value, day.date]));
      }
    },
  },
};
</script>
