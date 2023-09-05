import { type SetupContext, inject, provide } from 'vue';

type Slots = SetupContext['slots'];

function contextKey(slotKey: string) {
  return `__vc_slot_${slotKey}__`;
}

export function provideSlots(slots: Slots, remap: Record<string, string> = {}) {
  Object.keys(slots).forEach(slotKey => {
    provide(contextKey(remap[slotKey] ?? slotKey), slots[slotKey]);
  });
}

export function useSlot(slotKey: string) {
  return inject(contextKey(slotKey), null);
}
