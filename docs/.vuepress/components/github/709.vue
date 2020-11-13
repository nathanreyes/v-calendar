<template>
  <div>
    <v-calendar :attributes="attributes" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Highlight style rectangles with v2?',
  data() {
    return {
      attributes: [
        {
          highlight: {
            fillMode: 'outline',
            style: {
              backgroundColor: 'red',
            },
          },
          dates: new Date(),
        },
        {
          highlight: {
            style: {
              backgroundColor: 'blue',
            },
          },
          dates: [
            {
              start: new Date(2020, 10, 23),
              end: new Date(2020, 10, 27),
            },
          ],
        },
      ],
    };
  },
};
</script>
