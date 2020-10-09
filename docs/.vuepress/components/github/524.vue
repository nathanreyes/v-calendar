<template>
  <div>
    <v-date-picker :mode="mode" v-model="selectedDate" nav-visibility="hover" />
  </div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'navVisibility works in defaults but not as prop',
  data() {
    return {
      mode: 'single',
      selectedDate: null,
    };
  },
};
</script>
