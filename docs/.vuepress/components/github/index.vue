<template>
  <div>
    <div class="w-full flex items-baseline px-3">
      <label
        class="w-24 block uppercase tracking-wide text-gray-700 text-xs text-right font-bold mr-2"
        for="issue"
        >Issue:</label
      >
      <div class="flex-grow relative">
        <select
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="issue"
          v-model="selectedIssue"
        >
          <option v-for="issue in issues" :key="issue.number" :value="issue">{{
            `${issue.number} - ${issue.title}`
          }}</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="example">
      <component :is="selectedIssue.component" />
    </div>
  </div>
</template>

<script>
import issues from './issues.json';

export default {
  data() {
    const maxNumber = issues.map(i => i.number).sort((a, b) => a - b)[
      issues.length - 1
    ];
    return {
      selectedIssue: issues.find(i => i.number === maxNumber),
      issues,
    };
  },
};
</script>
