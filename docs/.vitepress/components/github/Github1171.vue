<template>
  <div class="flex items-center gap-4">
    <label for="one-way"
      ><input
        id="one-way"
        class="mr-1"
        type="radio"
        :value="true"
        v-model="oneWay"
      />One way</label
    >
    <label for="round-trip"
      ><input
        id="round-trip"
        class="mr-1"
        type="radio"
        :value="false"
        v-model="oneWay"
      />
      Round trip</label
    >
  </div>
  <div class="mt-4">
    {{ date }}
  </div>
  <div class="mt-4">
    <VDatePicker v-model="date" :model-modifiers="modifiers" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const date = ref();
const oneWay = ref(true);

const modifiers = computed(() => ({
  range: !oneWay.value,
}));
</script>
