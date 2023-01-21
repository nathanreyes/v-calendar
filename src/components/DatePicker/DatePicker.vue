<script lang="ts">
import { h, reactive, defineComponent } from 'vue';
import Popover from '../Popover/Popover.vue';
import Calendar from '../Calendar/Calendar.vue';
import TimePicker from '../TimePicker/TimePicker.vue';
import { propsDef, emits, createDatePicker } from '../../use/datePicker';
import { omit } from '../../utils/helpers';

export default defineComponent({
  name: 'DatePicker',
  inheritAttrs: false,
  emits,
  props: propsDef,
  setup(props, ctx) {
    const datePicker = createDatePicker(props, ctx);
    const { slots, attrs } = ctx;
    const {
      isTimeMode,
      isDateTimeMode,
      color,
      displayMode,
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

    // Expose datePicker for external access
    ctx.expose(datePicker);

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
      // Replace footer slot with timePicker if needed
      const renderSlots = isDateTimeMode.value
        ? { ...slots, footer: timePicker }
        : slots;
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
        renderSlots,
      );
    };

    // Content renderer
    const content = () => {
      if (isTimeMode.value) {
        return h(
          'div',
          {
            class: `vc-container vc-bordered vc-${color.value} vc-${displayMode.value}`,
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
          class: `vc-date-picker-content vc-${color.value} vc-${displayMode.value}`,
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
});
</script>
