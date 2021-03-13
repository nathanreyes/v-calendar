<template>
  <div class="example">
    <v-calendar
      :show-weeknumbers="!iso && option"
      :show-iso-weeknumbers="iso && option"
      :first-day-of-week="iso ? 2 : undefined"
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
