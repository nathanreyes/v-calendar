<template>
<v-calendar
  :is-double-paned='isDoublePaned'
  :title-transition='titleTransition'
  :weeks-transition='weeksTransition'>
</v-calendar>
</template>

<script>
export default {
  props: {
    isDoublePaned: { type: Boolean, default: false },
    titleTransition: { type: String, default: 'slide' },
    weeksTransition: { type: String, default: 'slide' },
  },
};
</script>
