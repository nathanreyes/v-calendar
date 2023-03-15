<template>
  <Example centered>
    <DateDisplay mode="dateTime" v-model.range="range" :timezone="timezone">
      <template #header>
        <TimezonePicker v-model="timezone" />
      </template>
    </DateDisplay>
  </Example>
</template>

<script setup>
import { ref } from 'vue';

const timezone = ref('UTC');
const range = ref({
  start: new Date(Date.UTC(2020, 0, 6)),
  end: new Date(Date.UTC(2020, 0, 10)),
});
</script>
