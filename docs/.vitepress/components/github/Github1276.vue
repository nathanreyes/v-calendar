<template>
  <form action="POST">
    <VCalendar>
      <template #day-content="{ day }">
        <div
          class="w-full h-full flex justify-center items-center text-sm text-red-500"
        >
          {{ day.day }}
        </div>
      </template>
    </VCalendar>
  </form>
</template>
