<template>
  <v-date-picker :theme-styles="themeStyles" v-model="date" />
</template>

<script>
export default {
  data() {
    return {
      date: null,
      themeStyles: {
        dayCell: ({ day }) => {
          if (!day.inMonth)
            return {
              opacity: 0.3,
              pointerEvents: 'none',
            };
        },
      },
    };
  },
};
</script>

<style scoped>
/deep/ .c-day:not(.in-month) {
  opacity: 0;
  pointer-events: none;
}
</style>
