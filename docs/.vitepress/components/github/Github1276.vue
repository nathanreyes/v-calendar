<template>
  <form action="POST">
    <VCalendar>
      <template #header-prev-button="{ move }"
        ><button
          type="button"
          class="hover:bg-gray-200 px-2 rounded"
          @click="move"
        >
          L
        </button></template
      >
      <template #header-title="{ title }"
        ><span>{{ title }}</span>
      </template>
    </VCalendar>
  </form>
</template>
