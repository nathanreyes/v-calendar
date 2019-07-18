<template>
  <v-date-picker v-model="value" locale="hu" is-inline />
</template>

<script>
export default {
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
