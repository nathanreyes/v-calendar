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
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
      <div class="mb-4">
        <v-date-picker v-model="date" mode="multiple" :popover-visibility="popoverVisibility"/>
      </div>
      <input type="submit">
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
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
