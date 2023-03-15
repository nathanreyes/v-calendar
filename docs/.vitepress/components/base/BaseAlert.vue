<template>
  <div
    class="flex items-start p-4 text-sm rounded-md space-x-3 my-6 custom-block not-prose"
    :class="theme.wrapperClass"
  >
    <component
      :is="theme.icon"
      class="flex-shrink-0 w-5 h-5"
      :class="theme.iconClass"
    />
    <div class="flex-grow flex flex-col space-y-2">
      <div
        v-if="!hideTitle"
        class="font-display font-bold"
        :class="theme.titleClass"
      >
        {{ title || theme.title }}
      </div>
      <div
        v-if="$slots.default"
        class="font-medium mt-0 mb-0 p-0 leading-relaxed"
        :class="theme.slotClass"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  info?: boolean;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  title?: string;
  hideTitle?: boolean;
}>();

const theme = computed(() => {
  if (props.success) {
    return {
      icon: 'IconCheckCircle',
      title: 'Success',
      wrapperClass:
        'bg-green-50 border border-green-200 dark:bg-gray-700 dark:border-green-500',
      iconClass: 'text-green-600 dark:text-green-400',
      titleClass: 'text-green-700 dark:text-green-400',
      slotClass: 'text-green-600 dark:text-green-200',
    };
  } else if (props.warning) {
    return {
      icon: 'IconAlertTriangle',
      title: 'Warning',
      wrapperClass:
        'bg-yellow-50 border border-yellow-200 dark:bg-gray-700 dark:border-yellow-500',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      titleClass: 'text-yellow-700 dark:text-yellow-400',
      slotClass: 'text-yellow-600 dark:text-yellow-200',
    };
  } else if (props.error) {
    return {
      icon: 'IconXOctagon',
      title: 'Error',
      wrapperClass:
        'bg-red-50 border border-red-200 dark:bg-gray-700 dark:border-red-500',
      iconClass: 'text-red-600 dark:text-red-400',
      titleClass: 'text-red-700 dark:text-red-400',
      slotClass: 'text-red-600 dark:text-red-200',
    };
  } else {
    return {
      icon: 'IconInfo',
      title: 'Tip',
      wrapperClass:
        'bg-blue-50 border border-blue-200 dark:bg-gray-700 dark:border-blue-500',
      iconClass: 'text-blue-600 dark:text-blue-400',
      titleClass: 'text-blue-700 dark:text-blue-400',
      slotClass: 'text-blue-600 dark:text-blue-200',
    };
  }
});
</script>
