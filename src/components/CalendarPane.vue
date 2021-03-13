<script>
import CalendarDay from './CalendarDay';
import { childMixin, safeScopedSlotMixin } from '../utils/mixins';
import { getPopoverTriggerEvents } from '../utils/popovers';
import { isBoolean } from '../utils/_';

export default {
  name: 'CalendarPane',
  mixins: [childMixin, safeScopedSlotMixin],
  render(h) {
    // Header
    const header =
      this.safeScopedSlot('header', this.page) ||
      // Default header
      h(
        'div',
        {
          class: `vc-header align-${this.titlePosition}`,
        },
        [
          // Header title
          h(
            'div',
            {
              class: 'vc-title',
              on: this.navPopoverEvents,
            },
            [this.safeScopedSlot('header-title', this.page, this.page.title)],
          ),
        ],
      );

    // Weekday cells
    const weekdayCells = this.weekdayLabels.map((wl, i) =>
      h(
        'div',
        {
          key: i + 1,
          class: 'vc-weekday',
        },
        [wl],
      ),
    );

    const showWeeknumbersLeft = this.showWeeknumbers_.startsWith('left');
    const showWeeknumbersRight = this.showWeeknumbers_.startsWith('right');
    if (showWeeknumbersLeft) {
      weekdayCells.unshift(
        h('div', {
          class: 'vc-weekday',
        }),
      );
    } else if (showWeeknumbersRight) {
      weekdayCells.push(
        h('div', {
          class: 'vc-weekday',
        }),
      );
    }

    // Weeknumber cell
    const getWeeknumberCell = weeknumber =>
      h(
        'div',
        {
          class: ['vc-weeknumber'],
        },
        [
          h(
            'span',
            {
              class: ['vc-weeknumber-content', `is-${this.showWeeknumbers_}`],
              on: {
                click: event => {
                  this.$emit('weeknumberclick', {
                    weeknumber,
                    days: this.page.days.filter(
                      d => d[this.weeknumberKey] === weeknumber,
                    ),
                    event,
                  });
                },
              },
            },
            [weeknumber],
          ),
        ],
      );

    // Day cells
    const dayCells = [];
    const { daysInWeek } = this.locale;
    this.page.days.forEach((day, i) => {
      const mod = i % daysInWeek;
      // Insert weeknumber cell on left side if needed
      if (
        (showWeeknumbersLeft && mod === 0) ||
        (showWeeknumbersRight && mod === daysInWeek)
      ) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
      dayCells.push(
        h(CalendarDay, {
          attrs: {
            day,
          },
          on: {
            ...this.$listeners,
          },
          scopedSlots: this.$scopedSlots,
          key: day.id,
          ref: 'days',
          refInFor: true,
        }),
      );
      // Insert weeknumber cell on right side if needed
      if (showWeeknumbersRight && mod === daysInWeek - 1) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
    });

    const weeks = h(
      'div',
      {
        class: {
          'vc-weeks': true,
          'vc-show-weeknumbers': this.showWeeknumbers_,
          'is-left': showWeeknumbersLeft,
          'is-right': showWeeknumbersRight,
        },
      },
      [weekdayCells, dayCells],
    );

    return h(
      'div',
      {
        class: [
          'vc-pane',
          `row-from-end-${this.rowFromEnd}`,
          `column-from-end-${this.columnFromEnd}`,
        ],
        ref: 'pane',
      },
      [header, weeks],
    );
  },
  inheritAttrs: false,
  props: {
    page: Object,
    position: Number,
    row: Number,
    rowFromEnd: Number,
    column: Number,
    columnFromEnd: Number,
    titlePosition: String,
    navVisibility: String,
    showWeeknumbers: [Boolean, String],
    showIsoWeeknumbers: [Boolean, String],
  },
  computed: {
    weeknumberKey() {
      return this.showWeeknumbers ? 'weeknumber' : 'isoWeeknumber';
    },
    showWeeknumbers_() {
      const showWeeknumbers = this.showWeeknumbers || this.showIsoWeeknumbers;
      if (showWeeknumbers == null) return '';
      if (isBoolean(showWeeknumbers)) {
        return showWeeknumbers ? 'left' : '';
      }
      if (showWeeknumbers.startsWith('right')) {
        return this.columnFromEnd > 1 ? 'right' : showWeeknumbers;
      }
      return this.column > 1 ? 'left' : showWeeknumbers;
    },
    navVisibility_() {
      return this.propOrDefault('navVisibility', 'navVisibility');
    },
    navPlacement() {
      switch (this.titlePosition) {
        case 'left':
          return 'bottom-start';
        case 'right':
          return 'bottom-end';
        default:
          return 'bottom';
      }
    },
    navPopoverEvents() {
      const {
        sharedState,
        navVisibility_,
        navPlacement,
        page,
        position,
      } = this;
      return getPopoverTriggerEvents({
        id: sharedState.navPopoverId,
        visibility: navVisibility_,
        placement: navPlacement,
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
        ],
        data: { page, position },
        isInteractive: true,
      });
    },
    weekdayLabels() {
      return this.locale
        .getWeekdayDates()
        .map(d => this.format(d, this.masks.weekdays));
    },
  },
  methods: {
    refresh() {
      this.$refs.days.forEach(d => d.refresh());
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-pane {
  min-width: 250px;
}

.vc-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 18px 0 18px;
  &.align-left {
    justify-content: flex-start;
  }
  &.align-right {
    justify-content: flex-end;
  }
}

.vc-title {
  font-size: var(--text-lg);
  color: var(--gray-800);
  font-weight: var(--font-semibold);
  line-height: 28px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  &:hover {
    opacity: 0.75;
  }
}

.vc-weeknumber {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.vc-weeknumber-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-style: italic;
  width: 28px;
  height: 28px;
  margin-top: 2px;
  color: var(--gray-500);
  user-select: none;
  &.is-left-outside {
    position: absolute;
    left: var(--weeknumber-offset);
  }
  &.is-right-outside {
    position: absolute;
    right: var(--weeknumber-offset);
  }
}

.vc-weeks {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
  padding: 5px;
  min-width: 250px;
  &.vc-show-weeknumbers {
    grid-template-columns: auto repeat(7, 1fr);
    &.is-right {
      grid-template-columns: repeat(7, 1fr) auto;
    }
  }
}

.vc-weekday {
  text-align: center;
  color: var(--gray-500);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: 14px;
  padding-top: 4px;
  padding-bottom: 8px;
  cursor: default;
  user-select: none;
}

.vc-is-dark {
  & .vc-header {
    color: var(--gray-200);
  }
  & .vc-title {
    color: var(--gray-100);
  }
  & .vc-weekday {
    color: var(--accent-200);
  }
}
</style>

<style>
.vc-nav-popover-container {
  color: var(--white);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  background-color: var(--gray-800);
  border: 1px solid;
  border-color: var(--gray-700);
  border-radius: var(--rounded-lg);
  padding: 4px;
  box-shadow: var(--shadow);
}
.vc-is-dark .vc-nav-popover-container {
  color: var(--gray-800);
  background-color: var(--white);
  border-color: var(--gray-100);
}
</style>
