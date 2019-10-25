<template>
  <v-date-picker :max-date="maxDate" v-model="value" is-inline />
</template>

<script>
export default {
  githubTitle: 'Why max-date is adding 1 month',
  data() {
    return {
      maxDate: new Date(),
      value: new Date(2020, 0, 1),
    };
  },
};
</script>
