<template>
  <div>
    <v-date-picker :mode="mode" v-model="selectedDate" />
  </div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'Safari height rendering issues',
  data() {
    return {
      mode: 'single',
      selectedDate: null,
    };
  },
};
</script>
