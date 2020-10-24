<template>
  <div class="example">
    <v-calendar :attributes="attributes" />
  </div>
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
