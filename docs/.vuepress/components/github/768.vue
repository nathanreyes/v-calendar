<template>
  <v-calendar trim-weeks />
</template>

<script>
export default {
  githubTitle: `on-bottom' class is not properly applied when using 'trim-weeks'`,
};
</script>

<style scoped>
/deep/ .on-bottom {
  background-color: red;
}
</style>
