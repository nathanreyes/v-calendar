<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <div
      v-if="show.prev"
      :class="['vc-arrow', 'vc-prev', { 'is-disabled': !context.canMovePrev }]"
      role="button"
      @click="context.movePrev"
      @keydown.space.enter="context.movePrev"
    >
      <slot name="header-left-button" :click="context.movePrev">
        <SvgIcon name="left-arrow" />
      </slot>
    </div>
    <div v-if="show.title" class="vc-title" v-on="navPopoverEvents">
      <slot name="header-title">{{ page.title }}</slot>
    </div>
    <div
      v-if="show.next"
      :class="['vc-arrow', 'vc-next', { 'is-disabled': !context.canMoveNext }]"
      role="button"
      @click="context.moveNext"
      @keydown.space.enter="context.moveNext"
    >
      <slot name="header-right-button" :click="context.moveNext">
        <SvgIcon name="right-arrow" />
      </slot>
    </div>
    <div
      v-if="show.up"
      class="vc-arrow vc-up"
      :class="{ 'is-disabled': !canMoveUp }"
      role="button"
      @click="onMoveUp"
      @keydown.space.enter="onMoveUp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, inject } from 'vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import { getDefault } from '../../utils/defaults';
import { getPopoverTriggerEvents } from '../../utils/popovers';

export default defineComponent({
  components: { SvgIcon },
  emits: ['move-prev', 'move-next'],
  props: {
    page: Object,
    layout: String,
    isLg: Boolean,
    isXl: Boolean,
    is2xl: Boolean,
  },
  setup(props, { emit }) {
    const context = inject('context');
    const navPlacement = computed(() => {
      switch (props.page.titlePosition) {
        case 'left':
          return 'bottom-start';
        case 'right':
          return 'bottom-end';
        default:
          return 'bottom';
      }
    });
    const navPopoverEvents = computed(() => {
      const { page } = props;
      return getPopoverTriggerEvents({
        id: context.navPopoverId,
        visibility: context.navVisibility,
        placement: navPlacement.value,
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
        ],
        data: { page },
        isInteractive: true,
      });
    });
    const titleLeft = computed(() => props.page.titlePosition.includes('left'));
    const titleRight = computed(() =>
      props.page.titlePosition.includes('right'),
    );
    const layout_ = computed(() => {
      if (props.layout) return props.layout;
      if (titleLeft.value) return 'tu-pn';
      if (titleRight.value) return 'pn-tu';
      return 'p-tu-n;';
    });
    const canMoveUp = computed(() => {
      return context.view !== 'weekly';
    });
    const show = computed(() => {
      return {
        prev: layout_.value.includes('p'),
        title: layout_.value.includes('t'),
        next: layout_.value.includes('n'),
        up: layout_.value.includes('u') && canMoveUp.value,
      };
    });
    const gridStyle = computed(() => {
      const gridTemplateColumns = layout_.value
        .split('')
        .map(l => {
          switch (l) {
            case 'p':
              return '[prev] auto';
            case 'n':
              return '[next] auto';
            case 't':
              return '[title] auto';
            case 'u':
              return '[up] auto';
            case '-':
              return '1fr';
            default:
              return '';
          }
        })
        .join(' ');
      return { gridTemplateColumns };
    });
    return {
      context,
      show,
      gridStyle,
      navPopoverEvents,
      navPlacement,
      canMoveUp,
      onMoveUp() {
        switch (context.view) {
          case 'daily': {
            context.view = 'weekly';
            break;
          }
          case 'weekly': {
            context.view = 'monthly';
            break;
          }
        }
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-header.css';
</style>
