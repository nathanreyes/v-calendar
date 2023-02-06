<template>
  <div
    class="overflow-hidden py-16 bg-gradient-to-r shadow-inner from-indigo-600 dark:from-indigo-800 to-cyan-500 dark:to-cyan-700"
  >
    <div class="w-full max-w-5xl mx-auto">
      <div class="p-10">
        <h2 class="text-5xl text-white font-display text-center">Calendar</h2>
        <p class="text-gray-200 mt-6 text-center">
          An elegant and flexible date and date picker plugin for Vue.js
        </p>
      </div>
      <BaseTabs class="flex flex-col lg:flex-row lg:justify-end lg:h-[500px]">
        <BaseTabList
          class="flex lg:flex-col lg:px-0 space-x-2 space-y-1 lg:space-x-0 max-w-full px-4 pb-4 sm:pb-0 lg:mt-6 lg:ml-6 sm:mx-auto whitespace-nowrap overflow-x-auto sm:overflow-visible overflow-y-hidden"
        >
          <BaseTab
            v-for="{ title, summary } in calendarTabs"
            :key="title"
            class="focus:outline-none focus:ring ring-white/10 lg:rounded-l-xl"
          >
            <template #default="{ selected }">
              <HomeTab :title="title" :summary="summary" :selected="selected" />
            </template>
          </BaseTab>
        </BaseTabList>
        <BaseTabPanels>
          <BaseTabPanel>
            <HomeReminders />
          </BaseTabPanel>
          <BaseTabPanel></BaseTabPanel>
          <BaseTabPanel></BaseTabPanel>
          <BaseTabPanel></BaseTabPanel>
        </BaseTabPanels>
      </BaseTabs>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const calendarTabs = ref([
  {
    title: 'Flexible layouts',
    summary: 'Choose between weekly or mult-paned monthly layouts.',
  },
  {
    title: 'Colors & dark mode',
    summary: 'Display weekly calendar when in a condensed layout.',
  },
  {
    title: 'Days attributes',
    summary: 'Choose between weekly or mult-paned monthly layouts.',
  },
  {
    title: 'Date rendering',
    summary: 'Choose between weekly or mult-paned monthly layouts.',
  },
]);
</script>
