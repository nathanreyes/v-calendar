import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { expect, it, describe } from 'vitest';
import { Calendar, DatePicker } from '@/components';

describe.each([
  { component: Calendar, name: 'Calendar' },
  { component: DatePicker, name: 'DatePicker' },
])('$name :slots', ({ component }: { component: any }) => {
  it(':renders the day-content slot', async () => {
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
  it(':renders the header-title slot', async () => {
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
  it(':renders the header-prev-button slot', async () => {
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
  it(':renders the header-next-button slot', async () => {
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
});
