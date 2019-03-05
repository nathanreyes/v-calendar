<template>
  <div class="example">
    <div class="flex mb-2">
      <div>
        <input type="radio" id="single" value="single" v-model="mode">
        <label for="single">Single</label>
      </div>
      <div class="ml-2">
        <input type="radio" id="multiple" value="multiple" v-model="mode">
        <label for="multiple">Multiple</label>
      </div>
      <div class="ml-2">
        <input type="radio" id="range" value="range" v-model="mode">
        <label for="range">Range</label>
      </div>
    </div>
    <div class="flex items-center mb-2">
      <input id="isInline" type="checkbox" v-model="isInline" class="mt-1 mr-1">
      <label for="isInline">Is Inline</label>
    </div>
    <v-date-picker v-model="date" :mode="mode" :is-inline="isInline"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      mode: 'single',
      isInline: true,
      popoverVisibility: 'visible',
    };
  },
};
</script>
