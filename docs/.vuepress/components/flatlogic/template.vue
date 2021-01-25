<template>
  <div class="flex flex-col items-center">
    <a
      :href="`${targetUrl}?ref=gPFUKBytAL`"
      target="_blank"
      class="hover:opacity-75"
    >
      <img
        :src="imgUrl"
        :title="title"
        :alt="title"
        class="w-72 border-2 border-gray-400 rounded-lg"
      />
    </a>
    <p class="font-medium text-gray-700 text-center p-0 mt-2 mb-0">
      {{ title }}
    </p>
    <p
      v-if="subtitle"
      class="text-xs text-center text-gray-500 p-0 mt-2 mb-0 leading-none"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    targetUrl: String,
    imgUrl: String,
    title: String,
    subtitle: String,
  },
};
</script>
