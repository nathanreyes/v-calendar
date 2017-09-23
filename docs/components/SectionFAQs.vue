<template>
<section id='faqs' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>FAQs</h3>
    <div class='block'>
      <b-panel v-for='(faq, i) in faqs' :key='i' collapsible>
        <strong slot='header' v-html='faq.q'></strong>
        <p v-html='faq.a'></p>
      </b-panel>
    </div>
  </div>
</section>
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
