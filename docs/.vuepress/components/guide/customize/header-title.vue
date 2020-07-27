<template>
  <div class="center">
    <v-calendar>
      <template v-slot:header-title="{ shortMonthLabel, shortYearLabel }">
        <span> {{ shortMonthLabel }} '{{ shortYearLabel }}</span>
      </template>
    </v-calendar>
  </div>
</template>
