<template>
  <div><v-calendar :nav-shortcuts="navShortcuts" /></div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'Add option to display year/month-picker as simple html list ',
  data() {
    return {
      navShortcuts: [{ month: 3, year: 2001 }],
    };
  },
};
</script>