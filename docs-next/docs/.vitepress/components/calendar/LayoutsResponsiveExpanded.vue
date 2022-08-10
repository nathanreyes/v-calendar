<template>
  <Calendar :columns="columns" :isExpanded="isExpanded" />
</template>
<script setup>
import { useScreens } from 'vue-screen-utils';

const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ xs: 1, lg: 2 });
const isExpanded = mapCurrent({ xs: true, lg: false });
</script>
