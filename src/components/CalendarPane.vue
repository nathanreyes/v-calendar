<script>
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import CalendarNav from './CalendarNav';
import CalendarDay from './CalendarDay';
import Grid from './Grid';
import {
  propOrDefaultMixin,
  childMixin,
  safeScopedSlotMixin,
} from '@/utils/mixins';
import { createGuid } from '@/utils/helpers';

export default {
  name: 'CalendarPane',
  mixins: [propOrDefaultMixin, childMixin, safeScopedSlotMixin],
  render(h) {
    // Header
    const header =
      this.safeScopedSlot('header', this.page) ||
      h(
        'div',
        {
          class: ['vc-header', this.theme.header],
        },
        [
          // Header title
          h(
            'div',
            {
              class: `vc-title-layout align-${this.titlePosition}`,
            },
            [
              h('div', { class: 'vc-title-wrapper' }, [
                // Navigation popover ref with title
                h(
                  PopoverRef,
                  {
                    props: {
                      id: this.navPopoverId,
                      visibility: this.navVisibility_,
                      placement: this.navPlacement,
                      modifiers: { flip: { behavior: ['bottom'] } },
                      isInteractive: true,
                    },
                  },
                  [
                    // Title content
                    h('div', { class: ['vc-title', this.theme.title] }, [
                      this.safeScopedSlot(
                        'header-title',
                        this.page,
                        this.page.title,
                      ),
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
                      },
                      on: {
                        input: $event => this.move($event),
                      },
                      scopedSlots: this.$scopedSlots,
                    }),
                  ],
                ),
              ]),
            ],
          ),
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
          disableFocus: true,
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
        ...this.page.days.map(day =>
          h(CalendarDay, {
            attrs: {
              ...this.$attrs,
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
    page: Object,
    titlePosition: String,
    navVisibility: String,
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
    weekdayLabels() {
      return this.locale
        .getWeekdayDates()
        .map(d => this.format(d, this.masks.weekdays));
    },
  },
  methods: {
    move(page) {
      this.$emit('update:page', page);
    },
    refresh() {
      this.$refs.days.forEach(d => d.refresh());
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-pane {
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
  &.align-left {
    justify-content: flex-start;
  }
  &.align-right {
    justify-content: flex-end;
  }
}

.vc-title-wrapper {
  position: relative;
}

.vc-title {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  padding: var(--title-padding);
}

.vc-weekday {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: var(--weekday-padding);
  cursor: default;
  user-select: none;
}

.vc-weeks {
  flex-shrink: 1;
  flex-grow: 1;
  padding: var(--weeks-padding);
}
</style>
