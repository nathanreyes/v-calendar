<template>
  <div class="w-64 py-6 space-y-6">
    <div>
      <div class="text-xs text-gray-900 font-medium uppercase tracking-wide">
        Calendar
      </div>
      <div class="flex flex-col space-y-2 mt-2">
        <RouterLink to="/calendar/weekly" class="text-sm">Weekly</RouterLink>
        <RouterLink to="/calendar/blank" class="text-sm">Blank</RouterLink>
      </div>
    </div>
    <div>
      <div class="text-xs text-gray-900 font-medium uppercase tracking-wide">
        Date Picker
      </div>
      <div class="flex flex-col space-y-2 mt-2">
        <RouterLink to="/datepicker/date" class="text-sm">Date</RouterLink>
        <RouterLink to="/datepicker/time" class="text-sm">Time</RouterLink>
        <RouterLink to="/datepicker/time-range" class="text-sm"
          >Time Range</RouterLink
        >
      </div>
    </div>
  </div>
</template>
