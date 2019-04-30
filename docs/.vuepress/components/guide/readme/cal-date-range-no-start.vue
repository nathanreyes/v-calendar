<template>
  <div class="example">
    <v-calendar :attributes="attrs"></v-calendar>
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
          dates: [{ start: null, end: new Date() }],
        },
      ],
    };
  },
};
</script>