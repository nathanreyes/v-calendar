<template>
<section id='setup' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Setup</h3>
    <b-message type='is-warning'>
      <a href='https://vuejs.org' target='_blank'>Vue.js</a> version <strong>2.5.0+</strong> is required.
    </b-message>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>1</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>Select method</p>
      </div>
    </article>
    <b-tabs type='is-toggle' class='offset'>
      <b-tab-item label='Use NPM'>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>2</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Install</p>
          </div>
        </article>
        <code-block lang='javascript' code='npm install v-calendar' offset></code-block>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>3</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Import into your project</p>
          </div>
        </article>
        <code-block lang='javascript' :code='importCode | pre' offset></code-block>
        <article class='media'>
          <div class='media-content'>
            <p class='title is-5'>Local Registration</p>
          </div>
        </article>
        <code-block lang='javascript' :code='localCode | pre' offset></code-block>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>4</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Reference in your component templates</p>
          </div>
        </article>
        <code-block :code='componentCode | pre' offset></code-block>
      </b-tab-item>
      <b-tab-item label='Use CDN'>
        <article class='media'>
          <div class="media-left">
            <p class="title is-5">2</p>
          </div>
          <div class="media-content">
            <p class="title is-5">Load external resources</p>
          </div>
        </article>
        <code-block :code='cdnHtml | pre' offset></code-block>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import cdnHtml from '!!raw-loader!../index-cdn.html';

export default {
  data() {
    return {
      setupOption: 'npm',
      importCode: `
        import Vue from 'vue';
        import VCalendar, { Calendar, DatePicker, Popover} from 'v-calendar';
        import 'v-calendar/lib/v-calendar.min.css';

        // Access v-calendar, v-date-packer and v-popover components
        Vue.use(VCalendar, {
          // OPTIONAL: Pass default settings here (default values shown below)
          componentPrefix: 'v',
          firstDayOfWeek: 1, // Sunday is the default
          navVisibility: 'focus',
          titlePosition: 'center',
          titleTransition: 'slide-h', // Horizontal slide
          weeksTransition: 'slide-h',
          dateFormatter: d => d.toLocaleDateString(),
          dateParser: s => new Date(Date.parse(s)),
          datePickerInputClass: '',
          datePickerInputStyle: null,
          datePickerInputPlaceholder: '',
          datePickerSelectColor: '#66B3CC',
          datePickerDragColor: '#9FCFDF', // Only used for drag mode
          datePickerShowCaps: false, // Only used for drag mode
          datePickerShowDayPopover: true,
          popoverExpanded: false,
          popoverDirection: 'bottom',
          popoverAlign: 'left',
          popoverVisibility: 'hover',
          popoverContentOffset: '10', // px
          maxSwipeTime: 300, // ms
          minHorizontalSwipeDistance: 60, // px
          maxVerticalSwipeDistance: 80, // px
          maxTapTolerance: 0, // ms
          maxTapDuration: 200, // ms
          highlight: {
            animated: true,
            height: '1.8rem',
            borderWidth: '0',
            borderStyle: 'solid',
            borderRadius: '290486px',
            opacity: 1,
          },
          highlightCaps: {
            animated: true,
            height: '1.9rem',
            borderWidth: '0',
            borderStyle: 'solid',
            borderRadius: '290486px',
            opacity: 1,
          },
          dot: {
            diameter: '5px',
            backgroundColor: '#66b3cc',
            borderWidth: '0',
            borderStyle: 'solid',
            borderRadius: '50%',
            opacity: 1,
          },
          bar: {
            height: '3px',
            backgroundColor: '#66b3cc',
            borderWidth: '0',
            borderStyle: 'solid',
            opacity: 1,
          },
          themeStyles: {
            wrapper: { backgroundColor: '#fafafa', border: '1px solid #dadada' },
            verticalDivider: { borderLeft: '1px solid #dadada' },
            // header: null,
            // headerTitle: null,
            // headerArrows: null,
            // headerVerticalDivider: null,
            // headerHorizontalDivider: null,
            // weekdays: null,
            // weekdaysVerticalDivider: null,
            // weekdaysHorizontalDivider: null,
            // weeks: null,
            // weeksVerticalDivider: null,
            // dayCell: null,
            dayCellNotInMonth: { opacity: 0.4 },
            // dayContent: null,
            // dayContentHover: null,
            // dots: null,
            // bars: null,
            dayPopoverContent: {
              color: '#333333',
              fontSize: '.8rem',
              whiteSpace: 'nowrap',
            },
          },
        });
      `,
      localCode: `
        import Vue from 'vue';
        import VCalendar, { Calendar, DatePicker, Popover} from 'v-calendar';
        import 'v-calendar/lib/v-calendar.min.css';

        new Vue({
          el: '#app'
          components: {
            'v-calendar': Calendar,
            'v-date-picker': DatePicker,
            'v-popover': Popover
          }
        });
      `,
      componentCode: `
        <template>
          <v-calendar
            is-double-paned>
          </v-calendar>
          <v-date-picker
            mode='single'
            v-model='mySelection'>
          </v-date-picker>
        </template>
      `,
      cdnHtml,
    };
  },
  computed: {
    npmSelected() {
      return this.setupOption === 'npm';
    },
    cdnSelected() {
      return this.setupOption === 'cdn';
    },
  },
};
</script>

<style lang='sass' scoped>

.offset
  margin-top: 20px

.b-tabs
  .tabs
    margin-left: 20px

</style>
