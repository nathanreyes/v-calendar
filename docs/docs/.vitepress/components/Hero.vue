<template>
  <div class="my-10 mx-24">
    <div
      class="relative bg-gradient-to-r from-indigo-600 to-cyan-500 px-20 py-14 rounded-lg w-full mt-6"
    >
      <div class="absolute top-0 left-0 w-full flex px-20">
        <div
          class="flex space-x-2 px-4 py-2 text-accent-800 rounded-b-lg bg-blur-sm bg-white/60"
        >
          <span> &#127881; </span>
          <span class="font-semibold"> Version 3 docs are live! </span>
        </div>
      </div>
      <div class="flex justify-between items-center space-x-12">
        <div>
          <div>
            <h1
              class="text-5xl text-transparent bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text font-bold mt-6"
            >
              VCalendar
            </h1>
            <p class="font-medium text-accent-200 dark:text-gray-300 mt-4">
              A calendar and date picker plugin for Vue.js.
            </p>
          </div>
          <!--CTA buttons-->
          <div class="flex space-x-4 mt-10">
            <BaseLinkButton
              href="/getting-started/installation"
              icon="BaseArrowRightIcon"
              accent
              >Get Started</BaseLinkButton
            >
            <BaseLinkButton
              href="https://github.com/nathanreyes/v-calendar"
              icon="BaseExternalLinkIcon"
              >View on GitHub</BaseLinkButton
            >
          </div>
        </div>
        <!-- <HeroCalendarDots class="-rotate-3" />
        <HeroCalendarHighlights /> -->
        <HeroCalendarBars class="rotate-3" />
      </div>
    </div>
  </div>
</template>
