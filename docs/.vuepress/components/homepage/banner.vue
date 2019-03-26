<template>
  <div class="bg-gray-600 text-white px-2 py-3 text-center">
    <p class="text font-bold mt-0 mb-0">This documentation applies for v1.0.0-beta.1</p>
    <p class="text-sm text-gray-200 my-0">
      <a href="#" class="underline text-gray-200">Click here</a> to reference documentation for previous versions
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    const el = document.querySelector('.hero');
    el.parentElement.insertBefore(this.$el, el);
  },
};
</script>
