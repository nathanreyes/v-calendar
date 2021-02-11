<template>
  <div class="relative flex-grow">
    <svg
      class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      ></path>
    </svg>
    <input
      class="flex-grow text-gray-900 pl-8 pr-2 py-1 bg-white border-2 focus:outline-none focus:border-blue-500 rounded w-full"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
