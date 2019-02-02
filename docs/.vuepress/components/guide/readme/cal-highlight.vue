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
          dates: new Date(), // Single date or array of dates or date expressions
        },
      ],
    };
  },
};
</script>