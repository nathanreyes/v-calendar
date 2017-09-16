<template>
<div class='block'>
  <b-panel v-for='(faq, i) in faqs' :key='i' collapsible>
    <strong slot='header' v-html='faq.q'></strong>
    <p v-html='faq.a'></p>
  </b-panel>
</div>
</template>

<script>
export default {
  data() {
    return {
      faqs: [
        {
          q: 'How can I control the calendar dimensions and layout?',
          a: '',
        },
      ],
    };
  },
};
</script>