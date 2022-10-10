<template>
  <div class="my-10 mx-24">
    <div class="flex space-x-16">
      <div class="flex-grow flex flex-col">
        <!-- <div class="flex items-center"> -->
        <img src="/logo.png" alt="Banner image" width="60" class="-mt-12" />
        <h1 class="text-5xl font-bold mt-6">VCalendar</h1>
        <!-- </div> -->
        <p class="font-medium text-gray-500 dark:text-gray-300 mt-6">
          A calendar and date picker plugin for Vue.js.
        </p>

        <!--CTA buttons-->
        <div class="flex space-x-4 mt-6">
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
      <div class="flex-shrink-0"></div>
    </div>
    <div class="bg-accent-500 dark:bg-accent-500 p-6 rounded-lg w-full mt-6">
      <div class="flex justify-around items-center space-x-12">
        <HeroCalendarDots class="-rotate-3" />
        <HeroCalendarHighlights />
        <HeroCalendarBars class="rotate-3" />
      </div>
    </div>
  </div>
</template>
