<template>
  <v-date-picker v-model="date" :attributes="attrs" mode="range" />
</template>

<script>
export default {
  githubTitle: 'Dragging over highlighted days in range mode',
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
