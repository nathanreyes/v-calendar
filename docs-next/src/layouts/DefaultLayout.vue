<template>
  <div>
    <div class="flex w-full max-w-5xl mx-auto">
      <div><Sidebar /></div>
      <div><RouterView /></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

export default defineComponent({
  components: { Sidebar },
});
</script>
