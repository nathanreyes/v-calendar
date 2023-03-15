<template>
  <div class="relative">
    <div class="flex flex-col items-center py-14 px-4">
      <h1 class="text-5xl font-medium mt-6 font-display">
        <span
          class="text-transparent bg-gradient-to-r from-indigo-600 dark:from-indigo-300 to-cyan-500 dark:to-cyan-300 bg-clip-text"
          >VCalendar</span
        >
      </h1>
      <p class="font-medium font-display text-gray-400 mt-4">
        An elegant and flexible date and date picker plugin for Vue.js
      </p>
      <!--CTA buttons-->
      <div
        class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10"
      >
        <a
          href="/getting-started/installation"
          class="w-full sm:w-auto inline-flex justify-center items-center font-semibold space-x-2 text-sm px-4 py-2 rounded-lg text-accent-800 dark:text-white bg-accent-100 hover:bg-accent-200 dark:bg-accent-500 dark:hover:bg-accent-400"
          icon="IconArrowRight"
          accent
          ><span>Get Started</span>
          <Component
            is="IconArrowRight"
            class="w-4 h-4 text-accent-500 dark:text-gray-200"
          />
        </a>
        <BaseLinkButton
          href="https://github.com/nathanreyes/v-calendar"
          icon="IconExternalLink"
          >View on GitHub</BaseLinkButton
        >
      </div>
      <!-- <HeroCalendarDots class="-rotate-3" />
        <HeroCalendarHighlights /> -->
      <!-- <HeroCalendarBars class="rotate-3" /> -->
    </div>
  </div>
</template>
