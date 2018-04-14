<script>
import CalendarPane from './CalendarPane';
import AttributeStore from '../utils/attributeStore';
import defaults from '../utils/defaults';
import { mergeListeners } from '@/mixins';
import {
  todayComps,
  pageIsEqualToPage,
  pageIsBeforePage,
  pageIsAfterPage,
  getPrevPage,
  getNextPage,
  getPageBetweenPages,
  getFirstValidPage,
  getPageForDate,
} from '../utils/helpers';

export default {
  mixins: [mergeListeners],
  render(h) {
    const getPaneComponent = position =>
      h(CalendarPane, {
        attrs: {
          ...this.$attrs,
          position,
          page: position < 2 ? this.fromPage_ : this.toPage_,
          minPage: position < 2 ? this.minPage_ : this.minToPage,
          maxPage: position < 2 ? this.maxFromPage : this.maxPage_,
          hideRightButton:
            !this.showLinkedButtons &&
            position === 1 &&
            this.isLinked &&
            !this.isVertical,
          hideLeftButton:
            !this.showLinkedButtons &&
            position === 2 &&
            this.isLinked &&
            !this.isVertical,
          paneWidth: this.paneWidth,
          styles: this.themeStyles_,
          attributes: this.attributes_,
          formats: this.formats_,
        },
        on: this.mergeListeners({
          'update:page': val => {
            if (position < 2) this.fromPage_ = val;
            else this.toPage_ = val;
          },
        }),
        slots: this.$slots,
        scopedSlots: this.$scopedSlots,
      });
    return h(
      'div',
      {
        class: {
          'c-pane-container': true,
          'is-vertical': this.isVertical,
          'is-expanded': this.isExpanded,
        },
        style: this.wrapperStyle,
        ref: 'root',
      },
      [
        getPaneComponent(this.isDoublePaned_ ? 1 : 0),
        ...(this.isDoublePaned_ && [
          h('div', {
            class: 'c-pane-div',
            style: this.dividerStyle,
          }),
          getPaneComponent(2),
        ]),
      ],
    );
  },
  name: 'VCalendar',
  components: {
    CalendarPane,
  },
  props: {
    minDate: Date,
    maxDate: Date,
    minPage: Object,
    maxPage: Object,
    fromPage: Object,
    toPage: Object,
    showLinkedButtons: {
      type: Boolean,
      default: () => defaults.showLinkedButtons,
    },
    isDoublePaned: Boolean,
    isLinked: Boolean,
    isVertical: Boolean,
    isExpanded: Boolean,
    paneWidth: { type: Number, default: () => defaults.paneWidth },
    themeStyles: Object,
    attributes: Array,
    formats: Object,
  },
  data() {
    return {
      isConstrained: true,
      fromPage_: null,
      toPage_: null,
    };
  },
  computed: {
    isDoublePaned_() {
      return this.isDoublePaned && (this.isVertical || !this.isConstrained);
    },
    minPage_() {
      return (
        this.minPage || (this.minDate && getPageForDate(this.minDate)) || null
      );
    },
    rightButtonHidden() {
      return this.position === 1 && this.isLinked && !this.isVertical;
    },
    leftButtonHidden() {
      return this.position === 2 && this.isLinked && !this.isVertical;
    },
    maxPage_() {
      return (
        this.maxPage || (this.maxDate && getPageForDate(this.maxDate)) || null
      );
    },
    maxFromPage() {
      if (this.isDoublePaned_) return getPrevPage(this.maxPage_);
      return this.maxPage_;
    },
    minToPage() {
      if (this.isDoublePaned_) return getNextPage(this.minPage_);
      return null;
    },
    themeStyles_() {
      return {
        ...defaults.themeStyles,
        ...this.themeStyles,
      };
    },
    wrapperStyle() {
      return this.themeStyles_.wrapper;
    },
    dividerStyle() {
      return this.isVertical
        ? this.themeStyles_.horizontalDivider
        : this.themeStyles_.verticalDivider;
    },
    attributes_() {
      return AttributeStore(this.attributes);
    },
    formats_() {
      return {
        ...defaults.formats,
        ...this.formats,
      };
    },
  },
  watch: {
    fromPage() {
      this.refreshFromPage();
    },
    toPage() {
      this.refreshToPage();
    },
    fromPage_(val, oldVal) {
      if (pageIsEqualToPage(val, oldVal)) return;
      this.$emit('update:frompage', val);
      this.$emit('update:fromPage', val);
      if (!this.isDoublePaned) return;
      if (this.isLinked || !pageIsBeforePage(val, this.toPage_))
        this.toPage_ = getNextPage(val);
    },
    toPage_(val, oldVal) {
      if (pageIsEqualToPage(val, oldVal)) return;
      this.$emit('update:topage', val);
      this.$emit('update:toPage', val);
      if (!this.isDoublePaned) return;
      if (this.isLinked || !pageIsAfterPage(val, this.fromPage_))
        this.fromPage_ = getPrevPage(val);
    },
    isDoublePaned_() {
      this.refreshIsConstrained();
      this.refreshToPage();
    },
    isLinked(val) {
      if (val) this.toPage_ = getNextPage(this.fromPage_);
    },
    isExpanded() {
      this.refreshIsConstrained();
    },
  },
  created() {
    this.refreshFromPage();
    this.refreshToPage();
  },
  mounted() {
    this.$nextTick(() => {
      this.refreshIsConstrained();
      window.addEventListener('resize', this.refreshIsConstrained);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.refreshIsConstrained);
  },
  methods: {
    refreshFromPage() {
      this.fromPage_ = getFirstValidPage(
        ...[
          this.fromPage,
          { month: todayComps.month, year: todayComps.year },
        ].map(p => getPageBetweenPages(p, this.minPage_, this.maxPage_)),
        this.minPage_,
        getPrevPage(this.maxPage_),
      );
    },
    refreshToPage() {
      this.toPage_ = getFirstValidPage(
        ...[this.toPage, getNextPage(this.fromPage_)].map(p =>
          getPageBetweenPages(p, this.minPage_, this.maxPage_),
        ),
        this.maxPage_,
        getNextPage(this.minPage_),
      );
    },
    refreshIsConstrained() {
      // Get the root calendar element
      const root = this.$refs.root;
      // Only test for constrained environment if needed
      if (!window || !root || !this.isDoublePaned || this.isVertical) {
        this.isConstrained = false;
        // Test for constrained window
      } else if (window && window.innerWidth < 2 * this.paneWidth + 30) {
        this.isConstrained = true;
      } else if (this.isExpanded) {
        this.isConstrained =
          root.parentElement.offsetWidth < 2 * this.paneWidth + 2;
      } else {
        this.isConstrained = false;
      }
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

.c-pane-container
  flex-shrink: 1
  display: inline-flex
  font-family: $font-family
  font-weight: $font-weight
  line-height: 1.5
  color: $font-color
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  box-sizing: border-box
  &.is-expanded
    width: 100%
  &.is-vertical
    flex-direction: column
  /deep/ *
    box-sizing: inherit
    &:focus
      outline: none

.c-pane-divider
  width: 1px
  border: 1px inset
  border-color: $pane-border-color

</style>
