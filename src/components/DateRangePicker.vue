<script>
import Calendar from './Calendar';
import { mergeListeners } from '@/mixins';
import { rangeNormalizer } from '@/utils/pickerProfiles';

export default {
  mixins: [mergeListeners],
  render(h) {
    return h(Calendar, {
      attrs: {
        ...this.$attrs,
        attributes: this.attributes_,
        themeStyles: this.themeStyles_,
      },
      on: this.mergeListeners({
        dayclick: this.clickDay,
        daymouseenter: this.enterDay,
      }),
      slots: this.$slots,
      scopedSlots: this.$scopedSlots,
    });
  },
  components: {
    Calendar,
  },
  props: {
    value: { type: Object, default: () => {} },
    isRequired: Boolean,
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
      return (
        this.dragValue && {
          ...this.dragAttribute,
          dates: [this.dragValue],
        }
      );
    },
    selectAttribute_() {
      return (
        this.value && {
          ...this.selectAttribute,
          dates: [this.value],
        }
      );
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
        ...(this.showDisabledContent &&
          this.disabledAttribute && {
            dayContentHover: this.disabledAttribute.contentHoverStyle,
          }),
      };
    },
  },
  watch: {
    dragValue(val) {
      this.$emit('drag', rangeNormalizer(val));
    },
  },
  created() {
    // Clear drag on escape keydown
    document.addEventListener('keydown', e => {
      if (this.dragValue && e.keyCode === 27) {
        this.dragValue = null;
      }
    });
  },
  methods: {
    clickDay({ dateTime }) {
      // Start new drag selection if not dragging
      if (!this.dragValue) {
        // Update drag value if it is valid
        const newDragValue = {
          start: new Date(dateTime),
          end: new Date(dateTime),
        };
        if (this.dateIsValid(newDragValue)) {
          this.dragValue = newDragValue;
        }
      } else {
        // Update selected value if it is valid
        const newValue = rangeNormalizer({
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(dateTime),
        });
        if (this.dateIsValid(newValue)) {
          // Clear drag selection
          this.dragValue = null;
          // Signal new value selected
          this.$emit('input', newValue);
        }
      }
    },
    enterDay({ dateTime }) {
      // Make sure drag has been initialized
      if (this.dragValue) {
        // Calculate the new dragged value
        const newDragValue = {
          start: new Date(this.dragValue.start.getTime()),
          end: new Date(dateTime),
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
      return (
        !this.disabledAttribute || !this.disabledAttribute.intersectsDate(date)
      );
    },
  },
};
</script>
