<template>
  <div id="app">
    <nav class='navbar'>
      <div class='navbar-brand'>
        <router-link class='navbar-item' to='home'>
          V-Calendar
        </router-link>
      </div>
      <div class='navbar-menu'>
        <div class='navbar-end'>
          <div class='navbar-item'>
            <a class='button is-outlined is-light'>
              <span class='icon'><i class='fa fa-github'></i></span>
              <span>Github</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang='scss'>
@import './styles/app';

pre {
  @include tablet {
    white-space: pre-wrap;
  }
  code {
    max-height: 400px;
    &.hljs {
      background: inherit;
      color: inherit;
      padding: 1.25rem 1.5rem;
    }
  }
}
</style>
