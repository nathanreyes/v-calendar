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
          <option
            v-for="issue in issues"
            :key="issue.componentName"
            :value="issue"
            >{{ `${issue.componentName}: ${issue.componentTitle}` }}</option
          >
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
      <component
        v-if="selectedIssue"
        :is="`github-${selectedIssue.componentName}`"
      />
    </div>
  </div>
</template>

<script>
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the base components directory
  '../github',
  // Do not look in subdirectories
  false,
);
// For each matching file name...
const issues = requireComponent
  .keys()
  .filter(
    filename =>
      /.vue$/.test(filename) &&
      !filename.endsWith('Template.vue') &&
      !filename.endsWith('index.vue'),
  )
  .map(filename => {
    // Get the component
    const component = requireComponent(filename);
    // Get the PascalCase version of the component name
    const componentName = filename
      // Remove the "./" from the beginning
      .replace(/^\.\//, '')
      // Remove the file extension from the end
      .replace(/\.\w+$/, '');
    return {
      componentName,
      componentTitle: component.default.githubTitle,
    };
  });

export default {
  data() {
    return {
      issues,
      selectedIssue: issues[issues.length - 1],
    };
  },
  watch: {
    selectedIssue(val) {
      if (val) {
        localStorage.githubIssue = this.selectedIssue.componentName;
      }
    },
  },
  mounted() {
    const issue = localStorage.githubIssue;
    if (issue) {
      this.selectedIssue = issues.find(i => i.componentName === issue);
    }
  },
};
</script>
