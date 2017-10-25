<template>
<section id='setup' class='section'>
  <div class='container'>
    <b-message type='is-warning'>
      <a href='https://vuejs.org' target='_blank'>Vue.js</a> version <strong>2.4.2+</strong> is required.
    </b-message>
    <b-tabs>
      <b-tab-item label='NPM'>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>1</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Install</p>
          </div>
        </article>
        <code-block lang='javascript' code='npm install v-calendar' offset></code-block>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>2</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Import into your project</p>
          </div>
        </article>
        <code-block lang='javascript' :code='importCode | pre' offset></code-block>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>3</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Reference in your component templates</p>
          </div>
        </article>
        <code-block :code='componentCode | pre' offset></code-block>
      </b-tab-item>
      <b-tab-item label='CDN'>
        <article class='media'>
          <div class="media-left">
            <p class="title is-5">1</p>
          </div>
          <div class="media-content">
            <p class="title is-5">Load external resources</p>
          </div>
        </article>
        <code-block :code='loadResourcesCode | pre' offset></code-block>
        <article class="media">
          <div class="media-left">
            <p class="title is-5">2</p>
          </div>
          <div class="media-content">
            <p class="title is-5">Use the global VCalendar object</p>
          </div>
        </article>
        <code-block lang='javascript' code='Vue.use(VCalendar.default);' offset></code-block>
        <article class='media'>
          <div class='media-left'>
            <p class='title is-5'>3</p>
          </div>
          <div class='media-content'>
            <p class='title is-5'>Reference in your component templates</p>
          </div>
        </article>
        <code-block :code='componentCode | pre' offset></code-block>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>

export default {
  data() {
    return {
      setupOption: 'npm',
      importCode: `
        import Vue from 'vue';
        import VCalendar from 'v-calendar';
        import 'vcalendar/lib/vcalendar.min.css';

        // Access v-calendar, v-date-packer and v-popover components
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
      loadResourcesCode: `
        <!-- VCalendar CSS -->
        <link rel='stylesheet' href='https://unpkg.com/vcalendar/lib/vcalendar.min.css'>
        <!-- VCalendar JavaScript -->
        <script src='https://unpkg.com/vcalendar'><\/script>`,
    };
  },
  computed: {
    npmSelected() {
      return this.setupOption === 'npm';
    },
    cdnSelected() {
      return this.setupOption === 'cdn';
    },
  },
};
</script>
