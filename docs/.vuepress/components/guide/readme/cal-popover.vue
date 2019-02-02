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
          highlight: {
            backgroundColor: '#ff8080',
            // Other properties are available too, like `height` & `borderRadius`
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa',
          },
          popover: {
            label: "You just hovered over today's date!",
            isInteractive: true,
          },
          dates: new Date(),
        },
      ],
    };
  },
};
</script>