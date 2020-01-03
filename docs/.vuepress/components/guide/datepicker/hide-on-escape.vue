<template>
  <v-date-picker
    v-model='date'>
    <input
      type='text'
      slot-scope='{ inputValue, updateValue }'
      :value='inputValue'
      @input='updateValue($event.target.value, { formatInput: false, hidePopover: false, debounce: 1200 })'
      @change='updateValue($event.target.value, { formatInput: true, hidePopover: false })'
      @keyup.esc='updateValue(date, { formatInput: true, hidePopover: true })'>
  </v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>

