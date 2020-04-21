<template>
  <div>
    <v-date-picker :mode="mode" v-model="selectedDate" locale="es-MX" />
  </div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'Error: Invalid Date in fecha.format',
  data() {
    return {
      mode: 'single',
      selectedDate: null,
    };
  },
};
</script>