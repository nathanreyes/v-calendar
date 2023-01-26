---
title: Date Picker | Custom Attributes
---

# Custom Attributes

`VDatePicker` uses the following props to display date selections:

## Select Attribute

| Attribute | Description |
| --------- | ----------- |
| `select-attribute` | Attribute used to represent the selected value. |
| `drag-attribute` | Attribute used to represent the dragged value. Valid only when `mode === "range"`. |

To customize these attributes, we just need to provide our own custom attributes objects. Any attributes we provide will replace the default ones.

For example, we can use a `dot` instead of a `highlight` to denote the selected date. All we would need to do is pass a new `select-attribute`:

<Example centered>
  <DateSelectAttribute />
</Example>

```vue
<template>
  <VDatePicker v-model="date" :select-attribute="selectAttribute" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const selectAttribute = ref({ dot: true });
</script>
```

## Selection Popover

Finally, let's customize the `select-attribute` and `drag-attribute` to add a popover as the user is selecting a new range.

To accomplish this, we also need to include the `day-popover` slot, and configure the `popover` in the attribute.

We'll first try to display the dragged range, then fall back to the selected range.

<Example centered>
  <DateRangePopover />
</Example>

```vue
<template>
  <VDatePicker
    v-model.range="range"
    :select-attribute="selectDragAttribute"
    :drag-attribute="selectDragAttribute"
    @drag="dragValue = $event"
  >
    <template #day-popover="{ format }">
      <div class="text-sm">
        {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
        -
        {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
      </div>
    </template>
  </VDatePicker>
</template>

<script setup>
import { ref, computed } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
const dragValue = ref(null);
const selectDragAttribute = computed(() => ({
  popover: {
    visibility: 'hover',
    isInteractive: false,
  },
}));
</script>
```