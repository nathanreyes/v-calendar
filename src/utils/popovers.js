// Vue won't get included in bundle as it is externalized
// https://cli.vuejs.org/guide/build-targets.html#library
import Vue from 'vue';
import { defaults } from '@/utils/_';

export function setupPopovers() {
  if (Vue.prototype.$popovers) return;
  Vue.prototype.$popovers = new Vue({
    data() {
      return {
        popovers: {},
      };
    },
    methods: {
      popoverExists(id) {
        return this.popovers && this.popovers[id];
      },
      popoverIsActive(id, ref) {
        const activeRef =
          this.popovers && this.popovers[id] && this.popovers[id].ref;
        return !!(activeRef && (!ref || ref === activeRef));
      },
      popoverHasPriority(popover) {
        const existingPopover = this.popovers[popover.id];
        if (!existingPopover || !existingPopover.priority) return true;
        return popover.priority > existingPopover.priority;
      },
      showPopover(popover) {
        if (!this.popoverHasPriority(popover)) return;
        const { id, ref } = popover;
        const existingPopover = this.popovers[id];
        defaults(popover, existingPopover);
        popover.next = () => {
          if (!existingPopover || ref !== existingPopover.ref) {
            this.$set(this.popovers, id, {
              ...popover,
              priority: 0,
            });
          }
        };
        this.handleStateTimer(popover, 'show');
      },
      hidePopover(popover) {
        if (!this.popoverHasPriority(popover)) return;
        const { id, ref } = popover;
        defaults(popover, this.popovers[id]);
        popover.next = () => {
          if (!ref || ref === this.popovers[id].ref) {
            this.$set(this.popovers, id, {});
          }
        };
        this.handleStateTimer(popover, 'hide');
      },
      updatePopover(popover) {
        const { id, ref } = popover;
        defaults(popover, this.popovers[id]);
        if (!ref || ref === this.popovers[id].ref) {
          this.$set(this.popovers, id, popover);
        }
      },
      handleStateTimer(state) {
        if (state.timer) {
          clearTimeout(state.timer);
          state.timer = undefined;
        }
        if (!state.delay) {
          state.next();
        } else {
          this.$set(this.popovers, state.id, {
            ...state,
            timer: setTimeout(state.next, state.delay),
          });
        }
      },
    },
  });
}

export const popoversMixin = {
  beforeCreate() {
    setupPopovers();
  },
  computed: {
    $popovers() {
      return Vue.prototype.$popovers;
    },
  },
};
