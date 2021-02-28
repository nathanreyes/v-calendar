<template>
  <v-date-picker :attributes="attributes" v-model="date" mode="time" />
</template>

<script>
export default {
  githubTitle: 'Docs/Attributes is [object object]',
  data() {
    return {
      date: new Date(2021, 1, 14),
      attributes: [
        {
          highlight: true,
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
