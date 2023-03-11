<template>
  <div
    class="overflow-hidden py-16 bg-gradient-to-r shadow-inner from-indigo-600 dark:from-indigo-700 to-cyan-500 dark:to-cyan-700"
  >
    <div class="w-full max-w-5xl mx-auto">
      <div class="flex justify-center items-center">
        <div class="flex flex-row p-3 rounded-lg space-x-3 sm:space-x-4">
          <HomeHeaderButton
            :selected="showCalendar"
            @click="showCalendar = true"
            >Calendar</HomeHeaderButton
          >
          <HomeHeaderButton
            :selected="!showCalendar"
            @click="showCalendar = false"
            >Date Picker</HomeHeaderButton
          >
        </div>
        <p v-if="false" class="text-gray-200 mt-6 text-center">
          A calendar for all your needs
        </p>
      </div>
      <BaseTabs
        v-if="showCalendar"
        class="flex flex-col lg:flex-row lg:justify-end lg:h-[500px] mt-6"
      >
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
          <BaseTabPanel v-for="{ imgUrl, summary } in calendarTabs">
            <HomeTabPanel :summary="summary">
              <div
                class="w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl lg-w[67.8125rem]"
              >
                <img :src="imgUrl" class="w-full" />
              </div>
            </HomeTabPanel>
          </BaseTabPanel>
        </BaseTabPanels>
      </BaseTabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showCalendar = ref(true);

const calendarTabs = ref([
  {
    title: 'Flexible layouts',
    summary: 'Choose between weekly or mult-paned monthly layouts.',
    imgUrl: '/layouts.png',
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
