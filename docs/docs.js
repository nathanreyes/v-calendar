import Vue from 'vue';
import Buefy from 'buefy';
import hljs from 'highlight.js';
import VueClipboard from 'vue-clipboard2';
import VCalendar from '../src/lib';
import App from './App';
import router from './router';
import CodeBlock from './components/blocks/CodeBlock';
import './styles/app.scss';

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Buefy, {
  defaultIconPack: 'fa',
});
Vue.use(VCalendar, {
  locale: 'ru',
});
Vue.component('CodeBlock', CodeBlock);
Vue.directive('highlight', {
  deep: true,
  bind(el, binding) {
    // On first bind, highlight all targets
    const targets = el.querySelectorAll('code');
    targets.forEach((target) => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      if (binding.value) {
        target.innerHTML = binding.value;
      }
      hljs.highlightBlock(target);
    });
  },
  componentUpdated(el, binding) {
    // After an update, re-fill the content and then highlight
    const targets = el.querySelectorAll('code');
    targets.forEach((target) => {
      if (binding.value) {
        target.innerHTML = binding.value;
        hljs.highlightBlock(target);
      }
    });
  },
});

Vue.filter('pre', (text) => {
  if (!text) return undefined;
  // Remove first blank line
  text = text.replace(/^\s*[\r\n]/g, '');
  // Find how many whitespaces before the first character of the first line
  const whitespaces = /^[ \t]*./.exec(text).toString().slice(0, -1);
  // Replace first occurrance of whitespace on each line
  let newText = [];
  text.split(/\r\n|\r|\n/).forEach((line) => {
    newText.push(line.replace(whitespaces, ''));
  });
  newText = newText.join('\r\n');
  return newText;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
