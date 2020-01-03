<template>
  <div>
    <v-date-picker v-model="date" />
  </div>
</template>

<script>
export default {
  githubTitle: ``,
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
