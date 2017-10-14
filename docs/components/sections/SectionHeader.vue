<template>
<section class='hero is-primary'>
  <!-- Hero header: will stick at the top -->
  <div class="hero-head">
    <header class="nav">
      <div class="container">
        <div class="nav-left">
          <router-link class='nav-item title is-4 logo' to=''>
            V-Calendar
          </router-link>
        </div>
        <!-- <span class="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span> -->
        <div class="nav-right nav-menu">
          <!-- <a class="nav-item is-active">
            Home
          </a>
          <a class="nav-item">
            Examples
          </a>
          <a class="nav-item">
            Documentation
          </a> -->
          <span class="nav-item">
            <a class='button is-primary is-inverted' href='https://github.com/nathanreyes/v-calendar' target='_blank'>
              <span class='icon'><i class='fa fa-github'></i></span>
              <span>Github</span>
            </a>
          </span>
        </div>
      </div>
    </header>
  </div>
  <!-- Hero content: will be in the middle -->
  <div class='hero-body'>
    <div class='container has-text-centered'>
      <h1 class='title is-2 logo'>V-Calendar</h1>
      <h2 class='logo-subtitle'>&#8212; A clean, lively calendar plugin for Vue.js &#8212;</h2>
      <b-tag>{{ version }}</b-tag>
    </div>
  </div>
  <!-- Hero footer: will stick at the bottom -->
  <div class='hero-foot'>
    <nav class="tabs">
      <div class="container">
        <ul>
          <li><a href='#intro'>Calendar</a></li>
          <li><a href='#attributes'>Attributes</a></li>
          <li><a href='#datepicker'>DatePicker</a></li>
          <li><a href='#api'>API</a></li>
          <li><a href='#usage'>Usage</a></li>
        </ul>
      </div>
    </nav>
  </div>
</section>
</template>

<script>
import Package from '../../../package.json';

export default {
  data() {
    return {
      version: Package.version,
    };
  },
};
</script>

<style lang='sass' scoped>
.tag
  margin-top: 10px
</style>
