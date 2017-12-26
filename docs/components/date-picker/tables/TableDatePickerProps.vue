<template>
<table-props :props='props'>
</table-props>
</template>

<script>
import TableProps from '../../app/tables/TableProps';
import props from '../util/datePickerProps';

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
