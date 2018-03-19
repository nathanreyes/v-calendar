<template>
<v-calendar
  :is-double-paned='isDoublePaned'
  :is-expanded='isExpanded'
  :nav-visibility='navVisibility'
  :title-position='titlePosition'
  :title-transition='titleTransition'
  :weeks-transition='weeksTransition'
  :attributes='attributes'>
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
  data() {
    return {
      attributes: [
        {
          bar({ isHovered }) {
            return {
              backgroundColor: 'black',
              opacity: (isHovered && 0.5) || 1,
            };
          },
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
