<script>
import { h } from 'vue';
import Popover from '../Popover/Popover.vue';
import CalendarNav from '../CalendarNav/CalendarNav.vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import Grid from '../Grid/Grid.vue';
import { childMixin, slotMixin } from '../../utils/mixins';
import { getPopoverTriggerEvents } from '../../utils/popovers';
import { createGuid } from '../../utils/helpers';

export default {
  name: 'CalendarPane',
  emits: ['update:page'],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    // Header
    const header =
      this.safeSlot('header', this.page) ||
      h('div', { class: 'vc-header' }, [
        // Header title
        h(
          'div',
          {
            class: `vc-title-layout align-${this.titlePosition}`,
          },
          [
            h('div', { class: 'vc-title-wrapper' }, [
              // Title content
              h(
                'div',
                {
                  class: 'vc-title',
                  ...this.navPopoverEvents,
                },
                [this.safeSlot('header-title', this.page, this.page.title)],
              ),
              // Navigation popover
              h(
                Popover,
                {
                  id: this.navPopoverId,
                  contentClass: 'vc-nav-popover-container',
                },
                {
                  // Navigation pane
                  default: () =>
                    h(
                      CalendarNav,
                      {
                        value: this.page,
                        validator: this.canMove,
                        onInput: $event => this.move($event),
                      },
                      {
                        ...this.$slots,
                      },
                    ),
                },
              ),
            ]),
          ],
        ),
      ]);

    // Weekdays
    const weekdays = h(
      Grid,
      {
        class: 'vc-weekdays',
        items: this.weekdayLabels,
        rows: 1,
        columns: 7,
        columnWidth: '1fr',
        disableFocus: true,
      },
      {
        cell: ({ item: wl }) =>
          h(
            'div',
            {
              key: wl,
              class: 'vc-weekday',
            },
            [wl],
          ),
      },
    );

    // Weeks
    const weeks = h(
      Grid,
      {
        class: 'vc-days',
        items: this.page.days,
        rows: this.page.weeks,
        columns: 7,
        columnWidth: '1fr',
        disableFocus: true,
      },
      {
        cell: ({ item: day }) =>
          h(CalendarDay, {
            ...this.$attrs,
            day,
            slots: this.$slots,
          }),
      },
    );

    return h(
      'div',
      {
        class: 'vc-pane',
        ref: 'pane',
      },
      [header, h('div', { class: 'vc-weeks' }, [weekdays, weeks])],
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
    navPopoverEvents() {
      return getPopoverTriggerEvents({
        id: this.navPopoverId,
        visibility: this.navVisibility_,
        placement: this.navPlacement,
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
        ],
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
  methods: {
    move(page) {
      this.$emit('update:page', page);
    },
  },
};
</script>

<style lang="css">
@import './calendar-pane.css';
</style>
