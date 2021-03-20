<template>
  <v-calendar ref="calendar" />
</template>

<script>
export default {
  githubTitle: 'Light calendar with light popover',
  mounted() {
    const el = this.$el.querySelector('.vc-popover-content-wrapper');
    if (el) {
      el.classList.add('vc-is-dark');
      console.log(JSON.stringify(el.classList));
    }
  },
};
</script>
