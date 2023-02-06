<template>
  <div
    class="flex ml-6 lg:ml-0 bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-l-2xl drop-shadow-lg"
  >
    <div class="w-96 border-r border-gray-300 dark:border-gray-500">
      <div
        class="flex flex-col p-6 space-y-4 border-b border-gray-300 dark:border-gray-500"
      >
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
      </div>
      <CalendarReminders />
    </div>
    <div class="flex-grow pl-6 pt-6 space-y-4">
      <div class="w-full bg-gray-200 dark:bg-gray-700 h-20 rounded-l-xl"></div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-l-xl"></div>
    </div>
  </div>
</template>
