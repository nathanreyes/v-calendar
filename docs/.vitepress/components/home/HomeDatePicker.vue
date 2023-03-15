<template>
  <div class="overflow-hidden py-16 shadow-inner">
    <div class="w-full max-w-5xl mx-auto">
      <div class="p-10">
        <h2 class="text-4xl font-display text-center">Date Picker</h2>
        <p v-if="false" class="text-gray-200 mt-6 text-center">
          A calendar for all your needs
        </p>
      </div>
      <BaseTabs class="flex flex-col lg:flex-row lg:justify-end lg:h-[500px]">
        <BaseTabList
          class="flex lg:flex-col lg:px-0 space-x-2 space-y-1 lg:space-x-0 max-w-full px-4 pb-4 sm:pb-0 lg:mt-6 lg:ml-6 sm:mx-auto whitespace-nowrap overflow-x-auto sm:overflow-visible overflow-y-hidden"
        >
          <BaseTab
            v-for="{ title, summary } in calendarTabs"
            :key="title"
            class="focus:outline-none focus:ring ring-white/10 rounded-full lg:rounded-none lg:rounded-l-xl"
          >
            <template #default="{ selected }">
              <HomeTab :title="title" :summary="summary" :selected="selected" />
            </template>
          </BaseTab>
        </BaseTabList>
        <BaseTabPanels>
          <BaseTabPanel v-for="{ panel, summary } in calendarTabs">
            <HomeTabPanel :summary="summary">
              <component v-if="panel" :is="panel" />
            </HomeTabPanel>
          </BaseTabPanel>
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
    panel: 'HomeReminders',
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
