<template>
<section id='attributes' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Attributes</h3>
    <div class='columns is-desktop'>
      <div class='column'>
        <div class='content'>
          <p>Attributes are used to decorate the calendar with the following objects:</p>
          <ul>
            <li>highlights</li>
            <li>indicators</li>
            <li>content styles</li>
            <li>content hover styles</li>
          </ul>
          <p>A single attribute may include one of each. To specify which dates you would like to apply an attribute to, use an array of single date or date range objects (start and end date).</p>
          <p>Any overlapping dates are ordered to display the most information possible but manual ordering is also supported.</p>
        </div>
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