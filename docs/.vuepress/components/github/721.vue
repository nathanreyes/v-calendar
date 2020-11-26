<template>
  <div>
    <v-date-picker v-model="date" :max-date="maxDate" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Weird max-date prop behavour?',
  data() {
    return {
      date: null,
      maxDate: new Date(),
    };
  },
};
</script>
