<template>
  <figure class='highlight' :class=' { "offset": offset }'>
    <button class='button is-small copy-code' v-clipboard:copy='code'>Copy</button>
    <pre v-highlight><code :class='lang'>{{ code }}</code></pre>
  </figure>
</template>

<script>
export default {
  props: {
    lang: { type: String, default: 'html' },
    code: String,
    offset: Boolean,
  },
};
</script>

<style lang='scss' scoped>

@import '../../styles/app.scss';

figure.offset {
  margin: 20px 0px 10px 20px;
}

.highlight {
  position: relative;
  text-align: left !important;
  .button {
    position: absolute;
    right: 1.5rem;
    top: 0.5rem;
    &:hover + pre {
      background: darken($white-ter, 2.5%);
    }
  }
  pre {
    padding: 0;
    code {
      max-height: 400px;
      &.hljs {
        background: inherit;
        color: inherit;
        padding: 1.25rem 1.5rem;
      }
    }
    @include tablet {
      white-space: pre-wrap;
    }
  }
}

</style>