<template>
  <v-date-picker v-model="date" mode="datetime">
    <template #footer> This is the footer </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle: 'Footer slot not working',
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
