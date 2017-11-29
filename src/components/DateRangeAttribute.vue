<template>
<div class='wrapper'>
  {{ message }}
</div>
</template>

<script>
const msInDay = 1000 * 60 * 60 * 24;

export default {
  props: {
    dayInfo: Object,
  },
  computed: {
    message() {
      const dateInfo = this.dayInfo.attributes && this.dayInfo.attributes.drag && this.dayInfo.attributes.drag.dateInfo;
      return `${dateInfo ? Math.floor(((dateInfo.end - dateInfo.start) / msInDay)) + 1 : 0} Days`;
    },
  },
};
</script>

<style lang='sass' scoped>
.wrapper
  color: #333333
</style>
