<template>
<section id='datepicker' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Date Picker</h3>
    <div class='columns is-centered'>
      <div class='column is-one-half'>
        <b-tabs>
          <!--DatePicker Overview-->
          <b-tab-item label='Overview'>
            <p class='subtitle'>
              A <i>v-date-picker</i> is just a <i>v-calendar</i> wrapper.
            </p>
            <p class='content'>
              It supports all native calendar features, but also applies a special highlight for the date selection.
            </p>
            <p class='content'>
              Supported selection modes include...
              <ul>
                <li>Single date</li>
                <li>Multiple dates</li>
                <li>Date range</li>
              </ul>
            </p>
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
              <b-switch v-model='isPopover'>Popover</b-switch>
            </b-field>
            <b-field label='Value'>
              <pre><code class='html'>{{ JSON.stringify(selectedValue, null, 2) }}</code></pre>
            </b-field>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column is-one-half is-example'>
        <ex-date-picker
          :is-popover='isPopover'
          :select-mode='selectMode'
          @input='selectedValue=$event'>
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
import ExDatePicker from './ExDatePicker';
import ExDatePickerCode from '!!raw-loader!./ExDatePicker';

export default {
  components: {
    ExDatePicker,
  },
  data() {
    return {
      exDatePickerCode: ExDatePickerCode,
      isPopover: false,
      selectMode: 'range',
      selectedValue: null,
    };
  },
};
</script>
