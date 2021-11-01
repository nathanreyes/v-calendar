<script>
import { h } from 'vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { childMixin, slotMixin } from '../../utils/mixins';
import { getDefault } from '../../utils/defaults';
import { isBoolean } from '../../utils/_';

export default {
  name: 'CalendarPane',
  emits: [
    'update:page',
    'update:week',
    'update:days',
    'weeknumberclick',
    'move-prev',
    'move-next',
  ],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    // Header
    const header =
      this.safeSlot('header', this.page) ||
      // Default header
      h(CalendarHeader, {
        page: this.page,
        title: this.page.title,
        titlePosition: this.titlePosition,
        navVisibility: this.navVisibility,
        canMovePrev: this.canMovePrev,
        canMoveNext: this.canMoveNext,
        onMovePrev: this.onMovePrev,
        onMoveNext: this.onMoveNext,
      });

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
      return this.page.weeks.map(week => {
        let cells = [];
        if (this.showWeeknumbers_) {
          cells.push(getWeeknumberCell(week.weeknumber));
        }
        cells = cells.concat(
          week.days.map(day =>
            h(
              CalendarDay,
              {
                ...this.$attrs,
                day,
              },
              this.$slots,
            ),
          ),
        );
        return h(
          'div',
          { key: `weeknumber-${week.weeknumber}`, class: 'vc-week' },
          cells,
        );
      });
    };

    // Weeks
    const weeks = h(
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
    row: Number,
    rowFromEnd: Number,
    column: Number,
    columnFromEnd: Number,
    titlePosition: String,
    navVisibility: {
      type: String,
      default: getDefault('navVisibility'),
    },
    canMovePrev: Boolean,
    canMoveNext: Boolean,
    showWeeknumbers: [Boolean, String],
    showIsoWeeknumbers: [Boolean, String],
  },
  data() {
    return {
      weekTransition: '',
    };
  },
  computed: {
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
    weekdayLabels() {
      return this.page.weeks[0].days.map(d => {
        return this.format(d.date, this.masks.weekdays);
      });
      // return this.locale
      //   .getWeekdayDates()
      //   .map(d => this.format(d, this.masks.weekdays));
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
  },
  methods: {
    onMovePrev() {
      this.$emit('move-prev');
    },
    onMoveNext() {
      this.$emit('move-next');
    },
  },
};
</script>

<style lang="css">
@import './calendar-pane.css';
</style>
