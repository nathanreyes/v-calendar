<template>
<section id='datepicker' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Popover</h3>
    <div class='columns is-desktop'>
      <div class='column'>
        <b-tabs>
          <!--DatePicker Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <p>
                The <code>v-popover</code> component is utilized for the navigation panel in <code>v-calendar</code> and for the default case of <code>v-date-picker</code> when <code>is-inline</code> prop is <code>false</code>.
              </p>
              <p>
                Some of the features is provides include:
              </p>
              <ul>
                <li>Custom slots for trigger and content elements</li>
                <li>Supports multiple direction and alignment combinations</li>
                <li>Control visibility manually or automatically based on hover or focus states</li>
                <li>Set delay in milliseconds for popover content appearance and disappearance</li>
                <li>Custom styling for popover content wrapper</li>
              </ul>
            </div>
          </b-tab-item>
          <!--Popover Example Code-->
          <b-tab-item label='Example Code'>
            <code-block :code='exPopoverCode'></code-block>
          </b-tab-item>
          <!--Popover Example Options-->
          <b-tab-item label='Options' icon='gear'>
            <b-field label='Visibility'>
              <p class='control'>
                <b-radio
                  v-for='v in visibilities'
                  :key='v'
                  :native-value='v'
                  v-model='visibility'>
                  {{ v }}
                </b-radio>
              </p>
            </b-field>
            <b-field label='Direction'>
              <p class='control'>
                <b-radio
                  v-for='d in directions'
                  :key='d'
                  :native-value='d'
                  v-model='direction'>
                  {{ d }}
                </b-radio>
              </p>
            </b-field>
            <b-field label='Alignment'>
              <p class='control'>
                <b-radio
                  v-for='a in alignments'
                  :key='a'
                  :native-value='a'
                  v-model='alignment'>
                  {{ a }}
                </b-radio>
              </p>
            </b-field>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column'>
        <div class='example-container'>
          <ex-popover
            :visibility='visibility'
            :direction='direction'
            :align='alignment'>
          </ex-popover>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExPopover from '../examples/ExPopover';
import ExPopoverCode from '!!raw-loader!../examples/ExPopover';

export default {
  components: {
    ExPopover,
  },
  data() {
    return {
      exPopoverCode: ExPopoverCode,
      isInline: false,
      visibility: 'visible',
      visibilities: ['hover', 'focus', 'visible', 'hidden'],
      direction: 'bottom',
      directions: ['bottom', 'top', 'left', 'right'],
      alignment: 'left',
      selectColor: '#66b3cc',
      dragColor: '#9fcfdf',
    };
  },
  computed: {
    alignments() {
      switch (this.direction) {
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
    alignments(val) {
      if (val && val.length) {
        if (!this.alignment || !val.includes(this.alignment)) {
          this.alignment = val[0];
        }
      }
    },
  },
};
</script>

<style lang='sass' scoped>
  .control
    margin-left: 20px
</style>
