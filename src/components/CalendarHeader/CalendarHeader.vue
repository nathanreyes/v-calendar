<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <div
      :class="['vc-arrow', 'vc-prev', { 'is-disabled': !canMovePrev }]"
      role="button"
      @click="onMovePrev"
      @keydown.space.enter="onMovePrev"
    >
      <slot name="header-left-button" :click="onMovePrev">
        <SvgIcon name="left-arrow" />
      </slot>
    </div>
    <div class="vc-title" v-on="navPopoverEvents">
      <slot name="header-title">{{ page.title }}</slot>
    </div>
    <div
      :class="['vc-arrow', 'vc-next', { 'is-disabled': !canMoveNext }]"
      role="button"
      @click="onMoveNext"
      @keydown.space.enter="onMoveNext"
    >
      <slot name="header-right-button" :click="onMoveNext">
        <SvgIcon name="right-arrow" />
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import { getDefault } from '../../utils/defaults';
import { getPopoverTriggerEvents } from '../../utils/popovers';

export default defineComponent({
  components: { SvgIcon },
  props: {
    page: Object,
    layout: String,
    navPopoverId: String,
    navVisibility: {
      type: String,
      default: getDefault('navVisibility'),
    },
    canMovePrev: { type: Boolean, default: true },
    canMoveNext: { type: Boolean, default: true },
    isLg: Boolean,
    isXl: Boolean,
    is2xl: Boolean,
  },
  setup(props, { emit }) {
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
        id: props.navPopoverId,
        visibility: props.navVisibility,
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
      if (titleLeft.value) return 't-pn';
      if (titleRight.value) return 'pn-t';
      return 'p-t-n;';
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
      gridStyle,
      navPopoverEvents,
      navPlacement,
      onMovePrev() {
        emit('move-prev');
      },
      onMoveNext() {
        emit('move-next');
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-header.css';
</style>
