<template>
  <div
    class="w-full sm:w-96 lg:w-full flex flex-col lg:flex-row justify-center items-stretch mx-auto lg:mx-0 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 sm:rounded-2xl lg:rounded-r-none drop-shadow-lg"
  >
    <div
      class="w-full sm:w-96 mx-auto lg:max-w-none lg:border-r border-gray-300 dark:border-gray-500"
    >
      <div
        class="flex flex-col p-6 space-y-4 border-b border-gray-300 dark:border-gray-500"
      >
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-full"></div>
      </div>
      <CalendarReminders />
    </div>
    <div class="hidden lg:flex flex-grow">
      <div class="w-full h-full relative overflow-hidden">
        <div class="absolute inset-0 w-96">
          <div class="flex flex-col flex-grow pl-6 pt-6 space-y-4">
            <div
              class="w-full bg-gray-200 dark:bg-gray-700 h-20 rounded-l-xl"
            ></div>
            <div
              class="w-full bg-gray-200 dark:bg-gray-700 h-5 rounded-l-xl"
            ></div>
            <div class="flex space-x-4">
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
              <div
                class="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
