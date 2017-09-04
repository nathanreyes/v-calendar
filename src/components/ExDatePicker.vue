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
    <date-picker
      :select-mode='selectMode'
      v-model='selectedValue'
      @drag='draggedValue = $event'>
    </date-picker>
  </div>
  <div v-if='selectMode === "range"'>
    <h4>Drag Value</h4>
    <pre><code>{{ JSON.stringify(draggedValue, null, 2)}}</code></pre>
  </div>
  <p>
    <h4>Value</h4>
    <pre><code>{{ JSON.stringify(selectedValue, null, 2)}}</code></pre>
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
      selectMode: 'single',
      draggedValue: null,
      selectedValue: null,
    };
  },
};
</script>

<style scoped>
code {
  padding: 10px 20px;
  min-height: 105px;
}
</style>
