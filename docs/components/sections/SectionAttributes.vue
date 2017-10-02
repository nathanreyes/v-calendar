<template>
<section id='attributes' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Attributes</h3>
    <div class='columns content'>
      <div class='column is-one-third'>
        <p>Attributes are used to decorate to the calendar. A single attribute may contain any of the following objects:</p>
        <ul>
          <li>highlight</li>
          <li>indicator</li>
          <li>content style</li>
        </ul>
        <p>Specify which dates you would like to apply an attribute to with an array of single date or date range objects (start and end date).</p>
      </div>
      <div class='column is-two-thirds is-centered'>
        <img class='attribute-img' src='../../assets/attribute.png'/>
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