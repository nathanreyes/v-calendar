<template>
  <VCalendar :columns="columns" :isExpanded="isExpanded" />
</template>
<script setup>
import { useScreens } from 'vue-screen-utils';

const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ lg: 2 }, 1);
const isExpanded = mapCurrent({ lg: false }, true);
</script>
