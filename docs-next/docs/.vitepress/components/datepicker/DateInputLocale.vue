<template>
  <DateDisplay v-model="date" :locale="locale" show-input />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const locale = ref(null);

// Fetch user's locale using custom API (eg. 'en-ZA')
locale.value = 'en-ZA'; // await api.getUserLocale();
</script>
