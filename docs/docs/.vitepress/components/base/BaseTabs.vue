<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { type Ref, inject } from 'vue';

export function useTabs() {
  return inject<{
    selectedIndex: Ref<number>;
  }>('__tabs__')!;
}
</script>

<script setup lang="ts">
import { ref, provide, watch } from 'vue';

const props = defineProps<{ defaultIndex?: number }>();
const emit = defineEmits(['changed']);

const selectedIndex = ref(props.defaultIndex ?? 0);

defineExpose({
  selectedIndex,
});

watch(
  () => selectedIndex.value,
  val => emit('changed', val),
);

provide('__tabs__', {
  selectedIndex,
});
</script>
