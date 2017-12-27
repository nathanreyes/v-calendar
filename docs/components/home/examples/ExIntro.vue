<template>
<v-calendar
  :is-double-paned='isDoublePaned'
  :is-expanded='isExpanded'
  :nav-visibility='navVisibility'
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
    navVisibility: { type: String, default: 'focus' },
    titlePosition: { type: String, default: 'center' },
    titleTransition: { type: String, default: 'slide-h' },
    weeksTransition: { type: String, default: 'slide-h' },
  },
};
</script>
