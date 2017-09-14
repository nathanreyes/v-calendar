<template>
<div>
  <b-field>
    <b-radio v-model='selectMode' native-value='single'>Single</b-radio>
    <b-radio v-model='selectMode' native-value='multiple'>Multiple</b-radio>
    <b-radio v-model='selectMode' native-value='range'>Range</b-radio>
  </b-field>
  <b-field>
    <b-switch v-model='isDoublePaned'>Double-Paned</b-switch>
    <b-switch v-model='isPopover'>Popover</b-switch>
  </b-field>
  <b-field>
    <date-picker
      :select-mode='selectMode'
      :is-double-paned='isDoublePaned'
      :is-popover='isPopover'
      :day-content-style='{ borderRadius: "5px" }'
      inputClass='input'
      v-model='selectedValue'
      @drag='draggedValue = $event'>
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
