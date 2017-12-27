<template>
<section id='theme-styles' class='section'>
  <div class='container'>
    <h4 class='title is-4 is-spaced'>Theme Styles</h4>
    <hr>
    <div class='content'>
      <p>
        By default, <code>v-calendar</code> is has a neutral, lightweight aesthetic that should coordinate well with most designs.
        However, many sections of the calendar can be customized with their own styling.
        The <code>theme-styles</code> prop is simply an object composed of style objects that are each applied to a given section of the calendar.
      </p>
    </div>
    <table-styles></table-styles>
  </div>
</section>
</template>

<script>
import TableStyles from '../tables/TableStyles';

export default {
  components: {
    TableStyles,
  },
};
</script>
