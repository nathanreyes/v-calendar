<template>
  <div>
    <input
      class="vc-numberpicker__input"
      type="number"
      :value="value"
      v-bind="$attrs"
      v-on="listeners"
    >
    <ul
      v-show="dropdown"
      class="vc-numberpicker__dropdown"
    >
      <li
        v-for="(option, i) in options"
        :key="i"
        :class="{ selected: value === option }"
        :ref=" value === option ? 'selected' : null"
        class="vc-numberpicker__option"
        @click="clickOption(option)"
      >{{ option }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NumberPicker',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dropdown: false,
    };
  },
  computed: {
    options() {
      const count = this.max - this.min + 1;
      return Array.from(new Array(count), (val, index) => index + this.min);
    },
    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit('input', event.target.value);
        },
        click: event => {
          this.dropdown = true;
          this.$nextTick(() => {
            this.$refs.selected[0].scrollIntoView();
          });
        },
        keydown: event => {
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault();
              this.$emit('input', (this.value + 1) > this.max ? this.max : this.value + 1);
              break;
            case 'ArrowUp':
              event.preventDefault();
              this.$emit('input', (this.value - 1) < this.min ? this.min : this.value - 1);
              break;
            case 'Enter':
              event.preventDefault();
              this.dropdown = false;
              break;
            default:
              if(isNaN(event.key)) break;
              event.preventDefault();
              let inputNumber = parseInt(this.value + event.key, 10);
              if (inputNumber > this.max) {
                inputNumber = this.max;
              } else if (inputNumber < this.min) {
                inputNumber = this.min;
              }
              this.$emit('input', inputNumber);
              break;
          }
          this.$nextTick(() => {
            this.$refs.selected[0].scrollIntoView();
          });
        }
      };
    },
  },
  methods: {
    clickOption(option) {
      this.$emit('input', option);
      this.dropdown = false;
    },
    handleClickOutside(event) {
      if(!this.$el.contains(event.target)) {
        this.dropdown = false;
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);

    this.$once('hook:beforeDestroy', function () {
      document.removeEventListener("click", this.handleClickOutside);
    });
  },
}
</script>

<style lang="sass" scoped>
@import '../styles/vars.sass'

.vc-numberpicker__input
  width: $numberpicker-width
  border-radius: $numberpicker-border-radius
  border: solid 1px
  padding: $numberpicker-padding
  font-size: $text-base

.vc-numberpicker__dropdown
  border-radius: $numberpicker-border-radius
  border: solid 1px
  padding: 0
  margin: 2px 0 0 0
  height: 120px
  width: $numberpicker-width
  overflow: auto

.vc-numberpicker__option
  list-style: none
  text-align: left
  padding: $numberpicker-padding
  cursor: pointer
  &.selected
    background-color: hsla(211, 13%, 65%, 0.4)
  &:hover
    background-color: hsla(211, 13%, 65%, 0.2)
</style>
