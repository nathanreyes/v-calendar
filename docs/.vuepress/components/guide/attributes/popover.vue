<template>
  <div class="example">
    <v-calendar :attributes="attrs"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: true,
          popover: {
            label: "You just hovered over today's date!",
          },
          dates: new Date(),
        },
      ],
    };
  },
};
</script>