<template>
  <v-date-picker v-model="range" @drag="dragRange = $event" is-range />
</template>

<script>
export default {
  githubTitle: 'Update the model on partial result on range selection',
  data() {
    return {
      range: null,
      dragRange: null,
    };
  },
  watch: {
    dragRange(range) {
      console.log(JSON.stringify(range));
    },
  },
};
</script>
