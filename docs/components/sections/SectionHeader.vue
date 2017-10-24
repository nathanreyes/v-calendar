<template>
  <section class='hero is-primary'>
    <div class='hero-body'>
      <div class='container has-text-centered'>
        <p class='title'>V-Calendar</p>
        <h2 class='logo-subtitle'>&#8212; A clean and lightweight calendar plugin for Vue.js &#8212;</h2>
        <b-tag>{{ version }}</b-tag>
      </div>
    </div>
    <div class='hero-foot is-hidden-mobile'>
      <div class='container'>
        <nav class='tabs is-boxed'>
          <ul>
            <router-link tag='li' to='/' exact><a>Intro</a></router-link>
            <router-link tag='li' to='/setup'><a>Setup</a></router-link>
            <router-link tag='li' to='/styling'><a>Styling</a></router-link>
            <router-link tag='li' to='/api'><a>API</a></router-link>
          </ul>
        </nav>
      </div>
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
