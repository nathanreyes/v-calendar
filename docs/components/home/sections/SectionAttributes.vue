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
            <li>dot indicators</li>
            <li>bar indicators</li>
            <li>content styles</li>
            <li>content hover styles</li>
          </ul>
          <p>A single attribute may include one of each. To specify which dates you would like to apply an attribute to, use an array of single date or date range objects (start and end date). Any overlapping dates are ordered to display the most information possible but manual ordering is also supported.</p>
          <p>Another great feature is using complex date patterns to display attributes as well (details below). For example, here are a few examples of what kinds of patterns are supported:</p>
          <ul>
            <li>Every other Friday</li>
            <li>1st and the 15th of every month</li>
            <li>Last Saturday of the month</li>
            <li>Every year on January 21st (...oh hey my birthday)</li>
          </ul>
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