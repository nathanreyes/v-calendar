<template>
<section id='api' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>API</h3>
    <b-tabs>
      <b-tab-item label='Props'>
        <table-popover-props></table-popover-props>
      </b-tab-item>
      <b-tab-item label='Events'>
        <table-popover-events></table-popover-events>
      </b-tab-item>
      <b-tab-item label='Slots'>
        <table-popover-slots></table-popover-slots>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import TablePopoverProps from '../tables/TablePopoverProps';
import TablePopoverEvents from '../tables/TablePopoverEvents';
import TablePopoverSlots from '../tables/TablePopoverSlots';

export default {
  components: {
    TablePopoverProps,
    TablePopoverEvents,
    TablePopoverSlots,
  },
};
</script>