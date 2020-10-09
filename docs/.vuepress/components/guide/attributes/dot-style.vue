<template>
  <v-calendar :attributes="attributes" />
</template>

<script>
export default {
  data() {
    return {
      attributes: [
        { dot: { style: { backgroundColor: 'brown' } }, dates: new Date() },
      ],
    };
  },
};
</script>