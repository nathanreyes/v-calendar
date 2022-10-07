<template>
  <Popover
    :id="popoverId"
    :class="[`vc-${theme.color}`, `vc-${theme.displayMode}`]"
    @after-hide="onAfterHide"
    ref="popoverRef"
  >
    <CalendarEventEdit
      v-if="event"
      :event="event"
      v-bind="$attrs"
      @close="hide"
    />
  </Popover>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs } from 'vue';
import Popover from '../Popover/Popover.vue';
import CalendarEventEdit from '../CalendarEventEdit/CalendarEventEdit.vue';
import { useCalendar } from '../../use/calendar';
import { Event } from '../../utils/calendar/event';
import { PopoverOptions, showPopover, hidePopover } from '../../utils/popovers';

interface State {
  event: Event | null;
}

export default defineComponent({
  name: 'CalendarCellPopover',
  components: { Popover, CalendarEventEdit },
  inheritAttrs: false,
  props: {
    popoverId: { type: String, default: 'vc-grid-popover' },
  },
  setup(props) {
    const popoverRef = ref(null);
    const state = reactive<State>({
      event: null,
    });
    const { theme } = useCalendar();

    const popoverOptions = computed<Partial<PopoverOptions>>(() => ({
      id: props.popoverId,
      placement: 'right',
    }));

    function show(event: Event) {
      state.event = event;
      showPopover({
        ...popoverOptions.value,
        target: event.refSelector,
      });
    }

    function update(event: Event) {
      event.editing = false;
      state.event = event;
    }

    function hide() {
      hidePopover({
        ...popoverOptions.value,
      });
    }

    function isVisible() {
      return !!popoverRef.value && (popoverRef.value as any).isVisible;
    }

    return {
      popoverRef,
      ...toRefs(state),
      theme,
      show,
      update,
      hide,
      isVisible,
      onAfterHide() {
        state.event = null;
      },
    };
  },
});
</script>
