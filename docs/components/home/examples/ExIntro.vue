<template>
<v-calendar
  :is-double-paned='isDoublePaned'
  :is-expanded='isExpanded'
  :title-position='titlePosition'
  :title-transition='titleTransition'
  :weeks-transition='weeksTransition'
  >
</v-calendar>
</template>

<script>
export default {
  props: {
    isDoublePaned: { type: Boolean, default: true },
    isExpanded: { type: Boolean, default: false },
    titlePosition: { type: String, default: 'center' },
    titleTransition: { type: String, default: 'slide-h' },
    weeksTransition: { type: String, default: 'slide-h' },
  },
};
</script>
