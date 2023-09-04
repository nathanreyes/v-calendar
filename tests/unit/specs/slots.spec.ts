import { Calendar, DatePicker } from '@/components';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { getDayContentClass } from './utils';

describe.each([
  { component: Calendar, name: 'Calendar' },
  { component: DatePicker, name: 'DatePicker' },
])('$name :slots', ({ component, name }: { component: any; name: string }) => {
  it(':renders the day-content slot', () => {
    const wrapper = mount(component, {
      props: {
        initialPage: { month: 1, year: 2000 },
      },
      slots: {
        'day-content': ({ day }) =>
          h('div', { class: `custom-day-${day.day}` }, day.day),
      },
    });
    expect(wrapper.find('.id-2000-01-15 .custom-day-15').exists()).toBe(true);
  });

  it(':renders the day-popover slot', async () => {
    const popoverDate = new Date(2000, 0, 15);
    const wrapper = mount(component, {
      props: {
        initialPage: { month: 1, year: 2000 },
        attributes: [{ dates: [popoverDate], popover: true }],
      },
      slots: {
        'day-popover': ({ dayTitle }: { dayTitle: string }) =>
          h('div', { class: 'custom-day-popover' }, dayTitle),
      },
    });
    const dayContent = wrapper.find(
      getDayContentClass(wrapper.vm, popoverDate),
    );
    await dayContent.trigger('click');
    expect(wrapper.find('.custom-day-popover').exists()).toBe(true);
  });

  it(':renders the footer slot', () => {
    const wrapper = mount(component, {
      slots: {
        footer: () => h('span', { class: 'custom-footer' }, 'Test footer'),
      },
    });
    expect(wrapper.find('.custom-footer').exists()).toBe(true);
  });

  it(':renders the header-title-wrapper slot', () => {
    const wrapper = mount(component, {
      props: {
        initialPage: { month: 1, year: 2000 },
      },
      slots: {
        'header-title-wrapper': () =>
          h('span', { class: `custom-header-title-wrapper` }, 'Wrapper'),
      },
    });

    expect(
      wrapper.find('.vc-header .custom-header-title-wrapper').exists(),
    ).toBe(true);
  });

  it(':renders the header-title slot', () => {
    const wrapper = mount(component, {
      props: {
        initialPage: { month: 1, year: 2000 },
      },
      slots: {
        'header-title': ({ title }) =>
          h('span', { class: `custom-header-title` }, title),
      },
    });

    expect(wrapper.find('.vc-header .custom-header-title').exists()).toBe(true);
    expect(wrapper.find('.vc-header .custom-header-title').text()).toEqual(
      'January 2000',
    );
  });

  it(':renders the header-prev-button slot', () => {
    const wrapper = mount(component, {
      slots: {
        'header-prev-button': () =>
          h('span', { class: `custom-header-prev-button` }, 'P'),
      },
    });
    expect(wrapper.find('.vc-header .custom-header-prev-button').exists()).toBe(
      true,
    );
  });

  it(':renders the header-next-button slot', () => {
    const wrapper = mount(component, {
      slots: {
        'header-next-button': () =>
          h('span', { class: `custom-header-next-button` }, 'N'),
      },
    });
    expect(wrapper.find('.vc-header .custom-header-next-button').exists()).toBe(
      true,
    );
  });

  it(':renders the nav-prev-button slot', async () => {
    const wrapper = mount(component, {
      slots: {
        'nav-prev-button': () =>
          h('span', { class: `custom-nav-prev-button` }, 'P'),
      },
    });
    const titleButton = wrapper.find('.vc-title');
    await titleButton.trigger('click');
    expect(
      wrapper.find('.vc-nav-header .custom-nav-prev-button').exists(),
    ).toBe(true);
  });

  it(':renders the nav-next-button slot', async () => {
    const wrapper = mount(component, {
      slots: {
        'nav-next-button': () =>
          h('span', { class: `custom-nav-next-button` }, 'P'),
      },
    });
    const titleButton = wrapper.find('.vc-title');
    await titleButton.trigger('click');
    expect(
      wrapper.find('.vc-nav-header .custom-nav-next-button').exists(),
    ).toBe(true);
  });

  it(':renders the page slot', () => {
    const wrapper = mount(component, {
      slots: {
        page: ({ page }) => h('div', { class: 'custom-page' }, page.id),
      },
    });
    expect(wrapper.find('.custom-page').exists()).toBe(true);
  });

  if (name === 'DatePicker') {
    it(':renders the time-header slot', () => {
      const wrapper = mount(component, {
        props: { mode: 'dateTime' },
        slots: {
          ['time-header']: () => h('div', { class: 'custom-time-header' }),
        },
      });
      expect(wrapper.find('.custom-time-header').exists()).toBe(true);
    });
  }
});
