<template>
  <DateDisplay v-model="date" :locale="locale">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const locale = ref(null);

// Fetch user's locale using custom API (eg. 'en-ZA')
locale.value = 'en-ZA'; // await api.getUserLocale();
</script>
