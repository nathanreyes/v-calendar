<template>
  <section id='intro' class='section'>
    <div class='container'>
      <h3 class='title has-text-primary is-spaced'>Calendar</h3>
      <div class='columns is-desktop'>
        <div class='column'>
          <b-tabs>
            <!--Intro Overview-->
            <b-tab-item label='Overview'>
              <div class='content'>
                <p>
                  V-Calendar is a clean and lightweight Vue.js plugin for displaying simple, annotated calendars.
                </p>
                <p>
                  It was designed from the outset with extendability and customization in mind.
                  However, it also has some neat built-in ways to communicate information to your users through the use of attributes.
                </p>
                <p>
                  Of course, V-Calendar is responsive and mobile friendly. It even responds to taps for day selection and touch swipes for navigation.
                </p>
              </div>
            </b-tab-item>
            <!--Intro Example Code-->
            <b-tab-item label='Example Code'>
              <code-block :code='exIntroCode'></code-block>
            </b-tab-item>
            <!--Intro Options-->
            <b-tab-item label='Options' icon='gear'>
              <b-field>
                <b-switch v-model='isDoublePaned'>Double Paned</b-switch>
              </b-field>
              <b-field label='Title Position'>
                <p class='control'>
                  <b-radio v-model='titlePosition' native-value='left'>Left</b-radio>
                  <b-radio v-model='titlePosition' native-value=''>Center</b-radio>
                  <b-radio v-model='titlePosition' native-value='right'>Right</b-radio>
                </p>
              </b-field>
              <b-field label='Title Transition'>
                <p class='control'>
                  <b-radio v-model='titleTransition' native-value='none'>None</b-radio>
                  <b-radio v-model='titleTransition' native-value='slide'>Slide</b-radio>
                  <b-radio v-model='titleTransition' native-value='fade'>Fade</b-radio>
                </p>
              </b-field>
              <b-field label='Weeks Transition'>
                <p class='control'>
                  <b-radio v-model='weeksTransition' native-value='none'>None</b-radio>
                  <b-radio v-model='weeksTransition' native-value='slide'>Slide</b-radio>
                  <b-radio v-model='weeksTransition' native-value='fade'>Fade</b-radio>
                </p>
              </b-field>
              <br />
              <b-field>
                <p class='is-size-7'><strong>Note:</strong> Not all options available are displayed</p>
              </b-field>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class='column'>
          <div class='example-container'>
            <ex-intro
              :is-double-paned='isDoublePaned'
              :title-position='titlePosition'
              :title-transition='titleTransition'
              :weeks-transition='weeksTransition'>
            </ex-intro>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ExIntro from '../examples/ExIntro';
import ExIntroCode from '!!raw-loader!../examples/ExIntro';

export default {
  components: {
    ExIntro,
  },
  props: {
  },
  data() {
    return {
      exIntroCode: ExIntroCode,
      isDoublePaned: true,
      titlePosition: '',
      titleTransition: 'slide',
      weeksTransition: 'slide',
    };
  },
};
</script>
