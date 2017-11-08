<template>
<table-object
  :properties='themeStyleProperties'>
</table-object>
</template>

<script>
import TableObject from '../../app/tables/TableObject';
import themeStyleProperties from '../themeStyleProperties';

export default {
  components: {
    TableObject,
  },
  data() {
    return {
      themeStyleProperties,
    };
  },
};
</script>
