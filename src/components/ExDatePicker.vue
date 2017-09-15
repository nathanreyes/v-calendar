<template>
<div>
  <b-field grouped>
    <p class='control'>
      <b-radio v-model='selectMode' native-value='single'>Single</b-radio>
      <b-radio v-model='selectMode' native-value='multiple'>Multiple</b-radio>
      <b-radio v-model='selectMode' native-value='range'>Range</b-radio>
    </p>
    <p class='control'>
      <b-switch v-model='isPopover'>Popover</b-switch>
    </p>
  </b-field>
  <b-field>
    <date-picker
      :select-mode='selectMode'
      :is-popover='isPopover'
      :day-content-style='{ borderRadius: "5px" }'
      inputClass='input'
      v-model='selectedValue'
      is-double-paned>
    </date-picker>
  </b-field>
</div>
</template>

<script>
import DatePicker from './lib/DatePicker';

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      isPopover: false,
      isDoublePaned: true,
      selectMode: 'range',
      selectedValue: null,
    };
  },
};
</script>
