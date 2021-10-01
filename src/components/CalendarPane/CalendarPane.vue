<script>
import { h } from 'vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import CustomTransition from '../CustomTransition/CustomTransition.vue';
import { childMixin, slotMixin } from '../../utils/mixins';
import { getPopoverTriggerEvents } from '../../utils/popovers';
import { getDefault } from '../../utils/defaults';
import { isBoolean, pick } from '../../utils/_';

export default {
  name: 'CalendarPane',
  emits: ['update:page', 'update:week', 'update:days', 'weeknumberclick'],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    // Header
    const header =
      this.safeSlot('header', this.page) ||
      // Default header
      h('div', { class: `vc-header vc-align-${this.titlePosition}` }, [
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
    const getWeekdayCells = h(
      'div',
      { class: 'vc-weekdays' },
      this.weekdayLabels.map((wl, i) =>
        h(
          'div',
          {
            key: i + 1,
            class: 'vc-weekday',
          },
          [wl],
        ),
      ),
    );

    // Weeknumber cell
    const getWeeknumberCell = weeknumber =>
      h(
        'div',
        {
          class: ['vc-weeknumber', `is-${this.showWeeknumbers_}`],
        },
        [
          h(
            'span',
            {
              class: ['vc-weeknumber-content'],
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
    const getDayCells = () => {
      const daysGroupedByWeek = this.page.days.reduce((result, day) => {
        const weeknumber = day[this.weeknumberKey];
        if (this.isWeekly && weeknumber !== this.weeknumber) return result;
        let days = result[weeknumber];
        if (!days) {
          days = [];
          result[weeknumber] = days;
        }
        days.push(day);
        return result;
      }, {});

      const dayCells = Object.entries(daysGroupedByWeek).reduce(
        (result, [weeknumber, days]) => {
          const cells = [];
          if (this.showWeeknumbers_) cells.push(getWeeknumberCell(weeknumber));
          days.forEach(day => {
            cells.push(
              h(
                CalendarDay,
                {
                  ...this.$attrs,
                  day,
                },
                this.$slots,
              ),
            );
          });
          result.push(
            h(
              'div',
              { key: `weeknumber-${weeknumber}`, class: 'vc-week' },
              cells,
            ),
          );
          return result;
        },
        [],
      );

      return h(
        CustomTransition,
        { name: 'slide-fade' },
        {
          default: () => {
            return h('div', dayCells);
          },
        },
      );
    };

    // Weeks
    const weeks =
      this.safeSlot('week', this.slotProps) ||
      h(
        'div',
        {
          class: {
            'vc-weeks': true,
            [`vc-show-weeknumbers-${this.showWeeknumbers_}`]: this
              .showWeeknumbers_,
          },
        },
        [getWeekdayCells, getDayCells()],
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
    isWeekly: Boolean,
    week: Number,
    titlePosition: String,
    navVisibility: {
      type: String,
      default: getDefault('navVisibility'),
    },
    showWeeknumbers: [Boolean, String],
    showIsoWeeknumbers: [Boolean, String],
  },
  data() {
    return {
      weekTransition: '',
    };
  },
  computed: {
    slotProps() {
      return pick(this, [
        'page',
        'position',
        'row',
        'rowFromEnd',
        'column',
        'columnFromEnd',
        'week',
        'days',
        'locale',
      ]);
    },
    weeknumber() {
      if (this.week) {
        const day = this.page.days.find(d => d.week === this.week && d.inMonth);
        return day.weeknumber;
      }
      const day = this.page.days.find(d => d.inMonth);
      return day.weeknumber;
    },
    days() {
      return this.isWeekly
        ? this.page.days.filter(d => d.weeknumber === this.weeknumber)
        : this.page.days;
    },
    weeknumberKey() {
      return this.showIsoWeeknumbers ? 'isoWeeknumber' : 'weeknumber';
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
  watch: {
    week(val, oldVal) {
      let transition = '';
      if (val === oldVal + 1) {
        transition = 'slide-left';
      } else if (val === oldVal - 1) {
        transition = 'slide-right';
      }
      this.weekTransition = transition;
      this.$emit('update:week', val);
    },
    days: {
      immediate: true,
      handler(val) {
        this.$emit('update:days', val);
      },
    },
  },
};
</script>

<style lang="css">
@import './calendar-pane.css';
</style>
