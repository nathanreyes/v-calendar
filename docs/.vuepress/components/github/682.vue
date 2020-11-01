<template>
  <div>
    <v-date-picker :mode="mode" v-model="date">
      <template #footer>
        This is a test
      </template>
    </v-date-picker>
    <v-calendar>
      <template #footer>
        This is a test
      </template>
    </v-calendar>
  </div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'Date picker footer slot',
  data() {
    return {
      mode: 'time',
      date: new Date(),
    };
  },
};
</script>
