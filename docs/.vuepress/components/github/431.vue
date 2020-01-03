<template>
  <div>
    <v-calendar :attributes="attrs" />
  </div>
</template>

<script>
export default {
  githubTitle:
    'Cannot read property `isComplex` of null when setting `end` to null',
  data() {
    return {
      attrs: [
        {
          highlight: true,
          dates: {
            start: new Date(),
            end: null,
          },
        },
      ],
    };
  },
};
</script>