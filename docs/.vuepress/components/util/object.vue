<template>
  <div>
    <div
      v-for='(item, i) in items'
      :key='i'
      class='py-6'
      :class='{ "border-t": i > 0 }'
      >
      <div
        v-for='(key, i) in Object.keys(item)'
        :key='key'
        class='flex'
        :class='{ "mt-3": i > 0 }'
        v-if='headerInfo[key]'>
        <h3
          class='text-base'
          v-html='item[key]'
          v-if='headerInfo[key]["isLookup"]'>
        </h3>
        <div v-else>
          <span
            class='text-base font-bold'
            :class='headerInfo[key]["class"]'
            :style='{ minWidth: headerWidth + "px" }'
            v-html='headerInfo[key]["title"]'>
          </span>
          <h3
            class='text-base'
            v-html='item[key]'
            v-if='headerInfo[key]["isLookup"]'>
          </h3>
          <span
            v-html='item[key]'
            v-else>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerWidth: {
      type: Number,
      default: 140,
    },
    headerInfo: Object,
    items: Array,
  },
};
</script>
