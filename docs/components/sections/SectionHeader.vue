<template>
  <section class='hero is-primary is-bold'>
    <div class='hero-body'>
      <div class='container'>
        <div>
          <p class='title'>V-Calendar</p>
          <h2 class='logo-subtitle'>&#8212; A clean and lightweight calendar plugin for Vue.js &#8212;</h2>
          <b-taglist attached>
            <b-tag>{{ version }}</b-tag>
            <b-tag type='is-warning'>Beta</b-tag>
          </b-taglist>
        </div>
        <transition name='from-top'>
          <div class='c-container-1' v-if='showBannerCalendar'>
            <div class='c-container-2'>
              <ex-styling-3></ex-styling-3>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class='hero-foot is-hidden-touch'>
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
import ExStyling3 from '../examples/ExStyling-3';
import Package from '../../../package.json';

export default {
  components: {
    ExStyling3,
  },
  data() {
    return {
      version: Package.version,
      showBannerCalendar: false,
    };
  },
  watch: {
    $route() {
      this.showBannerCalendar = this.$route.path === '/';
    },
  },
};
</script>

<style lang='sass' scoped>

.hero-body
  margin-top: 30px
  margin-bottom: 30px

.tag
  margin-top: 10px

.tags
  display: inline-flex

.c-container-1
  position: relative
  margin: 0
  padding: 0

.c-container-2
  position: absolute
  left: 70%
  margin-top: -170px
  margin-left: -150px
  border-radius: 5px
  width: 100%
  z-index: 20

.from-top-enter-active, .from-top-leave-active
  transition: all 0.2s

.from-top-leave-active
  transition: all 0.3s

.from-top-enter, .from-top-leave-to
  transformY: -20px
  opacity: 0

@media screen and (max-width: 900px)

  .hero-body
    text-align: center
    margin-top: 20px
    margin-bottom: 20px

  .c-container-2
    position: relative
    left: 0
    margin-top: 20px
    margin-left: 0
  
</style>
