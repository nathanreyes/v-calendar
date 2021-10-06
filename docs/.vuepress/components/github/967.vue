<template>
  <div class="flex flex-col items-start w-full">
    <label for="visible">
      <input id="visible" type="checkbox" v-model="visible" />
      Visible
    </label>
    <div>Count: {{ count }}</div>
    <button v-if="!running" @click="startTest()">Start Test</button>
    <button v-else @click="stopTest()">Stop Test</button>
    <v-date-picker v-if="visible" v-model="date" mode="datetime" />
    <v-calendar v-if="visible" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Memory issue?',
  data() {
    return {
      visible: true,
      count: 0,
      running: false,
      date: new Date(),
    };
  },
  methods: {
    startTest() {
      this.running = true;
      this.count = 0;
      this.test = setInterval(() => {
        this.visible = !this.visible;
        if (this.visible) this.count++;
      }, 500);
    },
    stopTest() {
      this.running = false;
      clearInterval(this.test);
    },
  },
};
</script>
