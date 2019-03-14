<script>
export default {
  render(h) {
    // Grid cell renderer
    const getCell = ({ position, row, column }) => {
      // Get the default slot first
      if (this.$slots.default && this.$slots.default.length >= position) {
        return this.$slots.default[position - 1];
      }
      // Get the scoped slot second
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default({
          position,
          row,
          column,
        });
      }
      return null;
    };

    // Grid cells renderer
    const getCells = () => {
      const cells = [];
      for (let r = 1, p = 1; r <= this.rows; r++) {
        for (let c = 1; c <= this.columns; c++) {
          // Actually add the cell components
          cells.push(
            h(
              'div',
              {
                class: 'c-grid-cell',
                style: {
                  'grid-row': r,
                  'grid-column': c,
                },
              },
              [getCell({ position: p++, row: r, column: c })],
            ),
          );
        }
      }
      return cells;
    };

    return h(
      'div',
      {
        class: 'vc-grid-container',
        style: this.containerStyle,
      },
      [...getCells()],
    );
  },
  props: {
    count: Number,
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    autofit: Boolean,
    gap: String,
    innerBorderClass: String,
    columnWidth: {
      type: String,
      default: '1fr',
    },
  },
  computed: {
    containerStyle() {
      return {
        gridTemplateColumns: this.gridTemplateColumns,
      };
    },
    gridTemplateColumns() {
      return `repeat(${this.autofit ? 'auto-fit' : this.columns}, ${
        this.columnWidth
      })`;
    },
  },
};
</script>

<style scoped>
.vc-grid-container {
  position: relative;
  flex-shrink: 1;
  display: grid;
}
</style>
