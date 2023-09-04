<template>
  <Popover
    :id="popoverId"
    :class="[`vc-${color}`, `vc-${displayMode}`]"
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
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import { useCalendar } from '../../use/calendar';
import type { Event } from '../../utils/calendar/event';
import {
  type PopoverOptions,
  hidePopover,
  showPopover,
} from '../../utils/popovers';
import Popover from '../Popover/Popover.vue';
import CalendarEventEdit from './CalendarEventEdit.vue';

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
    const state: State = reactive({
      event: null,
    });
    const { displayMode, color } = useCalendar();

    const popoverOptions = computed(
      () =>
        ({
          id: props.popoverId,
          placement: 'right',
        } as Partial<PopoverOptions>),
    );

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
      displayMode,
      color,
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
