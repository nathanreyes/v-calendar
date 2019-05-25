<template>
  <v-date-picker v-model="date" :attributes="attrs" mode="range" />
</template>

<script>
export default {
  data() {
    return {
      date: null,
      attrs: [
        {
          key: 1,
          highlight: true,
          dates: [new Date()],
        },
      ],
    };
  },
};
</script>
