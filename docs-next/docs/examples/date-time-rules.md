<script setup>
  import { ref } from 'vue';
  const date = ref(new Date(2000, 0, 15));
  const minDate = ref(new Date(2000, 0, 5));
  const rules = {
    hours: 3,
    minutes: { interval: 5 },
    seconds: 4,
    milliseconds: 500,
  }
</script>

# Date Time Picker With Rules

<div class="example space-y-2 mt-4">
  <div>{{ date.toISOString() }}</div>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</div>

```vue
<script setup>
  import { ref } from 'vue';
  const date = ref(new Date(2000, 0, 15));
  const rules = {
    hours: 3,
    minutes: { interval: 5 },
    seconds: 4,
    milliseconds: 500,
  }
</script>
```