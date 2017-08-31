<template>
<div>
  <div class='block is-centered'>
    <b-field>
      <b-radio-button v-model='selectMode' native-value='single'>Single Date</b-radio-button>
      <b-radio-button v-model='selectMode' native-value='multiple'>Multiple Dates</b-radio-button>
      <b-radio-button v-model='selectMode' native-value='range'>Date Range</b-radio-button>
    </b-field>
  </div>
  <div class='block center-container'>
    <date-picker :select-mode='selectMode' v-model='selectedDate'>
    </date-picker>
  </div>
  <p>
    <h4>Value</h4>
    <pre><code>{{ JSON.stringify(selectedDate, null, 2)}}</code></pre>
  </p>
</div>
</template>

<script>
import DatePicker from './DatePicker';

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      selectMode: 'range',
      selectedDate: null,
    };
  },
};
</script>
