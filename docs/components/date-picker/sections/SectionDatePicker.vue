<template>
<section id='datepicker' class='section'>
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
        <!--DatePicker Example Options-->
        <b-tab-item label='Options' icon='gear'>
          <b-field label='Mode'>
            <p class='control-offset'>
              <b-radio v-model='mode' native-value='single'>Single</b-radio>
              <b-radio v-model='mode' native-value='multiple'>Multiple</b-radio>
              <b-radio v-model='mode' native-value='range'>Range</b-radio>
            </p>
          </b-field>
          <b-field label='Tint Color'>
            <b-input v-model='tintColor'></b-input>
          </b-field>
          <b-field>
            <b-switch v-model='showCaps'>Show Caps</b-switch>
          </b-field>
          <b-field>
            <b-switch v-model='showDayPopover'>Show Day Popover</b-switch>
          </b-field>
          <b-field>
            <b-switch v-model='showDisabledDates'>Show Disabled</b-switch>
          </b-field>
          <b-field>
            <b-switch v-model='isInline'>Inline</b-switch>
          </b-field>
          <b-field v-if='isInline'>
            <b-switch v-model='isExpanded'>Expanded</b-switch>
          </b-field>
          <b-field v-else>
            <b-switch v-model='popoverExpanded'>Popover Expanded</b-switch>
          </b-field>
          <div v-if='!isInline'>
            <b-field label='Popover Visibility'>
              <p class='control-offset'>
                <b-radio
                  v-for='v in popoverVisibilities'
                  :key='v'
                  :native-value='v'
                  v-model='popoverVisibility'>
                  {{ v }}
                </b-radio>
              </p>
            </b-field>
            <b-field label='Popover Direction'>
              <p class='control-offset'>
                <b-radio
                  v-for='d in popoverDirections'
                  :key='d'
                  :native-value='d'
                  v-model='popoverDirection'>
                  {{ d }}
                </b-radio>
              </p>
            </b-field>
            <b-field label='Popover Alignment'>
              <p class='control-offset'>
                <b-radio
                  v-for='a in popoverAlignments'
                  :key='a'
                  :native-value='a'
                  v-model='popoverAlign'>
                  {{ a }}
                </b-radio>
              </p>
            </b-field>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
    <div class='column'>
      <div :class='{ "example-container": isInline }'>
        <div class='field'>
          <label class='label'>
            Name
          </label>
          <div class='control'>
            <input class='input'>
          </div>
        </div>
        <div class='field'>
          <label class='label'>
            Birthday
          </label>
          <div class='control'>
            <v-date-picker
              ref='picker'
              class='picker'
              :from-page.sync='fromPage'
              :to-page.sync='toPage'
              :mode='mode'
              :tint-color='tintColor'
              :show-caps='showCaps'
              :show-day-popover='showDayPopover'
              :disabled-dates='showDisabledDates ? disabledDates : null'
              :attributes='[]'
              :is-inline='isInline'
              :is-expanded='isExpanded'
              :input-props='inputProps'
              :popover-expanded='popoverExpanded'
              :popover-visibility='popoverVisibility'
              :popover-direction='popoverDirection'
              :popover-align='popoverAlign'
              v-model='selectedValue'
              is-double-paned
              is-linked>
            </v-date-picker>      
          </div>
        </div>
        <div class='field'>
          <label class='label'>
            Email
          </label>
          <div class='control'>
            <input class='input' type='email'>
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {
      mode: 'single',
      selectedValue: new Date(2018, 3, 15),
      showCaps: true,
      showDayPopover: true,
      showDisabledDates: false,
      isInline: false,
      isExpanded: false,
      popoverExpanded: true,
      popoverVisibility: 'focus',
      popoverVisibilities: ['hover', 'focus', 'visible', 'hidden'],
      popoverDirection: 'bottom',
      popoverDirections: ['bottom', 'top', 'left', 'right'],
      popoverAlign: 'left',
      tintColor: '#66b3cc',
      dragValue: null,
      fromPage: null,
      toPage: null,
      disabledDates: { weekdays: [1, 7] },
      inputProps: {
        class: 'input',
      },
      // minDate: new Date(2018, 3, 1),
      // maxDate: new Date(2019, 5, 20),
    };
  },
  computed: {
    popoverAlignments() {
      switch (this.popoverDirection) {
        case 'bottom':
        case 'top':
          return ['left', 'center', 'right'];
        case 'left':
        case 'right':
          return ['top', 'middle', 'bottom'];
        default:
          return [];
      }
    },
  },
  watch: {
    popoverAlignments(val) {
      if (val && val.length) {
        if (!this.popoverAlign || !val.includes(this.popoverAlign)) {
          this.popoverAlign = val[0];
        }
      }
    },
  },
};
</script>

<style lang='sass' scoped>
  .control-offset
    margin-left: 20px
  .tip
    font-size: 0.8rem
    margin: -14px 0 10px 10px
</style>
