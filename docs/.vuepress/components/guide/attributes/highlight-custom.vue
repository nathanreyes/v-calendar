<template>
  <div class="example">
    <v-calendar :attributes="attrs" />
  </div>
</template>

<script>
export default {
  data() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      attrs: [
        {
          key: 'today',
          highlight: {
            color: 'purple',
            fillMode: 'solid',
            contentClass: 'italic',
          },
          dates: new Date(year, month, 12),
        },
        {
          highlight: {
            color: 'purple',
            fillMode: 'light',
          },
          dates: new Date(year, month, 13),
        },
        {
          highlight: {
            color: 'purple',
            fillMode: 'outline',
          },
          dates: new Date(year, month, 14),
        },
      ],
    };
  },
};
</script>
