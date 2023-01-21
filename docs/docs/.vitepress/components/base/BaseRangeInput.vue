<template>
  <div class="flex justify-center items-center">
    <BaseInput :value="inputValue.start" v-on="inputEvents.start" />
    <IconArrowRight />
    <BaseInput :value="inputValue.end" v-on="inputEvents.end" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    inputValue: Object,
    inputEvents: Object,
  },
};
</script>
