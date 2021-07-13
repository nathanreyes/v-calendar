<script>
import Popover from './Popover';
import { rootMixin } from '../utils/mixins';
import { createGuid, onSpaceOrEnter } from '../utils';
import SvgIcon from './SvgIcon';
import { head, last } from '../utils/_';
import { getPopoverTriggerEvents, hidePopover as hp, showPopover as sp, togglePopover as tp } from '../utils/popovers';

const _yearGroupCount = 12;

export default {
  name: 'YearPicker',
  render(h) {
    // Content renderer
    const content = () => h(
      'div',
      {
        class: [
          'vc-container',
          `vc-${this.$theme.color}`,
          { 'vc-is-dark': this.$theme.isDark },
        ],
        style: {
          border: 0
        },
      },
      [
        h(
          'div',
          {
            class: 'vc-nav-container',
          },
          [
            h('div', { class: 'vc-nav-header' }, [
              h('span', {
                role: 'button',
                class: ['vc-nav-arrow', 'is-left', { 'is-disabled': !this.prevItemsEnabled }],
                tabindex: this.prevItemsEnabled ? 0 : undefined,
                on: {
                  click: this.movePrev,
                  keydown: e => this.onSpaceOrEnter(e, this.movePrev),
                },
              }, [
                h(SvgIcon, {
                  props: {
                    name: 'left-arrow',
                  },
                  width: '20px',
                  height: '24px',
                }),
              ]),
              h(
                'span',
                {
                  class: 'vc-nav-title vc-grid-focus',
                  style: { whiteSpace: 'nowrap' },
                  tabindex: '0',
                  on: {
                    click: this.moveCurrent,
                  },
                },
                this.title,
              ),
              h('span', {
                role: 'button',
                class: ['vc-nav-arrow', 'is-right', { 'is-disabled': !this.nextItemsEnabled }],
                tabindex: this.nextItemsEnabled ? 0 : undefined,
                on: {
                  click: this.moveNext,
                  keydown: e => this.onSpaceOrEnter(e, this.moveNext),
                },
              }, [
                h(SvgIcon, {
                  props: {
                    name: 'right-arrow',
                  },
                  width: '20px',
                  height: '24px',
                }),
              ]),
            ]),
            h('div', { class: 'vc-nav-items' }, this.yearItems.map((item) => h(
              'span',
              {
                key: item.label,
                role: 'button',
                dataId: item.id,
                ariaLabel: item.ariaLabel,
                class: this.getItemClasses(item),
                tabIndex: '0',
                on: {
                  click: item.click,
                  keydown: (e) => this.onSpaceOrEnter(e, item.click)
                },
              },
              item.label,
            ))),
          ],
        ),
      ],
    );

    return (
      (this.$scopedSlots.default &&
        // Convert this span to a fragment when supported in Vue
        h('span', [
          // Slot content
          this.$scopedSlots.default(this.slotArgs),
          // Popover content
          h(Popover, {
            props: {
              id: this.datePickerPopoverId,
              placement: 'bottom-start',
              contentClass: `vc-container${this.isDark ? ' vc-is-dark' : ''}`,
            },
            on: {
              beforeShow: e => this.$emit('popoverWillShow', e),
              afterShow: e => this.$emit('popoverDidShow', e),
              beforeHide: e => this.$emit('popoverWillHide', e),
              afterHide: e => this.$emit('popoverDidHide', e),
            },
            scopedSlots: {
              default() {
                return content();
              },
            },
            ref: 'popover',
          }),
        ])) ||
      content()
    );
  },
  mixins: [rootMixin],
  props: {
    value: { type: Number },
  },
  data() {
    return {
      datePickerPopoverId: createGuid(),
      yearIndex: 0,
      yearGroupIndex: 0,
      onSpaceOrEnter,
      yearItems: [],
    };
  },
  computed: {
    prevItemsEnabled() {
      return this.getItems(this.yearGroupIndex - 1);
    },
    nextItemsEnabled() {
      return this.getItems(this.yearGroupIndex + 1);
    },
    title() {
      return `${this.firstYear} - ${this.lastYear}`;
    },
    firstYear() {
      return head(this.yearItems.map(i => i.year));
    },
    lastYear() {
      return last(this.yearItems.map(i => i.year));
    },
    popover_() {
      return this.propOrDefault('popover', 'datePicker.popover', 'merge');
    },
    slotArgs() {
      const {
        updateValue,
        showPopover,
        hidePopover,
        togglePopover,
      } = this;
      const inputValue = this.yearIndex;
      const inputEvents = {
        input: this.yearClick,
        change: this.yearClick,
        ...getPopoverTriggerEvents({
          ...this.popover_,
          id: this.datePickerPopoverId,
        }),
      };
      return {
        inputValue,
        inputEvents,
        updateValue,
        showPopover,
        hidePopover,
        togglePopover,
        getPopoverTriggerEvents,
      };
    },
  },
  watch: {
    value() {
      this.yearIndex = this.value;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val || new Date().getFullYear());
      this.yearItems = this.getItems(this.yearGroupIndex);
    },
    yearGroupIndex(val) {
      this.yearItems = this.getItems(val);
    }
  },
  created() {
  },
  mounted() {
    this.yearIndex = this.value;
  },
  methods: {
    getItems(yearGroupIndex) {
      const startYear = yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      const items = [];
      for (let year = startYear; year < endYear; year += 1) {
        items.push({
          year,
          id: year,
          label: year,
          ariaLabel: year,
          isActive: year === this.yearIndex,
          click: () => this.yearClick(year),
        });
      }
      return items;
    },
    yearClick(year) {
      this.yearIndex = year;
      this.$emit('input', year);
      this.hidePopover();
    },
    focusFirstItem() {
      this.$nextTick(() => {
        // Set focus on the first enabled nav item
        const focusableEl = this.$el.querySelector(
          '.vc-nav-item:not(.is-disabled)',
        );
        if (focusableEl) {
          focusableEl.focus();
        }
      });
    },
    movePrev() {
      if (!this.prevItemsEnabled) return;
      this.yearGroupIndex--;
    },
    moveNext() {
      if (!this.nextItemsEnabled) return;
      this.yearGroupIndex++;
    },
    moveCurrent() {
      this.yearGroupIndex = this.getYearGroupIndex(this.yearIndex);
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    getItemClasses({ isActive, isDisabled }) {
      const classes = ['vc-nav-item'];
      if (isActive) {
        classes.push('is-active');
      }

      if (isDisabled) {
        classes.push('is-disabled');
      }
      return classes;
    },
    showPopover(opts = {}) {
      sp({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId,
      });
    },
    hidePopover(opts = {}) {
      hp({
        hideDelay: 10,
        ...this.popover_,
        ...opts,
        id: this.datePickerPopoverId,
      });
    },
    togglePopover(opts) {
      tp({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId,
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.vc-nav-container {
  color: var(--gray-800);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  background-color: var(--white);
  border: 1px solid;
  border-color: var(--gray-100);
  border-radius: var(--rounded-lg);
  padding: 4px;
  box-shadow: var(--shadow);
}

.vc-nav-title {
  color: var(--gray-900);
  &:hover {
    background-color: var(--gray-200);
  }
  &:focus {
    border-color: var(--accent-400);
  }
}
.vc-nav-arrow {
  &:hover {
    background-color: var(--gray-200);
  }
  &:focus {
    border-color: var(--accent-400);
  }
}
.vc-nav-item {
  &:hover {
    color: var(--gray-900);
    background-color: var(--gray-200);
    box-shadow: none;
  }
  &.is-active {
    color: var(--white);
    background: var(--accent-500);
  }
  &.is-current {
    color: var(--accent-600);
    border-color: var(--accent-500);
  }
  &:focus {
    border-color: var(--accent-400);
  }
}
</style>
