<template>
  <div id="app">
    <section-navbar></section-navbar>
    <section-header></section-header>
    <router-view></router-view>
    <section-footer></section-footer>
  </div>
</template>

<script>
import SectionNavbar from './components/app/sections/SectionNavbar';
import SectionHeader from './components/app/sections/SectionHeader';
import SectionFooter from './components/app/sections/SectionFooter';

export default {
  name: 'app',
  components: {
    SectionNavbar,
    SectionHeader,
    SectionFooter,
  },
};
</script>

<style lang='sass'>

.center-container
  display: flex
  justify-content: center

.b-tabs .tabs
  margin-bottom: 10px

.column.is-example
  margin-top: 39px

</style>
