<script setup>
import { ref } from 'vue';

const date = ref(null);
const rules = ref({
  hours: [2, 4, 7, 10, 14, 15, 16],
  minutes: { interval: 2 },
  milliseconds: 0,
})

function clearDate() {
  date.value = null;
}
</script>

# Date Time Range Picker With Rules

<Example class="space-y-2 mt-4">
  <div>{{ date ? date.toISOString() : 'Empty' }}</div>
  <div class="flex">
    <button class="px-2 py-1 bg-gray-100 rounded" @click="clearDate">
      Clear
    </button>
  </div>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" is-range />
</Example>