<template>
<section id='datepicker' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Date Picker</h3>
    <div class='columns is-desktop'>
      <div class='column'>
        <b-tabs>
          <!--DatePicker Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Wraps native calendar to support all native props and events</li>
                <li>3 date selection modes: single date, multiple dates and date range</li>
                <li>Supports disabling of specific dates or date ranges</li>
                <li>Display inline or as a popover for a custom slot</li>
              </ul>
            </div>
          </b-tab-item>
          <!--DatePicker Example Code-->
          <b-tab-item label='Example Code'>
            <pre v-highlight><code class='html'>{{ exDatePickerCode }}</code></pre>
          </b-tab-item>
          <!--DatePicker Example Options-->
          <b-tab-item label='Options' icon='gear'>
            <b-field label='Select Mode'>
              <p class='control'>
                <b-radio v-model='selectMode' native-value='single'>Single</b-radio>
                <b-radio v-model='selectMode' native-value='multiple'>Multiple</b-radio>
                <b-radio v-model='selectMode' native-value='range'>Range</b-radio>
              </p>
            </b-field>
            <b-field>
              <b-switch v-model='showDisabledDates'>Show disabled dates</b-switch>
            </b-field>
            <b-field>
              <b-switch v-model='isInline'>Inline</b-switch>
            </b-field>
            <b-field>
              <b-switch v-model='isExpanded'>Expanded</b-switch>
            </b-field>
            <div v-if='!isInline'>
              <b-field label='Popover Direction'>
                <b-select v-model='popoverDirection'>
                  <option v-for='direction in popoverDirections' :value='direction' :key='direction'>
                    {{ direction }}
                  </option>
                </b-select>
              </b-field>
              <b-field label='Popover Alignment'>
                <b-select v-model='popoverAlignment'>
                  <option v-for='alignment in popoverAlignments' :value='alignment' :key='alignment'>
                    {{ alignment }}
                  </option>
                </b-select>
              </b-field>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column'>
        <div :class='{ "example-container": isInline }'>
          <ex-date-picker
            :select-mode='selectMode'
            :show-disabled-dates='showDisabledDates'
            :is-inline='isInline'
            :is-expanded='isExpanded'
            :popover-direction='popoverDirection'
            :popover-align='popoverAlignment'>
          </ex-date-picker>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExDatePicker from '../examples/ExDatePicker';
import ExDatePickerCode from '!!raw-loader!../examples/ExDatePicker';

export default {
  components: {
    ExDatePicker,
  },
  data() {
    return {
      exDatePickerCode: ExDatePickerCode,
      selectMode: 'range',
      selectedValue: null,
      showDisabledDates: false,
      isInline: false,
      isExpanded: true,
      popoverDirection: 'bottom',
      popoverDirections: ['bottom', 'top', 'left', 'right'],
      popoverAlignment: 'left',
    };
  },
  computed: {
    popoverAlignments() {
      switch (this.popoverDirection) {
        case 'bottom':
        case 'top':
          return ['left', 'right'];
        case 'left':
        case 'right':
          return ['top', 'bottom'];
        default:
          return [];
      }
    },
  },
  watch: {
    popoverAlignments(val) {
      if (val && val.length) {
        if (!this.popoverAlignment || !val.includes(this.popoverAlignment)) {
          this.popoverAlignment = val[0];
        }
      }
    },
  },
};
</script>
