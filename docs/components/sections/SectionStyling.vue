<template>
<section id='example-1' class='section'>
  <div class='container'>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>{{ step }}</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>{{ title }}</p>
      </div>
    </article>
    <br />
    <div class='columns is-desktop'>
      <div class='column'>
        <code-block :code='code'></code-block>
      </div>
      <div class='column'>
        <div class='example-container'>
          <slot>Example Here</slot>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  props: {
    step: Number,
    title: String,
    code: String,
  },
};
</script>

<style lang='sass' scoped>
.example-container
  margin-top: 0
</style>
