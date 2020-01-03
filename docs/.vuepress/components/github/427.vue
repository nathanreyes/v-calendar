<template>
  <div class="relative overflow-hidden">
    <span class="inline-block text-sm font-semibold ml-2 mb-1">Hi</span>
    <v-date-picker mode="range" v-model="from" :popover="popoverFocus" />
    <span class="inline-block text-sm font-semibold ml-2 mt-3 mb-1">Kevin</span>
    <v-date-picker v-model="to" :popover="popoverHoverFocus" />
    <span class="inline-block text-sm font-semibold ml-2 mt-3 mb-1">How</span>
    <v-date-picker v-model="to" :popover="popoverFocus" />
    <span class="inline-block text-sm font-semibold ml-2 mt-3 mb-1">Are</span>
    <v-date-picker v-model="to" :popover="popoverHoverFocus" />
    <span class="inline-block text-sm font-semibold ml-2 mt-3 mb-1">You</span>
    <v-date-picker v-model="to" :popover="popoverFocus" />
    <span class="inline-block text-sm font-semibold ml-2 mt-12 mb-1"
      >Today</span
    >
    <v-date-picker v-model="to" :popover="popoverHoverFocus" />
  </div>
</template>

<script>
export default {
  githubTitle: 'How do I access `popover` API in `v-datepicker`?',
  data() {
    return {
      from: null,
      to: null,
      popoverFocus: {
        visibility: 'focus',
        positionFixed: true,
      },
      popoverHoverFocus: {
        visibility: 'hover-focus',
        positionFixed: true,
      },
    };
  },
};
</script>