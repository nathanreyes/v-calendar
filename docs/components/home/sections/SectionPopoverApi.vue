<template>
<section id='api' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>API</h3>
    <b-tabs>
      <b-tab-item label='Props'>
        <table-props :props='props'></table-props>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import TableProps from '../../app/tables/TableProps';
import props from '../util/popoverProps';

export default {
  components: {
    TableProps,
  },
  data() {
    return {
      props,
    };
  },
};
</script>