<script>
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import CalendarNav from './CalendarNav';
import CalendarDay from './CalendarDay';
import Grid from './Grid';
import { getCalendarDays } from '@/utils/dayData';
import { propOrDefaultMixin, childMixin } from '@/utils/mixins';
import { createGuid } from '@/utils/helpers';

export default {
  mixins: [propOrDefaultMixin, childMixin],
  render(h) {
    // Header
    const header = this.$scopedSlots.header
      ? this.$scopedSlots.header(this.page)
      : h(
          'div',
          {
            class: ['vc-header', this.theme.header],
          },
          [
            // Header title
            h('div', { class: ['vc-title-layout', this.titleClass] }, [
              h('div', { class: 'vc-title-wrapper' }, [
                // Navigation popover ref with title
                h(
                  PopoverRef,
                  {
                    props: {
                      id: this.navPopoverId,
                      visibility: this.navVisibility_,
                      isInteractive: true,
                    },
                  },
                  [
                    // Title content
                    h('div', { class: ['vc-title', this.theme.title] }, [
                      this.$scopedSlots['header-title']
                        ? this.$scopedSlots['header-title'](this.page)
                        : this.page.title,
                    ]),
                  ],
                ),
                // Navigation popover
                h(
                  Popover,
                  {
                    props: {
                      id: this.navPopoverId,
                      contentClass: this.theme.navPopoverContainer,
                    },
                  },
                  [
                    // Navigation pane
                    h(CalendarNav, {
                      props: {
                        value: this.page,
                        validator: this.canMove,
                        masks: this.masks,
                      },
                      on: {
                        input: $event => this.move($event),
                      },
                      scopedSlots: this.$scopedSlots,
                    }),
                  ],
                ),
              ]),
            ]),
          ],
        );

    // Weeks
    const weeks = h(
      Grid,
      {
        class: 'vc-weeks',
        props: {
          rows: 7,
          columns: 7,
          columnWidth: '1fr',
        },
      },
      [
        ...this.weekdayLabels.map((wl, i) =>
          h(
            'div',
            {
              key: i + 1,
              class: ['vc-weekday', this.theme.weekdays],
            },
            [wl],
          ),
        ),
        ...getCalendarDays(this.page).map(day =>
          h(CalendarDay, {
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
      ],
    );

    return h(
      'div',
      {
        class: 'vc-pane',
        ref: 'pane',
      },
      [header, weeks],
    );
  },
  props: {
    position: { type: Number, default: 1 },
    page: Object,
    minPage: Object,
    maxPage: Object,
    titlePosition: String,
    navVisibility: String,
    firstDayOfWeek: Number,
    canMove: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      navPopoverId: createGuid(),
    };
  },
  computed: {
    titlePosition_() {
      return this.propOrDefault('titlePosition', 'titlePosition');
    },
    navVisibility_() {
      return this.propOrDefault('navVisibility', 'navVisibility');
    },
    firstDayOfWeek_() {
      return this.propOrDefault('firstDayOfWeek', 'firstDayOfWeek');
    },
    navSlots() {
      return ['nav-left-button', 'nav-right-button'].filter(
        slot => this.$scopedSlots[slot],
      );
    },
    weekdayLabels() {
      return this.locale
        .getWeekdayDates({
          firstDayOfWeek: this.locale.firstDayOfWeek,
        })
        .map(d => this.format(d, this.masks.weekdays));
    },
    titleClass() {
      return this.titlePosition_ ? `align-${this.titlePosition_}` : '';
    },
  },
  methods: {
    move(page) {
      this.$emit('update:page', page);
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-pane {
  --header-padding: 10px;
  --weekday-padding: 0 8px 2px 8px;
  --weeks-padding: 5px 8px 7px 8px;

  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.vc-horizontal-divider {
  align-self: center;
}

.vc-header {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  user-select: none;
  padding: var(--header-padding);
  &.align-left {
    order: -1;
    justify-content: flex-start;
  }
  &.align-right {
    order: 1;
    justify-content: flex-end;
  }
}

.vc-title-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.vc-title-wrapper {
  position: relative;
}

.vc-title {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.vc-weekdays {
  flex-shrink: 0;
  display: flex;
  padding: var(--weekday-padding);
}

.vc-weekday {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  cursor: default;
  user-select: none;
}

.vc-weeks {
  flex-shrink: 1;
  flex-grow: 1;
  padding: var(--weeks-padding);
}
</style>
