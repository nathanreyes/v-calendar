<template>
  <div class="example">
    <v-calendar :attributes="attributes"></v-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributes: [
        {
          bar({ isHovered }) {
            return {
              backgroundColor: 'black',
              opacity: isHovered ? 0.5 : 1,
            };
          },
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
