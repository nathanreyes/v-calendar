<template>
  <section id='intro' class='section'>
    <div class='container'>
      <h3 class='title has-text-primary is-spaced'>Calendar</h3>
      <div class='columns'>
        <div class='column is-one-half'>
          <b-tabs>
            <!--Intro Overview-->
            <b-tab-item label='Overview'>
              <div class='content'>
                <ul>
                  <li>Lightweight and dependency-free</li>
                  <li>Single or double-paned</li>
                  <li>Built-in support for various attributes including highlights, indicators and content styles</li>
                  <li>Clean and lively design</li>
                </ul>
              </div>
            </b-tab-item>
            <!--Intro Example Code-->
            <b-tab-item label='Example Code'>
              <pre v-highlight><code class='html'>{{ exIntroCode }}</code></pre>
            </b-tab-item>
            <!--Intro Example Options-->
            <b-tab-item label='Options' icon='gear'>
              <b-field>
                <b-switch
                  v-model='isDoublePaned'>
                  Double-Paned
                </b-switch>
              </b-field>
              <b-field label='Title Transition'>
                <b-select
                  placeholder='Title Transition'
                  v-model='titleTransition'>
                  <option
                    v-for="transition in transitions"
                    :value="transition"
                    :key="transition">
                    {{ transition }}
                  </option>
                </b-select>
              </b-field>
              <b-field label='Weeks Transition'>
                <b-select
                  placeholder='Weeks Transition'
                  v-model='weeksTransition'>
                  <option
                    v-for="transition in transitions"
                    :value="transition"
                    :key="transition">
                    {{ transition }}
                  </option>
                </b-select>
              </b-field>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class='column is-one-half is-example'>
          <ex-intro
            :is-double-paned='isDoublePaned'
            :title-transition='titleTransition'
            :weeks-transition='weeksTransition'>
          </ex-intro>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import ExIntro from './ExIntro';
import ExIntroCode from '!!raw-loader!./ExIntro';

export default {
  components: {
    ExIntro,
  },
  props: {
  },
  data() {
    return {
      exIntroCode: ExIntroCode,
      isDoublePaned: false,
      titleTransition: 'slide',
      weeksTransition: 'slide',
      transitions: ['slide', 'fade', 'none'],
    };
  },
};
</script>
