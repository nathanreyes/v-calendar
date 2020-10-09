<template>
  <v-calendar :rows="2" :columns="2" />
</template>

<script>
export default {
  githubTitle: 'Accessibility audit',
  data() {
    return {
      date: null,
    };
  },
};
</script>
