<template>
  <v-date-picker v-model="value" locale="hu" />
</template>

<script>
export default {
  githubTitle: `Title mask doesn't work from config`,
  data() {
    return {
      value: null,
      masks: {
        title: 'MM YYYY',
      },
    };
  },
};
</script>
