<template>
<popover
  :visible='popoverVisible'
  direction='left'>
  <a
    class='button is-small is-primary'
    @click.prevent='popoverVisible = !popoverVisible'>
    <span class='icon is-small'>
      <i class='fa fa-gear'></i>
    </span>
    <span>Options...</span>
  </a>
  <div slot='popover-content'>
    <slot></slot>
  </div>
</popover>
</template>

<script>
import Popover from './lib/Popover';

export default {
  components: {
    Popover,
  },
  data() {
    return {
      popoverVisible: false,
    };
  },
};
</script>
