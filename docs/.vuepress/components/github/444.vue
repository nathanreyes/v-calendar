<template>
  <div>
    <v-date-picker v-model="date" />
  </div>
</template>

<script>
export default {
  githubTitle: `disable date-picker is not using readonly now`,
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
