<template>
  <div class='dp-container'>
    <component
      :is='datePicker'
      :value='value'
      :drag-value.sync='dragValue_'
      :drag-highlight='dragHighlight'
      :select-highlight='selectHighlight'
      :page.sync='fromPage'
      :min-page='minPage'
      :max-page='maxFromPage'
      v-bind='$attrs'
      v-on='$listeners'>
    </component>
    <component
      v-if='isDoublePaned'
      :is='datePicker'
      :value='value'
      :drag-value.sync='dragValue_'
      :drag-highlight='dragHighlight'
      :select-highlight='selectHighlight'
      :page.sync='toPage'
      :min-page='minToPage'
      :max-page='maxPage'
      class='dp-panel-right'
      v-bind='$attrs'
      v-on='$listeners'>
    </component>
  </div>
</template>

<script>
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';
import {
  todayComps,
  getDateComps,
  getPrevPage,
  getNextPage,
  getMaxPage,
  getPageBetweenPages,
  getFirstValidPage,
  getFirstArrayItem,
  getLastArrayItem,
} from './utils';

const _dragHighlight = {
  backgroundColor: '#c1d6d7',
  color: '#103456',
  height: '26px',
};

const _selectHighlight = {
  backgroundColor: '#74a4a4',
  borderWidth: '1px',
  borderColor: '#65999a',
  color: '#fafafa',
};

export default {
  components: {
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    page: Object,
    minPage: Object,
    maxPage: Object,
    value: null,
    selectMode: { type: String, default: 'single' },
    dragHighlight: { type: Object, default: () => _dragHighlight },
    selectHighlight: { type: Object, default: () => _selectHighlight },
    isDoublePaned: Boolean,
  },
  data() {
    return {
      fromPage: null,
      toPage: null,
      dragValue_: null,
    };
  },
  computed: {
    datePicker() {
      switch (this.selectMode) {
        case 'single':
          return 'single-date-picker';
        case 'multiple':
          return 'multiple-date-picker';
        case 'range':
          return 'date-range-picker';
        default:
          return '';
      }
    },
    maxFromPage() {
      if (!this.isDoublePaned) return null;
      return getPrevPage(this.toPage);
    },
    minToPage() {
      if (!this.isDoublePaned) return null;
      return getNextPage(this.fromPage);
    },
  },
  watch: {
    page() {
      this.fromPage = this.getFromPage();
      this.toPage = this.getToPage();
    },
    fromPage(value) {
      this.$emit('update:page', value);
    },
    selectMode() {
      // Clear value on select mode change
      this.$emit('input', null);
      // Recalculate to page
      this.toPage = this.getToPage();
    },
    isDoublePaned() {
      // Recalculate to page
      this.toPage = this.getToPage();
    },
  },
  created() {
    this.fromPage = this.getFromPage();
    this.toPage = this.getToPage();
  },
  methods: {
    getFromPage() {
      if (this.page) return this.getValidFromPage(this.page);
      if (!this.value) return this.getValidFromPage(todayComps);
      switch (this.selectMode) {
        case 'single':
          return this.getValidFromPage(getDateComps(this.value), todayComps);
        case 'multiple':
          return this.getValidFromPage(getDateComps(getFirstArrayItem(this.value), todayComps));
        case 'range':
          return this.getValidFromPage(getDateComps(this.value.start), todayComps);
        default:
          return this.getValidFromPage(todayComps);
      }
    },
    getValidFromPage(...args) {
      return getFirstValidPage(
        ...args.map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.minPage,
        getPrevPage(this.maxPage),
      );
    },
    getToPage() {
      const nextPage = getNextPage(this.fromPage);
      if (!this.value) return this.getValidToPage(nextPage);
      switch (this.selectMode) {
        case 'multiple':
          return this.getValidToPage(getMaxPage(getDateComps(getLastArrayItem(this.value)), nextPage));
        case 'range':
          return this.getValidToPage(getMaxPage(getDateComps(this.value.end), nextPage));
        default:
          return this.getValidToPage(nextPage);
      }
    },
    getValidToPage(...args) {
      return getFirstValidPage(
        ...args.map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.maxPage,
        getNextPage(this.minPage),
      );
    },
  },
};
</script>

<style lang='sass'>

.dp-container
  display: flex

.dp-panel-right
  margin-left: -1px

</style>
