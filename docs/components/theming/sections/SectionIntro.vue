<template>
  <section id='styling-intro' class='section'>
    <div class='container'>
      <h3 class='title has-text-primary is-spaced'>Theming</h3>
      <b-message type='is-warning'>
        <strong>Note:</strong> All discussion applies to <code>v-date-picker</code> as well, as it simply wraps <code>v-calendar</code> and forwards all props and events.
      </b-message>
      <div class='content'>
        <p>
          As mentioned in the introduction, V-Calendar was designed with customization in mind.
          This requires that if you are displaying a calendar in your application, it may need to fit within an overall design theme set up for your site.
        </p>
        <p>
          Generally speaking, these are some specific props that can be used to customize the overall display of your calendar.
        </p>
      </div>
      <table-props></table-props>
    </div>
  </section>
</template>

<script>
import TableProps from '../tables/TableProps';

export default {
  components: {
    TableProps,
  },
};
</script>
