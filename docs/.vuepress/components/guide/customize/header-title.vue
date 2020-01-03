<template>
  <div class='center'>
    <v-calendar>
      <span slot='header-title' slot-scope='{ shortMonthLabel, shortYearLabel }'>
        {{ shortMonthLabel }} '{{ shortYearLabel }}
      </span>
    </v-calendar>
  </div>
</template>
