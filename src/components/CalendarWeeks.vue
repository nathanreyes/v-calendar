<script>
import Grid from './Grid';
import CalendarDay from './CalendarDay';
import { getCalendarDays } from '../utils/dayData';

export default {
  render(h) {
    return h(
      Grid,
      {
        class: 'c-weeks',
        props: {
          rows: 6,
          columns: 7,
          columnWidth: '1fr',
        },
      },
      this.days.map(day => h(CalendarDay, {
          attrs: {
            ...this.$attrs,
            day,
          },
          on: {
            ...this.$listeners,
          },
          scopedSlots: this.$scopedSlots,
        }),
      ),
    );
  },
  props: {
    page: Object,
    trimMaxWeek: Boolean,
  },
  computed: {
    days() {
      return getCalendarDays(this.page);
    },
  },
};
</script>
