import Calendar from '@/components/Calendar/Calendar.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { testNavigationProps } from './navigation';
import { testMoveMethods } from './navigation';

describe('Calendar', () => {
  describe(':props', () => {
    testNavigationProps(props => mount(Calendar, { props }));
  });

  describe(':methods', () => {
    testMoveMethods(props => mount(Calendar, { props }));
  });
});
