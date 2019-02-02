<template>
  <div class="example">
    <div class="mb-4 w-full">
      <h3 class="text-sm text-left text-grey-darker font-medium mb-2">Popover Visibility</h3>

      <input type="radio" id="visible" value="visible" v-model="popoverVisibility">
      <label for="visible">Visible</label>
      <input type="radio" id="hover" value="hover" v-model="popoverVisibility" class="ml-2">
      <label for="hover">Hover</label>
      <input type="radio" id="focus" value="focus" v-model="popoverVisibility" class="ml-2">
      <label for="focus">Focus</label>
      <input type="radio" id="hidden" value="hidden" v-model="popoverVisibility" class="ml-2">
      <label for="hidden">Hidden</label>
    </div>
    <!-- <div class="mb-4 w-full">
      <h3 class="text-sm text-left text-grey-darker font-medium mb-2">Popover Direction</h3>
      <input type="radio" id="bottom" value="bottom" v-model="popoverDirection">
      <label for="bottom">Bottom</label>
      <input type="radio" id="top" value="top" v-model="popoverDirection" class="ml-2">
      <label for="top">Top</label>
      <input type="radio" id="left" value="left" v-model="popoverDirection" class="ml-2">
      <label for="left">Left</label>
      <input type="radio" id="right" value="right" v-model="popoverDirection" class="ml-2">
      <label for="right">Right</label>
    </div>-->
    <v-date-picker
      v-model="date"
      mode="range"
      :popover-visibility="popoverVisibility"
      show-caps
      is-inline
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: {
        start: new Date(2019, 0, 1),
        end: new Date(2019, 0, 15),
      },
      popoverVisibility: 'visible',
    };
  },
  computed: {
    selectAttribute() {
      return {
        popover: {
          direction: this.popoverDirection,
          visibility: this.popoverVisibility,
        },
      };
    },
  },
};
</script>
