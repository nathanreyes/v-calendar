<template>
  <v-calendar :attributes="attrs" />
</template>

<script>
export default {
  githubTitle: `contentStyle not working since 1.0.x`,
  data() {
    return {
      attrs: [
        {
          // highlight: {
          //   contentStyle: {
          //     fontWeight: '700',
          //     fontSize: '.9rem',
          //     color: 'red',
          //   },
          // },
          content: {
            style: {
              fontWeight: '700',
              fontSize: '.9rem',
              color: 'red',
            },
          },
          dates: { start: new Date(), end: new Date(2020, 9, 30) },
          popover: {
            label: 'Today',
          },
        },
      ],
    };
  },
};
</script>
