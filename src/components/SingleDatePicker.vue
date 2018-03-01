<script>
import Calendar from './Calendar';
import { singleHasValue, singleValuesAreEqual } from '../utils/pickerProfiles';
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
    value: { type: Date, default: null },
    isRequired: Boolean,
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
  },
  computed: {
    selectAttribute_() {
      if (!singleHasValue(this.value)) return null;
      return {
        ...this.selectAttribute,
        dates: [this.value],
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
      // Done if day selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) {
        this.$emit('invalid-input', {
          reason: 'disabled',
          value: day.date,
        });
        return;
      }
      // Check if selected date was reselected
      if (singleValuesAreEqual(day.date, this.value)) {
        // Reset value to null if allowed
        if (!this.isRequired) this.$emit('input', null);
      } else {
        // Set value to selected date
        this.$emit('input', day.date);
      }
    },
  },
};
</script>
