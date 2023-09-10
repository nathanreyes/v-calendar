import Calendar from '@/components/Calendar/Calendar.vue';
import { mount } from '@vue/test-utils';
import { describe } from 'vitest';
import { testNavigationMethods, testNavigationProps } from './navigation';
import { testCalendarSlots } from './slots';

describe('Calendar', () => {
  describe(':props', () => {
    testNavigationProps(ctx => mount(Calendar, ctx));
  });

  describe(':methods', () => {
    testNavigationMethods(ctx => mount(Calendar, ctx));
  });

  describe(':slots', () => {
    testCalendarSlots(ctx => mount(Calendar, ctx));
  });
});
