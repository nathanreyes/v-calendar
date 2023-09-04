import { type SetupContext, inject, provide } from 'vue';

type Slots = SetupContext['slots'];

function contextKey(slotKey: string) {
  return `__vc_slot_${slotKey}__`;
}

export function provideSlots(slots: Slots) {
  Object.keys(slots).forEach(slotKey => {
    provide(contextKey(slotKey), slots[slotKey]);
  });
}

export function useSlot(slotKey: string) {
  return inject(contextKey(slotKey), null);
}
