<template>
  <div class="py-6">
    <Calendar :attributes="attributes" v-model:view="view" show-weeknumbers />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const view = ref('monthly');
    const attributes = ref([]);
    return {
      view,
      attributes,
    };
  },
});
</script>

<style scoped lang="postcss"></style>
