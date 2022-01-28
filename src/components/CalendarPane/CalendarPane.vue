<script>
import { h } from 'vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import { childMixin, slotMixin } from '../../utils/mixins';
import { getPopoverTriggerEvents } from '../../utils/popovers';
import { getDefault } from '../../utils/defaults';
import { isBoolean } from '../../utils/_';

export default {
  name: 'CalendarPane',
  emits: ['update:page', 'weeknumberclick'],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    // Header
    const header =
      this.safeSlot('header', this.page) ||
      // Default header
      h('div', { class: `vc-header align-${this.titlePosition}` }, [
        // Header title
        h(
          'div',
          {
            class: 'vc-title',
            ...this.navPopoverEvents,
          },
          [this.safeSlot('header-title', this.page, this.page.title)],
        ),
      ]);

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
              onClick: event => {
                this.$emit('weeknumberclick', {
                  weeknumber,
                  days: this.page.days.filter(
                    d => d[this.weeknumberKey] === weeknumber,
                  ),
                  event,
                });
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
      // Inset weeknumber cell on left side if needed
      if (
        (showWeeknumbersLeft && mod === 0) ||
        (showWeeknumbersRight && mod === daysInWeek)
      ) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
      dayCells.push(
        h(
          CalendarDay,
          {
            ...this.$attrs,
            day,
          },
          this.$slots,
        ),
      );
      // Insert weeknumber cell on right side if needed
      if (showWeeknumbersRight && mod === daysInWeek - 1) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
    });

    // Weeks
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
  props: {
    page: Object,
    position: Number,
    row: Number,
    rowFromEnd: Number,
    column: Number,
    columnFromEnd: Number,
    titlePosition: String,
    navVisibility: {
      type: String,
      default: () => getDefault('navVisibility'),
    },
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
      const { sharedState, navVisibility, navPlacement, page, position } = this;
      return getPopoverTriggerEvents({
        id: sharedState.navPopoverId,
        visibility: navVisibility,
        placement: navPlacement,
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
        ],
        data: { page, position },
        isInteractive: true,
        isRenderFn: true,
      });
    },
    weekdayLabels() {
      return this.locale
        .getWeekdayDates()
        .map(d => this.format(d, this.masks.weekdays));
    },
  },
};
</script>
