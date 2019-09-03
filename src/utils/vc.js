import { mapValues, defaults as _defaults } from '@/utils/_';

export const createVC = (Vue, defaults) =>
  new Vue({
    data() {
      return {
        defaults,
        popovers: {},
      };
    },
    computed: {
      theme() {
        return this.defaults.theme;
      },
      locales() {
        return mapValues(this.defaults.locales, v => {
          v.masks = _defaults(v.masks, this.defaults.masks);
          return v;
        });
      },
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
        _defaults(popover, existingPopover);
        popover.next = () => {
          if (!existingPopover || ref !== existingPopover.ref) {
            Vue.set(this.popovers, id, {
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
        _defaults(popover, this.popovers[id]);
        popover.next = () => {
          if (!ref || ref === this.popovers[id].ref) {
            Vue.set(this.popovers, id, {});
          }
        };
        this.handleStateTimer(popover, 'hide');
      },
      updatePopover(popover) {
        const { id, ref } = popover;
        _defaults(popover, this.popovers[id]);
        if (!ref || ref === this.popovers[id].ref) {
          Vue.set(this.popovers, id, popover);
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
          Vue.set(this.popovers, state.id, {
            ...state,
            timer: setTimeout(state.next, state.delay),
          });
        }
      },
    },
  });
