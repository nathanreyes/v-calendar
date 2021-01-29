<template>
  <div class="grid gap-x-6 gap-y-8 sm:grid-cols-2 mt-6">
    <flatlogic-template
      v-for="template in templates"
      :key="template.targetUrl"
      v-bind="template"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      templates: [
        {
          targetUrl: 'https://flatlogic.com/templates/sing-app-vue-dashboard',
          imgUrl:
            'https://flatlogic.com/assets/templates/sing_vue_full-2acf74b95004f96202c570c128770ab23a923e6f09b6672ab76365492f2287db.png',
          title: 'Sing App Vue',
          subtitle: 'Vue Admin Dashboard Template',
        },
        {
          targetUrl: 'https://flatlogic.com/templates/sing-app-vue-node-js',
          imgUrl:
            'https://flatlogic.com/assets/templates/sing_vue_full_nodejs-1dd78e278f16be02576ccaf1d9603a327c17689bb2ac90c9458b6a923e712920.png',
          title: 'Sing App Vue Node.js',
          subtitle: 'Vue Admin Dashboard Template with Node.js Backend',
        },
        {
          targetUrl:
            'https://flatlogic.com/templates/vue-material-template-full',
          imgUrl:
            'https://flatlogic.com/assets/templates/vue_material_full-25bf27297f7022c202807764f053691fbc52362fc80ffac8b98fa88cb6616730.png',
          title: 'Vue Material Template Full',
          subtitle: 'Premium Vue Material Admin Dashboard Template downloads',
        },
        {
          targetUrl:
            'https://flatlogic.com/templates/vue-material-template-nodejs',
          imgUrl:
            'https://flatlogic.com/assets/templates/vue_material_full_nodejs-f1fa24aa5f3719a07968d18345e76d9276bcde78014368396a7bb55e10efe0d3.png',
          title: 'Vue Material Template Node.js',
          subtitle:
            'Premium Vue Material Template and Theme with Node.js Backend',
        },
        {
          targetUrl: 'https://flatlogic.com/templates/light-blue-vue',
          imgUrl:
            'https://flatlogic.com/assets/templates/light_blue_vue_full-e044d30242912d5756b190e576bf30ea967b725c09d2e371a7eabf1c6a9c33b2.webp',
          title: 'Light Blue Vue',
          subtitle: 'Vue Admin Dashboard Template',
        },
        {
          targetUrl: 'https://flatlogic.com/templates/light-blue-vue-node-js',
          imgUrl:
            'https://flatlogic.com/assets/templates/light_blue_vue_full_nodejs-06f941c849f0a83a3c0d38c728101eace06a7515ea048f12bcd91f165280246f.webp',
          title: 'Light Blue Vue Node.js',
          subtitle: 'Vue Admin Template with Node.JS Backend',
        },
      ],
    };
  },
};
</script>
