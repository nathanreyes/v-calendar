<template>
<section id='attributes' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Attributes</h3>
    <div class='columns content'>
      <div class='column is-half'>
        <p>Attributes are used to decorate the calendar with the following objects:</p>
        <ul>
          <li>highlights</li>
          <li>indicators</li>
          <li>content styles</li>
        </ul>
        <p>To specify which dates you would like to apply the attribute to, use an array of single date or date range objects (start and end date).</p>
        <p>Any overlapping dates are ordered to display the most information possible but manual ordering is also supported.</p>
      </div>
      <div class='column is-half is-centered'>
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