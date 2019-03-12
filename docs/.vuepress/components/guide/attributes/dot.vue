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
          dot: true,
          dates: new Date(),
        },
      ],
    };
  },
};
</script>