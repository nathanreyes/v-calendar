<template>
<section id='usage' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Usage</h3>
    <b-message type='is-warning'>
      <a href='https://vuejs.org' target='_blank'>Vue.js</a> version <strong>2.4+</strong> is required.
    </b-message>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>1</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>Use <strong>NPM</strong></p>
        <figure class='highlight'>
          <pre v-highlight><code class='bash'><span class='is-unselectable'>$ </span>npm install v-calendar</code></pre>
        </figure>
      </div>
    </article>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>2</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>Import into your project</p>
        <figure class='highlight'>
          <pre v-highlight><code class='javascript'>{{ importCode | pre }}</code></pre>
        </figure>
        <p class='content'>This gives you access to the <i>v-calendar</i>, <i>v-date-picker</i>, and <i>v-popover</i> components</p>
      </div>
    </article>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>3</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>Reference in your Vue component templates</p>
        <figure class='highlight'>
          <pre v-highlight><code class='html'>{{ componentCode | pre }}</code></pre>
        </figure>
      </div>
    </article>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {
      importCode: `
        import Vue from 'vue';
        import VCalendar from 'v-calendar';
        import 'vcalendar/lib/vcalendar.css';

        Vue.use(VCalendar);`,
      componentCode: `
        <template>
          <v-calendar
            is-double-paned>
          </v-calendar>
          <v-date-picker
            mode='single'
            v-model='mySelection'>
          </v-date-picker>
        </template>`,
    };
  },
};
</script>
