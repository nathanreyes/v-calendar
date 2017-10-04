<template>
<section id='datepicker' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Date Picker</h3>
    <div class='columns is-centered'>
      <div class='column is-one-half'>
        <b-tabs>
          <!--DatePicker Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Uses native calendar to support all native props and events</li>
                <li>3 date selection modes: Single Date, Multiple Dates and Date Range</li>
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
              <b-switch v-model='isPopover'>Popover</b-switch>
            </b-field>
            <div v-if='isPopover'>
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
      <div class='column is-one-half is-example'>
        <ex-date-picker
          :select-mode='selectMode'
          :show-disabled-dates='showDisabledDates'
          :is-popover='isPopover'
          :popover-direction='popoverDirection'
          :popover-align='popoverAlignment'>
        </ex-date-picker>
      </div>
    </div>
  </div>
</section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
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
      isPopover: false,
      popoverDirection: 'bottom',
      popoverDirections: ['bottom', 'top', 'left', 'right'],
      popoverAlignment: 'left',
      popoverAlignments: ['left', 'right', 'top', 'bottom'],
    };
  },
};
</script>
