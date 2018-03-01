<script>
import CalendarPane from './CalendarPane';
import Tag from './Tag';
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
} from '../utils/helpers';
import '../styles/lib.sass';

export default {
  mixins: [mergeListeners],
  render(h) {
    const getPaneComponent = position => h(CalendarPane, {
      attrs: {
        ...this.$attrs,
        position,
        page: position < 2 ? this.fromPage_ : this.toPage_,
        minPage: position < 2 ? this.minPage : this.minToPage,
        maxPage: position < 2 ? this.maxFromPage : this.maxPage,
        styles: this.themeStyles_,
        attributes: this.attributes_,
      },
      on: this.mergeListeners({
        titleclick: this.titleClick,
        'update:page': (val) => {
          if (position < 2) this.fromPage_ = val;
          else this.toPage_ = val;
        },
      }),
      slots: this.$slots,
      scopedSlots: this.$scopedSlots,
    });
    return h('div', {
      class: {
        'c-pane-container': true,
        'is-double-paned': this.isDoublePaned_,
        'is-expanded': this.isExpanded,
      },
      style: this.wrapperStyle,
    }, [
      getPaneComponent(this.isDoublePaned_ ? 1 : 0),
      this.isDoublePaned_ && getPaneComponent(2),
    ]);
  },
  name: 'VCalendar',
  components: {
    CalendarPane,
    Tag,
  },
  props: {
    minPage: Object,
    maxPage: Object,
    fromPage: Object,
    toPage: Object,
    isDoublePaned: Boolean,
    isExpanded: Boolean,
    paneWidth: { type: Number, default: defaults.paneWidth },
    themeStyles: Object,
    attributes: Array,
  },
  data() {
    return {
      windowWidth: 0,
      fromPage_: null,
      toPage_: null,
    };
  },
  computed: {
    isDoublePaned_() {
      return this.isDoublePaned && this.windowWidth >= ((2 * this.paneWidth) + 30);
    },
    paneCentered() {
      return this.isDoublePaned && !this.isDoublePaned_;
    },
    maxFromPage() {
      if (this.isDoublePaned_) return getPrevPage(this.maxPage);
      return this.maxPage;
    },
    minToPage() {
      if (this.isDoublePaned_) return getNextPage(this.minPage);
      return null;
    },
    themeStyles_() {
      return {
        ...defaults.themeStyles,
        ...this.themeStyles,
      };
    },
    wrapperStyle() {
      const minWidth = `${this.isDoublePaned_ ? this.paneWidth * 2 : this.paneWidth}px`;
      return {
        ...this.themeStyles_.wrapper,
        minWidth,
      };
    },
    attributes_() {
      return AttributeStore(this.attributes);
    },
  },
  watch: {
    fromPage() {
      this.refreshFromPage();
    },
    toPage() {
      this.refreshToPage();
    },
    fromPage_(val) {
      this.$emit('update:frompage', val);
      this.$emit('update:fromPage', val);
      if (!pageIsBeforePage(val, this.toPage_)) {
        this.toPage_ = getNextPage(val);
      }
    },
    toPage_(val) {
      this.$emit('update:topage', val);
      this.$emit('update:toPage', val);
      if (this.isDoublePaned_ && !pageIsAfterPage(val, this.fromPage_)) {
        this.fromPage_ = getPrevPage(val);
      }
    },
    isDoublePaned_() {
      this.refreshToPage();
    },
  },
  created() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.refreshFromPage();
    this.refreshToPage();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    refreshFromPage() {
      this.fromPage_ = getFirstValidPage(
        ...[
          this.fromPage,
          { month: todayComps.month, year: todayComps.year },
        ].map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.minPage,
        getPrevPage(this.maxPage),
      );
    },
    refreshToPage() {
      this.toPage_ = getFirstValidPage(
        ...[
          this.toPage,
          getNextPage(this.fromPage_),
        ].map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.maxPage,
        getNextPage(this.minPage),
      );
    },
    titleClick(page) {
      if (pageIsEqualToPage(page, todayComps)) return;
      if (page.position < 2) {
        this.fromPage_ = getFirstValidPage(todayComps, pageIsBeforePage(page, todayComps) ? this.maxFromPage : this.minPage);
      } else {
        this.toPage_ = getFirstValidPage(todayComps, pageIsBeforePage(page, todayComps) ? this.maxPage : this.minToPage);
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
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
  min-width: $pane-width
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  &.is-double-paned
    min-width: $pane-width * 2
  &.is-expanded
    width: 100%

.c-pane-divider
  width: 1px
  border: 1px inset
  border-color: $pane-border-color

</style>
