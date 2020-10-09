<template>
  <div class="example">
    <v-date-picker
      v-model="date"
      :disabled-dates="{ weekdays: [1, 7] }"
      :disabled-attribute="disabledAttribute"
      is-range
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      disabledAttribute: {
        contentStyle: ({ isHovered }) => ({
          color: 'red',
          textDecoration: 'line-through',
          opacity: 0.5,
          ...(isHovered && {
            cursor: 'default',
            backgroundColor: 'transparent',
          }),
        }),
      },
    };
  },
};
</script>
