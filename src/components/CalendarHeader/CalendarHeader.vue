<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <div
      v-if="show.prev"
      :class="['vc-arrow', 'vc-prev', { 'is-disabled': !canMovePrev }]"
      role="button"
      @click="movePrev"
      @keydown.space.enter="movePrev"
    >
      <slot name="header-left-button" :click="movePrev">
        <SvgIcon name="left-arrow" />
      </slot>
    </div>
    <div v-if="show.title" class="vc-title" v-popover="navPopoverOptions">
      <slot name="header-title">{{ page.title }}</slot>
    </div>
    <div
      v-if="show.next"
      :class="['vc-arrow', 'vc-next', { 'is-disabled': !canMoveNext }]"
      role="button"
      @click="moveNext"
      @keydown.space.enter="moveNext"
    >
      <slot name="header-right-button" :click="moveNext">
        <SvgIcon name="right-arrow" />
      </slot>
    </div>
    <div
      v-if="show.up"
      class="vc-header-move-up-button vc-up"
      :class="{ 'is-disabled': !canMoveUp }"
      role="button"
      @click.stop="moveUp"
      @keydown.space.enter="moveUp"
    >
      {{ moveUpLabel }}
      <div :class="{ 'is-disabled': !canMoveUp }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import { useCalendarContext } from '../../use/calendar';
import { popoverDirective } from '../../utils/popovers';

export default defineComponent({
  components: { SvgIcon },
  emits: ['move-prev', 'move-next'],
  directives: { popover: popoverDirective },
  props: {
    page: { type: Object, required: true },
    layout: String,
    isLg: Boolean,
    isXl: Boolean,
    is2xl: Boolean,
  },
  setup(props) {
    const {
      navPopoverId,
      navVisibility,
      canMovePrev,
      movePrev,
      canMoveNext,
      moveNext,
      canMoveUp,
      moveUpLabel,
      moveUp,
    } = useCalendarContext();
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
    const navPopoverOptions = computed(() => {
      const { page } = props;
      return {
        id: navPopoverId.value,
        visibility: navVisibility.value,
        placement: navPlacement.value,
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
        ],
        data: { page },
        isInteractive: true,
      };
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
      show,
      gridStyle,
      navPopoverOptions,
      navPlacement,
      canMovePrev,
      movePrev,
      canMoveNext,
      moveNext,
      canMoveUp,
      moveUpLabel,
      moveUp,
    };
  },
});
</script>

<style lang="css">
@import './calendar-header.css';
</style>
