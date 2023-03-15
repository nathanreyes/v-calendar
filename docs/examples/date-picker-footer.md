# Footer content

## Select today button

<Example centered>
  <DateTodayButton />
</Example>

```vue
<template>
  <VDatePicker v-model="date" color="indigo">
    <template #footer>
      <div class="w-full px-3 pb-3">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
          @click="setToday"
        >
          Today
        </button>
      </div>
    </template>
  </VDatePicker>
</template>
<script setup>
import { ref } from 'vue';
const date = ref(new Date());
function setToday() {
  date.value = new Date();
}
</script>
```