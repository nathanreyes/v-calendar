<template>
  <div class="example">
    <v-calendar :show-weeknumbers="option" />
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: String,
      default: 'left',
    },
  },
};
</script>
