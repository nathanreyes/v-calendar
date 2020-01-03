<template>
  <div class="example">
    <div class="mb-4 w-full">
      <h3 class="text-sm text-left text-gray-700 font-medium mb-2">Popover Visibility</h3>

      <input type="radio" id="visible" value="visible" v-model="popoverVisibility">
      <label for="visible">Visible</label>
      <input type="radio" id="hover" value="hover" v-model="popoverVisibility" class="ml-2">
      <label for="hover">Hover</label>
      <input type="radio" id="focus" value="focus" v-model="popoverVisibility" class="ml-2">
      <label for="focus">Focus</label>
      <input type="radio" id="hidden" value="hidden" v-model="popoverVisibility" class="ml-2">
      <label for="hidden">Hidden</label>
    </div>
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
      popoverVisibility: 'hover',
    };
  },
  computed: {
    selectAttribute() {
      return {
        popover: {
          visibility: this.popoverVisibility,
        },
      };
    },
  },
};
</script>
