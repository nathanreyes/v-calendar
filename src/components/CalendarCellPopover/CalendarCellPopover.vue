<template>
  <Popover :id="popoverId" @after-hide="onAfterHide" ref="popoverRef">
    <CalendarCellEdit v-if="cell" :cell="cell" v-bind="$attrs" @close="hide" />
  </Popover>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs } from 'vue';
import Popover from '../Popover/Popover.vue';
import CalendarCellEdit from '../CalendarCellEdit/CalendarCellEdit.vue';
import { CellContext as Cell } from '../../use/calendarCell';
import {
  PopoverOptions,
  showPopover,
  hidePopover,
  updatePopover,
} from '../../utils/popovers';

interface State {
  cell: Cell | null;
}

export default defineComponent({
  name: 'CalendarCellPopover',
  components: { Popover, CalendarCellEdit },
  inheritAttrs: false,
  props: {
    popoverId: { type: String, default: 'vc-grid-popover' },
  },
  setup(props) {
    const popoverRef = ref(null);
    const state = reactive<State>({
      cell: null,
    });

    const popoverOptions = computed<Partial<PopoverOptions>>(() => ({
      id: props.popoverId,
      placement: 'right',
    }));

    function show(cell: Cell) {
      state.cell = cell;
      showPopover({
        ...popoverOptions.value,
        refSelector: cell.refSelector,
      });
    }

    function update(cell: Cell) {
      cell.editing = false;
      state.cell = cell;
      updatePopover({
        ...popoverOptions.value,
        refSelector: cell.refSelector,
      });
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
      show,
      update,
      hide,
      isVisible,
      onAfterHide() {
        state.cell = null;
      },
    };
  },
});
</script>
