import { shallowMount } from '@vue/test-utils';
import Grid from '@/components/Grid';

describe('Grid', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Grid);
  });

  describe(':props', () => {
    it(':rows - renders specified number of rows', async () => {
      await wrapper.setProps({ rows: 3 });

      expect(wrapper.findAll('.vc-grid-cell').length).toBe(3);

      expect(wrapper.find('.vc-grid-cell-row-1').exists()).toBe(true);
      expect(wrapper.find('.vc-grid-cell-row-2').exists()).toBe(true);
      expect(wrapper.find('.vc-grid-cell-row-3').exists()).toBe(true);

      expect(wrapper.findAll('.vc-grid-cell-col-1').length).toBe(3);
    });

    it(':columns - renders specified number of columns', async () => {
      await wrapper.setProps({ columns: 3 });

      expect(wrapper.findAll('.vc-grid-cell').length).toBe(3);

      expect(wrapper.find('.vc-grid-cell-col-1').exists()).toBe(true);
      expect(wrapper.find('.vc-grid-cell-col-2').exists()).toBe(true);
      expect(wrapper.find('.vc-grid-cell-col-3').exists()).toBe(true);

      expect(wrapper.findAll('.vc-grid-cell-row-1').length).toBe(3);
    });

    it(':autofit - if true, sets auto-fit', async () => {
      await wrapper.setProps({ autofit: true });

      expect(wrapper.html()).toContain('repeat(auto-fit, 1fr)');
    });

    it(':autofit - if false, repeats number of columns', async () => {
      await wrapper.setProps({ columns: 2, autofit: false });

      expect(wrapper.html()).toContain('repeat(2, 1fr)');
    });

    it(':columnWidth - sets column width', async () => {
      await wrapper.setProps({ columnWidth: '2fr' });

      expect(wrapper.html()).toContain('repeat(1, 2fr)');
    });
  });
});
