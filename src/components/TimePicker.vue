<template>
  <div class="vc-timepicker">
    <number-picker
      class="vc-numberpicker"
      v-model="hour_"
      min="0"
      max="23"
    />:
    <number-picker
      class="vc-numberpicker"
      v-model="minute_"
      min="0"
      max="59"
    />:
    <number-picker
      class="vc-numberpicker"
      v-model="second_"
      min="0"
      max="59"
    />
  </div>
</template>

<script>
import NumberPicker from './NumberPicker';

export default {
  name: 'TimePicker',
  components: {
    NumberPicker
  },
  props: {
    currentDate: {
      type: Date,
      default: null
    }
  },
  computed: {
    hour_: {
      get() {
        if(!this.currentDate) return 0;
        return this.currentDate.getHours();
      },
      set(val) {
        this.$emit('hourchange', val);
      }
    },
    minute_: {
      get() {
        if(!this.currentDate) return 0;
        return this.currentDate.getMinutes();
      },
      set(val) {
        this.$emit('minutechange', val);
      }
    },
    second_: {
      get() {
        if(!this.currentDate) return 0;
        return this.currentDate.getSeconds();
      },
      set(val) {
        this.$emit('secondchange', val);
      }
    }
  },
}
</script>

<style lang='sass' scoped>
.vc-timepicker
  display: flex
  justify-content: space-around

.vc-numberpicker
  max-width: 60px
</style>
