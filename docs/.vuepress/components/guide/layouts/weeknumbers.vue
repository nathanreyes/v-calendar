<template>
  <div class="example">
    <v-calendar
      :show-weeknumbers="!iso && option"
      :show-iso-weeknumbers="iso && option"
    />
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: String,
      default: 'left',
    },
    iso: Boolean,
  },
};
</script>
