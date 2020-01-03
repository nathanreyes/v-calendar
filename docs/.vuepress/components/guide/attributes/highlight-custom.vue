<template>
  <div class="example">
    <v-calendar :attributes="attrs"/>
  </div>
</template>

<script>
const { pageForThisMonth } = require('@/utils/helpers');
const { month, year } = pageForThisMonth();

export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: {
            color: 'purple',
            fillMode: 'light',
            contentClass: 'italic',
          },
          dates: new Date(year, month - 1, 12),
        },
        {
          highlight: 'purple',
          fillMode: 'solid',
          dates: new Date(year, month - 1, 13),
        },
        {
          highlight: 'purple',
          fillMode: 'none',
          dates: new Date(year, month - 1, 14),
        },
      ],
    };
  },
};
</script>