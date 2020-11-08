<template>
  <div class="example">
    <v-calendar :title-position="titlePosition" />
  </div>
</template>

<script>
export default {
  props: {
    titlePosition: String,
  },
};
</script>
