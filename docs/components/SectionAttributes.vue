<template>
<section id='attributes' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Attributes</h3>
    <div class='columns content'>
      <div class='column is-one-third'>
        <p>
          Attributes are used to apply adornments to the calendar. A single attribute may include one or many of the following types of objects:
        </p>
        <ul>
          <li>highlight</li>
          <li>indicator</li>
          <li>content style</li>
        </ul>
        <p>
          A collection of dates or date ranges for which the attribute should be applied must also be specified .
        </p>
      </div>
      <div class='column is-two-thirds is-centered'>
        <img class='attribute-img' src='../assets/attribute.png'/>
      </div>
    </div>
  </div>
</section>
</template>

<style lang='sass' scoped>
.attribute-img
  max-height: 300px
  margin-top: -30px
</style>