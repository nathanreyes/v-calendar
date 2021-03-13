<template>
  <div>
    <div class="flex mb-2">
      <div>
        <input id="iso" type="checkbox" v-model="isIso" />
        <label for="iso">ISO</label>
      </div>
    </div>
    <div class="flex mb-2">
      <div>
        <input type="radio" id="left" value="left" v-model="showWeeknumbers" />
        <label for="left">Left</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="left-outside"
          value="left-outside"
          v-model="showWeeknumbers"
        />
        <label for="left-outside">Left Outside</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="right"
          value="right"
          v-model="showWeeknumbers"
        />
        <label for="right">Right</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="right-outside"
          value="right-outside"
          v-model="showWeeknumbers"
        />
        <label for="right-outside">Right Outside</label>
      </div>
    </div>
    <div>
      <v-calendar
        :from-page="fromPage"
        :show-weeknumbers="!isIso && showWeeknumbers"
        :show-iso-weeknumbers="isIso && showWeeknumbers"
      />
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: 'Support for weeknumbers',
  data() {
    return {
      isIso: false,
      fromPage: { month: 8, year: 2021 },
      showWeeknumbers: 'left',
    };
  },
};
</script>
