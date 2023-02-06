<template>
  <div
    class="overflow-hidden lg:m-6 lg:pl-6 bg-gradient-to-r from-indigo-600 dark:from-indigo-800 to-cyan-500 dark:to-cyan-700 py-16 lg:rounded-2xl"
  >
    <div class="p-10">
      <h2 class="text-5xl text-white font-display text-center">Calendar</h2>
      <p class="text-gray-200 mt-6 text-center">
        An elegant and flexible date and date picker plugin for Vue.js
      </p>
    </div>
    <BaseTabs class="lg:h-[500px]">
      <BaseTabList>
        <BaseTab
          title="Flexible layouts"
          summary="Choose between weekly or monthly, multi-column"
        />
        <BaseTab
          title="Colors & dark mode"
          summary="Display weekly calendar when in a condensed layout."
        />
        <BaseTab
          title="Days attributes"
          summary="Display weekly calendar when in a condensed layout."
        />
        <BaseTab
          title="Date rendering"
          summary="Display weekly calendar when in a condensed layout."
        />
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
</template>
<script setup></script>
