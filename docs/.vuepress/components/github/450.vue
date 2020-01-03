<template>
  <div><v-date-picker v-model="date" mode="range" is-dark /></div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'v-date-picker is-dark turns the field dark as well',
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>