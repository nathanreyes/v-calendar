<template>
<v-calendar
  :is-double-paned='isDoublePaned'
  :title-position='titlePosition'
  :title-transition='titleTransition'
  :weeks-transition='weeksTransition'>
</v-calendar>
</template>

<script>
export default {
  props: {
    isDoublePaned: { type: Boolean, default: true },
    titlePosition: { type: String, default: 'center' },
    titleTransition: { type: String, default: 'slide' },
    weeksTransition: { type: String, default: 'slide' },
  },
};
</script>
