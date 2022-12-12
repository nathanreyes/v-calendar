<script lang="ts">
import { h, reactive } from 'vue';
import Popover from '../Popover/Popover.vue';
import Calendar from '../Calendar/Calendar.vue';
import TimePicker from '../TimePicker/TimePicker.vue';
import { propsDef, emits, createDatePicker } from '../../use/datePicker';
import { omit } from '../../utils/helpers';

export default {
  name: 'DatePicker',
  inheritAttrs: false,
  emits,
  // @ts-ignore
  props: propsDef,
  setup(props, ctx) {
    // @ts-ignore
    const datePicker = createDatePicker(props, ctx);
    const { slots, attrs } = ctx;
    const {
      isTime,
      isDateTime,
      theme,
      dateParts,
      datePickerPopoverId,
      attributes,
      calendarRef,
      popoverRef,
      showCalendar,
      onDayClick: onDayclick,
      onDayMouseEnter: onDaymouseenter,
      onDayKeydown: onDaykeydown,
      onPopoverBeforeShow,
      onPopoverAfterShow,
      onPopoverBeforeHide,
      onPopoverAfterHide,
    } = datePicker;

    const slotCtx = reactive(
      omit(datePicker, 'modelConfig', 'calendarRef', 'popoverRef'),
    );

    // Timepicker renderer
    const timePicker = () => {
      if (!dateParts.value) return null;
      return dateParts.value.map((_, i) => h(TimePicker, { position: i }));
    };

    // Calendar renderer
    const calendar = () => {
      if (!dateParts.value) return null;
      return h(
        Calendar,
        {
          ...attrs,
          attributes: attributes.value,
          ref: calendarRef,
          onDayclick,
          onDaymouseenter,
          onDaykeydown,
        },
        {
          ...slots,
          footer: isDateTime.value ? timePicker : slots.footer,
        },
      );
    };

    // Content renderer
    const content = () => {
      if (isTime.value) {
        return h(
          'div',
          {
            class: `vc-container vc-bordered vc${theme.color} vc-${theme.displayMode}`,
          },
          [timePicker()],
        );
      }
      if (showCalendar.value) {
        return calendar();
      }
      return undefined;
    };

    // Return content for no popover
    if (!slots.default) return content;

    // Return popover with nested content
    return () => [
      // Popover trigger
      slots.default!(slotCtx),
      // Popover content
      h(
        Popover,
        {
          id: datePickerPopoverId.value,
          placement: 'bottom-start',
          class: `vc-date-picker-content vc-${theme.color} vc-${theme.displayMode}`,
          ref: popoverRef,
          'onBefore-show': onPopoverBeforeShow,
          'onAfter-show': onPopoverAfterShow,
          'onBefore-hide': onPopoverBeforeHide,
          'onAfter-hide': onPopoverAfterHide,
        },
        {
          default: content,
        },
      ),
    ];
  },
};
</script>
